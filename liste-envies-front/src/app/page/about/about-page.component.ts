import { Component, OnInit } from "@angular/core";
import "./js/n2-j.min.js";
import "./js/nextend-gsap.min.js";
import "./js/nextend-frontend.min.js";
import "./js/smartslider-frontend.min.js";
import "./js/smartslider-block-type-frontend.min.js";
import "./js/MorphSVGPlugin.min.js";
import "./js/particles.min.js";
import "./js/smartslider-simple-type-frontend.min.js";
import "./js/nextend-webfontloader.min.js";

declare var nextend,
  N2R,
  WebFont,
  n2Scroll,
  n2ScrollOffsetSelector,
  window,
  WebFontConfig,
  N2Classes,
  $;

window.N2PRO = 1;
window.N2GSAP = 1;
window.N2PLATFORM = "joomla";
(function () {
  var N = this;
  (N.N2_ = N.N2_ || { r: [], d: [] }),
    (N.N2R =
      N.N2R ||
      function () {
        N.N2_.r.push(arguments);
      }),
    (N.N2D =
      N.N2D ||
      function () {
        N.N2_.d.push(arguments);
      });
}.call(window));
if (!window.n2jQuery) {
  window.n2jQuery = {
    ready: function (cb) {
      console.error("n2jQuery will be deprecated!");
      N2R(["$"], cb);
    }
  };
}
window.nextend = {
  localization: {},
  ready: function (cb) {
    console.error("nextend.ready will be deprecated!");
    N2R("documentReady", function ($) {
      cb.call(window, $);
    });
  }
};
window.N2SSPRO = 1;
window.N2SS3C = "smartslider3";
nextend.fontsLoaded = false;
nextend.fontsLoadedActive = function () {
  nextend.fontsLoaded = true;
};
var fontData = {
  google: {
    families: ["Roboto:300,400:latin"]
  },
  active: function () {
    nextend.fontsLoadedActive();
  },
  inactive: function () {
    nextend.fontsLoadedActive();
  }
};
if (typeof WebFontConfig !== "undefined") {
  var _WebFontConfig = WebFontConfig;
  for (var k in WebFontConfig) {
    if (k == "active") {
      fontData.active = function () {
        nextend.fontsLoadedActive();
        _WebFontConfig.active();
      };
    } else if (k == "inactive") {
      fontData.inactive = function () {
        nextend.fontsLoadedActive();
        _WebFontConfig.inactive();
      };
    } else if (k == "google") {
      if (typeof WebFontConfig.google.families !== "undefined") {
        for (var i = 0; i < WebFontConfig.google.families.length; i++) {
          fontData.google.families.push(WebFontConfig.google.families[i]);
        }
      }
    } else {
      fontData[k] = WebFontConfig[k];
    }
  }
}
if (typeof WebFont === "undefined") {
  window.WebFontConfig = fontData;
} else {
  WebFont.load(fontData);
}
N2R("documentReady", function ($) {
  nextend.fontsDeferred = $.Deferred();
  if (nextend.fontsLoaded) {
    nextend.fontsDeferred.resolve();
  } else {
    nextend.fontsLoadedActive = function () {
      nextend.fontsLoaded = true;
      nextend.fontsDeferred.resolve();
    };
    var intercalCounter = 0;
    nextend.fontInterval = setInterval(function () {
      if (
        intercalCounter > 3 ||
        document.documentElement.className.indexOf("wf-active") !== -1
      ) {
        nextend.fontsLoadedActive();
        clearInterval(nextend.fontInterval);
      }
      intercalCounter++;
    }, 1000);
  }
  N2R(
    [
      "nextend-frontend",
      "smartslider-frontend",
      "nextend-gsap",
      "smartslider-block-type-frontend"
    ],
    function () {
      new N2Classes.SmartSliderBlock("#n2-ss-37", {
        admin: false,
        translate3d: 1,
        callbacks: "",
        "background.video.mobile": 1,
        align: "normal",
        isDelayed: 0,
        load: { fade: 1, scroll: 0 },
        playWhenVisible: 1,
        playWhenVisibleAt: 0.5,
        responsive: {
          desktop: 1,
          tablet: 1,
          mobile: 1,
          onResizeEnabled: true,
          type: "fullwidth",
          downscale: 1,
          upscale: 1,
          minimumHeight: 0,
          maximumHeight: 700,
          maximumSlideWidth: 3000,
          maximumSlideWidthLandscape: 3000,
          maximumSlideWidthTablet: 3000,
          maximumSlideWidthTabletLandscape: 3000,
          maximumSlideWidthMobile: 3000,
          maximumSlideWidthMobileLandscape: 3000,
          maximumSlideWidthConstrainHeight: 0,
          forceFull: 1,
          forceFullOverflowX: "body",
          forceFullHorizontalSelector: "",
          constrainRatio: 1,
          verticalOffsetSelectors: "",
          decreaseSliderHeight: 0,
          focusUser: 0,
          focusAutoplay: 0,
          deviceModes: {
            desktopPortrait: 1,
            desktopLandscape: 0,
            tabletPortrait: 1,
            tabletLandscape: 0,
            mobilePortrait: 1,
            mobileLandscape: 0
          },
          normalizedDeviceModes: {
            unknownUnknown: ["unknown", "Unknown"],
            desktopPortrait: ["desktop", "Portrait"],
            desktopLandscape: ["desktop", "Portrait"],
            tabletPortrait: ["tablet", "Portrait"],
            tabletLandscape: ["tablet", "Portrait"],
            mobilePortrait: ["mobile", "Portrait"],
            mobileLandscape: ["mobile", "Portrait"]
          },
          verticalRatioModifiers: {
            unknownUnknown: 1,
            desktopPortrait: 1,
            desktopLandscape: 1,
            tabletPortrait: 1,
            tabletLandscape: 1,
            mobilePortrait: 1,
            mobileLandscape: 1
          },
          minimumFontSizes: {
            desktopPortrait: 1,
            desktopLandscape: 1,
            tabletPortrait: 1,
            tabletLandscape: 1,
            mobilePortrait: 1,
            mobileLandscape: 1
          },
          ratioToDevice: {
            Portrait: {
              tablet: 0.6999999999999999555910790149937383830547332763671875,
              mobile: 0.5
            },
            Landscape: { tablet: 0, mobile: 0 }
          },
          sliderWidthToDevice: {
            desktopPortrait: 1200,
            desktopLandscape: 1200,
            tabletPortrait: 840,
            tabletLandscape: 0,
            mobilePortrait: 600,
            mobileLandscape: 0
          },
          basedOn: "screen",
          orientationMode: "width_and_height",
          overflowHiddenPage: 0,
          desktopPortraitScreenWidth: 1200,
          tabletPortraitScreenWidth: 800,
          mobilePortraitScreenWidth: 440,
          tabletLandscapeScreenWidth: 800,
          mobileLandscapeScreenWidth: 440
        },
        controls: { scroll: 0, drag: 0, touch: 0, keyboard: 0, tilt: 0 },
        lazyLoad: 0,
        lazyLoadNeighbor: 0,
        blockrightclick: 0,
        maintainSession: 0,
        autoplay: {
          enabled: 0,
          start: 0,
          duration: 8000,
          autoplayToSlide: -1,
          autoplayToSlideIndex: -1,
          allowReStart: 0,
          pause: { click: 1, mouse: "0", mediaStarted: 1 },
          resume: { click: 0, mouse: "0", mediaEnded: 1, slidechanged: 0 }
        },
        perspective: 1000,
        layerMode: {
          playOnce: 0,
          playFirstLayer: 1,
          mode: "skippable",
          inAnimation: "mainInEnd"
        },
        parallax: {
          enabled: 1,
          mobile: 0,
          is3D: 0,
          animate: 1,
          horizontal: "mouse",
          vertical: "mouse",
          origin: "slider",
          scrollmove: "both"
        },
        postBackgroundAnimations: 0,
        initCallbacks: [
          "this.sliderElement.find('.n2-ss-animated-heading-i').each($.proxy(function(i, el){new N2Classes.FrontendItemAnimatedHeading(el, this)}, this));",
          '(function(){var e=this;e.N2_=e.N2_||{r:[],d:[]},e.N2R=e.N2R||function(){e.N2_.r.push(arguments)},e.N2D=e.N2D||function(){e.N2_.d.push(arguments)}}).call(window),this.sliderElement.one("SliderResponsiveStarted",$.proxy(function(){var e=this.sliderElement.find(".n2-ss-shape-divider");e.length&&e.each($.proxy(function(e,t){var i=$(t),n={outer:i,inner:i.find(".n2-ss-shape-divider-inner")};this.sliderElement.on("SliderDeviceOrientation",function(e,t){for(var i=t.device.toLowerCase()+t.orientation.toLowerCase(),s=0;s<n.outer.length;s++){var r=n.outer.eq(s),o=n.inner.eq(s),a=r.data(i+"height"),d=o.data(i+"width");0>=a?r.css("display","none"):r.css("display",""),""===a&&(a=r.data("desktopportraitheight")),r.css("height",a+"px"),""===d&&(d=o.data("desktopportraitwidth")),o.css({width:d+"%",marginLeft:(d-100)/-2+"%"})}}),i.hasClass("n2-ss-divider-animate")&&this.visible(function(){var e=i.find(".n2-ss-divider-start > *"),t=i.find(".n2-ss-divider-end > *"),n=100/(i.data("speed")||100),s={};e.parent().attr("yoyo")&&(s={onComplete:function(){this.reverse()},onReverseComplete:function(){this.restart()}});for(var r=0;r<e.length;r++)NextendTween.to(e[r],parseFloat(e.eq(r).attr("duration"))*n,$.extend({morphSVG:t[r],delay:0,ease:"easeOutCubic"},s,{delay:e.eq(r).attr("delay"),ease:e.eq(r).attr("ease")}))});var s=i.data("scroll");if("shrink"===s||"grow"===s){var r,o,a=i.data("side"),d=function(){var e=0;if(window.matchMedia&&/Android|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent||navigator.vendor||window.opera)){var t;t=n2const.isIOS?document.documentElement.clientHeight:window.innerHeight,e=window.matchMedia("(orientation: landscape)").matches?Math.min(screen.width,t):Math.min(screen.height,t)}else e=window.n2ClientHeight||document.documentElement.clientHeight||document.body.clientHeight;return e},h=$.proxy(function(e,t){var i=d(),s=this.sliderElement.offset().top+e,o=$(window).scrollTop();(o+i>=s&&s>=o||r>0&&100>r)&&(r=Math.max(0,Math.min(100,Math.abs(t-(s-o)/i*100))),n.inner.css("height",r+"%"))},this);"shrink"===s?(n.inner.css("height","100%"),r=100,o=$.proxy(function(){h("bottom"===a?this.sliderElement.height():0,0)},this)):"grow"===s&&(n.inner.css("height",0),r=0,o=$.proxy(function(){h("bottom"===a?this.sliderElement.height():0,100)},this)),$(window).on({scroll:o,resize:o}),this.visible(o)}},this))},this)),N2D("shapedivider");'
        ],
        allowBGImageAttachmentFixed: true
      });
    }
  );
  N2R(
    [
      "nextend-frontend",
      "smartslider-frontend",
      "nextend-gsap",
      "smartslider-block-type-frontend"
    ],
    function () {
      new N2Classes.SmartSliderBlock("#n2-ss-38", {
        admin: false,
        translate3d: 1,
        callbacks: "",
        "background.video.mobile": 1,
        align: "normal",
        isDelayed: 0,
        load: { fade: 1, scroll: 0 },
        playWhenVisible: 1,
        playWhenVisibleAt: 0.5,
        responsive: {
          desktop: 1,
          tablet: 1,
          mobile: 1,
          onResizeEnabled: true,
          type: "fullwidth",
          downscale: 1,
          upscale: 1,
          minimumHeight: 0,
          maximumHeight: 340,
          maximumSlideWidth: 3000,
          maximumSlideWidthLandscape: 3000,
          maximumSlideWidthTablet: 3000,
          maximumSlideWidthTabletLandscape: 3000,
          maximumSlideWidthMobile: 3000,
          maximumSlideWidthMobileLandscape: 3000,
          maximumSlideWidthConstrainHeight: 0,
          forceFull: 1,
          forceFullOverflowX: "body",
          forceFullHorizontalSelector: "",
          constrainRatio: 1,
          verticalOffsetSelectors: "",
          decreaseSliderHeight: 0,
          focusUser: 0,
          focusAutoplay: 0,
          deviceModes: {
            desktopPortrait: 1,
            desktopLandscape: 0,
            tabletPortrait: 1,
            tabletLandscape: 0,
            mobilePortrait: 1,
            mobileLandscape: 0
          },
          normalizedDeviceModes: {
            unknownUnknown: ["unknown", "Unknown"],
            desktopPortrait: ["desktop", "Portrait"],
            desktopLandscape: ["desktop", "Portrait"],
            tabletPortrait: ["tablet", "Portrait"],
            tabletLandscape: ["tablet", "Portrait"],
            mobilePortrait: ["mobile", "Portrait"],
            mobileLandscape: ["mobile", "Portrait"]
          },
          verticalRatioModifiers: {
            unknownUnknown: 1,
            desktopPortrait: 1,
            desktopLandscape: 1,
            tabletPortrait: 1,
            tabletLandscape: 1,
            mobilePortrait: 1,
            mobileLandscape: 1
          },
          minimumFontSizes: {
            desktopPortrait: 1,
            desktopLandscape: 1,
            tabletPortrait: 1,
            tabletLandscape: 1,
            mobilePortrait: 1,
            mobileLandscape: 1
          },
          ratioToDevice: {
            Portrait: {
              tablet: 0.6999999999999999555910790149937383830547332763671875,
              mobile: 0.5
            },
            Landscape: { tablet: 0, mobile: 0 }
          },
          sliderWidthToDevice: {
            desktopPortrait: 1200,
            desktopLandscape: 1200,
            tabletPortrait: 840,
            tabletLandscape: 0,
            mobilePortrait: 600,
            mobileLandscape: 0
          },
          basedOn: "screen",
          orientationMode: "width_and_height",
          overflowHiddenPage: 0,
          desktopPortraitScreenWidth: 1200,
          tabletPortraitScreenWidth: 800,
          mobilePortraitScreenWidth: 440,
          tabletLandscapeScreenWidth: 800,
          mobileLandscapeScreenWidth: 440
        },
        controls: { scroll: 0, drag: 0, touch: 0, keyboard: 0, tilt: 0 },
        lazyLoad: 0,
        lazyLoadNeighbor: 0,
        blockrightclick: 0,
        maintainSession: 0,
        autoplay: {
          enabled: 0,
          start: 0,
          duration: 8000,
          autoplayToSlide: -1,
          autoplayToSlideIndex: -1,
          allowReStart: 0,
          pause: { click: 1, mouse: "0", mediaStarted: 1 },
          resume: { click: 0, mouse: "0", mediaEnded: 1, slidechanged: 0 }
        },
        perspective: 1000,
        layerMode: {
          playOnce: 0,
          playFirstLayer: 1,
          mode: "skippable",
          inAnimation: "mainInEnd"
        },
        parallax: {
          enabled: 1,
          mobile: 0,
          is3D: 0,
          animate: 1,
          horizontal: "mouse",
          vertical: "mouse",
          origin: "slider",
          scrollmove: "both"
        },
        postBackgroundAnimations: 0,
        initCallbacks: [],
        allowBGImageAttachmentFixed: true
      });
    }
  );
  N2R(
    [
      "nextend-frontend",
      "smartslider-frontend",
      "nextend-gsap",
      "smartslider-block-type-frontend"
    ],
    function () {
      new N2Classes.SmartSliderBlock("#n2-ss-39", {
        admin: false,
        translate3d: 1,
        callbacks: "",
        "background.video.mobile": 1,
        align: "normal",
        isDelayed: 0,
        load: { fade: 1, scroll: 0 },
        playWhenVisible: 1,
        playWhenVisibleAt: 0.5,
        responsive: {
          desktop: 1,
          tablet: 1,
          mobile: 1,
          onResizeEnabled: true,
          type: "fullwidth",
          downscale: 1,
          upscale: 1,
          minimumHeight: 0,
          maximumHeight: 600,
          maximumSlideWidth: 3000,
          maximumSlideWidthLandscape: 3000,
          maximumSlideWidthTablet: 3000,
          maximumSlideWidthTabletLandscape: 3000,
          maximumSlideWidthMobile: 3000,
          maximumSlideWidthMobileLandscape: 3000,
          maximumSlideWidthConstrainHeight: 0,
          forceFull: 1,
          forceFullOverflowX: "body",
          forceFullHorizontalSelector: "",
          constrainRatio: 1,
          verticalOffsetSelectors: "",
          decreaseSliderHeight: 0,
          focusUser: 0,
          focusAutoplay: 0,
          deviceModes: {
            desktopPortrait: 1,
            desktopLandscape: 0,
            tabletPortrait: 1,
            tabletLandscape: 0,
            mobilePortrait: 1,
            mobileLandscape: 0
          },
          normalizedDeviceModes: {
            unknownUnknown: ["unknown", "Unknown"],
            desktopPortrait: ["desktop", "Portrait"],
            desktopLandscape: ["desktop", "Portrait"],
            tabletPortrait: ["tablet", "Portrait"],
            tabletLandscape: ["tablet", "Portrait"],
            mobilePortrait: ["mobile", "Portrait"],
            mobileLandscape: ["mobile", "Portrait"]
          },
          verticalRatioModifiers: {
            unknownUnknown: 1,
            desktopPortrait: 1,
            desktopLandscape: 1,
            tabletPortrait: 1,
            tabletLandscape: 1,
            mobilePortrait: 1,
            mobileLandscape: 1
          },
          minimumFontSizes: {
            desktopPortrait: 1,
            desktopLandscape: 1,
            tabletPortrait: 1,
            tabletLandscape: 1,
            mobilePortrait: 1,
            mobileLandscape: 1
          },
          ratioToDevice: {
            Portrait: {
              tablet: 0.6999999999999999555910790149937383830547332763671875,
              mobile: 0.5
            },
            Landscape: { tablet: 0, mobile: 0 }
          },
          sliderWidthToDevice: {
            desktopPortrait: 1200,
            desktopLandscape: 1200,
            tabletPortrait: 840,
            tabletLandscape: 0,
            mobilePortrait: 600,
            mobileLandscape: 0
          },
          basedOn: "screen",
          orientationMode: "width_and_height",
          overflowHiddenPage: 0,
          desktopPortraitScreenWidth: 1200,
          tabletPortraitScreenWidth: 800,
          mobilePortraitScreenWidth: 440,
          tabletLandscapeScreenWidth: 800,
          mobileLandscapeScreenWidth: 440
        },
        controls: { scroll: 0, drag: 0, touch: 0, keyboard: 0, tilt: 0 },
        lazyLoad: 0,
        lazyLoadNeighbor: 0,
        blockrightclick: 0,
        maintainSession: 0,
        autoplay: {
          enabled: 0,
          start: 0,
          duration: 8000,
          autoplayToSlide: -1,
          autoplayToSlideIndex: -1,
          allowReStart: 0,
          pause: { click: 1, mouse: "0", mediaStarted: 1 },
          resume: { click: 0, mouse: "0", mediaEnded: 1, slidechanged: 0 }
        },
        perspective: 1000,
        layerMode: {
          playOnce: 0,
          playFirstLayer: 1,
          mode: "skippable",
          inAnimation: "mainInEnd"
        },
        parallax: {
          enabled: 1,
          mobile: 0,
          is3D: 0,
          animate: 1,
          horizontal: "mouse",
          vertical: "mouse",
          origin: "slider",
          scrollmove: "both"
        },
        backgroundParallax: { strength: 0.5, tablet: 1, mobile: 1 },
        postBackgroundAnimations: {
          data: 0,
          speed: "default",
          strength: "default",
          slides: [
            {
              data: {
                transformOrigin: "50% 50%",
                animations: [
                  {
                    duration: 5,
                    strength: ["scale"],
                    from: { scale: 1.5 },
                    to: {
                      scale: 1.1999999999999999555910790149937383830547332763671875
                    }
                  }
                ]
              },
              speed: "default",
              strength: "default"
            }
          ]
        },
        initCallbacks: [
          "this.sliderElement.find('.n2-ss-highlighted-heading-highlighted[data-animate=\"1\"]').each($.proxy(function(i, el){new N2Classes.FrontendItemHighlightedHeading(el, this)}, this));",
          '(function(){var e=this;e.N2_=e.N2_||{r:[],d:[]},e.N2R=e.N2R||function(){e.N2_.r.push(arguments)},e.N2D=e.N2D||function(){e.N2_.d.push(arguments)}}).call(window),this.sliderElement.one("SliderResponsiveStarted",$.proxy(function(){var e=this.sliderElement.find(".n2-ss-shape-divider");e.length&&e.each($.proxy(function(e,t){var i=$(t),n={outer:i,inner:i.find(".n2-ss-shape-divider-inner")};this.sliderElement.on("SliderDeviceOrientation",function(e,t){for(var i=t.device.toLowerCase()+t.orientation.toLowerCase(),s=0;s<n.outer.length;s++){var r=n.outer.eq(s),o=n.inner.eq(s),a=r.data(i+"height"),d=o.data(i+"width");0>=a?r.css("display","none"):r.css("display",""),""===a&&(a=r.data("desktopportraitheight")),r.css("height",a+"px"),""===d&&(d=o.data("desktopportraitwidth")),o.css({width:d+"%",marginLeft:(d-100)/-2+"%"})}}),i.hasClass("n2-ss-divider-animate")&&this.visible(function(){var e=i.find(".n2-ss-divider-start > *"),t=i.find(".n2-ss-divider-end > *"),n=100/(i.data("speed")||100),s={};e.parent().attr("yoyo")&&(s={onComplete:function(){this.reverse()},onReverseComplete:function(){this.restart()}});for(var r=0;r<e.length;r++)NextendTween.to(e[r],parseFloat(e.eq(r).attr("duration"))*n,$.extend({morphSVG:t[r],delay:0,ease:"easeOutCubic"},s,{delay:e.eq(r).attr("delay"),ease:e.eq(r).attr("ease")}))});var s=i.data("scroll");if("shrink"===s||"grow"===s){var r,o,a=i.data("side"),d=function(){var e=0;if(window.matchMedia&&/Android|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent||navigator.vendor||window.opera)){var t;t=n2const.isIOS?document.documentElement.clientHeight:window.innerHeight,e=window.matchMedia("(orientation: landscape)").matches?Math.min(screen.width,t):Math.min(screen.height,t)}else e=window.n2ClientHeight||document.documentElement.clientHeight||document.body.clientHeight;return e},h=$.proxy(function(e,t){var i=d(),s=this.sliderElement.offset().top+e,o=$(window).scrollTop();(o+i>=s&&s>=o||r>0&&100>r)&&(r=Math.max(0,Math.min(100,Math.abs(t-(s-o)/i*100))),n.inner.css("height",r+"%"))},this);"shrink"===s?(n.inner.css("height","100%"),r=100,o=$.proxy(function(){h("bottom"===a?this.sliderElement.height():0,0)},this)):"grow"===s&&(n.inner.css("height",0),r=0,o=$.proxy(function(){h("bottom"===a?this.sliderElement.height():0,100)},this)),$(window).on({scroll:o,resize:o}),this.visible(o)}},this))},this)),N2D("shapedivider");'
        ],
        allowBGImageAttachmentFixed: true,
        particlejs: {
          particles: {
            number: {
              value: "160",
              density: { enable: true, value_area: 800 }
            },
            color: { value: "#ffffff" },
            shape: {
              type: "circle",
              stroke: { width: 0, color: "#000000" },
              polygon: { nb_sides: 5 },
              image: { src: "img/github.svg", width: 100, height: 100 }
            },
            opacity: {
              value: 1,
              random: true,
              anim: { enable: true, speed: 1, opacity_min: 0, sync: false }
            },
            size: {
              value: 3,
              random: true,
              anim: {
                enable: false,
                speed: 4,
                size_min: 0.299999999999999988897769753748434595763683319091796875,
                sync: false
              }
            },
            line_linked: {
              enable: false,
              distance: 150,
              color: "#ffffff",
              opacity: 0.40000000000000002220446049250313080847263336181640625,
              width: 1
            },
            move: {
              enable: true,
              speed: "2",
              direction: "top-right",
              random: false,
              straight: false,
              out_mode: "out",
              bounce: false,
              attract: { enable: false, rotateX: 600, rotateY: 600 }
            }
          },
          interactivity: {
            detect_on: "canvas",
            events: {
              onhover: { enable: 1, mode: "grab" },
              onclick: { enable: 0, mode: "push" },
              resize: true
            },
            modes: {
              grab: {
                distance: 83.916083916083920257733552716672420501708984375,
                line_linked: { opacity: 1 }
              },
              bubble: {
                distance: 250,
                size: 0,
                duration: 2,
                opacity: 0,
                speed: 3
              },
              repulse: {
                distance: 39.96003996003995695218691253103315830230712890625,
                duration: 0.40000000000000002220446049250313080847263336181640625
              },
              push: { particles_nb: 4 },
              remove: { particles_nb: 2 }
            }
          },
          retina_detect: true,
          mobile: 0
        }
      });
    }
  );
  N2R(
    [
      "nextend-frontend",
      "smartslider-frontend",
      "nextend-gsap",
      "smartslider-block-type-frontend"
    ],
    function () {
      new N2Classes.SmartSliderBlock("#n2-ss-40", {
        admin: false,
        translate3d: 1,
        callbacks: "",
        "background.video.mobile": 1,
        align: "normal",
        isDelayed: 0,
        load: { fade: 1, scroll: 0 },
        playWhenVisible: 1,
        playWhenVisibleAt: 0.5,
        responsive: {
          desktop: 1,
          tablet: 1,
          mobile: 1,
          onResizeEnabled: true,
          type: "fullwidth",
          downscale: 1,
          upscale: 1,
          minimumHeight: 0,
          maximumHeight: 600,
          maximumSlideWidth: 3000,
          maximumSlideWidthLandscape: 3000,
          maximumSlideWidthTablet: 3000,
          maximumSlideWidthTabletLandscape: 3000,
          maximumSlideWidthMobile: 3000,
          maximumSlideWidthMobileLandscape: 3000,
          maximumSlideWidthConstrainHeight: 0,
          forceFull: 1,
          forceFullOverflowX: "body",
          forceFullHorizontalSelector: "",
          constrainRatio: 1,
          verticalOffsetSelectors: "",
          decreaseSliderHeight: 0,
          focusUser: 0,
          focusAutoplay: 0,
          deviceModes: {
            desktopPortrait: 1,
            desktopLandscape: 0,
            tabletPortrait: 1,
            tabletLandscape: 0,
            mobilePortrait: 1,
            mobileLandscape: 0
          },
          normalizedDeviceModes: {
            unknownUnknown: ["unknown", "Unknown"],
            desktopPortrait: ["desktop", "Portrait"],
            desktopLandscape: ["desktop", "Portrait"],
            tabletPortrait: ["tablet", "Portrait"],
            tabletLandscape: ["tablet", "Portrait"],
            mobilePortrait: ["mobile", "Portrait"],
            mobileLandscape: ["mobile", "Portrait"]
          },
          verticalRatioModifiers: {
            unknownUnknown: 1,
            desktopPortrait: 1,
            desktopLandscape: 1,
            tabletPortrait: 1,
            tabletLandscape: 1,
            mobilePortrait: 1,
            mobileLandscape: 1
          },
          minimumFontSizes: {
            desktopPortrait: 1,
            desktopLandscape: 1,
            tabletPortrait: 1,
            tabletLandscape: 1,
            mobilePortrait: 1,
            mobileLandscape: 1
          },
          ratioToDevice: {
            Portrait: {
              tablet: 0.6999999999999999555910790149937383830547332763671875,
              mobile: 0.5
            },
            Landscape: { tablet: 0, mobile: 0 }
          },
          sliderWidthToDevice: {
            desktopPortrait: 1200,
            desktopLandscape: 1200,
            tabletPortrait: 840,
            tabletLandscape: 0,
            mobilePortrait: 600,
            mobileLandscape: 0
          },
          basedOn: "screen",
          orientationMode: "width_and_height",
          overflowHiddenPage: 0,
          desktopPortraitScreenWidth: 1200,
          tabletPortraitScreenWidth: 800,
          mobilePortraitScreenWidth: 440,
          tabletLandscapeScreenWidth: 800,
          mobileLandscapeScreenWidth: 440
        },
        controls: { scroll: 0, drag: 0, touch: 0, keyboard: 0, tilt: 0 },
        lazyLoad: 0,
        lazyLoadNeighbor: 0,
        blockrightclick: 0,
        maintainSession: 0,
        autoplay: {
          enabled: 0,
          start: 0,
          duration: 8000,
          autoplayToSlide: -1,
          autoplayToSlideIndex: -1,
          allowReStart: 0,
          pause: { click: 1, mouse: "0", mediaStarted: 1 },
          resume: { click: 0, mouse: "0", mediaEnded: 1, slidechanged: 0 }
        },
        perspective: 1000,
        layerMode: {
          playOnce: 0,
          playFirstLayer: 1,
          mode: "skippable",
          inAnimation: "mainInEnd"
        },
        parallax: {
          enabled: 1,
          mobile: 0,
          is3D: 0,
          animate: 1,
          horizontal: "mouse",
          vertical: "mouse",
          origin: "slider",
          scrollmove: "both"
        },
        postBackgroundAnimations: 0,
        initCallbacks: [],
        allowBGImageAttachmentFixed: true
      });
    }
  );

  window.n2Scroll = {
    to: function (top) {
      $("html, body").animate({ scrollTop: top }, 400);
    },
    top: function () {
      n2Scroll.to(0);
    },
    bottom: function () {
      n2Scroll.to($(document).height() - $(window).height());
    },
    before: function (el) {
      n2Scroll.to(el.offset().top - $(window).height());
    },
    after: function (el) {
      n2Scroll.to(el.offset().top + el.height());
    },
    next: function (el, selector) {
      var els = $(selector),
        nextI = -1;
      els.each(function (i, slider) {
        if ($(el).is(slider) || $.contains(slider, el)) {
          nextI = i + 1;
          return false;
        }
      });
      if (nextI != -1 && nextI <= els.length) {
        n2Scroll.element(els.eq(nextI));
      }
    },
    previous: function (el, selector) {
      var els = $(selector),
        prevI = -1;
      els.each(function (i, slider) {
        if ($(el).is(slider) || $.contains(slider, el)) {
          prevI = i - 1;
          return false;
        }
      });
      if (prevI >= 0) {
        n2Scroll.element(els.eq(prevI));
      }
    },
    element: function (selector) {
      var offsetTop = 0;
      if (typeof n2ScrollOffsetSelector !== "undefined") {
        offsetTop = $(n2ScrollOffsetSelector).outerHeight();
      }
      n2Scroll.to($(selector).offset().top - offsetTop);
    }
  };
  N2R(
    [
      "nextend-frontend",
      "smartslider-frontend",
      "nextend-gsap",
      "smartslider-simple-type-frontend"
    ],
    function () {
      new N2Classes.SmartSliderSimple("#n2-ss-41", {
        admin: false,
        translate3d: 1,
        callbacks: "",
        "background.video.mobile": 1,
        randomize: { randomize: 0, randomizeFirst: 0 },
        align: "normal",
        isDelayed: 0,
        load: { fade: 1, scroll: 0 },
        playWhenVisible: 1,
        playWhenVisibleAt: 0.5,
        responsive: {
          desktop: 1,
          tablet: 1,
          mobile: 1,
          onResizeEnabled: true,
          type: "fullwidth",
          downscale: 1,
          upscale: 1,
          minimumHeight: 0,
          maximumHeight: 600,
          maximumSlideWidth: 3000,
          maximumSlideWidthLandscape: 3000,
          maximumSlideWidthTablet: 3000,
          maximumSlideWidthTabletLandscape: 3000,
          maximumSlideWidthMobile: 3000,
          maximumSlideWidthMobileLandscape: 3000,
          maximumSlideWidthConstrainHeight: 0,
          forceFull: 1,
          forceFullOverflowX: "body",
          forceFullHorizontalSelector: "",
          constrainRatio: 1,
          verticalOffsetSelectors: "",
          decreaseSliderHeight: 0,
          focusUser: 0,
          focusAutoplay: 0,
          deviceModes: {
            desktopPortrait: 1,
            desktopLandscape: 0,
            tabletPortrait: 1,
            tabletLandscape: 0,
            mobilePortrait: 1,
            mobileLandscape: 0
          },
          normalizedDeviceModes: {
            unknownUnknown: ["unknown", "Unknown"],
            desktopPortrait: ["desktop", "Portrait"],
            desktopLandscape: ["desktop", "Portrait"],
            tabletPortrait: ["tablet", "Portrait"],
            tabletLandscape: ["tablet", "Portrait"],
            mobilePortrait: ["mobile", "Portrait"],
            mobileLandscape: ["mobile", "Portrait"]
          },
          verticalRatioModifiers: {
            unknownUnknown: 1,
            desktopPortrait: 1,
            desktopLandscape: 1,
            tabletPortrait: 1,
            tabletLandscape: 1,
            mobilePortrait: 1,
            mobileLandscape: 1
          },
          minimumFontSizes: {
            desktopPortrait: 1,
            desktopLandscape: 1,
            tabletPortrait: 1,
            tabletLandscape: 1,
            mobilePortrait: 1,
            mobileLandscape: 1
          },
          ratioToDevice: {
            Portrait: {
              tablet: 0.6999999999999999555910790149937383830547332763671875,
              mobile: 0.5
            },
            Landscape: { tablet: 0, mobile: 0 }
          },
          sliderWidthToDevice: {
            desktopPortrait: 1200,
            desktopLandscape: 1200,
            tabletPortrait: 840,
            tabletLandscape: 0,
            mobilePortrait: 600,
            mobileLandscape: 0
          },
          basedOn: "screen",
          orientationMode: "width_and_height",
          overflowHiddenPage: 0,
          desktopPortraitScreenWidth: 1200,
          tabletPortraitScreenWidth: 800,
          mobilePortraitScreenWidth: 440,
          tabletLandscapeScreenWidth: 800,
          mobileLandscapeScreenWidth: 440
        },
        controls: {
          scroll: 0,
          drag: 1,
          touch: "horizontal",
          keyboard: 1,
          tilt: 0
        },
        lazyLoad: 0,
        lazyLoadNeighbor: 0,
        blockrightclick: 0,
        maintainSession: 0,
        autoplay: {
          enabled: 0,
          start: 1,
          duration: 8000,
          autoplayToSlide: -1,
          autoplayToSlideIndex: -1,
          allowReStart: 0,
          pause: { click: 1, mouse: "0", mediaStarted: 1 },
          resume: { click: 0, mouse: "0", mediaEnded: 1, slidechanged: 0 }
        },
        perspective: 1000,
        layerMode: {
          playOnce: 0,
          playFirstLayer: 1,
          mode: "skippable",
          inAnimation: "mainInEnd"
        },
        parallax: {
          enabled: 1,
          mobile: 0,
          is3D: 0,
          animate: 1,
          horizontal: "mouse",
          vertical: "mouse",
          origin: "slider",
          scrollmove: "both"
        },
        postBackgroundAnimations: 0,
        initCallbacks: [
          'N2D("SmartSliderWidgetArrowImage",function(i,e){function s(e,s,t,h){this.slider=e,this.slider.started(i.proxy(this.start,this,s,t,h))}return s.prototype.start=function(e,s,t){return this.slider.sliderElement.data("arrow")?!1:(this.slider.sliderElement.data("arrow",this),this.deferred=i.Deferred(),this.slider.sliderElement.on("SliderDevice",i.proxy(this.onDevice,this)).trigger("addWidget",this.deferred),this.previous=i("#"+this.slider.elementID+"-arrow-previous").on("click",i.proxy(function(i){i.stopPropagation(),this.slider[n2const.rtl.previous]()},this)),this.previousResize=this.previous.find(".n2-resize"),0===this.previousResize.length&&(this.previousResize=this.previous),this.next=i("#"+this.slider.elementID+"-arrow-next").on("click",i.proxy(function(i){i.stopPropagation(),this.slider[n2const.rtl.next]()},this)),this.nextResize=this.next.find(".n2-resize"),0===this.nextResize.length&&(this.nextResize=this.next),this.desktopRatio=e,this.tabletRatio=s,this.mobileRatio=t,void i.when(this.previous.n2imagesLoaded(),this.next.n2imagesLoaded()).always(i.proxy(this.loaded,this)))},s.prototype.loaded=function(){this.previous.css("display","inline-block"),this.previousResize.css("display","inline-block"),this.previousWidth=this.previousResize.width(),this.previousHeight=this.previousResize.height(),this.previousResize.css("display",""),this.previous.css("display",""),this.next.css("display","inline-block"),this.nextResize.css("display","inline-block"),this.nextWidth=this.nextResize.width(),this.nextHeight=this.nextResize.height(),this.nextResize.css("display",""),this.next.css("display",""),this.previousResize.find("img").css("width","100%"),this.nextResize.find("img").css("width","100%"),this.onDevice(null,{device:this.slider.responsive.getDeviceMode()}),this.deferred.resolve()},s.prototype.onDevice=function(i,e){var s=1;switch(e.device){case"tablet":s=this.tabletRatio;break;case"mobile":s=this.mobileRatio;break;default:s=this.desktopRatio}this.previousResize.width(this.previousWidth*s),this.previousResize.height(this.previousHeight*s),this.nextResize.width(this.nextWidth*s),this.nextResize.height(this.nextHeight*s)},s});',
          "new N2Classes.SmartSliderWidgetArrowImage(this, 1, 0.6999999999999999555910790149937383830547332763671875, 0.5);",
          '(function(){var e=this;e.N2_=e.N2_||{r:[],d:[]},e.N2R=e.N2R||function(){e.N2_.r.push(arguments)},e.N2D=e.N2D||function(){e.N2_.d.push(arguments)}}).call(window),this.sliderElement.one("SliderResponsiveStarted",$.proxy(function(){var e=this.sliderElement.find(".n2-ss-shape-divider");e.length&&e.each($.proxy(function(e,t){var i=$(t),n={outer:i,inner:i.find(".n2-ss-shape-divider-inner")};this.sliderElement.on("SliderDeviceOrientation",function(e,t){for(var i=t.device.toLowerCase()+t.orientation.toLowerCase(),s=0;s<n.outer.length;s++){var r=n.outer.eq(s),o=n.inner.eq(s),a=r.data(i+"height"),d=o.data(i+"width");0>=a?r.css("display","none"):r.css("display",""),""===a&&(a=r.data("desktopportraitheight")),r.css("height",a+"px"),""===d&&(d=o.data("desktopportraitwidth")),o.css({width:d+"%",marginLeft:(d-100)/-2+"%"})}}),i.hasClass("n2-ss-divider-animate")&&this.visible(function(){var e=i.find(".n2-ss-divider-start > *"),t=i.find(".n2-ss-divider-end > *"),n=100/(i.data("speed")||100),s={};e.parent().attr("yoyo")&&(s={onComplete:function(){this.reverse()},onReverseComplete:function(){this.restart()}});for(var r=0;r<e.length;r++)NextendTween.to(e[r],parseFloat(e.eq(r).attr("duration"))*n,$.extend({morphSVG:t[r],delay:0,ease:"easeOutCubic"},s,{delay:e.eq(r).attr("delay"),ease:e.eq(r).attr("ease")}))});var s=i.data("scroll");if("shrink"===s||"grow"===s){var r,o,a=i.data("side"),d=function(){var e=0;if(window.matchMedia&&/Android|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent||navigator.vendor||window.opera)){var t;t=n2const.isIOS?document.documentElement.clientHeight:window.innerHeight,e=window.matchMedia("(orientation: landscape)").matches?Math.min(screen.width,t):Math.min(screen.height,t)}else e=window.n2ClientHeight||document.documentElement.clientHeight||document.body.clientHeight;return e},h=$.proxy(function(e,t){var i=d(),s=this.sliderElement.offset().top+e,o=$(window).scrollTop();(o+i>=s&&s>=o||r>0&&100>r)&&(r=Math.max(0,Math.min(100,Math.abs(t-(s-o)/i*100))),n.inner.css("height",r+"%"))},this);"shrink"===s?(n.inner.css("height","100%"),r=100,o=$.proxy(function(){h("bottom"===a?this.sliderElement.height():0,0)},this)):"grow"===s&&(n.inner.css("height",0),r=0,o=$.proxy(function(){h("bottom"===a?this.sliderElement.height():0,100)},this)),$(window).on({scroll:o,resize:o}),this.visible(o)}},this))},this)),N2D("shapedivider");'
        ],
        allowBGImageAttachmentFixed: false,
        bgAnimationsColor: "RGBA(51,51,51,1)",
        bgAnimations: 0,
        mainanimation: {
          type: "horizontal",
          duration: 800,
          delay: 0,
          ease: "easeOutQuad",
          parallax: 0,
          shiftedBackgroundAnimation: "auto"
        },
        carousel: 1,
        dynamicHeight: 0
      });
    }
  );
  N2R(
    [
      "nextend-frontend",
      "smartslider-frontend",
      "nextend-gsap",
      "smartslider-block-type-frontend"
    ],
    function () {
      new N2Classes.SmartSliderBlock("#n2-ss-42", {
        admin: false,
        translate3d: 1,
        callbacks: "",
        "background.video.mobile": 1,
        align: "normal",
        isDelayed: 0,
        load: { fade: 1, scroll: 0 },
        playWhenVisible: 1,
        playWhenVisibleAt: 0.5,
        responsive: {
          desktop: 1,
          tablet: 1,
          mobile: 1,
          onResizeEnabled: true,
          type: "fullwidth",
          downscale: 1,
          upscale: 1,
          minimumHeight: 0,
          maximumHeight: 500,
          maximumSlideWidth: 3000,
          maximumSlideWidthLandscape: 3000,
          maximumSlideWidthTablet: 3000,
          maximumSlideWidthTabletLandscape: 3000,
          maximumSlideWidthMobile: 3000,
          maximumSlideWidthMobileLandscape: 3000,
          maximumSlideWidthConstrainHeight: 0,
          forceFull: 1,
          forceFullOverflowX: "body",
          forceFullHorizontalSelector: "",
          constrainRatio: 1,
          verticalOffsetSelectors: "",
          decreaseSliderHeight: 0,
          focusUser: 0,
          focusAutoplay: 0,
          deviceModes: {
            desktopPortrait: 1,
            desktopLandscape: 0,
            tabletPortrait: 1,
            tabletLandscape: 0,
            mobilePortrait: 1,
            mobileLandscape: 0
          },
          normalizedDeviceModes: {
            unknownUnknown: ["unknown", "Unknown"],
            desktopPortrait: ["desktop", "Portrait"],
            desktopLandscape: ["desktop", "Portrait"],
            tabletPortrait: ["tablet", "Portrait"],
            tabletLandscape: ["tablet", "Portrait"],
            mobilePortrait: ["mobile", "Portrait"],
            mobileLandscape: ["mobile", "Portrait"]
          },
          verticalRatioModifiers: {
            unknownUnknown: 1,
            desktopPortrait: 1,
            desktopLandscape: 1,
            tabletPortrait: 1,
            tabletLandscape: 1,
            mobilePortrait: 1,
            mobileLandscape: 1
          },
          minimumFontSizes: {
            desktopPortrait: 1,
            desktopLandscape: 1,
            tabletPortrait: 1,
            tabletLandscape: 1,
            mobilePortrait: 1,
            mobileLandscape: 1
          },
          ratioToDevice: {
            Portrait: {
              tablet: 0.6999999999999999555910790149937383830547332763671875,
              mobile: 0.5
            },
            Landscape: { tablet: 0, mobile: 0 }
          },
          sliderWidthToDevice: {
            desktopPortrait: 1200,
            desktopLandscape: 1200,
            tabletPortrait: 840,
            tabletLandscape: 0,
            mobilePortrait: 600,
            mobileLandscape: 0
          },
          basedOn: "screen",
          orientationMode: "width_and_height",
          overflowHiddenPage: 0,
          desktopPortraitScreenWidth: 1200,
          tabletPortraitScreenWidth: 800,
          mobilePortraitScreenWidth: 440,
          tabletLandscapeScreenWidth: 800,
          mobileLandscapeScreenWidth: 440
        },
        controls: { scroll: 0, drag: 0, touch: 0, keyboard: 0, tilt: 0 },
        lazyLoad: 0,
        lazyLoadNeighbor: 0,
        blockrightclick: 0,
        maintainSession: 0,
        autoplay: {
          enabled: 0,
          start: 0,
          duration: 8000,
          autoplayToSlide: -1,
          autoplayToSlideIndex: -1,
          allowReStart: 0,
          pause: { click: 1, mouse: "0", mediaStarted: 1 },
          resume: { click: 0, mouse: "0", mediaEnded: 1, slidechanged: 0 }
        },
        perspective: 1000,
        layerMode: {
          playOnce: 0,
          playFirstLayer: 1,
          mode: "skippable",
          inAnimation: "mainInEnd"
        },
        parallax: {
          enabled: 1,
          mobile: 0,
          is3D: 0,
          animate: 1,
          horizontal: "mouse",
          vertical: "mouse",
          origin: "slider",
          scrollmove: "both"
        },
        postBackgroundAnimations: 0,
        initCallbacks: [],
        allowBGImageAttachmentFixed: true
      });
    }
  );
  N2R(
    [
      "nextend-frontend",
      "smartslider-frontend",
      "nextend-gsap",
      "smartslider-block-type-frontend"
    ],
    function () {
      new N2Classes.SmartSliderBlock("#n2-ss-43", {
        admin: false,
        translate3d: 1,
        callbacks: "",
        "background.video.mobile": 1,
        align: "normal",
        isDelayed: 0,
        load: { fade: 1, scroll: 0 },
        playWhenVisible: 1,
        playWhenVisibleAt: 0.5,
        responsive: {
          desktop: 1,
          tablet: 1,
          mobile: 1,
          onResizeEnabled: true,
          type: "fullwidth",
          downscale: 1,
          upscale: 1,
          minimumHeight: 0,
          maximumHeight: 300,
          maximumSlideWidth: 3000,
          maximumSlideWidthLandscape: 3000,
          maximumSlideWidthTablet: 3000,
          maximumSlideWidthTabletLandscape: 3000,
          maximumSlideWidthMobile: 3000,
          maximumSlideWidthMobileLandscape: 3000,
          maximumSlideWidthConstrainHeight: 0,
          forceFull: 1,
          forceFullOverflowX: "body",
          forceFullHorizontalSelector: "",
          constrainRatio: 1,
          verticalOffsetSelectors: "",
          decreaseSliderHeight: 0,
          focusUser: 0,
          focusAutoplay: 0,
          deviceModes: {
            desktopPortrait: 1,
            desktopLandscape: 0,
            tabletPortrait: 1,
            tabletLandscape: 0,
            mobilePortrait: 1,
            mobileLandscape: 0
          },
          normalizedDeviceModes: {
            unknownUnknown: ["unknown", "Unknown"],
            desktopPortrait: ["desktop", "Portrait"],
            desktopLandscape: ["desktop", "Portrait"],
            tabletPortrait: ["tablet", "Portrait"],
            tabletLandscape: ["tablet", "Portrait"],
            mobilePortrait: ["mobile", "Portrait"],
            mobileLandscape: ["mobile", "Portrait"]
          },
          verticalRatioModifiers: {
            unknownUnknown: 1,
            desktopPortrait: 1,
            desktopLandscape: 1,
            tabletPortrait: 1,
            tabletLandscape: 1,
            mobilePortrait: 1,
            mobileLandscape: 1
          },
          minimumFontSizes: {
            desktopPortrait: 1,
            desktopLandscape: 1,
            tabletPortrait: 1,
            tabletLandscape: 1,
            mobilePortrait: 1,
            mobileLandscape: 1
          },
          ratioToDevice: {
            Portrait: {
              tablet: 0.6999999999999999555910790149937383830547332763671875,
              mobile: 0.5
            },
            Landscape: { tablet: 0, mobile: 0 }
          },
          sliderWidthToDevice: {
            desktopPortrait: 1200,
            desktopLandscape: 1200,
            tabletPortrait: 840,
            tabletLandscape: 0,
            mobilePortrait: 600,
            mobileLandscape: 0
          },
          basedOn: "screen",
          orientationMode: "width_and_height",
          overflowHiddenPage: 0,
          desktopPortraitScreenWidth: 1200,
          tabletPortraitScreenWidth: 800,
          mobilePortraitScreenWidth: 440,
          tabletLandscapeScreenWidth: 800,
          mobileLandscapeScreenWidth: 440
        },
        controls: { scroll: 0, drag: 0, touch: 0, keyboard: 0, tilt: 0 },
        lazyLoad: 0,
        lazyLoadNeighbor: 0,
        blockrightclick: 0,
        maintainSession: 0,
        autoplay: {
          enabled: 0,
          start: 0,
          duration: 8000,
          autoplayToSlide: -1,
          autoplayToSlideIndex: -1,
          allowReStart: 0,
          pause: { click: 1, mouse: "0", mediaStarted: 1 },
          resume: { click: 0, mouse: "0", mediaEnded: 1, slidechanged: 0 }
        },
        perspective: 1000,
        layerMode: {
          playOnce: 0,
          playFirstLayer: 1,
          mode: "skippable",
          inAnimation: "mainInEnd"
        },
        parallax: {
          enabled: 1,
          mobile: 0,
          is3D: 0,
          animate: 1,
          horizontal: "mouse",
          vertical: "mouse",
          origin: "slider",
          scrollmove: "both"
        },
        postBackgroundAnimations: 0,
        initCallbacks: [
          "this.sliderElement.find('.n2-ss-animated-heading-i').each($.proxy(function(i, el){new N2Classes.FrontendItemAnimatedHeading(el, this)}, this));",
          "this.sliderElement.find('.n2-ss-highlighted-heading-highlighted[data-animate=\"1\"]').each($.proxy(function(i, el){new N2Classes.FrontendItemHighlightedHeading(el, this)}, this));"
        ],
        allowBGImageAttachmentFixed: true
      });
    }
  );
});

@Component({
  selector: "app-about-page",
  templateUrl: "./about-page.component.html",
  styleUrls: ["./about-page.component.scss"]
})
export class AboutPageComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
