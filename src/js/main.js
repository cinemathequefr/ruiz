

d3_queue.queue()
.defer(d3.json, "data/world-110m.json")
.defer(d3.json, "data/cards.json")
.defer(d3.json, "data/points.json")
.awaitAll(function (error, data) {

  var world = data[0];
  var cards = data[1];
  var points = _(data[2])
  .map(function (d) {  // (1) Collection of GeoJSON points (w/ extra properties)
    return _.assign(d, {
      type: "Point",
      coordinates: [d.lng, d.lat]
    });
  })
  .map(function (p) { // (2) Extend with a cards property that holds the array of ids of cards referencing this point
    return _.assign(p, { cards: _.map(_.filter(cards, function (c) {
      return _.indexOf(c.points, p.id) > -1;
    }), "id") });
  })
  .value();

  map.init(world, points);
  card.init(points, cards);

  map.on("click", function (e, point) {
    $(_.map(points, "svg")).removeClass("on");
    $(point.svg).addClass("on");
    map.panTo(point);
    card.show(point);
  });






});








/*
map.load("data/world-110m.json", "data/places.json");

map.on("ready", function () {


  d3_queue.queue()
  .defer(d3.json, "data/cards.json")
  .awaitAll(function (error, data) {
    if (error) throw error;

    var cards = data[0];

    var points = _.map(map.points(), function (p) { // map.points() is extended with a cards property that holds the array of ids of cards referencing this point
      return _.assign(p, { cards: _.map(_.filter(cards, function (c) {
        return _.indexOf(c.points, p.id) > -1;
      }), "id") });
    });

    // DOM Bindings
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
});
*/