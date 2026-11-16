(function () {
  "use strict";

  var data = window.PORTFOLIO || {};
  var profile = data.profile || {};
  var projects = Array.isArray(data.projects) ? data.projects : [];
  var videos = Array.isArray(data.videos) ? data.videos : [];
  var systems = Array.isArray(data.systems) ? data.systems : [];
  var reviews = Array.isArray(data.reviews) ? data.reviews : [];

  function escapeHTML(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character];
    });
  }

  function safeURL(value) {
    if (!value) return "";
    try {
      var url = new URL(String(value), window.location.href);
      if (url.protocol === "https:" || url.protocol === "http:" || url.protocol === "mailto:") return url.href;
    } catch (_) { return ""; }
    return "";
  }

  function text(selector, value) {
    var element = document.querySelector(selector);
    if (element && value) element.textContent = value;
  }

  function renderProfile() {
    var name = profile.name || "Your name";
    document.querySelectorAll("[data-profile-name], [data-about-name]").forEach(function (element) {
      element.textContent = name;
    });
    document.querySelectorAll("[data-profile-initial]").forEach(function (element) {
      element.textContent = name.charAt(0).toUpperCase();
    });
    text("[data-profile-role]", profile.role);
    text("[data-profile-intro]", profile.intro);
    text("[data-about-lead]", profile.aboutLead);
    text("[data-stat-years]", profile.yearsExperience);
    text("[data-stat-stack]", profile.primaryStack);
    text("[data-contact-handle]", profile.discordHandle || name + " · Roblox developer");

    document.title = name + " — Roblox Scripter";
    var description = document.querySelector('meta[name="description"]');
    if (description && profile.intro) description.setAttribute("content", profile.intro);

    var contactLink = document.querySelector("#contact-link");
    if (contactLink) {
      var destination = profile.email ? safeURL("mailto:" + profile.email) : safeURL(profile.discordUrl) || safeURL(profile.githubUrl);
      if (destination) {
        contactLink.href = destination;
        contactLink.textContent = profile.email ? "Email me ↗" : profile.discordUrl ? "Message me ↗" : "Let's build it ↗";
      }
    }
  }

  function renderProjects() {
    var container = document.querySelector("#project-grid");
    if (!container) return;
    text("[data-stat-projects]", projects.length ? String(projects.length).padStart(2, "0") : "—");

    if (!projects.length) {
      container.innerHTML = '<article class="project-empty"><div class="empty-mark" aria-hidden="true">＋</div><div><span class="project-category">YOUR WORKSPACE</span><h3>Your games go here.</h3><p>Add your first project to the projects list in portfolio-data.js. It will show up here automatically.</p></div><span class="empty-index">01 / ∞</span></article>';
      return;
    }

    container.innerHTML = projects.map(function (project, index) {
      var title = escapeHTML(project.title || "Untitled project");
      var imagePath = safeURL(project.image);
      var media = imagePath
        ? '<img src="' + escapeHTML(imagePath) + '" alt="' + escapeHTML(project.imageAlt || project.title || "Project screenshot") + '" loading="lazy" />'
        : '<div class="project-art" data-tone="' + escapeHTML(project.accent || "blue") + '"><span class="art-orbit"></span><span class="art-title">' + title.charAt(0) + '</span><span class="art-caption">ROBLOX / ' + String(index + 1).padStart(2, "0") + '</span></div>';
      var metrics = "";
      if (project.visits) metrics += '<span><b>' + escapeHTML(project.visits) + '</b> visits</span>';
      if (project.favourites) metrics += '<span><b>' + escapeHTML(project.favourites) + '</b> favourites</span>';
      var tags = Array.isArray(project.tags) ? project.tags.map(function (tag) {
        return '<span class="project-tag">' + escapeHTML(tag) + '</span>';
      }).join("") : "";
      var links = "";
      var gameURL = safeURL(project.gameUrl);
      var videoURL = safeURL(project.videoUrl);
      if (gameURL) links += '<a href="' + escapeHTML(gameURL) + '" target="_blank" rel="noreferrer">Play on Roblox <span aria-hidden="true">↗</span></a>';
      if (videoURL) links += '<a href="' + escapeHTML(videoURL) + '" target="_blank" rel="noreferrer">Watch clip <span aria-hidden="true">↗</span></a>';
      return '<article class="project-card" data-reveal><div class="project-media">' + media + '<span class="project-number">' + String(index + 1).padStart(2, "0") + '</span></div><div class="project-info"><div class="project-title-row"><div><span class="project-category">' + escapeHTML(project.category || "Featured game") + '</span><h3>' + title + '</h3></div><div class="project-metrics">' + metrics + '</div></div><p>' + escapeHTML(project.description || "") + '</p><div class="project-bottom"><div class="project-tags">' + tags + '</div><div class="project-links">' + links + '</div></div></div></article>';
    }).join("");
  }

  function renderSystems() {
    var container = document.querySelector("#systems-grid");
    if (!container) return;
    container.innerHTML = systems.map(function (system, index) {
      return '<article class="system-card" data-reveal><div class="system-card-top"><span>' + escapeHTML(system.number || String(index + 1).padStart(2, "0")) + ' / COMPONENT</span><span class="system-icon" aria-hidden="true">' + escapeHTML(system.icon || "✳") + '</span></div><h3>' + escapeHTML(system.title || "System") + '</h3><p>' + escapeHTML(system.description || "") + '</p><span class="system-arrow" aria-hidden="true">↗</span></article>';
    }).join("");
  }

  function youtubeVideoId(value) {
    if (!value) return "";
    var raw = String(value).trim();
    if (/^[A-Za-z0-9_-]{11}$/.test(raw)) return raw;
    try {
      var url = new URL(raw);
      var host = url.hostname.replace(/^www\./, "").toLowerCase();
      if (host === "youtu.be") {
        var shortId = url.pathname.split("/").filter(Boolean)[0] || "";
        return /^[A-Za-z0-9_-]{11}$/.test(shortId) ? shortId : "";
      }
      if (["youtube.com", "m.youtube.com", "youtube-nocookie.com"].indexOf(host) !== -1) {
        var queryId = url.searchParams.get("v") || "";
        var pathMatch = url.pathname.match(/^\/(?:embed|shorts|live)\/([A-Za-z0-9_-]{11})/);
        var videoId = queryId || (pathMatch ? pathMatch[1] : "");
        return /^[A-Za-z0-9_-]{11}$/.test(videoId) ? videoId : "";
      }
    } catch (_) { return ""; }
    return "";
  }

  function renderVideos() {
    var container = document.querySelector("#video-grid");
    if (!container) return;
    if (!videos.length) {
      container.innerHTML = '<article class="video-empty"><span class="empty-mark" aria-hidden="true">▶</span><div><span class="project-category">YOUTUBE SHOWCASE</span><h3>Add your first gameplay clip.</h3><p>Paste a YouTube link into the videos list in portfolio-data.js and it will embed here.</p></div></article>';
      return;
    }
    container.innerHTML = videos.map(function (video) {
      var id = youtubeVideoId(video.youtubeUrl || video.youtubeId);
      var title = escapeHTML(video.title || "Roblox gameplay video");
      var player = id
        ? '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?rel=0" title="' + title + '" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>'
        : '<div class="video-invalid">Add a valid YouTube URL or video ID in portfolio-data.js.</div>';
      return '<article class="video-card" data-reveal><div class="video-player">' + player + '</div><div class="video-caption"><div><span class="project-category">GAMEPLAY / DEMO</span><h3>' + title + '</h3></div><span class="video-play" aria-hidden="true">▶</span></div><p>' + escapeHTML(video.description || "") + '</p></article>';
    }).join("");
  }

  function renderReviews() {
    var section = document.querySelector("#reviews");
    var navLink = document.querySelector("[data-reviews-nav]");
    var container = document.querySelector("#reviews-grid");
    if (!reviews.length) {
      if (section) section.hidden = true;
      if (navLink) navLink.hidden = true;
      return;
    }
    if (container) {
      container.innerHTML = reviews.map(function (review, index) {
        return '<article class="review-card" data-reveal><span class="quote-mark" aria-hidden="true">“</span><blockquote>' + escapeHTML(review.quote || "") + '</blockquote><div class="review-author"><span class="review-avatar">' + escapeHTML((review.name || "C").charAt(0)) + '</span><span><b>' + escapeHTML(review.name || "Client") + '</b><small>' + escapeHTML(review.project || "Roblox project") + '</small></span><span class="review-index">' + String(index + 1).padStart(2, "0") + '</span></div></article>';
      }).join("");
    }
  }

  function renderAbout() {
    var details = document.querySelector("#about-details");
    var skills = document.querySelector("#skill-list");
    if (details && Array.isArray(profile.about)) {
      details.innerHTML = profile.about.map(function (paragraph) {
        return '<p>' + escapeHTML(paragraph) + '</p>';
      }).join("");
    }
    if (skills && Array.isArray(profile.skills)) {
      skills.innerHTML = profile.skills.map(function (skill) {
        return '<span class="skill-chip">' + escapeHTML(skill) + '</span>';
      }).join("");
    }
  }

  function setupNavigation() {
    var toggle = document.querySelector(".menu-toggle");
    var nav = document.querySelector("#primary-nav");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
      document.body.classList.toggle("menu-open", !open);
    });
    nav.addEventListener("click", function (event) {
      if (!event.target.closest("a")) return;
      toggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
      document.body.classList.remove("menu-open");
    });
  }

  function setupReveal() {
    var elements = document.querySelectorAll("[data-reveal]");
    if (!("IntersectionObserver" in window)) {
      elements.forEach(function (element) { element.classList.add("is-visible"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries, currentObserver) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });
    elements.forEach(function (element) { observer.observe(element); });
  }

  renderProfile();
  renderProjects();
  renderVideos();
  renderSystems();
  renderReviews();
  renderAbout();
  setupNavigation();
  setupReveal();
  text("#footer-year", String(new Date().getFullYear()));
})();

