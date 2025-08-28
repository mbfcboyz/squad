
// ---- Data: Edit this list to change members ----


// ---- Render Grid ----
const grid = document.getElementById('grid');
const search = document.getElementById('search');
const year = document.getElementById('year');
year.textContent = new Date().getFullYear();


function categoryIcon(cat) {
    switch (cat) {
        case 5000: // Diamond
            return `
<svg class="glow" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFD700"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480v-380l241 181q31-47 70.5-97T480-880q45 50 86 101.5t72 99.5l242-181v380q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>
`;
        case 3000: // Star
            return `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#067a94ff"><path d="m368-630 106-210h12l106 210H368Zm82 474L105-570h345v414Zm60 0v-414h345L510-156Zm148-474L554-840h206l105 210H658Zm-563 0 105-210h206L302-630H95Z"/></svg>`;
        case 2500: // Circle badge
            return `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffd000ff"><path d="M852-212 732-332l56-56 120 120-56 56ZM708-692l-56-56 120-120 56 56-120 120Zm-456 0L132-812l56-56 120 120-56 56ZM108-212l-56-56 120-120 56 56-120 120Zm125 92 65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z"/></svg>`;
        case 2000: // Medal
            return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" 
                viewBox="0 0 24 24" fill="orange" style="vertical-align:middle;margin-left:4px">
                <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 
                1.5-7.5L2 9h7z"/></svg>`;
        default:
            return '';
    }
}


function makeCard(m) {
    const el = document.createElement('article');
    el.className = 'card';
    el.setAttribute('role', 'listitem');
    el.innerHTML = `
        <img class="avatar" src="${m.img}" alt="${m.name}" loading="lazy"/>
        <h3 style="margin:.2rem 0 .2rem; text-align:center">
            ${m.name} ${categoryIcon(m.category)}
        </h3>
        <p class="role" style="text-align:center">${m.role}</p>
        <div class="tags">${m.tags.map(t => `<span class='tag'>${t}</span>`).join('')}</div>
      `;
    el.addEventListener('click', () => openModal(m.id));
    el.tabIndex = 0;
    el.addEventListener('keydown', (e) => { if (e.key === 'Enter') openModal(m.id); });
    return el;
}


function render(list) {
    grid.innerHTML = '';
    list.forEach(m => grid.appendChild(makeCard(m)));
}

function filterMembers(q) {
    q = q.trim().toLowerCase();
    if (!q) return MEMBERS;
    
    return MEMBERS.filter(m => [m.name, m.role, ...(m.tags || [])].join(' ').toLowerCase().includes(q));
}

search.addEventListener('input', (e) => { render(filterMembers(e.target.value)); });

// Initial render
render(MEMBERS);

// ---- Modal / Wiki Profile ----
const modal = document.getElementById('modal');
const closeBtn = document.getElementById('close');
const bigAvatar = document.getElementById('bigAvatar');
const fullName = document.getElementById('fullName');
const bio = document.getElementById('bio');
const meta = document.getElementById('meta');
const role = document.getElementById('role');

function openModal(id) {
    const m = MEMBERS.find(x => x.id === id);
    if (!m) return;
    bigAvatar.src = m.img; bigAvatar.alt = m.name;
    fullName.innerHTML = `${m.name} ${categoryIcon(m.category)}`;
    bio.textContent = m.bio;
    meta.innerHTML = m.tags.map(t => `<span>${t}</span>`).join('');
    role.innerHTML = `<span>${m.role}</span>`;

    // Banner per member if available
    document.querySelector('.sheet .banner').style.backgroundImage = `url('${m.banner || ''}')`;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Update hash for deep-linking
    history.pushState(null, '', `#${m.id}`);

    // Focus close button for accessibility
    closeBtn.focus();
}

function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    // Remove member hash but keep section anchor if any
    if (location.hash && location.hash !== '#members') {
        history.pushState(null, '', '#members');
    }
}

closeBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('active')) closeModal(); });

// Open profile if URL hash has an id on load
window.addEventListener('load', () => {
    const id = location.hash.replace('#', '');
    if (id) {
        const found = MEMBERS.find(m => m.id === id);
        if (found) openModal(id);
    }
});