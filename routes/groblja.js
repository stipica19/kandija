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
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("images");

function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

router.get("/", (req, res) => {
  Groblje.find({}, (err, groblja) => {
    if (err) {
      console.log("Greška kod dohvacanja groblja" + err);
    } else {
      console.log(groblja);
      res.render("groblja", { groblja: groblja });
    }
  });
});

router.get("/add", (req, res) => {
  res.render("addGroblje");
});

router.post("/upload", (req, res) => {
  console.log("USao u post");
  upload(req, res, (err) => {
    if (err) {
      res.render("addGroblja", { msg: err });
    } else {
      if (req.file == undefined) {
        res.render("addGroblje", {
          msg: "Error: No File Selected!",
        });
      } else {
        console.log(req.file);
        const groblje = new Groblje({
          images: req.file.filename,
          description: req.body.description,
          groblje: req.body.groblje,
        });
        Groblje.findOne({ groblje: req.body.groblje }, (err, rez) => {
          if (rez) {
            console.log("Postoji groblje s tim imenom");
            Groblje.findOneAndUpdate(
              { groblje: req.body.groblje },
              { $push: { images: req.file.filename } },
              (err, sss) => {
                if (err) {
                  console.log(err);
                } else {
                  console.log("fafaf " + groblje.images);
                }
              }
            );
          } else {
            console.log("NE Postoji groblje s tim imenom");
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
      }
    }
  });
});

router.get("/:groblje", (req, res) => {
  console.log(req.params.groblje);
  Groblje.find({ groblje: req.params.groblje }, (err, trazenoGroblje) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`Usli smo u rutu ${req.params.groblje}`);
      res.render("groblje", { groblje: trazenoGroblje });
    }
  });
});

module.exports = router;
