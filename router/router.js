const express = require("express");
const router = express.Router();
const Student = require("../model/model");
const bcrypt = require("bcryptjs");
const auth = require("../middlewere/auth");
router.get("/", (req, resp) => {
  resp.render("reg");
});
router.get("/login", (req, resp) => {
  resp.render("login");
});

router.post("/add", async (req, resp) => {
  const student = new Student(req.body);
  try {
    const result = await student.save();
    resp.render("reg", { msg: "registration successufully" });
    // console.log("registration successufully");
  } catch (error) {
    console.log(error);
  }
});

router.get("/view", auth, async (req, resp) => {
  try {
    const result = await Student.find();
    // console.log(result);
    resp.render("view", { data: result });
  } catch (error) {
    console.log(error);
  }
});

router.post("/login", async (req, resp) => {
  try {
    const email = req.body.email;
    const pass = req.body.pass;
    console.log(email + " " + pass);
    const result = await Student.findOne({ email: email });
    // console.log(result);
    const isvalid = await bcrypt.compare(pass, result.pass);
    if (!isvalid) {
      resp.render("login", { msg: "invalid credentials" });
      console.log("invalid credentials");
      return;
    }
    const token = await result.generatetoken();
    //console.log("successfully");

    resp.cookie("jwt", token);
    resp.redirect("view");
  } catch (error) {
    console.log(error);
  }
});

router.get("/logout", auth, async (req, resp) => {
  const user = req.user;
  const token = req.token;

  user.Tokens = user.Tokens.filter((element) => {
    return element.token != token;
  });
  await user.save();
  await resp.clearCookie("jwt");
  resp.render("login");
});

router.get("/alllogout", auth, async (req, resp) => {
  const user = req.user;
  user.Tokens = [];
  await user.save();
  await resp.clearCookie("jwt");
  resp.render("login");
});

router.get("/update1", async (req, resp) => {
  const _id = req.query.uid;

  try {
    const result = await Student.findOne({ _id: _id });
    resp.render("update", { data: result });
  } catch (error) {
    console.log(error);
  }
});
 


router.post("/update", async (req, resp) => {
  try {
    const result = await Student.findByIdAndUpdate(req.body.id, req.body);
    resp.redirect("view");
  } catch (error) {
    console.log(error);
  }
});


router.get("/delete", async (req, resp) => {
  const _id = req.query.did;
  try {
    const result = await Student.findByIdAndDelete({ _id: _id });
    resp.redirect("view");
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
