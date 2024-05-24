const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    maxLength: 10,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    trim: true,
    required: true,
  },
  friends: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
    ],
    required: true,
  },
});

userSchema.virtual("formattedTimestamp").get(function () {
  return DateTime.fromJSDate(this.createdAt).toFormat("ff");
});

const User = mongoose.model("User", userSchema);

module.exports = {
  User,
  userSchema,
};
