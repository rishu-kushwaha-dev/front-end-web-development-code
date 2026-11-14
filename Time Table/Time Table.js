const STORAGE_KEY = 'timetableEntries';
let entries = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let currentDay = 'Monday';
let searchQuery = '';

const timetableBody = document.getElementById('timetableBody');
const daySelect = document.getElementById('daySelect');
const searchInput = document.getElementById('searchInput');
const emptyMsg = document.getElementById('emptyMsg');
const modal = document.getElementById('modal');
const entryForm = document.getElementById('entryForm');
const modalTitle = document.getElementById('modalTitle');
const addBtn = document.getElementById('addBtn');
const cancelBtn = document.getElementById('cancelBtn');

document.addEventListener('DOMContentLoaded', () => {
    renderTable();
    setupEventListeners();
});

function setupEventListeners() {
    daySelect.addEventListener('change', (e) => {
        currentDay = e.target.value;
        renderTable();
    });

    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        renderTable();
    });

    addBtn.addEventListener('click', openAddModal);
    cancelBtn.addEventListener('click', closeModal);
    entryForm.addEventListener('submit', handleSubmit);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

function openAddModal() {
    modalTitle.textContent = 'Add Entry';
    entryForm.reset();
    document.getElementById('entryId').value = '';
    modal.classList.add('active');
}

function openEditModal(entry) {
    modalTitle.textContent = 'Edit Entry';
    document.getElementById('entryId').value = entry.id;
    document.getElementById('time').value = entry.time;
    document.getElementById('activity').value = entry.activity;
    document.getElementById('location').value = entry.location || '';
    document.getElementById('notes').value = entry.notes || '';
    modal.classList.add('active');
}

function closeModal() {
    modal.classList.remove('active');
    entryForm.reset();
}

function handleSubmit(e) {
    e.preventDefault();

    const entryId = document.getElementById('entryId').value;
    const time = document.getElementById('time').value;
    const activity = document.getElementById('activity').value;
    const location = document.getElementById('location').value;
    const notes = document.getElementById('notes').value;

    if (entryId) {
        const index = entries.findIndex(e => e.id === entryId);
        if (index !== -1) {
            entries[index] = { ...entries[index], time, activity, location, notes };
        }
    } else {
        entries.push({
            id: Date.now().toString(),
            day: currentDay,
            time,
            activity,
            location,
            notes
        });
    }

    saveEntries();
    renderTable();
    closeModal();
}

function deleteEntry(id) {
    if (confirm('Are you sure you want to delete this entry?')) {
        entries = entries.filter(e => e.id !== id);
        saveEntries();
        renderTable();
    }
}

function saveEntries() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function renderTable() {
    let filtered = entries.filter(e => e.day === currentDay);

    if (searchQuery) {
        filtered = filtered.filter(e =>
            e.activity.toLowerCase().includes(searchQuery) ||
            (e.location && e.location.toLowerCase().includes(searchQuery)) ||
            (e.notes && e.notes.toLowerCase().includes(searchQuery))
        );
    }

    filtered.sort((a, b) => a.time.localeCompare(b.time));

    timetableBody.innerHTML = '';

    if (filtered.length === 0) {
        emptyMsg.style.display = 'block';
        return;
    }

    emptyMsg.style.display = 'none';

    filtered.forEach(entry => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatTime(entry.time)}</td>
            <td><strong>${escapeHtml(entry.activity)}</strong></td>
            <td>${escapeHtml(entry.location || '-')}</td>
            <td>${escapeHtml(entry.notes || '-')}</td>
            <td>
                <button class="action-btn edit-btn" onclick="openEditModal(${JSON.stringify(entry)})">Edit</button>
                <button class="action-btn delete-btn" onclick="deleteEntry('${entry.id}')">Delete</button>
            </td>
        `;
        timetableBody.appendChild(row);
    });
}

function formatTime(timeString) {
    if (!timeString) return '-';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

window.openEditModal = openEditModal;
window.deleteEntry = deleteEntry;