'use client';

import { toast } from "react-hot-toast";
import axios from "axios";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import { SafeCategory, SafeListing, SafeUser } from "@/app/types";

import Heading from "@/app/components/Heading";
import Container from "@/app/components/Container";
import ListingCard from "@/app/components/listings/ListingCard";
import useEditModal from "../hooks/useEditModal";
import EditModal from "../components/modals/EditModal";
import { useEdit } from "../hooks/useEdit";

interface PropertiesClientProps {
  listings: SafeListing[],
  currentUser?: SafeUser | null,
  categories: SafeCategory[],
}

const PropertiesClient: React.FC<PropertiesClientProps> = ({
  listings,
  currentUser,
  categories,
}) => {
  const router = useRouter();
  const editHook = useEdit();
  const editModal = useEditModal();
  const [deletingId, setDeletingId] = useState('');

  const onDelete = useCallback((id: string) => {
    setDeletingId(id);

    axios.delete(`/api/listings/${id}`)
      .then(() => {
        toast.success('Listing deleted');
        router.refresh();
      })
      .catch((error) => {
        toast.error(error?.response?.data?.error)
      })
      .finally(() => {
        setDeletingId('');
      })
  }, [router]);
  const onEdit = useCallback((id: string, listing: SafeListing) => {
    
    editHook.obj.id = id;
    editHook.obj.listing = listing;
    editModal.onOpen();
  }, [router]);


  return (
    <Container>
      <Heading
        title="Products"
        subtitle="List of your Products"
      />
      <div
        className="
          mt-10
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          md:grid-cols-3 
          lg:grid-cols-4
          xl:grid-cols-5
          2xl:grid-cols-6
          gap-8
        "
      >
        {listings.map((listing: any) => (
          <ListingCard
            key={listing.id}
            data={listing}
            actionId={listing.id}
            onAction={onDelete}
            onAction2={onEdit}
            disabled={deletingId === listing.id}
            actionLabel="Delete Product"
            actionLabel2="Edit Product"
            currentUser={currentUser}
            quantity={listing.quantity}
          />
        ))}
      </div>
      <EditModal categories={categories}/>
    </Container>
  );
}

export default PropertiesClient;