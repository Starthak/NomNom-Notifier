import { getServerSession } from "next-auth/next"

import { authOptions } from "@/pages/api/auth/[...nextauth]";
import prisma from "@/app/libs/prismadb";
import axios from "axios";

export async function getSession() {
  return await getServerSession(authOptions)
}

export default async function getCurrentSeller() {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return null;
    }
    const { data: getSellerByEmail } = await axios.post(
      `http://localhost:4003/graphql`, {
            query: `query GetSellerByEmail {
              getSellerByEmail(email: "${session.user.email}") {
              id
              name
              email
              password
              phoneNumber
              address
              gstNumber
              accountNumber
              bankName
              IFSC
            }
          }`
    }
    )
    const currentUser = getSellerByEmail.data.getSellerByEmail;

    if (!currentUser) {
      return null;
    }
    //console.log(currentUser);
    return {
      ...currentUser,
    };
  } catch (error: any) {
    return null;
  }
}

