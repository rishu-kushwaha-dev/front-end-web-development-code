class TodoApp {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.currentFilter = 'all';

        this.taskInput = document.getElementById('taskInput');
        this.prioritySelect = document.getElementById('prioritySelect');
        this.addBtn = document.getElementById('addBtn');
        this.taskList = document.getElementById('taskList');
        this.itemsLeft = document.getElementById('items-left');
        this.itemsCompleted = document.getElementById('items-completed');
        this.clearCompleted = document.getElementById('clearCompleted');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.dateEl = document.getElementById('date');

        this.createBubbles();
        this.init();
        this.startClock();
    }

    createBubbles() {
        const count = 25;
        for (let i = 0; i < count; i++) {
            const bubble = document.createElement('div');
            bubble.className = 'bubble';

            const size = Math.random() * 20 + 8;
            const startPosX = Math.random() * 100;
            const duration = Math.random() * 8 + 8;
            const delay = Math.random() * 5;
            const opacity = Math.random() * 0.15 + 0.1;

            bubble.style.width = `${size}px`;
            bubble.style.height = `${size}px`;
            bubble.style.left = `${startPosX}vw`;
            bubble.style.bottom = '-20px';
            bubble.style.animationDuration = `${duration}s`;
            bubble.style.animationDelay = `${delay}s`;
            bubble.style.opacity = opacity;

            document.body.appendChild(bubble);
        }
    }

    startClock() {
        const update = () => {
            const now = new Date();
            this.dateEl.textContent = now.toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        };
        update();
        setInterval(update, 60000);
    }

    init() {
        this.addBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') this.addTask();
        });
        this.taskInput.addEventListener('input', () => this.updateAddBtnState());
        this.clearCompleted.addEventListener('click', () => this.clearCompletedTasks());

        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });

        this.render();
    }

    updateAddBtnState() {
        const hasText = this.taskInput.value.trim().length > 0;
        this.addBtn.disabled = !hasText;
    }

    addTask() {
        const text = this.taskInput.value.trim();
        if (!text) return;

        const task = {
            id: Date.now().toString(),
            text: text,
            completed: false,
            priority: this.prioritySelect.value
        };

        this.tasks.unshift(task);
        this.taskInput.value = '';
        this.updateAddBtnState();
        this.saveAndRender();
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveAndRender();
            if (this.tasks.every(t => t.completed) && this.tasks.length > 0) {
                this.startConfetti();
            }
        }
    }

    deleteTask(id) {
        const taskEl = document.querySelector(`.task-item[data-id="${id}"]`);
        if (taskEl) {
            taskEl.classList.add('exit');
            setTimeout(() => {
                this.tasks = this.tasks.filter(t => t.id !== id);
                this.saveAndRender();
            }, 300);
        }
    }

    setFilter(filter) {
        this.currentFilter = filter;
        this.filterBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        this.render();
    }

    clearCompletedTasks() {
        this.tasks = this.tasks.filter(t => !t.completed);
        this.saveAndRender();
    }

    getFilteredTasks() {
        switch (this.currentFilter) {
            case 'active':
                return this.tasks.filter(t => !t.completed);
            case 'completed':
                return this.tasks.filter(t => t.completed);
            default:
                return this.tasks;
        }
    }

    updateStats() {
        const activeCount = this.tasks.filter(t => !t.completed).length;
        const completedCount = this.tasks.filter(t => t.completed).length;
        this.itemsLeft.textContent = `${activeCount} item${activeCount !== 1 ? 's' : ''} left`;
        this.itemsCompleted.textContent = `${completedCount} completed`;
        this.clearCompleted.disabled = completedCount === 0;
    }

    render() {
        const filteredTasks = this.getFilteredTasks();
        this.taskList.innerHTML = '';

        if (filteredTasks.length === 0) {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'empty-state';
            emptyDiv.innerHTML = '<span>🎯</span><div>No tasks here. Add one above!</div>';
            this.taskList.appendChild(emptyDiv);
        } else {
            filteredTasks.forEach((task, index) => {
                const li = document.createElement('li');
                li.className = 'task-item' + (task.completed ? ' completed' : '');
                li.dataset.id = task.id;
                li.style.animationDelay = `${index * 0.06}s`;

                li.innerHTML = `
                    <div class="task-checkbox ${task.completed ? 'checked' : ''}" onclick="todoApp.toggleTask('${task.id}')"></div>
                    <div class="priority-dot ${task.priority}" title="${task.priority} priority"></div>
                    <span class="task-text">${task.text}</span>
                    <button class="delete-btn" onclick="todoApp.deleteTask('${task.id}')">&times;</button>
                `;

                this.taskList.appendChild(li);
            });
        }

        this.updateStats();
    }

    saveAndRender() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
        this.render();
    }

    startConfetti() {
        const canvas = document.getElementById('confetti');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffffff', '#43e97b', '#38f9d7'];
        const particles = [];
        for (let i = 0; i < 160; i++) {
            particles.push({
                x: canvas.width / 2,
                y: canvas.height / 2,
                vx: (Math.random() - 0.5) * 24,
                vy: (Math.random() - 0.5) * 24 - 6,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 7 + 4,
                life: 110
            });
        }
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let active = false;
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.6;
                p.life--;
                if (p.life > 0) {
                    active = true;
                    ctx.fillStyle = p.color;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                }
            });
            if (active) {
                requestAnimationFrame(animate);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        };
        animate();
    }
}

let todoApp;
window.addEventListener('load', () => {
    todoApp = new TodoApp();
});
