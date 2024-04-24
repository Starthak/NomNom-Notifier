import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { ActivationDto, LoginDto, RegisterDto } from './dto/seller.dto';
import { Response } from 'express';
import { PrismaClient } from '../../node_modules/.prisma/client';
import * as bcrypt from 'bcrypt';
import { EmailService } from './email/email.service';
import { TokenSender } from './utils/sendToken';
import { LoginResponse } from './types/seller.types';
import { Seller } from '../../node_modules/.prisma/client';

interface SellerData {
  name: string;
  email: string;
  password: string;
  phoneNumber: number;
  address: string;
  gstNumber: string;
  accountNumber: string;
  bankName: string;
  IFSC: string;
}

@Injectable()
export class SellerService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaClient,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService
  ) {}

  //register seller
  async register(registerDto: RegisterDto, response: Response) {
    const {
      name,
      email,
      password,
      phoneNumber,
      gstNumber,
      accountNumber,
      bankName,
      IFSC,
      address,
    } = registerDto;

    const isEmailExist = await this.prisma.seller.findUnique({
      where: {
        email,
      },
    });

    const res = await fetch(`http://localhost:4001/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `query { userExist(email: "${email}") }`,
      }),
    });

    if (!res.ok) {
      // Handle non-2xx responses here
      throw new Error(`Network response was not ok: ${res.statusText}`);
    }

    const data = await res.json();

    if (isEmailExist || data.userExist) {
      throw new BadRequestException('Seller with Email already Exist');
    }

    const phoneNumberExist = await this.prisma.seller.findUnique({
      where: {
        phoneNumber,
      },
    });

    if (phoneNumberExist) {
      throw new BadRequestException('Phone number already Exist');
    }

    //for creating hashed password
    const hashedPassword = await bcrypt.hash(password, 10);

    const seller = {
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      gstNumber,
      accountNumber,
      bankName,
      IFSC,
      address,
    };

    const activationToken = await this.createActivationToken(seller);

    const activationCode = activationToken.activationCode;
    const activation_token = activationToken.token;

    await this.emailService.sendMail({
      email,
      subject: 'Activate Your Account',
      template: './seller-activation-mail',
      name,
      activationCode,
    });

    return { activation_token, response };
  }

  //activation seller
  async activateUser(activationDto: ActivationDto, resposne: Response) {
    const { activationToken, activationCode } = activationDto;

    const newSeller: { seller: SellerData; activationCode: string } =
      this.jwtService.verify(activationToken, {
        secret: this.configService.get<string>('ACTIVATION_TOKEN'),
      } as JwtVerifyOptions) as { seller: SellerData; activationCode: string };

    if (newSeller.activationCode !== activationCode) {
      throw new BadRequestException('Activation Code is Invalid');
    }

    const {
      name,
      email,
      password,
      phoneNumber,
      address,
      gstNumber,
      bankName,
      accountNumber,
      IFSC,
    } = newSeller.seller;
    const existingUser = await this.prisma.seller.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      throw new BadRequestException('User already Registered with this email');
    }

    const seller = await this.prisma.seller.create({
      data: {
        name,
        email,
        password,
        phoneNumber,
        address,
        gstNumber,
        bankName,
        accountNumber,
        IFSC,
      },
    });
    return { seller, resposne };
  }

  //activation token
  async createActivationToken(seller: SellerData) {
    //creating 4 digit otp
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const token = this.jwtService.sign(
      {
        seller,
        activationCode,
      },
      {
        secret: this.configService.get<string>('ACTIVATION_TOKEN'),
        expiresIn: '48h',
      }
    );
    return { token, activationCode };
  }

  //Login Service
  async Login(loginDto: LoginDto): Promise<LoginResponse> {
    const { email, password } = loginDto;
    const seller = await this.prisma.seller.findUnique({
      where: {
        email,
      },
    });

    //comparing whith hash password
    const comapredPassword = await bcrypt.compare(password, seller.password);
    if (seller && comapredPassword) {
      const tokenSender = new TokenSender(this.configService, this.jwtService);
      return tokenSender.sendToken(seller);
    } else {
      return {
        seller: null,
        accessToken: null,
        refreshToken: null,
        error: {
          message: 'Credentials are invalid',
        },
      };
    }
  }

  //get Loggedin seller
  async loginSeller(req: any) {
    const seller = req.user;
    const refreshToken = req.refreshtoken;
    const accessToken = req.accesstoken;
    // console.log(refreshToken);
    return { seller, refreshToken, accessToken };
  }

  //logout user
  async logoutSeller(req: any) {
    req.user = null;
    req.refreshtoken = null;
    req.accessToken = null;

    return { message: 'Logged out Successfully!' };
  }

  async getSellerByEmail(email: string): Promise<Seller> {
    try {
      const user: Seller | null = await this.prisma.seller.findUnique({
        where: { email },
      });

      if (!user) {
        throw new NotFoundException(`user with ID ${email} not found`);
      }

      return user;
    } catch (error) {
      throw new BadRequestException(`Could not fetch user: ${error.message}`);
    }
  }

  //getAll seller service
  async getSellers() {
    return this.prisma.seller.findMany({});
  }

  async sellerExist(email: string) {
    const seller = await this.prisma.seller.findUnique({
      where: {
        email,
      },
    });

    if (!seller) {
      return false;
    }
    return true;
  }
}
