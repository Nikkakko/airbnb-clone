import { removeImage } from "@/_actions/uploadthing";
import Heading from "@/components/Heading";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";
import * as React from "react";
import { useFormContext } from "react-hook-form";

interface AddImageProps {}

interface imageProps {
  fileUrl: string;
  fileKey: string;
}

const AddImage: React.FC<AddImageProps> = ({}) => {
  const { toast } = useToast();
  const [images, setImages] = React.useState<imageProps[] | null>([]);
  const [isPending, startTransition] = React.useTransition();
  const { control, setValue } = useFormContext();

  const handleDelete = (imageKey: string) => {
    if (images && images.length > 0) {
      startTransition(async () => {
        await removeImage(imageKey);
        setImages(images.filter(image => image.fileKey !== imageKey));

        //update form value
        setValue(
          "imageSrc",
          images.filter(image => image.fileKey !== imageKey)
        );
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Heading
        title="Add images of your place"
        subtitle="Show off your place with some images"
      />

      {images && images.length > 0 && (
        <div className="grid grid-cols-2 gap-2 relative max-h-[300px] overflow-y-auto">
          {images.map(image => (
            <div key={image.fileKey} className="relative ">
              <Image
                src={image.fileUrl}
                alt="Image of your place"
                width={200}
                height={150}
                className="rounded-lg w-full h-[150px] object-cover"
              />
              <Button
                onClick={() => handleDelete(image.fileKey)}
                className="absolute top-1 right-1"
                variant={"destructive"}
                size={"icon"}
                disabled={isPending}
              >
                X
              </Button>
            </div>
          ))}
        </div>
      )}
      <FormField
        name="imageSrc"
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <UploadButton
                endpoint="imageUploader"
                className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center"
                onClientUploadComplete={res => {
                  //copy old and add new image
                  setImages([
                    ...(images || []),
                    {
                      fileUrl: res[0].url,
                      fileKey: res[0].key,
                    },
                  ]);
                  field.onChange([
                    ...(field.value || []),
                    {
                      url: res[0].url,
                      key: res[0].key,
                    },
                  ]);

                  toast({
                    title: "Upload Completed",
                    description: "Your image has been uploaded",
                  });
                }}
                onUploadError={(error: Error) => {
                  // Do something with the error.
                  toast({
                    title: "Upload Error",
                    description: error.message,
                  });
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default AddImage;
