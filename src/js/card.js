/**
 * Card
 * Manages the card pane (right half of window)
 *
 */
var card = (function () {
  var elemCardContainer = document.querySelector(".cardContainer");

  var template = {};
  _.templateSettings.interpolate = /{{([\s\S]+?)}}/g; // Set mustache-style interpolate delimiters
  template.card = _.template("<div class='card' data-id='{{ id }}'><% _.forEach(img, function (i) { %><img src='../ruiz-assets/img/{{ i }}.jpg'><% }); %><p>{{ title }}</p><p>Pork belly actually craft beer, pop-up yr umami waistcoat chambray deep v drinking vinegar. Vegan next level godard tousled kogi leggings. Irony four dollar toast swag selvage. Pop-up hella lumbersexual, normcore lomo jean shorts flannel franzen artisan iPhone humblebrag shoreditch actually four dollar toast bespoke. Wolf cardigan celiac, hoodie farm-to-table ennui knausgaard yr trust fund. Pabst affogato blue bottle tattooed, lumbersexual drinking vinegar squid literally asymmetrical paleo artisan you probably haven't heard of them direct trade twee. 90's DIY retro fanny pack you probably haven't heard of them hammock gluten-free cray.</p><ul class='places'><% _.forEach(points, function (p) { %><li data-pointId='{{ p.id }}'>{{ p.name }}</li><% }); %></ul></div>");

  var points, cards;


  function init() {
    points = arguments[0];
    cards = arguments[1];
    $(elemCardContainer).perfectScrollbar();
  }


  function show(point) {
    $(elemCardContainer).empty();
    _.forEach(point.cards, function (c, i) {
      var cardData = _.find(cards, { id: c });
      var $card =  $(template.card(cardData)).hide().prependTo($(elemCardContainer));
      window.setTimeout(function () {
        $card.slideToggle(350, function () {
          $(elemCardContainer).perfectScrollbar("update");
        });
      }, (i + 1) * 250);
    });
  }

  return {
    init: init,
    show: show
  };

})();
