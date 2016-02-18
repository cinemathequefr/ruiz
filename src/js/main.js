d3_queue.queue()
.defer(d3.json, "data/world-110m.json")
.defer(d3.json, "data/cards.json")
.defer(d3.json, "data/points.json")
.awaitAll(function (error, data) {

  if (error) throw error;

  var world = data[0];
  var cards = normalizeCollection(data[1], ["img", "video"]); // Normalize cards for lodash template (stackoverflow.com/questions/15283741/#35485245)
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


// Returns a normalized collection where "unused" properties (passed as an array of names) are present with a null value.
// Used to prevent missing property errors with lodash template.
function normalizeCollection (collection, properties) {
  properties = properties || [];
  return _.map(collection, function (obj) {
    return _.assign({}, _.zipObject(properties, _.fill(Array(properties.length), null)), obj);
  });
}