'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { format } from 'date-fns';

import useCountries from "@/app/hooks/useCountries";
import {
  SafeListing,
  SafeReservation,
  SafeUser
} from "@/app/types";

import HeartButton from "../HeartButton";
import Button from "../Button";

interface ListingCardProps {
  data: SafeListing;
  reservation?: SafeReservation;
  onAction?: (id: string) => void;
  onAction2?: (id: string, listing: SafeListing) => void;
  disabled?: boolean;
  actionLabel?: string;
  actionLabel2?: string;
  actionId?: string;
  currentUser?: SafeUser | null;
  quantity?: number;

};

const ListingCard: React.FC<ListingCardProps> = ({
  data,
  reservation,
  onAction,
  onAction2,
  disabled,
  actionLabel,
  actionLabel2,
  actionId = '',
  currentUser,
  quantity,
}) => {
  const router = useRouter();
  const { getByValue } = useCountries();

  const location = getByValue(data.locationValue);

  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (disabled) {
        return;
      }

      onAction?.(actionId)
    }, [disabled, onAction, actionId]);
  const handleCancel2 = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (disabled) {
        return;
      }

      onAction2?.(data.id, data)
    }, [disabled, onAction, actionId]);

  const price = useMemo(() => {
    if (reservation) {
      return reservation.totalPrice;
    }

    return data.price;
  }, [reservation, data.price]);

  const reservationDate = useMemo(() => {
    if (!reservation) {
      return null;
    }

    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);

    return `${format(start, 'PP')} - ${format(end, 'PP')}`;
  }, [reservation]);

  //console.log(data);
  
  return (
    <div
      onClick={() => router.push(`/listings/${data.id}`)}
      className="col-span-1 cursor-pointer group"
    >
      <div className="flex flex-col gap-2 w-full">
        <div
          className="
            aspect-square 
            w-full 
            relative 
            overflow-hidden 
            rounded-xl
            border-2
            border-gray-500
          "
        >          
          <Image
            src={data.imageUrls[0]}
            alt="image"
            className="h-full w-full object-cover group-hover:scale-110 transition"
            fill
          />
          <div className="
            absolute
            top-3
            right-3
          ">
            <HeartButton
              listingId={data.id}
              currentUser={currentUser}
            />
          </div>
        </div>
        <div className="font-semibold text-lg">
          {data.title}
        </div>
        <div className="font-light text-neutral-500 ">
          {reservationDate || data.category}
        </div>
        <div className="flex flex-row items-center justify-between ">
          <div className="font-semibold">
            ₹ {price} 
          </div>
          {quantity !== undefined &&(<div className="text-sm text-neutral-500">
          Stock Present: {quantity}
          </div>)}
        </div>
        {onAction && actionLabel && (
          <Button
            disabled={disabled}
            small
            label={actionLabel}
            onClick={handleCancel}
          />
        )}
        {onAction2 && actionLabel2 && (
          <Button
            disabled={disabled}
            small
            label={actionLabel2}
            onClick={handleCancel2}
          />
        )}
      </div>

    </div>
  );
}

export default ListingCard;