const express = require("express");
const router = express.Router();

const Novosti = require("../models/posts");

router.get("/", (req, res) => {
  Novosti.find({}, (err, sveNovosti) => {
    if (err) console.log(err);
    else {
      //console.log("PODACI" + sveNovosti);
      res.render("blog", { novosti: sveNovosti });
    }
  });
});
router.post("/", (req, res) => {
  console.log("Usli smo u post od novosit");
  const novost = new Novosti({
    naslov: req.body.naslov,
    images: req.body.images,
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
  res.redirect("/");
});

router.get("/:id/edit", (req, res) => {
  Novosti.findById(req.params.id, (err, trazenaNovost) => {
    if (err) {
      console.log("Greška u traženju NOVOSTI ZA UPDATE" + err);
    } else {
      res.render("updatePost", { novost: trazenaNovost });
    }
  });
});

router.post("/:id", (req, res) => {
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

router.delete("/delete/:id", (req, res) => {
  Novosti.findByIdAndRemove(req.params.id, (err, brisanaNovost) => {
    if (err) {
      console.log("Greška prilikom brisanja NOVOSTI" + err);
    } else {
      console.log("Uspiješno izbrisana novost" + brisanaNovost);
    }
  });
});

/*POJEDINACNI POST */

router.get("/:id", (req, res) => {
  Novosti.findById(req.params.id, (err, novost) => {
    if (err) {
      console.log(err);
    } else {
      res.render("postt", { novost: novost });
    }
  });
});

router.get("/", function (req, res) {
  var perPage = 6;
  var pageQuery = parseInt(req.query.page, 10);
  var pageNum = pageQuery && pageQuery >= 1 ? pageQuery : 1;
  var noMatch = false;

  if (req.query.search) {
    Novosti.find({ kategorija: { $in: req.query.search } })
      .skip((pageNum - 1) * perPage)
      .limit(perPage)
      .exec(function (err, artikl) {
        if (err || !artikl) {
          req.flash("error", "Something Went Wrong");
          return res.redirect("/shop");
        }
        Novosti.find({ kategorija: { $in: req.query.search } })
          .count()
          .exec(function (err, count) {
            var totalPages = Math.ceil(count / perPage);

            if (pageNum < 1 || pageNum > totalPages) {
              res.redirect("/shop");
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
    Novosti.find({})
      .skip((pageNum - 1) * perPage)
      .limit(perPage)
      .exec(function (err, artikl) {
        if (err || !artikl) {
          req.flash("error", "Something Went Wrong");
          return res.redirect("/shop");
        }
        Artikl.count().exec(function (err, count) {
          var totalPages = Math.ceil(count / perPage);

          if (err) {
            req.flash("error", "Something Went Wrong");
            res.redirect("/shop");
          } else if (pageNum < 1 || pageNum > totalPages) {
            //req.flash("error", "Page Index Out of Range"); //pado server zbog ovog :D
            res.redirect("/shop");
          } else {
            res.render("shop", {
              artikl: artikl,
              page: "shop",
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
