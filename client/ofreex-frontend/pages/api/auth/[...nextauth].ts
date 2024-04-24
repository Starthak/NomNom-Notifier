import bcrypt from "bcrypt"
import NextAuth, { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"

import prisma from "@/app/libs/prismadb"
import axios from "axios"

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
        role: { label: 'Role', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        let user;
        if (credentials.role === 'seller') {
          const { data: getSellerByEmail } = await axios.post(
            `http://localhost:4003/graphql`, {
            query: `query GetSellerByEmail {
              getSellerByEmail(email: "${credentials.email}") {
              id
              name
              email
              password
              phoneNumber
              gstNumber
              address
              bankName
              accountNumber
              IFSC
            }
          }`
          }
          )
          user = getSellerByEmail.data.getSellerByEmail;


          if (!user || !user?.password) {
            throw new Error('Invalid credentials');
          }
          //credentials.password = await bcrypt.hash(credentials.password, 15);
          console.log(credentials.password + "  " + user.password);
          const isCorrectPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );
          console.log("isCorrected");
          console.log(isCorrectPassword);
          if (!isCorrectPassword) {
            throw new Error('Invalid credentials');
          }
          return user;
        } else {
          const { data: getUserByEmail } = await axios.post(
            `http://localhost:4001/graphql`, {
            query: `query GetUserByEmail {
              getUserByEmail(email: "${credentials.email}") {
              id
              name
              email
              password
              createdAt
              updatedAt
              isPremium
            }
          }`
          }
          )
          const user = getUserByEmail.data.getUserByEmail;
          console.log("user")
          //console.log(user)
          if (!user || !user?.password) {
            throw new Error('Invalid credentials');
          }
          //credentials.password = await bcrypt.hash(credentials.password, 15);
          console.log(credentials.password + "  " + user.password);
          const isCorrectPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );
          console.log("isCorrected");
          console.log(isCorrectPassword);
          if (!isCorrectPassword) {
            throw new Error('Invalid credentials');
          }
          return user;
        }

      }
    })
  ],
  pages: {
    signIn: '/',
  },
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions);