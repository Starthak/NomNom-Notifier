import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
  const body = await request.json();
  const { activationToken, activationCode } = body;
  //console.log("asdfasfasdfasdfasfasdfadfasfafa");
  const { data } = await axios.post(`http://localhost:4003/graphql`, {
    query: `mutation activateUser {
      activateUser(activationDto:{
        activationToken: "${activationToken}",
        activationCode: "${activationCode}"
      })
      {
        seller{
          name
          email
          password
          phoneNumber
          address
          gstNumber
          bankName
          IFSC
          accountNumber
        }
      }
}

`,
  });

  // const { id,
  //     name,
  //     email,
  //     password,
  //     address,
  //     phoneNumber,
  //     isPremium } = user.data.user;

  //  const user = await prisma.user.create({
  //   data: {
  //     email,
  //     name,
  //     hashedPassword,
  //   }
  // });

  return NextResponse.json(data);
}
