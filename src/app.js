const express = require("express");

const dotenv = require("dotenv");
dotenv.config();
const app = express();
const PORT = process.env.PORT;
const mongoose = require("mongoose");
const Strouter = require("../router/router");
var cookieParser = require('cookie-parser')
app.use(cookieParser())

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

const hbs = require("hbs");
const path = require("path");
const viewpath = path.join(__dirname, "../templetes/view");

// app.use(express.json());
const url =
"mongodb+srv://vaibhav11:vaibhav11@cluster0.uzq4egi.mongodb.net/28-11?retryWrites=true&w=majority";
mongoose
.connect(url)
  .then(() => {
    console.log("db connect successfully");
  })
  .catch((error) => {
    console.log(error);
  });
app.set("view engine", "hbs");
app.set("views", viewpath);
app.use("/", Strouter);
app.listen(PORT, () => {
  console.log("server are listing" + PORT);
});
