import { Field, ObjectType } from "@nestjs/graphql";

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
  
  @Field()
  address: string;

  @Field()
  phoneNumber: number;

  @Field()
  gstNumber: string;

  @Field()
  accountNumber: string;

  @Field()
  bankName: string;

  @Field()
  IFSC: string;

}
