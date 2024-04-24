'use client';

import { Range } from "react-date-range";

import Button from "../Button";

interface ListingReservationProps {
  //price: number;
  //dateRange: Range,
  totalPrice: number;
  //onChangeDate: (value: Range) => void;
  //onSubmit: () => void;
  //disabled?: boolean;
  //disabledDates: Date[];
  quantity?: number;
}

const ListingReservation: React.FC<
  ListingReservationProps
> = ({
  totalPrice,
  quantity,
}) => {
    return (
      <div
        className="
        rounded-xl 
        border-[1px]
      border-neutral-200 
        overflow-hidden
      "
      >
        <div className="p-4">
        <div
            className="
            mb-4
            text-sm
            font-medium
            text-neutral-600
          "
          >
            Stock available: {quantity}
          </div>
          <Button
            //disabled={disabled}
            label="Buy Product"
            onClick={() => { }}
          />
        </div>
        <hr />
        <div
          className="
          p-4 
          flex 
          flex-row 
          items-center 
          justify-between
          font-semibold
          text-lg
        "
        >
          <div>
            Total
          </div>
          <div>
            $ {totalPrice}
          </div>
        </div>
      </div>
    );
  }

export default ListingReservation;