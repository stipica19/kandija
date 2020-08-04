const express = require("express");
const router = express.Router();

const Novosti = require("../models/posts");
const { response } = require("express");

router.get("/", (req, res) => {
  Novosti.find({ category: "Preminuli" }, (err, preminuli) => {
    res.render("preminuli", { preminuli: preminuli });
  });
});

module.exports = router;
