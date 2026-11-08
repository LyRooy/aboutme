// Static page generator: node build.js
// Produces /pl/** and /en/** pages (real URLs, no hash tabs) from one template.
const fs = require('fs');
const path = require('path');

const SITE = 'https://110187.xyz';
const LANGS = ['pl', 'en'];

// page id -> slug per language ('' = start page)
const SLUGS = {
    start: { pl: '', en: '' },
    projects: { pl: 'projekty', en: 'projects' },
    homelab: { pl: 'homelab', en: 'homelab' },
    cv: { pl: 'cv', en: 'cv' },
    links: { pl: 'linki', en: 'links' }
};

const NAV = [
    { id: 'start', icon: 'ph-sparkle', key: 'nav.start' },
    { id: 'projects', icon: 'ph-code', key: 'nav.projects' },
    { id: 'homelab', icon: 'ph-hard-drives', key: 'nav.homelab' },
    { id: 'cv', icon: 'ph-read-cv-logo', key: 'nav.cv' },
    { id: 'links', icon: 'ph-share-network', key: 'nav.links' }
];

const T = {
    pl: {
        'title.start': 'LyRooy - Dawid Łyczko',
        'title.projects': 'Projekty - LyRooy',
        'title.homelab': 'Specyfikacja i homelab - LyRooy',
        'title.cv': 'CV - LyRooy',
        'title.links': 'Linki - LyRooy',
        'desc.start': 'Dawid Łyczko (LyRooy) - tworzenie stron i aplikacji internetowych, sztuczna inteligencja (AI) oraz homelab.',
        'desc.projects': 'Projekty webowe, akademickie i zespołowe Dawida Łyczko (LyRooy).',
        'desc.homelab': 'Specyfikacja sprzętowa i usługi homelabu Dawida Łyczko (LyRooy).',
        'desc.cv': 'CV Dawida Łyczko (LyRooy).',
        'desc.links': 'Linki i media społecznościowe Dawida Łyczko (LyRooy).',
        'nav.start': 'Start',
        'nav.projects': 'Projekty',
        'nav.homelab': 'Specyfikacja',
        'nav.cv': 'CV',
        'nav.links': 'Linki',
        'hero.greeting': 'Cześć, jestem Dawid',
        'hero.lead': 'Zajmuję się tworzeniem stron oraz aplikacji internetowych. Interesuję się również sztuczną inteligencją (AI) i uczeniem maszynowym - szczególnie wykorzystaniem modeli AI w praktycznych projektach. Prywatnie jestem entuzjastą homelabingu oraz własnej infrastruktury serwerowej (self-hosting).',
        'start.profilesTitle': 'Podstawowe profile i repozytoria',
        'start.ghMainDesc': 'Główne konto GitHub - bieżący kod, projekty własne i zespołowe',
        'start.ghAcadDesc': 'Konto do celów akademickich - praca magisterska, replikacje artykułów',
        'start.hfDesc': 'Konto Hugging Face - eksploracja i testy modeli AI',
        'badge.main': 'główny',
        'badge.acadShort': 'akademicki',
        'projects.title': 'Zbiór moich projektów',
        'projects.subtitle': 'Aplikacje internetowe, projekty akademickie oraz realizacje zespołowe',
        'projects.domainSection': 'Projekty webowe na domenie (110187.xyz)',
        'projects.mtEng': 'Aplikacja do zarządzania listą filmów i seriali - praca inżynierska',
        'projects.mtMsc': 'Aplikacja do zarządzania listą filmów i seriali + rekomendacje - praca magisterska',
        'projects.spaceInvaders': 'Gra Space Invaders w wersji webowej - Projekt zaliczeniowy',
        'projects.acadCalendar': 'Aplikacja kalendarza akademickiego',
        'projects.ghPagesSection': 'Projekty webowe na GitHub Pages',
        'projects.mechaKlub': 'Projekt zaliczeniowy - optymalizacja stron (analiza SEO)',
        'projects.ciphers': 'Projekt zespołowy - interaktywne demo szyfrów historycznych',
        'projects.coauthors': 'Współ-autorzy:',
        'projects.otherSection': 'Inne projekty',
        'projects.otherPlaceholder': 'Miejsce na kolejne realizacje i projekty niewebowe.',
        'homelab.title': 'Specyfikacja i homelab',
        'homelab.subtitle': 'Sprzęt, infrastruktura oraz usługi, które utrzymuję na własnych serwerach',
        'homelab.hardwareSection': 'Specyfikacja sprzętowa',
        'homelab.dev.pc': 'Główny komputer',
        'homelab.dev.server': 'Serwer główny',
        'homelab.dev.tiny': 'Serwer drugi',
        'homelab.dev.laptop': 'Laptop',
        'homelab.dev.peripherals': 'Peryferia',
        'homelab.svc.dietpi': 'DietPi · Dell Wyse 5070',
        'homelab.svc.truenas': 'TrueNAS · Serwer główny',
        'homelab.codeServerNote': 'dla botów Discord',
        'homelab.planned': 'Planowana zmiana (grudzień)',
        'homelab.tvNote': 'czasem używany jako trzeci monitor',
        'spec.os': 'System',
        'spec.cpu': 'Procesor',
        'spec.gpu': 'Karta graficzna',
        'spec.ram': 'Pamięć RAM',
        'spec.board': 'Płyta główna',
        'spec.psu': 'Zasilacz',
        'spec.case': 'Obudowa',
        'spec.cooling': 'Chłodzenie',
        'spec.storage': 'Dysk',
        'spec.model': 'Model',
        'spec.monitor': 'Monitor',
        'spec.tv': 'Telewizor',
        'spec.speakers': 'Głośniki',
        'spec.headset': 'Słuchawki',
        'spec.mic': 'Mikrofon',
        'spec.keyboard': 'Klawiatura',
        'spec.mouse': 'Myszka',
        'homelab.workloadSection': 'Usługi i workload',
        'homelab.workloadPlaceholder': 'Lista uruchomionych usług i projektów self-hosted pojawi się tutaj wkrótce.',
        'cv.subtitle': 'Wykształcenie, doświadczenie oraz umiejętności techniczne',
        'cv.placeholder': 'Sekcja CV jest w trakcie przygotowania.',
        'links.title': 'Linki i Social Media',
        'links.subtitle': 'Media społecznościowe, kontakt i inne miejsca w sieci',
        'links.placeholder': 'Sekcja z odnośnikami społecznościowymi wkrótce się tutaj pojawi.'
    },
    en: {
        'title.start': 'LyRooy - Dawid Łyczko',
        'title.projects': 'Projects - LyRooy',
        'title.homelab': 'Specs & homelab - LyRooy',
        'title.cv': 'CV - LyRooy',
        'title.links': 'Links - LyRooy',
        'desc.start': 'Dawid Łyczko (LyRooy) - web and application development, artificial intelligence (AI) and homelab.',
        'desc.projects': 'Web, academic and team projects by Dawid Łyczko (LyRooy).',
        'desc.homelab': 'Hardware specification and services of the homelab of Dawid Łyczko (LyRooy).',
        'desc.cv': 'CV of Dawid Łyczko (LyRooy).',
        'desc.links': 'Links and social media of Dawid Łyczko (LyRooy).',
        'nav.start': 'Home',
        'nav.projects': 'Projects',
        'nav.homelab': 'Specs',
        'nav.cv': 'CV',
        'nav.links': 'Links',
        'hero.greeting': "Hi, I'm David",
        'hero.lead': 'I build websites and web applications. I am also interested in artificial intelligence (AI) and machine learning - especially applying AI models in practical projects. In my free time, I am a homelab and self-hosting enthusiast.',
        'start.profilesTitle': 'Core profiles & repositories',
        'start.ghMainDesc': 'Main GitHub account - active code, personal and team projects',
        'start.ghAcadDesc': "Academic account - Master's thesis, paper replications",
        'start.hfDesc': 'Hugging Face account - exploring and testing AI models',
        'badge.main': 'main',
        'badge.acadShort': 'academic',
        'projects.title': 'My Projects',
        'projects.subtitle': 'Web applications, academic projects, and team collaborations',
        'projects.domainSection': 'Web projects on domain (110187.xyz)',
        'projects.mtEng': "Movie & TV series tracking web app - Bachelor's thesis (B.Eng.)",
        'projects.mtMsc': "Movie & TV series tracking web app + AI recommendations - Master's thesis (M.Sc.)",
        'projects.spaceInvaders': 'Web-based Space Invaders game - Course project',
        'projects.acadCalendar': 'Academic calendar application',
        'projects.ghPagesSection': 'Web projects on GitHub Pages',
        'projects.mechaKlub': 'Course project - website optimization (SEO analysis)',
        'projects.ciphers': 'Team project - interactive demo of historical ciphers',
        'projects.coauthors': 'Co-authors:',
        'projects.otherSection': 'Other projects',
        'projects.otherPlaceholder': 'Space for upcoming builds and non-web projects.',
        'homelab.title': 'Specs & homelab',
        'homelab.subtitle': 'Hardware, infrastructure and services I run on my own servers',
        'homelab.hardwareSection': 'Hardware specification',
        'homelab.dev.pc': 'Main PC',
        'homelab.dev.server': 'Main server',
        'homelab.dev.tiny': 'Second server',
        'homelab.dev.laptop': 'Laptop',
        'homelab.dev.peripherals': 'Peripherals',
        'homelab.svc.dietpi': 'DietPi · Dell Wyse 5070',
        'homelab.svc.truenas': 'TrueNAS · Main server',
        'homelab.codeServerNote': 'for Discord bots',
        'homelab.planned': 'Planned change (December)',
        'homelab.tvNote': 'sometimes used as a third monitor',
        'spec.os': 'OS',
        'spec.cpu': 'CPU',
        'spec.gpu': 'GPU',
        'spec.ram': 'RAM',
        'spec.board': 'Motherboard',
        'spec.psu': 'PSU',
        'spec.case': 'Case',
        'spec.cooling': 'Cooling',
        'spec.storage': 'Storage',
        'spec.model': 'Model',
        'spec.monitor': 'Monitor',
        'spec.tv': 'TV',
        'spec.speakers': 'Speakers',
        'spec.headset': 'Headset',
        'spec.mic': 'Microphone',
        'spec.keyboard': 'Keyboard',
        'spec.mouse': 'Mouse',
        'homelab.workloadSection': 'Services & workload',
        'homelab.workloadPlaceholder': 'A list of running services and self-hosted projects will appear here soon.',
        'cv.subtitle': 'Education, experience, and technical skills',
        'cv.placeholder': 'The CV section is currently under construction.',
        'links.title': 'Links & Social Media',
        'links.subtitle': 'Social media profiles, contact info, and other places online',
        'links.placeholder': 'Social media and external links will appear here soon.'
    }
};

// Mobile hamburger menu, inlined into every generated page
const MENU_SCRIPT = `
        (function () {
            var toggle = document.getElementById('menu-toggle');
            var icon = document.getElementById('menu-icon');
            var menu = document.getElementById('sidebar-menu');
            if (!toggle || !menu) return;
            toggle.addEventListener('click', function () {
                var isOpen = menu.classList.toggle('open');
                toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
                icon.className = isOpen ? 'ph ph-x' : 'ph ph-list';
            });
        })();
    `;

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function urlFor(id, lang) {
    const slug = SLUGS[id][lang];
    return '/' + lang + '/' + (slug ? slug + '/' : '');
}

// ---------- Hardware data (part names are language-independent) ----------
// row: { k: label key, v: current value(s), next: planned replacement, note: translation key }
const DEVICES = [
    {
        titleKey: 'homelab.dev.pc', icon: 'ph-desktop-tower', cls: 'device-pc',
        rows: [
            { k: 'spec.cpu', v: ['AMD Ryzen 7 7800X3D'] },
            { k: 'spec.gpu', v: ['ASUS Dual GeForce RTX 5070 12 GB'] },
            { k: 'spec.ram', v: ['Corsair Vengeance DDR5 64 GB 5600 MT/s CL40'] },
            { k: 'spec.board', v: ['MSI MAG B850 Tomahawk MAX WiFi'] },
            { k: 'spec.psu', v: ['MSI MAG A850GL PCIE5 II 850 W'] },
            { k: 'spec.case', v: ['Deepcool CG580 4F V2 (black)'] },
            { k: 'spec.cooling', v: ['Deepcool LM360 (AIO 360 mm)'] },
            { k: 'spec.storage', v: ['Kingston KC3000 2 TB NVMe', 'Lexar NQ790 2 TB NVMe', 'Lexar NS100 2 TB SATA'] },
            { k: 'spec.os', v: ['Windows 11 Pro 26H2'] }
        ]
    },
    {
        titleKey: 'homelab.dev.peripherals', icon: 'ph-mouse', cls: 'device-peripherals',
        rows: [
            { k: 'spec.monitor', v: ['AOC G2460', 'AOC Q27G42XE'] },
            { k: 'spec.tv', v: ['TCL 43P635 LED 43" 4K Ultra HD'], note: 'homelab.tvNote' },
            { k: 'spec.speakers', v: ['Edifier R1855DB'] },
            { k: 'spec.headset', v: ['Razer BlackShark V3 X'] },
            { k: 'spec.mic', v: ['Endorfy Solum Broadcast'] },
            { k: 'spec.keyboard', v: ['SPC Gear GK650K Pudding Edition'] },
            { k: 'spec.mouse', v: ['Razer Basilisk V3'] }
        ]
    },
    {
        titleKey: 'homelab.dev.server', icon: 'ph-hard-drives', cls: 'device-server',
        rows: [
            { k: 'spec.cpu', v: ['AMD Ryzen 5 1600'], next: 'AMD Ryzen 7 5700X' },
            { k: 'spec.gpu', v: ['ASUS Dual GeForce RTX 5060 Ti 16 GB'] },
            { k: 'spec.ram', v: ['Kingston Fury Beast DDR4 64 GB 3200 MT/s CL16'] },
            { k: 'spec.board', v: ['MSI B450M-A PRO MAX II'], next: 'ASUS ROG Strix B550-F Gaming WiFi II' },
            { k: 'spec.psu', v: ['Corsair CX550 550 W'], next: 'MSI MAG A850GL PCIE5 II 850 W' },
            { k: 'spec.case', v: ['be quiet! Pure Base 600 Black'] },
            { k: 'spec.cooling', v: ['Arctic Freezer 36 CO'] },
            { k: 'spec.storage', v: ['Kingston A2000 500 GB NVMe', '2x Seagate 1 TB HDD'] },
            { k: 'spec.os', v: ['TrueNAS 25.10.7 "Goldeye"'] }
        ]
    },
    {
        titleKey: 'homelab.dev.tiny', icon: 'ph-cpu', cls: 'device-tiny',
        rows: [
            { k: 'spec.model', v: ['Dell Wyse 5070'] },
            { k: 'spec.storage', v: ['128 GB M.2 SATA'] },
            { k: 'spec.os', v: ['Linux DietPi 10.8.2'] }
        ]
    },
    {
        titleKey: 'homelab.dev.laptop', icon: 'ph-laptop', cls: 'device-laptop',
        rows: [
            { k: 'spec.model', v: ['Lenovo ThinkPad T490'] },
            { k: 'spec.os', v: ['Windows 11 Pro 26H2'] }
        ]
    }
];

// Services as icon chips (official logos in /images/services, from homarr-labs/dashboard-icons and dietpi.com)
const SERVICES = [
    {
        titleKey: 'homelab.svc.dietpi', icon: 'ph-cpu',
        items: [
            { name: 'DietPi Dashboard', img: 'dietpi.png', url: 'https://dietpi.com/docs/software/system_stats/#dietpi-dashboard' },
            { name: 'Portainer', img: 'portainer.svg', url: 'https://www.portainer.io/' },
            { name: 'Homarr', img: 'homarr.svg', url: 'https://homarr.dev/' },
            { name: 'Home Assistant', img: 'home-assistant.svg', url: 'https://www.home-assistant.io/' },
            { name: 'Nginx Proxy Manager', img: 'nginx-proxy-manager.svg', url: 'https://nginxproxymanager.com/' },
            { name: 'Vaultwarden', img: 'vaultwarden.svg', url: 'https://github.com/dani-garcia/vaultwarden' },
            { name: 'Uptime Kuma', img: 'uptime-kuma.svg', url: 'https://uptime.kuma.pet/' },
            { name: 'Code Server', img: 'code-server.svg', url: 'https://coder.com/docs/code-server', note: 'homelab.codeServerNote' }
        ]
    },
    {
        titleKey: 'homelab.svc.truenas', icon: 'ph-hard-drives',
        items: [
            { name: 'Portainer', img: 'portainer.svg', url: 'https://www.portainer.io/' },
            { name: 'Crafty Controller', img: 'crafty-controller.svg', url: 'https://craftycontrol.com/' },
            { name: 'Suwayomi', img: 'suwayomi.svg', url: 'https://github.com/Suwayomi/Suwayomi-Server' },
            { name: 'Odysseus', img: 'odysseus.svg', url: 'https://odysseus-dev.github.io/odysseus/' },
            { name: 'ComfyUI', img: 'comfyui.svg', url: 'https://www.comfy.org/' },
            { name: 'Ollama', img: 'ollama.svg', url: 'https://ollama.com/' },
            { name: 'SearXNG', img: 'searxng.svg', url: 'https://docs.searxng.org/' },
            { name: 'Jellyfin', img: 'jellyfin.svg', url: 'https://jellyfin.org/' },
            { name: 'ytdl-sub', img: 'yt-dlp.svg', url: 'https://github.com/jmbannon/ytdl-sub' },
            { name: 'Syncthing', img: 'syncthing.svg', url: 'https://syncthing.net/' }
        ]
    }
];

function servicePanel(s, t) {
    const items = s.items.map(i => `                                    <li><a class="service-chip" href="${i.url}" target="_blank" rel="noopener"><span class="service-icon"><img src="/images/services/${i.img}" alt="" width="24" height="24"></span><span class="service-name">${esc(i.name)}${i.note ? `<small>${t(i.note)}</small>` : ''}</span></a></li>\n`).join('');
    return `                            <div class="device-card service-panel">
                                <div class="device-title"><span class="card-icon"><i class="ph ${s.icon}"></i></span><h3>${t(s.titleKey)}</h3></div>
                                <ul class="service-list">
${items}                                </ul>
                            </div>
`;
}

function deviceCard(d, t) {
    const rows = d.rows.map(r => {
        const current = r.v.map(x => `<span class="spec-val">${esc(x)}</span>`).join('');
        const next = r.next
            ? `<span class="spec-next"><i class="ph ph-arrow-bend-down-right"></i>${esc(r.next)} <em>${t('homelab.planned')}</em></span>`
            : '';
        const note = r.note ? `<span class="spec-note">${t(r.note)}</span>` : '';
        const cls = r.next ? ' class="spec-changing"' : '';
        return `                                    <div${cls}><dt>${t(r.k)}</dt><dd>${current}${note}${next}</dd></div>\n`;
    }).join('');
    return `                            <div class="device-card ${d.cls}">
                                <div class="device-title"><span class="card-icon"><i class="ph ${d.icon}"></i></span><h3>${t(d.titleKey)}</h3></div>
                                <dl class="spec-list">
${rows}                                </dl>
                            </div>
`;
}

// ---------- Page bodies ----------
const BODY = {
    start: t => `
                <section class="tab-panel active">
                    <div class="hero-box">
                        <div class="hero-badge">Web Development &bull; AI &bull; Homelab</div>
                        <h2>${t('hero.greeting')} <span class="hero-subname">(LyRooy)</span></h2>
                        <p class="hero-lead">${t('hero.lead')}</p>
                    </div>

                    <div class="section">
                        <div class="section-title">${t('start.profilesTitle')}</div>
                        <div class="quick-links-grid">
                            <a class="card" href="https://github.com/lyrooy" target="_blank" rel="noopener">
                                <div class="card-icon"><i class="ph ph-github-logo"></i></div>
                                <div class="card-info">
                                    <span class="card-title">github.com/lyrooy</span>
                                    <span class="card-desc">${t('start.ghMainDesc')}</span>
                                </div>
                                <div class="card-right">
                                    <span class="badge badge-primary">${t('badge.main')}</span>
                                    <i class="ph ph-arrow-up-right card-arrow"></i>
                                </div>
                            </a>

                            <a class="card" href="https://github.com/lyczkod" target="_blank" rel="noopener">
                                <div class="card-icon"><i class="ph ph-graduation-cap"></i></div>
                                <div class="card-info">
                                    <span class="card-title">github.com/lyczkod</span>
                                    <span class="card-desc">${t('start.ghAcadDesc')}</span>
                                </div>
                                <div class="card-right">
                                    <span class="badge badge-neutral">${t('badge.acadShort')}</span>
                                    <i class="ph ph-arrow-up-right card-arrow"></i>
                                </div>
                            </a>

                            <a class="card" href="https://huggingface.co/LyRooy" target="_blank" rel="noopener">
                                <div class="card-icon hf-icon"><i class="ph ph-brain"></i></div>
                                <div class="card-info">
                                    <span class="card-title">huggingface.co/LyRooy</span>
                                    <span class="card-desc">${t('start.hfDesc')}</span>
                                </div>
                                <div class="card-right">
                                    <span class="badge badge-hf">Hugging Face</span>
                                    <i class="ph ph-arrow-up-right card-arrow"></i>
                                </div>
                            </a>
                        </div>
                    </div>
                </section>`,

    projects: t => {
        const domainCard = (href, title, descKey) => `
                                <a class="card" href="${href}" target="_blank" rel="noopener">
                                    <div class="card-info">
                                        <span class="card-title">${title}</span>
                                        <span class="card-desc">${t(descKey)}</span>
                                    </div>
                                    <div class="card-right">
                                        <span class="badge badge-domain">110187.xyz</span>
                                        <i class="ph ph-arrow-up-right card-arrow"></i>
                                    </div>
                                </a>
`;
        const author = (name) => `
                                        <a class="author-link" href="https://github.com/${name}" target="_blank" rel="noopener">
                                            <i class="ph-fill ph-github-logo"></i>
                                            ${name}
                                        </a>`;
        const ghCard = (href, title, descKey, authors) => `
                                <div class="card card-complex">
                                    <a href="${href}" target="_blank" rel="noopener" class="card-overlay-link" aria-label="${title}"></a>
                                    <div class="card-top-row">
                                        <div class="card-info">
                                            <span class="card-title">${title}</span>
                                            <span class="card-desc">${t(descKey)}</span>
                                        </div>
                                        <div class="card-right card-raised">
                                            <span class="badge badge-ghpages">GitHub Pages</span>
                                            <i class="ph ph-arrow-up-right card-arrow"></i>
                                        </div>
                                    </div>
                                    <div class="card-authors card-raised">
                                        <span>${t('projects.coauthors')}</span>${authors.map(author).join('')}
                                    </div>
                                </div>
`;
        return `
                <section class="tab-panel active">
                    <div class="tab-header">
                        <h2>${t('projects.title')}</h2>
                        <p>${t('projects.subtitle')}</p>
                    </div>

                    <div class="projects-columns">
                        <div class="projects-col">
                            <div class="section">
                                <div class="section-title">${t('projects.domainSection')}</div>
${domainCard('https://movie-tracker.110187.xyz', 'Movie Tracker', 'projects.mtEng')}${domainCard('https://movie-tracker-mstr.110187.xyz', 'Movie Tracker', 'projects.mtMsc')}${domainCard('https://arcade.110187.xyz', 'Space Invaders', 'projects.spaceInvaders')}${domainCard('https://academic-calendar.110187.xyz/', 'Academic Calendar', 'projects.acadCalendar')}                            </div>
                        </div>

                        <div class="projects-col">
                            <div class="section">
                                <div class="section-title">${t('projects.ghPagesSection')}</div>
${ghCard('https://lyrooy.github.io/mecha-klub/', 'Mecha-Klub', 'projects.mechaKlub', ['Glamie'])}${ghCard('https://lyrooy.github.io/historical-ciphers-demo/', 'Historical Ciphers Demo', 'projects.ciphers', ['Glamie', 'xToMsIx'])}                            </div>

                            <div class="section">
                                <div class="section-title">${t('projects.otherSection')}</div>
                                <div class="placeholder-box placeholder-box-compact">
                                    <p>${t('projects.otherPlaceholder')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="github-profiles">
                        <a class="github-profile" href="https://github.com/lyrooy" target="_blank" rel="noopener">
                            <i class="ph-fill ph-github-logo"></i>
                            github.com/lyrooy
                            <span class="github-profile-tag">${t('badge.main')}</span>
                        </a>
                        <a class="github-profile" href="https://github.com/lyczkod" target="_blank" rel="noopener">
                            <i class="ph-fill ph-github-logo"></i>
                            github.com/lyczkod
                            <span class="github-profile-tag">${t('badge.acadShort')}</span>
                        </a>
                    </div>
                </section>`;
    },

    homelab: t => {
        const card = key => deviceCard(DEVICES.find(d => d.titleKey === key), t);
        return `
                <section class="tab-panel active">
                    <div class="tab-header">
                        <h2>${t('homelab.title')}</h2>
                        <p>${t('homelab.subtitle')}</p>
                    </div>

                    <div class="section">
                        <div class="section-title">${t('homelab.hardwareSection')}</div>
                        <div class="device-grid">
${card('homelab.dev.pc')}${card('homelab.dev.peripherals')}                        </div>
                        <hr class="device-divider">
                        <div class="device-grid">
${card('homelab.dev.server')}                            <div class="device-stack">
${card('homelab.dev.tiny')}${card('homelab.dev.laptop')}                            </div>
                        </div>
                    </div>

                    <div class="section">
                        <div class="section-title">${t('homelab.workloadSection')}</div>
                        <div class="device-grid">
${SERVICES.map(s => servicePanel(s, t)).join('')}                        </div>
                    </div>
                </section>`;
    },

    cv: t => `
                <section class="tab-panel active">
                    <div class="tab-header">
                        <h2>Curriculum Vitae</h2>
                        <p>${t('cv.subtitle')}</p>
                    </div>
                    <div class="placeholder-box">
                        <p>${t('cv.placeholder')}</p>
                    </div>
                </section>`,

    links: t => `
                <section class="tab-panel active">
                    <div class="tab-header">
                        <h2>${t('links.title')}</h2>
                        <p>${t('links.subtitle')}</p>
                    </div>
                    <div class="placeholder-box">
                        <p>${t('links.placeholder')}</p>
                    </div>
                </section>`
};

function render(pageId, lang) {
    const t = key => esc(T[lang][key]);
    const url = id => urlFor(id, lang);
    const self = SITE + urlFor(pageId, lang);
    const alternates = LANGS.map(l => `    <link rel="alternate" hreflang="${l}" href="${SITE}${urlFor(pageId, l)}">`).join('\n');
    const xDefault = pageId === 'start' ? `\n    <link rel="alternate" hreflang="x-default" href="${SITE}/">` : '';

    const nav = NAV.map(n => `
                        <a class="nav-item${n.id === pageId ? ' active' : ''}" href="${url(n.id)}"${n.id === pageId ? ' aria-current="page"' : ''}>
                            <span class="nav-item-icon"><i class="ph ${n.icon}"></i></span>
                            <span class="nav-item-label">${t(n.key)}</span>
                            <i class="ph ph-caret-right nav-item-arrow"></i>
                        </a>`).join('');

    return `<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="author" content="Dawid Łyczko">
    <meta name="description" content="${t('desc.' + pageId)}">
    <meta property="og:title" content="${t('title.' + pageId)}">
    <meta property="og:description" content="${t('desc.' + pageId)}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${self}">
    <meta property="og:locale" content="${lang === 'pl' ? 'pl_PL' : 'en_US'}">
    <meta name="theme-color" content="#0b1120">
    <title>${t('title.' + pageId)}</title>
    <link rel="canonical" href="${self}">
${alternates}${xDefault}
    <link rel="icon" href="/images/favicon.svg" type="image/svg+xml">
    <link rel="stylesheet" href="/style.css?v=13">
    <script src="https://unpkg.com/@phosphor-icons/web"></script>
</head>
<body>
    <div class="layout">
        <aside class="sidebar">
            <div class="sidebar-top">
                <div class="sidebar-header">
                    <a class="sidebar-profile" href="${url('start')}">
                        <div class="avatar">
                            <img src="/images/avatar.jpg" alt="LyRooy">
                        </div>
                        <div class="sidebar-identity">
                            <span class="sidebar-nick">LyRooy</span>
                            <span class="sidebar-realname">Dawid Łyczko</span>
                        </div>
                    </a>

                    <button class="hamburger-btn" id="menu-toggle" aria-label="Menu" aria-expanded="false">
                        <i class="ph ph-list" id="menu-icon"></i>
                    </button>
                </div>

                <div class="sidebar-menu" id="sidebar-menu">
                    <nav class="sidebar-nav">${nav}
                    </nav>

                    <div class="mobile-menu-footer">
                        <p>&copy; 2026 Dawid Łyczko (LyRooy)</p>
                    </div>
                </div>
            </div>

            <footer class="sidebar-footer">
                <p>&copy; 2026 Dawid Łyczko (LyRooy)</p>
            </footer>
        </aside>

        <main class="main-content">
            <div class="content-wrapper">
${BODY[pageId](t)}
            </div>
        </main>
    </div>

    <script>${MENU_SCRIPT}</script>
</body>
</html>
`;
}

for (const lang of LANGS) {
    for (const pageId of Object.keys(SLUGS)) {
        const dir = path.join(__dirname, lang, SLUGS[pageId][lang]);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, 'index.html'), render(pageId, lang));
    }
}
console.log('Generated pages for: ' + LANGS.join(', '));
