// Dependencies: path.js



// First run
intro.init();
intro.on("intro.open", function () {
  $(".content").show();
});

d3_queue.queue()
// .defer(d3.json, "data/world-50m.json")
.defer(d3.json, "data/world-110m.json")
.defer(d3.json, "data/cards.json")
.defer(d3.json, "data/points.json")
.awaitAll(function (error, data) {

  if (error) throw error;


  var world = data[0];

  var cards = _(data[1])
  .thru(function (c) {
    return normalizeCollection(c, ["assets", "text", "copyright", "films"]); // Normalize cards
  })
  .map(function (c) {
    return _.assign(c, { "points": [] }) // Empty points array 
  })
  .value();

  var points = _(data[2])
  .filter(function (p) { return p.cards.length > 0; }) // (1) Leave out points without cards
  .map(function (p) { // (2+3) Make it a collection of GeoJSON points and replace the card property (array of IDs) with an array of references to cards
    return _.assign(p, {
      type: "Point",
      coordinates: [p.lng, p.lat],
      cards: _.map(p.cards, function (c) {
        var card = _.find(cards, { id: c });
        card.points.push(p); // Push point to the points array
        return card;
      })
    });
  })
  .value();

  map.init(world, points);
  card.init(points);

  map.on("map.click", function (e, point) {
    setPath(point.id);
  });

  viewer.init($(".viewer"));

  $(".cardContainer").on("click", "img", function () {
    viewer.open(this.src, $(this).data("desc"));
  });

  $(window).on("resize", function () {
    window.setTimeout(function (){
      window.location.reload();
    }, 10); 
  });

  // Routing
  Path.root("#!/");
  Path.map("#!/").to(intro.open);
  Path.map("#!/place(/:pid)(/:cid)").to(navigate);
  Path.listen();

  function setPath(pid, cid) {
    pid = parseInt(pid, 10) || null;
    cid = parseInt(cid, 10) || null;
    if (pid) {
      if (cid) {
        window.location.hash = "#!/place/" + pid + "/" + cid;
      } else {
        window.location.hash = "#!/place/" + pid;
      }
    } else {
      window.location.hash = "#!/place/" + randomPointId();
    }
  }

  function navigate() { // Should not be called directly. Call setPath instead
    var v = validatePath(this.params.pid, this.params.cid);
    var pid = v.pid;
    var cid = v.cid;
    var point = _.find(points, { id: pid });

    $(".content").show();
    intro.close();

    if (v.isModified) { // If the location hash path was invalid, we update the location hash with the modified (valid) path
      setPath(pid, cid);
      return;
    }

    if (point) {
      $(_.map(points, "svg")).removeClass("on");
      $(point.svg).addClass("on");
      // page.close();
      map.panTo(point);
      card.show(point);
      return;
    }

    setPath(randomPointId()); // Fallback to random point
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
    out.isModified = (pid !== out.pid || cid !== out.cid); // True: path had to be modified by this function to yield a valid one
    return out;
  }

  function randomPointId() {
    return _.sample(points).id;
  }


});


// Returns a normalized collection where "unused" properties (passed as an array of names) are present with a null value.
// Used to prevent missing property errors with lodash template.
// See: stackoverflow.com/questions/15283741/#35485245
function normalizeCollection(collection, properties) {
  properties = properties || [];
  return _.map(collection, function (obj) {
    return _.assign({}, _.zipObject(properties, _.fill(Array(properties.length), null)), obj);
  });
}

