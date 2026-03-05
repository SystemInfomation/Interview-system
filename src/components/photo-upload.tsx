"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toaster";

const MAX_FILE_SIZE_MB = 100;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ACCEPTED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

export function PhotoUpload() {
  const [name, setName] = React.useState("");
  const [files, setFiles] = React.useState<File[]>([]);
  const [uploading, setUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const { toast } = useToast();
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);

    const oversized = selected.filter((f) => f.size > MAX_FILE_SIZE_BYTES);
    const badType = selected.filter(
      (f) => !ACCEPTED_MIME_TYPES.includes(f.type)
    );

    if (badType.length > 0) {
      toast({
        title: "Invalid file type",
        description: "Only JPEG, PNG, GIF, and WebP images are accepted.",
        variant: "destructive",
      });
      e.target.value = "";
      return;
    }

    if (oversized.length > 0) {
      toast({
        title: "File too large",
        description: `Each photo must be ${MAX_FILE_SIZE_MB} MB or smaller.`,
        variant: "destructive",
      });
      e.target.value = "";
      return;
    }

    setFiles(selected);
  };

  const handleUpload = async () => {
    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name before uploading.",
        variant: "destructive",
      });
      return;
    }

    if (files.length === 0) {
      toast({
        title: "No photos selected",
        description: "Please select at least one photo to upload.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setProgress(0);

    const supabase = getSupabase();
    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = file.name.split(".").pop() ?? "jpg";
      const safeName = name.trim().replace(/[^a-zA-Z0-9]/g, "-");
      const uid = crypto.randomUUID().slice(0, 8);
      const path = `${Date.now()}-${safeName}-${uid}-${i}.${ext}`;

      const { error: storageError } = await supabase.storage
        .from("photos")
        .upload(path, file, { cacheControl: "3600", upsert: false });

      if (storageError) {
        toast({
          title: "Upload failed",
          description: storageError.message,
          variant: "destructive",
        });
        setUploading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("photos")
        .getPublicUrl(path);
      uploadedUrls.push(urlData.publicUrl);

      setProgress(Math.round(((i + 1) / files.length) * 100));
    }

    // Save metadata to the photo_uploads table; files are already stored even
    // if the DB insert fails, so we notify the user but still navigate to thanks.
    const { error: dbError } = await supabase.from("photo_uploads").insert(
      uploadedUrls.map((image_url) => ({
        name: name.trim(),
        image_url,
      }))
    );
    if (dbError) {
      console.error("DB insert error:", dbError);
      toast({
        title: "Metadata not saved",
        description:
          "Your photos were uploaded but we could not record the details. Please contact support.",
        variant: "destructive",
      });
    }

    setUploading(false);
    router.push("/thanks");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-lg mx-auto"
    >
      <Card className="border-gray-800">
        <CardHeader>
          <CardTitle className="text-lg text-gray-200">
            Upload Your Photos
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="upload-name">Your Name</Label>
            <Input
              id="upload-name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
              disabled={uploading}
            />
            <p className="text-xs text-gray-500">Up to 50 characters</p>
          </div>

          {/* File picker */}
          <div className="space-y-2">
            <Label htmlFor="upload-photos">Select Photos</Label>
            <Input
              id="upload-photos"
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              multiple
              onChange={handleFileChange}
              disabled={uploading}
              className="cursor-pointer file:cursor-pointer file:mr-3 file:rounded file:border-0 file:bg-cyan-900 file:px-3 file:py-1 file:text-sm file:text-cyan-200 hover:file:bg-cyan-800"
            />
            <p className="text-xs text-gray-500">
              JPEG · PNG · GIF · WebP — max {MAX_FILE_SIZE_MB} MB per file
            </p>
          </div>

          {/* File list preview */}
          {files.length > 0 && (
            <ul className="divide-y divide-gray-800 rounded-lg border border-gray-800 overflow-hidden">
              {files.map((f, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between px-3 py-2 text-xs text-gray-400"
                >
                  <span className="truncate max-w-[75%]">{f.name}</span>
                  <span className="shrink-0 ml-2 text-gray-500">
                    {(f.size / 1024 / 1024).toFixed(1)} MB
                  </span>
                </li>
              ))}
            </ul>
          )}

          {/* Progress bar */}
          {uploading && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-400">
                <span>Uploading…</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-cyan-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter>
          <Button
            className="w-full"
            onClick={handleUpload}
            disabled={uploading || files.length === 0 || !name.trim()}
          >
            {uploading ? `Uploading… ${progress}%` : "Upload Photos"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
