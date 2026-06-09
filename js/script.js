// Premier Schools Exhibition Landing Page
// Vanilla JS only: sliders, autoplay, swipe, keyboard support

(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Hero Slider */
  const heroSlides = Array.from(document.querySelectorAll(".hero__slide"));
  const heroSlider = document.querySelector(".hero__carousel");
  const heroPrev = document.querySelector("[data-hero-prev]");
  const heroNext = document.querySelector("[data-hero-next]");

  let heroIndex = 0;
  let heroTimer = null;

  function showHero(index) {
    if (!heroSlides.length) return;

    heroIndex = (index + heroSlides.length) % heroSlides.length;

    heroSlides.forEach((slide, slideIndex) => {
      const active = slideIndex === heroIndex;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
    });
  }

  function startHero() {
    if (reduceMotion) return;
    stopHero();
    heroTimer = window.setInterval(() => showHero(heroIndex + 1), 4500);
  }

  function stopHero() {
    if (heroTimer) window.clearInterval(heroTimer);
  }

  heroPrev?.addEventListener("click", () => showHero(heroIndex - 1));
  heroNext?.addEventListener("click", () => showHero(heroIndex + 1));

  heroSlider?.addEventListener("mouseenter", stopHero);
  heroSlider?.addEventListener("mouseleave", startHero);
  heroSlider?.addEventListener("focusin", stopHero);
  heroSlider?.addEventListener("focusout", startHero);
  heroSlider?.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") showHero(heroIndex - 1);
    if (event.key === "ArrowRight") showHero(heroIndex + 1);
  });

  addSwipe(heroSlider, () => showHero(heroIndex + 1), () => showHero(heroIndex - 1));
  showHero(0);
  startHero();

  /* Choose School Mobile Slider */
  const chooseTrack = document.getElementById("chooseTrack");
  const chooseDots = document.getElementById("chooseDots");
  const chooseCards = chooseTrack ? Array.from(chooseTrack.children) : [];
  let chooseIndex = 0;

  function createChooseDots() {
    if (!chooseDots) return;

    chooseDots.innerHTML = "";

    chooseCards.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "choose-slider__dot";
      dot.setAttribute("aria-label", `Show school category ${index + 1}`);
      dot.addEventListener("click", () => showChoose(index));
      chooseDots.appendChild(dot);
    });
  }

  function showChoose(index) {
    if (!chooseTrack) return;

    if (window.innerWidth > 900) {
      chooseTrack.style.transform = "translateX(0)";
      return;
    }

    chooseIndex = (index + chooseCards.length) % chooseCards.length;
    chooseTrack.style.transform = `translateX(-${chooseIndex * 100}%)`;

    Array.from(chooseDots.children).forEach((dot, dotIndex) => {
      const active = dotIndex === chooseIndex;
      dot.classList.toggle("is-active", active);
      dot.setAttribute("aria-current", String(active));
    });
  }

  createChooseDots();
  showChoose(0);
  addSwipe(chooseTrack, () => showChoose(chooseIndex + 1), () => showChoose(chooseIndex - 1));
  window.addEventListener("resize", () => showChoose(chooseIndex));

  /* Exhibition Slider */
  const exhibitionTrack = document.getElementById("exhibitionTrack");
  const exhibitionPrev = document.querySelector("[data-exhibition-prev]");
  const exhibitionNext = document.querySelector("[data-exhibition-next]");
  let exhibitionIndex = 0;

  function visibleCards() {
    if (window.innerWidth <= 620) return 1;
    if (window.innerWidth <= 900) return 2;
    return 4;
  }

  function showExhibition(index) {
    if (!exhibitionTrack) return;

    const cards = Array.from(exhibitionTrack.children);
    const maxIndex = Math.max(cards.length - visibleCards(), 0);
    exhibitionIndex = Math.max(0, Math.min(index, maxIndex));

    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(exhibitionTrack).gap) || 0;

    exhibitionTrack.style.transform = `translateX(-${exhibitionIndex * (cardWidth + gap)}px)`;
  }

  exhibitionPrev?.addEventListener("click", () => showExhibition(exhibitionIndex - 1));
  exhibitionNext?.addEventListener("click", () => showExhibition(exhibitionIndex + 1));

  addSwipe(exhibitionTrack, () => showExhibition(exhibitionIndex + 1), () => showExhibition(exhibitionIndex - 1));
  window.addEventListener("resize", () => showExhibition(exhibitionIndex));
  showExhibition(0);

  /* Form demo */
  const form = document.querySelector(".enquiry");
  const message = document.getElementById("enquiryMessage");

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (message) message.textContent = "Thank you! Your enquiry has been received.";
    form.reset();
  });

  /* Reusable Swipe */
  function addSwipe(element, onLeft, onRight) {
    if (!element) return;

    let startX = 0;
    let startY = 0;

    element.addEventListener("touchstart", (event) => {
      const touch = event.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
    }, { passive: true });

    element.addEventListener("touchend", (event) => {
      const touch = event.changedTouches[0];
      const diffX = touch.clientX - startX;
      const diffY = touch.clientY - startY;

      if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX < 0) onLeft();
        else onRight();
      }
    }, { passive: true });
  }
})();

const header = document.querySelector(".header");

window.addEventListener("scroll", () => {
  if (window.scrollY > 60) {
    header.classList.add("header--scrolled");
  } else {
    header.classList.remove("header--scrolled");
  }
});
