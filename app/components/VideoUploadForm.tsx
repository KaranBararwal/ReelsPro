"use client"

import { useState } from "react";
import { useForm } from "react-hook-form";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { Loader2 } from "lucide-react";
import { useNotification } from "./Notification";
import { apiClient } from "@/lib/api-client";
import FileUpload from "./FileUpload";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface VideoData {
    title : string;
    description : string;
    videoUrl : string;
    thumbnailUrl : string;
    // userId : mongoose.Types.ObjectId;
    userId : string;

}


export default function VideoFormData(){
    const router = useRouter(); // ✅ Hook called at top level

    const [loading, setLoading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const { showNotification } =  useNotification();

    const {data : session , status} = useSession(); // get session from nextAuth

    const {
        register,
        handleSubmit,
        setValue,
        formState : {errors},
    } = useForm<VideoData> ({
        defaultValues : {
            title : "",
            description : "",
            videoUrl : "",
            thumbnailUrl : "",
            userId : "extra",
        },
    });


    const handleUploadSuccess = (response : IKUploadResponse) => {
        setValue("videoUrl" , response.url);
        // setValue("videoUrl" , response.filePath);

        // Ensure we're setting the correct URL
        // setValue("videoUrl", response.url || response.filePath);
        setValue("thumbnailUrl" , response.thumbnailUrl || response.filePath);
        showNotification("Video uploaded Successfully!" , "success");
    };


    const handleUploadProgress = (progress: number) => {
        console.log("Upload Progress Function Called!");  // 🔹\ Check if function is triggered
        console.log("Upload Progress:", progress);
        setUploadProgress(progress);
    };
    


    const onSubmit = async (data : VideoData) => {
        if(!data.videoUrl){
            showNotification("Please upload a video first" , "error");
            return;
        }

        setLoading(true);

        try {

            if (!session || !session.user) {
                throw new Error("User session not found");
            }
            
            const videoDataWithUserId = {
                ...data,
                userId: session.user.id, // Safe to access after null check
            };
            

            // const videoDataWithUserId = {
            //     ...data,
            //     // userId : new mongoose.Types.ObjectId(session?.user.id), // attach user id
            //     userId: session.user.id, // Pass as string
            // };

            const response = await apiClient.createVideo(videoDataWithUserId);

            // const response = await apiClient.createVideo(data);
            console.log("Video Created Response:", response); // 🔹 Debugging
            
            showNotification("Video published successfully!" , "success");

            // reset form after successfull submission
            setValue("title" , "");
            setValue("description" , "");
            setValue("videoUrl" , "");
            setValue("thumbnailUrl" , "");
            setUploadProgress(0);

            // redirect to home page
            router.push("/");
            
        } catch (error) {
            showNotification(
                error instanceof Error ? error.message : "Failed to publish video",
                "error"
            );
        } finally {
            setLoading(false)
        }
    };

    return(
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="form-control">
                <label className="label">Title</label>

                <input 
                type="text"
                className={`input input-bordered ${
                    errors.title ? "input-error" : ""
                }`}
                {...register("title" , { required : "Title is required"})}
                />

            {errors.title && (
                <span className="text-error text-sm mt-1">
                    {errors.title.message}
                </span>
            )}
            </div>

            <div className="form-control">
                <label className="label">Description</label>
                <textarea
                    className={`textarea textarea-bordered h-24 ${
                        errors.description ? "textarea-error" : ""
                    }`}
                    {...register("description" , {required : "Description is required"})}
                    />

                {errors.description && (
                    <span className="text-error text-sm mt-1">
                        {errors.description.message}
                    </span>
                )}
            </div>

            <div className="form-control">
                <label className="label">Upload Video</label>
                {/* <FileUpload
                    fileType="video"
                    onSuccess={handleUploadSuccess}
                    onProgress={handleUploadProgress}
                /> */}

                <FileUpload
                    fileType="video"
                    onSuccess={(response) => {
                        console.log("Upload Success:", response);
                        handleUploadSuccess(response);
                    }}
                    onProgress={(progress) => {
                        console.log("Progress Event Triggered:", progress);
                        handleUploadProgress(progress);
                    }}
                />

                {uploadProgress > 0 && (
                    <div className="w-full  bg-gray-200 rounded-full h-2.5 mt-2">
                        <div
                            className="bg-primary h-2.5 rounded-full transition-all duration-300"
                            style={{width : `${uploadProgress}%`}}
                        />
                    </div>
                )}
            </div>


            <button
                type="submit"
                className="btn btn-primary btn-block"
                // disabled = {loading }
                disabled = {loading || !uploadProgress}
                // disabled={loading || !watch("videoUrl")}
            >
                {
                    loading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin"/>
                            Publishing Video...
                        </>
                    ) : (
                        "Publish Video"
                    )}
            </button>
        </form>
    );
}