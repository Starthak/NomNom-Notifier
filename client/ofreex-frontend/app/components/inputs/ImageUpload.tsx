import { useCallback } from "react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { TbPhotoPlus } from 'react-icons/tb';

declare global {
  var cloudinary: any;
}

const uploadPreset = "rkb0drs3";

interface ImageUploadProps {
  onChange: (value: string[]) => void; // Adjusted to accept an array of strings
  value: string[]; // Adjusted to be an array
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onChange,
  value
}) => {
  const handleUpload = (result: any) => {

    //console.log({result})
    const uploadedUrls = result.info.secure_url;
    //console.log({uploadedUrls})
    onChange([...value,uploadedUrls]);
  }

  //console.log({value},"value")

  return (
    <CldUploadWidget
      onUpload={handleUpload}
       
      uploadPreset={uploadPreset}
      options={{
        multiple: true,
      }}
    >
      {({ open }) => {
        return (
          <div
            onClick={() => open?.()}
            className="
              relative
              cursor-pointer
              hover:opacity-70
              transition
              border-dashed 
              border-2 
              p-20 
              border-neutral-300
              flex
              flex-col
              justify-center
              items-center
              gap-4
              text-neutral-600
            "
          >
            <TbPhotoPlus size={50} />
            <div className="font-semibold text-lg">
              Click to upload
            </div>
            {value?.map((imageUrl, index) => (
              <div key={index} className="absolute inset-0 w-full h-full">
                {imageUrl!==''  &&  <Image
                  fill
                  style={{ objectFit: 'cover' }}
                  src={imageUrl}
                  alt={`Uploaded image ${index + 1}`}
                />}
               
              </div>
            ))}
          </div>
        );
      }}
    </CldUploadWidget>
  );
};

export default ImageUpload;
