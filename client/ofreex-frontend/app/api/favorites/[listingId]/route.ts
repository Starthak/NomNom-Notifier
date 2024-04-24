import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import axios from "axios";

interface IParams {
  listingId?: string;
}

export async function POST(
  request: Request,
  { params }: { params: IParams }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { listingId } = params;

  if (!listingId || typeof listingId !== 'string') {
    throw new Error('Invalid ID');
  }

  let favoriteIds = [...(currentUser.favoriteIds || [])];

  favoriteIds.push(listingId);

  const { data } = await axios.post(
    `http://localhost:4001/graphql`, {
    query: `mutation UpdateUser {
  updateUser(id: "${currentUser.id}", updateDto: {
    favoriteIds: [${favoriteIds.map(x => `"${x}"`)}]
  }) {
    user {
      id
      name
      email
      phoneNumber
      isPremium
      favoriteIds
    }
  }
}`
  }
  )
  //const user = data.getUserByEmail.data.getUserByEmail;
  currentUser.favoriteIds = favoriteIds;
  console.log(currentUser);

  return NextResponse.json("user");
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { listingId } = params;

  if (!listingId || typeof listingId !== 'string') {
    throw new Error('Invalid ID');
  }

  let favoriteIds = [...(currentUser.favoriteIds || [])];

  favoriteIds = favoriteIds.filter((id) => id !== listingId);

  const { data } = await axios.post(
    `http://localhost:4001/graphql`, {
    query: `mutation UpdateUser {
  updateUser(id: "${currentUser.id}", updateDto: {
    favoriteIds: [${favoriteIds.map(x => `"${x}"`)}]
  }) {
    user {
      id
      name
      email
      phoneNumber
      isPremium
      favoriteIds
    }
  }
}`
  }
  )
  //const user = data.getUserByEmail.data.getUserByEmail;
  currentUser.favoriteIds = favoriteIds;
  console.log(currentUser);
  return NextResponse.json("user");
}
