const API_KEY = '3530685e';
const BASE_URL = 'https://www.omdbapi.com/';

const WATCHLIST_KEY = 'movieFinderWatchlist';
const RECENT_KEY = 'movieFinderRecent';
const MAX_RECENT = 4;
const DEFAULT_MOVIES = ['Avengers', 'Inception', 'Batman'];

const input = document.getElementById('movie-input');
const searchBtn = document.getElementById('search-btn');
const typeFilter = document.getElementById('type-filter');
const yearFilter = document.getElementById('year-filter');
const movieGrid = document.getElementById('movie-grid');
const loading = document.getElementById('loading');
const errorMsg = document.getElementById('error-msg');
const loadMoreContainer = document.getElementById('load-more-container');
const loadMoreBtn = document.getElementById('load-more-btn');
const pageInfo = document.getElementById('page-info');
const recentContainer = document.getElementById('recent-searches');

const modal = document.getElementById('movie-modal');
const modalBody = document.getElementById('modal-body');
const closeBtn = document.querySelector('#movie-modal .close-btn');

const watchlistModal = document.getElementById('watchlist-modal');
const watchlistBtn = document.getElementById('watchlist-btn');
const watchlistCount = document.getElementById('watchlist-count');
const watchlistGrid = document.getElementById('watchlist-grid');
const watchlistEmpty = document.getElementById('watchlist-empty');
const watchlistClose = watchlistModal.querySelector('.close-btn');

let currentQuery = '';
let currentType = '';
let currentYear = '';
let currentPage = 1;
let totalResults = 0;
let isLoading = false;
let watchlist = JSON.parse(localStorage.getItem(WATCHLIST_KEY)) || [];
let recentSearches = JSON.parse(localStorage.getItem(RECENT_KEY)) || [];

function populateYears() {
    const now = new Date().getFullYear();
    for (let y = now; y >= 1970; y--) {
        const opt = document.createElement('option');
        opt.value = y;
        opt.textContent = y;
        yearFilter.appendChild(opt);
    }
}

function showLoading(show) {
    loading.hidden = !show;
    errorMsg.hidden = true;
    if (show) {
        movieGrid.innerHTML = '';
        loadMoreContainer.hidden = true;
    }
}

function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.hidden = false;
    loading.hidden = true;
    movieGrid.innerHTML = '';
    loadMoreContainer.hidden = true;
}

function hideError() {
    errorMsg.hidden = true;
}

function getFallbackPoster(poster) {
    return poster && poster !== 'N/A' ? poster : 'https://via.placeholder.com/300x450?text=No+Poster';
}

function saveWatchlist() {
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
    watchlistCount.textContent = watchlist.length;
    renderWatchlistGrid();
}

function isInWatchlist(imdbID) {
    return watchlist.some(m => m.imdbID === imdbID);
}

function toggleWatchlist(imdbID, title, year, poster, type) {
    const idx = watchlist.findIndex(m => m.imdbID === imdbID);
    if (idx > -1) {
        watchlist.splice(idx, 1);
    } else {
        watchlist.push({ imdbID, title, year, poster, type });
    }
    saveWatchlist();
    renderGrid();
}

function renderWatchlistGrid() {
    watchlistGrid.innerHTML = '';
    if (watchlist.length === 0) {
        watchlistEmpty.hidden = false;
        return;
    }
    watchlistEmpty.hidden = true;
    watchlist.forEach(m => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.innerHTML = `
            <img src="${getFallbackPoster(m.poster)}" alt="${m.title}" class="movie-poster">
            <div class="movie-info">
                <div class="movie-title">${m.title}</div>
                <div class="movie-year">${m.year}</div>
            </div>
        `;
        card.addEventListener('click', () => openModal(m.imdbID));
        watchlistGrid.appendChild(card);
    });
}

function saveRecent(query) {
    recentSearches = recentSearches.filter(s => s !== query);
    recentSearches.unshift(query);
    if (recentSearches.length > MAX_RECENT) recentSearches.length = MAX_RECENT;
    localStorage.setItem(RECENT_KEY, JSON.stringify(recentSearches));
    renderRecent();
}

function renderRecent() {
    recentContainer.innerHTML = '<span class="recent-label">Recent:</span>';
    recentSearches.forEach(q => {
        const chip = document.createElement('span');
        chip.className = 'recent-chip';
        chip.textContent = q;
        chip.addEventListener('click', () => {
            input.value = q;
            searchFromInput();
        });
        recentContainer.appendChild(chip);
    });
}

function createCard(movie, showHeart = true) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    const heart = showHeart
        ? `<button class="heart-btn ${isInWatchlist(movie.imdbID) ? 'filled' : ''}" data-imdbid="${movie.imdbID}" data-title="${movie.Title}" data-year="${movie.Year}" data-poster="${movie.Poster}" data-type="${movie.Type}">❤️</button>`
        : '';
    card.innerHTML = `
        ${heart}
        <img src="${getFallbackPoster(movie.Poster)}" alt="${movie.Title}" class="movie-poster">
        <div class="movie-info">
            <div class="movie-title">${movie.Title}</div>
            <div class="movie-year">${movie.Year}</div>
        </div>
    `;
    card.querySelector('.movie-poster').addEventListener('click', () => openModal(movie.imdbID));
    card.querySelector('.movie-info').addEventListener('click', () => openModal(movie.imdbID));
    const heartBtn = card.querySelector('.heart-btn');
    if (heartBtn) {
        heartBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleWatchlist(movie.imdbID, movie.Title, movie.Year, movie.Poster, movie.Type);
        });
    }
    return card;
}

function renderGrid(movies, append = false) {
    if (!append) movieGrid.innerHTML = '';
    movies.forEach(m => movieGrid.appendChild(createCard(m)));
    const hasMore = currentPage * 10 < totalResults;
    loadMoreContainer.hidden = !hasMore;
    pageInfo.textContent = `Page ${currentPage}`;
}

async function fetchMovies(query, type, year, page, append = false) {
    showLoading(true);
    hideError();
    try {
        const url = `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&type=${type || ''}&y=${year || ''}&page=${page}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.Response === 'False' || !data.Search) {
            showError(append ? 'No more results.' : `No movies found for "${query}".`);
            loadMoreContainer.hidden = true;
            return;
        }

        totalResults = parseInt(data.totalResults, 10) || 0;
        currentPage = page;
        renderGrid(data.Search, append);
    } catch (err) {
        console.error(err);
        showError('Error loading movies. Please try again later.');
    } finally {
        showLoading(false);
    }
}

async function fetchDefaultMovies() {
    showLoading(true);
    hideError();
    try {
        const movies = [];
        for (const title of DEFAULT_MOVIES) {
            const res = await fetch(`${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(title)}&type=movie`);
            const data = await res.json();
            if (data.Response === 'True' && data.Search && data.Search.length) {
                movies.push(data.Search[0]);
            }
        }
        renderGrid(movies);
        totalResults = 0;
    } catch (err) {
        console.error(err);
    } finally {
        showLoading(false);
    }
}

async function openModal(imdbID) {
    modalBody.innerHTML = '<div style="grid-column: 1 / -1; text-align:center; padding: 2rem;">Loading details...</div>';
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    try {
        const res = await fetch(`${BASE_URL}?apikey=${API_KEY}&i=${imdbID}&plot=full`);
        const m = await res.json();
        if (m.Response === 'False') {
            modalBody.innerHTML = '<p style="grid-column: 1 / -1; text-align:center;">Failed to load movie details.</p>';
            return;
        }
        const poster = getFallbackPoster(m.Poster);
        const ratings = m.Ratings ? m.Ratings.map(r => `<div class="meta-row"><strong>${r.source || r.Source}</strong>${r.value || r.Value}</div>`).join('') : '';
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
                <div class="meta-row"><strong>Writer</strong>${m.Writer}</div>
                <div class="meta-row"><strong>Cast</strong>${m.Actors}</div>
                <div class="meta-row"><strong>IMDB Rating</strong>${m.imdbRating}</div>
                ${ratings}
                ${m.BoxOffice && m.BoxOffice !== 'N/A' ? `<div class="box-office">💰 Box Office: ${m.BoxOffice}</div>` : ''}
                <div class="movie-plot">${m.Plot}</div>
            </div>
        `;
    } catch (err) {
        console.error(err);
        modalBody.innerHTML = '<p style="grid-column: 1 / -1; text-align:center;">Error loading movie details.</p>';
    }
}

function closeMovieModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
}

function openWatchlist() {
    renderWatchlistGrid();
    watchlistModal.hidden = false;
    document.body.style.overflow = 'hidden';
}

function closeWatchlist() {
    watchlistModal.hidden = true;
    document.body.style.overflow = '';
}

function searchFromInput() {
    const q = input.value.trim();
    if (!q) {
        showError('Please enter a movie or series name.');
        return;
    }
    currentQuery = q;
    currentType = typeFilter.value;
    currentYear = yearFilter.value;
    currentPage = 1;
    saveRecent(q);
    fetchMovies(q, currentType, currentYear, currentPage);
}

searchBtn.addEventListener('click', searchFromInput);

input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchFromInput();
});

typeFilter.addEventListener('change', () => {
    if (currentQuery) searchFromInput();
});

yearFilter.addEventListener('change', () => {
    if (currentQuery) searchFromInput();
});

loadMoreBtn.addEventListener('click', () => {
    if (isLoading) return;
    fetchMovies(currentQuery, currentType, currentYear, currentPage + 1, true);
});

closeBtn.addEventListener('click', closeMovieModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeMovieModal(); });

watchlistBtn.addEventListener('click', openWatchlist);
watchlistClose.addEventListener('click', closeWatchlist);
watchlistModal.addEventListener('click', (e) => { if (e.target === watchlistModal) closeWatchlist(); });

populateYears();
renderRecent();
saveWatchlist();
fetchDefaultMovies();