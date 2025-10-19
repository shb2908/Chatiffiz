import mongoose from "mongoose";

const connectDB = async () => {
    mongoose.connection.on('connected', () => console.log("Database Connected"));

    await mongoose.connect(`mongodb+srv://sohamshb9119:GargiBose70@cluster0.swa3k.mongodb.net/`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}

export default connectDB;