"use client"

import { useEffect, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
import {  useParams, useSearchParams } from "next/navigation";
import { IVideo } from "@/models/Video";
import { apiClient } from "@/lib/api-client";

const VideoPage = () => {
    // const router = useRouter();
    // const serachParams = useSearchParams();
    // const id = serachParams.get("id");

    const {id} = useParams<{id : string}>(); // get dynamic id form the url

    const [video, setVideo] = useState<IVideo | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            apiClient.getAVideo(id as string)
                .then(setVideo)
                .catch((err) => setError(err.message));
        }
        else{
            setError("No video is provided...")
        }
    }, [id]);

    if (error) return <div>Error: {error}</div>;
    if (!video) return <div>Loading...</div>;

    return (
        <div>
            <h1>{video.title}</h1>
            <p>{video.description}</p>
            <video src={video.videoUrl} controls width="600" />
        </div>
    );
};

export default VideoPage;