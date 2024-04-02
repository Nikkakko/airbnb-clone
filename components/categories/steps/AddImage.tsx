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
  const [image, setImage] = React.useState<imageProps | null>(null);
  const [isPending, startTransition] = React.useTransition();
  const { control, getValues } = useFormContext();

  const imageSrcValue = getValues("imageSrc");

  const handleDelete = () => {
    if (image) {
      startTransition(async () => {
        await removeImage(image.fileKey);
        setImage(null);
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Heading
        title="Add images of your place"
        subtitle="Show off your place with some images"
      />

      {image ? (
        <div className="relative w-full h-72 rounded-lg overflow-hidden">
          <Image
            src={image.fileUrl}
            alt="image"
            fill
            className="rounded-lg object-cover"
            priority
            quality={100}
          />
          <Button
            onClick={handleDelete}
            className="absolute top-2 right-2"
            variant="destructive"
            disabled={isPending}
          >
            Delete
          </Button>
        </div>
      ) : (
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
                    field.onChange(res[0].url);
                    setImage({
                      fileUrl: res[0].url,
                      fileKey: res[0].key,
                    });

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
      )}
    </div>
  );
};

export default AddImage;
