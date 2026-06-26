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
    id: "intro-video",
    title: "Devbhoomi Uttarakhand",
    subtitle: "Introduction Video",
    description: "Welcome to Uttarakhand. Watch this visual journey to experience the breathtaking beauty of the land of the gods.",
    video: "/Uttarakhand%20Intro.mp4",
    accentColor: "#e67e22",
    facts: [
      { label: "Duration", value: "Intro Video" },
      { label: "Experience", value: "Cinematic" },
      { label: "Visuals", value: "High Definition" }
    ],
    details: [
      "A cinematic glimpse into the valleys, rivers, and culture of Devbhoomi.",
      "Controlled and synchronized in real-time by the presenter.",
      "Sit back and enjoy the journey."
    ]
  },
  {
    id: "welcome",
    title: "Uttarakhand Overview",
    subtitle: "Devbhoomi — The Land of the Gods",
    description: "Situated in the northwestern Himalayas, Uttarakhand is a sanctuary of pristine nature and ancient heritage. Its inhabitants (Pahadis) live in harmony with the rhythm of mother nature.",
    image: "/assets/images/welcome_hero.png",
    accentColor: "#e67e22",
    facts: [
      { label: "Capital", value: "Dehradun / Gairsain" },
      { label: "Statehood", value: "9th November 2000" },
      { label: "Forest Cover", value: "Over 45% of total area" }
    ],
    details: [
      "Traditional Pahadi houses are built with stack-stones, mud-cow dung plaster, and sloped slate roofs (Pathali style).",
      "Abundant local pine wood (chir) is the primary timber used to construct ceilings and floors.",
      "Geographically divided into Kumaon and Garhwal divisions, serving as the source region for the Ganges and Yamuna."
    ],
    uceedGK: "🎓 <strong>UCEED GK:</strong> <em>Pathali Architecture</em> is an indigenous ecological design utilizing stack-stone walls, mud plaster, and sloped roofs for natural thermal insulation in mountain climates."
  },
  {
    id: "unesco-sites",
    title: "UNESCO Heritage Sites",
    subtitle: "Nanda Devi & Valley of Flowers",
    description: "The state protects two globally recognized national parks within a massive biosphere reserve, preserving rare endemic flora and endangered high-altitude wildlife.",
    image: "/assets/images/valley_of_flowers.png",
    accentColor: "#2ecc71",
    facts: [
      { label: "Nanda Devi Peak", value: "7,816 m (India's 2nd Highest)" },
      { label: "UNESCO Status", value: "Declared 1988 / 2005" },
      { label: "Flora Diversity", value: "Over 500 species of flowers" }
    ],
    details: [
      "Nanda Devi National Park is surrounded by a natural ring of high mountains, protecting the Snow Leopard, Himalayan Musk Deer, and Tahr.",
      "Valley of Flowers is a high-altitude alpine meadow famous for monsoon wildflowers, popularized by British mountaineer Frank Smythe in 1931.",
      "Both parks serve as critical sites for ecological monitoring in the Western Himalayan Endemic Bird Area (EBA)."
    ],
    uceedGK: "🎓 <strong>UCEED GK:</strong> Both parks form the <em>Nanda Devi Biosphere Reserve</em> and are located in the Chamoli district, serving as key reference areas for Western Himalayan Endemic Bird Area studies."
  },
  {
    id: "char-dham",
    title: "The Sacred Char Dham",
    subtitle: "Kedarnath, Badrinath & Yamunotri",
    description: "The historic spiritual core of the Himalayas. These high-altitude temples have stood for centuries, surviving extreme weather, avalanches, and geological shifting.",
    image: "/assets/images/spiritual_char_dham.png",
    accentColor: "#f1c40f",
    facts: [
      { label: "Kedarnath Alt", value: "3,584 meters" },
      { label: "Badrinath Priest", value: "Rawal (Kerala Namboodiri)" },
      { label: "Yamunotri Source", value: "Champasar Glacier" }
    ],
    details: [
      "Kedarnath's south-facing temple survived the 2013 floods undamaged, protected by a massive boulder (Bhim Shila) that diverted the debris flow.",
      "Yamunotri is dedicated to the Yamuna River; the nearby Surya Kund spring features near-boiling water driven by geothermal activity.",
      "Badrinath Temple lies on the banks of the Alaknanda River between the Nar and Narayana ranges, recognized as one of the 108 Divya Desams."
    ],
    uceedGK: "🎓 <strong>UCEED GK:</strong> Badrinath's chief priest (Rawal) is historically appointed from Kerala (South India), representing ancient cultural linkages established by Adi Shankaracharya in the 8th century."
  },
  {
    id: "ancient-architecture",
    title: "Medieval Katyuri Architecture",
    subtitle: "Stone Temples of early kingdoms",
    description: "Historic stone complexes built from locally dressed stone blocks, showcasing Nagara style temple architecture modified specifically for mountain environments.",
    image: "/assets/images/himalayan_peaks.png",
    accentColor: "#3498db",
    facts: [
      { label: "Jageshwar complex", value: "Over 100 stone temples" },
      { label: "Katarmal Sun", value: "9th Century CE" },
      { label: "Patrons", value: "Katyuri & Chand Dynasties" }
    ],
    details: [
      "Jageshwar is a medieval Shaivite temple cluster situated in dense deodar forests, representing a preserved sacred landscape.",
      "Baijnath group on the Gomti River was part of Kartikeyapura, the historical capital of the Katyuri Dynasty.",
      "Katarmal is one of the few major Sun Temples in India, built on a ridge by King Katarmalla to maximize daily solar exposure."
    ],
    uceedGK: "🎓 <strong>UCEED GK:</strong> Katarmal is a rare North Indian <em>Sun Temple</em>. Jageshwar complex showcases the <em>Nagara style</em> of tall stone spires (shikharas) adapted to high-altitude seismic zones."
  },
  {
    id: "arts-crafts",
    title: "Arts & Loom Traditions",
    subtitle: "Aipan, woodwork & local fibers",
    description: "Indigenous crafts reflect the resourcefulness of mountain communities, utilizing regional flora and minerals for artistic and daily utility.",
    image: "/assets/images/culture_aipan.png",
    accentColor: "#e74c3c",
    facts: [
      { label: "Aipan Base", value: "Geru (Red clay) & Rice paste" },
      { label: "Bamboo Weaver", value: "Flexible Ringaal bamboo" },
      { label: "Traditional Shawl", value: "Reversible Pichora (Kumaon)" }
    ],
    details: [
      "Aipan floor drawings feature geometric, ritualistic mandalas. Peeth art utilizes 12 to 19 dots transversally to draw ceremonial bases.",
      "Bhimal plant fiber is harvested to craft flexible ropes, mats, and baskets; the leaves serve as fodder, and the sap acts as natural shampoo.",
      "Ringaal (dwarf bamboo) is woven into mats, baskets, and bags. High-altitude Bhotia weavers weave Pashmina woolens with Tibetan/Nepali motifs."
    ],
    uceedGK: "🎓 <strong>UCEED GK:</strong> <em>Aipan</em> is a floor painting style using white rice paste on red clay (Geru). <em>Chamba Rumal</em> and Kumaon's <em>Pichora</em> represent major regional embroidery and textile arts."
  },
  {
    id: "festivals",
    title: "Festivals & Intangible Culture",
    subtitle: "Seasonal Cycles & Sacred Dramas",
    description: "Uttarakhand's culture is a living tapestry of community festivals and ancient folk performances that celebrate seasonal shifts and environmental respect.",
    image: "/assets/images/culture_aipan.png",
    accentColor: "#9b59b6",
    facts: [
      { label: "UNESCO List", value: "Ramman masked theater" },
      { label: "Harela Feast", value: "Monsoon sowing / planting" },
      { label: "Phool Dei", value: "Spring threshold decoration" }
    ],
    details: [
      "Harela is celebrated in July; families grow wheat seeds in baskets and plant trees to promote environmental conservation and agricultural fertility.",
      "Ramman is a sacred folk theatre in Saloor-Dungra village (Chamoli) where performers wear wooden masks representing deities and legends.",
      "Phool Dei, in mid-March, features young children placing seasonal wildflowers on neighbors' thresholds to pray for prosperity."
    ],
    uceedGK: "🎓 <strong>UCEED GK:</strong> <em>Ramman</em> (masked theatre) is inscribed on <strong>UNESCO's Representative List of Intangible Cultural Heritage</strong>. Traditional wooden masks are hand-carved by local artisans."
  },
  {
    id: "icons-cinema",
    title: "Icons & Cinema Vistas",
    subtitle: "Pioneers, Heroes & Scenic backdrops",
    description: "Uttarakhand is the birthplace of national security leaders, legendary mountaineers, and ecological champions, providing scenic backdrops for cinema.",
    image: "/assets/images/adventure_auli.png",
    accentColor: "#e67e22",
    facts: [
      { label: "Chipko Leader", value: "Sunderlal Bahuguna" },
      { label: "Defence Icons", value: "NSA Ajit Doval / CDS Rawat" },
      { label: "Everest Pioneer", value: "Bachendri Pal" }
    ],
    details: [
      "Sunderlal Bahuguna spearheaded the world-famous Chipko Movement in 1973, hugging forest trees to prevent commercial logging.",
      "NSA Ajit Doval and first CDS Bipin Rawat are national security pioneers born and raised in the Garhwal Himalayas.",
      "Blockbuster films like 'Kedarnath' (2018), 'Lakshya' (2004), and Kapoor's 'Ram Teri Ganga Maili' (1985) filmed in Harsil, Auli, and Dehradun's FRI."
    ],
    uceedGK: "🎓 <strong>UCEED GK:</strong> The <em>Chipko Movement</em> (1973 environmental crusade) began in Uttarakhand. Mussoorie/FRI Dehradun are major colonial architectural filming locations."
  }
];

// Current active slide index
let currentSlideIndex = 0;

// Video synchronization state
let videoState = {
  playing: false,
  currentTime: 0,
  lastUpdated: Date.now()
};

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Serve the intro video from the root folder
app.get('/Uttarakhand%20Intro.mp4', (req, res) => {
  res.sendFile(path.join(__dirname, 'Uttarakhand Intro.mp4'));
});

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
        
        // Send full slide outline (ids/titles/isVideo) to admin for jump menu, and current index
        const outline = slides.map((s, idx) => ({ id: s.id, title: s.title, index: idx, isVideo: !!s.video }));
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
      // If the current active slide has video, send initial videoState
      if (slides[currentSlideIndex].video) {
        socket.emit('video-state-update', videoState);
      }
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
        
        // Reset videoState for new slide navigation
        videoState = {
          playing: false,
          currentTime: 0,
          lastUpdated: Date.now()
        };

        // Broadcast new slide content to all viewers
        // Since we broadcast slides[currentSlideIndex] directly, viewers NEVER download the rest of the array
        io.emit('slide-update', slides[currentSlideIndex]);
        
        // Broadcast the active index to other admins (if any)
        io.emit('admin-state-update', { currentSlideIndex: currentSlideIndex });
      }
    }
  });

  // Handle video synchronization controls
  socket.on('video-control', (data) => {
    if (!isAdmin) {
      socket.emit('error-msg', { message: 'Unauthorized action' });
      return;
    }

    if (data) {
      videoState.playing = (data.action === 'play');
      videoState.currentTime = data.currentTime;
      videoState.lastUpdated = Date.now();

      // Broadcast update to all other connected clients
      socket.broadcast.emit('video-state-update', videoState);
    }
  });

  // Handle request for current video synchronization state
  socket.on('request-video-sync', () => {
    if (slides[currentSlideIndex].video) {
      socket.emit('video-state-update', videoState);
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
