const router = require("express").Router();
const Todo = require("../models/todos");
const Item = require("../models/items");

router.use((req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/user/all");
  }
});

router.get("/all", async (req, res) => {
  try {
    // getting all todos added by the curent user
    let todos = await Todo.find(
      { added_by: req.session.user._id },
      { items: false } // suppressing items in projection
    );
    res.render("all-todos", { title: "All Todos", todos });
  } catch (error) {
    res.render("all-todos", {
      title: "All Todos",
      error: true,
      message: error instanceof Error ? error.message : error,
    });
  }
});

router.get("/new", async (req, res) => {
  res.render("new-todo", { title: "New TODO" });
});

router.post("/new", async (req, res) => {
  try {
    // creating new object
    let todo = new Todo();

    // populating data
    todo.title = req.body.title;
    todo.added_by = req.session.user._id;
    // saving documents
    await todo.save();
    res.redirect("/todo/all");
  } catch (error) {
    res.render("new-todo", {
      title: "New TODO",
      error: true,
      message: error instanceof Error ? error.message : error,
    });
  }
});

router.get("/:id/edit", async (req, res) => {
  try {
    // finding todo by id
    let todo = await Todo.findById(req.params.id);
    res.render("edit-todo", { title: "Edit TODO", todo });
  } catch (error) {
    res.render("all-todos", {
      title: "All Todos",
      error: true,
      message: error instanceof Error ? error.message : error,
    });
  }
});

router.post("/:id/edit", async (req, res) => {
  try {
    // finding todo by _id and updating the title
    await Todo.findByIdAndUpdate(req.params.id, { title: req.body.title });
    res.redirect("/todo/all");
  } catch (error) {
    res.render("all-todos", {
      title: "All Todos",
      error: true,
      message: error instanceof Error ? error.message : error,
    });
  }
});

router.get("/:id/delete", async (req, res) => {
  try {
    // finding  by _id and deleting the document
    let todo = await Todo.findByIdAndDelete(req.params.id);
    // deleting all the items under that
    await Item.deleteMany({ todo: todo._id });
    res.redirect("/todo/all");
  } catch (error) {
    res.render("all-todos", {
      title: "All Todos",
      error: true,
      message: error instanceof Error ? error.message : error,
    });
  }
});

router.get("/:id/view", async (req, res) => {
  // finding todo by id
  let todo = await Todo.findById(req.params.id, {
    added_by: false,
  }).populate("items", { todo: false });
  req.session.todo = todo.id;
  req.session.save((e) => {
    if (e) {
      res.render("all-todos", {
        title: "All Todos",
        error: true,
        message: error instanceof Error ? error.message : error,
      });
    } else {
      res.render("view-todo", { todo, title: "Todo" });
    }
  });
});
module.exports = router;
