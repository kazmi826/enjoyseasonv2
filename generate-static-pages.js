const fs = require('fs');

const actors = JSON.parse(fs.readFileSync('./data/actors.json', 'utf8'));
const dramas = JSON.parse(fs.readFileSync('./data/dramas-full.json', 'utf8'));

const makeDir = (d) => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); };
const getYear = () => new Date().getFullYear();
const cleanProfession = (p) => (Array.isArray(p) ? p : [p||'Actor']).filter(x=>x&&x.length<25&&!x.includes('node')&&!x.includes('.js'));

const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Source+Sans+3:wght@300;400;600&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
:root{--bg:#0a0f1e;--bg2:#0f172a;--card:#1e293b;--card2:#162032;--gold:#f59e0b;--text:#f1f5f9;--muted:#94a3b8;--border:#1e3a5f;--header:#080d1a;}
body{background:var(--bg);color:var(--text);font-family:'Source Sans 3',sans-serif;line-height:1.8;}
a{color:var(--gold);text-decoration:none}a:hover{text-decoration:underline}
.site-header{background:var(--header);border-bottom:2px solid var(--gold);position:sticky;top:0;z-index:1000;}
.header-inner{max-width:1400px;margin:0 auto;padding:.8rem 1.5rem;display:flex;align-items:center;gap:1.5rem;}
.logo{font-family:'Playfair Display',serif;font-size:1.4rem;color:var(--gold);font-weight:900;text-decoration:none;}
.nav a{color:var(--muted);font-size:.9rem;margin-left:1.2rem;}
.nav a:hover{color:var(--gold);text-decoration:none}
.breadcrumb{background:var(--bg2);padding:.65rem 1.5rem;font-size:.82rem;border-bottom:1px solid var(--border);}
.breadcrumb-inner{max-width:1200px;margin:0 auto}.breadcrumb a{color:var(--gold)}.sep{color:var(--muted);margin:0 .4rem}
.container{max-width:1200px;margin:0 auto;padding:2rem 1.5rem}
.page-title{font-family:'Playfair Display',serif;font-size:2.2rem;color:var(--gold);margin-bottom:.5rem;}
.page-subtitle{color:var(--muted);margin-bottom:2rem;font-size:.95rem;}
.stats-row{display:flex;gap:2rem;background:var(--card);border-radius:12px;padding:1.5rem;margin-bottom:2rem;border:1px solid var(--border);flex-wrap:wrap;}
.stat{text-align:center;min-width:100px;}.stat-n{font-size:1.8rem;color:var(--gold);font-weight:700;font-family:'Playfair Display',serif;}.stat-l{font-size:.8rem;color:var(--muted);}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:1rem;}
.card{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:1rem;text-decoration:none;color:var(--text);transition:all .25s;display:block;}
.card:hover{border-color:var(--gold);transform:translateY(-4px);text-decoration:none;}
.card img{width:100%;height:130px;object-fit:cover;border-radius:8px;margin-bottom:.5rem;}
.card-title{font-size:.88rem;color:var(--gold);font-weight:600;margin-bottom:.2rem;line-height:1.3;}
.card-meta{font-size:.75rem;color:var(--muted);}
.section{margin:3rem 0}
.section-title{font-family:'Playfair Display',serif;font-size:1.4rem;color:var(--gold);margin-bottom:1.2rem;padding-bottom:.6rem;border-bottom:2px solid var(--border);}
.prose{background:var(--card2);border-left:4px solid var(--gold);border-radius:0 12px 12px 0;padding:1.2rem 1.4rem;margin:1.5rem 0;font-size:.97rem;line-height:1.95;color:var(--text);}
.site-footer{background:var(--header);border-top:2px solid var(--border);margin-top:5rem;padding:3rem 1.5rem 1.5rem;}
.footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:2rem;margin-bottom:2rem;max-width:1200px;margin:0 auto 2rem;}
.footer-col h3{font-family:'Playfair Display',serif;color:var(--gold);font-size:1.2rem;margin-bottom:.8rem;}
.footer-col h4{color:var(--gold);font-size:.85rem;text-transform:uppercase;letter-spacing:1px;margin-bottom:.8rem;}
.footer-col p{color:var(--muted);font-size:.88rem;line-height:1.7}
.footer-col a{display:block;color:var(--muted);font-size:.87rem;padding:.2rem 0;}
.footer-col a:hover{color:var(--gold);text-decoration:none}
.footer-bottom{border-top:1px solid var(--border);padding-top:1.2rem;text-align:center;color:var(--muted);font-size:.83rem;max-width:1200px;margin:0 auto;}
@media(max-width:600px){.grid{grid-template-columns:repeat(2,1fr)}.footer-grid{grid-template-columns:1fr}}
`;

const header = `
<header class="site-header">
  <div class="header-inner">
    <a href="/" class="logo">🎬 EnjoysSeason</a>
    <nav class="nav">
      <a href="/category/actors">Actors</a>
      <a href="/category/movies">Movies</a>
      <a href="/category/dramas">Dramas</a>
      <a href="/category/anime">Anime</a>
      <a href="/industry/bollywood">Bollywood</a>
    </nav>
  </div>
</header>`;

const footer = `
<footer class="site-footer">
  <div class="footer-grid">
    <div class="footer-col">
      <h3>🎬 EnjoysSeason</h3>
      <p>World's complete entertainment database. Actors, movies, dramas from 200+ countries.</p>
    </div>
    <div class="footer-col">
      <h4>🌍 Countries</h4>
      <a href="/country/pakistan">Pakistan</a>
      <a href="/country/india">India</a>
      <a href="/country/usa">USA</a>
      <a href="/country/turkey">Turkey</a>
      <a href="/country/south-korea">South Korea</a>
    </div>
    <div class="footer-col">
      <h4>🎭 Categories</h4>
      <a href="/category/actors">All Actors</a>
      <a href="/category/movies">All Movies</a>
      <a href="/category/dramas">All Dramas</a>
      <a href="/category/web-series">Web Series</a>
      <a href="/category/anime">Anime</a>
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
  <div class="footer-bottom">© ${getYear()} EnjoysSeason — World Entertainment Database</div>
</footer>`;

// ============================================================
// 1. CATEGORY PAGES
// ============================================================

// All Actors
const actorsByCountry = {};
actors.forEach(a => {
  if (!actorsByCountry[a.country]) actorsByCountry[a.country] = [];
  actorsByCountry[a.country].push(a);
});

makeDir('category/actors');
fs.writeFileSync('category/actors/index.html', `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>All Actors — Complete World Actor Database | EnjoysSeason</title>
  <meta name="description" content="Browse ${actors.length} actors from 200+ countries. Pakistani, Indian, Turkish, Korean, Hollywood actors with full biographies and filmographies.">
  <link rel="canonical" href="https://enjoyseason.com/category/actors">
  <script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"CollectionPage","name":"All Actors","description":"Complete world actor database","url":"https://enjoyseason.com/category/actors","numberOfItems":actors.length})}</script>
  <style>${css}</style>
</head>
<body>
${header}
<div class="breadcrumb"><div class="breadcrumb-inner"><a href="/">Home</a><span class="sep">›</span>All Actors</div></div>
<div class="container">
  <h1 class="page-title">🎭 All Actors</h1>
  <p class="page-subtitle">Browse ${actors.length.toLocaleString()} actors from 200+ countries worldwide</p>
  <div class="stats-row">
    <div class="stat"><div class="stat-n">${actors.length.toLocaleString()}</div><div class="stat-l">Total Actors</div></div>
    <div class="stat"><div class="stat-n">${Object.keys(actorsByCountry).length}</div><div class="stat-l">Countries</div></div>
  </div>
  <div class="prose">
    <strong>World's Largest Actor Database</strong><br>
    EnjoysSeason features ${actors.length.toLocaleString()} actors from over ${Object.keys(actorsByCountry).length} countries. Browse Pakistani, Indian, Turkish, Korean, Hollywood and many more actors with complete biographies, filmographies, movies and dramas lists.
  </div>
  ${Object.entries(actorsByCountry).slice(0,30).map(([country, countryActors]) => `
  <div class="section">
    <h2 class="section-title">🎭 ${country} Actors <span style="font-size:.85rem;color:var(--muted)">(${countryActors.length})</span></h2>
    <div class="grid">
      ${countryActors.slice(0,12).map(a => `
      <a href="/actors/${a.countrySlug}/${a.slug}" class="card">
        ${a.image ? `<img src="${a.image}" alt="${a.name}" loading="lazy" onerror="this.style.display='none'">` : ''}
        <div class="card-title">${a.name}</div>
        <div class="card-meta">${a.nationality} · ${cleanProfession(a.profession)[0]||'Actor'}</div>
      </a>`).join('')}
    </div>
    ${countryActors.length > 12 ? `<p style="margin-top:1rem"><a href="/country/${countryActors[0].countrySlug}">View all ${countryActors.length} ${country} actors →</a></p>` : ''}
  </div>`).join('')}
</div>
${footer}
</body></html>`);
console.log('✅ category/actors/index.html');

// All Dramas
makeDir('category/dramas');
fs.writeFileSync('category/dramas/index.html', `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>All Dramas — Complete World Drama Database | EnjoysSeason</title>
  <meta name="description" content="Browse ${dramas.length} dramas from worldwide. Korean, Turkish, Pakistani, Indian dramas with complete cast, episodes and ratings.">
  <link rel="canonical" href="https://enjoyseason.com/category/dramas">
  <style>${css}</style>
</head>
<body>
${header}
<div class="breadcrumb"><div class="breadcrumb-inner"><a href="/">Home</a><span class="sep">›</span>All Dramas</div></div>
<div class="container">
  <h1 class="page-title">📺 All Dramas</h1>
  <p class="page-subtitle">Browse ${dramas.length.toLocaleString()} dramas from worldwide</p>
  <div class="stats-row">
    <div class="stat"><div class="stat-n">${dramas.length.toLocaleString()}</div><div class="stat-l">Total Dramas</div></div>
    <div class="stat"><div class="stat-n">${[...new Set(dramas.map(d=>d.originCountry))].length}</div><div class="stat-l">Countries</div></div>
  </div>
  <div class="prose">
    <strong>World's Complete Drama Database</strong><br>
    EnjoysSeason features ${dramas.length.toLocaleString()} dramas including Korean dramas, Turkish dramas, Pakistani dramas, Indian dramas, Hollywood series and more. Complete cast, episode lists, ratings and reviews.
  </div>
  <div class="section">
    <h2 class="section-title">📺 Latest Dramas</h2>
    <div class="grid">
      ${dramas.slice(0,60).map(d => `
      <a href="/dramas/${d.countrySlug}/${d.slug}" class="card">
        ${d.poster ? `<img src="${d.poster}" alt="${d.name}" loading="lazy">` : ''}
        <div class="card-title">${d.name}</div>
        <div class="card-meta">${d.originCountry} · ${d.genres[0]||'Drama'} · ⭐${d.rating||'N/A'}</div>
      </a>`).join('')}
    </div>
  </div>
</div>
${footer}
</body></html>`);
console.log('✅ category/dramas/index.html');

// Web Series
makeDir('category/web-series');
const webSeries = dramas.filter(d => d.type === 'Miniseries' || (d.networks||[]).some(n => ['Netflix','Amazon','Disney+','HBO','Hulu','Apple TV+'].includes(n)));
fs.writeFileSync('category/web-series/index.html', `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Web Series — Netflix, Amazon, Disney+ Complete List | EnjoysSeason</title>
  <meta name="description" content="Browse ${webSeries.length}+ web series from Netflix, Amazon Prime, Disney+, HBO and more. Complete cast, episodes and ratings on EnjoysSeason.">
  <link rel="canonical" href="https://enjoyseason.com/category/web-series">
  <style>${css}</style>
</head>
<body>
${header}
<div class="breadcrumb"><div class="breadcrumb-inner"><a href="/">Home</a><span class="sep">›</span>Web Series</div></div>
<div class="container">
  <h1 class="page-title">💻 Web Series</h1>
  <p class="page-subtitle">Browse web series from Netflix, Amazon Prime, Disney+, HBO and more</p>
  <div class="stats-row">
    <div class="stat"><div class="stat-n">${webSeries.length}</div><div class="stat-l">Web Series</div></div>
    <div class="stat"><div class="stat-n">Netflix, Amazon, Disney+</div><div class="stat-l">Platforms</div></div>
  </div>
  <div class="prose">
    <strong>Complete Web Series Database</strong><br>
    Discover the best web series from all major streaming platforms. Netflix originals, Amazon Prime exclusives, Disney+ shows, HBO series and much more — all with complete cast, episode guides and ratings.
  </div>
  <div class="section">
    <h2 class="section-title">💻 Popular Web Series</h2>
    <div class="grid">
      ${dramas.filter(d => d.networks && d.networks.length).slice(0,60).map(d => `
      <a href="/dramas/${d.countrySlug}/${d.slug}" class="card">
        ${d.poster ? `<img src="${d.poster}" alt="${d.name}" loading="lazy">` : ''}
        <div class="card-title">${d.name}</div>
        <div class="card-meta">${d.networks[0]||'Streaming'} · ⭐${d.rating||'N/A'}</div>
      </a>`).join('')}
    </div>
  </div>
</div>
${footer}
</body></html>`);
console.log('✅ category/web-series/index.html');

// Anime
makeDir('category/anime');
const anime = dramas.filter(d => d.originCountry === 'JP' || (d.genres||[]).includes('Animation'));
fs.writeFileSync('category/anime/index.html', `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Anime — Complete Japanese Anime List | EnjoysSeason</title>
  <meta name="description" content="Browse ${anime.length}+ anime series. Complete list of Japanese anime with cast, episodes, ratings and genres on EnjoysSeason.">
  <link rel="canonical" href="https://enjoyseason.com/category/anime">
  <style>${css}</style>
</head>
<body>
${header}
<div class="breadcrumb"><div class="breadcrumb-inner"><a href="/">Home</a><span class="sep">›</span>Anime</div></div>
<div class="container">
  <h1 class="page-title">🎌 Anime</h1>
  <p class="page-subtitle">Browse ${anime.length}+ anime series from Japan and worldwide</p>
  <div class="stats-row">
    <div class="stat"><div class="stat-n">${anime.length}+</div><div class="stat-l">Anime Series</div></div>
    <div class="stat"><div class="stat-n">Japan</div><div class="stat-l">Primary Origin</div></div>
  </div>
  <div class="prose">
    <strong>Complete Anime Database</strong><br>
    EnjoysSeason features hundreds of anime series from Japan and worldwide. Action, romance, fantasy, sci-fi and more — complete with episode guides, cast information and ratings.
  </div>
  <div class="section">
    <h2 class="section-title">🎌 Popular Anime</h2>
    <div class="grid">
      ${anime.slice(0,60).map(d => `
      <a href="/dramas/${d.countrySlug}/${d.slug}" class="card">
        ${d.poster ? `<img src="${d.poster}" alt="${d.name}" loading="lazy">` : ''}
        <div class="card-title">${d.name}</div>
        <div class="card-meta">${d.genres[0]||'Anime'} · ⭐${d.rating||'N/A'}</div>
      </a>`).join('')}
    </div>
  </div>
</div>
${footer}
</body></html>`);
console.log('✅ category/anime/index.html');

// Movies
makeDir('category/movies');
fs.writeFileSync('category/movies/index.html', `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>All Movies — Bollywood, Hollywood, World Cinema | EnjoysSeason</title>
  <meta name="description" content="Browse movies from Bollywood, Hollywood, Lollywood and world cinema. Complete cast, ratings and reviews on EnjoysSeason.">
  <link rel="canonical" href="https://enjoyseason.com/category/movies">
  <style>${css}</style>
</head>
<body>
${header}
<div class="breadcrumb"><div class="breadcrumb-inner"><a href="/">Home</a><span class="sep">›</span>All Movies</div></div>
<div class="container">
  <h1 class="page-title">🎬 All Movies</h1>
  <p class="page-subtitle">Browse movies from Bollywood, Hollywood, Lollywood and world cinema</p>
  <div class="prose">
    <strong>World Movie Database</strong><br>
    EnjoysSeason covers movies from all major film industries worldwide including Bollywood, Hollywood, Lollywood, Tollywood, K-Drama films, Turkish cinema and more. Find complete cast information, ratings, and actor profiles.
  </div>
  <div class="section">
    <h2 class="section-title">🎬 Browse by Industry</h2>
    <div class="grid">
      <a href="/industry/bollywood" class="card"><div class="card-title">🇮🇳 Bollywood</div><div class="card-meta">Indian Hindi Cinema</div></a>
      <a href="/industry/hollywood" class="card"><div class="card-title">🇺🇸 Hollywood</div><div class="card-meta">American Cinema</div></a>
      <a href="/industry/lollywood" class="card"><div class="card-title">🇵🇰 Lollywood</div><div class="card-meta">Pakistani Cinema</div></a>
      <a href="/industry/korean" class="card"><div class="card-title">🇰🇷 K-Drama Films</div><div class="card-meta">Korean Cinema</div></a>
      <a href="/industry/turkish" class="card"><div class="card-title">🇹🇷 Turkish Films</div><div class="card-meta">Turkish Cinema</div></a>
      <a href="/industry/anime" class="card"><div class="card-title">🎌 Anime Films</div><div class="card-meta">Japanese Animation</div></a>
    </div>
  </div>
</div>
${footer}
</body></html>`);
console.log('✅ category/movies/index.html');

// Bollywood
makeDir('industry/bollywood');
const bollywoodActors = actors.filter(a => a.country === 'India').slice(0, 100);
fs.writeFileSync('industry/bollywood/index.html', `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Bollywood — Complete Indian Film Industry Database | EnjoysSeason</title>
  <meta name="description" content="Complete Bollywood database. Browse ${bollywoodActors.length}+ Indian actors, movies, dramas from Hindi film industry. Shah Rukh Khan, Salman Khan, Deepika Padukone and more.">
  <link rel="canonical" href="https://enjoyseason.com/industry/bollywood">
  <style>${css}</style>
</head>
<body>
${header}
<div class="breadcrumb"><div class="breadcrumb-inner"><a href="/">Home</a><span class="sep">›</span><a href="/category/movies">Movies</a><span class="sep">›</span>Bollywood</div></div>
<div class="container">
  <h1 class="page-title">🇮🇳 Bollywood</h1>
  <p class="page-subtitle">Complete Indian Film Industry Database — Actors, Movies, Dramas</p>
  <div class="stats-row">
    <div class="stat"><div class="stat-n">${actors.filter(a=>a.country==='India').length}</div><div class="stat-l">Indian Actors</div></div>
    <div class="stat"><div class="stat-n">Hindi</div><div class="stat-l">Language</div></div>
    <div class="stat"><div class="stat-n">Mumbai</div><div class="stat-l">Film Capital</div></div>
  </div>
  <div class="prose">
    <strong>About Bollywood</strong><br>
    Bollywood is the Hindi-language film industry based in Mumbai, India. It is the largest film producer in India and one of the largest in the world. Bollywood produces over 1,000 films annually and features some of the world's most popular actors including Shah Rukh Khan, Salman Khan, Aamir Khan, Deepika Padukone and many more.
  </div>
  <div class="section">
    <h2 class="section-title">🎭 Popular Bollywood Actors</h2>
    <div class="grid">
      ${bollywoodActors.map(a => `
      <a href="/actors/${a.countrySlug}/${a.slug}" class="card">
        ${a.image ? `<img src="${a.image}" alt="${a.name}" loading="lazy">` : ''}
        <div class="card-title">${a.name}</div>
        <div class="card-meta">Indian · ${cleanProfession(a.profession)[0]||'Actor'}</div>
      </a>`).join('')}
    </div>
  </div>
</div>
${footer}
</body></html>`);
console.log('✅ industry/bollywood/index.html');

// ============================================================
// 2. STATIC INFO PAGES
// ============================================================

// About Us
makeDir('about');
fs.writeFileSync('about/index.html', `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>About Us | EnjoysSeason — World Entertainment Database</title>
  <meta name="description" content="EnjoysSeason is the world's most complete entertainment database featuring actors, movies, dramas from 200+ countries.">
  <link rel="canonical" href="https://enjoyseason.com/about">
  <style>${css}</style>
</head>
<body>
${header}
<div class="breadcrumb"><div class="breadcrumb-inner"><a href="/">Home</a><span class="sep">›</span>About Us</div></div>
<div class="container">
  <h1 class="page-title">About EnjoysSeason</h1>
  <div class="prose">
    <strong>Who We Are</strong><br>
    EnjoysSeason is the world's most complete entertainment database, featuring ${actors.length.toLocaleString()} actors, thousands of movies and dramas from 200+ countries. Our mission is to provide accurate, comprehensive and up-to-date information about the global entertainment industry.
  </div>
  <div class="prose">
    <strong>Our Coverage</strong><br>
    We cover entertainment from all major industries including Bollywood, Hollywood, Lollywood, K-Drama, Turkish Dramas, Anime, and many more. Our database includes actors from Pakistan, India, USA, Turkey, South Korea, Japan, China, and 200+ other countries.
  </div>
  <div class="prose">
    <strong>Data Sources</strong><br>
    Our data is sourced from TMDB (The Movie Database) and other reliable entertainment databases. We strive to maintain accuracy and update our database regularly.
  </div>
  <div class="prose">
    <strong>Contact Us</strong><br>
    For any queries, corrections or suggestions, please visit our <a href="/contact">Contact page</a>.
  </div>
</div>
${footer}
</body></html>`);
console.log('✅ about/index.html');

// Contact
makeDir('contact');
fs.writeFileSync('contact/index.html', `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Contact Us | EnjoysSeason</title>
  <meta name="description" content="Contact EnjoysSeason for queries, corrections or suggestions about our entertainment database.">
  <link rel="canonical" href="https://enjoyseason.com/contact">
  <style>${css}
  .form-group{margin-bottom:1.2rem}
  label{display:block;color:var(--muted);font-size:.9rem;margin-bottom:.4rem}
  input,textarea{width:100%;background:var(--card);border:1px solid var(--border);color:var(--text);padding:.7rem 1rem;border-radius:8px;font-size:.95rem;font-family:inherit}
  input:focus,textarea:focus{outline:none;border-color:var(--gold)}
  textarea{height:150px;resize:vertical}
  .btn{background:var(--gold);color:#000;border:none;padding:.8rem 2rem;border-radius:8px;cursor:pointer;font-weight:700;font-size:1rem;}
  .form-wrap{max-width:600px;background:var(--card);border:1px solid var(--border);border-radius:12px;padding:2rem;}
  </style>
</head>
<body>
${header}
<div class="breadcrumb"><div class="breadcrumb-inner"><a href="/">Home</a><span class="sep">›</span>Contact</div></div>
<div class="container">
  <h1 class="page-title">Contact Us</h1>
  <p class="page-subtitle">Have a question, correction or suggestion? Get in touch!</p>
  <div class="form-wrap">
    <div class="form-group"><label>Your Name</label><input type="text" placeholder="Enter your name"></div>
    <div class="form-group"><label>Email Address</label><input type="email" placeholder="Enter your email"></div>
    <div class="form-group"><label>Subject</label><input type="text" placeholder="What is this about?"></div>
    <div class="form-group"><label>Message</label><textarea placeholder="Your message..."></textarea></div>
    <button class="btn">Send Message</button>
  </div>
</div>
${footer}
</body></html>`);
console.log('✅ contact/index.html');

// Privacy Policy
makeDir('privacy-policy');
fs.writeFileSync('privacy-policy/index.html', `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Privacy Policy | EnjoysSeason</title>
  <meta name="description" content="Privacy Policy for EnjoysSeason — World Entertainment Database.">
  <link rel="canonical" href="https://enjoyseason.com/privacy-policy">
  <style>${css}</style>
</head>
<body>
${header}
<div class="breadcrumb"><div class="breadcrumb-inner"><a href="/">Home</a><span class="sep">›</span>Privacy Policy</div></div>
<div class="container">
  <h1 class="page-title">Privacy Policy</h1>
  <p class="page-subtitle">Last updated: ${new Date().toLocaleDateString('en-US', {year:'numeric',month:'long',day:'numeric'})}</p>
  <div class="prose"><strong>Information We Collect</strong><br>EnjoysSeason does not collect personal information from visitors. We use anonymous analytics to improve our service.</div>
  <div class="prose"><strong>Cookies</strong><br>We may use cookies to enhance your browsing experience. These cookies do not contain personal information.</div>
  <div class="prose"><strong>Third Party Links</strong><br>Our site may contain links to external websites such as Wikipedia, IMDB, and TMDB. We are not responsible for the privacy practices of these sites.</div>
  <div class="prose"><strong>Data Sources</strong><br>Entertainment data is sourced from TMDB (The Movie Database) under their terms of service. Images are provided by TMDB.</div>
  <div class="prose"><strong>Contact</strong><br>For privacy concerns, please contact us via our <a href="/contact">Contact page</a>.</div>
</div>
${footer}
</body></html>`);
console.log('✅ privacy-policy/index.html');

// Disclaimer
makeDir('disclaimer');
fs.writeFileSync('disclaimer/index.html', `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Disclaimer | EnjoysSeason</title>
  <meta name="description" content="Disclaimer for EnjoysSeason — World Entertainment Database.">
  <link rel="canonical" href="https://enjoyseason.com/disclaimer">
  <style>${css}</style>
</head>
<body>
${header}
<div class="breadcrumb"><div class="breadcrumb-inner"><a href="/">Home</a><span class="sep">›</span>Disclaimer</div></div>
<div class="container">
  <h1 class="page-title">Disclaimer</h1>
  <div class="prose"><strong>General Information</strong><br>The information provided on EnjoysSeason is for general informational purposes only. While we strive to keep information accurate and up-to-date, we make no warranties about the completeness or accuracy of this information.</div>
  <div class="prose"><strong>Entertainment Data</strong><br>All entertainment data including actor biographies, filmographies, and ratings are sourced from publicly available databases. We do not claim ownership of this data.</div>
  <div class="prose"><strong>Images</strong><br>All images are sourced from TMDB (The Movie Database) and are used in accordance with their API terms of service.</div>
  <div class="prose"><strong>External Links</strong><br>EnjoysSeason contains links to external websites. We have no control over the content of those sites and accept no responsibility for them.</div>
</div>
${footer}
</body></html>`);
console.log('✅ disclaimer/index.html');

console.log('\n🎉 All static pages generated!');
console.log('Run: git add . && git commit -m "add all category and static pages" && git push origin main');
