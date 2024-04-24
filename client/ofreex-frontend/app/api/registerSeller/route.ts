import { NextResponse } from "next/server";

import axios from "axios";

export async function POST(
  request: Request,
) {
  try{
  const body = await request.json();
  const {
    email,
    name,
    password,
    phoneNumber,
    address,
    gstNumber,
    accountNumber,
    bankName,
    IFSC,
  } = body;
  
    const { data: register } = await axios.post(
    `http://localhost:4003/graphql`, {
    query: `mutation register {
  register(registerDto:{
    name: "${name}",
    email: "${email}",
    password: "${password}",
    phoneNumber: ${phoneNumber},
    address: "${address}",
    gstNumber: "${gstNumber}",
    accountNumber: "${accountNumber}",
    bankName: "${bankName}",
    IFSC: "${IFSC}",
  }
  ) {
    activation_token
  }
}
`
  }
  )
    // console.log(`Regitering Seller ${register}`);
    const { activation_token } = register.data.register;

    return NextResponse.json(activation_token);

  }catch(error){
    console.log(error);
    return NextResponse.json({ message: error }, { status: 400 })
  }
}
