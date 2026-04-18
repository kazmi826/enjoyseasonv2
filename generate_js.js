// ============================================================
// EnjoysSeason V2 — Ultimate Generator
// Full Content + Strong Internal Linking + Proper Schema
// ============================================================

const fs = require('fs');

const actors = JSON.parse(fs.readFileSync('./data/actors.json', 'utf8'));
const movies = JSON.parse(fs.readFileSync('./data/movies.json', 'utf8'));
const dramas = JSON.parse(fs.readFileSync('./data/dramas.json', 'utf8'));

let totalPages = 0;
const allUrls = [];

const makeDir = (d) => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); };
const getAge = (born) => born ? new Date().getFullYear() - new Date(born).getFullYear() : 0;
const getYear = () => new Date().getFullYear();
const slugToTitle = (slug) => (slug||'').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
const toArray = (val) => Array.isArray(val) ? val : (val ? [val] : []);

// Language mapping
const languageMap = {
  'Pakistani':'Urdu','Indian':'Hindi','Turkish':'Turkish','South Korean':'Korean',
  'Korean':'Korean','Japanese':'Japanese','Chinese':'Mandarin','French':'French',
  'Spanish':'Spanish','Italian':'Italian','German':'German','Arabic':'Arabic',
  'Egyptian':'Arabic','Saudi':'Arabic','Lebanese':'Arabic','Brazilian':'Portuguese',
  'Mexican':'Spanish','Iranian':'Persian','Russian':'Russian','American':'English',
  'British':'English','Canadian':'English','Australian':'English','Nigerian':'English',
  'Indonesian':'Indonesian','Thai':'Thai','Vietnamese':'Vietnamese','Filipino':'Filipino',
  'Greek':'Greek','Polish':'Polish','Swedish':'Swedish','Norwegian':'Norwegian',
  'Danish':'Danish','Dutch':'Dutch','Portuguese':'Portuguese','Romanian':'Romanian',
  'Ukrainian':'Ukrainian','Israeli':'Hebrew','Bangladeshi':'Bengali'
};

const getLanguage = (nationality) => {
  if (!nationality) return 'English';
  for (const [key, lang] of Object.entries(languageMap)) {
    if (nationality.toLowerCase().includes(key.toLowerCase())) return lang;
  }
  return 'English';
};

// Clean profession
const cleanProfession = (profession) => {
  return toArray(profession)
    .map(p => (p||'').replace(/node\s+\S+/gi,'').replace(/\.js\S*/gi,'').trim())
    .filter(p => p && p.length > 0 && p.length < 25 && !p.includes('/') && !p.includes('\\'))
    .map(p => p.charAt(0).toUpperCase() + p.slice(1));
};

// Get actors from same country for internal linking
const getActorsByCountry = (country, excludeId, limit=8) =>
  actors.filter(a => a.country === country && a.id !== excludeId && a.image).slice(0, limit);

// Get actors with same genre for cross-linking
const getActorsByGenre = (genre, excludeId, country, limit=6) =>
  actors.filter(a => 
    a.id !== excludeId && 
    a.country !== country && 
    toArray(a.genre).some(g => toArray(genre).includes(g)) &&
    a.image
  ).slice(0, limit);

const getImageUrl = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=400&background=0f172a&color=f59e0b&bold=true&format=svg`;

// ============================================================
// HEADER
// ============================================================
const megaHeader = `
<header class="site-header">
  <div class="header-inner">
    <a href="/" class="logo">
      <span class="logo-icon">🎬</span>
      <span class="logo-text">EnjoysSeason</span>
    </a>
    <nav class="main-nav">
      <div class="nav-item dropdown">
        <button class="nav-btn">🌍 Countries <span class="arrow">▾</span></button>
        <div class="dropdown-menu mega-menu">
          <div class="mega-col">
            <h4>🌏 Asia</h4>
            <a href="/country/pakistan">🇵🇰 Pakistan</a>
            <a href="/country/india">🇮🇳 India</a>
            <a href="/country/turkey">🇹🇷 Turkey</a>
            <a href="/country/south-korea">🇰🇷 South Korea</a>
            <a href="/country/japan">🇯🇵 Japan</a>
            <a href="/country/china">🇨🇳 China</a>
            <a href="/country/bangladesh">🇧🇩 Bangladesh</a>
            <a href="/country/iran">🇮🇷 Iran</a>
          </div>
          <div class="mega-col">
            <h4>🌎 West</h4>
            <a href="/country/usa">🇺🇸 USA</a>
            <a href="/country/uk">🇬🇧 UK</a>
            <a href="/country/canada">🇨🇦 Canada</a>
            <a href="/country/australia">🇦🇺 Australia</a>
            <a href="/country/france">🇫🇷 France</a>
            <a href="/country/germany">🇩🇪 Germany</a>
            <a href="/country/spain">🇪🇸 Spain</a>
            <a href="/country/italy">🇮🇹 Italy</a>
          </div>
          <div class="mega-col">
            <h4>🌍 Middle East & Africa</h4>
            <a href="/country/saudi-arabia">🇸🇦 Saudi Arabia</a>
            <a href="/country/egypt">🇪🇬 Egypt</a>
            <a href="/country/uae">🇦🇪 UAE</a>
            <a href="/country/nigeria">🇳🇬 Nigeria</a>
            <a href="/country/south-africa">🇿🇦 South Africa</a>
            <a href="/country/morocco">🇲🇦 Morocco</a>
          </div>
          <div class="mega-col">
            <h4>🌎 Latin America</h4>
            <a href="/country/brazil">🇧🇷 Brazil</a>
            <a href="/country/mexico">🇲🇽 Mexico</a>
            <a href="/country/argentina">🇦🇷 Argentina</a>
            <a href="/country/colombia">🇨🇴 Colombia</a>
            <a href="/country/all">🌐 All 200 Countries →</a>
          </div>
        </div>
      </div>
      <div class="nav-item dropdown">
        <button class="nav-btn">🎭 Categories <span class="arrow">▾</span></button>
        <div class="dropdown-menu">
          <div class="drop-col">
            <h4>👤 People</h4>
            <a href="/category/actors">🎭 Actors</a>
            <a href="/category/actresses">👩 Actresses</a>
            <a href="/category/directors">🎬 Directors</a>
            <a href="/category/singers">🎵 Singers</a>
          </div>
          <div class="drop-col">
            <h4>🎬 Content</h4>
            <a href="/category/movies">🎬 Movies</a>
            <a href="/category/dramas">📺 Dramas</a>
            <a href="/category/web-series">💻 Web Series</a>
            <a href="/category/anime">🎌 Anime</a>
          </div>
        </div>
      </div>
      <div class="nav-search">
        <input type="text" placeholder="🔍 Search actors, movies, dramas..." class="search-input" id="searchInput">
        <button class="search-btn">Search</button>
      </div>
    </nav>
    <button class="mobile-menu-btn" onclick="toggleMobile()">☰</button>
  </div>
  <div class="mobile-nav" id="mobileNav">
    <a href="/country/pakistan">🇵🇰 Pakistan</a>
    <a href="/country/india">🇮🇳 India</a>
    <a href="/country/usa">🇺🇸 USA</a>
    <a href="/country/turkey">🇹🇷 Turkey</a>
    <a href="/category/actors">🎭 Actors</a>
    <a href="/category/movies">🎬 Movies</a>
    <a href="/category/dramas">📺 Dramas</a>
  </div>
</header>`;

// ============================================================
// FOOTER
// ============================================================
const siteFooter = `
<footer class="site-footer">
  <div class="footer-inner">
    <div class="footer-grid">
      <div class="footer-col">
        <h3>🎬 EnjoysSeason</h3>
        <p>World's most complete entertainment database. Actors, movies, dramas, web series from 200+ countries with accurate biographies, filmographies and more.</p>
      </div>
      <div class="footer-col">
        <h4>🌍 Popular Countries</h4>
        <a href="/country/pakistan">Pakistan Actors</a>
        <a href="/country/india">Indian Actors</a>
        <a href="/country/usa">American Actors</a>
        <a href="/country/turkey">Turkish Actors</a>
        <a href="/country/south-korea">Korean Actors</a>
        <a href="/country/japan">Japanese Actors</a>
      </div>
      <div class="footer-col">
        <h4>🎭 Browse By</h4>
        <a href="/category/actors">All Actors</a>
        <a href="/category/movies">All Movies</a>
        <a href="/category/dramas">All Dramas</a>
        <a href="/category/web-series">Web Series</a>
        <a href="/category/anime">Anime</a>
        <a href="/industry/bollywood">Bollywood</a>
      </div>
      <div class="footer-col">
        <h4>📋 Pages</h4>
        <a href="/about">About Us</a>
        <a href="/contact">Contact</a>
        <a href="/privacy-policy">Privacy Policy</a>
        <a href="/disclaimer">Disclaimer</a>
        <a href="/sitemap.xml">Sitemap</a>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© ${getYear()} EnjoysSeason — World Actors, Movies, Dramas & Web Series Database | Data sourced from TMDB</p>
    </div>
  </div>
</footer>`;

// ============================================================
// CSS
// ============================================================
const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Source+Sans+3:wght@300;400;600&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
:root{--bg:#0a0f1e;--bg2:#0f172a;--card:#1e293b;--card2:#162032;--gold:#f59e0b;--gold2:#d97706;--red:#ef4444;--green:#22c55e;--blue:#3b82f6;--text:#f1f5f9;--muted:#94a3b8;--border:#1e3a5f;--header:#080d1a;}
body{background:var(--bg);color:var(--text);font-family:'Source Sans 3',sans-serif;line-height:1.8;font-size:16px;}
a{color:var(--gold);text-decoration:none}a:hover{text-decoration:underline}
.site-header{background:var(--header);border-bottom:2px solid var(--gold);position:sticky;top:0;z-index:1000;box-shadow:0 4px 20px rgba(0,0,0,.5);}
.header-inner{max-width:1400px;margin:0 auto;padding:.8rem 1.5rem;display:flex;align-items:center;gap:1.5rem;}
.logo{display:flex;align-items:center;gap:.5rem;text-decoration:none;flex-shrink:0;}
.logo-icon{font-size:1.6rem}.logo-text{font-family:'Playfair Display',serif;font-size:1.4rem;color:var(--gold);font-weight:900;letter-spacing:-.5px;}
.main-nav{display:flex;align-items:center;gap:.3rem;flex:1;}
.nav-item{position:relative}.nav-btn{background:transparent;border:1px solid transparent;color:var(--text);padding:.45rem .9rem;border-radius:8px;cursor:pointer;font-size:.88rem;font-family:'Source Sans 3',sans-serif;transition:all .2s;white-space:nowrap;}
.nav-btn:hover{border-color:var(--gold);color:var(--gold);background:rgba(245,158,11,.08);}
.arrow{font-size:.65rem;margin-left:.2rem}
.dropdown-menu{display:none;position:absolute;top:calc(100% + 8px);left:0;background:var(--card);border:1px solid var(--border);border-radius:12px;padding:1.2rem;min-width:220px;box-shadow:0 20px 60px rgba(0,0,0,.6);z-index:999;animation:fadeDown .2s ease;}
.mega-menu{display:none;left:-100px;min-width:700px;flex-direction:row;gap:1.5rem;}
.nav-item:hover .dropdown-menu{display:flex;flex-direction:column}.nav-item:hover .mega-menu{display:flex;flex-direction:row}
.mega-col,.drop-col{flex:1;min-width:140px}
.dropdown-menu h4{color:var(--gold);font-size:.78rem;text-transform:uppercase;letter-spacing:1px;margin-bottom:.6rem;padding-bottom:.4rem;border-bottom:1px solid var(--border);}
.dropdown-menu a{display:block;color:var(--muted);padding:.25rem 0;font-size:.85rem;transition:color .15s;}
.dropdown-menu a:hover{color:var(--gold);text-decoration:none}
@keyframes fadeDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
.nav-search{display:flex;gap:.4rem;margin-left:auto}
.search-input{background:var(--card);border:1px solid var(--border);color:var(--text);padding:.4rem .9rem;border-radius:8px;font-size:.85rem;width:260px;font-family:'Source Sans 3',sans-serif;transition:border-color .2s;}
.search-input:focus{outline:none;border-color:var(--gold)}.search-input::placeholder{color:var(--muted)}
.search-btn{background:var(--gold);color:#000;border:none;padding:.4rem .9rem;border-radius:8px;cursor:pointer;font-weight:600;font-size:.85rem;}
.search-btn:hover{background:var(--gold2)}
.mobile-menu-btn{display:none;background:transparent;border:1px solid var(--border);color:var(--text);padding:.4rem .7rem;border-radius:6px;cursor:pointer;font-size:1.1rem;margin-left:auto;}
.mobile-nav{display:none;flex-direction:column;padding:1rem 1.5rem;border-top:1px solid var(--border);gap:.3rem;}
.mobile-nav a{color:var(--muted);padding:.4rem 0;font-size:.9rem;border-bottom:1px solid rgba(255,255,255,.05);}
.breadcrumb{background:var(--bg2);padding:.65rem 1.5rem;font-size:.82rem;border-bottom:1px solid var(--border);}
.breadcrumb-inner{max-width:1200px;margin:0 auto}.breadcrumb a{color:var(--gold)}.breadcrumb .sep{color:var(--muted);margin:0 .4rem}
.container{max-width:1200px;margin:0 auto;padding:2rem 1.5rem}
.actor-hero{display:grid;grid-template-columns:300px 1fr;gap:2.5rem;margin-bottom:3rem;align-items:start;}
.actor-image-wrap{position:relative}.actor-image{width:100%;border-radius:16px;border:3px solid var(--gold);aspect-ratio:3/4;object-fit:cover;background:var(--card);display:block;}
.image-badge{position:absolute;top:12px;right:12px;background:var(--gold);color:#000;padding:.2rem .6rem;border-radius:20px;font-size:.75rem;font-weight:700;}
.actor-name{font-family:'Playfair Display',serif;font-size:2.5rem;color:var(--gold);line-height:1.2;margin-bottom:.3rem;}
.actor-subtitle{color:var(--muted);font-size:1rem;margin-bottom:1rem}
.badges{display:flex;flex-wrap:wrap;gap:.5rem;margin:1rem 0}
.badge{background:var(--card2);border:1px solid var(--border);padding:.3rem .8rem;border-radius:20px;font-size:.8rem;color:var(--muted);}
.badge strong{color:var(--text)}.badge-gold{border-color:var(--gold);color:var(--gold)}.badge-green{border-color:var(--green);color:var(--green)}
.bio-box{background:var(--card2);border-left:4px solid var(--gold);border-radius:0 12px 12px 0;padding:1.2rem 1.4rem;margin:1.2rem 0;font-size:.97rem;line-height:1.95;}
.bio-box strong{color:var(--gold);display:block;margin-bottom:.4rem}
.ext-links{display:flex;gap:.7rem;flex-wrap:wrap;margin-top:1rem}
.ext-link{border:1px solid var(--gold);color:var(--gold);padding:.3rem .9rem;border-radius:8px;font-size:.82rem;transition:all .2s;}
.ext-link:hover{background:var(--gold);color:#000;text-decoration:none}
.section{margin:3rem 0}
.section-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.3rem;padding-bottom:.7rem;border-bottom:2px solid var(--border);}
.section-title{font-family:'Playfair Display',serif;font-size:1.4rem;color:var(--gold);}
.section-count{background:var(--card);border:1px solid var(--border);color:var(--muted);padding:.2rem .7rem;border-radius:20px;font-size:.8rem;}
.cards-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:1rem}
.card{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:1rem;text-decoration:none;color:var(--text);transition:all .25s;display:block;}
.card:hover{border-color:var(--gold);transform:translateY(-4px);box-shadow:0 8px 25px rgba(245,158,11,.15);text-decoration:none;}
.card img{width:100%;height:120px;object-fit:cover;border-radius:8px;margin-bottom:.5rem;}
.card-title{font-size:.88rem;color:var(--gold);margin-bottom:.2rem;line-height:1.3;font-weight:600}
.card-meta{font-size:.75rem;color:var(--muted);line-height:1.4}
.info-table{width:100%;border-collapse:collapse;font-size:.9rem}
.info-table td{padding:.7rem 1rem;border:1px solid var(--border)}
.info-table td:first-child{color:var(--muted);width:35%;background:var(--card2);font-weight:600;}
.info-table td:last-child{background:var(--card);color:var(--text)}
.content-table{width:100%;border-collapse:collapse;font-size:.87rem}
.content-table th{background:var(--gold);color:#000;padding:.65rem .9rem;text-align:left;font-weight:700;}
.content-table td{padding:.65rem .9rem;border:1px solid var(--border)}
.content-table tr:nth-child(even) td{background:var(--card2)}.content-table tr:nth-child(odd) td{background:var(--card)}
.stats-bar{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin:2rem 0;padding:1.5rem;background:var(--card);border:1px solid var(--border);border-radius:14px;}
.stat-item{text-align:center}.stat-num{font-family:'Playfair Display',serif;font-size:2rem;color:var(--gold);font-weight:700;}
.stat-label{color:var(--muted);font-size:.8rem;margin-top:.2rem}
.faq-list{display:flex;flex-direction:column;gap:.8rem}
.faq-item{background:var(--card);border:1px solid var(--border);border-radius:10px;overflow:hidden;}
.faq-q{padding:.9rem 1.2rem;color:var(--gold);font-weight:600;font-size:.93rem;cursor:pointer;display:flex;justify-content:space-between;align-items:center;}
.faq-q::after{content:'▼';font-size:.65rem;color:var(--muted);}
.faq-a{padding:.8rem 1.2rem 1rem;color:var(--text);font-size:.9rem;line-height:1.85;border-top:1px solid var(--border);}
.highlight-box{background:linear-gradient(135deg,var(--card2),var(--card));border:1px solid var(--gold);border-radius:12px;padding:1.5rem;margin:1.5rem 0;}
.highlight-box h3{color:var(--gold);margin-bottom:.8rem;font-family:'Playfair Display',serif;}
.highlight-box p{color:var(--text);line-height:1.8;font-size:.95rem;}
.tag-cloud{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:1rem}
.tag{background:var(--card2);border:1px solid var(--border);padding:.3rem .8rem;border-radius:20px;font-size:.8rem;color:var(--muted);transition:all .2s;}
.tag:hover{border-color:var(--gold);color:var(--gold);text-decoration:none}
.site-footer{background:var(--header);border-top:2px solid var(--border);margin-top:5rem;padding:3rem 1.5rem 1.5rem;}
.footer-inner{max-width:1200px;margin:0 auto}
.footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:2rem;margin-bottom:2rem;}
.footer-col h3{font-family:'Playfair Display',serif;color:var(--gold);font-size:1.2rem;margin-bottom:.8rem;}
.footer-col h4{color:var(--gold);font-size:.85rem;text-transform:uppercase;letter-spacing:1px;margin-bottom:.8rem;}
.footer-col p{color:var(--muted);font-size:.88rem;line-height:1.7}
.footer-col a{display:block;color:var(--muted);font-size:.87rem;padding:.2rem 0;}
.footer-col a:hover{color:var(--gold);text-decoration:none}
.footer-bottom{border-top:1px solid var(--border);padding-top:1.2rem;text-align:center;color:var(--muted);font-size:.83rem;}
@media(max-width:900px){.main-nav .nav-item:not(.nav-search){display:none}.mobile-menu-btn{display:block}.actor-hero{grid-template-columns:1fr}.actor-image{max-width:240px;margin:0 auto}.stats-bar{grid-template-columns:repeat(2,1fr)}.footer-grid{grid-template-columns:1fr 1fr}.nav-search{display:none}}
@media(max-width:600px){.actor-name{font-size:1.8rem}.stats-bar{grid-template-columns:1fr 1fr}.footer-grid{grid-template-columns:1fr}.container{padding:1rem}}
`;

const siteJS = `
function toggleMobile(){
  const nav=document.getElementById('mobileNav');
  nav.style.display=nav.style.display==='flex'?'none':'flex';
}
document.getElementById('searchInput')?.addEventListener('keypress',function(e){
  if(e.key==='Enter'){const q=this.value.trim();if(q)window.location.href='/search?q='+encodeURIComponent(q);}
});
`;

// ============================================================
// ACTOR PAGE GENERATOR
// ============================================================
const generateActorPage = (actor) => {
  const profession = cleanProfession(actor.profession);
  const professionStr = profession.length > 0 ? profession.join(', ') : 'Actor';
  const language = getLanguage(actor.nationality);
  const age = getAge(actor.born);
  const year = getYear();
  const genreArr = toArray(actor.genre);
  const genreStr = genreArr.join(', ');
  const imageUrl = actor.image || getImageUrl(actor.name);

  // Deduplicate movies and dramas
  const uniqueMovieSlugs = [...new Set(toArray(actor.movies))];
  const uniqueDramaSlugs = [...new Set(toArray(actor.dramas))];

  const actorMovies = uniqueMovieSlugs.map(slug => ({
    title: slugToTitle(slug),
    slug: slug,
    language: language,
    genre: genreStr
  }));

  const actorDramas = uniqueDramaSlugs.map(slug => ({
    title: slugToTitle(slug),
    slug: slug,
    language: language,
    genre: genreStr
  }));

  // Known for — top 3
  const knownForArr = [
    ...uniqueDramaSlugs.slice(0, 2),
    ...uniqueMovieSlugs.slice(0, 1)
  ].map(s => slugToTitle(s)).filter(Boolean);
  const knownFor = knownForArr.join(', ') || actor.name;

  // Related actors — same country
  const relatedActors = getActorsByCountry(actor.country, actor.id, 8);

  // Cross-country actors — same genre (strong internal linking)
  const similarActors = getActorsByGenre(actor.genre, actor.id, actor.country, 6);

  // Career description
  const careerDesc = actor.bio ||
    `${actor.name} is a ${actor.nationality} ${professionStr} who has been active in the ${actor.country} entertainment industry since ${actor.active || 'early career'}. ` +
    `Known for ${genreStr} content, ${actor.name} has appeared in ${actorMovies.length} movies and ${actorDramas.length} dramas throughout their career. ` +
    `${actor.name} is one of the most recognized faces in ${actor.country}'s film and television industry.`;

  // ============================================================
  // SCHEMAS
  // ============================================================
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": actor.name,
    "alternateName": actor.fullName || actor.name,
    "url": `https://enjoyseason.com/actors/${actor.countrySlug}/${actor.slug}`,
    "image": imageUrl,
    "birthDate": actor.born || undefined,
    "birthPlace": { "@type": "Place", "name": actor.birthPlace || actor.country },
    "nationality": { "@type": "Country", "name": actor.country },
    "jobTitle": professionStr,
    "description": careerDesc.substring(0, 300),
    "knowsLanguage": language,
    "award": toArray(actor.awards).length > 0 ? toArray(actor.awards) : undefined,
    "spouse": actor.spouse ? { "@type": "Person", "name": actor.spouse } : undefined,
    "sameAs": [
      actor.wikipedia,
      actor.imdb
    ].filter(Boolean),
    "worksFor": {
      "@type": "Organization",
      "name": `${actor.country} Film Industry`
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `Who is ${actor.name}?`,
        "acceptedAnswer": { "@type": "Answer", "text": `${actor.name} is a ${actor.nationality} ${professionStr} born on ${actor.born || 'N/A'} in ${actor.birthPlace || actor.country}. ${actor.name} is known for ${knownFor} and has worked in ${actorMovies.length + actorDramas.length} productions.` }
      },
      {
        "@type": "Question",
        "name": `How old is ${actor.name} in ${year}?`,
        "acceptedAnswer": { "@type": "Answer", "text": `${actor.name} was born on ${actor.born || 'N/A'}. As of ${year}, ${actor.name} is ${age} years old.` }
      },
      {
        "@type": "Question",
        "name": `What is ${actor.name} famous for?`,
        "acceptedAnswer": { "@type": "Answer", "text": `${actor.name} is famous for ${knownFor}. They have appeared in ${actorMovies.length} movies and ${actorDramas.length} dramas throughout their career in the ${actor.country} entertainment industry.` }
      },
      {
        "@type": "Question",
        "name": `What movies has ${actor.name} acted in?`,
        "acceptedAnswer": { "@type": "Answer", "text": `${actor.name} has acted in ${actorMovies.length} movies including ${actorMovies.slice(0,6).map(m=>m.title).join(', ')}.` }
      },
      {
        "@type": "Question",
        "name": `What dramas has ${actor.name} appeared in?`,
        "acceptedAnswer": { "@type": "Answer", "text": `${actor.name} has appeared in ${actorDramas.length} dramas including ${actorDramas.slice(0,6).map(d=>d.title).join(', ')}.` }
      },
      {
        "@type": "Question",
        "name": `Where is ${actor.name} from?`,
        "acceptedAnswer": { "@type": "Answer", "text": `${actor.name} is from ${actor.birthPlace || actor.country}. They are a ${actor.nationality} ${professionStr} who speaks ${language}.` }
      },
      {
        "@type": "Question",
        "name": `What is ${actor.name}'s nationality?`,
        "acceptedAnswer": { "@type": "Answer", "text": `${actor.name} is ${actor.nationality}. They were born in ${actor.birthPlace || actor.country} and primarily works in ${language}-language productions.` }
      }
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://enjoyseason.com" },
      { "@type": "ListItem", "position": 2, "name": "Actors", "item": "https://enjoyseason.com/category/actors" },
      { "@type": "ListItem", "position": 3, "name": `${actor.country} Actors`, "item": `https://enjoyseason.com/country/${actor.countrySlug}` },
      { "@type": "ListItem", "position": 4, "name": actor.name, "item": `https://enjoyseason.com/actors/${actor.countrySlug}/${actor.slug}` }
    ]
  };

  // ============================================================
  // HTML PAGE
  // ============================================================
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${actor.name} - ${actor.nationality} ${professionStr} | Age ${age}, ${actorMovies.length} Movies, ${actorDramas.length} Dramas | EnjoysSeason</title>
  <meta name="description" content="${actor.name} (born ${actor.born || 'N/A'}) is a ${actor.nationality} ${professionStr} from ${actor.birthPlace || actor.country}. Age ${age}. Known for ${knownFor}. Full biography, ${actorMovies.length} movies and ${actorDramas.length} dramas list on EnjoysSeason.">
  <meta name="keywords" content="${actor.name}, ${actor.fullName || actor.name}, ${actor.nationality} actor, ${actor.country} actor, ${knownFor}, ${genreStr}, age ${age}, biography, filmography">
  <meta property="og:title" content="${actor.name} - ${actor.nationality} ${professionStr} | EnjoysSeason">
  <meta property="og:description" content="${actor.name} born ${actor.born || 'N/A'} in ${actor.birthPlace || actor.country}. Age ${age}. ${actorMovies.length} movies, ${actorDramas.length} dramas.">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:url" content="https://enjoyseason.com/actors/${actor.countrySlug}/${actor.slug}">
  <meta property="og:type" content="profile">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${actor.name} - ${actor.nationality} ${professionStr}">
  <meta name="twitter:description" content="${actor.name} age ${age}, ${actorMovies.length} movies, ${actorDramas.length} dramas. Full biography on EnjoysSeason.">
  <meta name="twitter:image" content="${imageUrl}">
  <link rel="canonical" href="https://enjoyseason.com/actors/${actor.countrySlug}/${actor.slug}">
  <script type="application/ld+json">${JSON.stringify(personSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(faqSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>
  <style>${css}</style>
</head>
<body>

${megaHeader}

<!-- BREADCRUMB -->
<div class="breadcrumb">
  <div class="breadcrumb-inner">
    <a href="/">Home</a><span class="sep">›</span>
    <a href="/category/actors">Actors</a><span class="sep">›</span>
    <a href="/country/${actor.countrySlug}">${actor.country} Actors</a><span class="sep">›</span>
    <span>${actor.name}</span>
  </div>
</div>

<div class="container">

  <!-- HERO SECTION -->
  <div class="actor-hero">
    <div class="actor-image-wrap">
      <img
        src="${imageUrl}"
        alt="${actor.name} - ${actor.nationality} ${professionStr}"
        class="actor-image"
        loading="lazy"
        onerror="this.src='${getImageUrl(actor.name)}'"
      >
      <span class="image-badge">${actor.nationality}</span>
    </div>
    <div class="actor-info">
      <h1 class="actor-name">${actor.name}</h1>
      <p class="actor-subtitle">${actor.nationality} ${professionStr}${actor.active ? ' · Active since ' + actor.active : ''}</p>

      <div class="badges">
        <span class="badge">🌍 <strong><a href="/country/${actor.countrySlug}" style="color:inherit">${actor.country}</a></strong></span>
        ${actor.born ? `<span class="badge">🎂 <strong>${actor.born}</strong></span>` : ''}
        ${actor.birthPlace ? `<span class="badge">📍 <strong>${actor.birthPlace}</strong></span>` : ''}
        <span class="badge badge-gold">🎂 Age: <strong>${age}</strong></span>
        <span class="badge badge-green">🎬 <strong>${actorMovies.length} Movies</strong></span>
        <span class="badge badge-green">📺 <strong>${actorDramas.length} Dramas</strong></span>
        ${genreArr.map(g => `<span class="badge">🎭 ${g}</span>`).join('')}
      </div>

      <div class="bio-box">
        <strong>About ${actor.name}</strong>
        ${careerDesc}
      </div>

      <div class="ext-links">
        ${actor.wikipedia ? `<a href="${actor.wikipedia}" class="ext-link" target="_blank" rel="nofollow noopener">📖 Wikipedia</a>` : ''}
        ${actor.imdb ? `<a href="${actor.imdb}" class="ext-link" target="_blank" rel="nofollow noopener">🎬 IMDb</a>` : ''}
        <a href="/country/${actor.countrySlug}" class="ext-link">More ${actor.country} Actors →</a>
        <a href="/category/actors" class="ext-link">All Actors →</a>
      </div>
    </div>
  </div>

  <!-- STATS BAR -->
  <div class="stats-bar">
    <div class="stat-item">
      <div class="stat-num">${actorMovies.length}</div>
      <div class="stat-label">Total Movies</div>
    </div>
    <div class="stat-item">
      <div class="stat-num">${actorDramas.length}</div>
      <div class="stat-label">Total Dramas</div>
    </div>
    <div class="stat-item">
      <div class="stat-num">${toArray(actor.awards).length || '—'}</div>
      <div class="stat-label">Awards</div>
    </div>
    <div class="stat-item">
      <div class="stat-num">${age}</div>
      <div class="stat-label">Age in ${year}</div>
    </div>
  </div>

  <!-- QUICK FACTS TABLE -->
  <div class="section">
    <div class="section-header">
      <h2 class="section-title">📋 ${actor.name} — Quick Facts & Biography</h2>
    </div>
    <table class="info-table">
      <tr><td>Full Name</td><td>${actor.fullName || actor.name}</td></tr>
      <tr><td>Date of Birth</td><td>${actor.born || 'N/A'}</td></tr>
      <tr><td>Age in ${year}</td><td>${age} years old</td></tr>
      <tr><td>Birthplace</td><td>${actor.birthPlace || actor.country}</td></tr>
      <tr><td>Nationality</td><td>${actor.nationality}</td></tr>
      <tr><td>Country</td><td><a href="/country/${actor.countrySlug}">${actor.country}</a></td></tr>
      <tr><td>Profession</td><td>${professionStr}</td></tr>
      <tr><td>Language</td><td>${language}</td></tr>
      <tr><td>Genre</td><td>${genreStr || 'N/A'}</td></tr>
      <tr><td>Active Since</td><td>${actor.active || 'N/A'}</td></tr>
      <tr><td>Total Movies</td><td>${actorMovies.length}</td></tr>
      <tr><td>Total Dramas</td><td>${actorDramas.length}</td></tr>
      <tr><td>Total Productions</td><td>${actorMovies.length + actorDramas.length}</td></tr>
      <tr><td>Known For</td><td>${knownFor}</td></tr>
      ${actor.spouse ? `<tr><td>Spouse</td><td>${actor.spouse}</td></tr>` : ''}
      ${actor.children && actor.children !== '0' ? `<tr><td>Children</td><td>${actor.children}</td></tr>` : ''}
      ${actor.netWorth ? `<tr><td>Net Worth</td><td>${actor.netWorth}</td></tr>` : ''}
    </table>
  </div>

  <!-- CAREER HIGHLIGHT -->
  <div class="highlight-box">
    <h3>🌟 ${actor.name} — Career Overview</h3>
    <p>${actor.name} is a ${actor.nationality} ${professionStr} who has made a significant mark in the ${language}-language entertainment industry. 
    ${actor.active ? `Starting their career in ${actor.active}, ` : ''}${actor.name} has built an impressive filmography with ${actorMovies.length} movies and ${actorDramas.length} dramas to their credit. 
    Known for ${genreStr} content, ${actor.name} has become one of the most recognized names in ${actor.country}'s entertainment scene.
    ${actor.birthPlace ? `Born in ${actor.birthPlace}, ` : ''}${actor.name} has brought ${actor.country}'s stories to audiences worldwide.</p>
  </div>

  <!-- DRAMAS TABLE -->
  ${actorDramas.length ? `
  <div class="section">
    <div class="section-header">
      <h2 class="section-title">📺 ${actor.name} — Complete Dramas List</h2>
      <span class="section-count">${actorDramas.length} Dramas</span>
    </div>
    <table class="content-table">
      <tr><th>#</th><th>Drama Title</th><th>Language</th><th>Genre</th><th>Country</th></tr>
      ${actorDramas.map((d, i) => `
      <tr>
        <td>${i+1}</td>
        <td>${d.title}</td>
        <td>${d.language}</td>
        <td>${d.genre || genreStr}</td>
        <td><a href="/country/${actor.countrySlug}">${actor.country}</a></td>
      </tr>`).join('')}
    </table>
  </div>` : ''}

  <!-- MOVIES TABLE -->
  ${actorMovies.length ? `
  <div class="section">
    <div class="section-header">
      <h2 class="section-title">🎬 ${actor.name} — Complete Movies List</h2>
      <span class="section-count">${actorMovies.length} Movies</span>
    </div>
    <table class="content-table">
      <tr><th>#</th><th>Movie Title</th><th>Language</th><th>Genre</th><th>Country</th></tr>
      ${actorMovies.map((m, i) => `
      <tr>
        <td>${i+1}</td>
        <td>${m.title}</td>
        <td>${m.language}</td>
        <td>${m.genre || genreStr}</td>
        <td><a href="/country/${actor.countrySlug}">${actor.country}</a></td>
      </tr>`).join('')}
    </table>
  </div>` : ''}

  <!-- MORE FROM SAME COUNTRY — Strong Internal Linking -->
  ${relatedActors.length ? `
  <div class="section">
    <div class="section-header">
      <h2 class="section-title">🎭 More ${actor.country} Actors Like ${actor.name}</h2>
      <a href="/country/${actor.countrySlug}" style="font-size:.85rem;color:var(--gold)">View All ${actor.country} Actors →</a>
    </div>
    <div class="cards-grid">
      ${relatedActors.map(a => `
      <a href="/actors/${a.countrySlug}/${a.slug}" class="card">
        ${a.image ? `<img src="${a.image}" alt="${a.name}" loading="lazy" onerror="this.src='${getImageUrl(a.name)}'">` : ''}
        <div class="card-title">${a.name}</div>
        <div class="card-meta">${a.nationality} ${cleanProfession(a.profession)[0] || 'Actor'}<br>${toArray(a.genre).slice(0,2).join(', ')}</div>
      </a>`).join('')}
    </div>
  </div>` : ''}

  <!-- SIMILAR ACTORS FROM OTHER COUNTRIES — Cross Internal Linking -->
  ${similarActors.length ? `
  <div class="section">
    <div class="section-header">
      <h2 class="section-title">🌍 International Actors Similar to ${actor.name}</h2>
    </div>
    <div class="cards-grid">
      ${similarActors.map(a => `
      <a href="/actors/${a.countrySlug}/${a.slug}" class="card">
        ${a.image ? `<img src="${a.image}" alt="${a.name}" loading="lazy" onerror="this.src='${getImageUrl(a.name)}'">` : ''}
        <div class="card-title">${a.name}</div>
        <div class="card-meta">${a.nationality} ${cleanProfession(a.profession)[0] || 'Actor'}<br><a href="/country/${a.countrySlug}" style="font-size:.75rem">${a.country}</a></div>
      </a>`).join('')}
    </div>
  </div>` : ''}

  <!-- GENRE TAG CLOUD — Internal Linking -->
  <div class="section">
    <div class="section-header">
      <h2 class="section-title">🎭 Browse by Genre</h2>
    </div>
    <div class="tag-cloud">
      ${genreArr.map(g => `<a href="/category/${g.toLowerCase()}" class="tag">${g}</a>`).join('')}
      <a href="/category/actors" class="tag">All Actors</a>
      <a href="/country/${actor.countrySlug}" class="tag">${actor.country} Actors</a>
      <a href="/category/dramas" class="tag">Dramas</a>
      <a href="/category/movies" class="tag">Movies</a>
      ${language !== 'English' ? `<a href="/language/${language.toLowerCase()}" class="tag">${language} Content</a>` : ''}
    </div>
  </div>

  <!-- FAQ SECTION -->
  <div class="section">
    <div class="section-header">
      <h2 class="section-title">❓ Frequently Asked Questions About ${actor.name}</h2>
    </div>
    <div class="faq-list">
      <div class="faq-item">
        <div class="faq-q">Who is ${actor.name}?</div>
        <div class="faq-a">${actor.name} is a ${actor.nationality} ${professionStr} born on ${actor.born || 'N/A'} in ${actor.birthPlace || actor.country}. ${careerDesc.substring(0, 250)}...</div>
      </div>
      <div class="faq-item">
        <div class="faq-q">How old is ${actor.name} in ${year}?</div>
        <div class="faq-a">${actor.name} was born on ${actor.born || 'N/A'}${actor.birthPlace ? ` in ${actor.birthPlace}` : ''}. As of ${year}, ${actor.name} is <strong>${age} years old</strong>.</div>
      </div>
      <div class="faq-item">
        <div class="faq-q">What is ${actor.name} most famous for?</div>
        <div class="faq-a">${actor.name} is most famous for ${knownFor}. They have appeared in a total of ${actorMovies.length + actorDramas.length} productions including ${actorMovies.length} movies and ${actorDramas.length} dramas throughout their career.</div>
      </div>
      ${actorMovies.length ? `
      <div class="faq-item">
        <div class="faq-q">What movies has ${actor.name} acted in?</div>
        <div class="faq-a">${actor.name} has acted in ${actorMovies.length} movies. Some notable films include: ${actorMovies.slice(0,8).map(m => `<strong>${m.title}</strong>`).join(', ')}${actorMovies.length > 8 ? ` and ${actorMovies.length - 8} more` : ''}.</div>
      </div>` : ''}
      ${actorDramas.length ? `
      <div class="faq-item">
        <div class="faq-q">What dramas has ${actor.name} appeared in?</div>
        <div class="faq-a">${actor.name} has appeared in ${actorDramas.length} dramas. Notable dramas include: ${actorDramas.slice(0,8).map(d => `<strong>${d.title}</strong>`).join(', ')}${actorDramas.length > 8 ? ` and ${actorDramas.length - 8} more` : ''}.</div>
      </div>` : ''}
      <div class="faq-item">
        <div class="faq-q">Where is ${actor.name} from?</div>
        <div class="faq-a">${actor.name} is from <a href="/country/${actor.countrySlug}">${actor.country}</a>${actor.birthPlace ? `, specifically from ${actor.birthPlace}` : ''}. They are a ${actor.nationality} ${professionStr} who primarily works in ${language}-language productions.</div>
      </div>
      <div class="faq-item">
        <div class="faq-q">What genre does ${actor.name} specialize in?</div>
        <div class="faq-a">${actor.name} is primarily known for ${genreStr} content. They have worked extensively in ${actor.country}'s entertainment industry and have established themselves as a versatile ${professionStr}.</div>
      </div>
      ${actor.spouse ? `
      <div class="faq-item">
        <div class="faq-q">Is ${actor.name} married?</div>
        <div class="faq-a">Yes, ${actor.name} is married to ${actor.spouse}.</div>
      </div>` : ''}
      ${actor.netWorth ? `
      <div class="faq-item">
        <div class="faq-q">What is ${actor.name}'s net worth?</div>
        <div class="faq-a">${actor.name}'s estimated net worth is ${actor.netWorth} as of ${year}, based on their successful career in ${actor.country}'s entertainment industry.</div>
      </div>` : ''}
    </div>
  </div>

</div>

${siteFooter}
<script>${siteJS}</script>
</body>
</html>`;

  const dir = `./actors/${actor.countrySlug}`;
  makeDir(dir);
  fs.writeFileSync(`${dir}/${actor.slug}.html`, html);
  allUrls.push({ url: `/actors/${actor.countrySlug}/${actor.slug}`, priority: '0.8', freq: 'monthly' });
  totalPages++;
};

// ============================================================
// COUNTRY PAGES
// ============================================================
const generateCountryPages = () => {
  const countriesMap = {};
  actors.forEach(actor => {
    if (!actor.countrySlug) return;
    if (!countriesMap[actor.countrySlug]) {
      countriesMap[actor.countrySlug] = { name: actor.country, slug: actor.countrySlug, actors: [] };
    }
    countriesMap[actor.countrySlug].actors.push(actor);
  });

  Object.values(countriesMap).forEach(country => {
    const dir = `country/${country.slug}`;
    makeDir(dir);
    const language = getLanguage(country.actors[0]?.nationality || '');

    const actorCards = country.actors.map(actor => `
    <a href="/actors/${country.slug}/${actor.slug}" class="actor-card-link">
      <div class="actor-card">
        <div class="photo-wrap">
          <img src="${actor.image || getImageUrl(actor.name)}" alt="${actor.name} - ${actor.nationality} Actor" loading="lazy" onerror="this.src='${getImageUrl(actor.name)}'">
        </div>
        <div class="actor-card-info">
          <h3>${actor.name}</h3>
          <p>${cleanProfession(actor.profession).join(', ') || 'Actor'}</p>
          <span class="actor-genre">${toArray(actor.genre).slice(0,2).join(', ')}</span>
        </div>
      </div>
    </a>`).join('');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${country.name} Actors — Complete List of ${country.actors.length} Famous Actors | EnjoysSeason</title>
  <meta name="description" content="Explore ${country.actors.length} famous actors from ${country.name}. Complete profiles, biographies, movies and dramas. ${country.actors.slice(0,5).map(a=>a.name).join(', ')} and more on EnjoysSeason.">
  <link rel="canonical" href="https://enjoyseason.com/country/${country.slug}">
  <script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${country.name} Actors`,
    "description": `Complete list of ${country.actors.length} famous actors from ${country.name}`,
    "numberOfItems": country.actors.length,
    "itemListElement": country.actors.slice(0,10).map((a, i) => ({
      "@type": "ListItem",
      "position": i+1,
      "name": a.name,
      "url": `https://enjoyseason.com/actors/${country.slug}/${a.slug}`
    }))
  })}</script>
  <style>
    :root{--bg:#08091a;--card:#121430;--gold:#f5a623;--text:#fff;--muted:#94a3b8;--border:#1e3a5f;}
    *{margin:0;padding:0;box-sizing:border-box}
    body{background:var(--bg);color:var(--text);font-family:'Segoe UI',sans-serif;}
    .header{background:#050612;border-bottom:2px solid var(--gold);padding:1rem 2rem;display:flex;align-items:center;gap:1rem;}
    .header a{color:var(--gold);text-decoration:none;font-weight:700;font-size:1.2rem;}
    .header nav a{color:var(--muted);font-size:.9rem;margin-left:1rem;}
    .header nav a:hover{color:var(--gold)}
    .container{max-width:1200px;margin:0 auto;padding:2rem;}
    .breadcrumb{color:#888;font-size:.85rem;margin-bottom:1.5rem;}
    .breadcrumb a{color:var(--gold);text-decoration:none;}
    .page-title{color:var(--gold);font-size:2rem;margin-bottom:.5rem;}
    .page-subtitle{color:var(--muted);margin-bottom:2rem;font-size:.95rem;}
    .actor-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:1.5rem;}
    .actor-card-link{text-decoration:none;color:inherit;}
    .actor-card{background:var(--card);border-radius:12px;overflow:hidden;border:1px solid var(--border);transition:all .25s;}
    .actor-card:hover{border-color:var(--gold);transform:translateY(-4px);box-shadow:0 8px 25px rgba(245,166,35,.15);}
    .photo-wrap{width:100%;height:220px;overflow:hidden;background:#1c1f45;}
    .photo-wrap img{width:100%;height:100%;object-fit:cover;transition:transform .3s;}
    .actor-card:hover .photo-wrap img{transform:scale(1.05);}
    .actor-card-info{padding:1rem;}
    .actor-card-info h3{font-size:.95rem;color:var(--gold);margin-bottom:.3rem;}
    .actor-card-info p{font-size:.8rem;color:var(--muted);margin-bottom:.3rem;}
    .actor-genre{font-size:.75rem;color:#64748b;}
    .stats-row{display:flex;gap:2rem;background:var(--card);border-radius:12px;padding:1.5rem;margin-bottom:2rem;border:1px solid var(--border);}
    .stat{text-align:center;}
    .stat-n{font-size:1.8rem;color:var(--gold);font-weight:700;}
    .stat-l{font-size:.8rem;color:var(--muted);}
    footer{text-align:center;padding:3rem;background:#050612;color:#666;font-size:.85rem;margin-top:4rem;border-top:1px solid var(--border);}
    footer a{color:var(--gold);}
  </style>
</head>
<body>
  <header class="header">
    <a href="/">🎬 EnjoysSeason</a>
    <nav>
      <a href="/category/actors">Actors</a>
      <a href="/category/movies">Movies</a>
      <a href="/category/dramas">Dramas</a>
    </nav>
  </header>
  <div class="container">
    <div class="breadcrumb">
      <a href="/">Home</a> › <a href="/category/actors">Actors</a> › ${country.name}
    </div>
    <h1 class="page-title">🎭 ${country.name} Actors</h1>
    <p class="page-subtitle">Explore ${country.actors.length} famous actors and celebrities from ${country.name}. Full biographies, filmographies, movies and dramas.</p>
    
    <div class="stats-row">
      <div class="stat"><div class="stat-n">${country.actors.length}</div><div class="stat-l">Total Actors</div></div>
      <div class="stat"><div class="stat-n">${language}</div><div class="stat-l">Language</div></div>
      <div class="stat"><div class="stat-n">${country.name}</div><div class="stat-l">Country</div></div>
    </div>

    <div class="actor-grid">${actorCards}</div>
  </div>
  <footer>
    <p>© ${getYear()} <a href="/">EnjoysSeason</a> — World Entertainment Database</p>
    <p style="margin-top:.5rem">
      <a href="/category/actors">All Actors</a> · 
      <a href="/category/movies">Movies</a> · 
      <a href="/category/dramas">Dramas</a> · 
      <a href="/sitemap.xml">Sitemap</a>
    </p>
  </footer>
</body>
</html>`;

    fs.writeFileSync(`${dir}/index.html`, html);
    allUrls.push({ url: `/country/${country.slug}`, priority: '0.7', freq: 'weekly' });
  });
  console.log(`✅ Country pages: ${Object.keys(countriesMap).length}`);
};

// ============================================================
// SITEMAP + ROBOTS
// ============================================================
const generateSitemap = () => {
  allUrls.unshift({ url: '/', priority: '1.0', freq: 'daily' });
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${allUrls.map(u => `  <url>\n    <loc>https://enjoyseason.com${u.url}</loc>\n    <changefreq>${u.freq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`).join('\n')}\n</urlset>`;
  fs.writeFileSync('./sitemap.xml', xml);
  console.log(`✅ Sitemap: ${allUrls.length} URLs`);
};

const generateRobots = () => {
  fs.writeFileSync('./robots.txt', `User-agent: *\nAllow: /\n\nUser-agent: Googlebot\nAllow: /\n\nUser-agent: Bingbot\nAllow: /\n\nSitemap: https://enjoyseason.com/sitemap.xml\n`);
};

// ============================================================
// MAIN
// ============================================================
console.log('\n🚀 EnjoysSeason — Ultimate Generator\n' + '='.repeat(50));
actors.forEach(generateActorPage);
console.log(`✅ Actor pages: ${actors.length}`);
generateCountryPages();
generateSitemap();
generateRobots();
console.log('='.repeat(50));
console.log(`\n🎉 TOTAL: ${totalPages} pages generated!\n`);
