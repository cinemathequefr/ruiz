/**
 * Card
 * Manages the card pane (right half of window)
 *
 */
var card = (function () {
  var elemCardContainer = document.querySelector(".cardContainer");

  var template = {};
  _.templateSettings.interpolate = /{{([\s\S]+?)}}/g; // Set mustache-style interpolate delimiters
  template.card = _.template("<div class='card'><h2>{{ id }}</h2><% _.forEach(img, function (i) { %><img src='../ruiz-assets/img/{{ i }}.jpg'><% }); %><p>{{ title }}</p><p>Pork belly actually craft beer, pop-up yr umami waistcoat chambray deep v drinking vinegar. Vegan next level godard tousled kogi leggings. Irony four dollar toast swag selvage. Pop-up hella lumbersexual, normcore lomo jean shorts flannel franzen artisan iPhone humblebrag shoreditch actually four dollar toast bespoke. Wolf cardigan celiac, hoodie farm-to-table ennui knausgaard yr trust fund. Pabst affogato blue bottle tattooed, lumbersexual drinking vinegar squid literally asymmetrical paleo artisan you probably haven't heard of them direct trade twee. 90's DIY retro fanny pack you probably haven't heard of them hammock gluten-free cray.</p></div>");

  var points, cards;

  function init() {
    points = arguments[0];
    cards = arguments[1];
    console.log(cards);
    $(elemCardContainer).perfectScrollbar();
  }


  function show(point) {
    _.forEach(point.cards, function (c, i) {
      var cardData = _.find(cards, { id: c });
      console.log(cardData);
      var $card =  $(template.card(cardData)).prependTo($(elemCardContainer));
      window.setTimeout(function () {
          // $card.removeClass("collapsed");
        // $card.slideDown(500);
      }, (i + 1) * 500);
    });

    $(elemCardContainer).perfectScrollbar("update");
  }

  return {
    init: init,
    show: show
  };

})();
