import { Args, Context, Mutation, Resolver, Query } from '@nestjs/graphql';
import { SellerService } from './seller.service';
import { ActivationResponse, LoginResponse, LogoutResponse, RegisterResponse } from './types/seller.types';
import { ActivationDto, RegisterDto } from './dto/seller.dto';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { Seller } from './entites/seller.entity';
import { AuthGuard } from './guards/auth.guard';

@Resolver('Seller')
export class SellerResolver {
  constructor(private readonly sellerService: SellerService) {}

  @Mutation(() => RegisterResponse)
  async register(
    @Args('registerDto') registerDto: RegisterDto,
    @Context() context: { res: Response }
  ): Promise<RegisterResponse> {
    if (
      !registerDto.name ||
      !registerDto.email ||
      !registerDto.password ||
      !registerDto.phoneNumber ||
      !registerDto.address ||
      !registerDto.gstNumber ||
      !registerDto.bankName ||
      !registerDto.accountNumber ||
      !registerDto.IFSC
    ) {
      throw new BadRequestException('Please Fill All Fields');
    }

    const { activation_token } = await this.sellerService.register(
      registerDto,
      context.res
    );
    return { activation_token };
  }

  @Mutation(() => ActivationResponse)
  async activateUser(
    @Args('activationDto') activationDto: ActivationDto,
    @Context() context: { res: Response }
  ): Promise<ActivationResponse> {
    return await this.sellerService.activateUser(activationDto, context.res)
  }

  @Mutation(() => LoginResponse)
  async Login(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<LoginResponse> {
    return await this.sellerService.Login({ email, password });
  }

  @Query(() => LoginResponse)
  @UseGuards(AuthGuard)
  async loginSeller(@Context() context: { req: Request }) {
    return await this.sellerService.loginSeller(context.req);
  }

  @Query(() => Boolean)
  async VerifySeller(@Args('email') email: string) {
    return await this.sellerService.sellerExist(email);
  }

  @Query(() => LogoutResponse)
  @UseGuards(AuthGuard)
  async logoutSeller(@Context() context: { req: Request }) {
    return await this.sellerService.logoutSeller(context.req);
  }

  @Query(() => Seller, { nullable: true })
  async getSellerByEmail(
    @Args('email') email: string,
  ): Promise<Seller | null> {
    return await this.sellerService.getSellerByEmail(email);
  }
 
  @Query(() => [Seller])
  async getSeller() {
    return this.sellerService.getSellers();
  }
}
