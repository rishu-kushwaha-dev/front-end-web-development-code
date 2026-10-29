const STORAGE_KEY = "fitness_tracker_data";

const state = {
    steps: 0,
    calories: 0,
    water: 0,
    workouts: 0,
    log: []
};

function load() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) Object.assign(state, JSON.parse(raw));
    } catch (e) { }
}

function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function render() {
    document.getElementById("steps").textContent = state.steps;
    document.getElementById("calories").textContent = state.calories;
    document.getElementById("water").textContent = state.water;
    document.getElementById("workouts").textContent = state.workouts;

    const list = document.getElementById("logList");
    list.innerHTML = "";
    state.log.forEach((entry) => {
        const li = document.createElement("li");
        li.innerHTML = `<span class="type">${entry.type}</span><span>+${entry.value}</span>`;
        list.appendChild(li);
    });
}

document.getElementById("activityForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const type = document.getElementById("activityType").value;
    const value = parseInt(document.getElementById("activityValue").value, 10);
    if (isNaN(value) || value <= 0) return;

    if (type === "steps") state.steps += value;
    else if (type === "calories") state.calories += value;
    else if (type === "water") state.water += value;
    else if (type === "workout") state.workouts += value;

    state.log.unshift({ type, value, date: new Date().toISOString() });
    save();
    render();
    e.target.reset();
});

document.getElementById("clearBtn").addEventListener("click", () => {
    state.steps = 0;
    state.calories = 0;
    state.water = 0;
    state.workouts = 0;
    state.log = [];
    save();
    render();
});

load();
render();