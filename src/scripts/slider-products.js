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