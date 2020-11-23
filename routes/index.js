//kontakti forma za slanje emaila
//pocetna
const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const passport = require("passport");
const async = require("async");
const crypto = require("crypto");
const User = require("../models/user");
const Novosti = require("../models/posts");
require("dotenv").config();
let password = process.env.PASSW;
console.log(password);

router.get("/ozupi", (req, res) => {
  console.log("DOBRO DOSLI");
  res.render("ozupi");
});

router.get("/contact", (req, res) => {
  console.log("DOBRO DOSLI");
  res.render("contact");
});

router.post("/send", (req, res) => {
  const output = `
    <p>Imate novu poruku</p>
    <h3>Kontakt detalji</h3>
    <ul>  
      <li>Ime: ${req.body.name}</li>
      <li>Predmet: ${req.body.subject}</li>
      <li>Email: ${req.body.email}</li>
      
    </ul>
    <h3>Poruka</h3>
    <p>${req.body.message}</p>
  `;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "pipiklepic1@gmail.com", // generated ethereal user
      pass: password, // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: "pipiklepic1@gmail.com", // sender address
    to: "pipiklepic1@gmail.com", // list of receivers
    subject: "Node Contact Request", // Subject line
    text: "Hello world?", // plain text body
    html: output, // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    res.render("contact", { msg: "Email has been sent" });
  });
});

router.get("/login", (req, res) => {
  if (req.user) {
    //ako je logiran user redirektaj na '/'
    req.session = null;

    return res.redirect("/");
  }
  res.render("login");
});
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/admin",
    failureRedirect: "/login",
  })
);
router.get("/logout", (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect("/preminuli");
});

router.get("/", (req, res) => {
  Novosti.find({}, (err, sveNovosti) => {
    if (err) console.log(err);
    else {
      // console.log("PODACI" + sveNovosti);
      res.render("index", { novosti: sveNovosti });
    }
  });
});
router.get("/admin", isAdmin, (req, res) => {
  Novosti.find({}, (err, sveNovosti) => {
    if (err) console.log(err);
    else {
      res.render("adminPanel", { novosti: sveNovosti });
    }
  });
});

// show register form
router.get("/register", function (req, res) {
  res.render("register", { page: "register" });
});

//handle sign up logic
router.post("/register", function (req, res) {
  var newUser = new User({ username: req.body.username });
  if (req.body.adminCode === process.env.secretCode) {
    newUser.isAdmin = true;
  }
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      return res.render("register", { error: err.message });
    }
    passport.authenticate("local")(req, res, function () {
      req.flash(
        "success",
        "Successfully Signed Up! Nice to meet you " + req.body.username
      );
      res.redirect("/");
    });
  });
});
//handling login logic

// logout route
router.get("/logout", function (req, res) {
  req.logout();
  req.flash("success", "See you later!");
  res.redirect("/");
});

isAdmin = (req, res, next) => {
  if (req.user == undefined) {
    return res.redirect("/");
  } else if (req.user.isAdmin == false) {
    return res.redirect("/");
  }
  next();
};
module.exports = router;
