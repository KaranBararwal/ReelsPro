"use client"

import { apiClient } from "@/lib/api-client";
import { IVideo } from "@/models/Video";
import { useEffect, useState } from "react";
import VideoFeed from "./components/VideoFeed";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Spinner } from "flowbite-react";


export default function Home() {

  const [videos, setVideos] = useState<IVideo[]>([]);
  const [loading, setLoading] = useState<boolean>(true) ; // loading state

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
      }finally{
        setLoading(false); // stop loading after fetch
      }
    }
    fetchVideos();
  } , [])


return (
  <main className="container mx-auto px-4 py-8 flex flex-col gap-8">
    <h1 className="text-3xl font-bold">Image Kit ReelsPro</h1>

    <Header />

    {/* show sppiner while loading */}
    {
      loading ? (
        <div className="flex flex-col items-center justify-center flex-grow">
          <Spinner size="xl"/>
          <p className="mt-4 text-lg font-medium">Loading Reels...</p>
        </div>
      ) : videos.length > 0 ? (
          <VideoFeed videos={videos}/>
      ) : (
        <p className="text-center text-gray-500">No videos found.</p>
      )}
    <Footer />
  </main>
);
}