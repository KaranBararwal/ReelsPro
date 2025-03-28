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
    const [comments , setComments] = useState<{text : string}[]>([]);
    const [newComment , setNewComment] = useState("");


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


        // fetch comments 
    useEffect(() => {
        // fetch comments when component loads
        const fetchComments = async () => {
        try {
            const response = await fetch(`/api/videos/${video._id}/comment`);
            const data = await response.json();
            setComments(data.comments || []);
        } catch (error) {
            console.error("Error fetching comments:" , error)
        }
      };

    fetchComments();

    }, [video._id]);


    // Handle adding a comment
    const handleAddComment = async () => {
        if(!userId || !newComment.trim()) return ;

        try {
            console.log("Sending comment request for video ID:", video._id);
            console.log("User ID:", userId);
            console.log("Comment:", newComment);
            const response = await fetch(`/api/videos/${video._id}/comment` , {
                method : "POST",
                headers : {"Content-Type" : "application/json"},
                // body : JSON.stringify({userId , text : newComment}),
                body : JSON.stringify({userId , comment : newComment}),  
            });

            const data = await response.json();
            if(response.ok){
                setComments(data.comments);
                setNewComment("");   // clear input field
            }
        } catch (error) {
            console.error("Error adding comment" , error);
        }
    };
    

    return (
        <div className="card bg-base-100 shadow hover:shadow-lg transition-all duration-300">
            <figure className="relative px-4 pt-4">
                <Link href={`/videos/${video._id}`} className="relative group w-full">

                {/* this is the part where video sizing issue is coming */}
                <div 
                    className="rounded-xl overflow-hidden relative w-full aspect-ratio-9-16"
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

                        {/* Comment Section */}
                    <div className="mt-4">
                        <h3 className="text-md font-semibold" >Comments</h3>
                        <ul className="mt-2 space-y-2">
                            {comments.map((comment , index) => (
                                <li key={index} className="text-sm bg-purple-300 p-2 rounded-md">
                                    {comment.text}
                                </li>
                            ))}
                        </ul>

                        <div className="mt-3 flex items-center space-x-2">
                            <input 
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Drop a comment..."
                                className="flex-1 p-2 border rounded-md"
                                 />

                            <button
                                onClick={handleAddComment}
                                className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                                >
                                    POST
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}