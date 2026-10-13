const screens = document.querySelectorAll('.screen');

function openScreen(id) {
  const target = document.getElementById(id);
  if (!target) return;

  screens.forEach((screen) => screen.classList.remove('active'));
  target.classList.add('active');
  document.getElementById('mobileNav').hidden = id === 'login';
  document.querySelectorAll('.mobile-nav [data-open]').forEach((button) => {
    const isCurrent = button.dataset.open === (id === 'profile' ? 'settings' : id);
    if (isCurrent) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  });
  if (id !== 'discipline') {
    document.querySelectorAll('.discipline-select').forEach((select) => {
      select.value = 'formula1';
    });
  }
  window.scrollTo({
    top: 0,
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
  });
}

document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-open]');
  if (button) openScreen(button.dataset.open);
});

// Одинаковый переключатель дисциплины в боковой панели и мобильной шапке.
const disciplineOptions = `
  <option value="formula1">Формула 1</option>
  <option value="drift">Дрифт</option>
  <option value="timeattack">Тайм-аттак</option>
  <option value="drag">Драг-рейсинг</option>
`;

document.querySelectorAll('.dashboard').forEach((screen) => {
  const sidebar = screen.querySelector('.sidebar');
  const page = screen.querySelector('.page');
  const panel = document.createElement('div');

  panel.className = 'discipline-panel';
  panel.innerHTML = `
    <label for="discipline-${screen.id}">ДИСЦИПЛИНА</label>
    <select class="discipline-select" id="discipline-${screen.id}" aria-label="Выбрать дисциплину">
      ${disciplineOptions}
    </select>
  `;

  sidebar.querySelector('.brand-image').after(panel);
  const mobilePanel = panel.cloneNode(true);
  mobilePanel.classList.add('discipline-panel--mobile');
  mobilePanel.querySelector('label').htmlFor = `discipline-${screen.id}-mobile`;
  mobilePanel.querySelector('select').id = `discipline-${screen.id}-mobile`;
  page.prepend(mobilePanel);
  page.append(document.getElementById('footerTemplate').content.cloneNode(true));
});

document.querySelectorAll('.discipline-select').forEach((select) => {
  select.addEventListener('change', () => {
    const value = select.value;
    document.querySelectorAll('.discipline-select').forEach((other) => {
      other.value = value;
    });

    if (value === 'formula1') {
      openScreen('home');
      return;
    }

    document.getElementById('disciplineTitle').textContent =
      select.selectedOptions[0].textContent;
    openScreen('discipline');
  });
});

const todayLabel = document.querySelector('#home .welcome-small');
if (todayLabel) {
  todayLabel.textContent = new Intl.DateTimeFormat('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'Europe/Minsk'
  }).format(new Date());
}

// Снимок сезона после 15-го этапа. Изображения команд лежат в assets.
const drivers = [
  { name: 'Кими Антонелли', country: 'Италия', team: 'Mercedes', points: 302, logo: 'merclogo.png' },
  { name: 'Джордж Расселл', country: 'Великобритания', team: 'Mercedes', points: 236, logo: 'merclogo.png' },
  { name: 'Льюис Хэмилтон', country: 'Великобритания', team: 'Ferrari', points: 199, logo: 'ferrariLogo.png' },
  { name: 'Ландо Норрис', country: 'Великобритания', team: 'McLaren', points: 186, logo: 'log.png' },
  { name: 'Шарль Леклер', country: 'Монако', team: 'Ferrari', points: 179, logo: 'ferrariLogo.png' },
  { name: 'Макс Ферстаппен', country: 'Нидерланды', team: 'Red Bull Racing', points: 163, logo: 'redbullLogo.png' },
  { name: 'Оскар Пиастри', country: 'Австралия', team: 'McLaren', points: 120, logo: 'log.png' },
  { name: 'Исак Хаджар', country: 'Франция', team: 'Red Bull Racing', points: 86, logo: 'redbullLogo.png' }
];

const teams = [
  { name: 'Mercedes', logo: 'merclogo.png', drivers: 'Кими Антонелли · Джордж Расселл' },
  { name: 'Ferrari', logo: 'ferrariLogo.png', drivers: 'Льюис Хэмилтон · Шарль Леклер' },
  { name: 'McLaren', logo: 'log.png', drivers: 'Ландо Норрис · Оскар Пиастри' },
  { name: 'Red Bull Racing', logo: 'redbullLogo.png', drivers: 'Макс Ферстаппен · Исак Хаджар' }
];

const completedRaces = [
  { date: '08', month: 'МАР', country: 'Австралия', winner: 'Джордж Расселл', team: 'Mercedes' },
  { date: '15', month: 'МАР', country: 'Китай', winner: 'Кими Антонелли', team: 'Mercedes' },
  { date: '29', month: 'МАР', country: 'Япония', winner: 'Кими Антонелли', team: 'Mercedes' },
  { date: '03', month: 'МАЙ', country: 'Майами', winner: 'Кими Антонелли', team: 'Mercedes' },
  { date: '24', month: 'МАЙ', country: 'Канада', winner: 'Кими Антонелли', team: 'Mercedes' },
  { date: '07', month: 'ИЮН', country: 'Монако', winner: 'Кими Антонелли', team: 'Mercedes' },
  { date: '14', month: 'ИЮН', country: 'Барселона-Каталунья', winner: 'Льюис Хэмилтон', team: 'Ferrari' },
  { date: '28', month: 'ИЮН', country: 'Австрия', winner: 'Джордж Расселл', team: 'Mercedes' },
  { date: '05', month: 'ИЮЛ', country: 'Великобритания', winner: 'Шарль Леклер', team: 'Ferrari' },
  { date: '19', month: 'ИЮЛ', country: 'Бельгия', winner: 'Кими Антонелли', team: 'Mercedes' },
  { date: '26', month: 'ИЮЛ', country: 'Венгрия', winner: 'Ландо Норрис', team: 'McLaren' },
  { date: '23', month: 'АВГ', country: 'Нидерланды', winner: 'Ландо Норрис', team: 'McLaren' },
  { date: '06', month: 'СЕН', country: 'Италия', winner: 'Кими Антонелли', team: 'Mercedes' },
  { date: '13', month: 'СЕН', country: 'Испания', winner: 'Кими Антонелли', team: 'Mercedes' },
  { date: '26', month: 'СЕН', country: 'Азербайджан', winner: 'Джордж Расселл', team: 'Mercedes' }
];

function renderDriver(driver, index) {
  return `
    <article class="driver">
      <span class="place ${index === 0 ? 'place--first' : ''}">${index + 1}</span>
      <div class="driver-avatar">
        <img src="assets/${driver.logo}" alt="Логотип ${driver.team}">
      </div>
      <div class="driver-info">
        <strong>${driver.name}</strong>
        <span>${driver.team} · ${driver.country}</span>
      </div>
      <strong>${driver.points} <small>PTS</small></strong>
    </article>
  `;
}

function renderCompletedRace(race, index) {
  return `
    <article class="event-card event-card--past">
      <div class="event-card-top">
        <span class="event-round">ЭТАП ${index + 1}</span>
        <span class="status status--done">Завершён</span>
      </div>
      <div class="event-date"><strong>${race.date}</strong><span>${race.month}</span></div>
      <div class="event-copy">
        <span>${race.country}</span>
        <h3>Гран-при ${race.country}</h3>
        <p>Сезон 2026</p>
      </div>
      <div class="winner">
        <span>ПОБЕДИТЕЛЬ</span>
        <strong>${race.winner}</strong>
        <small>${race.team}</small>
      </div>
    </article>
  `;
}

document.getElementById('homeDrivers').innerHTML =
  drivers.slice(0, 4).map(renderDriver).join('');

document.getElementById('allDrivers').innerHTML =
  drivers.map(renderDriver).join('');

document.getElementById('completedRaces').innerHTML =
  completedRaces.map(renderCompletedRace).join('');

document.getElementById('teamsGrid').innerHTML = teams.map((team) => `
  <article class="team-card">
    <img src="assets/${team.logo}" alt="Логотип ${team.name}">
    <div>
      <h2>${team.name}</h2>
      <p>${team.drivers}</p>
    </div>
  </article>
`).join('');

const form = document.getElementById('loginForm');
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  if (!email.value.trim() || !password.value.trim()) {
    alert('Введите электронную почту и пароль');
    return;
  }
  openScreen('home');
});

const showPassword = document.getElementById('showPassword');
const passwordInput = document.getElementById('password');
showPassword?.addEventListener('click', () => {
  const willShow = passwordInput.type === 'password';
  passwordInput.type = willShow ? 'text' : 'password';
  showPassword.setAttribute('aria-label', willShow ? 'Скрыть пароль' : 'Показать пароль');
  showPassword.querySelector('use').setAttribute('href', willShow ? '#i-eye-off' : '#i-eye');
});

const countdown = document.getElementById('countdown');
const countdownStatus = document.getElementById('countdownStatus');

function updateCountdown() {
  if (!countdown) return;
  const start = new Date(countdown.dataset.start).getTime();
  const distance = Math.max(0, start - Date.now());
  const values = {
    days: Math.floor(distance / 86400000),
    hours: Math.floor((distance % 86400000) / 3600000),
    minutes: Math.floor((distance % 3600000) / 60000),
    seconds: Math.floor((distance % 60000) / 1000)
  };
  Object.entries(values).forEach(([key, value]) => {
    const field = countdown.querySelector(`[data-time="${key}"]`);
    if (field) field.textContent = String(value).padStart(2, '0');
  });
  if (distance === 0 && countdownStatus) countdownStatus.textContent = 'Гонка уже началась';
}

updateCountdown();
setInterval(updateCountdown, 1000);
