const SETTINGS = {
  countdownDateISO: "2026-09-06T19:00:00+05:00",
  rsvpWebAppUrl: "https://script.google.com/macros/s/AKfycbz9QbP9Ceqnqonvvet8V6qzYHL8h4QvkAV8wuFKox42r1EVMolXdUr-T_fx6m9BvPtoYw/exec",
};

const shell = document.querySelector(".site-shell");
const coverPanel = document.querySelector(".cover-panel");
const invitationPanel = document.querySelector(".paper-panel");
const openButton = document.querySelector(".closed-envelope-button");
const rsvpForm = document.getElementById("rsvpForm");
const formMessage = document.getElementById("formMessage");

function isEditableTarget(target) {
  return target instanceof Element && Boolean(target.closest("input, textarea, select"));
}

function lockPassiveContent() {
  document.querySelectorAll("img").forEach((image) => {
    image.draggable = false;
    image.setAttribute("draggable", "false");
  });

  document.addEventListener("copy", (event) => {
    if (!isEditableTarget(event.target)) event.preventDefault();
  });
  document.addEventListener("cut", (event) => {
    if (!isEditableTarget(event.target)) event.preventDefault();
  });
  document.addEventListener("selectstart", (event) => {
    if (!isEditableTarget(event.target)) event.preventDefault();
  });
  document.addEventListener("dragstart", (event) => event.preventDefault());
  document.addEventListener("contextmenu", (event) => {
    if (!isEditableTarget(event.target)) event.preventDefault();
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  },
  {
    threshold: 0.18,
    rootMargin: "0px 0px -8% 0px",
  },
);

function observeReveals() {
  document.querySelectorAll("[data-reveal]").forEach((node) => revealObserver.observe(node));
}

function openInvitation() {
  if (!openButton || !shell || !coverPanel || !invitationPanel) return;

  shell.classList.remove("is-cover");
  shell.classList.add("is-invitation");
  coverPanel.hidden = true;
  invitationPanel.hidden = false;
  window.scrollTo(0, 0);
  observeReveals();
}

function updateCountdown() {
  const target = new Date(SETTINGS.countdownDateISO).getTime();
  const now = Date.now();
  const distance = Number.isFinite(target) ? Math.max(target - now, 0) : 0;

  const values = {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((distance / (1000 * 60)) % 60),
    seconds: Math.floor((distance / 1000) % 60),
  };

  Object.entries(values).forEach(([id, value]) => {
    const element = document.getElementById(id);
    if (element) element.textContent = String(value).padStart(2, "0");
  });
}

async function submitRsvpToSheets(payload) {
  if (!SETTINGS.rsvpWebAppUrl) {
    throw new Error("Google Sheets Web App URL is not configured");
  }

  await fetch(SETTINGS.rsvpWebAppUrl, {
    method: "POST",
    mode: "no-cors",
    body: new URLSearchParams(payload),
  });
}

async function handleRsvpSubmit(event) {
  event.preventDefault();

  const formData = new FormData(rsvpForm);
  const guestName = String(formData.get("guestName") || "").trim();
  const attendance = String(formData.get("attendance") || "").trim();
  const submitButton = rsvpForm.querySelector(".submit-button");

  formMessage.classList.remove("is-error", "is-success");

  if (!guestName || !attendance) {
    formMessage.textContent = "Атыңызды жазып, бір жауапты таңдаңыз.";
    formMessage.classList.add("is-error");
    return;
  }

  submitButton.disabled = true;
  formMessage.textContent = "Жауабыңыз жіберіліп жатыр...";

  try {
    await submitRsvpToSheets({
      guestName,
      attendance,
      submittedAt: new Date().toISOString(),
      pageUrl: window.location.href,
    });
    formMessage.textContent = "Рахмет, жауабыңыз қабылданды.";
    formMessage.classList.add("is-success");
    rsvpForm.reset();
  } catch (error) {
    console.error("RSVP submission failed:", error);
    formMessage.textContent = "Жауапты жіберу мүмкін болмады. Кейінірек қайталап көріңіз.";
    formMessage.classList.add("is-error");
  } finally {
    submitButton.disabled = false;
  }
}

lockPassiveContent();
updateCountdown();
window.setInterval(updateCountdown, 1000);

if (openButton) openButton.addEventListener("click", openInvitation);
if (rsvpForm) rsvpForm.addEventListener("submit", handleRsvpSubmit);
