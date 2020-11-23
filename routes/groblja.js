const express = require("express");
const multer = require("multer");
const router = express.Router();

const path = require("path");
const Groblje = require("../models/groblja");

router.use(express.static("views"));
isAdmin = (req, res, next) => {
  if (req.user == undefined) {
    return res.redirect("/");
  } else if (req.user.isAdmin == false) {
    return res.redirect("/");
  }
  next();
};
//Set Storage Engine
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
// INIT Upload

var upload = multer({ storage: storage, limits: { fieldSize: 100000 } }).single(
  "images"
);

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

router.get("/add", isAdmin, (req, res) => {
  res.render("addGroblje");
});

router.post("/upload", isAdmin, (req, res) => {
  console.log("USao u post");
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
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
                  res.redirect(`/groblja/${req.body.groblje}`);
                }
              }
            );
          } else {
            console.log("NE Postoji groblje s tim imenom");
            groblje
              .save()
              .then((res) => {
                console.log(`Uspjesno spremljeno groblje  ${req.body.groblje}`);
                res.redirect(`/groblja/${req.body.groblje}`);
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
      res.render("Groblje", { groblje: trazenoGroblje });
    }
  });
});

/*EDITOVANJE GROBLJA */
router.get("/:groblje/edit", (req, res) => {
  Groblje.findOne({ groblje: req.params.groblje }, (err, trazenoGroblje) => {
    if (err) {
      console.log("Greška u traženjuGROBLJA ZA UPDATE " + err);
    } else {
      //console.log("Nadjeno je + " + trazenoGroblje);
      res.render("updateGroblje", { groblje: trazenoGroblje });
    }
  });
});
router.post("/:groblje/edit", (req, res) => {
  console.log("POST ZA EDIT GROBLJA");
});

router.post("/delete/:images", (req, res) => {
  console.log("izbrisansssssssssssssssssssso");
  Groblje.findOneAndUpdate(
    { images: req.params.images },
    { $pull: { images: req.params.images } },
    { new: true },
    (err, node) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Uspiješno izbrisana slika od groblja" + node.images);
        res.json({ success: true });
      }
    }
  );
});

/*AZURIRANJE GROBLJA JEDNOG */
router.post("/:groblje", isAdmin, (req, res) => {
  console.log("DOslo za update :  " + req.body.description);
  Groblje.findOneAndUpdate(
    { groblje: req.params.groblje },
    { $set: { description: req.body.description } },
    { new: true },
    (err, azuriranoGroblje) => {
      if (err) {
        console.log(err);
      } else {
        return res.json({ success: true });
        console.log("USPJESNO AZURIRANJA GROBLJA" + azuriranoGroblje);
      }
      res.redirect("/groblja/" + req.params.groblje);
    }
  );
});

module.exports = router;
