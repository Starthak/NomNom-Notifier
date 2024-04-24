import { Directive, Field, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@ObjectType()
@Directive('@key(fields:"id")')
export class Avatars {
  @Field()
  id: string;

  @Field()
  public_id: string;

  @Field()
  url: string;

  @Field()
  userID: string;
}

@ObjectType()
export class User {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field(() => Avatars, { nullable: true })
  avatars?: Avatars | null;

  @Field({ nullable: true })
  address: string;

  @Field({ nullable: true })
  phoneNumber: number;

  @Field()
  role: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field()
  isPremium: boolean;

  @Field(() => [String])
  favoriteIds: string[];
}
@ObjectType()
export class Seller {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;
  
  @Field({ nullable: true })
  address: string;

  @Field({ nullable: true })
  phoneNumber: number;

  @Field()
  isPremium: boolean;

  @Field()
  GST: string;

  @Field()
  accountNumber: string;

  @Field()
  bankName: string;

  @Field()
  IFSC: string;

}
