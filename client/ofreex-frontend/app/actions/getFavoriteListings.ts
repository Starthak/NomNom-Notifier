import prisma from "@/app/libs/prismadb";

import getCurrentUser from "./getCurrentUser";
import axios from "axios";

export default async function getFavoriteListings() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return [];
    }

    // const favorites = await prisma.listing.findMany({
    //   where: {
    //     id: {
    //       in: [...(currentUser.favoriteIds || [])]
    //     }
    //   }
    // });
    let { data: listings } = await axios.post(
      `http://localhost:4002/listings/favListings`, {
      userId: currentUser.id,
    }
    )
    const safeListings = listings.map((listing: any) => ({
      ...listing,
      // createdAt: listing.postedAt.toISOString(),
    }));

    return safeListings;
  } catch (error: any) {
    throw new Error(error);
  }
}
