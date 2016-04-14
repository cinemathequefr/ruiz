var intro = (function () {
  // var $intro = $(".intro");
  // var $splash = $intro.find(".splash");
  // var $title = $splash.find(".title");
  var isOpen = false;
  var v;


  function init() {
    $splash.vide({ mp4: "http://cf.pasoliniroma.com/static/ruiz/video/intro-1.mp4" }, { loop: true, muted: true, position: "50% 0%" });
    v = $splash.data("vide");
    $intro.perfectScrollbar({ suppressScrollX: true });
    $(".enter").on("click", function () {
      $.publish("intro.enter");
    });
  }

  function open() {
    if (isOpen === true) return;
    v.getVideoObject().play();
    $intro.fadeIn(500);
    $intro.scrollTop(0);
    // $.publish("intro.open");
    isOpen = true;
  }

  function close() {
    if (isOpen === false) return;
    $intro.fadeOut(500);
    v.getVideoObject().pause();
    isOpen = false;
  }

  function on(event, callback) {
    $.subscribe(event, callback);
  }

  return {
    init: init,
    open: open,
    close: close,
    on: on
  };
})();