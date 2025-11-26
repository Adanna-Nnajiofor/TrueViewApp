import type { NextApiRequest, NextApiResponse } from "next";
import cloudinary from "@/lib/cloudinary";
import formidable, { File, Fields, Files } from "formidable";

export const config = {
  api: {
    bodyParser: false, // required for file uploads
  },
};

// Utility to parse formidable form as a promise
const parseForm = (
  req: NextApiRequest
): Promise<{ fields: Fields; files: Files }> => {
  const form = formidable();
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { fields, files } = await parseForm(req);
    console.log("Parsed fields:", fields);
    console.log("Parsed files:", files);

    const fileList: File[] = Array.isArray(files.file)
      ? files.file
      : files.file
      ? [files.file]
      : [];

    if (fileList.length === 0) {
      return res.status(400).json({ error: "No file provided" });
    }

    const uploadedUrls: string[] = [];

    for (const file of fileList) {
      const filePath = Array.isArray(file.filepath)
        ? file.filepath[0]
        : file.filepath;
      console.log(
        "Uploading file path:",
        filePath,
        "filename:",
        file.originalFilename
      );

      if (!filePath) {
        return res.status(400).json({ error: "File path missing" });
      }

      try {
        const result = await cloudinary.uploader.upload(filePath, {
          folder:
            typeof fields.folder === "string" ? fields.folder : "hostSpaces",
        });
        console.log("Cloudinary result:", result);
        uploadedUrls.push(result.secure_url);
      } catch (err: any) {
        console.error("Cloudinary upload error:", err);
        return res.status(500).json({
          error: "Cloudinary upload failed",
          details: err.message || err,
        });
      }
    }

    return res.status(200).json({ secure_urls: uploadedUrls });
  } catch (err: any) {
    console.error("Upload API error:", err);
    return res.status(500).json({ error: err.message || "Upload failed" });
  }
}
