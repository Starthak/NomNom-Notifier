import { BadRequestException, NotFoundException, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { LimitedUserData, FavIDs, UpdateResponse, SellerResponse, SellerActivationResponse } from './types/user.types';
import { Logger } from '@nestjs/common';
import {
  ActivationResponse,
  ForgotPasswordResponse,
  LoginResponse,
  LogoutResponse,
  RegisterResponse,
  ResetPasswordResponse,
} from './types/user.types';
import { ActivationDto, ForgotPasswordDto, RegisterDto, ResetPasswordDto, SellerDto, UpdateDto } from './dto/user.dto';
import { Seller, User } from './entites/user.entity';
import { Response } from 'express';
import { AuthGuard } from './guards/auth.guard';

@Resolver('User')
// @UseFilters()
export class UsersResolver {
  constructor(private readonly userService: UsersService) { }
  @Query(() => String) // Return type is now String
  async hello(): Promise<string> {
    return 'Hello from Users Resolver!';
  }
  @Mutation(() => RegisterResponse)
  async register(
    @Args('registerDto') registerDto: RegisterDto,
    @Context() context: { res: Response },
  ): Promise<RegisterResponse> {
    if (!registerDto.name || !registerDto.email || !registerDto.password) {
      throw new BadRequestException('Please fill the all fields');
    }

    const { activation_token } = await this.userService.register(
      registerDto,
      context.res,
    );

    return { activation_token };
  }

  @Mutation(() => ActivationResponse)
  async activateUser(
    @Args('activationDto') activationDto: ActivationDto,
    @Context() context: { res: Response },
  ): Promise<ActivationResponse> {
    return await this.userService.activateUser(activationDto, context.res);
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  @Mutation(() => SellerResponse)
  async registerSeller(
    @Args('sellerDto') sellerDto: SellerDto,
    @Context() context: { res: Response },
  ): Promise<SellerResponse> {
    if (!sellerDto.name || !sellerDto.email || !sellerDto.password) {
      throw new BadRequestException('Please fill the all fields');
    }

    const { activation_token } = await this.userService.sellerRegister(
      sellerDto,
      context.res,
    );

    return { activation_token };
  }

  @Mutation(() => SellerActivationResponse)
  async activateSeller(
    @Args('activationDto') activationDto: ActivationDto,
    @Context() context: { res: Response },
  ): Promise<SellerActivationResponse> {
    return await this.userService.activateSeller(activationDto, context.res);
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  @Mutation(() => UpdateResponse)
  async updateUser(
    @Args('id') id: string,
    @Args('updateDto') updateDto: UpdateDto,
    @Context() context: { res: Response }
  ): Promise<UpdateResponse> {
    try {
      const updatedUser = await this.userService.update(id, updateDto, context.res);
      return updatedUser
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('An error occurred while updating user ' + error);
    }
  }
  @Mutation(() => LoginResponse)
  async Login(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<LoginResponse> {
    return await this.userService.Login({ email, password });
  }

  @Query(() => LoginResponse)
  @UseGuards(AuthGuard)
  async loginUser(@Context() context: { req: Request }) {
    return await this.userService.loginUser(context.req);
  }

  @Mutation(() => ForgotPasswordResponse)
  async forgotPassword(
    @Args('forgotPasswordDto') forgotPasswordDto: ForgotPasswordDto,
  ): Promise<ForgotPasswordResponse> {
    return await this.userService.ForgotPassword(forgotPasswordDto);
  }

  @Mutation(() => ResetPasswordResponse)
  async resetPassword(
    @Args('resetPasswordDto') resetPasswordDto: ResetPasswordDto,
  ): Promise<ResetPasswordResponse> {
    return await this.userService.resetPassword(resetPasswordDto);
  }

  @Query(() => LogoutResponse)
  @UseGuards(AuthGuard)
  async logoutUser(@Context() context: { req: Request }) {
    return await this.userService.logoutUser(context.req);
  }

  @Query(() => [User])
  async getUser() {
    return this.userService.getUsers();
  }

  @Query(() => Boolean)
  async userExist(@Args('email') email: string): Promise<boolean> {
    return await this.userService.userExist(email);
  }

  @Query(() => User, { nullable: true })
  async getUserById(
    @Args('id') id: string,
  ): Promise<User | null> {
    return await this.userService.findOne(id);
  }
  @Query(() => User, { nullable: true })
  async getUserByEmail(
    @Args('email') email: string,
  ): Promise<User | null> {
    return await this.userService.getUserByEmail(email);
  }

  @Query(() => Seller, { nullable: true })
  async getSellerByEmail(
    @Args('email') email: string,
  ): Promise<Seller | null> {
    return await this.userService.getSellerByEmail(email);
  }


  @Query(() => [LimitedUserData])
  async getPremiumUsers(): Promise<LimitedUserData[]> {
    try {
      Logger.log('fetching premium users:');
      const premiumUsers = await this.userService.getPremiumUsers();
      return premiumUsers;
    } catch (error) {
      // Handle errors appropriately, e.g., log the error and throw a specific exception
      console.error('Error fetching premium users:', error);
      throw new Error('An error occurred while retrieving premium users');
    }
  }
  @Query(() => [LimitedUserData])
  async getBasicUsers(): Promise<LimitedUserData[]> {
    try {
      Logger.log('fetching BasicUsers users:');
      const BasicUsers = await this.userService.getBasicUsers();
      return BasicUsers;
    } catch (error) {
      // Handle errors appropriately, e.g., log the error and throw a specific exception
      console.error('Error fetching BasicUsers users:', error);
      throw new Error('An error occurred while retrieving BasicUsers users');
    }
  }

  @Query(() => [String])
  async getFavoriteIds(
    @Args('userId') id: string
  ): Promise<string[]> {
    try {
      Logger.log('fetching FavIDs:');
      const favIds = await this.userService.getFavoriteIds(id);
      return favIds;
    } catch (error) {
      // Handle errors appropriately, e.g., log the error and throw a specific exception
      console.error('Error fetching FavIds:', error);
      throw new Error('An error occurred while retrieving favIds');
    }
  }
}
