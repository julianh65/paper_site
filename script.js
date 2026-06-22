const navLinks = Array.from(document.querySelectorAll(".site-nav a"));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`);
    });
  },
  {
    rootMargin: "-25% 0px -60% 0px",
    threshold: [0.05, 0.2, 0.5],
  },
);

sections.forEach((section) => observer.observe(section));

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const target = document.querySelector(button.dataset.copy);
    if (!target) return;

    const original = button.textContent;

    try {
      await navigator.clipboard.writeText(target.textContent);
      button.textContent = "Copied";
    } catch {
      button.textContent = "Copy failed";
    }

    window.setTimeout(() => {
      button.textContent = original;
    }, 1400);
  });
});

const loadLazyVideo = (video) => {
  if (video.dataset.loaded === "true") return;

  video.querySelectorAll("source[data-src]").forEach((source) => {
    source.src = source.dataset.src;
    source.removeAttribute("data-src");
  });

  video.dataset.loaded = "true";
  video.load();

  const playback = video.play();
  if (playback) {
    playback.catch(() => {});
  }
};

const loadLazyVideos = (root = document) => {
  root.querySelectorAll("video[data-lazy-video]").forEach(loadLazyVideo);
};

if ("IntersectionObserver" in window) {
  const lazyVideoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        loadLazyVideo(entry.target);
        lazyVideoObserver.unobserve(entry.target);
      });
    },
    {
      rootMargin: "600px 0px",
      threshold: 0.01,
    },
  );

  document.querySelectorAll("video[data-lazy-video]").forEach((video) => {
    lazyVideoObserver.observe(video);
  });
} else {
  loadLazyVideos();
}

document.querySelectorAll("[data-collapse-toggle]").forEach((button) => {
  const targetId = button.getAttribute("aria-controls");
  const target = targetId ? document.getElementById(targetId) : null;
  const label = button.querySelector("[data-collapse-label]");
  const expandedLabel = button.dataset.expandedLabel || "Hide";
  const collapsedLabel = button.dataset.collapsedLabel || "Show";

  if (!target) return;

  const setExpanded = (isExpanded) => {
    button.setAttribute("aria-expanded", String(isExpanded));
    target.hidden = !isExpanded;

    if (isExpanded) {
      loadLazyVideos(target);
    } else {
      target.querySelectorAll("video").forEach((video) => video.pause());
    }

    if (label) {
      label.textContent = isExpanded ? expandedLabel : collapsedLabel;
    }
  };

  button.addEventListener("click", () => {
    setExpanded(button.getAttribute("aria-expanded") !== "true");
  });

  setExpanded(button.getAttribute("aria-expanded") !== "false" && !target.hidden);
});

document.querySelectorAll("[data-carousel]").forEach((carousel) => {
  const slides = Array.from(carousel.querySelectorAll("[data-slide]"));
  const previous = carousel.querySelector("[data-carousel-prev]");
  const next = carousel.querySelector("[data-carousel-next]");
  const count = carousel.querySelector("[data-carousel-count]");

  if (slides.length < 2 || !previous || !next) return;

  let activeIndex = slides.findIndex((slide) => !slide.hidden);
  if (activeIndex < 0) activeIndex = 0;

  const setSlide = (index) => {
    activeIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activeIndex;
      slide.hidden = !isActive;
      slide.classList.toggle("is-active", isActive);

      if (slide instanceof HTMLVideoElement && !isActive) {
        slide.pause();
      }
    });

    if (count) {
      count.textContent = `${activeIndex + 1} / ${slides.length}`;
    }
  };

  previous.addEventListener("click", () => setSlide(activeIndex - 1));
  next.addEventListener("click", () => setSlide(activeIndex + 1));
  setSlide(activeIndex);
});
