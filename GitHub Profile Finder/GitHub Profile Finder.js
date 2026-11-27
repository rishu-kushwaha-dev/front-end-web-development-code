const API_BASE = 'https://api.github.com';
const GITHUB_TOKEN = '';
const usernameInput = document.getElementById('username');
const searchBtn = document.getElementById('searchBtn');
const errorEl = document.getElementById('error');
const loaderEl = document.getElementById('loader');
const profileEl = document.getElementById('profile');

function showError(msg) {
    errorEl.textContent = msg;
    errorEl.classList.remove('hidden');
    profileEl.classList.add('hidden');
    loaderEl.classList.add('hidden');
}

function hideError() {
    errorEl.classList.add('hidden');
}

function showLoader() {
    loaderEl.classList.remove('hidden');
    profileEl.classList.add('hidden');
    errorEl.classList.add('hidden');
}

function showProfile() {
    loaderEl.classList.add('hidden');
    profileEl.classList.remove('hidden');
}

async function fetchGitHub(endpoint) {
    const headers = {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'GitHub-Profile-Finder'
    };

    if (GITHUB_TOKEN) {
        headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
    }

    const res = await fetch(`${API_BASE}${endpoint}`, { headers });

    if (res.status === 403) {
        throw new Error('API rate limit exceeded. Add a GitHub Personal Access Token to increase limits.');
    }
    if (res.status === 404) {
        throw new Error('User not found.');
    }
    if (!res.ok) {
        throw new Error(`GitHub API error: ${res.status}`);
    }

    return res.json();
}

function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function renderProfile(data) {
    document.getElementById('avatar').src = data.avatar_url;
    document.getElementById('avatar').alt = `${data.name || data.login}'s profile`;
    document.getElementById('name').textContent = data.name || data.login;
    document.getElementById('login').textContent = `@${data.login}`;
    document.getElementById('login').href = data.html_url;
    document.getElementById('bio').textContent = data.bio || 'No bio available';
    document.getElementById('location').textContent = data.location || 'Not specified';
    document.getElementById('company').textContent = data.company || 'Not specified';
    document.getElementById('blog').textContent = data.blog || 'Not specified';
    document.getElementById('member-since').textContent = formatDate(data.created_at);
    document.getElementById('public-repos').textContent = data.public_repos;
    document.getElementById('followers').textContent = data.followers;
    document.getElementById('following').textContent = data.following;

    const reposList = document.getElementById('repos');
    reposList.innerHTML = '';

    if (!data.repos || data.repos.length === 0) {
        reposList.innerHTML = '<p style="color:var(--text-secondary);">No public repositories.</p>';
        return;
    }

    data.repos.forEach(repo => {
        const card = document.createElement('div');
        card.className = 'repo-card';
        card.innerHTML = `
            <h4><a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${repo.name}</a></h4>
            <p>${repo.description || 'No description'}</p>
            <div class="repo-meta">
                <span>★ ${repo.stargazers_count}</span>
                <span>🍴 ${repo.forks_count}</span>
                <span>${repo.language || 'Unknown'}</span>
            </div>
        `;
        reposList.appendChild(card);
    });
}

async function searchUser(username) {
    if (!username) {
        showError('Please enter a GitHub username.');
        return;
    }

    hideError();
    showLoader();

    try {
        const [user, repos] = await Promise.all([
            fetchGitHub(`/users/${encodeURIComponent(username)}`),
            fetchGitHub(`/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=10`)
        ]);

        user.repos = repos;
        renderProfile(user);
        showProfile();
    } catch (err) {
        showError(err.message);
    }
}

searchBtn.addEventListener('click', () => {
    searchUser(usernameInput.value.trim());
});

usernameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        searchUser(usernameInput.value.trim());
    }
});