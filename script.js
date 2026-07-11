const shell = document.querySelector(".site-shell");
const coverPanel = document.querySelector(".cover-panel");
const invitationPanel = document.querySelector(".paper-panel");
const openButton = document.querySelector(".closed-envelope-button");

if (openButton && shell && coverPanel && invitationPanel) {
  openButton.addEventListener("click", () => {
    shell.classList.remove("is-cover");
    shell.classList.add("is-invitation");
    coverPanel.hidden = true;
    invitationPanel.hidden = false;
    window.scrollTo(0, 0);
  });
}

// Countdown Timer Logic (September 6, 2026 at 18:00 UTC+5, which is 13:00 UTC)
const targetDate = new Date(Date.UTC(2026, 8, 6, 13, 0, 0));

function updateCountdown() {
  const daysEl = document.getElementById("countdown-days");
  const hoursEl = document.getElementById("countdown-hours");
  const minutesEl = document.getElementById("countdown-minutes");
  const secondsEl = document.getElementById("countdown-seconds");

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  const now = new Date().getTime();
  const distance = targetDate.getTime() - now;

  if (distance < 0) {
    daysEl.textContent = "00";
    hoursEl.textContent = "00";
    minutesEl.textContent = "00";
    secondsEl.textContent = "00";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  daysEl.textContent = String(days).padStart(2, "0");
  hoursEl.textContent = String(hours).padStart(2, "0");
  minutesEl.textContent = String(minutes).padStart(2, "0");
  secondsEl.textContent = String(seconds).padStart(2, "0");
}

// Run immediately and update every second
updateCountdown();
setInterval(updateCountdown, 1000);
