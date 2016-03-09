// Dependencies: path.js

d3_queue.queue()
// .defer(d3.json, "data/world-50m.json")
.defer(d3.json, "data/world-110m.json")
.defer(d3.json, "data/cards.json")
.defer(d3.json, "data/points.json")
.awaitAll(function (error, data) {

  if (error) throw error;

  var world = data[0];
  var cards = normalizeCollection(data[1], ["assets", "text", "copyright"]); // Normalize cards for lodash template (stackoverflow.com/questions/15283741/#35485245)
  var points = _(data[2])
  .map(function (d) {  // (1) Collection of GeoJSON points (w/ extra properties)
    return _.assign(d, {
      type: "Point",
      coordinates: [d.lng, d.lat]
    });
  })
  .map(function (p) {   // (2) Extend each point object with a cards property holding a reference to the cards referencing this point
    return _.assign(p, { cards: _.filter(cards, function (c) {
      return _.indexOf(c.points, p.id) > -1;
    })});
  })
  .value();

  cards = _.map(cards, function (card) { // Replace each point id by the reference to the actual point object
    return _.assign(card, { points: _.map(card.points, function (p) {
      return _.find(points, { id: p });
    })});
  });

  map.init(world, points);
  card.init(points);

  map.on("click", function (e, point) {
    setPath(point.id);
  });

  $(".cardContainer").on("click", "li", function () {
    setPath($(this).data("pointid"));
  });

  viewer.init($(".viewer"));

  $(".cardContainer").on("click", "img", function () {
    viewer.open(this.src);
  });



  // Routing

  Path.root("#!/");
  Path.map("#!/(:pid)(/:cid)").to(navigate);
  Path.listen();

  function setPath(pid, cid) {
    pid = parseInt(pid, 10) || null;
    cid = parseInt(cid, 10) || null;
    if (pid) {
      if (cid) {
        window.location.hash = "#!/" + pid + "/" + cid;
      } else {
        window.location.hash = "#!/" + pid;
      }
    } else {
      window.location.hash = "#!/";
    }
  }

  function navigate() { // Should not be called directly. Call setPath instead
    var v = validatePath(this.params.pid, this.params.cid);
    var pid = v.pid;
    var cid = v.cid;
    var point = _.find(points, { id: pid });

    if (v.isModified) {
      setPath(pid, cid);
      return;
    }

    if (point) {
      $(_.map(points, "svg")).removeClass("on");
      $(point.svg).addClass("on");
      map.panTo(point);
      card.show(point);
    }
  }

  function validatePath(pid, cid) { // Given 2 path parameters pid (point id) and cid (card id), returns a "valid" pair, following fallback rules when the given combination is invalid.
    pid = parseInt(pid, 10) || null;
    cid = parseInt(cid, 10) || null;
    var out = { pid: null, cid: null };
    var c = _.find(cards, { id: cid });
    var p;

    if (!_.isUndefined(c)) {
      p = _.find(c.points, { id: pid });
      out.cid = cid;
      out.pid = (_.isUndefined(p) ? c.points[0].id : p.id);
    } else {
      p = _.find(points, { id: pid });
      if (!_.isUndefined(p)) {
        out.pid = p.id;
        c = _.find(p.cards, { id: cid });
        if (!_.isUndefined(c)) out.cid = c.id;
      }
    }

    out.isModified = (pid !== out.pid || cid !== out.cid); // True: path has been modified to a valid one
    return out;
  }
  // End routing


});



// Returns a normalized collection where "unused" properties (passed as an array of names) are present with a null value.
// Used to prevent missing property errors with lodash template.
function normalizeCollection(collection, properties) {
  properties = properties || [];
  return _.map(collection, function (obj) {
    return _.assign({}, _.zipObject(properties, _.fill(Array(properties.length), null)), obj);
  });
}

