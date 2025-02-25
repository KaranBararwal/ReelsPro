import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

// Common CORS Headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",  // Adjust for production if needed
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Handle Preflight OPTIONS Request
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Authenticate user session
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
    }

    // Connect to MongoDB
    await connectToDatabase();

    const { id } = params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid video ID" }, { status: 400, headers: corsHeaders });
    }

    // Fetch video by ID
    const video = await Video.findById(id).lean();

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404, headers: corsHeaders });
    }

    // Return the video data
    return NextResponse.json(video, { headers: corsHeaders });

  } catch (error) {
    console.error("Error fetching video by ID:", error);
    return NextResponse.json(
      { error: "Failed to fetch the video" },
      { status: 500, headers: corsHeaders }
    );
  }
}