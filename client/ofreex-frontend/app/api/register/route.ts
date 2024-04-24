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
  } = body;

  //const hashedPassword = await bcrypt.hash(password, 15);
  const { data: register } = await axios.post(
    `http://localhost:4001/graphql`, {
    query: `mutation register {
  register(registerDto:{
    name: "${name}",
    email: "${email}",
    password: "${password}",
    phoneNumber: ${phoneNumber},
    isPremium: false,
    favoriteIds: []
  }
  ) {
    activation_token
  }
}
`
  }
  )
  //console.log(`Regitering ${register}`);
  const { activation_token } = register.data.register;

    return NextResponse.json(activation_token);

  }catch(error){
    console.log(error);
    return NextResponse.json({ message: error }, { status: 400 })
  }
}
