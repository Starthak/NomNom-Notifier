import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import axios from "axios";
import getCurrentSeller from "@/app/actions/getCurrentSeller";

interface IParams {
  listingId?: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  const currentUser = await getCurrentSeller();

  if (!currentUser) {
    return NextResponse.error();
  }


  const { listingId } = params;

  if (!listingId || typeof listingId !== 'string') {
    throw new Error('Invalid ID');
  }
  let { data: listing } = await axios.delete(
    `http://localhost:4002/listings/${listingId}`,
  )

  return NextResponse.json(listing);
}
export async function PATCH(
  request: Request,
) {
  try {
    console.log("hererer");
    const body = await request.json();
    const {
      id,
      title,
      description,
      price,
      discount,
      category,
      subCategory
    } = body;
    //console log id, title, description, price and discount
    console.log(id, title, description, price, discount);

    //const hashedPassword = await bcrypt.hash(password, 15);
    const { data: listing } = await axios.patch(
      `http://localhost:4002/listings/${id}`, {
      id,
      title,
      description,
      price: parseInt(price, 10),
      discount: parseInt(discount, 10),
      category,
      subCategory
    }
    )
    console.log(`Regitering`);
    console.log(listing);

    return NextResponse.json(listing);

  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 400 })
  }
}

