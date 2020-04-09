const { Schema, model } = require("mongoose");

module.exports = model(
  "Item",
  new Schema({
    title: String,
    isCompleted: {
      type: Boolean,
      default: false,
    },
    todo: { type: Schema.Types.ObjectId, ref: "Todo" },
    added_on: { type: Date, default: Date.now() },
  })
);
