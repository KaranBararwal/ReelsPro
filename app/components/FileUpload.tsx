"use client";

import  { useState } from "react";
import { IKUpload } from "imagekitio-next";
import { Loader2 } from "lucide-react"
import {IKUploadResponse} from "imagekitio-next/dist/types/components/IKUpload/props"

// defining the type of our file
interface FileUploadProps {
    onSuccess : (res : IKUploadResponse) => void;
    onProgress? : (progress : number) => void;
    fileType? : "image" | "video";
}
  
export default function FileUpload({
    onSuccess,
    onProgress,
    fileType = "image" 
} : FileUploadProps) {  // defining the type that we have already declare (cuz of TS)
  

  const [uploading , setUploading] = useState(false)
  const [error , setError] = useState<string | null> (null)
 

  // these are just methods 
const onError = (err : {message : string}) => {
    console.log("Error", err);
    setError(err.message)
    setUploading(false)
  };
  
  const handleSuccess = (response : IKUploadResponse) => {
    console.log("Success", response);
    setUploading(false)
    setError(null)
    onSuccess(response)
  };
  
  const handleStartUpload = () => {
    setUploading(true)
    setError(null)
  };
  
  // const handleProgress = (evt : ProgressEvent) => {

  //   console.log("Start", evt);
  //   if(evt.lengthComputable && onProgress){
  //     const percentComplete = (evt.loaded / evt.total) * 100;
  //     onProgress(Math.round(percentComplete));
  //   }
  // };
 

  const handleProgress = (evt: ProgressEvent) => {
    console.log("Progress Event Triggered:", evt);  // Debug log
    if (evt.lengthComputable && onProgress) {
        const percentComplete = (evt.loaded / evt.total) * 100;

        setUploading(true)  // it is callback so it should return a 
        console.log("Upload Progress:", percentComplete);  // Debug log

        onProgress(Math.round(percentComplete));
    }
};


  // here we are defining a  seprate method for file upload
  const validateFile = (file : File) => {
    if(fileType === "video"){
      if(!file.type.startsWith("video/")){
        setError("Please upload a video file")
        return false
      }

      if(file.size > 100 * 1024 * 1024){
        setError("Video must be less than 100 MB")
        return false
      }
    }
    else{
      const validTypes = ["image/jpeg" , "image/png" , "image/webp"]

      if(!validTypes.includes(file.type)){
        setError("please upload a valid file (JPEG , PNG , webP)")
        return false
      }

      if(file.size > 5 * 1024 * 1024){
        setError("Image must be less than 5 MB")
        return false
      }
    }
    return true; // return true when valid
  }


  return (

    <div className="space-y-2">
  
        <IKUpload
        className="file-input file-input-bordered w-full"
          fileName={fileType === "video" ? "video" : "image"}
          useUniqueFileName={true}
          validateFile={validateFile}
          folder={fileType === "video" ? "/videos" : "/images"}
          onError={onError}
          onSuccess={handleSuccess}
          onUploadProgress={handleProgress}
          onUploadStart={handleStartUpload}

          accept= {fileType === "video" ? "video/*" : "image/*"} 
        />

        {/* jab tak file upload ho rhi hai */}
        {
          uploading && (
            <div className="flex items-center gap-2 text-sm text-primary">
              <Loader2 className="animate-spin w-4 h-4"/>
              <span>Uploading...</span>
            </div>
          )
        }

        {/* one more component for the error */}
        { 
          error && <div className="text-error text-sm">{error}</div>
        }

    </div>
  );
}