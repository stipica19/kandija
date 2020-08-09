//kontakti forma za slanje emaila
//pocetna
const express = require("express");
const router = express.Router();

router.get("/ozupi", (req, res) => {
  console.log("DOBRO DOSLI");
  res.render("ozupi");
});

router.get("/contact", (req, res) => {
  console.log("DOBRO DOSLI");
  res.render("contact");
});

module.exports = router;
