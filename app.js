// them module express vao project
var http = require('http');
const express = require("express");
const engines = require("consolidate");
const { body } = require("express-validator");
const app = express();
var fs = require("fs");
var mongodb = require('mongodb')
var bodyParser = require("body-parser");
const { finished } = require("stream");
app.use(bodyParser.urlencoded({ extended: false }));

var publicDir = require("path").join(__dirname, "/public");
app.use(express.static(publicDir));

// npm i handlebars consolidate --save
app.engine("hbs", engines.handlebars);
app.set("views", "./views");
app.set("view engine", "hbs");

var MongoClient = mongodb.MongoClient;
var url =
  "mongodb+srv://phamducviet:phamducviet16@cluster0.bipjf.mongodb.net/test";

//localhost:5000
app.get("/", async function (req, res) {
  let client = await MongoClient.connect(url);
  let dbo = client.db("Staff");
  let result = await dbo.collection("staff").find({}).toArray(); // print product in product table

  res.render("index", { model: result });
});

// DELETE PRODUCT
app.get("/remove", async (req, res) => {
  let id = req.query.id;
  var ObjectID = mongodb.ObjectID;
  let client = await MongoClient.connect(url);
  let dbo = client.db("Staff");
  await dbo.collection("staff").deleteOne({ _id: ObjectID(id) });
  res.redirect("/");
});



// INSERT
app.get("/insert", (req, res) => {
  res.render("insert");
});
app.post("/doInsert", async (req, res) => {
  let inputName = req.body.txtName;
  let inputAge = req.body.txtAge;

  let inputGender = req.body.txtGender;
  let inputNumber = req.body.txtNumber;

  let newStaff = {
    name: inputName,
    age: inputAge,
    gender: inputGender,
    number: inputNumber,
  };

  if (isNaN(inputAge)) {
    let errorModel = { priceError: "Age must be a number" };
    res.render("insert", { model: errorModel })
  } else {

  }
  let client = await MongoClient.connect(url);
  let dbo = client.db("Staff");
  await dbo.collection("staff").insertOne(newStaff);
  res.redirect("/");
});

// SEARCH PRODUCT FUNCTION
app.get("/doSearch", async (req, res) => {
  let name_search = req.query.txtSearch;
  // let name_search_U = req.query.txtSearchU;
  // connect to database Mongodb
  let client = await MongoClient.connect(url);
  let dbo = client.db("Staff");
  let result = await dbo
    .collection("staff")
    .find({ name: new RegExp(name_search, "i") })
    .toArray();
  res.render("index", { model: result });
});

app.get("/update", async (req, res) => {
  let id = req.query.id;
  var ObjectID = mongodb.ObjectID;
  let client = await MongoClient.connect(url);
  let dbo = client.db('Staff');
  let user = await dbo.collection("staff").find({ _id: ObjectID(id.toString()) }).toArray();
  console.log(user);
  res.render('update', { model: user });
})
app.post("/doUpdate", async (req, res) => {
  let id = req.body.txtid;
  let inputName = req.body.txtName;
  let inputAge = req.body.txtAge;
  let inputGender = req.body.txtGender;
  let inputNumber = req.body.txtNumber;
  var ObjectID = mongodb.ObjectID;
  let client = await MongoClient.connect(url);
  let dbo = client.db('Staff');
  // let user =await dbo.collection("staff").find({_id:ObjectID(id.toString())}).toArray();
  let t = await dbo.collection("staff").
    updateOne({ "_id": ObjectID(id.toString()) },
      {
        $set: {
          name: inputName.toString(),
          age: inputAge.toString(),
          gender: inputGender.toString(),
          number: inputNumber.toString()
        }
      })
  console.log(t);

  res.redirect('/');
})
const PORT = process.env.PORT || 5000;
app.listen(PORT);
