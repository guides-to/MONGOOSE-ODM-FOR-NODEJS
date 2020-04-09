const router = require("express").Router();
const User = require("../models/users");

router.get("/new", (req, res) => {
  res.render("new-user", { title: "New User" });
});

router.post("/new", async (req, res) => {
  try {
    // checking if user exits
    const _ = await User.findOne({ email: req.body.email });
    if (_ != null) {
      throw new Error("Account already exists");
    }

    // creating new user
    let user = new User();
    user.name = req.body.name;
    user.email = req.body.email;

    // saving in the document
    await user.save();

    res.render("new-user", {
      title: "New User",
      success: true,
      message: "Created Account",
    });
  } catch (error) {
    res.render("new-user", {
      title: "New User",
      error: true,
      message: error instanceof Error ? error.message : error,
    });
  }
});

router.get("/all", async (req, res) => {
  try {
    // finding all users documents
    let users = await User.find();
    res.render("all-users", {
      title: "All User",
      users,
      activeUser: req.session.user ? req.session.user : null,
    });
  } catch (error) {
    res.render("all-users", {
      title: "All User",
      error: true,
      message: error instanceof Error ? error.message : error,
    });
  }
});

router.get("/:id/activate", async (req, res) => {
  try {
    // finding by _id and setting it to session
    let user = await User.findById(req.params.id);
    req.session.user = user;
    req.session.save((e) => {
      if (e) {
        throw e;
      } else {
        res.redirect("/user/all");
      }
    });
  } catch (error) {
    res.render("all-users", {
      title: "All User",
      error: true,
      message: error instanceof Error ? error.message : error,
    });
  }
});

router.get("/:id/delete", async (req, res) => {
  try {
    // finidng by _id and deleting the document
    await User.findByIdAndDelete(req.params.id);
    res.redirect("/user/all");
  } catch (error) {
    res.render("all-users", {
      title: "All User",
      error: true,
      message: error instanceof Error ? error.message : error,
    });
  }
});

router.get("/:id/edit", async (req, res) => {
  try {
    // finding  by _id
    let user = await User.findById(req.params.id);
    res.render("edit-user", { title: "Edit User", user });
  } catch (error) {
    res.render("all-users", {
      title: "All User",
      error: true,
      message: error instanceof Error ? error.message : error,
    });
  }
});

router.post("/:id/edit", async (req, res) => {
  try {
    // finding  by _id and updating the document
    await User.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      email: req.body.email,
    });
    res.redirect("/user/all");
  } catch (error) {
    res.render("edit-user", {
      title: "All User",
      error: true,
      message: error instanceof Error ? error.message : error,
    });
  }
});
module.exports = router;
