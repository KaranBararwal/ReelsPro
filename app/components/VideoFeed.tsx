import { IVideo } from "@/models/Video";
import VideoComponent from "./VideoComponent";
import { useSession } from "next-auth/react";

interface VideoFeedProps {
    videos : IVideo[]
}

export default function VideoFeed ( {videos} : VideoFeedProps) {
    const {data : session} = useSession();
    const userId = session?.user?.id;


    console.log("Videos in VideoFeed:", videos);
    return (
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

            {videos.map((video) => (
                // <VideoComponent key={video._id?.toString()} video={video}/>
                <VideoComponent key={String(video._id)} video={video} userId={userId} />
            ))}


            {videos.length === 0 && (
                <div className="col-span-full text-center py-12">
                    <p className="text-base-content/70">No videos found</p>
                </div>
            )}
        </div>
    );
}