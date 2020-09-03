jQuery(document).ready(function ($) {
  "use strict";

  $(window).scroll(function () {
    var scroll = $(window).scrollTop();
    var box = $(".header-text").height();
    var header = $("header").height();

    if (scroll >= box - header) {
      $("header").addClass("background-header");
    } else {
      $("header").removeClass("background-header");
    }
  });
});

$(document).ready(function () {
  $("img").click(function () {
    console.log("HALo");
    var src = $(this).attr("src");
    $(".modal").modal("show");
    $("#popup-img").attr("src", src);
  });
});

$(function () {
  if ($("textarea#ta").length) {
    console.log("USLi");
    CKEDITOR.replace("ta");
  }
});
