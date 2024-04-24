"use client";


import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import useLoginModal from "@/app/hooks/useLoginModal";
import useRegisterModal from "@/app/hooks/useRegisterModal";

import Modal from "./Modal";
import Input from "../inputs/Input";
import Heading from "../Heading";
import useActivationModal from "@/app/hooks/useActivationModal";
import useSellerModal from "@/app/hooks/useSellerModal";
import useBankDetailsModal from "@/app/hooks/useBankDetailsModal";
import { useActivationToken } from "@/app/hooks/useActivationToken";
import { useData } from "@/app/hooks/useData";
import useSellerLoginModal from "@/app/hooks/useSellerLoginModal";

interface RegisterModalProps {
  onUpdate: (data: string) => void;
}

const SellerModal = ({ }) => {
  const registerModal = useRegisterModal();
  const sellerModal = useSellerModal();
  const bankDetailsModal = useBankDetailsModal();
  const activationModal = useActivationModal();
  const activationTokenHook = useActivationToken();
  const dataHook = useData();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);
  const sellerLoginModal = useSellerLoginModal();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phoneNumber: "",
      address: "",
      gstNumber: ""
    },
  });

 
  function validateGSTNumber(gstNumber: string) {
    const regex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    console.log("H");
    
    return regex.test(gstNumber);
  }

  function validatePhoneNumber(phoneNumber: any){
    var phoneNum = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/; 
    return phoneNum.test(phoneNumber);
  }

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    // if(validateGSTNumber(data.gstNumber)){
    //   setError('gstNumber',{
    //     type: 'manual',
    //     message: "Invalid GST Number",
    //   });
    //   setIsLoading(false);
    //   return ;
    // }

    //Validate Phone Number
    // if(validatePhoneNumber(data.phoneNumber)){
    //   setError('phoneNumber',{
    //     type: "manual",
    //     message: "Invalid Phone Number",
    //   });
    //   setIsLoading(false);
    //   return ;
    // }


    // clearErrors(['gstNumber']);
    dataHook.obj = data;
    sellerModal.onClose();
    bankDetailsModal.onOpen();
    setIsLoading(false);
  };

  const onToggle = useCallback(() => {
    sellerModal.onClose();
    sellerLoginModal.onOpen();
  }, [sellerLoginModal , sellerModal]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Seller Registration" subtitle="Become a Seller" />

      <Input
        id="name"
        label="Name"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="email"
        label="Email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />

      <Input
        id="password"
        label="Password"
        type="password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />

      <Input
        id="phoneNumber"
        label="phoneNumber"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />

      <Input
        id="address"
        label="Address"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />

      <Input
        id="gstNumber"
        label="GST Number"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        maxLength={15}
      />

    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
      <div
        className="
          text-neutral-500 
          text-center 
          mt-4 
          font-light
        "
      >
        <p>
          Already have an account?
          <span
            onClick={onToggle}
            className="
              text-neutral-800
              cursor-pointer 
              hover:underline
            "
          >
            {" "}
            Log in
          </span>
        </p>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={sellerModal.isOpen}
      title="Register"
      actionLabel="Continue"
      onClose={sellerModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default SellerModal;
