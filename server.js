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
    subtitle: "Cinematic Introduction",
    description: "Welcome to Uttarakhand. Watch this visual journey to experience the breathtaking beauty of the land of the gods.",
    video: "/Uttarakhand%20Intro.mp4",
    accentColor: "#b23b2b",
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
    id: "overview",
    title: "Uttarakhand Overview",
    subtitle: "Devbhoomi — The Land of the Gods",
    description: "Uttarakhand is a sanctuary of pristine nature and ancient heritage. Its inhabitants, collectively addressed as Pahadi, live in harmony with the grandeur and integrity of mother nature.",
    image: "/assets/images/welcome_hero.png",
    accentColor: "#b23b2b",
    facts: [
      { label: "Capital", value: "Dehradun / Gairsain" },
      { label: "Statehood", value: "9th November 2000" },
      { label: "Forest Cover", value: "Over 65% of total area" }
    ],
    details: [
      "Geographically divided into Kumaon and Garhwal divisions, serving as major cultural regions.",
      "Spirituality, mysticism, and pristine nature make it one of India's major pilgrimage centers.",
      "Lifestyles are consciously designed to complement the natural rhythm instead of disturbing it."
    ],
    uceedGK: "🎓 <strong>UCEED GK:</strong> The state of Uttarakhand is characterized by its distinct mountain communities (Kumaoni and Garhwali) who emphasize ecological preservation and forest conservation."
  },
  {
    id: "geography",
    title: "Himalayan Geography",
    subtitle: "Glaciers, Peaks & Boundaries",
    description: "Situated in the northwestern Himalayas, Uttarakhand borders Nepal to the east, Himachal Pradesh to the northwest, and Tibet to the north, creating a strategic frontier region.",
    image: "/assets/images/himalayan_peaks.png",
    accentColor: "#465a65",
    facts: [
      { label: "Glaciers", value: "More than 900" },
      { label: "Highest Peak", value: "Nanda Devi (7,816m)" },
      { label: "Last Village", value: "Mana (Border Frontier)" }
    ],
    details: [
      "Hosts the second highest mountain peak in India, Nanda Devi, which is revered globally.",
      "Serves as the vital source region for the Ganga and Yamuna river systems from massive glacial fields.",
      "Mana village stands as India's last boundary settlement, connecting historical trade routes to Tibet."
    ],
    uceedGK: "🎓 <strong>UCEED GK:</strong> Uttarakhand contains more than 900 glaciers, feeding the major rivers of northern India. Mana is historically recognized as the final settlement on the Indo-Tibetan border."
  },
  {
    id: "flora-fauna",
    title: "Himalayan Biodiversity",
    subtitle: "Flora & Fauna",
    description: "Uttarakhand boasts a highly diverse ecosystem that shifts dramatically with its varying altitudes, creating distinct tropical, temperate, and sub-alpine zones.",
    image: "/assets/images/valley_of_flowers.png",
    accentColor: "#2c5e3b",
    facts: [
      { label: "State Bird", value: "Himalayan Monal" },
      { label: "Rare Bloom", value: "Brahma Kamal" },
      { label: "Elev. Range", value: "Up to 5,000m+" }
    ],
    details: [
      "Tropical zones house Sal, Teak, and Bamboo, while temperate elevations stand lush with Oak, Pine, Deodar, and Rhododendron.",
      "Alpine zones harbor Birch, Fir, Juniper, the sacred Brahma Kamal, and the rare Himalayan Blue Poppy.",
      "Teems with diverse predators (Bengal Tiger, Snow Leopard) and herbivores (Himalayan Musk Deer, Tahr, Blue Sheep)."
    ],
    uceedGK: "🎓 <strong>UCEED GK:</strong> The state bird of Uttarakhand is the vibrant <em>Himalayan Monal</em>. High-altitude meadows house the rare <em>Brahma Kamal</em> and the elusive <em>Himalayan Blue Poppy</em>."
  },
  {
    id: "national-parks",
    title: "Wildlife Sanctuaries",
    subtitle: "Jim Corbett & Biosphere Reserves",
    description: "Uttarakhand is a global focal point for wildlife conservation, hosting India's oldest national park and massive high-altitude sanctuaries that protect endangered species.",
    image: "/assets/images/valley_of_flowers.png",
    accentColor: "#2c5e3b",
    facts: [
      { label: "Corbett", value: "India's Oldest Park" },
      { label: "Snow Leopard", value: "Gangotri & Nanda Devi" },
      { label: "Initiatives", value: "Project Tiger & Chipko" }
    ],
    details: [
      "Jim Corbett National Park was established as India's first national park to protect the Bengal Tiger.",
      "Gangotri National Park holds one of the largest remaining populations of vulnerable Snow Leopards.",
      "Formed as key reference ecosystems for long-term ecological monitoring in the Western Himalayas."
    ],
    uceedGK: "🎓 <strong>UCEED GK:</strong> <em>Jim Corbett National Park</em> (established 1936 as Hailey National Park) is India's oldest park. It launched the first <strong>Project Tiger</strong> initiative in 1973."
  },
  {
    id: "motifs",
    title: "Common Designs & Motifs",
    subtitle: "Aipan & Textile Art Symbols",
    description: "Traditional motifs in Uttarakhand are deeply ritualistic, drawn freehand to invoke divine blessings, good fortune, and positive energy during festivals and weddings.",
    image: "/assets/images/culture_aipan.png",
    accentColor: "#b23b2b",
    facts: [
      { label: "Paint Medium", value: "Rice Paste & Geru Red" },
      { label: "Sacred Symbols", value: "Swastika & Shiv Peeth" },
      { label: "Technique", value: "Freehand (No stencils)" }
    ],
    details: [
      "Aipan floor art uses white Biswar (rice paste) on a natural red clay base (Geru) symbolizing purity and energy.",
      "Lotus motifs represent beauty and enlightenment, while Saraswati Chowki honors the goddess of arts.",
      "Pichora textile shawls feature iconic symbols depicting local flora, fauna, and regional cultural icons."
    ],
    uceedGK: "🎓 <strong>UCEED GK:</strong> <em>Aipan</em> floor drawings feature geometrical and symbolic patterns passed down freehand from mothers to daughters. <em>Pichora</em> is Kumaon's traditional wedding odhani."
  },
  {
    id: "crafts",
    title: "Crafts & Architecture",
    subtitle: "Pahadi Wood, Bamboo & Copper",
    description: "Indigenous crafts reflect the resourcefulness of mountain communities, utilizing local wood, metals, clay, and bamboo for daily utility and structural engineering.",
    image: "/assets/images/culture_aipan.png",
    accentColor: "#465a65",
    facts: [
      { label: "Bamboo", value: "Flexible Ringaal dwarf" },
      { label: "Metalwork", value: "Tamta Copper Artisans" },
      { label: "Clay", value: "Terracotta & Glazed" }
    ],
    details: [
      "Pathali architecture uses stacked stone, deodar wood, and mud-cow dung plaster for natural thermal insulation.",
      "Ringaal bamboo is woven into biodegradable storage baskets, agricultural mats, and fashionable handbags.",
      "Copperware craft is hand-hammered and engraved by the traditional Tamta artisan community for household and temple utensils."
    ],
    uceedGK: "🎓 <strong>UCEED GK:</strong> <em>Pathali architecture</em> is an ancient earthquake-resistant, sloped-roof stone housing style. <em>Tamta</em> copperware and <em>Ringaal</em> bamboo represent key handicraft skills."
  },
  {
    id: "textile-dance-music",
    title: "Textile, Dance & Music",
    subtitle: "Handlooms, Sword Dances & Jagars",
    description: "Uttarakhand's performing arts and handloom traditions celebrate community unity, folklore narratives, and spiritual connections with ancestral forces.",
    image: "/assets/images/culture_aipan.png",
    accentColor: "#b23b2b",
    facts: [
      { label: "Sword Dance", value: "Chholiya Rajput Martial" },
      { label: "Ritual Music", value: "Jagar Divine Invocation" },
      { label: "Wool Weaver", value: "Bhotia Himalayan Community" }
    ],
    details: [
      "The Bhotia weavers dominate wool handlooms, weaving Pashmina shawls and heavy Thulma blankets.",
      "Chholiya is a Kumaoni sword dance performed at weddings, accompanied by traditional Dhol and Damau drums.",
      "Jagar music is a sacred singing ritual performed to invoke local deities and ancestral spirits."
    ],
    uceedGK: "🎓 <strong>UCEED GK:</strong> The traditional Kumaoni <em>Chholiya</em> sword dance originated as a martial performance. <em>Jagar</em> is a unique musical form dedicated to deity invocation."
  },
  {
    id: "events",
    title: "Festivals & Seasonal Events",
    subtitle: "Monsoon Seeds & Spring Wildflowers",
    description: "Community festivals celebrate agricultural cycles, seasonal shifts, family bonds, and environmental conservation in the high Himalayan villages.",
    image: "/assets/images/culture_aipan.png",
    accentColor: "#6b3459",
    facts: [
      { label: "Monsoon Harela", value: "Monsoon Sowing & Trees" },
      { label: "Spring Phool Dei", value: "Floral Thresholds" },
      { label: "Winter Ghughutia", value: "January Makar Sankranti" }
    ],
    details: [
      "Harela is celebrated in July by sowing seeds in baskets 9 days prior, culminating in environmental tree plantings.",
      "Phool Dei features children placing spring wildflowers on neighbors' doorsteps for blessings and receiving sweets.",
      "Bhitauli is a Chaitra custom where siblings visit married sisters with gifts, maintaining family ties across isolated valleys."
    ],
    uceedGK: "🎓 <strong>UCEED GK:</strong> <em>Harela</em> is an eco-centric festival celebrating the monsoon onset. <em>Phool Dei</em> celebrates spring by placing fresh mountain blooms on thresholds."
  },
  {
    id: "temples",
    title: "Sacred Temples",
    subtitle: "Kedarnath, Badrinath & Yamunotri",
    description: "The historic spiritual core of the Himalayas. These high-altitude temples have stood for centuries, exhibiting advanced stone engineering adapted specifically to extreme mountain hazards.",
    image: "/assets/images/spiritual_char_dham.png",
    accentColor: "#d4af37",
    facts: [
      { label: "Kedarnath stone", value: "Interlocking Grey Granite" },
      { label: "Badrinath Priest", value: "Namboodiri Rawal (Kerala)" },
      { label: "Yamunotri hot", value: "Surya Kund Geothermal" }
    ],
    details: [
      "Kedarnath, built with massive granite stones, faces south (unusual) and survived the 2013 floods protected by a massive boulder.",
      "Badrinath lies between the Nar and Narayana ranges; its chief priest historically comes from Kerala to link North and South India.",
      "Yamunotri, westernmost of Char Dham, features boiling-point geothermal springs (Surya Kund) adjacent to cold snowfields."
    ],
    uceedGK: "🎓 <strong>UCEED GK:</strong> Badrinath's chief priest (Rawal) is a Namboodiri Brahmin from Kerala, a custom established by Adi Shankaracharya. Kedarnath's interlocking stone structure is seismically resilient."
  },
  {
    id: "unesco-sites",
    title: "UNESCO Heritage Sites",
    subtitle: "Biosphere Sanctuaries & Masked Dramas",
    description: "Uttarakhand hosts three UNESCO-recognized heritage items, highlighting the state's global ecological importance and preserved performing art traditions.",
    image: "/assets/images/valley_of_flowers.png",
    accentColor: "#2c5e3b",
    facts: [
      { label: "Nanda Devi", value: "UNESCO Site 1988" },
      { label: "Valley of Flowers", value: "UNESCO Site 2005" },
      { label: "Ramman Theater", value: "Intangible Heritage 2009" }
    ],
    details: [
      "Nanda Devi National Park is surrounded by a ring of peaks, forming a sanctuary with limited human access.",
      "Valley of Flowers contains over 500 wildflower species, popularized by British mountaineer Frank Smythe in 1931.",
      "Ramman is a sacred theatrical performance in Chamoli district where villagers wear hand-carved wooden masks."
    ],
    uceedGK: "🎓 <strong>UCEED GK:</strong> <em>Ramman</em> is inscribed on UNESCO's Intangible Cultural Heritage List. Both parks together constitute the <em>Nanda Devi Biosphere Reserve</em>."
  },
  {
    id: "famous-ppl-movies",
    title: "Icons & Cinema Vistas",
    subtitle: "Eco-Pioneers, Heroes & Scenic Backdrops",
    description: "Uttarakhand has birthed historic national security leaders, legendary poets, and environmental champions, serving as an iconic backdrop for Indian cinema.",
    image: "/assets/images/adventure_auli.png",
    accentColor: "#a05a2c",
    facts: [
      { label: "Chipko Leaders", value: "Bahuguna & Gaura Devi" },
      { label: "Defense Icons", value: "NSA Doval & CDS Rawat" },
      { label: "Classic Movie", value: "Kedarnath (2018)" }
    ],
    details: [
      "Gaura Devi and Sunderlal Bahuguna spearheaded the world-famous Chipko Movement in 1973 by hugging trees to prevent commercial logging.",
      "National defense pioneers Ajit Doval (NSA) and first CDS Bipin Rawat were born in Garhwal.",
      "Filmed in visual gems like Dehradun's FRI, Auli meadows, and Tehri Lake: 'Kedarnath' (2018) and 'Lakshya' (2004)."
    ],
    uceedGK: "🎓 <strong>UCEED GK:</strong> The <em>Chipko Movement</em> (1973) is a historic environmental crusade. Forest Research Institute (FRI) Dehradun is a major architectural filming hub."
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
