class FullMenu {
  constructor(selector) {
    this.menu = document.querySelector(selector)

    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-menu]')

      if (target) {
        const event = target.dataset.menu

        this[event]()
      }
    })
  }

  open() {
    this.menu.classList.add('open')
  }

  close() {
    this.menu.classList.remove('open')
  }
}

var menu = new FullMenu('#full-menu')

///products///

const slider = $('.products__list').bxSlider({
  pager: false,
  controls: false
});

$('.arrow__left').click(e => {
  e.preventDefault();
  slider.goToPrevSlide();
})

$('.arrow__right').click(e => {
  e.preventDefault();
  slider.goToNextSlide();
})

///team-menu///

const openItem = item => {
  const container = item.closest(".team__item");
  const contentBlock = container.find(".team__content");
  const textBlock = contentBlock.find(".team__content-block");
  const reqHeight = textBlock.height();

  container.addClass("active");
  contentBlock.height(reqHeight);
}

const closeEveryItem = container => {
  const items = container.find(".team__content");
  const itemContainer = container.find(".team__item");

  itemContainer.removeClass("active");
  items.height(0);
}

$(".team__title").click(e => {
  const $this = $(e.currentTarget);
  const container = $this.closest(".team");
  const elemContainer = $this.closest(".team__item");

  if (elemContainer.hasClass("active")) {
    closeEveryItem(container);
  } else {
    closeEveryItem(container);
    openItem($this);
  }
})

///products-menu///

const mesureWidth = item => {
  let reqItemWidth = 0;

  const screenWidth = $(window).width();
  const container = item.closest(".products-menu__list");
  const titlesBlocks = container.find(".products-menu__title");
  const titleWidth = titlesBlocks.width() * titlesBlocks.length;

  const textContainer = item.find(".products-menu__container");
  const paddingLeft = parseInt(textContainer.css("padding-left"));
  const paddingRight = parseInt(textContainer.css("padding-right"));

  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  if (isMobile) {
    reqItemWidth = screenWidth - titleWidth;
  } else {
    reqItemWidth = 524;
  }

  return {
    container: reqItemWidth,
    textContainer: reqItemWidth - paddingRight - paddingLeft
  }
}

const closeEveryItemInContainer = container => {
  const items = container.find(".products-menu__item");
  const content = container.find(".products-menu__content");

  items.removeClass("active");
  content.width(0);
}

const openProductsMenu = item => {
  const hiddenContent = item.find(".products-menu__content");
  const reqWidth = mesureWidth(item);
  const textBlock = item.find(".products-menu__container");

  item.addClass("active");
  hiddenContent.width(reqWidth.container);
  textBlock.width(reqWidth.textContainer);
}

$(".products-menu__title").click((e) => {
  e.preventDefault();

  const $this = $(e.currentTarget);
  const item = $this.closest(".products-menu__item");
  const itemOpened = item.hasClass("active");
  const container = $this.closest(".products-menu__list")

  if (itemOpened) {
    closeEveryItemInContainer(container)
  } else {
    closeEveryItemInContainer(container)
    openProductsMenu(item);
  }
})

///reviews-menu///

const findBlockByAlias = alias => {
  return $(".reviews__display-item").filter((ndx, item) => {
    return $(item).attr("data-linked-with") === alias;
  });
};

$(".interactive-avatar__link").click(e => {
  e.preventDefault();

  const $this = $(e.currentTarget);
  const target = $this.attr("data-open");
  const itemToShow = findBlockByAlias(target);
  const curItem = $this.closest(".reviews__switcher-item");

  itemToShow.addClass("active").siblings().removeClass("active");
  curItem.addClass("active").siblings().removeClass("active");
});

///player///

let player;
const playerContainer = $(".player");

let eventsInit = () => {
  $(".player__start").click(e => {
    e.preventDefault();

    if (playerContainer.hasClass("paused")) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  });

  $(".player__playback").click(e => {
    const bar = $(e.currentTarget);
    const clickedPosition = e.originalEvent.layerX;
    const newButtonPositionPercent = (clickedPosition / bar.width()) * 100;
    const newPlaybackPositionSec = (player.getDuration() / 100) * newButtonPositionPercent;

    $(".player__playback-button").css({
      left: `${newButtonPositionPercent}%`
    });

    player.seekTo(newPlaybackPositionSec);
  });

  $(".player__splash").click(e => {
    player.playVideo();
  })

  $(".player__volume").click(e => {
    const barVolume = $(e.currentTarget);
    const clickedPositionVolume = e.originalEvent.layerX;
    const newButtonPositionVolume = (100 * clickedPositionVolume / barVolume.width());
    player.setVolume(newButtonPositionVolume);

    $(".player__volume-button").css({
      left: `${newButtonPositionVolume}%`
    });
  });
};



const formatTime = timeSec => {
  const roundTime = Math.round(timeSec);

  const minutes = addZero(Math.floor(roundTime / 60));
  const seconds = addZero(roundTime - minutes * 60);

  function addZero(num) {
    return num < 10 ? `0${num}` : num;
  }

  return `${minutes} : ${seconds}`;
}

const onPlayerReady = () => {
  let interval;
  const durationSec = player.getDuration();

  $(".player__duration-estimate").text(formatTime(durationSec));

  if (typeof interval !== "undefined") {
    clearInterval(interval);
  }

  interval = setInterval(() => {
    const completedSec = player.getCurrentTime();
    const completedPercent = (completedSec / durationSec) * 100;

    $(".player__playback-button").css({
      left: `${completedPercent}%`
    });

    $(".player__duration-competed").text(formatTime(completedSec));
  }, 1000);
}

const onPlayerStateChange = event => {
  /*
    -1 (воспроизведение видео не начато)
    0 (воспроизведение видео завершено)
    1 (воспроизведение)
    2 (пауза)
    3 (буферизация)
    5 (видео подают реплики).
  */
  switch (event.data) {
    case 1:
      playerContainer.addClass("active");
      playerContainer.addClass("paused");
      break;

    case 2:
      playerContainer.removeClass("active");
      playerContainer.removeClass("paused");
      break;
  }
};

function onYouTubeIframeAPIReady() {
  player = new YT.Player('yt-player', {
    height: "391",
    width: "662",
    videoId: "tFYtoGQDW_g",
    events: {
      "onReady": onPlayerReady,
      "onStateChange": onPlayerStateChange
    },
    playerVars: {
      controls: 0,
      disablekb: 0,
      showinfo: 0,
      rel: 0,
      autoplay: 0,
      modestbranding: 0
    }
  });
}

eventsInit();


///form///

const validateFields = (form, fieldsArray) => {

  fieldsArray.forEach(field => {
    field.removeClass("input-error");
    if (field.val().trim() === "") {
      field.addClass("input-error");
    }
  })

  const errorFields = form.find(".input-error");

  return errorFields.length === 0;
}

$(".form").submit((e) => {
  e.preventDefault();

  const form = $(e.currentTarget);
  const name = form.find("[name='name']");
  const phone = form.find("[name='phone']");
  const comment = form.find("[name='comment']");
  const to = form.find("[name='to']");

  const modal = $("#modal");
  const content = modal.find(".modal__content");

  modal.removeClass("error-modal");

  const isValid = validateFields(form, [name, phone, comment, to]);

  if (isValid) {
    const request = $.ajax({
      url: "https://webdev-api.loftschool.com/sendmail",
      method: "post",
      data: {
        name: name.val(),
        phone: phone.val(),
        comment: comment.val(),
        to: to.val(),
      },
      error: (data) => { },
    });

    request.done((data) => {
      content.text(data.message);
    })

    request.fail((data) => {
      const message = data.responseJSON ? data.responseJSON.message : "Ошибка сервера!";
      content.text(message);
      modal.addClass("error-modal");
    })

    request.always(() => {
      $.fancybox.open({
        src: "#modal",
        type: "inline",
      });
    })
  }
});

$(".app-close-modal").click((e) => {
  e.preventDefault();

  $.fancybox.close();
})

///map///

let myMap;

const init = () => {
  myMap = new ymaps.Map("map", {
    center: [55.749784, 37.597054],
    zoom: 14,
    controls: []
  });

  const coords = [
    [55.749819, 37.603958],
    [55.757152, 37.580243],
    [55.740968, 37.589596]
  ];

  myCollection = new ymaps.GeoObjectCollection({}, {
    draggable: false,
    iconLayout: 'default#image',
    iconImageHref: "./img/point.svg",
    iconImageSize: [46, 57],
    iconImageOffset: [-35, -52]
  });

  coords.forEach(coord => {
    myCollection.add(new ymaps.Placemark(coord));
  })

  myMap.geoObjects.add(myCollection);

  myMap.behaviors.disable('scrollZoom');
}

ymaps.ready(init);

///ops///

const sections = $("section");
const display = $(".maincontant");
const sideMenu = $(".fixed-menu");
const menuItems = sideMenu.find(".fixed-menu__item");

const mobileDetect = new MobileDetect(window.navigator.userAgent);
const isMobile = mobileDetect.mobile();

let inScroll = false;

sections.first().addClass("active");

const countSectionPosition = sectionEq => {
  const position = sectionEq * -100;

  if (isNaN(position)) {
    console.error("Передано не верное значение в countSectionPosition");
    return 0;
  }

  return position;
};

const changeMenuThemeForSection = sectionEq => {
  const currentSection = sections.eq(sectionEq);
  const menuTheme = currentSection.attr("data-sidemenu-theme");
  const activeClass = "fixed-menu--shadowed";

  if (menuTheme === "black") {
    sideMenu.addClass(activeClass);
  } else {
    sideMenu.removeClass(activeClass);
  }
};

const resetActiveClassForItem = (items, itemEq, activeClass) => {
  items.eq(itemEq).addClass(activeClass).siblings().removeClass(activeClass);
};

const perfomTransition = (sectionEq) => {
  if (inScroll) return;

  const transitionOver = 1000;
  const mouseInertiaOver = 300;

  inScroll = true;

  const position = countSectionPosition(sectionEq);

  changeMenuThemeForSection(sectionEq);

  display.css({
    transform: `translateY(${position}%)`,
  })

  resetActiveClassForItem(sections, sectionEq, "active");
  resetActiveClassForItem(menuItems, sectionEq, "fixed-menu__item--active");

  setTimeout(() => {
    inScroll = false;
  }, transitionOver + mouseInertiaOver);
};

const viewportScroller = () => {
  const activeSection = sections.filter(".active");
  const nextSection = activeSection.next();
  const prevSection = activeSection.prev();

  return {
    next() {
      if (nextSection.length) {
        perfomTransition(nextSection.index());
      }
    },
    prev() {
      if (prevSection.length) {
        perfomTransition(prevSection.index());
      }
    },
  };
};

$(window).on("wheel", (e) => {
  const deltaY = e.originalEvent.deltaY;
  const scroller = viewportScroller();

  if (deltaY > 0) {
    scroller.next();
  }

  if (deltaY < 0) {
    scroller.prev();
  }
});

$(window).on("keydown", (e) => {
  const tagName = e.target.tagName.toLowerCase();
  const userTypingInInputs = tagName === "input" || tagName === "textarea";
  const scroller = viewportScroller();

  if (userTypingInInputs) return;

  switch (e.keyCode) {
    case 38:
      scroller.prev();
      break;

    case 40:
      scroller.next();
      break
  }
});

$(".wrapper").on("touchmove", (e) => e.preventDefault());

$("[data-scroll-to]").click((e) => {
  e.preventDefault();

  const $this = $(e.currentTarget);
  const target = $this.attr("data-scroll-to");
  const reqSection = $(`[data-section-id=${target}]`);

  perfomTransition(reqSection.index());
});

if (isMobile) {
  // https://github.com/mattbryson/TouchSwipe-Jquery-Plugin
  $("body").swipe({
    swipe: function (event, direction) {
      const scroller = viewportScroller();
      let scrollDirection = "";

      if (direction === "up") scrollDirection = "next";
      if (direction === "down") scrollDirection = "prev";

      scroller[scrollDirection]();
    },
  });
}
