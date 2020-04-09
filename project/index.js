const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");

mongoose.Promise = global.Promise;

(async () => {
  try {
    await mongoose.connect("mongodb://localhost/test", {
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to DB");
  } catch (error) {
    console.warn(error);
    process.exit(1);
  }
})();

const app = express();
app.locals.moment = require("moment");
app.set("view engine", "pug");
app.use(require("morgan")("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: "woot",
    resave: false,
    saveUninitialized: false,
  })
);

app.use("/user", require("./routes/user"));
app.use("/todo", require("./routes/todo"));
app.use("/item", require("./routes/item"));

app.all("*", (_, res) => {
  res.redirect("/user/all");
});
app.listen(3000, () => console.log("HTTP Running at :3000"));
