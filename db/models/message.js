const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const messageSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      maxLength: 200,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },
  },
  { timestamps: true }
);

messageSchema.virtual("formattedTimestamp").get(function () {
  return DateTime.fromJSDate(this.createdAt).toFormat("ff");
});

const Message = mongoose.model("Message", messageSchema);

module.exports = {
  Message,
  messageSchema,
};
