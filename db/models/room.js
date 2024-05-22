const mongoose = require("mongoose");

const { messageSchema } = require("./message");

const roomSchema = new mongoose.Schema(
  {
    users: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        username: {
          type: String,
          required: true,
          trim: true,
          maxLength: 20,
        },
        avatar: {
          type: String,
          trim: true,
          required: true,
        },
      },
    ],
    mostRecentMessage: messageSchema,
  },
  { timestamps: true }
);

roomSchema.virtual("url").get(function () {
  return `/rooms/${this._id}`;
});

const Room = mongoose.model("Room", roomSchema);

module.exports = {
  Room,
  roomSchema,
};
