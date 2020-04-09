const { Schema, model } = require("mongoose");

module.exports = model(
  "User",
  new Schema({
    name: String,
    email: String,
    added_on: { type: Date, default: Date.now() },
  })
);
