const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB);
scene.fog = new THREE.FogExp2(0x87CEEB, 0.004);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const sunLight = new THREE.DirectionalLight(0xfffaed, 0.9);
sunLight.position.set(50, 100, 50);
sunLight.castShadow = true;
sunLight.shadow.camera.near = 0.5;
sunLight.shadow.camera.far = 200;
sunLight.shadow.camera.left = -60;
sunLight.shadow.camera.right = 60;
sunLight.shadow.camera.top = 60;
sunLight.shadow.camera.bottom = -60;
scene.add(sunLight);

const groundGeo = new THREE.PlaneGeometry(1000, 1000);
const groundMat = new THREE.MeshStandardMaterial({ color: '#7a9c55', roughness: 0.95 });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

const grid = new THREE.GridHelper(1000, 50, 0x445522, 0x556633);
grid.position.y = 0.01;
scene.add(grid);

const boundaryWalls = [];
function createBoundaryWalls() {
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x3d3529, roughness: 0.8 });
    const wallGeoV = new THREE.BoxGeometry(4, 6, 1000);
    const wallGeoH = new THREE.BoxGeometry(1000, 6, 4);

    const wallPositions = [
        { pos: [-500, 3, 0], geo: wallGeoV },
        { pos: [500, 3, 0], geo: wallGeoV },
        { pos: [0, 3, -500], geo: wallGeoH },
        { pos: [0, 3, 500], geo: wallGeoH }
    ];

    wallPositions.forEach(w => {
        const wall = new THREE.Mesh(w.geo, wallMat);
        wall.position.set(...w.pos);
        wall.receiveShadow = true;
        wall.castShadow = true;
        scene.add(wall);
        boundaryWalls.push(wall);
    });
}
createBoundaryWalls();

const decorations = [];
function addScenery() {
    const treeMat = [0x2d5a27, 0x3a6b34, 0x4a7c46, 0x5a8a55];
    const rockMat = [0x6b6b6b, 0x7a7a7a, 0x555555, 0x888888];
    const crateMat = [0x8b5e3c, 0x7a5230];

    for (let i = 0; i < 80; i++) {
        const x = (Math.random() - 0.5) * 900;
        const z = (Math.random() - 0.5) * 900;
        const type = Math.random();

        if (Math.abs(x) < 20 && Math.abs(z) < 20) continue;

        if (type < 0.5) {
            const tree = new THREE.Group();
            const trunk = new THREE.Mesh(
                new THREE.CylinderGeometry(0.4, 0.6, 3, 6),
                new THREE.MeshStandardMaterial({ color: 0x5c4033 })
            );
            trunk.position.y = 1.5;
            trunk.castShadow = true;
            trunk.receiveShadow = true;
            tree.add(trunk);
            const size = 2 + Math.random() * 2;
            const leaves = new THREE.Mesh(
                new THREE.ConeGeometry(size, 4 + Math.random() * 3, 7),
                new THREE.MeshStandardMaterial({ color: treeMat[Math.floor(Math.random() * treeMat.length)] })
            );
            leaves.position.y = 5;
            leaves.castShadow = true;
            leaves.receiveShadow = true;
            tree.add(leaves);
            tree.position.set(x, 0, z);
            scene.add(tree);
            decorations.push(tree);
        } else if (type < 0.75) {
            const rock = new THREE.Mesh(
                new THREE.DodecahedronGeometry(0.8 + Math.random() * 1.8),
                new THREE.MeshStandardMaterial({ color: rockMat[Math.floor(Math.random() * rockMat.length)], roughness: 0.9 })
            );
            rock.position.set(x, 0.6, z);
            rock.rotation.set(Math.random(), Math.random(), Math.random());
            rock.castShadow = true;
            rock.receiveShadow = true;
            scene.add(rock);
            decorations.push(rock);
        } else {
            const crate = new THREE.Group();
            const box1 = new THREE.Mesh(
                new THREE.BoxGeometry(2, 1.5, 2),
                new THREE.MeshStandardMaterial({ color: crateMat[0], roughness: 0.8 })
            );
            box1.castShadow = true;
            box1.receiveShadow = true;
            crate.add(box1);
            const box2 = new THREE.Mesh(
                new THREE.BoxGeometry(1.5, 1, 1.5),
                new THREE.MeshStandardMaterial({ color: crateMat[1], roughness: 0.8 })
            );
            box2.position.y = 1.2;
            box2.castShadow = true;
            box2.receiveShadow = true;
            crate.add(box2);
            crate.position.set(x, 0.75, z);
            scene.add(crate);
            decorations.push(crate);
        }
    }
}
addScenery();

let score = 0;
let health = 100;
let isGameOver = false;
let gameActive = false;
let currentUser = null;

const player = {
    mesh: null,
    speed: 0,
    maxSpeed: 0.4,
    rotationSpeed: 0.04,
    moveState: { forward: false, backward: false, left: false, right: false }
};

const shells = [];
const enemies = [];
const explosions = [];
const muzzleFlashes = [];
const dustClouds = [];
let shakeIntensity = 0;

function createTank(colorHex) {
    const tankGroup = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.6, metalness: 0.2 });

    const bodyGeo = new THREE.BoxGeometry(3, 1.2, 4.5);
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.8;
    body.castShadow = true;
    body.receiveShadow = true;
    tankGroup.add(body);

    const trackGeo = new THREE.BoxGeometry(0.7, 0.9, 4.8);
    const trackMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9 });
    const leftTrack = new THREE.Mesh(trackGeo, trackMat);
    leftTrack.position.set(-1.75, 0.5, 0);
    leftTrack.castShadow = true;
    const rightTrack = leftTrack.clone();
    rightTrack.position.x = 1.75;
    tankGroup.add(leftTrack, rightTrack);

    const turretGeo = new THREE.CylinderGeometry(1, 1.2, 0.8, 8);
    const turret = new THREE.Mesh(turretGeo, bodyMat);
    turret.position.set(0, 1.6, -0.3);
    turret.castShadow = true;
    tankGroup.add(turret);

    const hatches = [
        { geo: new THREE.SphereGeometry(0.3, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2), y: 2.0, rx: 0 },
        { geo: new THREE.CylinderGeometry(0.08, 0.08, 0.8, 6), y: 2.0, rx: 0 },
    ];
    hatches.forEach(h => {
        const hatch = new THREE.Mesh(h.geo, new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8, roughness: 0.3 }));
        hatch.position.set(0, h.y, 0);
        hatch.rotation.x = h.rx;
        tankGroup.add(hatch);
    });

    const barrelGeo = new THREE.CylinderGeometry(0.18, 0.18, 2.5, 8);
    const barrelMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.7, roughness: 0.3 });
    const barrel = new THREE.Mesh(barrelGeo, barrelMat);
    barrel.rotation.x = Math.PI / 2;
    barrel.position.set(0, 1.7, 2);
    tankGroup.add(barrel);

    const barrelTipGeo = new THREE.CylinderGeometry(0.22, 0.18, 0.3, 8);
    const barrelTip = new THREE.Mesh(barrelTipGeo, barrelMat);
    barrelTip.rotation.x = Math.PI / 2;
    barrelTip.position.set(0, 1.7, 3.4);
    tankGroup.add(barrelTip);

    return tankGroup;
}

player.mesh = createTank(0x2e402b);
scene.add(player.mesh);

function createMuzzleFlash(position, quaternion) {
    const flashGeo = new THREE.SphereGeometry(0.5, 8, 8);
    const flashMat = new THREE.MeshBasicMaterial({ color: 0xffdd00, transparent: true, opacity: 1 });
    const flash = new THREE.Mesh(flashGeo, flashMat);
    flash.position.copy(position);
    flash.quaternion.copy(quaternion);
    flash.position.y += 0.3;
    scene.add(flash);
    muzzleFlashes.push({ mesh: flash, age: 0, type: 'flash' });

    const light = new THREE.PointLight(0xffaa00, 3, 15);
    light.position.copy(position);
    light.position.y += 0.3;
    scene.add(light);
    muzzleFlashes.push({ mesh: light, age: 0, type: 'light' });
}

function createExplosion(position, big) {
    const count = big ? 30 : 15;
    for (let i = 0; i < count; i++) {
        const geo = new THREE.BoxGeometry(0.3, 0.3, 0.3);
        const mat = new THREE.MeshBasicMaterial({ color: Math.random() > 0.5 ? 0xff6600 : 0xffaa00 });
        const particle = new THREE.Mesh(geo, mat);
        particle.position.copy(position);
        particle.position.y += 0.8;
        const speed = big ? 0.6 : 0.35;
        const velocity = new THREE.Vector3(
            (Math.random() - 0.5) * speed,
            Math.random() * 0.4 + 0.15,
            (Math.random() - 0.5) * speed
        );
        scene.add(particle);
        explosions.push({ mesh: particle, velocity: velocity, age: 0, isExplosion: true });
    }

    const smokeCount = big ? 10 : 5;
    for (let i = 0; i < smokeCount; i++) {
        const geo = new THREE.SphereGeometry(0.6 + Math.random() * 0.4, 6, 6);
        const mat = new THREE.MeshBasicMaterial({ color: 0x333333, transparent: true, opacity: 0.6 });
        const smoke = new THREE.Mesh(geo, mat);
        smoke.position.copy(position);
        smoke.position.y += 0.5;
        const vel = new THREE.Vector3((Math.random() - 0.5) * 0.05, 0.02 + Math.random() * 0.03, (Math.random() - 0.5) * 0.05);
        scene.add(smoke);
        explosions.push({ mesh: smoke, velocity: vel, age: 0, isExplosion: false });
    }
}

function createDust(position) {
    const geo = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const mat = new THREE.MeshBasicMaterial({ color: 0x8b7355, transparent: true, opacity: 0.5 });
    const dust = new THREE.Mesh(geo, mat);
    dust.position.copy(position);
    dust.position.y = 0.2;
    const vel = new THREE.Vector3((Math.random() - 0.5) * 0.02, 0.01, (Math.random() - 0.5) * 0.02);
    scene.add(dust);
    dustClouds.push({ mesh: dust, velocity: vel, age: 0 });
}

function clampToBounds(mesh, margin = 2.5) {
    const bound = 500 - margin;
    mesh.position.x = Math.max(-bound, Math.min(bound, mesh.position.x));
    mesh.position.z = Math.max(-bound, Math.min(bound, mesh.position.z));
}

function shakeScreen(intensity) {
    shakeIntensity = Math.max(shakeIntensity, intensity);
}

function showHitMarker(text) {
    const marker = document.getElementById('hit-marker');
    if (!marker) return;
    marker.style.opacity = 1;
    marker.innerText = text;
    setTimeout(() => { marker.style.opacity = 0; }, 250);
}

window.addEventListener('keydown', (e) => handleKey(e.code, true));
window.addEventListener('keyup', (e) => handleKey(e.code, false));

function handleKey(code, isPressed) {
    if (isGameOver || !gameActive) return;
    if (code === 'KeyW' || code === 'ArrowUp') player.moveState.forward = isPressed;
    if (code === 'KeyS' || code === 'ArrowDown') player.moveState.backward = isPressed;
    if (code === 'KeyA' || code === 'ArrowLeft') player.moveState.left = isPressed;
    if (code === 'KeyD' || code === 'ArrowRight') player.moveState.right = isPressed;
    if (code === 'Space' && isPressed) fireShell();
}

function bindTouchBtn(id, targetStateProp) {
    const btn = document.getElementById(id);
    btn.addEventListener('touchstart', (e) => { e.preventDefault(); if (gameActive) player.moveState[targetStateProp] = true; });
    btn.addEventListener('touchend', (e) => { e.preventDefault(); if (gameActive) player.moveState[targetStateProp] = false; });
}
bindTouchBtn('btn-up', 'forward');
bindTouchBtn('btn-down', 'backward');
bindTouchBtn('btn-left', 'left');
bindTouchBtn('btn-right', 'right');
document.getElementById('btn-fire').addEventListener('touchstart', (e) => { e.preventDefault(); if (gameActive) fireShell(); });
document.getElementById('btn-fire').addEventListener('click', (e) => { e.preventDefault(); if (gameActive) fireShell(); });

function fireShell() {
    if (isGameOver || !gameActive) return;

    const shellGeo = new THREE.SphereGeometry(0.15, 8, 8);
    const shellMat = new THREE.MeshBasicMaterial({ color: 0xffcc00 });
    const shell = new THREE.Mesh(shellGeo, shellMat);

    shell.position.copy(player.mesh.position);
    shell.position.y = 1.7;

    const vector = new THREE.Vector3(0, 0, 1);
    vector.applyQuaternion(player.mesh.quaternion);

    shells.push({ mesh: shell, dir: vector, age: 0 });
    scene.add(shell);

    const barrelTip = new THREE.Vector3(0, 1.7, 2.8);
    barrelTip.applyQuaternion(player.mesh.quaternion);
    barrelTip.add(player.mesh.position);
    createMuzzleFlash(barrelTip, player.mesh.quaternion);
}

function spawnEnemy() {
    if (isGameOver) return;
    if (gameActive && enemies.length < 6) {
        const enemyMesh = createTank(0x73332c);
        const angle = Math.random() * Math.PI * 2;
        const distance = 60 + Math.random() * 40;
        enemyMesh.position.set(
            player.mesh.position.x + Math.sin(angle) * distance,
            0,
            player.mesh.position.z + Math.cos(angle) * distance
        );
        enemyMesh.userData = {
            strafeDir: Math.random() > 0.5 ? 1 : -1,
            strafeTimer: Math.random() * 120,
            strafeDuration: 60 + Math.random() * 120,
            hitFlash: 0
        };

        scene.add(enemyMesh);
        enemies.push(enemyMesh);
    }
    setTimeout(spawnEnemy, 3000);
}

function updateHighScore() {
    if (!currentUser) return;
    let users = JSON.parse(localStorage.getItem('tank_users')) || {};
    if (score > (users[currentUser].highscore || 0)) {
        users[currentUser].highscore = score;
        localStorage.setItem('tank_users', JSON.stringify(users));
    }
    const el = document.getElementById('highscore-ui');
    if (el) el.innerText = `PERSONAL BEST: ${users[currentUser].highscore || 0}`;
}

function flashDamage() {
    const flash = document.getElementById('damage-flash');
    if (!flash) return;
    flash.style.opacity = 1;
    setTimeout(() => { flash.style.opacity = 0; }, 120);
}

function drawMinimap() {
    const canvas = document.getElementById('minimap');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const scale = 150 / 1000;
    const offsetX = canvas.width / 2;
    const offsetZ = canvas.height / 2;

    ctx.fillStyle = 'rgba(0, 20, 0, 0.85)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#2a4a2a';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#55ff55';
    ctx.beginPath();
    ctx.arc(offsetX, offsetZ, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ff3333';
    enemies.forEach(enemy => {
        const ex = enemy.position.x * scale + offsetX;
        const ez = enemy.position.z * scale + offsetZ;
        ctx.beginPath();
        ctx.arc(ex, ez, 2.5, 0, Math.PI * 2);
        ctx.fill();
    });
}

function resetGame() {
    score = 0;
    health = 100;
    isGameOver = false;
    document.getElementById('score-ui').innerText = `TOTAL TANKS NEUTRALIZED: ${score}`;
    document.getElementById('health-ui').innerText = `ARMOR INTEGRITY: ${health}%`;
    document.getElementById('game-over-screen').style.display = 'none';

    shells.forEach(s => scene.remove(s.mesh));
    enemies.forEach(e => scene.remove(e));
    explosions.forEach(ex => scene.remove(ex.mesh));
    muzzleFlashes.forEach(m => scene.remove(m.mesh));
    dustClouds.forEach(d => scene.remove(d.mesh));
    shells.length = 0;
    enemies.length = 0;
    explosions.length = 0;
    muzzleFlashes.length = 0;
    dustClouds.length = 0;
    shakeIntensity = 0;

    player.mesh.position.set(0, 0, 0);
    player.mesh.rotation.set(0, 0, 0);
    if (currentUser) gameActive = true;
}

function animate() {
    requestAnimationFrame(animate);

    if (gameActive && !isGameOver) {
        if (player.moveState.forward) player.speed = Math.min(player.speed + 0.02, player.maxSpeed);
        else if (player.moveState.backward) player.speed = Math.max(player.speed - 0.02, -player.maxSpeed / 2);
        else player.speed *= 0.85;

        player.mesh.translateZ(player.speed);

        if (player.moveState.left) player.mesh.rotation.y += player.rotationSpeed;
        if (player.moveState.right) player.mesh.rotation.y -= player.rotationSpeed;

        clampToBounds(player.mesh);

        if (Math.abs(player.speed) > 0.01) {
            const enginePos = player.mesh.position.clone();
            enginePos.y = 0.3;
            createDust(enginePos);
        }

        for (let i = shells.length - 1; i >= 0; i--) {
            const s = shells[i];
            s.mesh.position.addScaledVector(s.dir, 1.2);
            s.age++;

            let hitTarget = false;
            for (let j = enemies.length - 1; j >= 0; j--) {
                if (s.mesh.position.distanceTo(enemies[j].position) < 2.5) {
                    createExplosion(enemies[j].position, false);
                    scene.remove(enemies[j]);
                    enemies.splice(j, 1);
                    hitTarget = true;
                    score++;
                    document.getElementById('score-ui').innerText = `TOTAL TANKS NEUTRALIZED: ${score}`;
                    showHitMarker('DIRECT HIT');
                    shakeScreen(0.25);
                    updateHighScore();
                    break;
                }
            }

            if (hitTarget || s.age > 80) {
                if (!hitTarget) {
                    createExplosion(s.mesh.position, false);
                }
                scene.remove(s.mesh);
                shells.splice(i, 1);
            }
        }

        enemies.forEach((enemy) => {
            const distToPlayer = enemy.position.distanceTo(player.mesh.position);

            const lookTarget = player.mesh.position.clone();
            if (enemy.userData) {
                enemy.userData.strafeTimer++;
                if (enemy.userData.strafeTimer > enemy.userData.strafeDuration) {
                    enemy.userData.strafeDir *= -1;
                    enemy.userData.strafeTimer = 0;
                    enemy.userData.strafeDuration = 60 + Math.random() * 120;
                }
                const strafeOffset = new THREE.Vector3(
                    Math.cos(enemy.rotation.y) * enemy.userData.strafeDir * 0.03,
                    0,
                    -Math.sin(enemy.rotation.y) * enemy.userData.strafeDir * 0.03
                );
                enemy.position.add(strafeOffset);
            }

            enemy.lookAt(lookTarget);
            enemy.translateZ(0.08);
            clampToBounds(enemy);

            if (distToPlayer < 3.5) {
                health -= 1;
                document.getElementById('health-ui').innerText = `ARMOR INTEGRITY: ${health}%`;
                flashDamage();
                shakeScreen(0.4);
                createDust(player.mesh.position);
                if (health <= 0) {
                    isGameOver = true;
                    gameActive = false;
                    createExplosion(player.mesh.position, true);
                    updateHighScore();
                    document.getElementById('final-score').innerText = `Enemies Neutralized: ${score}`;
                    document.getElementById('game-over-screen').style.display = 'flex';
                }
            }
        });
    }

    for (let i = explosions.length - 1; i >= 0; i--) {
        const ex = explosions[i];
        ex.age++;
        ex.mesh.position.add(ex.velocity);
        if (ex.isExplosion) {
            ex.velocity.y -= 0.012;
            ex.mesh.rotation.x += 0.08;
            ex.mesh.rotation.z += 0.08;
            const s = Math.max(0.05, 1 - ex.age * 0.04);
            ex.mesh.scale.setScalar(s);
        } else {
            ex.mesh.material.opacity = Math.max(0, 0.5 - ex.age * 0.015);
            ex.mesh.scale.setScalar(1 + ex.age * 0.05);
        }
        if (ex.age > 50) {
            scene.remove(ex.mesh);
            explosions.splice(i, 1);
        }
    }

    for (let i = dustClouds.length - 1; i >= 0; i--) {
        const d = dustClouds[i];
        d.age++;
        d.mesh.position.add(d.velocity);
        d.mesh.material.opacity = Math.max(0, 0.5 - d.age * 0.01);
        d.mesh.scale.setScalar(1 + d.age * 0.03);
        if (d.age > 40) {
            scene.remove(d.mesh);
            dustClouds.splice(i, 1);
        }
    }

    for (let i = muzzleFlashes.length - 1; i >= 0; i--) {
        const m = muzzleFlashes[i];
        m.age++;
        if (m.type === 'flash') {
            m.mesh.material.opacity = Math.max(0, 1 - m.age * 0.25);
            m.mesh.scale.setScalar(Math.max(0.1, 1.2 - m.age * 0.15));
        } else if (m.type === 'light') {
            m.mesh.intensity = Math.max(0, 3 - m.age * 0.4);
        }
        if (m.age > 12) {
            scene.remove(m.mesh);
            muzzleFlashes.splice(i, 1);
        }
    }

    camera.position.x = player.mesh.position.x - Math.sin(player.mesh.rotation.y) * 15;
    camera.position.z = player.mesh.position.z - Math.cos(player.mesh.rotation.y) * 15;
    camera.position.y = player.mesh.position.y + 7;

    if (shakeIntensity > 0.01) {
        camera.position.x += (Math.random() - 0.5) * shakeIntensity * 2.5;
        camera.position.y += (Math.random() - 0.5) * shakeIntensity * 2.5;
        shakeIntensity *= 0.85;
    } else {
        shakeIntensity = 0;
    }

    camera.lookAt(player.mesh.position);

    drawMinimap();
    renderer.render(scene, camera);
}

const authContainer = document.getElementById('auth-container');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const authTitle = document.getElementById('auth-title');
const authError = document.getElementById('auth-error');

function showError(msg) {
    authError.innerText = msg;
    authError.style.display = 'block';
}
function clearError() {
    authError.innerText = '';
    authError.style.display = 'none';
}

document.getElementById('welcome-user').addEventListener('click', () => {
    gameActive = false;
    clearError();
    authContainer.style.display = 'flex';
});

document.getElementById('btn-show-register').addEventListener('click', () => {
    clearError();
    loginForm.style.display = 'none';
    registerForm.style.display = 'flex';
    authTitle.innerText = 'NEW REGISTRATION';
});
document.getElementById('btn-show-login').addEventListener('click', () => {
    clearError();
    registerForm.style.display = 'none';
    loginForm.style.display = 'flex';
    authTitle.innerText = 'LOGIN';
});

document.getElementById('btn-register').addEventListener('click', () => {
    const user = document.getElementById('reg-username').value.trim().toLowerCase();
    const pass = document.getElementById('reg-password').value;

    if (!user || !pass) {
        showError("PLEASE ENTER ALL DETAILS");
        return;
    }

    let users = JSON.parse(localStorage.getItem('tank_users')) || {};
    if (users[user]) {
        showError("COMMANDER CALLSIGN ALREADY REGISTERED.");
        return;
    }

    users[user] = { password: pass, highscore: 0 };
    localStorage.setItem('tank_users', JSON.stringify(users));

    currentUser = user;
    document.getElementById('welcome-user').innerText = user.toUpperCase();
    document.getElementById('highscore-ui').innerText = `PERSONAL BEST: 0`;
    authContainer.style.display = 'none';

    document.getElementById('reg-username').value = '';
    document.getElementById('reg-password').value = '';
    resetGame();
});

document.getElementById('btn-login').addEventListener('click', () => {
    const user = document.getElementById('username').value.trim().toLowerCase();
    const pass = document.getElementById('password').value;

    if (!user || !pass) {
        showError("PLEASE ENTER ALL DETAILS");
        return;
    }

    let users = JSON.parse(localStorage.getItem('tank_users')) || {};
    if (!users[user] || users[user].password !== pass) {
        showError("ACCESS DENIED: NO PLAYER FOUND!");
        return;
    }

    currentUser = user;
    document.getElementById('welcome-user').innerText = user.toUpperCase();
    document.getElementById('highscore-ui').innerText = `PERSONAL BEST: ${users[user].highscore || 0}`;
    authContainer.style.display = 'none';

    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    resetGame();
});

spawnEnemy();
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
