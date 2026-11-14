const STORAGE_KEY = 'academicTimetableEntries';
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const entries = loadEntries();
const savedDay = localStorage.getItem('academicTimetableDay');
let currentDay = DAYS.includes(savedDay) ? savedDay : getToday();
let currentView = 'day';
let searchQuery = '';
let categoryFilter = 'all';

const elements = {
    body: document.getElementById('timetableBody'),
    daySelect: document.getElementById('daySelect'),
    categoryFilter: document.getElementById('categoryFilter'),
    searchInput: document.getElementById('searchInput'),
    emptyMsg: document.getElementById('emptyMsg'),
    weekView: document.getElementById('weekView'),
    weekEmpty: document.getElementById('weekEmpty'),
    weekGrid: document.getElementById('weekGrid'),
    modal: document.getElementById('modal'),
    form: document.getElementById('entryForm'),
    modalTitle: document.getElementById('modalTitle'),
    scheduleTitle: document.getElementById('scheduleTitle'),
    todayLabel: document.getElementById('todayLabel')
};

function loadEntries() {
    try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
        return Array.isArray(stored) ? stored : [];
    } catch {
        return [];
    }
}

function getToday() {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    return DAYS.includes(today) ? today : 'Monday';
}

document.addEventListener('DOMContentLoaded', () => {
    elements.daySelect.value = currentDay;
    setTodayLabel();
    bindEvents();
    render();
});

function bindEvents() {
    document.getElementById('addBtn').addEventListener('click', openAddModal);
    document.getElementById('closeModalBtn').addEventListener('click', closeModal);
    document.getElementById('cancelBtn').addEventListener('click', closeModal);
    document.getElementById('entryForm').addEventListener('submit', handleSubmit);
    document.getElementById('printBtn').addEventListener('click', () => window.print());
    document.getElementById('clearDayBtn').addEventListener('click', clearDay);
    elements.daySelect.addEventListener('change', (event) => {
        currentDay = event.target.value;
        localStorage.setItem('academicTimetableDay', currentDay);
        render();
    });
    elements.categoryFilter.addEventListener('change', (event) => {
        categoryFilter = event.target.value;
        render();
    });
    elements.searchInput.addEventListener('input', (event) => {
        searchQuery = event.target.value.trim().toLowerCase();
        render();
    });
    document.querySelectorAll('[data-add-entry]').forEach((button) => button.addEventListener('click', openAddModal));
    document.querySelectorAll('[data-view]').forEach((button) => {
        button.addEventListener('click', () => setView(button.dataset.view));
    });
    elements.modal.addEventListener('click', (event) => {
        if (event.target === elements.modal) closeModal();
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeModal();
    });
}

function setView(view) {
    currentView = view;
    document.querySelectorAll('[data-view]').forEach((button) => {
        const active = button.dataset.view === view;
        button.classList.toggle('active', active);
        if (button.classList.contains('nav-item')) button.setAttribute('aria-current', active ? 'page' : 'false');
    });
    render();
}

function openAddModal() {
    elements.form.reset();
    document.getElementById('entryId').value = '';
    document.getElementById('day').value = currentDay;
    document.getElementById('category').value = 'Class';
    document.getElementById('color').value = '#2563eb';
    setRecurringDays([]);
    elements.modalTitle.textContent = 'Add Class';
    elements.modal.classList.add('active');
    document.getElementById('activity').focus();
}

function openEditModal(id) {
    const entry = entries.find((item) => item.id === id);
    if (!entry) return;
    elements.form.reset();
    document.getElementById('entryId').value = entry.id;
    document.getElementById('day').value = entry.day;
    document.getElementById('startTime').value = entry.startTime || entry.time;
    document.getElementById('endTime').value = entry.endTime || '';
    document.getElementById('activity').value = entry.activity;
    document.getElementById('category').value = entry.category || 'Class';
    document.getElementById('teacher').value = entry.teacher || '';
    document.getElementById('location').value = entry.location || '';
    document.getElementById('notes').value = entry.notes || '';
    document.getElementById('color').value = entry.color || '#2563eb';
    setRecurringDays([]);
    elements.modalTitle.textContent = 'Edit Class';
    elements.modal.classList.add('active');
}

function setRecurringDays(days) {
    document.querySelectorAll('#recurringCheckboxes input').forEach((checkbox) => {
        checkbox.checked = days.includes(checkbox.value);
    });
}

function getRecurringDays() {
    return [...document.querySelectorAll('#recurringCheckboxes input:checked')].map((checkbox) => checkbox.value);
}

function closeModal() {
    elements.modal.classList.remove('active');
}

function handleSubmit(event) {
    event.preventDefault();
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    if (endTime && endTime < startTime) {
        alert('End time cannot be earlier than start time.');
        return;
    }
    const id = document.getElementById('entryId').value;
    const day = document.getElementById('day').value;
    const baseEntry = {
        day,
        time: startTime,
        startTime,
        endTime,
        activity: document.getElementById('activity').value.trim(),
        category: document.getElementById('category').value,
        teacher: document.getElementById('teacher').value.trim(),
        location: document.getElementById('location').value.trim(),
        notes: document.getElementById('notes').value.trim(),
        color: document.getElementById('color').value
    };
    if (!baseEntry.activity) return;
    if (id) {
        Object.assign(entries.find((entry) => entry.id === id), baseEntry);
    } else {
        const days = getRecurringDays();
        const selectedDays = days.length ? days : [day];
        [...new Set(selectedDays)].forEach((entryDay) => entries.push({ ...baseEntry, day: entryDay, id: createId() }));
    }
    saveEntries();
    currentDay = day;
    elements.daySelect.value = day;
    localStorage.setItem('academicTimetableDay', currentDay);
    closeModal();
    render();
}

function createId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function deleteEntry(id) {
    if (!confirm('Delete this timetable entry?')) return;
    const index = entries.findIndex((entry) => entry.id === id);
    if (index !== -1) entries.splice(index, 1);
    saveEntries();
    render();
}

function clearDay() {
    if (!entries.some((entry) => entry.day === currentDay)) return;
    if (!confirm(`Delete all entries for ${currentDay}?`)) return;
    for (let i = entries.length - 1; i >= 0; i -= 1) {
        if (entries[i].day === currentDay) entries.splice(i, 1);
    }
    saveEntries();
    render();
}

function saveEntries() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function getFilteredEntries(day) {
    const query = searchQuery;
    return entries
        .filter((entry) => entry.day === day)
        .filter((entry) => categoryFilter === 'all' || (entry.category || 'Class') === categoryFilter)
        .filter((entry) => !query || [entry.activity, entry.teacher, entry.location, entry.notes, entry.category].some((value) => (value || '').toLowerCase().includes(query)))
        .sort((a, b) => (a.startTime || a.time).localeCompare(b.startTime || b.time));
}

function render() {
    const isDayView = currentView === 'day';
    elements.scheduleTitle.textContent = isDayView ? `${currentDay} Schedule` : 'Weekly Schedule';
    elements.daySelect.parentElement.style.display = isDayView ? '' : 'none';
    document.getElementById('dayView').hidden = !isDayView;
    elements.weekView.hidden = isDayView;
    elements.weekEmpty.hidden = isDayView;
    if (isDayView) renderDayView();
    else renderWeekView();
    updateStats();
}

function renderDayView() {
    const filtered = getFilteredEntries(currentDay);
    elements.body.replaceChildren();
    elements.emptyMsg.hidden = filtered.length > 0;
    filtered.forEach((entry) => elements.body.appendChild(createDayRow(entry)));
    elements.body.querySelectorAll('[data-edit]').forEach((button) => button.addEventListener('click', () => openEditModal(button.dataset.edit)));
    elements.body.querySelectorAll('[data-delete]').forEach((button) => button.addEventListener('click', () => deleteEntry(button.dataset.delete)));
}

function createDayRow(entry) {
    const row = document.createElement('tr');
    const type = entry.category || 'Class';
    row.innerHTML = `
        <td class="time-cell">${formatTimeRange(entry)}</td>
        <td class="subject-cell"><span class="color-dot" style="background:${escapeAttr(entry.color || '#2563eb')}"></span>${escapeHtml(entry.activity)}</td>
        <td><span class="badge badge-type-${escapeAttr(type.toLowerCase())}">${escapeHtml(type)}</span></td>
        <td>${escapeHtml(entry.teacher || '-')}</td>
        <td>${escapeHtml(entry.location || '-')}</td>
        <td>${escapeHtml(entry.notes || '-')}</td>
        <td><button class="action-btn edit-btn" type="button" data-edit="${escapeAttr(entry.id)}">Edit</button><button class="action-btn delete-btn" type="button" data-delete="${escapeAttr(entry.id)}">Delete</button></td>`;
    return row;
}

function renderWeekView() {
    elements.weekGrid.replaceChildren();
    const weekEntries = entries.filter((entry) => categoryFilter === 'all' || (entry.category || 'Class') === categoryFilter);
    const visibleDays = DAYS.filter((day) => !searchQuery || getFilteredEntries(day).length > 0);
    elements.weekEmpty.hidden = weekEntries.length > 0;
    elements.weekView.hidden = weekEntries.length === 0;
    if (!weekEntries.length) return;
    elements.weekGrid.style.gridTemplateColumns = `75px repeat(${visibleDays.length}, minmax(115px, 1fr))`;
    elements.weekGrid.appendChild(createElement('div', 'week-corner', ''));
    visibleDays.forEach((day) => {
        const heading = createElement('div', 'week-day');
        heading.innerHTML = `<strong>${day.slice(0, 3)}</strong><small>${getFilteredEntries(day).length} classes</small>`;
        elements.weekGrid.appendChild(heading);
    });
    const slots = getTimeSlots(weekEntries);
    slots.forEach((slot) => {
        elements.weekGrid.appendChild(createTimeColumn(slot));
        visibleDays.forEach((day) => {
            const cell = createElement('div', 'day-column');
            getFilteredEntries(day).filter((entry) => (entry.startTime || entry.time).slice(0, 2) === slot).forEach((entry) => cell.appendChild(createClassChip(entry)));
            elements.weekGrid.appendChild(cell);
        });
    });
}

function getTimeSlots(dayEntries) {
    const hours = dayEntries.map((entry) => Number((entry.startTime || entry.time).slice(0, 2)));
    const min = Math.min(8, ...hours);
    const max = Math.max(17, ...hours);
    return Array.from({ length: Math.max(1, max - min + 1) }, (_, index) => String(min + index).padStart(2, '0'));
}

function createTimeColumn(slot) {
    const column = createElement('div', 'time-column');
    column.appendChild(createElement('div', 'time-slot', formatHour(slot)));
    return column;
}

function createClassChip(entry) {
    const type = (entry.category || 'Class').toLowerCase();
    const chip = createElement('div', `class-chip ${type}`);
    chip.style.borderLeftColor = entry.color || '';
    chip.innerHTML = `<strong>${escapeHtml(entry.activity)}</strong><span>${escapeHtml(formatTime(entry.startTime || entry.time))}${entry.location ? ` · ${escapeHtml(entry.location)}` : ''}</span>`;
    return chip;
}

function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
}

function updateStats() {
    const dayEntries = entries.filter((entry) => entry.day === currentDay);
    document.getElementById('statEntries').textContent = dayEntries.length;
    const totalMinutes = dayEntries.reduce((total, entry) => total + durationMinutes(entry), 0);
    document.getElementById('statTime').textContent = `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`;
    const counts = dayEntries.reduce((result, entry) => {
        const type = entry.category || 'Class';
        result[type] = (result[type] || 0) + 1;
        return result;
    }, {});
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    document.getElementById('statCategory').textContent = top ? top[0] : '-';
}

function durationMinutes(entry) {
    if (!entry.endTime) return 60;
    const [startHour, startMinute] = (entry.startTime || entry.time).split(':').map(Number);
    const [endHour, endMinute] = entry.endTime.split(':').map(Number);
    return Math.max(0, endHour * 60 + endMinute - startHour * 60 - startMinute);
}

function formatTimeRange(entry) {
    const start = entry.startTime || entry.time;
    return entry.endTime ? `${formatTime(start)} – ${formatTime(entry.endTime)}` : formatTime(start);
}

function formatTime(value) {
    if (!value) return '-';
    const [hours, minutes] = value.split(':');
    const hour = Number(hours);
    return `${hour % 12 || 12}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`;
}

function formatHour(value) {
    const hour = Number(value);
    return `${hour % 12 || 12}:00 ${hour >= 12 ? 'PM' : 'AM'}`;
}

function setTodayLabel() {
    const now = new Date();
    elements.todayLabel.textContent = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function escapeHtml(value) {
    const node = document.createElement('div');
    node.textContent = value == null ? '' : String(value);
    return node.innerHTML;
}

function escapeAttr(value) {
    return escapeHtml(value).replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}