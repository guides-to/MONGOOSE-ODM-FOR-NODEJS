const router = require("express").Router();
const Item = require("../models/items");
const Todo = require("../models/todos");

router.use((req, res, next) => {
  if (req.session.todo) {
    next();
  } else {
    res.redirect("/todo/all");
  }
});

router.get("/all", async (req, res) => {
  // finding all items of current selected todo
  let items = await Item.find({ todo: req.session.todo });
  res.render("all-items", { title: "All Items", items });
});

router.get("/new", async (_req, res) => {
  res.render("new-item", { title: "New Item" });
});

router.post("/new", async (req, res) => {
  try {
    // creating new object of Item model and populating data in it
    let item = new Item({ title: req.body.title, todo: req.session.todo });
    // finding todo and appending the _id of item in the list of items in todo model
    await Todo.findByIdAndUpdate(req.session.todo, {
      $push: { items: item._id },
    });
    // saving the model
    await item.save();
    res.redirect(`/todo/${req.session.todo}/view`);
  } catch (error) {
    res.redirect(`/todo/${req.session.todo}/view`);
  }
});

router.get("/:id/delete", async (req, res) => {
  try {
    // finding item by _id
    let item = await Item.findById(req.params.id);
    if (!item) {
      res.send("Item not found");
    } else {
      // removing item
      await item.remove();
      // pulling out the _id from items array in todo model
      await Todo.findByIdAndUpdate({ $pull: { items: item._id } });
      res.redirect(`/todo/${req.session.todo}/view`);
    }
  } catch (error) {
    res.redirect(`/todo/${req.session.todo}/view`);
  }
});

router.get("/:id/edit", async (req, res) => {
  // getting item by _id
  let item = await Item.findById(req.params.id);
  if (!item) {
    res.send("Item not found");
  } else {
    res.render("edit-item", { title: "Edit Item", item });
  }
});

router.post("/:id/edit", async (req, res) => {
  try {
    // getting item by _id and updating the title
    await Item.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
    });
    res.redirect(`/todo/${req.session.todo}/view`);
  } catch (error) {
    res.redirect(`/todo/${req.session.todo}/view`);
  }
});

router.get("/:id/status", async (req, res) => {
  try {
    // getting item by _id
    let item = await Item.findById(req.params.id);
    if (!item) {
      res.send("Item not found");
    } else {
      // updating data
      switch (req.query.type) {
        case "i":
          item.isCompleted = false;
          break;
        case "c":
          item.isCompleted = true;
          break;
        default:
          console.log(req.query.type);
          res.redirect(`/todo/${req.session.todo}/view`);
      }
    }
    // saving the document
    await item.save();
    res.redirect(`/todo/${req.session.todo}/view`);
  } catch (error) {
    res.redirect(`/todo/${req.session.todo}/view`);
  }
});

module.exports = router;
