document.addEventListener("DOMContentLoaded", () => {

  // show navigation on mobile
  let showMenu = function(e) {
    e.preventDefault();
    e.stopPropagation();
    document.querySelector('html').classList.add('no-scroll');
    document.querySelector('.splash__nav').classList.add('splash__nav--active');
    document.querySelector('body').insertAdjacentHTML('afterbegin', '<div class="shadow"></div>');

    let shadow = document.querySelector('.shadow');
    shadow.addEventListener('click', function(e) {

      document.querySelector('.splash__nav').classList.remove('splash__nav--active');
      document.querySelector('html').classList.remove('no-scroll');
      document.querySelector('.shadow').remove();

    });
  }
  document.querySelector('.js-menu').addEventListener('click', showMenu);

  // slider
  let timeout = 6000;
  let slider = document.querySelector('.js-splash-items');

  let sliderItems = slider.querySelectorAll('.splash__item');

  sliderItems.forEach(item => item.style.display = 'none');

  let current = 0;

  const showNext = () => {
    sliderItems.forEach( item => {
      item.style.display = 'none';
      item.classList.remove('fadeIn');
    });
    sliderItems[current].style.display = 'block';
    sliderItems[current].classList.add('fadeIn');
    setTimeout(() => {
      if ( current === sliderItems.length - 1 ) {
        current = 0;
      } else {
        current += 1;
      }
      showNext();
    }, timeout);
  };
  showNext();

  // about scroll
  let target = document.querySelector('.js-about-scroll');
  target.addEventListener('click', function(e) {
    e.preventDefault();
    const href = this.getAttribute('href');
    const offsetTop = document.querySelector(href).offsetTop;
    scroll({
      top: offsetTop,
      behavior: "smooth"
    });
  });

});