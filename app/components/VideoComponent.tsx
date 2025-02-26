import { IKVideo } from "imagekitio-next";
import Link from "next/link";
import { IVideo } from "@/models/Video";
import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa"

interface VideoProps {
    video : IVideo;
    userId? : string; // pass the logged in user id
}

export default function VideoComponent({ video , userId } : VideoProps){
    // local state for like status and count
    const [liked, setLiked] = useState(false)
    const [likeCount, setLikeCount] = useState<number>(video.likeCount || 0);

    // fetch initial like count when component mounts
    useEffect(() => {
        console.log("User ID received in VideoComponent:", userId); // Debug userId
        console.log("Fetching likes for video ID:", video._id);


        const fetchLikes = async () => {
            try {
                const response = await fetch(`/api/videos/${video._id}/like`); // from like

                const data = await response.json();
                console.log("Fetch likes API response : " , data); // debugging

                if(response.ok){
                    // const data = await response.json();
                    setLikeCount(data.likeCount || 0);
                    setLiked(userId ? data.likedUsers.includes(userId) : false); // if user already liked it
                }
            } catch (error) {
                console.error("Error fetching likes : " , error)
            }
        };
        fetchLikes();
    } , [video._id , userId]);


    const handleLike = async () => {
            // if (liked) return
            if(!userId){
                console.error("User ID is missing before sending request!");
                return;
            }
        
            try {
                console.log("Sending userId" , userId); // debug code 

                const response = await fetch(`/api/videos/${video._id}/like`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body : JSON.stringify({userId})  // send user Id
                });

                const data = await response.json();
                console.log("Like API response : " , data); // debugging
    
                if (response.ok) {
                    // const data = await response.json();
                    setLikeCount(data.likeCount);
                    // setLiked(prev => !prev);  // toggle the previous state
                    setLiked(userId ? data.likedUsers.includes(userId) : false);  // toggle the previous state
            }
            } catch (error) {
                console.error("Error liking the video:", error);
            }
        };

    return (
        <div className="card bg-base-100 shadow hover:shadow-lg transition-all duration-300">
            <figure className="relative px-4 pt-4">
                <Link href={`/videos/${video._id}`} className="relative group w-full">
                <div 
                    className="rounded-xl overflow-hidden relative w-full"   
                    style={{aspectRatio : "9/16"}}
                >
                    <IKVideo 
                        path={video.videoUrl.replace("https://ik.imagekit.io/karanbararwal/", "")} 
                        controls={video.controls}
                        transformation={[
                            {
                                height : "720",
                                width : "405",
                                quality : "80",
                                // crop : "maintain_ratio",
                            },
                        ]}
                        className="w-full h-full object-cover rounded-lg shadow-lg"
                    />


                </div>
                </Link> 
            </figure>


            <div className="card-body p-4">
                <Link
                    href={`/videos/${video._id}`}
                    className="hover:opacity-80 transition-opacity"
                >   
                    <h2 className="card-title text-lg">{video.title}</h2>
                </Link>

                <p className="text-sm text-base-content/70 line-clamp-2">
                    {video.description}
                </p>


                {/* Like Button Section */}
{/* Like Button Section */}
            <div className="mt-4 flex items-center">
                {/* Like button with heart icon */}
                <button 
                    onClick={handleLike} 
                    className="flex items-center space-x-2 focus:outline-none transition-all duration-200"
                    aria-label={liked ? "Unlike this video" : "Like this video"}
                >
                    {/* Heart icon changes color based on the liked state */}
                    <FaHeart 
                        className={`text-xl transition-colors duration-200 ${liked ? "text-red-500 scale-110" : "text-gray-400"}`} 
                    />

                    {/* Display the like count */}
                    <span className="text-sm font-medium">{likeCount}</span>
                </button>    

                {/* Display like/liked text */}
                <span className="ml-2 text-sm text-gray-600 transition-opacity duration-200">
                    {liked ? "Liked" : "Like"}
                </span>
            </div>

            </div>
        </div>
    );
}