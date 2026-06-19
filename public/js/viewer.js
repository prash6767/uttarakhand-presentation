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
  let gradientStr = 'linear-gradient(135deg, #090e11, #0c151b)';
  if (slide.id === 'welcome') {
    gradientStr = 'linear-gradient(135deg, #090e11, #1e130c)'; // Orange hue
  } else if (slide.id === 'peaks') {
    gradientStr = 'linear-gradient(135deg, #090e11, #0b1a24)'; // Blue hue
  } else if (slide.id === 'spirituality') {
    gradientStr = 'linear-gradient(135deg, #090e11, #241d06)'; // Gold hue
  } else if (slide.id === 'culture') {
    gradientStr = 'linear-gradient(135deg, #090e11, #180c22)'; // Purple hue
  } else if (slide.id === 'wildlife') {
    gradientStr = 'linear-gradient(135deg, #090e11, #0c1e14)'; // Green hue
  } else if (slide.id === 'adventure') {
    gradientStr = 'linear-gradient(135deg, #090e11, #220e0c)'; // Red hue
  }
  bgAmbient.style.background = gradientStr;

  // Text Elements
  subtitleEl.textContent = slide.subtitle;
  titleEl.textContent = slide.title;
  descriptionEl.textContent = slide.description;

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

  // Slide Image
  // Remove existing image first to reset animations
  const parent = slideImageEl.parentElement;
  parent.innerHTML = '';
  
  const newImg = document.createElement('img');
  newImg.id = 'slide-image';
  newImg.className = 'slide-image';
  newImg.alt = slide.title;
  newImg.src = slide.image;
  
  const overlay = document.createElement('div');
  overlay.className = 'media-overlay';
  
  parent.appendChild(newImg);
  parent.appendChild(overlay);
  
  // Re-assign reference
  slideImageEl = newImg;
}
