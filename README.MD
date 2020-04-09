# Course Overview

**Prerequisite Knowledge** <br>
Basics of NodeJS

**What you will learn in this course** <br>
In this you will learn about NoSQL database, whose subtle introduction was given in the [sequelize's course](https://guides-to.github.io/SEQUELIZE-ORM-FOR-NODEJS/). Also you will learn the basics of MongoDB, the leading NoSQL DB support provider and the Mongoose ODM developed my [Automattic](http://automattic.com)

**Project** <br>
The project is in `project` directory

**NOTE :** This course is made with jupyter notebook. If you want the notebook drop a message at tbhaxor@gmail.com

# What is NoSQL Database

NoSQL database is type of database that doesn’t follow the approach that SQL follows. It uses different query langauge and document doesn’t have to stick to same schema. The records in it have no relations, duplicattion of data is preffered

Database contains collections, collections contains documents. These documents are the records. It stores the data in binary json (called [bson](http://bsonspec.org/))

## What is MongoDB

MongoDB is a nosql database serviced provided by the company named MongoDB. It is specially build for large scale applications, that may store lots and lots of data.

The documents within documents are known as **embedded documents**. MongoDB uses this way to duplicate the document. Another concept of linking other documents is called **references**, where the unique id (in mongodb it's called object id and denoted by `_id`) of the document is added in the document

Embdedded Document way

```json
{
  "_id": "id1",
  "name": "Gurkirat Singh",
  "age": 22,
  "address": {
    "state": "Rajasthan",
    "country": "India"
  }
}
```

Now the refrencing approach needs two separate documents of address and user

Address Document

```json
{
    "_id": "id2".
    "state": "Rajasthan",
    "country": "India"
}
```

User Document

```json
{
  "_id": "id1",
  "name": "Gurkirat Singh",
  "age": 22,
  "address": "id2"
}
```

## Setting up MongoDB

Installing on Windows: [Documentation](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/) | [Video](https://www.youtube.com/watch?v=GmeW8s8snsU)

Installing on Linux: [Documentation](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/) | [Video](https://www.youtube.com/watch?v=2lmjD_vhwEg)

Or you can use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas). Learn how to setup the clustor from this video &rarr; https://www.youtube.com/watch?v=YZ66YqGPip8

### Installing MongoDB Compass

1. Visit the link &rarr; https://docs.mongodb.com/compass/current/install/
2. Select the OS
3. Follow the instructions on the page.

After installing compass, follow the instructions from the [docs](https://docs.mongodb.com/compass/current/connect/) to connect it with your mongodb instance

## Installing MongoDB Driver for NodeJS

```bash
# using yarn
yarn add mongodb

# using npm
npm i mongodb
```

```javascript
const { MongoClient } = require("mongodb");
```

After this, you can connect to the mongodb server by `MongoClient.connect()` method. It requires a connection string with the following syntax

```
mongodb://[user:password]@hostname[:port]/database
```

The data in `[` `]` are optional. Since I am using mongodb on my localhost with `test` db, therefore the connection string in my case will be

```
mongodb://localhost/test
```

```javascript
let db = null;

MongoClient.connect("mongodb://localhost/test", {
  useUnifiedTopology: true, // recommended by mongoclient
})
  .then((client) => {
    db = client.db(); // getting the object of database
    console.log("Connected to the DB");
  })
  .catch((e) => console.warn(e));
```

    Connected to the DB

## CRUD Operations on the database

### CREATE Document

```javascript
db.collection("users")
  .insertOne({ name: "Gurkirat", age: 22 })
  .then((response) => console.log(response.result))
  .catch(console.warn);
```

    { n: 1, ok: 1 }

**Creating Document in Bulk**

```javascript
let users = [
  { name: "Amit", age: 20 },
  { name: "John", age: 25 },
];
```

```javascript
db.collection("users")
  .insertMany(users)
  .then((response) => console.log(response.result))
  .catch(console.warn);
```

    { ok: 1, n: 2 }

### READ Document

```javascript
db.collection("users")
  .find()
  .toArray()
  .then((r) => {
    console.log(r);
  })
  .catch(console.warn);
```

    [
      { _id: 5e89a3c678852a72f87479f8, name: 'Gurkirat', age: 22 },
      { _id: 5e89a46778852a72f87479f9, name: 'Amit', age: 20 },
      { _id: 5e89a46778852a72f87479fa, name: 'John', age: 25 }
    ]

Did you see the new field `_id`. It is an auto generated he 12-byte value called ObjectId. It consists of:

- a 4-byte timestamp value, representing the ObjectId’s creation, measured in seconds since the Unix epoch
- a 5-byte random value
- a 3-byte incrementing counter, initialized to a random value

**Fetching Single Record**

```javascript
db.collection("users")
  .find({ name: "John" })
  .next()
  .then((r) => console.log(r))
  .catch(console.warn);
```

    { _id: 5e89a46778852a72f87479fa, name: 'John', age: 25 }

**Fetching Record by ObjectID** <br>
You can compare the `ObjectID` with string

```javascript
const { ObjectId } = require("mongodb");
```

```javascript
db.collection("users")
  .find({ _id: ObjectId("5e89a3c678852a72f87479f8") })
  .next()
  .then((r) => console.log(r))
  .catch(console.warn);
```

    { _id: 5e89a3c678852a72f87479f8, name: 'Gurkirat', age: 22 }

### UPDATE Document

```javascript
db.collection("users")
  .updateOne(
    { _id: ObjectId("5e89a3c678852a72f87479f8") },
    { $set: { name: "Gurkirat Singh" } }
  )
  .then((r) => console.log(r.result))
  .catch(console.warn);
```

    { n: 1, nModified: 0, ok: 1 }

```javascript
db.collection("users")
  .find({ _id: ObjectId("5e89a3c678852a72f87479f8") })
  .next()
  .then((r) => console.log(r))
  .catch(console.warn);
```

    { _id: 5e89a3c678852a72f87479f8, name: 'Gurkirat Singh', age: 22 }

### DELETE Document

```javascript
db.collection("users")
  .deleteOne({ _id: ObjectId("5e89a3c678852a72f87479f8") })
  .then((r) => console.log(r.result))
  .catch(console.warn);
```

    { n: 1, ok: 1 }

```javascript
db.collection("users")
  .find()
  .toArray()
  .then((r) => {
    console.log(r);
  })
  .catch(console.warn);
```

    [
      { _id: 5e89a46778852a72f87479f9, name: 'Amit', age: 20 },
      { _id: 5e89a46778852a72f87479fa, name: 'John', age: 25 }
    ]

## Adding References

```javascript
db.collection("users")
  .findOne()
  .then((r) => {
    db.collection("products")
      .insertOne({
        title: "A book to ODM in Nodejs",
        price: 200.99,
        added_by: r._id,
      })
      .then((r) => console.log(r.result))
      .catch(console.warn);
  })
  .catch(console.warn);
```

    { n: 1, ok: 1 }

```javascript
db.collection("products")
  .find()
  .toArray()
  .then(console.log)
  .catch(console.warn);
```

    [
      {
        _id: 5e89ca3d78852a72f87479fb,
        title: 'A book to ODM in Nodejs',
        price: 200.99,
        added_by: 5e89a46778852a72f87479f9
      }
    ]

**Populating the User Data**

```javascript
db.collection("products")
  .find()
  .next()
  .then((r) => {
    console.log("Book Title:", r.title);
    console.log("Price of Book:", r.price);
    db.collection("users")
      .find({ _id: r.added_by })
      .next()
      .then((r) => {
        console.log("Added By:", r.name);
      })
      .catch(console.warn);
  })
  .catch(console.warn);
```

    Book Title: A book to ODM in Nodejs
    Price of Book: 200.99
    Added By: Amit

# Mongoose: MongoDB ODM

Mongoose is an Object Document Mapping library for mongodb in nodejs. This helps the nodejs developer to focus on data more than dealing with mongodb. It allows the developers to define models with which they can interact with database.

**Installing Mongoose**

```bash
# using npm
npm i mongoose

# using yarn
yarn add mongoose
```

```javascript
const mongoose = require("mongoose");
```

Connecting to the DB

```javascript
mongoose
  .connect("mongodb://localhost/test", {
    // settings are recommended by mongoose
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.warn);
```

    Connected to DB

**Creating Product Schema and Model**

```javascript
const { Schema, model } = require("mongoose");
```

```javascript
const ProductSchema = new Schema({
  title: String,
  price: Number,
  added_by: { type: Schema.Types.ObjectId, ref: "User" }, // adding reference to User model via _id field
});

const Product = model("Product", ProductSchema);
```

**Creating User Schema and Model**

```javascript
const UserSchema = new Schema({
  name: String,
  email: String,
});

const User = model("User", UserSchema);
```

## Performing CRUD Operations

### CREATE

```javascript
let newProduct = new Product();
let newUser = new User();

newUser.name = "Dummy User";
newUser.email = "dummy@user.com";

newProduct.title = "A book on C Plus Plus";
newProduct.price = 200.99;
newProduct.added_by = newUser._id;
```

    5e89d1db8ccb5891c7c1d522

```javascript
newUser
  .save()
  .then((r) => {
    console.log("Added to new User to DB");
  })
  .catch(console.warn);
```

    Added to new User to DB

```javascript
newProduct
  .save()
  .then((r) => {
    console.log("Added to new Product to DB");
  })
  .catch(console.warn);
```

    Added to new Product to DB

### READ all the Data

```javascript
User.find()
  .then((r) => {
    console.log(r);
  })
  .catch(console.warn);
```

    [
      {
        _id: 5e89d1db8ccb5891c7c1d522,
        name: 'Dummy User',
        email: 'dummy@user.com',
        __v: 0
      }
    ]

```javascript
Product.find()
  .then((r) => {
    console.log(r);
  })
  .catch(console.warn);
```

    [
      {
        _id: 5e89d1db8ccb5891c7c1d521,
        title: 'A book on C Plus Plus',
        price: 200.99,
        added_by: 5e89d1db8ccb5891c7c1d522,
        __v: 0
      }
    ]

**Populating the Reference**

```javascript
Product.find()
  .populate("added_by")
  .then((r) => {
    console.log(r);
  })
  .catch(console.warn);
```

    [
      {
        _id: 5e89d1db8ccb5891c7c1d521,
        title: 'A book on C Plus Plus',
        price: 200.99,
        added_by: {
          _id: 5e89d1db8ccb5891c7c1d522,
          name: 'Dummy User',
          email: 'dummy@user.com',
          __v: 0
        },
        __v: 0
      }
    ]

**Populating the Reference and Projecting Specific Fields Only**

```javascript
Product.find()
  .populate("added_by", { name: true })
  .then((r) => {
    console.log(r);
  })
  .catch(console.warn);
```

    [
      {
        _id: 5e89d1db8ccb5891c7c1d521,
        title: 'A book on C Plus Plus',
        price: 200.99,
        added_by: { _id: 5e89d1db8ccb5891c7c1d522, name: 'Dummy User' },
        __v: 0
      }
    ]

**Finding By `_id`**

```javascript
Product.findById("5e89d1db8ccb5891c7c1d521")
  .then((r) => console.log(r))
  .catch(console.warn);
```

    {
      _id: 5e89d1db8ccb5891c7c1d521,
      title: 'A book on C Plus Plus',
      price: 200.99,
      added_by: 5e89d1db8ccb5891c7c1d522,
      __v: 0
    }

**Fetch Single Result by non `_id` Field**

```javascript
Product.findOne({ price: { $gte: 100 } }) // finding one product whose price is greater than equal to 100
  .then((r) => console.log(r))
  .catch(console.warn);
```

    {
      _id: 5e89d01526491f916866e730,
      title: 'A book on C Plus Plus',
      price: 200.99,
      added_by: 5e89d01526491f916866e731,
      __v: 0
    }

### UPDATE the Document

```javascript
Product.findByIdAndUpdate("5e89d1db8ccb5891c7c1d521", { title: "C++ book" })
  .then((r) => console.log(r))
  .catch(console.warn);
```

    {
      _id: 5e89d1db8ccb5891c7c1d521,
      title: 'A book on C Plus Plus',
      price: 200.99,
      added_by: 5e89d1db8ccb5891c7c1d522,
      __v: 0
    }

You can also use the `updateOne` method to update the document.

```javascript
Product.findById("5e89d1db8ccb5891c7c1d521")
  .then((r) => console.log(r))
  .catch(console.warn);
```

    {
      _id: 5e89d1db8ccb5891c7c1d521,
      title: 'C++ book',
      price: 200.99,
      added_by: 5e89d1db8ccb5891c7c1d522,
      __v: 0
    }

### DELETE the Document

```javascript
Product.findByIdAndDelete("5e89d1db8ccb5891c7c1d521")
  .then((r) => console.log(r))
  .catch(console.warn);
```

    {
      _id: 5e89d1db8ccb5891c7c1d521,
      title: 'C++ book',
      price: 200.99,
      added_by: 5e89d1db8ccb5891c7c1d522,
      __v: 0
    }

You can also use the `deleteOne` method to delete the document

```javascript
Product.findById("5e89d1db8ccb5891c7c1d521")
  .then((r) => console.log(r))
  .catch(console.warn);
```

    null

To learn more on mongoose, follow this link to the documentation &rarr; https://mongoosejs.com/docs/guide.html

# Misc

_This section will updated soon_
