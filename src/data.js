// Decoy archetypes. Each is an internally coherent person: location, timezone,
// device, language and a cluster of interests that all "make sense" together,
// so the profile a tracker builds is detailed, confident and consistent.

const ddg = q => `https://duckduckgo.com/html/?q=${encodeURIComponent(q)}`;
const bing = q => `https://www.bing.com/search?q=${encodeURIComponent(q)}`;
const wiki = t => `https://en.wikipedia.org/wiki/${t}`;

export const CHROME = '130.0.0.0';

export const ARCHETYPES = [
  {
    id: 'sailor',
    name: 'Margit Halvorsen', age: 61, occupation: 'Retired marine biologist', income: '$60–80k',
    city: 'Bergen, Norway', tz: 'Europe/Oslo', lat: 60.3913, lon: 5.3221, lang: 'nb-NO', langs: ['nb-NO', 'nb', 'en-GB', 'en'],
    device: { os: 'Windows', platform: 'Win32', uaOS: 'Windows NT 10.0; Win64; x64', cores: 8, mem: 8, w: 1920, h: 1080, dpr: 1,
      gpu: ['Google Inc. (NVIDIA)', 'ANGLE (NVIDIA, NVIDIA GeForce GTX 1660 Direct3D11 vs_5_0 ps_5_0, D3D11)'] },
    interests: [
      { topic: 'Sailing & boating', category: 'Recreation', searches: ['best cruising sailboat under 40 feet', 'how to reef a mainsail', 'bergen marina berths'], sites: [wiki('Sailing'), wiki('Sailboat'), 'https://www.yachtingworld.com/'] },
      { topic: 'Marine life & conservation', category: 'Science', searches: ['north atlantic cod stock 2025', 'kelp forest restoration', 'ocean acidification report'], sites: [wiki('Kelp_forest'), wiki('Atlantic_cod'), 'https://oceana.org/'] },
      { topic: 'Birdwatching', category: 'Recreation', searches: ['puffin colonies norway', 'best binoculars for birding', 'seabird identification guide'], sites: [wiki('Atlantic_puffin'), 'https://www.audubon.org/', 'https://www.rspb.org.uk/'] },
      { topic: 'Nordic crime fiction', category: 'Books', searches: ['jo nesbø new novel', 'best scandinavian noir books', 'kindle vs paper books'], sites: [wiki('Nordic_noir'), wiki('Jo_Nesb%C3%B8'), 'https://www.goodreads.com/'] },
      { topic: 'Fishing tackle & gear', category: 'Shopping', searches: ['waterproof sailing jacket sale', 'fishing reel review', 'wool base layer women'], sites: ['https://www.ebay.com/', wiki('Fishing_tackle')] }
    ]
  },
  {
    id: 'gamer-dev',
    name: 'Dario Fontana', age: 27, occupation: 'Indie game developer', income: '$40–60k',
    city: 'Porto, Portugal', tz: 'Europe/Lisbon', lat: 41.1579, lon: -8.6291, lang: 'pt-PT', langs: ['pt-PT', 'pt', 'en-US', 'en'],
    device: { os: 'Linux', platform: 'Linux x86_64', uaOS: 'X11; Linux x86_64', cores: 16, mem: 8, w: 2560, h: 1440, dpr: 1,
      gpu: ['Google Inc. (AMD)', 'ANGLE (AMD, AMD Radeon RX 6700 XT (radeonsi, navi22, LLVM 15.0.7, DRM 3.49), OpenGL 4.6)'] },
    interests: [
      { topic: 'Game development', category: 'Technology', searches: ['godot 4 tilemap tutorial', 'unity vs unreal for 2d', 'shader graph basics'], sites: [wiki('Game_engine'), 'https://godotengine.org/', 'https://itch.io/'] },
      { topic: 'Retro gaming & speedruns', category: 'Gaming', searches: ['super metroid any% record', 'best crt for retro consoles', 'gdq schedule'], sites: [wiki('Speedrunning'), wiki('Super_Metroid'), 'https://www.twitch.tv/'] },
      { topic: 'Mechanical keyboards', category: 'Shopping', searches: ['gateron vs cherry switches', 'best 65 percent keyboard', 'lubing switches guide'], sites: [wiki('Keyboard_technology'), 'https://www.reddit.com/r/MechanicalKeyboards/'] },
      { topic: 'Electronic music production', category: 'Music', searches: ['synthwave vst free', 'ableton vs fl studio', 'modular synth beginner'], sites: [wiki('Synth-pop'), wiki('Ableton_Live'), 'https://bandcamp.com/'] },
      { topic: 'Football (Soccer)', category: 'Sports', searches: ['fc porto fixtures', 'liga portugal table', 'champions league draw'], sites: [wiki('FC_Porto'), 'https://www.bbc.com/sport/football'] }
    ]
  },
  {
    id: 'gardener',
    name: 'Walter Ndlovu', age: 49, occupation: 'High-school chemistry teacher', income: '$50–70k',
    city: 'Leeds, United Kingdom', tz: 'Europe/London', lat: 53.8008, lon: -1.5491, lang: 'en-GB', langs: ['en-GB', 'en'],
    device: { os: 'macOS', platform: 'MacIntel', uaOS: 'Macintosh; Intel Mac OS X 10_15_7', cores: 8, mem: 8, w: 1440, h: 900, dpr: 2,
      gpu: ['Google Inc. (Apple)', 'ANGLE (Apple, ANGLE Metal Renderer: Apple M1, Unspecified Version)'] },
    interests: [
      { topic: 'Allotment gardening', category: 'Home & Garden', searches: ['when to plant broad beans uk', 'raised bed soil mix', 'organic slug control'], sites: [wiki('Allotment_(gardening)'), 'https://www.rhs.org.uk/', 'https://www.gardenersworld.com/'] },
      { topic: 'Cricket', category: 'Sports', searches: ['yorkshire county cricket fixtures', 'ashes highlights', 'cricket bat knocking in'], sites: [wiki('Cricket'), 'https://www.bbc.com/sport/cricket'] },
      { topic: 'Teaching resources & STEM education', category: 'Education', searches: ['gcse chemistry revision resources', 'practical experiments for year 10', 'teacher pension calculator'], sites: [wiki('Periodic_table'), 'https://www.bbc.co.uk/bitesize', 'https://www.rsc.org/'] },
      { topic: 'Home brewing', category: 'Food & Drink', searches: ['all grain brewing kit', 'saison yeast comparison', 'leeds craft beer pubs'], sites: [wiki('Homebrewing'), wiki('Saison')] },
      { topic: 'Used cars & DIY repair', category: 'Automotive', searches: ['best used estate car 2024', 'how to change brake pads', 'mot checklist'], sites: [wiki('Station_wagon'), 'https://www.autotrader.co.uk/'] }
    ]
  },
  {
    id: 'traveler',
    name: 'Priya Venkataraman', age: 34, occupation: 'Freelance travel photographer', income: '$70–90k',
    city: 'Toronto, Canada', tz: 'America/Toronto', lat: 43.6532, lon: -79.3832, lang: 'en-CA', langs: ['en-CA', 'en', 'fr-CA'],
    device: { os: 'macOS', platform: 'MacIntel', uaOS: 'Macintosh; Intel Mac OS X 10_15_7', cores: 10, mem: 8, w: 1728, h: 1117, dpr: 2,
      gpu: ['Google Inc. (Apple)', 'ANGLE (Apple, ANGLE Metal Renderer: Apple M2, Unspecified Version)'] },
    interests: [
      { topic: 'Travel photography', category: 'Photography', searches: ['best lens for landscape travel', 'sony a7 iv vs fuji x-t5', 'golden hour in patagonia'], sites: [wiki('Travel_photography'), 'https://www.dpreview.com/', 'https://500px.com/'] },
      { topic: 'Budget international travel', category: 'Travel', searches: ['cheap flights toronto to lisbon', 'kyoto 10 day itinerary', 'best travel credit card canada'], sites: [wiki('Kyoto'), 'https://www.skyscanner.ca/', 'https://www.lonelyplanet.com/'] },
      { topic: 'Specialty coffee', category: 'Food & Drink', searches: ['v60 brew ratio', 'best espresso grinder under 500', 'third wave cafes toronto'], sites: [wiki('Third_wave_of_coffee'), wiki('Pour-over'), 'https://www.sprudge.com/'] },
      { topic: 'Yoga & wellness', category: 'Health', searches: ['vinyasa flow sequence', 'yoga retreat bali', 'magnesium for sleep'], sites: [wiki('Vinyasa'), 'https://www.yogajournal.com/'] },
      { topic: 'Drones & aerial video', category: 'Technology', searches: ['dji mini 4 pro canada rules', 'drone license transport canada', 'best nd filters drone'], sites: [wiki('Unmanned_aerial_vehicle'), 'https://www.dji.com/'] }
    ]
  }
];

export const SEARCH_ENGINES = [ddg, bing];
