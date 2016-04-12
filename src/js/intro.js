var intro = (function () {
  var isOpen = false;
  var isReady = false;
  var $elem = $(".splash").hide();
  var $enter = $elem.children(".title").hide();
  var video;

  function init() {
    $elem.vide({ mp4: "http://cf.pasoliniroma.com/static/ruiz/video/trois-couronnes-du-matelot-3.mp4" }, { loop: true, muted: true, position: "50% 50%" });
    video = $elem.data("vide");
    $(video.getVideoObject()).on("play", function () {
      isReady = true;
      $.publish("intro.ready");
    });
  }
  
  function open() {
    console.log("Open up!");
    if (isOpen === true) return;
    if (isReady === true) $.publish("intro.ready");
    on("intro.ready", function () {
      $elem.fadeIn(1000, function () {
        $enter.fadeIn(250);
        $.publish("intro.open");
      });
    });
    isOpen = true;
  }

  function close() {
    if (isOpen === false) return;
    $elem.fadeOut(750, function () {
      if (!_.isUndefined(video)) video.destroy();
    });
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
  }
})();