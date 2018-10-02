  $(function() {
    function KepMouseWheelSmooth() {
      var t = this;
      t.scrollTargetPos = 0;
      t.scrollPos = 0;
      t.delta;
      t.timeoutId;
      t.decelerationBase = 0.1;
      t.wheelFlag = false;
      t.mouseWheelEvent = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
      t.bodyH = $('body').innerHeight();
      t.winH = $(window).height();
      $(document).on(t.mouseWheelEvent, function(e) {
        if(!t.wheelFlag){
          var selection = getSelection();
          if(selection.rangeCount > 0){
            var range = selection.getRangeAt(0);
            selection.removeAllRanges();
          }
        }
        e.preventDefault();
        clearTimeout(t.timeoutId);
        t.wheelFlag = true;
        t.delta = e.originalEvent.deltaY ? -(e.originalEvent.deltaY) : e.originalEvent.wheelDelta ? e.originalEvent.wheelDelta : -(e.originalEvent.detail);

        // firefoxのみスクロール量を15倍に変更
        if(userAgent.indexOf('firefox') != -1) t.delta = t.delta * 15;

        t.scrollPos -= t.delta;
        if (t.scrollPos < 0) t.scrollPos = 0;
        if (t.scrollPos > t.bodyH - t.winH) t.scrollPos = t.bodyH - t.winH;
          t.timeoutId = setTimeout(function() {t.wheelFlag = false; }, 1000);
          return false;
        });
        $('body').on('mouseleave', function(e) {
          clearTimeout(t.timeoutId);
          t.wheelFlag = false;
          t.deceleration = 0;
          return false;
        });
        $('body').on('mouseenter', function(e) {
          t.deceleration = t.decelerationBase;
          return false;
        });
        t.scrollFunc = function() {
          if (!t.wheelFlag) {
            t.scrollPos = $(document).scrollTop();
            t.scrollTargetPos = $(document).scrollTop();
          }
        }

        t.scrollPos = $(document).scrollTop();
        t.scrollTargetPos = $(document).scrollTop();
        $(window).on('scroll', function() { t.scrollFunc() });
        t.smoothScrollfunc = function() {
          if (t.wheelFlag) {
            var ty = (t.scrollPos - $(document).scrollTop()) * t.deceleration;
            t.scrollTargetPos += Math.floor(ty);
            $(document).scrollTop((t.scrollTargetPos));
          }
          requestAnimationFrame(t.smoothScrollfunc);
        }
        t.deceleration = t.decelerationBase;
        t.smoothScrollfunc();
    }
    if ($('html').hasClass('mq-pc')) var kepMouseWheelSmooth = new KepMouseWheelSmooth();
    });
