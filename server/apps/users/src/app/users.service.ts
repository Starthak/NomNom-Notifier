import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import {
  ActivationDto,
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
  SellerDto,
  UpdateDto,
} from './dto/user.dto';
import { PrismaService } from '../../prisma/Prisma.service';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { EmailService } from './email/email.service';
import { TokenSender } from './utils/sendToken';
import { Seller, User } from '@prisma/client';
import { FavIDs, LoginResponse, UpdateResponse } from './types/user.types';

interface UserData {
  name: string;
  email: string;
  password: string;
  phoneNumber: number;
  isPremium: boolean;
  favoriteIds: string[];
}

interface SellerData {
  name: string;
  email: string;
  password: string;
  phoneNumber: number;
  GST: string;
  accountNumber: string;
  bankName: string;
  IFSC: string;
  isPremium: boolean;
}

@Injectable()
export class UsersService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) { }

  //register user
  async register(registerDto: RegisterDto, response: Response) {
    const { name, email, password, phoneNumber, isPremium, favoriteIds } = registerDto;

    //checking wether user mail exist or not
    const isEmailExist = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    const query = JSON.stringify({
      query: `query {
        VerifySeller(email: "${email}")
      }`,
    });

    const res = await fetch(`http://localhost:4003/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Optionally, you might need an authorization header or other headers
      },
      body: query,
    });

    const { data } = await res.json();

    if (isEmailExist || data.VerifySeller) {
      throw new BadRequestException('Email already Exist');
    }

    const phoneNumberExist = await this.prisma.user.findUnique({
      where: {
        phoneNumber,
      },
    });

    if (phoneNumberExist) {
      throw new BadRequestException('Phone number already Exist');
    }

    //creating Hashed Password
    const hashedPassword = await bcrypt.hash(password, 15);

    const user = {
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      isPremium,
      favoriteIds
    };

    const activationToken = await this.createActivationToken(user);

    const activationCode = activationToken.activationCode;
    const activation_token = activationToken.token;

    await this.emailService.sendMail({
      email,
      subject: 'Activate Your Account',
      template: './activation-mail',
      name,
      activationCode,
    });

    return { activation_token, response };
  }


  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  async sellerRegister(sellerDto: SellerDto, response: Response) {
    const { name, email, password, phoneNumber, isPremium, GST, accountNumber, bankName, IFSC } = sellerDto;

    //checking wether user mail exist or not
    const isEmailExist = await this.prisma.seller.findUnique({
      where: {
        email,
      },
    });

    if (isEmailExist) {
      throw new BadRequestException('Email already Exist');
    }

    const phoneNumberExist = await this.prisma.seller.findUnique({
      where: {
        phoneNumber,
      },
    });

    if (phoneNumberExist) {
      throw new BadRequestException('Phone number already Exist');
    }

    //creating Hashed Password
    const hashedPassword = await bcrypt.hash(password, 15);

    const user = {
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      isPremium,
      GST,
      accountNumber,
      IFSC,
      bankName
    };

    const activationToken = await this.createSellerActivationToken(user);

    const activationCode = activationToken.activationCode;
    const activation_token = activationToken.token;

    await this.emailService.sendMail({
      email,
      subject: 'Activate Your Account',
      template: './activation-mail',
      name,
      activationCode,
    });

    return { activation_token, response };
  }
  async createSellerActivationToken(user: SellerData) {
    //creating 4 digit otp
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const token = this.jwtService.sign(
      {
        user,
        activationCode,
      },
      {
        secret: this.configService.get<string>('ACTIVATION_TOKEN'),
        expiresIn: '48h',
      },
    );
    return { token, activationCode };
  }

  //activation seller
  async activateSeller(activationDto: ActivationDto, resposne: Response) {
    const { activationToken, activationCode } = activationDto;

    const newUser: { user: SellerData; activationCode: string } =
      this.jwtService.verify(activationToken, {
        secret: this.configService.get<string>('ACTIVATION_TOKEN'),
      } as JwtVerifyOptions) as { user: SellerData; activationCode: string };

    if (newUser.activationCode !== activationCode) {
      throw new BadRequestException('Activation Code is Invalid');
    }

    const { name, email, password, phoneNumber, isPremium, GST, accountNumber, bankName, IFSC } = newUser.user;
    //const favoriteIds:string[] = [];
    const existingUser = await this.prisma.seller.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      throw new BadRequestException('User already Registered with this email');
    }

    const user = await this.prisma.seller.create({
      data: {
        name,
        email,
        password,
        phoneNumber,
        isPremium,
        GST,
        accountNumber,
        IFSC,
        bankName
      },
    });
    return { user, resposne };
  }



  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  async update(id: string, updateUserDto: UpdateDto, response: Response) {
    try {
      const userToUpdate: User | null = await this.findOne(id);

      if (!userToUpdate) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      const updatedUser: User = await this.prisma.user.update({ where: { id }, data: updateUserDto });

      return { user: updatedUser, response };
    } catch (error) {
      throw new BadRequestException(`Could not update User: ${error.message}`);
    }
  }

  async createActivationToken(user: UserData) {
    //creating 4 digit otp
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const token = this.jwtService.sign(
      {
        user,
        activationCode,
      },
      {
        secret: this.configService.get<string>('ACTIVATION_TOKEN'),
        expiresIn: '48h',
      },
    );
    return { token, activationCode };
  }

  //activation user
  async activateUser(activationDto: ActivationDto, resposne: Response) {
    const { activationToken, activationCode } = activationDto;

    const newUser: { user: UserData; activationCode: string } =
      this.jwtService.verify(activationToken, {
        secret: this.configService.get<string>('ACTIVATION_TOKEN'),
      } as JwtVerifyOptions) as { user: UserData; activationCode: string };

    if (newUser.activationCode !== activationCode) {
      throw new BadRequestException('Activation Code is Invalid');
    }

    const { name, email, password, phoneNumber, isPremium, favoriteIds } = newUser.user;
    //const favoriteIds:string[] = [];
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      throw new BadRequestException('User already Registered with this email');
    }

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password,
        phoneNumber,
        isPremium,
        favoriteIds
      },
    });
    return { user, resposne };
  }

  //Login User
  async Login(loginDto: LoginDto): Promise<LoginResponse> {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    //comparing whith hash password
    const comapredPassword = await bcrypt.compare(password, user.password);

    if (user && comapredPassword) {
      const tokenSender = new TokenSender(this.configService, this.jwtService);
      return tokenSender.sendToken(user);
    } else {
      return {
        user: null,
        accessToken: null,
        refreshToken: null,
        error: {
          message: 'Credentials are invalid',
        },
      };
    }
  }

  //genrating forgot password link
  async generateForgotPasswordLink(user: User) {
    const forgotPasswordToken = this.jwtService.sign(
      {
        user,
      },
      {
        secret: this.configService.get<string>('FORGOT_PASSWORD_SECRET'),
        expiresIn: '5m',
      },
    );
    return forgotPasswordToken;
  }

  //Forgot Password
  async ForgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new BadRequestException('User with Email id does not exist');
    }

    const forgotPasswordToken = await this.generateForgotPasswordLink(user);

    const resetPasswordUrl =
      this.configService.get<string>('CLIENT_SIDE_URI') +
      `/reset-password?verify=${forgotPasswordToken}`;

    await this.emailService.sendMail({
      email,
      subject: 'Reset your Password',
      template: './forgot-password',
      name: user.name,
      activationCode: resetPasswordUrl,
    });

    return { message: 'Your Forgot password request successful' };
  }

  //Reset Password
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { password, activationToken } = resetPasswordDto;

    const decode = await this.jwtService.decode(activationToken);

    if (!decode || decode?.exp * 1000 < Date.now()) {
      throw new BadRequestException('Invalid Token');
    }

    const hashedPassword = await bcrypt.hash(password, 15);

    const user = this.prisma.user.update({
      where: {
        id: decode.user.id,
      },
      data: {
        password: hashedPassword,
      },
    });
    return { user };
  }

  //Logged In User
  async loginUser(req: any) {
    const user = req.user;
    const refreshToken = req.refreshtoken;
    const accessToken = req.accesstoken;
    return { user, refreshToken, accessToken };
  }

  //Logout User
  async logoutUser(req: any) {
    req.user = null;
    req.refreshtoken = null;
    req.accessToken = null;

    return { message: 'Logged out Successfully!' };
  }

  async findOne(id: string): Promise<User> {
    try {
      const user: User | null = await this.prisma.user.findUnique({
        where: {
          id,
        },
      });

      if (!user) {
        throw new NotFoundException(`user with ID ${id} not found`);
      }

      return user;
    } catch (error) {
      throw new BadRequestException(`Could not fetch user: ${error.message}`);
    }
  }
  async getUserByEmail(email: string): Promise<User> {
    try {
      const user: User | null = await this.prisma.user.findUnique({
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

  //get all user Service
  async getUsers() {
    return this.prisma.user.findMany({});
  }
  async getPremiumUsers(): Promise<LimitedUserData[]> {
    const premiumUsers = await this.prisma.user.findMany({
      where: { isPremium: true },
      select: { id: true, isPremium: true },
    });
    return premiumUsers;
  }
  async getBasicUsers(): Promise<LimitedUserData[]> {
    const BasicUsers = await this.prisma.user.findMany({
      where: { isPremium: false },
      select: { id: true, isPremium: true },
    });
    return BasicUsers;
  }
  async getFavoriteIds(id: string): Promise<string[]> {
    const favIds = await this.prisma.user.findUnique({
      where: { id: id },
      select: { favoriteIds: true },
    });
    return favIds.favoriteIds;
  }
  async userExist(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return !!user;
  }
}
export interface LimitedUserData {
  id: string;
  isPremium: boolean;
}
