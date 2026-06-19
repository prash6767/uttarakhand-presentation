import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'devbhoomi2026';

// Slide presentation data
const slides = [
  {
    id: "welcome",
    title: "Uttarakhand",
    subtitle: "Devbhoomi — The Land of the Gods",
    description: "Nestled in the lap of the majestic Himalayas, Uttarakhand is a sanctuary of pristine nature, ancient spirituality, and vibrant cultural heritage. It is where earth meets heaven.",
    image: "/assets/images/welcome_hero.png",
    accentColor: "#e67e22",
    facts: [
      { label: "Capital", value: "Dehradun (Winter) / Gairsain (Summer)" },
      { label: "Statehood", value: "9th November 2000" },
      { label: "Forest Cover", value: "Over 45% of total area" }
    ],
    details: [
      "Uttarakhand is renowned globally as 'Devbhoomi' due to the concentration of ancient Hindu temples, sacred rivers, and spiritual ashrams.",
      "The region is geographically divided into Kumaon and Garhwal divisions, each boasting distinct dialects, customs, and natural landscapes.",
      "It serves as the birthplace of India's most sacred rivers—the Ganges and the Yamuna—flowing directly from high-altitude glaciers."
    ]
  },
  {
    id: "peaks",
    title: "The Majestic Himalayas",
    subtitle: "Guardians of the North",
    description: "Towering snow-clad peaks define the northern horizon of the state, serving as a haven for mountaineers, explorers, and nature lovers worldwide.",
    image: "/assets/images/himalayan_peaks.png",
    accentColor: "#3498db",
    facts: [
      { label: "Highest Peak", value: "Nanda Devi (7,816 m)" },
      { label: "Glaciers", value: "Gangotri, Yamunotri, Pindari" },
      { label: "Major Ranges", value: "Zanskar, Great Himalayas, Shivaliks" }
    ],
    details: [
      "Nanda Devi is the second highest mountain in India and the highest entirely within the country's borders, revered as a protective goddess.",
      "The state contains some of the world's most scenic high-altitude alpine meadows, locally known as 'Bugyals', which turn into carpeted grasslands in summer.",
      "Glacial meltwaters nourish a massive network of rivers, driving hydel power and sustaining agriculture for hundreds of millions of people downstream."
    ]
  },
  {
    id: "spirituality",
    title: "Sacred Pilgrimages",
    subtitle: "A Path to the Inner Self",
    description: "For centuries, seekers and pilgrims have traversed these rugged trails in search of liberation. Uttarakhand represents the spiritual bedrock of Indian heritage.",
    image: "/assets/images/spiritual_char_dham.png",
    accentColor: "#f1c40f",
    facts: [
      { label: "Char Dham", value: "Yamunotri, Gangotri, Kedarnath, Badrinath" },
      { label: "Yoga Capital", value: "Rishikesh" },
      { label: "Major Gathering", value: "Kumbh Mela (Haridwar)" }
    ],
    details: [
      "The Char Dham pilgrimage represents the ultimate spiritual journey, taking travelers deep into high-altitude alpine valleys.",
      "Kedarnath Temple, dedicated to Lord Shiva, stands as a symbol of resilience, surrounded by towering peaks and deep gorges.",
      "Rishikesh and Haridwar attract millions of global seekers annually, acting as centers for Yoga, meditation, and grand evening Ganga Aarti ceremonies."
    ]
  },
  {
    id: "culture",
    title: "Heritage & Traditions",
    subtitle: "The Soul of Garhwal & Kumaon",
    description: "Uttarakhand's culture is a rich tapestry of simple living, warm hospitality, folklore, unique wood-carving architecture, and colorful festivals.",
    image: "/assets/images/culture_aipan.png",
    accentColor: "#9b59b6",
    facts: [
      { label: "Traditional Art", value: "Aipan (Ritual Folk Art)" },
      { label: "Folk Dances", value: "Choliya, Jhora, Pandav Nritya" },
      { label: "Heritage Crafts", value: "Likhai (Intricate Wood Carving)" }
    ],
    details: [
      "Aipan is a traditional ritualistic floor painting made using red clay (Geru) and white rice paste, representing prosperity and divine welcome.",
      "The vibrant Choliya dance of Kumaon depicts historical martial traditions, performed with swords, shields, and traditional brass instruments.",
      "Traditional Pahadi houses feature 'Likhai'—exquisite hand-carved wooden doors and windows showing deities, floral patterns, and geometric art."
    ]
  },
  {
    id: "wildlife",
    title: "Wildlife & Natural Wonders",
    subtitle: "Sanctuaries of Biodiverse Abundance",
    description: "From dense sub-tropical forests to alpine meadows, the state protects rare flora and fauna, making it an ecological treasure trove.",
    image: "/assets/images/valley_of_flowers.png",
    accentColor: "#2ecc71",
    facts: [
      { label: "Oldest Park", value: "Jim Corbett National Park (1936)" },
      { label: "Valley of Flowers", value: "UNESCO World Heritage Site" },
      { label: "Rare Species", value: "Snow Leopard, Musk Deer, Monal" }
    ],
    details: [
      "Jim Corbett National Park is India's pioneer conservation reserve, famous for its rich population of Bengal Tigers and wild elephants.",
      "The Valley of Flowers is a high-altitude national park that explodes into a natural carpet of endemic alpine blooms during the monsoon months.",
      "The state animal, the Alpine Musk Deer, and the state bird, the colorful Himalayan Monal, represent the unique wildlife adapted to cold heights."
    ]
  },
  {
    id: "adventure",
    title: "Adventure & Sustainable Future",
    subtitle: "Thrill in Harmony with Nature",
    description: "Uttarakhand is India's ultimate adventure destination, transitioning towards green eco-tourism to preserve its fragile ecology for generations.",
    image: "/assets/images/adventure_auli.png",
    accentColor: "#e74c3c",
    facts: [
      { label: "Skiing Hub", value: "Auli (3,000m elevation)" },
      { label: "Rafting", value: "Ganges white water (Grade I-IV)" },
      { label: "Focus", value: "Community Homestays & Eco-Tourism" }
    ],
    details: [
      "Auli is a world-class skiing destination offering panoramic views of major Himalayan peaks, including Nanda Devi.",
      "Rishikesh is a hub for white-water rafting, bungee jumping, and giant swings, drawing adventure lovers from across the globe.",
      "With growing tourism, the state is actively shifting focus to community-run homestays, solar energy, and zero-waste trekking to sustain the local economy responsibly."
    ]
  }
];

// Current active slide index
let currentSlideIndex = 0;

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Admin route serves admin.html
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// JSON API Endpoint (Optional check for debugging or standard fetch)
// Returns ONLY the current slide to prevent peeking at future content.
app.get('/api/current-slide', (req, res) => {
  res.json(slides[currentSlideIndex]);
});

// WebSocket Server Configuration
io.on('connection', (socket) => {
  let isAdmin = false;

  // Handle client registration
  socket.on('join', (data) => {
    if (data && data.isAdmin) {
      if (data.password === ADMIN_PASSWORD) {
        isAdmin = true;
        socket.emit('auth-status', { success: true });
        
        // Send full slide outline (ids/titles) to admin for jump menu, and current index
        const outline = slides.map((s, idx) => ({ id: s.id, title: s.title, index: idx }));
        socket.emit('admin-init', {
          slidesOutline: outline,
          currentSlideIndex: currentSlideIndex
        });
      } else {
        socket.emit('auth-status', { success: false, error: 'Invalid password' });
      }
    } else {
      // General viewer client
      // Send them ONLY the currently active slide content
      socket.emit('slide-update', slides[currentSlideIndex]);
    }
  });

  // Handle admin actions
  socket.on('change-slide', (data) => {
    // SECURITY: strictly verify if this socket connection has authenticated as admin
    if (!isAdmin) {
      socket.emit('error-msg', { message: 'Unauthorized action' });
      return;
    }

    if (data && typeof data.index === 'number') {
      const newIndex = data.index;
      if (newIndex >= 0 && newIndex < slides.length) {
        currentSlideIndex = newIndex;
        
        // Broadcast new slide content to all viewers
        // Since we broadcast slides[currentSlideIndex] directly, viewers NEVER download the rest of the array
        io.emit('slide-update', slides[currentSlideIndex]);
        
        // Broadcast the active index to other admins (if any)
        io.emit('admin-state-update', { currentSlideIndex: currentSlideIndex });
      }
    }
  });

  socket.on('disconnect', () => {
    // Clean up if necessary
  });
});

server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🏔️ Uttarakhand Presentation Server is running!`);
  console.log(`🌐 Port: ${PORT}`);
  console.log(`👥 Viewer Interface: http://localhost:${PORT}`);
  console.log(`🛡️ Admin Console:    http://localhost:${PORT}/admin`);
  console.log(`====================================================`);
});
