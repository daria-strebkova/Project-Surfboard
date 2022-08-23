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

$(".form").submit((e) => {
  e.preventDefault();

  const form = $(e.currentTarget);
  const name = form.find("[name='name']");
  const phone = form.find("[name='phone']");
  const comment = form.find("[name='comment']");
  const to = form.find("[name='to']");

  $.ajax({
    url: "https://webdev-api.loftschool.com/sendmail",
    method: "post",
    data: {
      name: name.val(),
      phone: phone.val(),
      comment: comment.val(),
      to: to.val(),
    }
  });

   $.fancybox.open({
     src: "#modal",
     type: "inline"
   })
});

$(".app-close-modal").click(e => {
  e.preventDefault();

  $.fancybox.close();
})