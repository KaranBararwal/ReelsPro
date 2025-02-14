import mongoose , {Schema , models , model} from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser{
    email : string;
    password : string;
    _id? : mongoose.Types.ObjectId; // if there is already _id in the mongo db
    createdAt? : Date;
    updatedAt? : Date;
}

const UserSchema = new Schema<IUser> (   // here we have to give the type as interface we are creating
    {
        email : {type : String , required : true , unique : true},
        password : {type : String , required : true},
        // createdAt : {type : Date , default : Date.now},
        // updatedAt : {type : Date , default : Date.now}
    },
    {
        timestamps : true
    }
);

// run this before saving the info
UserSchema.pre("save" , async function (next) {
    // password is either changed or created at first time
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password , 10);
    }
    next();
});

// models have all the models for it
const User = models?.User || model<IUser>("User" , UserSchema)

export default User;