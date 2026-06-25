// Admin Dashboard JavaScript

let socket = null;
let currentSlideIndex = 0;
let slidesOutline = [];

// DOM Elements
const authOverlay = document.getElementById('auth-overlay');
const authForm = document.getElementById('auth-form');
const authInput = document.getElementById('auth-input');
const authError = document.getElementById('auth-error');
const authBtn = document.getElementById('auth-btn');

const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const selectJump = document.getElementById('select-jump');
const slideListNav = document.getElementById('slide-list-nav');
const logoutBtn = document.getElementById('logout-btn');
const previewIframe = document.getElementById('preview-iframe');

// Auto-login if password is saved in sessionStorage
document.addEventListener('DOMContentLoaded', () => {
  const savedPassword = sessionStorage.getItem('admin_password');
  if (savedPassword) {
    attemptLogin(savedPassword);
  } else {
    authOverlay.classList.remove('hidden');
    authInput.focus();
  }
});

// Login Form Submit
authForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const password = authInput.value.trim();
  if (!password) return;
  
  authBtn.disabled = true;
  authError.textContent = '';
  attemptLogin(password);
});

// Perform socket connection and check password
function attemptLogin(password) {
  // If socket already exists, disconnect it first
  if (socket) {
    socket.disconnect();
  }

  // Connect to Socket.io (enforce websocket transport for hosting compatibility)
  socket = io({ transports: ['websocket'] });

  socket.on('connect', () => {
    // Attempt authentication
    socket.emit('join', { isAdmin: true, password: password });
  });

  socket.on('auth-status', (status) => {
    authBtn.disabled = false;
    if (status.success) {
      // Login successful
      sessionStorage.setItem('admin_password', password);
      authOverlay.classList.add('hidden');
      setupDashboard();
    } else {
      // Login failed
      authError.textContent = status.error || 'Authentication failed';
      authOverlay.classList.remove('hidden');
      sessionStorage.removeItem('admin_password');
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    }
  });

  socket.on('disconnect', () => {
    // If we get disconnected, update UI or try to reconnect
  });
}

// Setup the interactive dashboard once authenticated
function setupDashboard() {
  // Listen for admin init data (outline of slides and active index)
  socket.on('admin-init', (data) => {
    slidesOutline = data.slidesOutline;
    currentSlideIndex = data.currentSlideIndex;
    
    buildNavOutline();
    updateControlsState();
    
    // Set preview iframe source to presentation viewer
    previewIframe.src = '/';
  });

  // Listen for state updates from other admins (if any) or updates
  socket.on('admin-state-update', (data) => {
    currentSlideIndex = data.currentSlideIndex;
    updateControlsState();
  });

  // Set up button event listeners
  btnPrev.onclick = () => changeSlide(currentSlideIndex - 1);
  btnNext.onclick = () => changeSlide(currentSlideIndex + 1);
  
  selectJump.onchange = (e) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      changeSlide(val);
    }
  };

  // Video playback controls integration
  const btnVideoPlay = document.getElementById('btn-video-play');
  const btnVideoPause = document.getElementById('btn-video-pause');
  const videoSeek = document.getElementById('video-seek');

  btnVideoPlay.onclick = () => {
    try {
      const iframeDoc = previewIframe.contentDocument;
      const videoEl = iframeDoc ? iframeDoc.getElementById('slide-video') : null;
      const currentTime = videoEl ? videoEl.currentTime : 0;
      socket.emit('video-control', { action: 'play', currentTime: currentTime });
    } catch (e) {
      socket.emit('video-control', { action: 'play', currentTime: 0 });
    }
  };

  btnVideoPause.onclick = () => {
    try {
      const iframeDoc = previewIframe.contentDocument;
      const videoEl = iframeDoc ? iframeDoc.getElementById('slide-video') : null;
      const currentTime = videoEl ? videoEl.currentTime : 0;
      socket.emit('video-control', { action: 'pause', currentTime: currentTime });
    } catch (e) {
      socket.emit('video-control', { action: 'pause', currentTime: 0 });
    }
  };

  videoSeek.oninput = (e) => {
    try {
      const iframeDoc = previewIframe.contentDocument;
      const videoEl = iframeDoc ? iframeDoc.getElementById('slide-video') : null;
      if (videoEl && !isNaN(videoEl.duration)) {
        const targetTime = (e.target.value / 100) * videoEl.duration;
        socket.emit('video-control', { action: 'seek', currentTime: targetTime });
      }
    } catch (err) {
      console.error(err);
    }
  };

  logoutBtn.onclick = () => {
    sessionStorage.removeItem('admin_password');
    window.location.reload();
  };
}

// Build list and dropdown structures
function buildNavOutline() {
  // 1. Build select dropdown options
  selectJump.innerHTML = '';
  const defaultOption = document.createElement('option');
  defaultOption.text = '-- Choose Section --';
  defaultOption.disabled = true;
  selectJump.appendChild(defaultOption);

  // 2. Build list navigation in sidebar
  slideListNav.innerHTML = '';

  slidesOutline.forEach((slide) => {
    // Dropdown options
    const option = document.createElement('option');
    option.value = slide.index;
    option.text = `${slide.index + 1}. ${slide.title}`;
    selectJump.appendChild(option);

    // Sidebar buttons
    const btn = document.createElement('button');
    btn.className = `nav-item`;
    btn.id = `nav-item-${slide.index}`;
    btn.onclick = () => changeSlide(slide.index);
    
    const num = document.createElement('span');
    num.className = 'nav-item-num';
    num.textContent = slide.index + 1;
    
    const title = document.createElement('span');
    title.textContent = slide.title;
    
    btn.appendChild(num);
    btn.appendChild(title);
    slideListNav.appendChild(btn);
  });
}

// Send slide change command to server
function changeSlide(index) {
  if (index >= 0 && index < slidesOutline.length) {
    socket.emit('change-slide', { index: index });
  }
}

// Update local UI states based on active index
function updateControlsState() {
  // Enable/disable navigation buttons
  btnPrev.disabled = (currentSlideIndex === 0);
  btnNext.disabled = (currentSlideIndex === slidesOutline.length - 1);

  // Update dropdown selection
  selectJump.value = currentSlideIndex;

  // Update active class on list items
  const items = slideListNav.querySelectorAll('.nav-item');
  items.forEach((item) => item.classList.remove('active'));

  const activeItem = document.getElementById(`nav-item-${currentSlideIndex}`);
  if (activeItem) {
    activeItem.classList.add('active');
  }

  // Toggle Video Controls display
  const videoControlsWrapper = document.getElementById('video-controls-wrapper');
  if (videoControlsWrapper) {
    const currentSlide = slidesOutline[currentSlideIndex];
    if (currentSlide && currentSlide.isVideo) {
      videoControlsWrapper.classList.remove('hidden');
      startVideoTelemetry();
    } else {
      videoControlsWrapper.classList.add('hidden');
      stopVideoTelemetry();
    }
  }
}

// Telemetry Polling variables and functions
let telemetryInterval = null;

function startVideoTelemetry() {
  if (telemetryInterval) clearInterval(telemetryInterval);
  
  const videoSeek = document.getElementById('video-seek');
  const videoTime = document.getElementById('video-time');
  const btnVideoPlay = document.getElementById('btn-video-play');
  const btnVideoPause = document.getElementById('btn-video-pause');

  telemetryInterval = setInterval(() => {
    try {
      const iframeWin = previewIframe.contentWindow;
      const iframeDoc = previewIframe.contentDocument || iframeWin.document;
      const videoEl = iframeDoc ? iframeDoc.getElementById('slide-video') : null;

      if (videoEl && !isNaN(videoEl.duration)) {
        // Update seek slider value (percentage)
        const pct = (videoEl.currentTime / videoEl.duration) * 100;
        videoSeek.value = pct;
        
        // Update time text
        videoTime.textContent = `${formatTime(videoEl.currentTime)} / ${formatTime(videoEl.duration)}`;
        
        // Update play/pause button active state
        if (videoEl.paused) {
          btnVideoPlay.classList.remove('active-play');
          btnVideoPause.classList.add('active-pause');
        } else {
          btnVideoPlay.classList.add('active-play');
          btnVideoPause.classList.remove('active-pause');
        }
      }
    } catch (e) {
      console.warn("Telemetry error:", e);
    }
  }, 250);
}

function stopVideoTelemetry() {
  if (telemetryInterval) {
    clearInterval(telemetryInterval);
    telemetryInterval = null;
  }
}

function formatTime(secs) {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
