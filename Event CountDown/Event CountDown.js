const form = document.getElementById("countdown-form");
const eventNameInput = document.getElementById("event-name");
const eventDateInput = document.getElementById("event-date");
const eventTitle = document.getElementById("event-title");
const message = document.getElementById("message");
const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

let timerId = null;

function pad(value) {
    return String(value).padStart(2, "0");
}

function setDisplay(days, hours, minutes, seconds) {
    daysEl.textContent = pad(days);
    hoursEl.textContent = pad(hours);
    minutesEl.textContent = pad(minutes);
    secondsEl.textContent = pad(seconds);
}

function clearTimer() {
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
    }
}

function startCountdown(name, targetTime) {
    clearTimer();
    eventTitle.textContent = name;
    message.textContent = "";

    function update() {
        const now = Date.now();
        const diff = targetTime - now;

        if (diff <= 0) {
            setDisplay(0, 0, 0, 0);
            message.textContent = `${name} has started!`;
            clearTimer();
            return;
        }

        const totalSeconds = Math.floor(diff / 1000);
        const days = Math.floor(totalSeconds / (24 * 60 * 60));
        const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        setDisplay(days, hours, minutes, seconds);
    }

    update();
    timerId = setInterval(update, 1000);
}

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = eventNameInput.value.trim() || "Event";
    const dateValue = eventDateInput.value;

    if (!dateValue) {
        message.textContent = "Please select a date and time.";
        return;
    }

    const targetTime = new Date(dateValue).getTime();
    if (Number.isNaN(targetTime)) {
        message.textContent = "Invalid date and time.";
        return;
    }

    if (targetTime <= Date.now()) {
        message.textContent = "Please choose a future date and time.";
        return;
    }

    startCountdown(name, targetTime);
});