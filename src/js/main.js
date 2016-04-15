var $intro = $(".intro");
var $splash = $intro.find(".splash");
var $title = $splash.find(".title");

$(function() {

  intro.init();

  d3_queue.queue()
    .defer(d3.json, "data/world-110m.json")
    .defer(d3.json, "data/cards.json")
    .defer(d3.json, "data/points.json")
    .awaitAll(function(error, data) {
      if (error) throw error;
      var world, cards, points;

      world = data[0];
      cards = _(data[1])
        .thru(function(c) {
          return normalizeCollection(c, ["assets", "text", "copyright"]); // Normalize cards
        })
        .map(function(c) {
          return _.assign(c, {
            "points": []
          });
        })
        .value();
      points = _(data[2])
        .filter(function(p) {
          return p.cards.length > 0;
        }) // (1) Leave out points without cards
        .map(function(p) { // (2+3) Make it a collection of GeoJSON points and replace the card property (array of IDs) with an array of references to cards
          return _.assign(p, {
            type: "Point",
            coordinates: [p.lng, p.lat],
            cards: _.map(p.cards, function(c) {
              var card = _.find(cards, {
                id: c
              });
              card.points.push(p);
              return card;
            })
          });
        })
        .value();

      // Initialization
      map.init(world, points);
      card.init(points);
      viewer.init($(".viewer"));

      // DOM Bindings
      $(".anchor").on("click", function() {
        window.location.hash = "#!/";
      });

      $(".cardContainer").on("click", "img", function() {
        viewer.open(this.src, $(this).data("desc"));
      });

      $(window).on("resize", function() {
        window.setTimeout(function() {
          window.location.reload();
        }, 10);
      });

      // Events
      intro.on("intro.enter", function() {
        setPath(randomPointId());
      });

      map.on("map.click", function(e, point) {
        setPath(point.id);
      });

      // Routing
      Path.root("#!/");
      Path.map("#!/").to(function() {
        intro.open();
        card.empty();
      });

      Path.map("#!/(:pid)(/:cid)").to(navigate);
      Path.rescue(_.noop);
      Path.listen();

      function navigate() { // Should not be called directly - call setPath instead
        var v = validatePath(this.params.pid, this.params.cid);
        var pid = v.pid;
        var cid = v.cid;
        var point = _.find(points, {
          id: pid
        });

        $(".content").show();
        intro.close();

        if (v.isModified) { // If the location hash path was invalid, we update the location hash with the modified (valid) path
          setPath(pid, cid);
          return;
        }
        if (point) {
          $(_.map(points, "svg")).removeClass("on");
          $(point.svg).addClass("on");
          map.panTo(point);
          card.show(point);
          return;
        }
        setPath(randomPointId()); // Fallback to random point
      }

      function randomPointId() {
        return _.sample(points).id;
      }

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
          window.location.hash = "#!/" + randomPointId();
        }
      }

      function validatePath(pid, cid) { // Given 2 path parameters pid (point id) and cid (card id), returns a "valid" pair, following fallback rules when the given combination is invalid.
        pid = parseInt(pid, 10) || null;
        cid = parseInt(cid, 10) || null;
        var out = {
          pid: null,
          cid: null
        };
        var c = _.find(cards, {
          id: cid
        });
        var p;
        if (!_.isUndefined(c)) {
          p = _.find(c.points, {
            id: pid
          });
          out.cid = cid;
          out.pid = (_.isUndefined(p) ? c.points[0].id : p.id);
        } else {
          p = _.find(points, {
            id: pid
          });
          if (!_.isUndefined(p)) {
            out.pid = p.id;
            c = _.find(p.cards, {
              id: cid
            });
            if (!_.isUndefined(c)) out.cid = c.id;
          }
        }
        out.isModified = (pid !== out.pid || cid !== out.cid); // True: path had to be modified by this function to yield a valid one
        return out;
      }

    });

  // Returns a normalized collection where "unused" properties (passed as an array of names) are present with a null value.
  // Used to prevent missing property errors with lodash template.
  // See: stackoverflow.com/questions/15283741/#35485245
  function normalizeCollection(collection, properties) {
    properties = properties || [];
    return _.map(collection, function(obj) {
      return _.assign({}, _.zipObject(properties, _.fill(Array(properties.length), null)), obj);
    });
  }

});