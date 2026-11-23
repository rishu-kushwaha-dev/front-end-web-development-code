const API_KEY = '3530685e';
const BASE_URL = 'https://www.omdbapi.com/';

const input = document.getElementById('movie-input');
const searchBtn = document.getElementById('search-btn');
const movieGrid = document.getElementById('movie-grid');
const errorMsg = document.getElementById('error-msg');

const modal = document.getElementById('movie-modal');
const modalBody = document.getElementById('modal-body');
const closeBtn = document.querySelector('#movie-modal .close-btn');

function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.classList.remove('hidden');
    movieGrid.innerHTML = '';
}

function hideError() {
    errorMsg.classList.add('hidden');
}

function getPoster(poster) {
    return poster && poster !== 'N/A' ? poster : 'https://via.placeholder.com/300x450?text=No+Poster';
}

function createCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.innerHTML = `
        <img src="${getPoster(movie.Poster)}" alt="${movie.Title}" class="movie-poster">
        <div class="movie-info">
            <div class="movie-title">${movie.Title}</div>
            <div class="movie-year">${movie.Year}</div>
        </div>
    `;
    card.addEventListener('click', () => openModal(movie.imdbID));
    return card;
}

function renderGrid(movies) {
    movieGrid.innerHTML = '';
    movies.forEach(m => movieGrid.appendChild(createCard(m)));
}

async function fetchMovies(query) {
    hideError();
    try {
        const url = `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.Response === 'False' || !data.Search) {
            showError(`No movies found for "${query}".`);
            return;
        }

        renderGrid(data.Search);
    } catch (err) {
        console.error(err);
        showError('Error loading movies. Please try again later.');
    }
}

async function openModal(imdbID) {
    modalBody.innerHTML = '<div style="grid-column: 1 / -1; text-align:center; padding: 2rem;">Loading details...</div>';
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    try {
        const res = await fetch(`${BASE_URL}?apikey=${API_KEY}&i=${imdbID}&plot=full`);
        const m = await res.json();
        if (m.Response === 'False') {
            modalBody.innerHTML = '<p style="grid-column: 1 / -1; text-align:center;">Failed to load movie details.</p>';
            return;
        }
        const poster = getPoster(m.Poster);
        modalBody.innerHTML = `
            <img src="${poster}" alt="${m.Title}" class="modal-poster">
            <div class="modal-details">
                <h2>${m.Title} <span style="font-weight:400;font-size:1rem;color:var(--muted);">(${m.Year})</span></h2>
                <div class="meta-row"><strong>Type</strong>${m.Type}</div>
                <div class="meta-row"><strong>Rated</strong>${m.Rated}</div>
                <div class="meta-row"><strong>Released</strong>${m.Released}</div>
                <div class="meta-row"><strong>Runtime</strong>${m.Runtime}</div>
                <div class="meta-row"><strong>Genre</strong>${m.Genre}</div>
                <div class="meta-row"><strong>Director</strong>${m.Director}</div>
                <div class="meta-row"><strong>Cast</strong>${m.Actors}</div>
                <div class="meta-row"><strong>IMDB Rating</strong>${m.imdbRating}</div>
                <div class="movie-plot">${m.Plot}</div>
            </div>
        `;
    } catch (err) {
        console.error(err);
        modalBody.innerHTML = '<p style="grid-column: 1 / -1; text-align:center;">Error loading movie details.</p>';
    }
}

function closeModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
}

function searchFromInput() {
    const q = input.value.trim();
    if (!q) {
        showError('Please enter a movie name.');
        return;
    }
    fetchMovies(q);
}

searchBtn.addEventListener('click', searchFromInput);

input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchFromInput();
});

closeBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });