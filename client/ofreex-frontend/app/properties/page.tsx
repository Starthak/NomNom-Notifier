
import EmptyState from "@/app/components/EmptyState";
import ClientOnly from "@/app/components/ClientOnly";

import getCurrentUser from "@/app/actions/getCurrentUser";
import getListings from "@/app/actions/getListings";

import PropertiesClient from "./PropertiesClient";
import getCurrentSeller from "../actions/getCurrentSeller";
import getCategories from "../actions/getCategories";

const PropertiesPage = async () => {
  const currentUser = await getCurrentSeller();
  console.log("rooot Pageeegege");
  const categories = await getCategories();
  if (!currentUser) {
    return <EmptyState
      title="Unauthorized"
      subtitle="Please login"
    />
  }

  const listings = await getListings({ userId: currentUser.id });

  if (listings.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title="No Listings found"
          subtitle="Looks like you have no Listings."
        />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <PropertiesClient
        listings={listings}
        currentUser={currentUser}
        categories={categories}
      />
    </ClientOnly>
  );
}

export default PropertiesPage;
