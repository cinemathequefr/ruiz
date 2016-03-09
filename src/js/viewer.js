var viewer = (function () {

  var $elViewer;
  var $elViewerContent;
  var $elViewerClose;
  var $elViewerImg;
  var _isOpen = false;

  function init() {
    $elViewer = arguments[0];
    $elViewer.append("<div class='viewerContent'></div><div class='viewerClose'></div>");
    $elViewerContent = $elViewer.children(".viewerContent");
    $elViewerClose = $elViewer.children(".viewerClose");
    $(window).on("resize", windowResize);
  }

  function open(src) {
    $elViewerContent.append("<img src='" + src +"'>");
    $elViewerImg = $elViewerContent.children("img");
    windowResize();
    $elViewer.fadeIn(250, function () {
      _isOpen = true;
      $elViewerClose.one("click", close);
      $(document).one("keydown", function (e) {
        if (e.which === 27) {
          $elViewerClose.addClass("on");
        }
      });
      $(document).one("keyup", function (e) { // Close with Escape key
        if (e.which  === 27) {
          $elViewerClose.removeClass("on");
          close();
        }
      });
    });
  }

  function windowResize() {
    var ww = $(window).width() - 24; // 2*12px margin
    var wh = $(window).height() - 80; // 2*12px margin + some height for caption
    var f = fitInBox($elViewerImg[0].naturalWidth, $elViewerImg[0].naturalHeight, ww, wh, true);

    $elViewerImg.css({
      width: f.width + "px",
      height: f.height + "px",
      position: "absolute",
      top: "12px",
      left: ((ww - f.width) / 2) + "px"
    });

  }


  function close() {
    $elViewer.fadeOut(250, function () {
      $elViewerContent.empty();
      _isOpen = false;
      $(this).hide();
    })
  }

  function isOpen() {
    return _isOpen;
  }


  function fitInBox(width, height, maxWidth, maxHeight, isExpandable) {
    var aspect = width / height;
    var initWidth = width;
    var initHeight = height;
    if (width > maxWidth || height < maxHeight) {
      width = maxWidth; height = Math.floor(width / aspect);
    }
    if (height > maxHeight || width < maxWidth) {
      height = maxHeight; width = Math.floor(height * aspect);
    }
    if (!!isExpandable === false && (width >= initWidth || height >= initHeight)) {
      width = initWidth; height = initHeight;
    }
    return { width: width, height: height };
  }

  return {
    init: init,
    open: open,
    isOpen: isOpen
  };

})();