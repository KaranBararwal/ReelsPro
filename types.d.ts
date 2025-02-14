// in mongoose we have already a a import for the types of the defining the types of the string connected (Connection)
import { Connection } from "mongoose";


// defining the global variables here
declare global {

    // creating a variable mongoose
    var mongoose : {
        // it either have a connection or a promise which can have the value or null
        conn : Connection | null;
        promise : Promise<Connection> | null;
    };
}

global.mongoose = global.mongoose || {conn : null , promise : null};

export {};  