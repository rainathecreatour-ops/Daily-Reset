import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  audioUploader: f({ audio: { maxFileSize: "16MB" } })
    .middleware(async () => {
      // If you want: check cookie/session here later
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      // file.url is the hosted URL
      return { url: file.url, name: file.name };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
