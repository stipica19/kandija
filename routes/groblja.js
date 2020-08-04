const express = require("express");
const multer = require("multer");
const router = express.Router();

const path = require("path");
const Groblje = require("../models/groblja");

//Set Storage Engine
const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
// INIT Upload
const upload = multer({
  storage: storage,
}).single("images");

router.get("/", (req, res) => {
  res.render("addGroblje");
});

router.post("/upload", (req, res) => {
  console.log("USao u post");
  upload(req, res, (err) => {
    if (err) {
      res.render("addGroblja", { msg: err });
    } else {
      console.log(req.file);
      const groblje = new Groblje({
        images: req.file.filename,
        description: req.body.description,
        groblje: req.body.groblje,
      });
      groblje
        .save()
        .then((res) => {
          console.log(`Uspjesno spremljeno groblje  ${req.body.groblje}`);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
});

module.exports = router;
