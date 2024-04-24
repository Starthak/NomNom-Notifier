import prisma from "@/app/libs/prismadb";
import axios from "axios";

export interface IListingsParams {
  userId?: string;
  category?: string;
}

export default async function getListings(
  params: IListingsParams
) {
  try {
    if (params.category) {
      const userId = params.userId;
      let { data: listings } = await axios.get(
        `http://localhost:4002/listings/category/${params.category}`
      )
      const safeListings = listings.map((listing: any) => ({
        ...listing,
        // createdAt: listing.postedAt.toISOString(),
      }));

      return safeListings;
    }
    if (params.userId) {
      const userId = params.userId;
      let { data: listings } = await axios.post(
        `http://localhost:4002/listings/getListingsByUserId`, {
        userId,
      }
      )
      const safeListings = listings.map((listing: any) => ({
        ...listing,
        // createdAt: listing.postedAt.toISOString(),
      }));

      return safeListings;
    }
    else {
      let { data: premiumListings } = await axios.post(
        `http://localhost:4002/listings/premium`, {
        limit: 20
      }
      )
      let { data: listings } = await axios.post(
        `http://localhost:4002/listings/getListings`, {
        limit: 20
      }
      )
      //console.log(listings, "listings");
      //console.log("Herererer");
      //append 2 arrays into one
      // premiumListings.map((listing: { title: string; }) => {
      //   console.log(listing.title)
      // })
      listings = [...premiumListings, ...listings];
      const safeListings = listings.map((listing: any) => ({
        ...listing,
        // createdAt: listing.postedAt.toISOString(),
      }));
      //console.log(safeListings);
      return safeListings;
    }
  } catch (error: any) {
    throw new Error(error);
  }
}
