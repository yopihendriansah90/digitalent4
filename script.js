const menuToggle = document.querySelector("[data-menu-toggle]");
const siteNav = document.querySelector("[data-site-nav]");
const yearSlot = document.querySelector("[data-year]");
const contactForm = document.querySelector("[data-contact-form]");
const heroSlider = document.querySelector("[data-hero-slider]");

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

if (yearSlot) {
  yearSlot.textContent = new Date().getFullYear();
}

if (heroSlider) {
  const slides = Array.from(heroSlider.querySelectorAll("[data-slide]"));
  const dots = Array.from(heroSlider.querySelectorAll("[data-slide-dot]"));
  const prevButton = heroSlider.querySelector("[data-slider-prev]");
  const nextButton = heroSlider.querySelector("[data-slider-next]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const autoplayEnabled = heroSlider.dataset.autoplay === "true";
  const interval = Number(heroSlider.dataset.interval) || 5200;
  const hasMultipleSlides = slides.length > 1;
  let activeIndex = slides.findIndex((slide) => slide.classList.contains("is-active"));
  let autoplayId = null;

  if (activeIndex < 0) {
    activeIndex = 0;
  }

  const renderSlide = (index) => {
    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === index;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });

    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === index;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-current", isActive ? "true" : "false");
    });

    activeIndex = index;
  };

  const stopAutoplay = () => {
    if (autoplayId) {
      window.clearInterval(autoplayId);
      autoplayId = null;
    }
  };

  const startAutoplay = () => {
    if (!autoplayEnabled || !hasMultipleSlides || reducedMotion.matches) {
      return;
    }

    stopAutoplay();
    autoplayId = window.setInterval(() => {
      renderSlide((activeIndex + 1) % slides.length);
    }, interval);
  };

  const goToSlide = (index, userInitiated = false) => {
    renderSlide((index + slides.length) % slides.length);

    if (userInitiated) {
      startAutoplay();
    }
  };

  if (!hasMultipleSlides) {
    heroSlider.classList.add("is-static");

    if (prevButton) {
      prevButton.disabled = true;
    }

    if (nextButton) {
      nextButton.disabled = true;
    }
  } else {
    prevButton?.addEventListener("click", () => {
      goToSlide(activeIndex - 1, true);
    });

    nextButton?.addEventListener("click", () => {
      goToSlide(activeIndex + 1, true);
    });

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        goToSlide(index, true);
      });
    });

    heroSlider.addEventListener("mouseenter", stopAutoplay);
    heroSlider.addEventListener("mouseleave", startAutoplay);
    heroSlider.addEventListener("focusin", stopAutoplay);
    heroSlider.addEventListener("focusout", (event) => {
      if (!heroSlider.contains(event.relatedTarget)) {
        startAutoplay();
      }
    });

    if (typeof reducedMotion.addEventListener === "function") {
      reducedMotion.addEventListener("change", () => {
        if (reducedMotion.matches) {
          stopAutoplay();
          return;
        }

        startAutoplay();
      });
    }
  }

  renderSlide(activeIndex);
  startAutoplay();
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(contactForm);
    const name = data.get("name")?.toString().trim();
    const email = data.get("email")?.toString().trim();
    const service = data.get("service")?.toString().trim();
    const question = data.get("question")?.toString().trim();

    if (!name || !email || !service || !question) {
      window.alert("Please complete all fields before sending your inquiry.");
      return;
    }

    const subject = encodeURIComponent(`Website inquiry - ${service}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nService: ${service}\n\nQuestion:\n${question}`
    );

    window.location.href = `mailto:info@digitalent.co.id?subject=${subject}&body=${body}`;
  });
}
