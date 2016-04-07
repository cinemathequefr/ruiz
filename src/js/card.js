

/**
 * Card
 * Manages the card pane (right half of window)
 *
 */
var card = (function () {
  var elemCardContainer = document.querySelector(".cardContainer");
  var renderTemplate = {};
  var points, cards;
  var deck = []; // Array: DOM elements of cards

  _.templateSettings.interpolate = /{{([\s\S]+?)}}/g; // Set mustache-style interpolate delimiters
  renderTemplate.card = _.template("<div class='card' data-id='{{ id }}'><div class='mediaContainer'><% _.forEach(assets, function (asset) { %><div class='asset'><% if (asset.type === 'img') { %><img src='http://cf.pasoliniroma.com/static/ruiz/img/{{ asset.id }}.jpg'><% } else if (asset.type === 'video') { %><iframe class='video' src='//player.vimeo.com/video/{{ asset.id }}' frameborder='0'></iframe><% } %></div><% }); %></div><h2>{{ cardTitle }}</h2><p>{{ text }}<% var places = _.filter(points, function (p) { return p.id !== pointId; }); if (places.length > 0) { %> <span class='places'>(Voir aussi&nbsp;: <% _.forEach(places, function (p, i) { %><a href='#!/{{ p.id }}'>{{ p.name }}</a><% if (i + 1 < places.length) { %>, <% }}); %>)</span><% } %></p></div>");

  function init() {
    points = arguments[0];
    $(elemCardContainer).perfectScrollbar();
  }


  function show(point) {
    _.forEach(_.reverse(point.cards), function (card, i) {
      card.text = card.text || "Quam quidem partem accusationis admiratus sum et moleste tuli potissimum esse Atratino datam. Neque enim decebat neque aetas illa postulabat neque, id quod animadvertere poteratis, pudor patiebatur optimi adulescentis in tali illum oratione versari. Vellem aliquis ex vobis robustioribus hunc male dicendi locum suscepisset; aliquanto liberius et fortius et magis more nostro refutaremus istam male dicendi licentiam. Tecum, Atratine, agam lenius, quod et pudor tuus moderatur orationi meae et meum erga te parentemque tuum beneficium tueri debeo.";
      deck.push($(renderTemplate.card(_.assign({}, card, { // Extra data for the card template
        pointId: point.id,
        cardTitle: cardTitle(point.name, card.title, (point.cards.length - i))
      }))));
    });

    (function display(deck) {
      if (deck.length === 0) {
        $(elemCardContainer).scrollTop(0).perfectScrollbar("update");
        $.publish("load");
        return;
      }
      var $card = deck[0];
      if (_.isUndefined($card.isRemove) === false) {
        deck.shift();
        $card.animate({ opacity: 0 }, 250, "easeOutQuad", function () {
          $card.remove();
          display(deck);
        });
      } else {
        _.assign($card, { isRemove: true }); // Marked for removal on next call
        $card.imagesLoaded(function () { // https://github.com/desandro/imagesloaded

          $card.css({ visibility: "none", opacity: 0 }).prependTo($(elemCardContainer));
          var h = $card.height();

          $card
          .css({ height: 0, visibility: "visible" })
          .animate({ height: h + "px", opacity: 1 }, 450, "easeOutQuad", function () {
            window.setTimeout(function () {
              display(_.tail(deck));
            }, 100);
          });
        });
      }
    })(deck);
  }

  function on(event, callback) {
    $.subscribe(event, callback);
  }

  function cardTitle(p, c, i) {
    var o = "";
    p = p || "";
    c = c || "";
    // if (p != "") o = o + p + " (" + i + ")";
    if (p != "") o = o + p;
    if (p != "" && c != "") o = o + "&nbsp;: ";
    if (c != "") o = o + c;
    return o;
  };

  return {
    init: init,
    on: on,
    show: show
  };

})();
