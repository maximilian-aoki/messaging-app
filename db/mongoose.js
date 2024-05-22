require("dotenv").config();

const mongoose = require("mongoose");
const uri = process.env.MONGO_URI;

function connectDb() {
  mongoose.connect(uri);

  mongoose.connection.on("connected", () => console.log("connected to Mongo"));
  mongoose.connection.on("error", () => console.log("error Mongo"));
  mongoose.connection.on("disconnected", () => console.log("disconnect Mongo"));
}

module.exports = connectDb;
