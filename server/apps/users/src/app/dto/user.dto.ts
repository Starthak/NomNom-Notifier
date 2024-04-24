import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

@InputType()
export class RegisterDto {
  @Field()
  @IsNotEmpty({ message: 'Name is Required' })
  @IsString({ message: 'Name just need to be one string' })
  name: string;

  @Field()
  @IsNotEmpty({ message: 'Enter Email Please' })
  @IsEmail({}, { message: 'Email is invalid' })
  email: string;

  @Field()
  @IsNotEmpty({ message: 'Enter Password' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string;

  @Field()
  @IsNotEmpty({ message: 'Enter Phone Number' })
  phoneNumber: number;

  @Field()
  @IsNotEmpty({ message: 'Enter Premium status pls' })
  isPremium: boolean;

  @Field(() => [String])
  @IsNotEmpty({ message: 'Enter favIds pls' })
  favoriteIds: string[];
}

@InputType()
export class SellerDto {
  @Field()
  @IsNotEmpty({ message: 'Name is Required' })
  @IsString({ message: 'Name just need to be one string' })
  name: string;

  @Field()
  @IsNotEmpty({ message: 'Enter Email Please' })
  @IsEmail({}, { message: 'Email is invalid' })
  email: string;

  @Field()
  @IsNotEmpty({ message: 'Enter Password' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string;

  @Field()
  @IsNotEmpty({ message: 'Enter Phone Number' })
  phoneNumber: number;

  @Field()
  @IsNotEmpty({ message: 'Enter GST Number' })
  GST: string;

  @Field()
  @IsNotEmpty({ message: 'Enter Account Number' })
  accountNumber: string;

  @Field()
  @IsNotEmpty({ message: 'Enter Bank Name' })
  bankName: string;

  @Field()
  @IsNotEmpty({ message: 'Enter IFSC Code' })
  IFSC: string;

  @Field()
  @IsNotEmpty({ message: 'Enter Premium Status' })
  isPremium: boolean;

}

@InputType()
export class UpdateDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'Name just need to be one string' })
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail({}, { message: 'Email is invalid' })
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password?: string;

  @Field({ nullable: true })
  @IsOptional()
  phoneNumber?: number;

  @Field({ nullable: true })
  @IsOptional()
  isPremium?: boolean;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  favoriteIds?: string[];
}

@InputType()
export class ActivationDto {
  @Field()
  @IsNotEmpty({ message: 'Activation Token is required!' })
  activationToken: string;

  @Field()
  @IsNotEmpty({ message: 'Activation Code is required!' })
  activationCode: string;
}

@InputType()
export class LoginDto {
  @Field()
  @IsNotEmpty({ message: 'Enter Email' })
  @IsEmail({}, { message: 'Email is Invalid' })
  email: string;

  @Field()
  @IsNotEmpty({ message: 'Enter Password' })
  password: string;
}


@InputType()
export class ForgotPasswordDto {
  @Field()
  @IsNotEmpty({ message: 'Enter Email' })
  @IsEmail({}, { message: 'Email is Invalid' })
  email: string;
}

@InputType()
export class ResetPasswordDto {
  @Field()
  @IsNotEmpty({ message: 'New Password Required' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string;

  @Field()
  @IsNotEmpty({ message: "Activation Token is Required" })
  activationToken: string
}