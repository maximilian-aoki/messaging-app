const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const { userSchema } = require("./user");
const { messageSchema } = require("./message");

const roomSchema = new mongoose.Schema(
  {
    users: {
      type: [userSchema],
      required: true,
    },
    mostRecentMessage: {
      type: messageSchema,
      required: false,
    },
  },
  { timestamps: true }
);

roomSchema.virtual("url").get(function () {
  return `/rooms/${this._id}`;
});

roomSchema.virtual("formattedTimestamp").get(function () {
  return DateTime.fromJSDate(this.createdAt).toFormat("ff");
});

const Room = mongoose.model("Room", roomSchema);

module.exports = {
  Room,
  roomSchema,
};
