"use server";

import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export const removeImage = async (fileKey: string) => {
  try {
    utapi.deleteFiles(fileKey);

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
    };
  }
};
