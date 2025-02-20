"use client"

import { apiClient } from "@/lib/api-client";
import { IVideo } from "@/models/Video";
import { useEffect, useState } from "react";
import VideoFeed from "./components/VideoFeed";
import Header from "./components/Header";
// import VideoUploadPage from "./upload/page";
// import VideoComponent from "./components/VideoComponent";


export default function Home() {

  const [videos, setVideos] = useState<IVideo[]>([]);

  useEffect(()=> {
    const fetchVideos = async () => {
      try {
        // this is how we use the api - client

        // fetch all the videos by passing userOnly=false
        const data = await apiClient.getVideos(false)
        console.log("Fetched Videos:", data); // 🔹 Debugging
        setVideos(data)
      } catch (error) {
          console.error("Error fetching vidoes" , error)
      }
    }
    fetchVideos();
  } , [])


  return (
    <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Image Kit ReelsPro</h1>
        
        <Header/>
        <VideoFeed videos={videos}/>
    </main>
  );
}