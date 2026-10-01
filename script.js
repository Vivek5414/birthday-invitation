/*
 * PARTY CUSTOMIZATION — update this one object to personalize the invitation.
 * `date` is local time on the visitor's device (YYYY-MM-DDTHH:mm:ss).
 * Add your own gallery image objects and optional audio path here.
 */
const party = {
  birthdayName: 'Sofia',
  date: '2026-11-14T18:00:00',
  eventTime: '6:00 PM',
  venue: 'The Glasshouse',
  address: '47 Wythe Avenue',
  city: 'Brooklyn, NY 11249',
  dressCode: 'Garden party',
  dressNote: 'Dress up, but stay comfy',
  rsvpBy: 'November 1st',
  birthdayMessage: 'Good food, big laughs, questionable dance moves, and all our favorite people in one room. The only thing missing is you. Come help us make this birthday one for the books!',
  musicUrl: '', // Optional: use a royalty-free MP3 file, such as 'assets/party-song.mp3'.
  musicVolume: 0.68, // Synth or audio volume from 0 (silent) to 1 (full).
  gallery: [
    { src: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=900&q=80', alt: 'Bright balloons and confetti at a celebration', caption: 'a room full of joy', shape: 'tall' },
    { src: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=800&q=80', alt: 'Pink and yellow flowers glowing in warm sunlight', caption: 'color me happy' },
    { src: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80', alt: 'A festive long table set for a party', caption: 'gather round', shape: 'wide' },
    { src: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=800&q=80', alt: 'A colorful bouquet of fresh flowers', caption: 'a little extra sparkle' },
    { src: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=900&q=80', alt: 'Golden evening sunlight over a meadow', caption: 'golden hour magic', shape: 'tall' },
    { src: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=800&q=80', alt: 'A frosted birthday cake ready for candles', caption: 'always room for cake' },
    { src: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1000&q=80', alt: 'Colorful party table with flowers and celebratory details', caption: 'the details matter', shape: 'wide' },
    { src: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=800&q=80', alt: 'Friends raising glasses together in celebration', caption: 'cheers to you' },
    { src: 'https://images.unsplash.com/photo-1557925923-cd4648e211a0?auto=format&fit=crop&w=800&q=80', alt: 'Sweet treats decorated for a party', caption: 'sweet little moments' },
  ],
};

const setText = (selector, value) => {
  document.querySelectorAll(selector).forEach((element) => { element.textContent = value; });
};
setText('[data-birthday-name]', party.birthdayName);
setText('[data-event-time]', party.eventTime);
setText('[data-event-venue]', party.venue);
setText('[data-event-address]', party.address);
setText('[data-city]', party.city);
setText('[data-dress-code]', party.dressCode);
setText('[data-dress-note]', party.dressNote);
setText('[data-rsvp-deadline]', party.rsvpBy);
setText('#birthday-message', party.birthdayMessage);
document.title = `You're Invited! — ${party.birthdayName}'s Birthday Party`;
document.querySelector('.brand')?.setAttribute('aria-label', `${party.birthdayName}'s birthday party invitation home`);

const configuredDate = new Date(party.date);
if (!Number.isNaN(configuredDate.getTime())) {
  document.querySelectorAll('[data-event-date]').forEach((element) => {
    const style = element.dataset.eventDate;
    const options = style === 'weekday'
      ? { weekday: 'long' }
      : style === 'long'
        ? { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }
        : { month: 'long', day: 'numeric' };
    element.textContent = configuredDate.toLocaleDateString('en-US', options);
  });
}
const directionsLink = document.querySelector('.button-map');
if (directionsLink) {
  const mapQuery = encodeURIComponent(`${party.venue}, ${party.address}, ${party.city}`);
  directionsLink.href = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
}

// Live event clock. The displayed numbers pulse without changing their layout width.
const countdownNodes = {
  days: document.querySelector('#days'),
  hours: document.querySelector('#hours'),
  minutes: document.querySelector('#minutes'),
  seconds: document.querySelector('#seconds'),
};
const countdown = document.querySelector('#countdown-clock');
const countdownMessage = document.querySelector('#countdown-message');
const partyTime = new Date(party.date).getTime();
let lastSecond = null;
function updateCountdown() {
  const remaining = partyTime - Date.now();
  if (!Number.isFinite(remaining) || remaining <= 0) {
    countdown.hidden = true;
    countdownMessage.hidden = false;
    return;
  }
  const values = {
    days: Math.floor(remaining / 86_400_000),
    hours: Math.floor((remaining % 86_400_000) / 3_600_000),
    minutes: Math.floor((remaining % 3_600_000) / 60_000),
    seconds: Math.floor((remaining % 60_000) / 1_000),
  };
  Object.entries(values).forEach(([unit, value]) => {
    const node = countdownNodes[unit];
    const formatted = String(value).padStart(2, '0');
    if (node.textContent !== formatted) {
      node.textContent = formatted;
      if (unit === 'seconds' && lastSecond !== null) {
        node.classList.remove('tick');
        void node.offsetWidth;
        node.classList.add('tick');
      }
    }
  });
  lastSecond = values.seconds;
}
updateCountdown();
window.setInterval(updateCountdown, 1000);

// Mobile navigation: accessible toggle, Escape handling, close-on-link and resize.
const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('#site-nav');
function closeMenu() {
  if (!menuToggle || !siteNav) return;
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
  siteNav.classList.remove('is-open');
  document.body.classList.remove('menu-open');
}
menuToggle?.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  siteNav.classList.toggle('is-open', open);
  document.body.classList.toggle('menu-open', open);
});
siteNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
window.addEventListener('resize', () => {
  if (window.matchMedia('(min-width: 781px)').matches) closeMenu();
}, { passive: true });
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

// Reveal cards as they enter view, while avoiding hidden content for reduced motion.
const revealItems = document.querySelectorAll('.reveal');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let revealObserver;
if ('IntersectionObserver' in window && !prefersReducedMotion.matches) {
  revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -25px 0px' });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

// Small canvas confetti with circles, ribbons, and paper squares.
const confettiCanvas = document.querySelector('#confetti-canvas');
const confettiContext = confettiCanvas?.getContext('2d');
const confettiColors = ['#ff3f9d', '#8145d5', '#2879ef', '#ffd23e', '#ff874d', '#17b8c5', '#ffffff'];
let confettiPieces = [];
let confettiFrame = 0;
let canvasWidth = 0;
let canvasHeight = 0;
function resizeConfettiCanvas() {
  if (!confettiCanvas || !confettiContext) return;
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
  confettiCanvas.width = Math.round(canvasWidth * ratio);
  confettiCanvas.height = Math.round(canvasHeight * ratio);
  confettiContext.setTransform(ratio, 0, 0, ratio, 0, 0);
}
resizeConfettiCanvas();
window.addEventListener('resize', resizeConfettiCanvas, { passive: true });
function drawConfetti() {
  if (!confettiContext) return;
  confettiContext.clearRect(0, 0, canvasWidth, canvasHeight);
  confettiPieces = confettiPieces.filter((piece) => piece.y < canvasHeight + 24 && piece.opacity > 0.08);
  confettiPieces.forEach((piece) => {
    piece.x += piece.vx;
    piece.y += piece.vy;
    piece.vy += 0.045;
    piece.rotation += piece.spin;
    piece.opacity -= 0.004;
    confettiContext.save();
    confettiContext.globalAlpha = piece.opacity;
    confettiContext.translate(piece.x, piece.y);
    confettiContext.rotate(piece.rotation);
    confettiContext.fillStyle = piece.color;
    if (piece.shape === 'circle') {
      confettiContext.beginPath();
      confettiContext.arc(0, 0, piece.size / 2, 0, Math.PI * 2);
      confettiContext.fill();
    } else if (piece.shape === 'triangle') {
      confettiContext.beginPath();
      confettiContext.moveTo(0, -piece.size / 2);
      confettiContext.lineTo(piece.size / 2, piece.size / 2);
      confettiContext.lineTo(-piece.size / 2, piece.size / 2);
      confettiContext.closePath();
      confettiContext.fill();
    } else {
      confettiContext.fillRect(-piece.size / 2, -piece.size / 3, piece.size, piece.size * 0.65);
    }
    confettiContext.restore();
  });
  if (confettiPieces.length) confettiFrame = window.requestAnimationFrame(drawConfetti);
  else confettiContext.clearRect(0, 0, canvasWidth, canvasHeight);
}
function celebrate(origin) {
  if (prefersReducedMotion.matches || !confettiCanvas || !confettiContext) return;
  window.cancelAnimationFrame(confettiFrame);
  const bounds = origin?.getBoundingClientRect();
  const centerX = bounds ? bounds.left + bounds.width / 2 : canvasWidth / 2;
  const centerY = bounds ? bounds.top + bounds.height / 2 : canvasHeight * .24;
  confettiPieces = Array.from({ length: 115 }, () => ({
    x: centerX + (Math.random() - .5) * Math.max(35, (bounds?.width || 0) * 1.6),
    y: centerY - Math.random() * 35,
    vx: (Math.random() - .5) * 6,
    vy: -2.5 + Math.random() * 2.5,
    size: 5 + Math.random() * 8,
    rotation: Math.random() * Math.PI,
    spin: (Math.random() - .5) * .16,
    opacity: 1,
    shape: ['square', 'circle', 'triangle'][Math.floor(Math.random() * 3)],
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
  }));
  drawConfetti();
}
const partyButton = document.querySelector('.party-button');
partyButton?.addEventListener('click', (event) => {
  event.preventDefault();
  celebrate(partyButton);
  document.querySelector('#details')?.scrollIntoView({ behavior: prefersReducedMotion.matches ? 'auto' : 'smooth' });
});

// Create the gallery from `party.gallery`, keeping image edits in one place.
const galleryGrid = document.querySelector('#gallery-grid');
function renderGallery() {
  if (!galleryGrid) return;
  const fragment = document.createDocumentFragment();
  party.gallery.forEach((photo, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `gallery-item reveal${photo.shape ? ` gallery-${photo.shape}` : ''}`;
    button.dataset.galleryIndex = String(index);
    button.setAttribute('aria-label', `View photo ${index + 1}: ${photo.caption}`);
    const image = document.createElement('img');
    image.src = photo.src;
    image.alt = photo.alt;
    image.loading = 'lazy';
    image.decoding = 'async';
    image.sizes = '(max-width: 780px) 50vw, (max-width: 1240px) 33vw, 300px';
    const caption = document.createElement('span');
    caption.className = 'gallery-caption';
    caption.textContent = photo.caption;
    button.append(image, caption);
    fragment.append(button);
  });
  galleryGrid.replaceChildren(fragment);
  if (typeof revealObserver !== 'undefined') {
    galleryGrid.querySelectorAll('.reveal').forEach((item) => revealObserver.observe(item));
  } else {
    galleryGrid.querySelectorAll('.reveal').forEach((item) => item.classList.add('is-visible'));
  }
}
renderGallery();

// Gallery lightbox: keyboard controls, focus trap, escape, swipe, and focus return.
const lightbox = document.querySelector('#lightbox');
const lightboxImage = document.querySelector('#lightbox-image');
const lightboxCaption = document.querySelector('#lightbox-caption');
const lightboxCount = document.querySelector('#lightbox-count');
const lightboxClose = document.querySelector('.lightbox-close');
let activeImageIndex = 0;
let previousFocus = null;
let touchStartX = null;
function showGalleryImage(index) {
  const images = party.gallery;
  if (!images.length) return;
  activeImageIndex = (index + images.length) % images.length;
  const photo = images[activeImageIndex];
  lightboxImage.src = photo.src;
  lightboxImage.alt = photo.alt;
  lightboxCaption.textContent = photo.caption;
  lightboxCount.textContent = `${activeImageIndex + 1} / ${images.length}`;
  lightboxImage.classList.remove('lightbox-image-in');
  void lightboxImage.offsetWidth;
  lightboxImage.classList.add('lightbox-image-in');
}
function openLightbox(index, source) {
  previousFocus = source || document.activeElement;
  showGalleryImage(index);
  lightbox.hidden = false;
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('lightbox-open');
  lightboxClose.focus();
}
function closeLightbox() {
  if (lightbox.hidden) return;
  lightbox.hidden = true;
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('lightbox-open');
  previousFocus?.focus();
}
galleryGrid?.addEventListener('click', (event) => {
  const item = event.target.closest('.gallery-item');
  if (item) openLightbox(Number(item.dataset.galleryIndex), item);
});
lightboxClose?.addEventListener('click', closeLightbox);
document.querySelector('.lightbox-prev')?.addEventListener('click', () => showGalleryImage(activeImageIndex - 1));
document.querySelector('.lightbox-next')?.addEventListener('click', () => showGalleryImage(activeImageIndex + 1));
lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});
lightbox?.addEventListener('touchstart', (event) => {
  touchStartX = event.changedTouches[0].clientX;
}, { passive: true });
lightbox?.addEventListener('touchend', (event) => {
  if (touchStartX === null) return;
  const delta = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(delta) > 55) showGalleryImage(activeImageIndex + (delta < 0 ? 1 : -1));
  touchStartX = null;
}, { passive: true });
document.addEventListener('keydown', (event) => {
  if (lightbox?.hidden) return;
  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowLeft') showGalleryImage(activeImageIndex - 1);
  if (event.key === 'ArrowRight') showGalleryImage(activeImageIndex + 1);
  if (event.key === 'Tab') {
    const focusable = [...lightbox.querySelectorAll('button:not([disabled])')];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

// Tapping the cake makes the wish, blows out candles, and celebrates.
const cakeButton = document.querySelector('.cake-button');
const cakeMessage = document.querySelector('#cake-message');
cakeButton?.addEventListener('click', () => {
  cakeButton.classList.remove('wished');
  void cakeButton.offsetWidth;
  cakeButton.classList.add('wished');
  cakeMessage.textContent = 'MAKE A WISH! 🎂✨';
  celebrate(cakeButton);
  window.setTimeout(() => cakeButton.classList.remove('wished'), 1600);
});

// RSVP is validated in-browser. Connect this handler to a form backend to save responses.
const rsvpForm = document.querySelector('#rsvp-form');
const formSuccess = document.querySelector('#form-success');
const formError = document.querySelector('#form-error');
const successName = document.querySelector('#success-name');
const successNote = document.querySelector('#success-note');
rsvpForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  formError.hidden = true;
  const name = rsvpForm.elements.name.value.trim();
  if (!name || !rsvpForm.reportValidity()) {
    formError.textContent = 'Please add your name, a valid email, and choose an attendance option.';
    formError.hidden = false;
    (rsvpForm.querySelector(':invalid') || rsvpForm.elements.name).focus();
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rsvpForm.elements.email.value.trim())) {
    formError.textContent = 'That email address does not look quite right. Please check it and try again.';
    formError.hidden = false;
    rsvpForm.elements.email.focus();
    return;
  }
  successName.textContent = name;
  successNote.textContent = rsvpForm.elements.attendance.value === 'yes'
    ? "We can't wait to celebrate with you!"
    : "We'll miss you, and we'll raise a slice of cake in your honor!";
  rsvpForm.hidden = true;
  formSuccess.hidden = false;
  formSuccess.focus();
  celebrate(document.querySelector('.form-card'));
});
document.querySelector('.edit-rsvp')?.addEventListener('click', () => {
  formSuccess.hidden = true;
  rsvpForm.hidden = false;
  rsvpForm.querySelector('#guest-name').focus();
});

// No audio plays until the visitor presses the music button. A gentle, original
// Web Audio party loop is the default; `musicUrl` can point to a custom MP3 instead.
const musicToggle = document.querySelector('#music-toggle');
let birthdayAudio = null;
let musicContext = null;
let musicMaster = null;
let musicTimer = null;
let musicStep = 0;
if (party.musicUrl) {
  birthdayAudio = new Audio(party.musicUrl);
  birthdayAudio.loop = true;
  birthdayAudio.preload = 'none';
}
const melody = [523.25, 659.25, 783.99, 659.25, 587.33, 698.46, 880, 698.46, 523.25, 659.25, 783.99, 1046.5, 880, 783.99, 698.46, 587.33];
const bassNotes = [130.81, 130.81, 110, 110, 146.83, 146.83, 98, 98];
function note(frequency, start, length, volume, type = 'triangle') {
  const oscillator = musicContext.createOscillator();
  const gain = musicContext.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + .025);
  gain.gain.exponentialRampToValueAtTime(.0001, start + length);
  oscillator.connect(gain);
  gain.connect(musicMaster);
  oscillator.start(start);
  oscillator.stop(start + length + .03);
}
function scheduleMusic() {
  if (!musicContext || musicContext.state !== 'running') return;
  const now = musicContext.currentTime + .04;
  const step = musicStep % melody.length;
  note(melody[step], now, .24, .11, 'triangle');
  if (step % 2 === 0) note(melody[step] / 2, now, .31, .035, 'sine');
  if (step % 4 === 0) note(bassNotes[Math.floor(step / 2) % bassNotes.length], now, .52, .085, 'sine');
  musicStep += 1;
}
async function startSynthMusic() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) throw new Error('Web Audio is not supported in this browser.');
  if (!musicContext) {
    musicContext = new AudioContextClass();
    musicMaster = musicContext.createGain();
    const limiter = musicContext.createDynamicsCompressor();
    limiter.threshold.value = -15;
    limiter.knee.value = 12;
    limiter.ratio.value = 4;
    limiter.attack.value = .008;
    limiter.release.value = .2;
    musicMaster.gain.value = Math.min(1, Math.max(0, party.musicVolume));
    musicMaster.connect(limiter);
    limiter.connect(musicContext.destination);
  }
  await musicContext.resume();
  musicMaster.gain.setTargetAtTime(Math.min(1, Math.max(0, party.musicVolume)), musicContext.currentTime, .03);
  scheduleMusic();
  musicTimer = window.setInterval(scheduleMusic, 220);
}
function stopSynthMusic() {
  if (musicTimer !== null) window.clearInterval(musicTimer);
  musicTimer = null;
  if (musicMaster && musicContext) musicMaster.gain.setTargetAtTime(.0001, musicContext.currentTime, .04);
}
musicToggle?.addEventListener('click', async () => {
  const playing = musicToggle.getAttribute('aria-pressed') === 'true';
  if (!playing) {
    try {
      if (birthdayAudio) await birthdayAudio.play();
      else await startSynthMusic();
      musicToggle.setAttribute('aria-pressed', 'true');
      musicToggle.setAttribute('aria-label', 'Pause party music');
    } catch {
      musicToggle.setAttribute('aria-label', 'Unable to play music. Check your browser audio settings.');
    }
    return;
  }
  if (birthdayAudio) birthdayAudio.pause();
  else stopSynthMusic();
  musicToggle.setAttribute('aria-pressed', 'false');
  musicToggle.setAttribute('aria-label', 'Play party music');
});
birthdayAudio?.addEventListener('ended', () => {
  musicToggle.setAttribute('aria-pressed', 'false');
  musicToggle.setAttribute('aria-label', 'Play party music');
});
