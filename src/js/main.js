



map.load("data/world-110m.json", "data/places.json");

map.on("ready", function () {
  var points = map.points();

  map.on("click", function (e, point) {
    $(_.map(points, "svg")).removeClass("on");
    $(point.svg).addClass("on");
    map.panTo(point);
    card.show(point);
  });

  // Just for fun: night and day toggler
  $(".ctrl-day").on("click", function () {
    $("svg").toggleClass("night");
  });

});