"use client";

import axios from "axios";
import { toast } from "react-hot-toast";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import useRentModal from "@/app/hooks/useRentModal";

import Modal from "./Modal";
import CategoryInput from "../inputs/CategoryInput";
import CountrySelect from "../inputs/CountrySelect";
import { categories } from "../navbar/Categories";
import ImageUpload from "../inputs/ImageUpload";
import Input from "../inputs/Input";
import Heading from "../Heading";

enum STEPS {
  CATEGORY = 0,
  LOCATION = 1,
  IMAGES = 2,
  DESCRIPTION = 3,
  PRICE = 4,
  DISCOUNT = 5,
  QUANTITY = 6,
  DELIVERY = 7,
}

const RentModal = () => {
  const router = useRouter();
  const rentModal = useRentModal();

  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(STEPS.CATEGORY);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      category: "",
      location: null,
      imageSrc: "",
      price: 1,
      title: "",
      description: "",
      discount: 0,
      delivery: "",
      quantity: 1,
      customCategory: "",
    },
  });

  const [images, setImages] = useState<string[]>([]);

  const location = watch("location");
  const category = watch("category");
  const imageSrc = watch("imageSrc");

  const Map = useMemo(
    () =>
      dynamic(() => import("../Map"), {
        ssr: false,
      }),
    [location]
  );

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const onBack = () => {
    setStep((value) => value - 1);
  };

  const onNext = () => {
    setStep((value) => value + 1);
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (step !== STEPS.DELIVERY) {
      return onNext();
    }

    setIsLoading(true);

    const formattedData = {
      ...data,
      discount: parseFloat(data.discount),
      images: images,
      category: category === "others" ? "others" : data.category,
      subCategory: category === "others" ? data.customCategory : undefined,
    };

    // console.log({ formattedData });

    axios
      .post("/api/listings", formattedData)
      .then(() => {
        toast.success("Listing created!");
        router.refresh();
        reset();
        setStep(STEPS.CATEGORY);
        rentModal.onClose();
      })
      .catch((error) => {
        toast.error(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const actionLabel = useMemo(() => {
    if (step === STEPS.DELIVERY) {
      return "Create";
    }

    return "Next";
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.CATEGORY) {
      return undefined;
    }

    return "Back";
  }, [step]);

  let bodyContent;

  if (step == STEPS.CATEGORY) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Which of these best describes your Product?"
          subtitle="Pick a category"
        />
        <div
          className="
           grid 
           grid-cols-1 
           md:grid-cols-2 
           gap-3
           max-h-[50vh]
           overflow-y-auto
         "
        >
          {categories
            ? categories.map((item) => (
                <div key={item.label} className="col-span-1">
                  <CategoryInput
                    onClick={() => setCustomValue("category", item.label)}
                    selected={category === item.label}
                    label={item.label}
                    icon={item.icon}
                  />
                </div>
              ))
            : null}
          {category === "others" && (
            <Input
              id="customCategory"
              label="Specify Category"
              disabled={isLoading}
              register={register}
              errors={errors}
              required={category === "others"}
              maxLength={30}
            />
          )}
        </div>
      </div>
    );
  }

  if (step === STEPS.LOCATION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Where is your Product located?"
          subtitle="Help Customers find you!"
        />
        <CountrySelect
          value={location}
          onChange={(value) => setCustomValue("location", value)}
        />
        <Map center={location?.latlng} />
      </div>
    );
  }

  if (step === STEPS.IMAGES) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Add a photo of your Product"
          subtitle="Show Customers what your Product looks like!"
        />
        <ImageUpload onChange={(value) => setImages(value)} value={images} />
      </div>
    );
  }

  if (step === STEPS.DESCRIPTION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="How would you describe your Product?"
          subtitle="Short and sweet works best!"
        />
        <Input
          id="title"
          label="Title"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <hr />
        <Input
          id="description"
          label="Description"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    );
  }

  if (step === STEPS.PRICE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Now, set your price"
          subtitle="How much do you think its worth?"
        />
        <Input
          id="price"
          label="Price"
          formatPrice
          type="number"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    );
  }

  if (step === STEPS.DISCOUNT) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Now, set your Discount"
          subtitle="How much do you think its discount?"
        />
        <Input
          id="discount"
          label="Discount"
          // formatPrice
          type="number"
          disabled={isLoading}
          register={register}
          errors={errors}
        />
      </div>
    );
  }

  if (step === STEPS.DELIVERY) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Choose a delivery method"
          subtitle="How will the customer receive your product?"
        />
        <select
          id="delivery"
          onChange={(e) => setCustomValue("delivery", e.target.value)}
        >
          <option>Select Delivery Option</option>
          <option value="own">Self Delivery</option>
          <option value="Nom Nom Notifier">Nom Nom Notifier Delivery</option>
        </select>
      </div>
    );
  }

  if (step === STEPS.QUANTITY) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Now, set your Quantity of Your Product"
          subtitle="How much Product do you have?"
        />
        <Input
          id="quantity"
          label="Quantity"
          // formatPrice
          type="number"
          disabled={isLoading}
          register={register}
          errors={errors}
        />
      </div>
    );
  }

  return (
    <Modal
      disabled={isLoading}
      isOpen={rentModal.isOpen}
      title="Sell your Product!"
      actionLabel={actionLabel}
      onSubmit={handleSubmit(onSubmit)}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
      onClose={rentModal.onClose}
      body={bodyContent}
    />
  );
};

export default RentModal;
