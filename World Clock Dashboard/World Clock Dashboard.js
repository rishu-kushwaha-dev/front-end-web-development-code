const commonTimezones = [
  { label: "New York (EST/EDT)", value: "America/New_York" },
  { label: "Los Angeles (PST/PDT)", value: "America/Los_Angeles" },
  { label: "Chicago (CST/CDT)", value: "America/Chicago" },
  { label: "Denver (MST/MDT)", value: "America/Denver" },
  { label: "Toronto", value: "America/Toronto" },
  { label: "Vancouver", value: "America/Vancouver" },
  { label: "Mexico City", value: "America/Mexico_City" },
  { label: "São Paulo", value: "America/Sao_Paulo" },
  { label: "Buenos Aires", value: "America/Argentina/Buenos_Aires" },
  { label: "London (GMT/BST)", value: "Europe/London" },
  { label: "Paris (CET/CEST)", value: "Europe/Paris" },
  { label: "Berlin", value: "Europe/Berlin" },
  { label: "Rome", value: "Europe/Rome" },
  { label: "Madrid", value: "Europe/Madrid" },
  { label: "Amsterdam", value: "Europe/Amsterdam" },
  { label: "Moscow", value: "Europe/Moscow" },
  { label: "Istanbul", value: "Europe/Istanbul" },
  { label: "Dubai", value: "Asia/Dubai" },
  { label: "Mumbai", value: "Asia/Kolkata" },
  { label: "Singapore", value: "Asia/Singapore" },
  { label: "Hong Kong", value: "Asia/Hong_Kong" },
  { label: "Tokyo", value: "Asia/Tokyo" },
  { label: "Seoul", value: "Asia/Seoul" },
  { label: "Shanghai", value: "Asia/Shanghai" },
  { label: "Sydney (AEST/AEDT)", value: "Australia/Sydney" },
  { label: "Melbourne", value: "Australia/Melbourne" },
  { label: "Auckland (NZST/NZDT)", value: "Pacific/Auckland" },
  { label: "Honolulu", value: "Pacific/Honolulu" },
  { label: "Anchorage", value: "America/Anchorage" },
  { label: "Reykjavik", value: "Atlantic/Reykjavik" },
  { label: "Cairo", value: "Africa/Cairo" },
  { label: "Johannesburg", value: "Africa/Johannesburg" },
  { label: "Lagos", value: "Africa/Lagos" },
  { label: "Nairobi", value: "Africa/Nairobi" },
  { label: "Vancouver", value: "America/Vancouver" },
  { label: "Calgary", value: "America/Edmonton" },
  { label: "Winnipeg", value: "America/Winnipeg" },
  { label: "Halifax", value: "America/Halifax" },
  { label: "St. John's", value: "America/St_Johns" },
  { label: "Santiago", value: "America/Santiago" },
  { label: "Lima", value: "America/Lima" },
  { label: "Bogotá", value: "America/Bogota" },
  { label: "Caracas", value: "America/Caracas" },
  { label: "Montevideo", value: "America/Montevideo" },
  { label: "Dublin", value: "Europe/Dublin" },
  { label: "Lisbon", value: "Europe/Lisbon" },
  { label: "Vienna", value: "Europe/Vienna" },
  { label: "Zurich", value: "Europe/Zurich" },
  { label: "Stockholm", value: "Europe/Stockholm" },
  { label: "Oslo", value: "Europe/Oslo" },
  { label: "Copenhagen", value: "Europe/Copenhagen" },
  { label: "Helsinki", value: "Europe/Helsinki" },
  { label: "Athens", value: "Europe/Athens" },
  { label: "Warsaw", value: "Europe/Warsaw" },
  { label: "Prague", value: "Europe/Prague" },
  { label: "Budapest", value: "Europe/Budapest" },
  { label: "Bucharest", value: "Europe/Bucharest" },
  { label: "Kiev", value: "Europe/Kiev" },
  { label: "Minsk", value: "Europe/Minsk" },
  { label: "Riyadh", value: "Asia/Riyadh" },
  { label: "Tehran", value: "Asia/Tehran" },
  { label: "Karachi", value: "Asia/Karachi" },
  { label: "Dhaka", value: "Asia/Dhaka" },
  { label: "Bangkok", value: "Asia/Bangkok" },
  { label: "Jakarta", value: "Asia/Jakarta" },
  { label: "Kuala Lumpur", value: "Asia/Kuala_Lumpur" },
  { label: "Manila", value: "Asia/Manila" },
  { label: "Taipei", value: "Asia/Taipei" },
  { label: "Perth", value: "Australia/Perth" },
  { label: "Adelaide", value: "Australia/Adelaide" },
  { label: "Brisbane", value: "Australia/Brisbane" },
  { label: "Darwin", value: "Australia/Darwin" },
  { label: "Hobart", value: "Australia/Hobart" },
  { label: "Wellington", value: "Pacific/Auckland" },
  { label: "Fiji", value: "Pacific/Fiji" },
  { label: "Guam", value: "Pacific/Guam" },
  { label: "Port Moresby", value: "Pacific/Port_Moresby" },
  { label: "Noumea", value: "Pacific/Noumea" },
  { label: "Papeete", value: "Pacific/Tahiti" },
  { label: "Honolulu", value: "Pacific/Honolulu" },
  { label: "Anchorage", value: "America/Anchorage" },
  { label: "Juneau", value: "America/Juneau" },
  { label: "Phoenix", value: "America/Phoenix" },
  { label: "Denver", value: "America/Denver" },
  { label: "Chicago", value: "America/Chicago" },
  { label: "New York", value: "America/New_York" },
  { label: "Toronto", value: "America/Toronto" },
  { label: "Halifax", value: "America/Halifax" },
  { label: "St. John's", value: "America/St_Johns" },
  { label: "Rio de Janeiro", value: "America/Sao_Paulo" },
  { label: "Fernando de Noronha", value: "America/Noronha" },
  { label: "Reykjavik", value: "Atlantic/Reykjavik" },
  { label: "Casablanca", value: "Africa/Casablanca" },
  { label: "Cape Verde", value: "Atlantic/Cape_Verde" },
  { label: "Azores", value: "Atlantic/Azores" },
  { label: "Baker Island", value: "Pacific/Baker" },
  { label: "Howland Island", value: "Pacific/Howland" },
];

const STORAGE_KEY = "world-clock-cities";
const PREFERENCES_KEY = "world-clock-preferences";

const clocksGrid = document.getElementById("clocksGrid");
const localDateEl = document.getElementById("localDate");
const addCityBtn = document.getElementById("addCityBtn");
const cityModal = document.getElementById("cityModal");
const citySearch = document.getElementById("citySearch");
const searchResults = document.getElementById("searchResults");
const cancelBtn = document.getElementById("cancelBtn");
const formatToggle = document.getElementById("formatToggle");
const themeToggle = document.getElementById("themeToggle");
const customTimezoneInput = document.getElementById("customTimezone");
const addCustomBtn = document.getElementById("addCustomBtn");

let cities = loadCities();
let updateInterval;
let preferences = loadPreferences();
let draggedCard = null;

function loadCities() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveCities() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cities));
}

function loadPreferences() {
  try {
    const stored = localStorage.getItem(PREFERENCES_KEY);
    return stored ? JSON.parse(stored) : { use24Hour: false, theme: "dark" };
  } catch {
    return { use24Hour: false, theme: "dark" };
  }
}

function savePreferences() {
  localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
}

function formatTime(date, timeZone) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: !preferences.use24Hour,
    timeZone,
  }).format(date);
}

function formatDate(date, timeZone) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone,
  }).format(date);
}

function getTimezoneOffset(timeZone, date = new Date()) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "shortOffset",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = formatter.formatToParts(date);
  const offsetPart = parts.find((p) => p.type === "timeZoneName");
  if (offsetPart) {
    return offsetPart.value.replace("GMT", "UTC");
  }
  return "";
}

function renderClocks() {
  clocksGrid.innerHTML = "";

  if (cities.length === 0) {
    clocksGrid.innerHTML = '<div class="empty-state">Click + to add a city</div>';
    return;
  }

  const now = new Date();

  cities.forEach((city, index) => {
    const card = document.createElement("div");
    card.className = "clock-card";
    card.draggable = true;
    card.dataset.index = index;
    card.innerHTML = `
      <div class="city-name">
        <span>${escapeHtml(city.label)}</span>
        <button class="remove-city" data-index="${index}" aria-label="Remove ${escapeHtml(city.label)}">×</button>
      </div>
      <div class="clock-time" data-timezone="${city.value}">${formatTime(now, city.value)}</div>
      <div class="clock-date" data-timezone="${city.value}">${formatDate(now, city.value)}</div>
      <div class="clock-offset" data-timezone="${city.value}">${getTimezoneOffset(city.value, now)}</div>
      <div class="drag-handle" aria-label="Drag to reorder">⋮⋮</div>
    `;
    clocksGrid.appendChild(card);
  });

  document.querySelectorAll(".remove-city").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const idx = parseInt(e.currentTarget.dataset.index, 10);
      removeCity(idx);
    });
  });

  setupDragAndDrop();
}

function updateAllClocks() {
  const now = new Date();
  document.querySelectorAll(".clock-time").forEach((el) => {
    el.textContent = formatTime(now, el.dataset.timezone);
  });
  document.querySelectorAll(".clock-date").forEach((el) => {
    el.textContent = formatDate(now, el.dataset.timezone);
  });
  document.querySelectorAll(".clock-offset").forEach((el) => {
    el.textContent = getTimezoneOffset(el.dataset.timezone, now);
  });
  updateLocalTime(now);
}

function updateLocalTime(now) {
  localDateEl.textContent = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: !preferences.use24Hour,
  }).format(now);
}

function setupDragAndDrop() {
  document.querySelectorAll(".clock-card").forEach((card) => {
    card.addEventListener("dragstart", handleDragStart);
    card.addEventListener("dragend", handleDragEnd);
    card.addEventListener("dragover", handleDragOver);
    card.addEventListener("drop", handleDrop);
    card.addEventListener("dragenter", handleDragEnter);
    card.addEventListener("dragleave", handleDragLeave);
  });
}

function handleDragStart(e) {
  draggedCard = e.currentTarget;
  e.currentTarget.classList.add("dragging");
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/plain", e.currentTarget.dataset.index);
}

function handleDragEnd(e) {
  e.currentTarget.classList.remove("dragging");
  document.querySelectorAll(".clock-card").forEach((c) => c.classList.remove("drag-over"));
  draggedCard = null;
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
}

function handleDragEnter(e) {
  e.currentTarget.classList.add("drag-over");
}

function handleDragLeave(e) {
  if (!e.currentTarget.contains(e.relatedTarget)) {
    e.currentTarget.classList.remove("drag-over");
  }
}

function handleDrop(e) {
  e.preventDefault();
  const targetCard = e.currentTarget;
  targetCard.classList.remove("drag-over");
  
  const fromIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
  const toIndex = parseInt(targetCard.dataset.index, 10);
  
  if (fromIndex !== toIndex && !isNaN(fromIndex) && !isNaN(toIndex)) {
    reorderCities(fromIndex, toIndex);
  }
}

function reorderCities(fromIndex, toIndex) {
  const [removed] = cities.splice(fromIndex, 1);
  cities.splice(toIndex, 0, removed);
  saveCities();
  renderClocks();
}

function removeCity(index) {
  cities.splice(index, 1);
  saveCities();
  renderClocks();
}

function addCity(timezone) {
  const exists = cities.some((c) => c.value === timezone);
  if (exists) return;

  const tz = commonTimezones.find((c) => c.value === timezone);
  const label = tz ? tz.label : timezone;
  cities.push({ value: timezone, label });
  saveCities();
  renderClocks();
  closeModal();
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function openModal() {
  cityModal.classList.add("active");
  citySearch.value = "";
  customTimezoneInput.value = "";
  searchResults.innerHTML = "";
  searchResults.style.display = "none";
  citySearch.focus();
}

function closeModal() {
  cityModal.classList.remove("active");
}

function filterTimezones(query) {
  const q = query.toLowerCase().trim();
  if (!q) return commonTimezones;
  return commonTimezones.filter(
    (c) => c.label.toLowerCase().includes(q) || c.value.toLowerCase().includes(q)
  );
}

function renderSearchResults(results) {
  searchResults.innerHTML = "";
  if (results.length === 0) {
    searchResults.style.display = "none";
    return;
  }
  results.forEach((tz, idx) => {
    const li = document.createElement("li");
    li.textContent = tz.label;
    li.dataset.value = tz.value;
    li.dataset.index = idx;
    li.addEventListener("click", () => addCity(tz.value));
    searchResults.appendChild(li);
  });
  searchResults.style.display = "block";
}

let selectedResultIndex = -1;

citySearch.addEventListener("input", () => {
  const results = filterTimezones(citySearch.value);
  renderSearchResults(results);
  selectedResultIndex = -1;
});

citySearch.addEventListener("keydown", (e) => {
  const items = searchResults.querySelectorAll("li");
  if (items.length === 0) return;

  if (e.key === "ArrowDown") {
    e.preventDefault();
    selectedResultIndex = Math.min(selectedResultIndex + 1, items.length - 1);
    updateSelection(items);
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    selectedResultIndex = Math.max(selectedResultIndex - 1, 0);
    updateSelection(items);
  } else if (e.key === "Enter") {
    e.preventDefault();
    if (selectedResultIndex >= 0 && items[selectedResultIndex]) {
      addCity(items[selectedResultIndex].dataset.value);
    }
  } else if (e.key === "Escape") {
    closeModal();
  }
});

function updateSelection(items) {
  items.forEach((item, idx) => {
    if (idx === selectedResultIndex) {
      item.classList.add("selected");
      item.scrollIntoView({ block: "nearest" });
    } else {
      item.classList.remove("selected");
    }
  });
}

searchResults.addEventListener("mousedown", (e) => {
  const li = e.target.closest("li");
  if (li) {
    selectedResultIndex = parseInt(li.dataset.index, 10);
  }
});

addCityBtn.addEventListener("click", openModal);
cancelBtn.addEventListener("click", closeModal);
cityModal.addEventListener("click", (e) => {
  if (e.target === cityModal) closeModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

formatToggle.addEventListener("change", () => {
  preferences.use24Hour = formatToggle.checked;
  savePreferences();
  renderClocks();
});

themeToggle.addEventListener("change", () => {
  preferences.theme = themeToggle.checked ? "light" : "dark";
  savePreferences();
  applyTheme();
});

addCustomBtn.addEventListener("click", () => {
  const tz = customTimezoneInput.value.trim();
  if (tz) {
    try {
      Intl.DateTimeFormat(undefined, { timeZone: tz });
      addCity(tz);
    } catch {
      alert("Invalid timezone. Example: America/New_York, Europe/London, Asia/Tokyo");
    }
  }
});

function applyTheme() {
  document.documentElement.setAttribute("data-theme", preferences.theme);
}

function applyFormatToggle() {
  formatToggle.checked = preferences.use24Hour;
}

function applyThemeToggle() {
  themeToggle.checked = preferences.theme === "light";
}

renderClocks();
applyTheme();
applyFormatToggle();
applyThemeToggle();
updateInterval = setInterval(updateAllClocks, 1000);