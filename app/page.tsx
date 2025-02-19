"use client"

import { apiClient } from "@/lib/api-client";
import { IVideo } from "@/models/Video";
import { useEffect, useState } from "react";
import VideoFeed from "./components/VideoFeed";


export default function Home() {

  const [videos, setVideos] = useState<IVideo[]>([]);

  useEffect( ()=> {
    const fetchVideos = async () => {
      try {
        // this is how we use the api - client
        const data = await apiClient.getVideos()
        setVideos(data)
      } catch (error) {
          console.error("Error fecting vidoes" , error)
      }
    }
    fetchVideos()
  } , [])


  return (
    <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Image Kit ReelsPro</h1>
        <VideoFeed videos={videos}/>
    </main>
  );
}