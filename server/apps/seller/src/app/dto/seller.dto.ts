import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

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
  @IsNotEmpty({ message: 'Enter GST Number' })
  gstNumber: string;

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
  address: string;

}

@InputType()
export class LoginDto{
    @Field()
    @IsNotEmpty({message: "Enter Email"})
    email: string;

    @Field()
    @IsNotEmpty({message: "Enter Password"})
    password: string;
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