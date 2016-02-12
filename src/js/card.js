/* Card */

var card = (function () {
  var elemCardContainer = document.querySelector(".cardContainer");

  function show(point) {
    $(elemCardContainer).append("<span>" + point.name + "<span>");
  }
  return {
    show: show
  };
})();