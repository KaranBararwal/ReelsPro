"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import VideoFeed from "../components/VideoFeed";
import { useEffect, useState } from "react";
import { IVideo } from "@/models/Video";
import { apiClient } from "@/lib/api-client";

export default function UserProfile() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [videos, setVideos] = useState<IVideo[]>([]);
    const [loading, setLoading] = useState(true);

    // Redirect unauthenticated users
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    // Fetch videos after authentication
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                if (status === "authenticated" && session?.user) {
                    
                    // userOnly is true for this
                    const data = await apiClient.getVideos(true);
                    console.log("Fetched Videos:", data); // Debugging
                    setVideos(data);
                }
            } catch (error) {
                console.error("Error fetching videos", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, [status, session]);

    // Show loading spinner while session or videos are loading
    if (status === "loading" || loading) {
        return <div className="text-center mt-10">Loading...</div>;
    }

    if (!session) {
        return null;
    }

    const username = session.user?.name || session.user?.email?.split("@")[0];
    const email = session.user?.email;

    return (
        <div className="max-w-5xl mx-auto mt-10 space-y-8">
            {/* Profile Card */}
            <div className="max-w-lg mx-auto p-6 bg-base-100 rounded-lg shadow-lg text-center">
                <h1 className="text-2xl font-bold mb-4">User Profile</h1>

                <div className="space-y-4">
                    <div>
                        <h2 className="text-lg font-medium">Username:</h2>
                        <p className="text-base-content/70">{username}</p>
                    </div>

                    <div>
                        <h2 className="text-lg font-medium">Email:</h2>
                        <p className="text-base-content/70">{email}</p>
                    </div>
                </div>
            </div>

            {/* Videos Section */}
            <div className="p-4 bg-base-100 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 text-center">Your Uploaded Videos</h2>

                {videos.length > 0 ? (
                    <VideoFeed videos={videos} />
                ) : (
                    <p className="text-center text-base-content/70">You haven&apos;t uploaded any videos yet.</p>
                )}
            </div>
        </div>
    );
}