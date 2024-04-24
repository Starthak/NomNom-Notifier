'use client';

import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import { signIn } from 'next-auth/react';
import {
  FieldValues,
  SubmitHandler,
  useForm
} from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";

import useRegisterModal from "@/app/hooks/useRegisterModal";
import useEditModal from "@/app/hooks/useEditModal";

import Modal from "./Modal";
import Input from "../inputs/Input";
import Heading from "../Heading";
import Button from "../Button";
import axios from "axios";
import { SafeCategory, SafeListing } from "@/app/types";
import { useEdit } from "@/app/hooks/useEdit";
import getCategories from "@/app/actions/getCategories";

interface EditModalProps {
  id?: string | null;
  listing?: SafeListing | null;
  categories?: SafeCategory[]

}

const EditModal: React.FC<EditModalProps> = ({
  categories
}
) => {
  const editHook = useEdit();
  const router = useRouter();
  const editModal = useEditModal();
  const registerModal = useRegisterModal();
  const [isLoading, setIsLoading] = useState(false);
  const [categoryStr, setCategoryStr] = useState<string>(editHook.obj.listing?.category ? editHook.obj.listing?.category : "");
  const {
    register,
    handleSubmit,
    formState: {
      errors,
    },
  } = useForm<FieldValues>({
    defaultValues: {
    },
  });

  const onSubmit: SubmitHandler<FieldValues> =
    (data) => {
      if (data.category !== "others") {
        data.subCategory = ""
      }

      console.log("here");
      data = {
        ...data,
        category: categoryStr
      }
      console.log({
        id: editHook.obj.id,
        ...data
      });
      setIsLoading(true);

      axios.patch(`/api/listings/${editHook.obj.id}`, {
        id: editHook.obj.id,
        ...data
      })
        .then((res) => {
          setIsLoading(false);
          toast.success('Listing Updated');
          editModal.onClose();
          // router.push('/properties')
          console.log("res.data");
          editHook.obj.listing = res.data;
          console.log(editHook.obj.listing);
          router.replace('/properties');
        })
        .catch((error) => {
          setIsLoading(false);
          console.log(error);
          toast.error(error?.response?.data?.error)
        })
    }
  const setCustomValue = (id: string, value: any) => {
    setCategoryStr(value);
  };

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading
        title="Edit Listing"
        subtitle="Edit your Listing!"
      />
      <Input
        id="title"
        label="Title"
        placeholderString={editHook.obj.listing?.title}
        disabled={isLoading}
        register={register}
        errors={errors}
      />
      <Input
        id="description"
        label="Description"
        placeholderString={editHook.obj.listing?.description}
        disabled={isLoading}
        register={register}
        errors={errors}
      />
      <Input
        id="price"
        label="Price"
        placeholderString={editHook.obj.listing?.price.toString()}
        disabled={isLoading}
        register={register}
        errors={errors}
      />
      <Input
        id="discount"
        label="Discount"
        placeholderString={editHook.obj.listing?.discount.toString()}
        disabled={isLoading}
        register={register}
        errors={errors}
      />
      <Input
        id="quantity"
        label="Quantity"
        placeholderString={editHook.obj.listing?.quantity.toString()}
        disabled={isLoading}
        register={register}
        errors={errors}
      />
      {/* <div className="flex flex-col gap-8">
        <Heading
          title="Choose a category"
        // subtitle="How will the customer receive your product?"
        /> */}
      <select
        id="category"
        onChange={(e) => setCustomValue("delivery", e.target.value)}
      >
        <option value={editHook.obj.listing?.category}>{editHook.obj.listing?.category}</option>
        {/* <option value="Books">Books</option>
        <option value="Cars">Cars</option> */}
        {categories
          ? categories.map((item, index) => (
            item.label !== editHook.obj.listing?.category ?
              <option key={index} value={item.label}>{item.label}</option> :
              ""

          ))

          : null}
        <option value="others">{"others"}</option>
      </select>
      {
        categoryStr === "others" ? <Input
          id="subCategory"
          label="subCategory"
          placeholderString={editHook.obj.listing?.subCategory?.toString()}
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        /> : ""
      }
      {/* </div> */}
    </div>
  )

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
    </div>
  )

  return (
    <Modal
      disabled={isLoading}
      isOpen={editModal.isOpen}
      title="Edit Listing"
      actionLabel="Save Changes"
      onClose={editModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
}

export default EditModal;
