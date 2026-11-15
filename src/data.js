// Decoy archetypes. Each is an internally coherent person: location, timezone,
// device, language and a cluster of interests that all "make sense" together,
// so the profile a tracker builds is detailed, confident and consistent.
//
// Economics used by the Polyphemus data-price model:
//   cc / country  where the persona lives
//   tier          development tier of that country (World Bank income group):
//                 1 = high income, 2 = upper-middle, 3 = lower-middle / low
//   areaAvg       rough average annual income of the city in USD (illustrative, not official statistics)
//   incomeUSD     the persona's own annual income band in USD (income is the same band as display text)

const ddg = q => `https://duckduckgo.com/html/?q=${encodeURIComponent(q)}`;
const bing = q => `https://www.bing.com/search?q=${encodeURIComponent(q)}`;
const wiki = t => `https://en.wikipedia.org/wiki/${t}`;

export const CHROME = '130.0.0.0';

export const ARCHETYPES = [
  {
    id: 'sailor',
    name: 'Margit Halvorsen', age: 61, occupation: 'Retired marine biologist', income: '$60–80k',
    cc: 'NO', country: 'Norway', tier: 1, areaAvg: 58000, incomeUSD: [60000, 80000],
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
    cc: 'PT', country: 'Portugal', tier: 1, areaAvg: 24000, incomeUSD: [40000, 60000],
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
    cc: 'GB', country: 'United Kingdom', tier: 1, areaAvg: 36000, incomeUSD: [50000, 70000],
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
    cc: 'CA', country: 'Canada', tier: 1, areaAvg: 48000, incomeUSD: [70000, 90000],
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
  },

  // ---- Tier 2: upper-middle-income countries ----
  {
    id: 'logistics-br',
    name: 'Rafael Mendes', age: 33, occupation: 'Logistics coordinator', income: '$9–14k',
    cc: 'BR', country: 'Brazil', tier: 2, areaAvg: 11000, incomeUSD: [9000, 14000],
    city: 'São Paulo, Brazil', tz: 'America/Sao_Paulo', lat: -23.5505, lon: -46.6333, lang: 'pt-BR', langs: ['pt-BR', 'pt', 'en-US', 'en'],
    device: { os: 'Windows', platform: 'Win32', uaOS: 'Windows NT 10.0; Win64; x64', cores: 4, mem: 4, w: 1366, h: 768, dpr: 1,
      gpu: ['Google Inc. (Intel)', 'ANGLE (Intel, Intel(R) UHD Graphics 620 Direct3D11 vs_5_0 ps_5_0, D3D11)'] },
    interests: [
      { topic: 'Football (Brasileirão)', category: 'Sports', searches: ['tabela do brasileirão', 'corinthians próximo jogo', 'copa libertadores resultados'], sites: [wiki('Campeonato_Brasileiro_S%C3%A9rie_A'), wiki('S%C3%A3o_Paulo_FC'), 'https://www.bbc.com/sport/football'] },
      { topic: 'Brazilian cooking', category: 'Food & Drink', searches: ['receita de feijoada', 'pão de queijo receita fácil', 'melhores restaurantes em são paulo'], sites: [wiki('Feijoada'), wiki('P%C3%A3o_de_queijo'), wiki('Brazilian_cuisine')] },
      { topic: 'Cycling & urban commuting', category: 'Recreation', searches: ['melhor bicicleta urbana', 'ciclovias de são paulo', 'bike elétrica vale a pena'], sites: [wiki('Bicycle_commuting'), wiki('Cycling')] },
      { topic: 'Personal finance', category: 'Finance', searches: ['como investir em renda fixa', 'cartão de crédito sem anuidade', 'planilha de controle financeiro'], sites: [wiki('Personal_finance'), wiki('Fixed_income')] },
      { topic: 'Brazilian music (MPB & funk)', category: 'Music', searches: ['playlist mpb clássicos', 'shows em são paulo este mês', 'história do funk carioca'], sites: [wiki('Music_of_Brazil'), wiki('Bossa_nova'), 'https://bandcamp.com/'] }
    ]
  },
  {
    id: 'designer-mx',
    name: 'Lucía Guzmán', age: 29, occupation: 'Graphic designer', income: '$10–16k',
    cc: 'MX', country: 'Mexico', tier: 2, areaAvg: 9000, incomeUSD: [10000, 16000],
    city: 'Guadalajara, Mexico', tz: 'America/Mexico_City', lat: 20.6597, lon: -103.3496, lang: 'es-MX', langs: ['es-MX', 'es', 'en-US', 'en'],
    device: { os: 'Windows', platform: 'Win32', uaOS: 'Windows NT 10.0; Win64; x64', cores: 8, mem: 8, w: 1920, h: 1080, dpr: 1,
      gpu: ['Google Inc. (NVIDIA)', 'ANGLE (NVIDIA, NVIDIA GeForce GTX 1650 Direct3D11 vs_5_0 ps_5_0, D3D11)'] },
    interests: [
      { topic: 'Street photography', category: 'Photography', searches: ['mejores cámaras para fotografía callejera', 'fotografía urbana consejos', 'fotografiar mercados en guadalajara'], sites: [wiki('Street_photography'), 'https://500px.com/', 'https://www.dpreview.com/'] },
      { topic: 'Lucha libre & Liga MX', category: 'Sports', searches: ['calendario liga mx', 'chivas próximo partido', 'cartelera de lucha libre aaa'], sites: [wiki('Lucha_libre'), wiki('Liga_MX'), wiki('C.D._Guadalajara')] },
      { topic: 'Specialty coffee', category: 'Food & Drink', searches: ['mejor café de especialidad en guadalajara', 'cómo preparar café v60', 'molino de café manual'], sites: [wiki('Third_wave_of_coffee'), wiki('Pour-over')] },
      { topic: 'Design software & freelancing', category: 'Technology', searches: ['figma vs adobe illustrator', 'cómo cobrar proyectos de diseño freelance', 'tipografías gratis para branding'], sites: [wiki('Graphic_design'), wiki('Figma'), 'https://www.behance.net/'] },
      { topic: 'Mezcal & cocktails', category: 'Food & Drink', searches: ['mezcal vs tequila diferencia', 'recetas de cócteles con mezcal', 'destilerías de tequila en jalisco'], sites: [wiki('Mezcal'), wiki('Tequila')] }
    ]
  },
  {
    id: 'engineer-tr',
    name: 'Emre Çelik', age: 38, occupation: 'Civil engineer', income: '$11–17k',
    cc: 'TR', country: 'Türkiye', tier: 2, areaAvg: 10000, incomeUSD: [11000, 17000],
    city: 'Izmir, Türkiye', tz: 'Europe/Istanbul', lat: 38.4237, lon: 27.1428, lang: 'tr-TR', langs: ['tr-TR', 'tr', 'en-US', 'en'],
    device: { os: 'Windows', platform: 'Win32', uaOS: 'Windows NT 10.0; Win64; x64', cores: 8, mem: 8, w: 1920, h: 1080, dpr: 1,
      gpu: ['Google Inc. (Intel)', 'ANGLE (Intel, Intel(R) UHD Graphics 630 Direct3D11 vs_5_0 ps_5_0, D3D11)'] },
    interests: [
      { topic: 'Basketball', category: 'Sports', searches: ['anadolu efes maç takvimi', 'euroleague puan durumu', 'basketbol ayakkabısı önerileri'], sites: [wiki('Anadolu_Efes_S.K.'), wiki('EuroLeague'), 'https://www.bbc.com/sport/basketball'] },
      { topic: 'Home renovation', category: 'Home & Garden', searches: ['ev tadilatı maliyet hesaplama', 'mutfak dolabı modelleri', 'parke döşeme nasıl yapılır'], sites: [wiki('Home_improvement'), wiki('Interior_design')] },
      { topic: 'Aegean sailing & travel', category: 'Travel', searches: ['ege kıyıları tekne turu', 'izmir çeşme gezi rehberi', 'bodrum yat kiralama'], sites: [wiki('Aegean_Sea'), wiki('Izmir'), wiki('Sailing')] },
      { topic: 'Turkish cuisine & baking', category: 'Food & Drink', searches: ['baklava tarifi', 'izmir boyoz nasıl yapılır', 'kahvaltı tabağı fikirleri'], sites: [wiki('Turkish_cuisine'), wiki('Baklava')] },
      { topic: 'Backgammon & board games', category: 'Gaming', searches: ['tavla taktikleri', 'okey oyunu kuralları', 'en iyi strateji oyunları'], sites: [wiki('Backgammon'), wiki('Okey')] }
    ]
  },

  // ---- Tier 3: lower-middle- and low-income countries ----
  {
    id: 'tester-in',
    name: 'Ananya Sharma', age: 28, occupation: 'QA engineer', income: '$5–9k',
    cc: 'IN', country: 'India', tier: 3, areaAvg: 4000, incomeUSD: [5000, 9000],
    city: 'Pune, India', tz: 'Asia/Kolkata', lat: 18.5204, lon: 73.8567, lang: 'en-IN', langs: ['en-IN', 'en', 'hi'],
    device: { os: 'Windows', platform: 'Win32', uaOS: 'Windows NT 10.0; Win64; x64', cores: 4, mem: 4, w: 1366, h: 768, dpr: 1,
      gpu: ['Google Inc. (Intel)', 'ANGLE (Intel, Intel(R) UHD Graphics 620 Direct3D11 vs_5_0 ps_5_0, D3D11)'] },
    interests: [
      { topic: 'Cricket (IPL)', category: 'Sports', searches: ['ipl points table', 'india vs australia highlights', 'best cricket bat under 3000'], sites: [wiki('Indian_Premier_League'), wiki('Cricket'), 'https://www.bbc.com/sport/cricket'] },
      { topic: 'Competitive programming', category: 'Technology', searches: ['codeforces beginner problems', 'dynamic programming patterns', 'leetcode vs hackerrank'], sites: [wiki('Competitive_programming'), 'https://codeforces.com/', 'https://leetcode.com/'] },
      { topic: 'Budget smartphones', category: 'Shopping', searches: ['best phone under 15000', 'redmi vs realme comparison', 'phone back cover sale'], sites: [wiki('Smartphone'), 'https://www.gsmarena.com/'] },
      { topic: 'Bollywood & streaming', category: 'Entertainment', searches: ['new bollywood movies this week', 'best hindi web series', 'ott release calendar'], sites: [wiki('Bollywood'), wiki('Streaming_media')] },
      { topic: 'Street-food travel', category: 'Travel', searches: ['best street food in pune', 'mumbai to goa train booking', 'weekend trips from pune'], sites: [wiki('Pune'), wiki('Indian_cuisine'), wiki('Street_food')] }
    ]
  },
  {
    id: 'fintech-ng',
    name: 'Tunde Adeyemi', age: 31, occupation: 'Fintech support lead', income: '$3–6k',
    cc: 'NG', country: 'Nigeria', tier: 3, areaAvg: 3000, incomeUSD: [3000, 6000],
    city: 'Lagos, Nigeria', tz: 'Africa/Lagos', lat: 6.5244, lon: 3.3792, lang: 'en-NG', langs: ['en-NG', 'en', 'en-GB'],
    device: { os: 'Windows', platform: 'Win32', uaOS: 'Windows NT 10.0; Win64; x64', cores: 4, mem: 4, w: 1366, h: 768, dpr: 1,
      gpu: ['Google Inc. (Intel)', 'ANGLE (Intel, Intel(R) HD Graphics 520 Direct3D11 vs_5_0 ps_5_0, D3D11)'] },
    interests: [
      { topic: 'Afrobeats', category: 'Music', searches: ['new afrobeats songs this week', 'burna boy tour dates', 'best afrobeats playlist'], sites: [wiki('Afrobeats'), wiki('Burna_Boy'), 'https://bandcamp.com/'] },
      { topic: 'Premier League football', category: 'Sports', searches: ['premier league table', 'arsenal next fixture', 'super eagles squad'], sites: [wiki('Premier_League'), wiki('Nigeria_national_football_team'), 'https://www.bbc.com/sport/football'] },
      { topic: 'Mobile money & fintech', category: 'Finance', searches: ['best savings app in nigeria', 'how to send money abroad from nigeria', 'customer support career tips'], sites: [wiki('Mobile_banking'), wiki('Financial_technology')] },
      { topic: 'Nollywood films', category: 'Entertainment', searches: ['new nollywood movies', 'best nigerian series on streaming', 'nollywood box office'], sites: [wiki('Nollywood'), wiki('Cinema_of_Nigeria')] },
      { topic: 'Fashion & tailoring', category: 'Shopping', searches: ['ankara styles for weddings', 'where to buy fabric in lagos', 'tailoring prices lagos'], sites: [wiki('Ankara_(fabric)'), wiki('Fashion_design')] }
    ]
  },
  {
    id: 'teamlead-ph',
    name: 'Maria Santos', age: 30, occupation: 'Call-center team lead', income: '$4–7k',
    cc: 'PH', country: 'Philippines', tier: 3, areaAvg: 3500, incomeUSD: [4000, 7000],
    city: 'Cebu, Philippines', tz: 'Asia/Manila', lat: 10.3157, lon: 123.8854, lang: 'en-PH', langs: ['en-PH', 'fil', 'en'],
    device: { os: 'Windows', platform: 'Win32', uaOS: 'Windows NT 10.0; Win64; x64', cores: 4, mem: 4, w: 1366, h: 768, dpr: 1,
      gpu: ['Google Inc. (Intel)', 'ANGLE (Intel, Intel(R) UHD Graphics 620 Direct3D11 vs_5_0 ps_5_0, D3D11)'] },
    interests: [
      { topic: 'Basketball (PBA)', category: 'Sports', searches: ['pba standings', 'gilas pilipinas schedule', 'best basketball shoes under 3000'], sites: [wiki('Philippine_Basketball_Association'), wiki('Gilas_Pilipinas')] },
      { topic: 'K-pop & K-dramas', category: 'Entertainment', searches: ['new k-drama this month', 'concert tickets manila', 'best k-pop albums'], sites: [wiki('K-pop'), wiki('Korean_drama')] },
      { topic: 'Mobile games', category: 'Gaming', searches: ['best mobile legends heroes', 'top free mobile games', 'gaming phone under 10000'], sites: [wiki('Mobile_Legends:_Bang_Bang'), wiki('Mobile_game')] },
      { topic: 'Island travel', category: 'Travel', searches: ['cebu to bohol ferry schedule', 'best beaches near cebu', 'cheap flights manila to palawan'], sites: [wiki('Cebu'), wiki('Bohol'), wiki('Palawan')] },
      { topic: 'Online shopping deals', category: 'Shopping', searches: ['11.11 sale tips', 'voucher codes today', 'best budget laptop philippines'], sites: [wiki('Online_shopping'), wiki('E-commerce')] }
    ]
  }
];

export const SEARCH_ENGINES = [ddg, bing];
