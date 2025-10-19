import mongoose from "mongoose";

const connectDB = async () => {
    mongoose.connection.on('connected', () => console.log("Database Connected"));

    await mongoose.connect(`Place your own uri`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}

export default connectDB;