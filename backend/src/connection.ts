import mongoose from "mongoose";

async function connectToDB(url: string){
    return mongoose.connect(url);
}

export default connectToDB;
