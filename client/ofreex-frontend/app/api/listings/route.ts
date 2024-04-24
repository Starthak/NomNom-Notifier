import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import axios from "axios";
import getCurrentSeller from "@/app/actions/getCurrentSeller";

export async function POST(
  request: Request,
) {
  const currentUser = await getCurrentSeller();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();
  const {
    title,
    description,
    images,
    category,
    location,
    price,
    discount,
    delivery,
    quantity,
    subCategory,
  } = body;

  Object.keys(body).forEach((value: any) => {
    if (!body[value]) {
      NextResponse.error();
    }
  });

  if (!delivery || (delivery !== 'own' && delivery !== 'Nom Nom Notifier')) {
    return new Response(JSON.stringify({ error: "Invalid delivery option." }), { status: 400 });
  }

  const parsedDiscount = discount ? parseFloat(discount) : null;
  const parsedQuantity = quantity ? parseFloat(quantity) : null;
  const imageUrls = images as string[];
  let { data: listing } = await axios.post(
    `http://localhost:4002/listings/`, {
    title,
    description,
    imageUrls,
    category,
    city: location.value,
    condition: "Excellent",
    price: parseInt(price, 10),
    userId: currentUser.id,
    postedAt: "2024-04-01T13:12:04.833Z",
    rating: 0.0,
    discount: parsedDiscount,
    delivery,
    quantity: parsedQuantity,
    subCategory,
  }
  )

  return NextResponse.json(listing);
}

