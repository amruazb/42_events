
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Upload, Image, FileVideo, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MediaUploadProps {
  onFileSelect: (file: File) => void;
  currentMedia?: string;
  type?: "image" | "video" | "all";
  className?: string;
}

const MediaUpload = ({
  onFileSelect,
  currentMedia,
  type = "image",
  className,
}: MediaUploadProps) => {
  const { t } = useTranslation();
  const [preview, setPreview] = useState<string | null>(currentMedia || null);
  const [isHovering, setIsHovering] = useState(false);
  
  // Determine accepted file types
  const acceptedTypes = 
    type === "image" ? "image/*" :
    type === "video" ? "video/*" :
    "image/*,video/*";
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Create preview
    const fileUrl = URL.createObjectURL(file);
    setPreview(fileUrl);
    onFileSelect(file);
  };
  
  const handleClear = () => {
    setPreview(null);
    // Reset the file input
    const fileInput = document.getElementById("media-upload") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };
  
  const isVideo = preview?.includes("video") || preview?.endsWith(".mp4") || preview?.endsWith(".webm");
  
  return (
    <div 
      className={cn(
        "relative rounded-md border-2 border-dashed p-4 transition-all",
        preview ? "border-primary" : "border-muted-foreground/25 hover:border-primary/50",
        className
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {preview ? (
        <div className="relative">
          {isVideo ? (
            <video 
              src={preview} 
              className="w-full h-auto rounded-md object-cover" 
              controls
            />
          ) : (
            <img 
              src={preview} 
              alt="Media preview" 
              className="w-full h-auto rounded-md object-cover" 
            />
          )}
          
          <Button 
            onClick={handleClear}
            size="icon"
            variant="destructive"
            className="absolute top-2 right-2 h-8 w-8 opacity-70 hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </Button>
          
          {isHovering && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md">
              <label 
                htmlFor="media-upload" 
                className="cursor-pointer flex items-center justify-center px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90"
              >
                <Upload className="mr-2 h-4 w-4" />
                {t('admin.changeMedia')}
              </label>
            </div>
          )}
        </div>
      ) : (
        <label 
          htmlFor="media-upload" 
          className="flex flex-col items-center justify-center h-40 cursor-pointer"
        >
          {type === "image" ? (
            <Image className="h-10 w-10 text-muted-foreground mb-2" />
          ) : type === "video" ? (
            <FileVideo className="h-10 w-10 text-muted-foreground mb-2" />
          ) : (
            <div className="flex gap-4 mb-2">
              <Image className="h-10 w-10 text-muted-foreground" />
              <FileVideo className="h-10 w-10 text-muted-foreground" />
            </div>
          )}
          <span className="text-muted-foreground text-sm">
            {t('admin.dropMediaOr')}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2"
          >
            <Upload className="mr-2 h-4 w-4" />
            {t('admin.selectFile')}
          </Button>
        </label>
      )}
      
      <input 
        type="file"
        id="media-upload"
        accept={acceptedTypes}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default MediaUpload;
