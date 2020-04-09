const { Schema, model } = require("mongoose");

module.exports = model(
  "Todo",
  new Schema({
    title: String,
    items: [{ type: Schema.Types.ObjectId, ref: "Item" }],
    added_by: { type: Schema.Types.ObjectId, ref: "User" },
    added_on: { type: Date, default: Date.now() },
  })
);
