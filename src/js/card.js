

/**
 * Card
 * Manages the card pane (right half of window)
 *
 */
var card = (function () {
  var elemCardContainer = document.querySelector(".cardContainer");

  var renderTemplate = {};
  _.templateSettings.interpolate = /{{([\s\S]+?)}}/g; // Set mustache-style interpolate delimiters
  renderTemplate.card = _.template("<div class='card' data-id='{{ id }}'><div class='mediaContainer'><% _.forEach(assets, function (asset) { %><div class='asset'><% if (asset.type === 'img') { %><img src='http://cf.pasoliniroma.com/static/ruiz/img/{{ asset.id }}.jpg'><% } else if (asset.type === 'video') { %><iframe class='video' src='//player.vimeo.com/video/{{ asset.id }}' frameborder='0'></iframe><% } %></div><% }); %></div><p><span class='title'>{{ cardTitle }}</span> {{ text }}</p><ul class='places'><% _.forEach(_.filter(points, function (p) { return p.id !== pointId; }), function (p) { %><li data-pointId='{{ p.id }}'>{{ p.name }}</li><% }); %></ul></div>");

  var points, cards;
  var deck = []; // Array: DOM elements of cards

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
        $(elemCardContainer).perfectScrollbar("update");
        $.publish("load");
        return;
      }
      var $card = deck[0];
      if (_.isUndefined($card.isRemove) === false) {
        deck.shift();
        $card.slideUp(250, function () {
          $card.remove();
          display(deck);
        });
      } else {
        _.assign($card, { isRemove: true }); // Marked for removal on next call
        $card.imagesLoaded(function () { // https://github.com/desandro/imagesloaded
          $card.hide().prependTo($(elemCardContainer)).slideDown(350, function () {
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
    if (p != "") o = o + p + " (" + i + ")";
    if (p != "" && c != "") o = o + "&nbsp;: ";
    if (c != "") o = o + c;
    console.log(o);
    return o;
  };




  return {
    init: init,
    on: on,
    show: show
  };

})();
