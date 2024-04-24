"use client";

import axios from "axios";
import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import useLoginModal from "@/app/hooks/useLoginModal";
import useRegisterModal from "@/app/hooks/useRegisterModal";

import Modal from "./Modal";
import Input from "../inputs/Input";
import Heading from "../Heading";
import Button from "../Button";
import useActivationModal from "@/app/hooks/useActivationModal";
import useSellerModal from "@/app/hooks/useSellerModal";
import useBankDetailsModal from "@/app/hooks/useBankDetailsModal";
import { useActivationToken } from "@/app/hooks/useActivationToken";
import { useData } from "@/app/hooks/useData";
import useSellerActivationModal from "@/app/hooks/useSellerActivationModal";

interface RegisterModalProps {
  onUpdate: (data: string) => void;
}

const BankDetailsModal = ({ }) => {
  const registerModal = useRegisterModal();
  const sellerModal = useSellerModal();
  const bankDetailsModal = useBankDetailsModal();
  const sellerActivationModal = useSellerActivationModal();
  const activationTokenHook = useActivationToken();
  const dataHook = useData();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      bankName: "",
      accountNumber: "",
      IFSC: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    data = {
      ...data,
      ...dataHook.obj
    }
    // console.log(data);
    axios
      .post("/api/registerSeller", data)
      .then((res) => {
        //toast.success('Registered!');
        // console.log(res);

        activationTokenHook.activationToken = res.data;
        //console.log("actii = " + activationTokenHook.activationToken);
        // Modify the object
        //setActivationToken((prev) => (res.data.activationToken));
        // currentUser = {
        //   ...currentUser,
        //   id: 'test',
        //   activationToken: res.data.activationToken
        // }
        bankDetailsModal.onClose();
        sellerActivationModal.onOpen();
      })
      .catch((error) => {
        const errorMessage = error.message || 'Email Already Exist Kindly login Please';
        toast.error(errorMessage);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onToggle = useCallback(() => {
    registerModal.onClose();
    loginModal.onOpen();
  }, [registerModal, loginModal]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Seller Registration" subtitle="Become a Seller" />

      <Input
        id="bankName"
        label="Bank Name"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="accountNumber"
        label="Account Number"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />

      <Input
        id="IFSC"
        label="IFSC Code"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
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
      isOpen={bankDetailsModal.isOpen}
      title="Register"
      actionLabel="Continue"
      onClose={bankDetailsModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default BankDetailsModal;
