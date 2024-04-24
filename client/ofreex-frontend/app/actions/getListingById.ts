import prisma from "@/app/libs/prismadb";
import axios from "axios";

interface IParams {
  listingId?: number;
}

export default async function getListingById(
  params: IParams
) {
  try {
    const { listingId } = params;
    //axio get request from 'http:localhost:4002/listing/getListingById' with the body of listingId
    //console.log(listingId);
    const { data: listing } = await axios.get(
      `http://localhost:4002/listings/${listingId}`,
    )
    // const listing = await prisma.listing.findUnique({
    //   where: {
    //     id: listingId,
    //   },
    //   include: {
    //     user: true
    //   }
    // });

    if (!listing) {
      return null;
    }

    return {
      ...listing,
      //createdAt: listing.postedAt.toString(),
      user: {
        ...listing.userId,
      }
    };
  } catch (error: any) {
    throw new Error(error);
  }
}
