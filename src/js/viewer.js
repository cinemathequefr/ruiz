var viewer = (function () {

  var $elViewer;
  var $elViewerContent;
  var $elViewerClose;
  var $document = $(document);
  var _isOpen = false;

  function init() {
    $elViewer = arguments[0];
    $elViewer.append("<div class='viewerContent'></div><div class='viewerClose'></div>");
    $elViewerContent = $elViewer.find(".viewerContent");
    $elViewerClose = $elViewer.find(".viewerClose");
  }

  function open(src) {
    // TODO: resize image to fit viewport (use naturalWidth, naturalHeight to get real dimensions)
    $elViewerContent.append("<img src='" + src +"'>");
    $elViewer.fadeIn(250, function () {
      _isOpen = true;
      $elViewerClose.one("click", close);
      $document.one("keydown", function (e) {
        if (e.which === 27) {
          $elViewerClose.addClass("on");
        }
      });
      $document.one("keyup", function (e) { // Close with Escape key
        if (e.which  === 27) {
          $elViewerClose.removeClass("on");
          close();
        }
      });
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