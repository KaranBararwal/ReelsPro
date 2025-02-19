"use client"

import { apiClient } from "@/lib/api-client";
import { IVideo } from "@/models/Video";
import { useEffect, useState } from "react";

export default function Home() {

  const [videos, setVideos] = useState<IVideo[]>([])

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
    <div>
      <h1>ChaiCode</h1>
    </div>
  );
}