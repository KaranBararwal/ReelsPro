import mongoose, { model, models, Schema } from "mongoose";

export const VIDEO_DIMENSIONS = {
    width : 1080,
    height : 1920,
} as const;

export interface IVideo {
    _id? : mongoose.Types.ObjectId;
    title : string;
    description : string;
    videoUrl : string;
    thumbnailUrl : string;
    userId : string;
    controls? : boolean;
    transformation? : {
        height : number;
        width : number;
        quality? : number;
    };
    likeCount? : number;
    // likedUsers? : mongoose.Types.ObjectId[];// array of user IDs who liked the video
    likedUsers?: string[];

}

const videoSchema = new Schema<IVideo> (
    {
        userId: { type: String , required: true }, // 👈 Add this        title : {type : String , required : true},
        // userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // 👈 Add this        title : {type : String , required : true},
        description : {type : String , required : true},
        videoUrl : {type : String , required : true},
        thumbnailUrl : {type : String , required : true},
        controls : {type :Boolean , default : true},
        transformation : {  
            height : {type : Number , default : VIDEO_DIMENSIONS.height},
            width : {type : Number , default : VIDEO_DIMENSIONS.width},
            quality : {type : Number , min : 1 , max : 100},
        },
        likeCount : {type : Number , default : 0},  
        // likedUsers : [{type : mongoose.Schema.Types.ObjectId , ref : "User"}]  // track users who liked
        likedUsers : {type : [String] , default : []},
    },
    {timestamps : true}
);

const Video = models?.Video || model<IVideo>("Video" , videoSchema);

export default Video;