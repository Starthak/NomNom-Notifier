import { getServerSession } from "next-auth/next"

import { authOptions } from "@/pages/api/auth/[...nextauth]";
import prisma from "@/app/libs/prismadb";
import axios from "axios";

export async function getSession() {
  return await getServerSession(authOptions)
}

export default async function getCurrentUser() {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return null;
    }
    const { data: getUserByEmail } = await axios.post(
      `http://localhost:4001/graphql`, {
      query: `query GetUserByEmail {
          getUserByEmail(email: "${session.user.email}") {
          id
          name
          email
          password
          createdAt
          updatedAt
          isPremium
          favoriteIds
        }
      }`
    }
    )
    const currentUser = getUserByEmail.data.getUserByEmail;

    // const currentUser = await prisma.user.findUnique({
    //   where: {
    //     email: session.user.email as string,
    //   }
    // });

    if (!currentUser) {
      return null;
    }
    //console.log(currentUser);
    return {
      ...currentUser,
      // createdAt: currentUser.createdAt.toISOString(),
      // updatedAt: currentUser.updatedAt.toISOString(),
      // emailVerified:
      // currentUser.emailVerified?.toISOString() || null,
    };
  } catch (error: any) {
    return null;
  }
}

