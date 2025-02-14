import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI!;

if(!MONGODB_URI){
    throw new Error("Please define the mongodb uri in the env file");
}

// in the type script we have to declare special golbal types 
// so we are creating a file for types and defining the mongoose there
let cached = global.mongoose;

// still agar edge pe connection nhi chal rha to
if(!cached){
    cached = global.mongoose = {conn : null , promise : null};  // default values are null
}

// console.log(cached);

// doing the database connection
export async function connectToDatabase() {
    // if there is database connection then we are going to return it
    if(cached.conn){
        return cached.conn;
    }

    // if there is no promise then we are going to create it
    if(!cached.promise){
        const opts = {
            bufferCommands : true,
            maxPoolSize : 10,
        };

        cached.promise = mongoose
            .connect(MONGODB_URI , opts) // here we will have the error if we don't give ! at the end of getting MONGODB_URI
            .then(() => mongoose.connection);
    }

    // if there is promise then we have to wait
    try {
        cached.conn = await cached.promise;
    } catch (error) {

        // if there are some error then we will clean the matter
        cached.promise = null;
        throw error;
    }

    // at the end return the connection
    return cached.conn;
}