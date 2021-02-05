const express = require("express");
const multer = require("multer");
const router = express.Router();

const Novosti = require("../models/posts");

isAdmin = (req, res, next) => {
  if (req.user == undefined) {
    return res.redirect("/");
  } else if (req.user.isAdmin == false) {
    return res.redirect("/");
  }
  next();
};

siteViewsUp = (id) => {
  Novosti.findByIdAndUpdate({ _id: id }, { $inc: { visit: 1 } }, { new: true })
    .then((data) => {
      console.log(data.visit);
    })
    .catch((err) => {
      console.log(err);
    });
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

router.get("/add", isAdmin, (req, res) => {
  res.render("addPost");
});
router.post("/", isAdmin, (req, res) => {
  console.log("Usli smo u post od novosit");
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
    } else {
      if (req.file == undefined) {
        console.log("greska");
        res.render("addPost", {
          msg: "Error: No File Selected!",
        });
      } else {
        console.log(req.file);
        const novost = new Novosti({
          naslov: req.body.naslov,
          images: req.file.filename,
          description: req.body.description,
          category: req.body.category,
          datum: new Date(),
        });
        novost
          .save()
          .then((res) => {
            console.log("Uspijesno smo spremili novost u bazu" + res);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  });
});

router.get("/edit/:id", isAdmin, (req, res) => {
  Novosti.findById(req.params.id, (err, trazenaNovost) => {
    if (err) {
      console.log("Greška u traženju NOVOSTI ZA UPDATE" + err);
    } else {
      res.render("updatePost", { novost: trazenaNovost });
    }
  });
});

router.post("/:id", isAdmin, (req, res) => {
  Novosti.findByIdAndUpdate(req.params.id, req.body, (err, updateNovost) => {
    if (err) {
      console.log("GREŠKAA KOD POST ZAHTJEVA ZA UPDATE" + err);
      res.redirect("/");
    } else {
      console.log("Uspjesno azuriran POST", updateNovost);
    }
    res.redirect("/");
  });
});

router.delete("/delete/:id", isAdmin, (req, res) => {
  Novosti.findByIdAndRemove(req.params.id, (err, brisanaNovost) => {
    if (err) {
      console.log("Greška prilikom brisanja NOVOSTI" + err);
    } else {
      console.log("Uspiješno izbrisana novost" + brisanaNovost);
      res.status(200).send(brisanaNovost);
    }
  });
});

/*POJEDINACNI POST */

router.get("/:id", (req, res) => {
  siteViewsUp(req.params.id);

  Novosti.findById(req.params.id, (err, novost) => {
    if (err) {
      console.log(err);
    } else {
      res.render("postt", { novost: novost });
    }
  });
});
/*=================================================================== */
router.get("/", (req, res) => {
  console.log("USLI SMO U GET" + req.query.search);

  var perPage = 6;
  var pageQuery = parseInt(req.query.page, 10);
  var pageNum = pageQuery && pageQuery >= 1 ? pageQuery : 1;
  var noMatch = false;

  if (req.query.search) {
    console.log("USLI SMO U GET IF --" + req.query.search);
    const regex = new RegExp(escapeRegex(req.query.search), "gi");
    Novosti.find({ naslov: regex })
      .skip((pageNum - 1) * perPage)
      .limit(perPage)
      .exec(function (err, artikl) {
        if (err || !artikl) {
          req.flash("error", "Something Went Wrong");
          return res.redirect("/novosti");
        }
        Novosti.find({ naslov: regex })
          .count()
          .exec(function (err, count) {
            var totalPages = Math.ceil(count / perPage);

            if (pageNum < 1 || pageNum > totalPages) {
              res.redirect("/novosti");
            } else {
              res.render("blog", {
                novosti: artikl,
                page: "blog",
                search: false,
                current: pageNum,
                totalPages: totalPages,
              });
            }
          });
      });
  } else {
    console.log("USLI SMO U GET ELSE  " + req.query.search);
    Novosti.find({})
      .sort("-datum")
      .skip((pageNum - 1) * perPage)
      .limit(perPage)
      .exec(function (err, artikl) {
        if (err || !artikl) {
          req.flash("error", "Something Went Wrong");
          return res.redirect("/novosti");
        }
        Novosti.countDocuments().exec(function (err, count) {
          var totalPages = Math.ceil(count / perPage);

          if (err) {
            req.flash("error", "Something Went Wrong");
            res.redirect("/novosti");
          } else if (pageNum < 1 || pageNum > totalPages) {
            //req.flash("error", "Page Index Out of Range"); //pado server zbog ovog :D
            res.redirect("/");
          } else {
            console.log(artikl);
            res.render("blog", {
              novosti: artikl,
              page: "blog",
              search: false,
              current: pageNum,
              totalPages: totalPages,
            });
          }
        });
      });
  }
});
/*==================================================================*/
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;
