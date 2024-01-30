const mongoose = require("mongoose");

// Replace the following with your MongoDB Atlas connection string
const atlasConnectionURI = "mongodb+srv://root:root@cluster0.st3qbgt.mongodb.net/";

const connectToMongo = async () => {
    try {
        mongoose.set("strictQuery", false);
        await mongoose.connect(atlasConnectionURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB Atlas Successfully!");
    } catch (error) {
        console.error("Error connecting to MongoDB Atlas:", error.message);
    }
};

module.exports = connectToMongo;
