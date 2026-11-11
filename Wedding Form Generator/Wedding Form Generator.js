const form = document.getElementById("wedding-form");
const resetBtn = document.getElementById("reset-btn");
const printBtn = document.getElementById("print-btn");
const invitation = document.getElementById("invitation");

const fields = {
    brideName: document.getElementById("brideName"),
    groomName: document.getElementById("groomName"),
    weddingDate: document.getElementById("weddingDate"),
    weddingTime: document.getElementById("weddingTime"),
    venue: document.getElementById("venue"),
    address: document.getElementById("address"),
    hostedBy: document.getElementById("hostedBy"),
    rsvp: document.getElementById("rsvp"),
    message: document.getElementById("message"),
    themeColor: document.getElementById("themeColor"),
};

const out = {
    names: document.getElementById("out-names"),
    date: document.getElementById("out-date"),
    time: document.getElementById("out-time"),
    venue: document.getElementById("out-venue"),
    address: document.getElementById("out-address"),
    message: document.getElementById("out-message"),
    hosted: document.getElementById("out-hosted"),
    rsvp: document.getElementById("out-rsvp"),
};

function formatDate(value) {
    if (!value) return "Date";
    const date = new Date(value + "T00:00:00");
    return date.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

function formatTime(value) {
    if (!value) return "Time";
    const [hour, minute] = value.split(":").map(Number);
    const date = new Date();
    date.setHours(hour, minute);
    return date.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
    });
}

function updatePreview() {
    const bride = fields.brideName.value.trim();
    const groom = fields.groomName.value.trim();
    out.names.textContent = bride || groom ? `${bride || "Bride"} & ${groom || "Groom"}` : "Bride & Groom";
    out.date.textContent = formatDate(fields.weddingDate.value);
    out.time.textContent = formatTime(fields.weddingTime.value);
    out.venue.textContent = fields.venue.value.trim() || "Venue";
    out.address.textContent = fields.address.value.trim() || "Address";
    out.message.textContent = fields.message.value.trim();
    out.hosted.textContent = fields.hostedBy.value.trim() ? `Hosted by ${fields.hostedBy.value.trim()}` : "";
    out.rsvp.textContent = fields.rsvp.value.trim() ? `RSVP: ${fields.rsvp.value.trim()}` : "";
    invitation.style.setProperty("--theme", fields.themeColor.value || "#b08968");
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    updatePreview();
});

Object.values(fields).forEach((field) => {
    field.addEventListener("input", updatePreview);
    field.addEventListener("change", updatePreview);
});

resetBtn.addEventListener("click", () => {
    form.reset();
    fields.themeColor.value = "#b08968";
    updatePreview();
});

printBtn.addEventListener("click", () => {
    updatePreview();
    window.print();
});

updatePreview();
