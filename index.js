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
  const contentBlock = container.find (".team__content");
  const textBlock = contentBlock.find (".team__content-block");
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

$(".team__title").click(e =>{
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

const mesureWidth = () => {
  return 500;
}

const closeEveryItemInContainer = container => {
  const items = container.find(".products-menu__item");
  const content = container.find(".products-menu__content");

  items.removeClass("active");
  content.width(0);
}

const openItem = item => {
  const hiddenContent = item.find(".products-menu__content");
  const reqWidth = mesureWidth();

  item.addClass("active");
  hiddenContent.width(reqWidth);
}

$(".products-menu__title").click((e) => {
  e.preventDefault();

  const $this = $(e.currentTarget);
  const item = $this.closest(".products-menu__item");
  const itemOpen = item.hasClass("active");
  const container = $this.closest(".products-menu__list")

  if (itemOpened) {
    closeEveryItemInContainer()
  }else{
    openItem(item);
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
      error: (data) => {},
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
    center: [55.76, 37.64],
    zoom: 7
  });
}

ymaps.ready(init);