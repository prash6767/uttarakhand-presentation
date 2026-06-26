// Viewer Presentation JavaScript

// Connect to Socket.io server (enforce websocket transport for hosting compatibility)
const socket = io({ transports: ['websocket'] });

// DOM Elements
const syncLoader = document.getElementById('sync-loader');
const appContainer = document.getElementById('app');
const slideContainer = document.getElementById('slide-container');
const bgAmbient = document.getElementById('bg-ambient');

const subtitleEl = document.getElementById('slide-subtitle');
const titleEl = document.getElementById('slide-title');
const descriptionEl = document.getElementById('slide-description');
const factsGridEl = document.getElementById('facts-grid');
const detailsListEl = document.getElementById('details-list');
let slideImageEl = document.getElementById('slide-image');

const statusDot = document.getElementById('status-dot');
const statusText = document.getElementById('status-text');

let isInitialLoad = true;
let currentVideoState = null;

// Connection Handlers
socket.on('connect', () => {
  updateStatus('connected');
  // Register as general viewer
  socket.emit('join', { isAdmin: false });
});

socket.on('disconnect', () => {
  updateStatus('disconnected');
});

socket.on('connect_error', () => {
  updateStatus('connecting');
});

// Listen for video state updates from the server
socket.on('video-state-update', (state) => {
  currentVideoState = state;
  syncVideo(state);
});

// Update the visual status dot
function updateStatus(state) {
  statusDot.className = 'status-dot';
  if (state === 'connected') {
    statusText.textContent = 'Sync Live';
  } else if (state === 'disconnected') {
    statusDot.classList.add('disconnected');
    statusText.textContent = 'Disconnected';
  } else if (state === 'connecting') {
    statusDot.classList.add('connecting');
    statusText.textContent = 'Connecting...';
  }
}

// Listen for slide synchronization updates
socket.on('slide-update', (slideData) => {
  if (!slideData) return;

  if (isInitialLoad) {
    // Initial load: render content immediately, then hide loader
    renderSlide(slideData);
    setTimeout(() => {
      syncLoader.classList.add('hidden');
    }, 400);
    isInitialLoad = false;
  } else {
    // Standard transition: animate out, update DOM, animate in
    slideContainer.classList.add('transition-out');
    
    // Wait for the fade-out transition (matches CSS)
    setTimeout(() => {
      renderSlide(slideData);
      slideContainer.classList.remove('transition-out');
    }, 400);
  }
});

// Render the slide data dynamically
function renderSlide(slide) {
  // Update Theme & Colors dynamically
  document.documentElement.style.setProperty('--accent-color', slide.accentColor || '#e67e22');
  
  // Create a glow color based on the slide's primary color
  const hex = slide.accentColor || '#e67e22';
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  document.documentElement.style.setProperty('--accent-glow', `rgba(${r}, ${g}, ${b}, 0.15)`);

  // Update background gradient
  let gradientStr = 'linear-gradient(135deg, #f4eae0, #eae0d0)';
  if (slide.id === 'intro-video' || slide.id === 'overview') {
    gradientStr = 'linear-gradient(135deg, #f4eae0, #edd9cb)'; // Earthen Terracotta/Warm hue
  } else if (slide.id === 'flora-fauna' || slide.id === 'national-parks' || slide.id === 'unesco-sites') {
    gradientStr = 'linear-gradient(135deg, #f4eae0, #d5e6db)'; // Deodar Forest Green hue
  } else if (slide.id === 'events' || slide.id === 'temples') {
    gradientStr = 'linear-gradient(135deg, #f4eae0, #eedeb6)'; // Sacred Gold/Mustard hue
  } else if (slide.id === 'geography' || slide.id === 'crafts' || slide.id === 'meme-drake') {
    gradientStr = 'linear-gradient(135deg, #f4eae0, #d9e3ea)'; // Slate Blue hue
  } else if (slide.id === 'motifs' || slide.id === 'textile-dance-music' || slide.id === 'meme-sweaters') {
    gradientStr = 'linear-gradient(135deg, #f4eae0, #eed9e3)'; // Madder Red/Crimson hue
  } else if (slide.id === 'famous-ppl-movies' || slide.id === 'meme-traffic') {
    gradientStr = 'linear-gradient(135deg, #f4eae0, #eed9cc)'; // Earthen Brown/Bark hue
  }
  bgAmbient.style.background = gradientStr;

  // Text Elements
  subtitleEl.textContent = slide.subtitle;
  titleEl.textContent = slide.title;
  descriptionEl.textContent = slide.description;

  // Toggle layout class for full-screen video
  if (slide.video) {
    slideContainer.classList.add('full-media');
  } else {
    slideContainer.classList.remove('full-media');
  }

  // Facts Grid
  factsGridEl.innerHTML = '';
  if (slide.facts && slide.facts.length > 0) {
    slide.facts.forEach(fact => {
      const card = document.createElement('div');
      card.className = 'fact-card';
      
      const value = document.createElement('div');
      value.className = 'fact-value';
      value.textContent = fact.value;
      
      const label = document.createElement('div');
      label.className = 'fact-label';
      label.textContent = fact.label;
      
      card.appendChild(value);
      card.appendChild(label);
      factsGridEl.appendChild(card);
    });
  }

  // Details List
  detailsListEl.innerHTML = '';
  if (slide.details && slide.details.length > 0) {
    slide.details.forEach(detail => {
      const li = document.createElement('li');
      li.textContent = detail;
      detailsListEl.appendChild(li);
    });
  }

  // Slide Media (Image or Video)
  // Remove existing media first to reset animations/state
  const parent = slideImageEl ? slideImageEl.parentElement : document.querySelector('.media-pane');
  parent.innerHTML = '';
  
  if (slide.video) {
    const videoEl = document.createElement('video');
    videoEl.id = 'slide-video';
    videoEl.className = 'slide-image';
    videoEl.src = slide.video;
    videoEl.playsInline = true;
    videoEl.muted = true; // Muted autoplay succeeds without user interaction
    videoEl.controls = false;
    
    parent.appendChild(videoEl);
    slideImageEl = videoEl;

    // Sync immediately if video state is already active
    if (currentVideoState) {
      syncVideo(currentVideoState);
    }
  } else {
    const newImg = document.createElement('img');
    newImg.id = 'slide-image';
    newImg.className = 'slide-image';
    newImg.alt = slide.title;
    newImg.src = slide.image;
    
    parent.appendChild(newImg);
    slideImageEl = newImg;
  }
  
  const overlay = document.createElement('div');
  overlay.className = 'media-overlay';
  parent.appendChild(overlay);

  // Render UCEED GK Highlight
  const uceedGkEl = document.getElementById('uceed-gk-box');
  if (uceedGkEl) {
    if (slide.uceedGK) {
      uceedGkEl.classList.remove('hidden');
      uceedGkEl.innerHTML = slide.uceedGK;
    } else {
      uceedGkEl.classList.add('hidden');
    }
  }
}

// Synchronize video playback state
function syncVideo(state) {
  const videoEl = document.getElementById('slide-video');
  if (!videoEl) return;

  if (state.playing) {
    let targetTime = state.currentTime;
    if (state.lastUpdated) {
      const drift = (Date.now() - state.lastUpdated) / 1000;
      targetTime += drift;
    }
    
    // Avoid resetting currentTime continuously for minor drifts
    if (Math.abs(videoEl.currentTime - targetTime) > 1.2) {
      videoEl.currentTime = targetTime;
    }
    
    if (videoEl.paused) {
      videoEl.play().catch(err => {
        console.warn("Autoplay play prevented:", err);
      });
    }
  } else {
    if (!videoEl.paused) {
      videoEl.pause();
    }
    if (Math.abs(videoEl.currentTime - state.currentTime) > 0.5) {
      videoEl.currentTime = state.currentTime;
    }
  }
}

// Request sync when page becomes visible or focused
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    socket.emit('request-video-sync');
  }
});

window.addEventListener('focus', () => {
  socket.emit('request-video-sync');
});


