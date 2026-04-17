const fs = require('fs');

if (!fs.existsSync('data/dramas-full.json')) {
  console.error('❌ Run fetch-dramas.js first!');
  process.exit(1);
}

const dramas = JSON.parse(fs.readFileSync('data/dramas-full.json', 'utf8'));
const actors = JSON.parse(fs.readFileSync('data/actors.json', 'utf8'));

let totalPages = 0;
const allUrls = [];

const makeDir = (d) => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); };
const makeSlug = (name) => (name || '').toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
const getYear = () => new Date().getFullYear();

// Find actor in our database
const findActor = (name) => actors.find(a => a.name.toLowerCase() === name.toLowerCase());

const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Source+Sans+3:wght@300;400;600&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
:root{--bg:#0a0f1e;--bg2:#0f172a;--card:#1e293b;--card2:#162032;--gold:#f59e0b;--gold2:#d97706;--red:#ef4444;--green:#22c55e;--blue:#3b82f6;--text:#f1f5f9;--muted:#94a3b8;--border:#1e3a5f;--header:#080d1a;}
body{background:var(--bg);color:var(--text);font-family:'Source Sans 3',sans-serif;line-height:1.8;font-size:16px;}
a{color:var(--gold);text-decoration:none}a:hover{text-decoration:underline}
.site-header{background:var(--header);border-bottom:2px solid var(--gold);position:sticky;top:0;z-index:1000;box-shadow:0 4px 20px rgba(0,0,0,.5);}
.header-inner{max-width:1400px;margin:0 auto;padding:.8rem 1.5rem;display:flex;align-items:center;gap:1.5rem;}
.logo{display:flex;align-items:center;gap:.5rem;text-decoration:none;flex-shrink:0;}
.logo-text{font-family:'Playfair Display',serif;font-size:1.4rem;color:var(--gold);font-weight:900;}
.nav-search{display:flex;gap:.4rem;margin-left:auto}
.search-input{background:var(--card);border:1px solid var(--border);color:var(--text);padding:.4rem .9rem;border-radius:8px;font-size:.85rem;width:260px;}
.search-input:focus{outline:none;border-color:var(--gold)}
.search-btn{background:var(--gold);color:#000;border:none;padding:.4rem .9rem;border-radius:8px;cursor:pointer;font-weight:600;font-size:.85rem;}
.breadcrumb{background:var(--bg2);padding:.65rem 1.5rem;font-size:.82rem;border-bottom:1px solid var(--border);}
.breadcrumb-inner{max-width:1200px;margin:0 auto}.breadcrumb a{color:var(--gold)}.breadcrumb .sep{color:var(--muted);margin:0 .4rem}
.container{max-width:1200px;margin:0 auto;padding:2rem 1.5rem}
.drama-hero{display:grid;grid-template-columns:300px 1fr;gap:2.5rem;margin-bottom:3rem;align-items:start;}
.drama-poster{width:100%;border-radius:16px;border:3px solid var(--gold);display:block;}
.drama-name{font-family:'Playfair Display',serif;font-size:2.5rem;color:var(--gold);line-height:1.2;margin-bottom:.3rem;}
.drama-tagline{color:var(--muted);font-size:1rem;margin-bottom:1rem;font-style:italic;}
.badges{display:flex;flex-wrap:wrap;gap:.5rem;margin:1rem 0}
.badge{background:var(--card2);border:1px solid var(--border);padding:.3rem .8rem;border-radius:20px;font-size:.8rem;color:var(--muted);}
.badge strong{color:var(--text)}.badge-gold{border-color:var(--gold);color:var(--gold)}.badge-green{border-color:var(--green);color:var(--green)}
.overview-box{background:var(--card2);border-left:4px solid var(--gold);border-radius:0 12px 12px 0;padding:1.2rem 1.4rem;margin:1.2rem 0;font-size:.97rem;line-height:1.95;}
.overview-box strong{color:var(--gold);display:block;margin-bottom:.4rem}
.rating-box{display:inline-flex;align-items:center;gap:.5rem;background:var(--gold);color:#000;padding:.4rem 1rem;border-radius:8px;font-weight:700;font-size:1.1rem;margin:1rem 0;}
.section{margin:3rem 0}
.section-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.3rem;padding-bottom:.7rem;border-bottom:2px solid var(--border);}
.section-title{font-family:'Playfair Display',serif;font-size:1.4rem;color:var(--gold);}
.section-count{background:var(--card);border:1px solid var(--border);color:var(--muted);padding:.2rem .7rem;border-radius:20px;font-size:.8rem;}
.stats-bar{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin:2rem 0;padding:1.5rem;background:var(--card);border:1px solid var(--border);border-radius:14px;}
.stat-item{text-align:center}.stat-num{font-family:'Playfair Display',serif;font-size:1.8rem;color:var(--gold);font-weight:700;}
.stat-label{color:var(--muted);font-size:.8rem;margin-top:.2rem}
.cast-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:1rem}
.cast-card{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:1rem;text-align:center;transition:all .25s;}
.cast-card:hover{border-color:var(--gold);transform:translateY(-4px);}
.cast-card a{color:var(--gold);text-decoration:none;}
.cast-img{width:80px;height:80px;border-radius:50%;object-fit:cover;border:2px solid var(--gold);margin:0 auto 0.5rem;}
.cast-name{font-size:.85rem;font-weight:600;color:var(--gold);margin-bottom:.2rem;}
.cast-char{font-size:.75rem;color:var(--muted);}
.cards-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:1rem}
.card{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:1rem;text-decoration:none;color:var(--text);transition:all .25s;display:block;}
.card:hover{border-color:var(--gold);transform:translateY(-4px);text-decoration:none;}
.card-title{font-size:.9rem;color:var(--gold);margin-bottom:.3rem;font-weight:600}
.card-meta{font-size:.77rem;color:var(--muted);line-height:1.5}
.info-table{width:100%;border-collapse:collapse;font-size:.9rem}
.info-table td{padding:.65rem .9rem;border:1px solid var(--border)}
.info-table td:first-child{color:var(--muted);width:32%;background:var(--card2);font-weight:600;}
.info-table td:last-child{background:var(--card);color:var(--text)}
.seasons-table{width:100%;border-collapse:collapse;font-size:.87rem}
.seasons-table th{background:var(--gold);color:#000;padding:.65rem .9rem;text-align:left;font-weight:700;}
.seasons-table td{padding:.65rem .9rem;border:1px solid var(--border)}
.seasons-table tr:nth-child(even) td{background:var(--card2)}.seasons-table tr:nth-child(odd) td{background:var(--card)}
.faq-list{display:flex;flex-direction:column;gap:.8rem}
.faq-item{background:var(--card);border:1px solid var(--border);border-radius:10px;overflow:hidden;}
.faq-q{padding:.9rem 1.2rem;color:var(--gold);font-weight:600;font-size:.93rem;}
.faq-a{padding:.8rem 1.2rem 1rem;color:var(--text);font-size:.9rem;line-height:1.85;border-top:1px solid var(--border);}
.site-footer{background:var(--header);border-top:2px solid var(--border);margin-top:5rem;padding:3rem 1.5rem 1.5rem;}
.footer-inner{max-width:1200px;margin:0 auto}
.footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:2rem;margin-bottom:2rem;}
.footer-col h3{font-family:'Playfair Display',serif;color:var(--gold);font-size:1.2rem;margin-bottom:.8rem;}
.footer-col h4{color:var(--gold);font-size:.85rem;text-transform:uppercase;letter-spacing:1px;margin-bottom:.8rem;}
.footer-col p{color:var(--muted);font-size:.88rem;line-height:1.7}
.footer-col a{display:block;color:var(--muted);font-size:.87rem;padding:.2rem 0;}
.footer-col a:hover{color:var(--gold);text-decoration:none}
.footer-bottom{border-top:1px solid var(--border);padding-top:1.2rem;text-align:center;color:var(--muted);font-size:.83rem;}
.backdrop{width:100%;height:300px;object-fit:cover;border-radius:12px;margin-bottom:2rem;opacity:.7;}
@media(max-width:900px){.drama-hero{grid-template-columns:1fr}.drama-poster{max-width:220px;margin:0 auto}.stats-bar{grid-template-columns:repeat(2,1fr)}.footer-grid{grid-template-columns:1fr 1fr}}
@media(max-width:600px){.drama-name{font-size:1.8rem}.stats-bar{grid-template-columns:1fr 1fr}.footer-grid{grid-template-columns:1fr}.container{padding:1rem}}
`;

const megaHeader = `
<header class="site-header">
  <div class="header-inner">
    <a href="/" class="logo"><span style="font-size:1.6rem">🎬</span><span class="logo-text">EnjoysSeason</span></a>
    <nav style="display:flex;align-items:center;gap:.5rem;flex:1">
      <a href="/category/dramas" style="color:var(--text);padding:.4rem .8rem;border-radius:8px;font-size:.88rem;">📺 Dramas</a>
      <a href="/category/movies" style="color:var(--text);padding:.4rem .8rem;border-radius:8px;font-size:.88rem;">🎬 Movies</a>
      <a href="/category/actors" style="color:var(--text);padding:.4rem .8rem;border-radius:8px;font-size:.88rem;">🎭 Actors</a>
      <a href="/country/south-korea" style="color:var(--text);padding:.4rem .8rem;border-radius:8px;font-size:.88rem;">🇰🇷 K-Drama</a>
      <a href="/country/turkey" style="color:var(--text);padding:.4rem .8rem;border-radius:8px;font-size:.88rem;">🇹🇷 Turkish</a>
      <a href="/country/pakistan" style="color:var(--text);padding:.4rem .8rem;border-radius:8px;font-size:.88rem;">🇵🇰 Pakistani</a>
    </nav>
    <div class="nav-search">
      <input type="text" placeholder="🔍 Search dramas..." class="search-input" id="searchInput">
      <button class="search-btn">Search</button>
    </div>
  </div>
</header>`;

const siteFooter = `
<footer class="site-footer">
  <div class="footer-inner">
    <div class="footer-grid">
      <div class="footer-col">
        <h3>🎬 EnjoysSeason</h3>
        <p>World's complete entertainment database. Actors, movies, dramas from 200+ countries.</p>
      </div>
      <div class="footer-col">
        <h4>📺 Popular Dramas</h4>
        <a href="/dramas/kr">Korean Dramas</a>
        <a href="/dramas/tr">Turkish Dramas</a>
        <a href="/dramas/pk">Pakistani Dramas</a>
        <a href="/dramas/in">Indian Dramas</a>
      </div>
      <div class="footer-col">
        <h4>🎭 Categories</h4>
        <a href="/category/actors">Actors</a>
        <a href="/category/movies">Movies</a>
        <a href="/category/dramas">Dramas</a>
        <a href="/category/anime">Anime</a>
      </div>
      <div class="footer-col">
        <h4>📋 Pages</h4>
        <a href="/about">About Us</a>
        <a href="/privacy-policy">Privacy Policy</a>
        <a href="/sitemap.xml">Sitemap</a>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© ${getYear()} EnjoysSeason — World Actors, Movies, Dramas & Web Series Database</p>
    </div>
  </div>
</footer>`;

const generateDramaPage = (drama) => {
  const year = getYear();
  const airYear = drama.firstAirDate ? drama.firstAirDate.substring(0, 4) : '';
  const genreStr = drama.genres.join(', ');
  const networkStr = drama.networks.join(', ');

  // Find actors in our database for internal linking
  const castWithLinks = drama.cast.map(c => {
    const actor = findActor(c.name);
    return { ...c, actorSlug: actor ? `/actors/${actor.countrySlug}/${actor.slug}` : null };
  });

  // Schema
  const tvSchema = {
    "@context": "https://schema.org",
    "@type": "TVSeries",
    "name": drama.name,
    "alternateName": drama.originalName,
    "url": `https://enjoyseason.com/dramas/${drama.countrySlug}/${drama.slug}`,
    "image": drama.poster,
    "description": drama.overview,
    "datePublished": drama.firstAirDate,
    "genre": drama.genres,
    "numberOfEpisodes": drama.totalEpisodes,
    "numberOfSeasons": drama.totalSeasons,
    "aggregateRating": drama.rating ? {
      "@type": "AggregateRating",
      "ratingValue": drama.rating,
      "bestRating": "10",
      "ratingCount": drama.voteCount
    } : undefined,
    "actor": castWithLinks.slice(0, 5).map(c => ({
      "@type": "Person",
      "name": c.name,
      "url": c.actorSlug ? `https://enjoyseason.com${c.actorSlug}` : undefined
    }))
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `What is ${drama.name} about?`,
        "acceptedAnswer": { "@type": "Answer", "text": drama.overview || `${drama.name} is a popular drama series.` }
      },
      {
        "@type": "Question",
        "name": `How many episodes does ${drama.name} have?`,
        "acceptedAnswer": { "@type": "Answer", "text": `${drama.name} has ${drama.totalEpisodes} episodes across ${drama.totalSeasons} season(s).` }
      },
      {
        "@type": "Question",
        "name": `When did ${drama.name} first air?`,
        "acceptedAnswer": { "@type": "Answer", "text": `${drama.name} first aired on ${drama.firstAirDate} on ${networkStr || 'TV'}.` }
      },
      {
        "@type": "Question",
        "name": `Who are the main cast of ${drama.name}?`,
        "acceptedAnswer": { "@type": "Answer", "text": `The main cast of ${drama.name} includes ${drama.cast.slice(0, 5).map(c => c.name).join(', ')}.` }
      },
      {
        "@type": "Question",
        "name": `What is the rating of ${drama.name}?`,
        "acceptedAnswer": { "@type": "Answer", "text": `${drama.name} has a rating of ${drama.rating}/10 based on ${drama.voteCount} votes on TMDB.` }
      }
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://enjoyseason.com" },
      { "@type": "ListItem", "position": 2, "name": "Dramas", "item": "https://enjoyseason.com/category/dramas" },
      { "@type": "ListItem", "position": 3, "name": drama.name, "item": `https://enjoyseason.com/dramas/${drama.countrySlug}/${drama.slug}` }
    ]
  };

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${drama.name} - Complete Guide | Episodes, Cast, Rating | EnjoysSeason</title>
  <meta name="description" content="${drama.name} (${airYear}) - ${drama.genres.slice(0,3).join(', ')} drama. ${drama.totalEpisodes} episodes, ${drama.totalSeasons} seasons. Rating: ${drama.rating}/10. Cast: ${drama.cast.slice(0,3).map(c=>c.name).join(', ')}. Full guide on EnjoysSeason.">
  <meta name="keywords" content="${drama.name}, ${drama.originalName}, ${genreStr}, ${networkStr}, drama ${airYear}, watch online">
  <meta property="og:title" content="${drama.name} - ${airYear} | EnjoysSeason">
  <meta property="og:description" content="${drama.overview ? drama.overview.substring(0, 200) : drama.name + ' - Complete drama guide'}">
  <meta property="og:image" content="${drama.poster}">
  <meta property="og:url" content="https://enjoyseason.com/dramas/${drama.countrySlug}/${drama.slug}">
  <meta property="og:type" content="video.tv_show">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="canonical" href="https://enjoyseason.com/dramas/${drama.countrySlug}/${drama.slug}">
  <script type="application/ld+json">${JSON.stringify(tvSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(faqSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>
  <style>${css}</style>
</head>
<body>

${megaHeader}

<div class="breadcrumb">
  <div class="breadcrumb-inner">
    <a href="/">Home</a><span class="sep">›</span>
    <a href="/category/dramas">Dramas</a><span class="sep">›</span>
    <a href="/dramas/${drama.countrySlug}">${drama.originCountry} Dramas</a><span class="sep">›</span>
    <span>${drama.name}</span>
  </div>
</div>

<div class="container">

  ${drama.backdrop ? `<img src="${drama.backdrop}" alt="${drama.name} backdrop" class="backdrop" loading="lazy">` : ''}

  <!-- HERO -->
  <div class="drama-hero">
    <div>
      ${drama.poster ? `<img src="${drama.poster}" alt="${drama.name} poster" class="drama-poster" loading="lazy">` : ''}
      ${drama.rating ? `<div class="rating-box" style="margin-top:1rem">⭐ ${drama.rating}/10 <span style="font-size:.8rem;font-weight:400">(${drama.voteCount.toLocaleString()} votes)</span></div>` : ''}
    </div>
    <div>
      <h1 class="drama-name">${drama.name}</h1>
      ${drama.originalName !== drama.name ? `<p style="color:var(--muted);font-size:.95rem;margin-bottom:.5rem">${drama.originalName}</p>` : ''}
      ${drama.tagline ? `<p class="drama-tagline">"${drama.tagline}"</p>` : ''}

      <div class="badges">
        <span class="badge">🌍 <strong>${drama.originCountry}</strong></span>
        <span class="badge">📅 <strong>${airYear}</strong></span>
        <span class="badge badge-gold">📺 <strong>${drama.totalSeasons} Seasons</strong></span>
        <span class="badge badge-green">🎬 <strong>${drama.totalEpisodes} Episodes</strong></span>
        <span class="badge">⚡ <strong>${drama.status}</strong></span>
        ${drama.genres.slice(0, 3).map(g => `<span class="badge">🎭 ${g}</span>`).join('')}
        ${drama.networks.slice(0, 2).map(n => `<span class="badge">📡 ${n}</span>`).join('')}
      </div>

      <div class="overview-box">
        <strong>📖 About ${drama.name}</strong>
        ${drama.overview || `${drama.name} is a captivating drama series that has gained massive popularity worldwide.`}
      </div>

      <div style="display:flex;gap:.7rem;flex-wrap:wrap;margin-top:1rem">
        ${drama.homepage ? `<a href="${drama.homepage}" class="badge badge-gold" target="_blank" rel="nofollow">🌐 Official Site</a>` : ''}
        <a href="/dramas/${drama.countrySlug}" class="badge">More ${drama.originCountry} Dramas →</a>
      </div>
    </div>
  </div>

  <!-- STATS -->
  <div class="stats-bar">
    <div class="stat-item">
      <div class="stat-num">${drama.totalSeasons}</div>
      <div class="stat-label">Seasons</div>
    </div>
    <div class="stat-item">
      <div class="stat-num">${drama.totalEpisodes}</div>
      <div class="stat-label">Episodes</div>
    </div>
    <div class="stat-item">
      <div class="stat-num">${drama.rating || 'N/A'}</div>
      <div class="stat-label">Rating</div>
    </div>
    <div class="stat-item">
      <div class="stat-num">${airYear}</div>
      <div class="stat-label">Year</div>
    </div>
  </div>

  <!-- QUICK INFO -->
  <div class="section">
    <div class="section-header">
      <h2 class="section-title">📋 ${drama.name} — Quick Info</h2>
    </div>
    <table class="info-table">
      <tr><td>Title</td><td>${drama.name}</td></tr>
      ${drama.originalName !== drama.name ? `<tr><td>Original Title</td><td>${drama.originalName}</td></tr>` : ''}
      <tr><td>Genre</td><td>${genreStr || 'Drama'}</td></tr>
      <tr><td>Network</td><td>${networkStr || 'N/A'}</td></tr>
      <tr><td>First Air Date</td><td>${drama.firstAirDate || 'N/A'}</td></tr>
      <tr><td>Last Air Date</td><td>${drama.lastAirDate || 'N/A'}</td></tr>
      <tr><td>Status</td><td>${drama.status || 'N/A'}</td></tr>
      <tr><td>Total Seasons</td><td>${drama.totalSeasons}</td></tr>
      <tr><td>Total Episodes</td><td>${drama.totalEpisodes}</td></tr>
      <tr><td>Origin Country</td><td>${drama.originCountry}</td></tr>
      <tr><td>Language</td><td>${drama.originalLanguage?.toUpperCase() || 'N/A'}</td></tr>
      <tr><td>Rating</td><td>${drama.rating ? `⭐ ${drama.rating}/10 (${drama.voteCount} votes)` : 'N/A'}</td></tr>
      ${drama.type ? `<tr><td>Type</td><td>${drama.type}</td></tr>` : ''}
    </table>
  </div>

  <!-- SEASONS -->
  ${drama.seasons.length ? `
  <div class="section">
    <div class="section-header">
      <h2 class="section-title">📺 ${drama.name} — All Seasons</h2>
      <span class="section-count">${drama.totalSeasons} Seasons</span>
    </div>
    <table class="seasons-table">
      <tr><th>#</th><th>Season Name</th><th>Episodes</th><th>Air Date</th></tr>
      ${drama.seasons.map(s => `
      <tr>
        <td>Season ${s.number}</td>
        <td>${s.name}</td>
        <td>${s.episodes} Episodes</td>
        <td>${s.airDate || '-'}</td>
      </tr>`).join('')}
    </table>
  </div>` : ''}

  <!-- CAST -->
  ${drama.cast.length ? `
  <div class="section">
    <div class="section-header">
      <h2 class="section-title">🎭 ${drama.name} — Full Cast</h2>
      <span class="section-count">${drama.cast.length} Cast Members</span>
    </div>
    <div class="cast-grid">
      ${castWithLinks.map(c => `
      <div class="cast-card">
        <img src="${c.image || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(c.name) + '&size=80&background=1e293b&color=f59e0b'}" 
             alt="${c.name}" class="cast-img" loading="lazy"
             onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&size=80&background=1e293b&color=f59e0b'">
        ${c.actorSlug ? 
          `<div class="cast-name"><a href="${c.actorSlug}">${c.name}</a></div>` :
          `<div class="cast-name">${c.name}</div>`
        }
        <div class="cast-char">${c.character || 'Cast'}</div>
      </div>`).join('')}
    </div>
  </div>` : ''}

  <!-- SIMILAR DRAMAS -->
  ${drama.similar.length ? `
  <div class="section">
    <div class="section-header">
      <h2 class="section-title">📺 Similar to ${drama.name}</h2>
    </div>
    <div class="cards-grid">
      ${drama.similar.map(s => `
      <a href="/dramas/${makeSlug(s.name.charAt(0))}/${s.slug}" class="card">
        <div class="card-title">${s.name}</div>
        <div class="card-meta">Similar Drama</div>
      </a>`).join('')}
    </div>
  </div>` : ''}

  <!-- FAQ -->
  <div class="section">
    <div class="section-header">
      <h2 class="section-title">❓ FAQ about ${drama.name}</h2>
    </div>
    <div class="faq-list">
      <div class="faq-item">
        <div class="faq-q">What is ${drama.name} about?</div>
        <div class="faq-a">${drama.overview || drama.name + ' is a popular drama series with ' + drama.totalEpisodes + ' episodes.'}</div>
      </div>
      <div class="faq-item">
        <div class="faq-q">How many episodes does ${drama.name} have?</div>
        <div class="faq-a">${drama.name} has a total of ${drama.totalEpisodes} episodes spread across ${drama.totalSeasons} season(s). It first aired on ${drama.firstAirDate || 'N/A'}.</div>
      </div>
      <div class="faq-item">
        <div class="faq-q">Who stars in ${drama.name}?</div>
        <div class="faq-a">The main cast of ${drama.name} includes ${drama.cast.slice(0, 5).map(c => c.name).join(', ')}.</div>
      </div>
      <div class="faq-item">
        <div class="faq-q">What is the rating of ${drama.name}?</div>
        <div class="faq-a">${drama.name} has a rating of ${drama.rating}/10 based on ${drama.voteCount?.toLocaleString()} votes. It is a ${drama.status?.toLowerCase()} ${drama.genres[0] || 'drama'} series.</div>
      </div>
      <div class="faq-item">
        <div class="faq-q">Where can I watch ${drama.name}?</div>
        <div class="faq-a">${drama.name} airs on ${networkStr || 'major TV networks'}. ${drama.homepage ? `Visit the official website: ${drama.homepage}` : 'Check your local streaming platforms for availability.'}</div>
      </div>
      <div class="faq-item">
        <div class="faq-q">What genre is ${drama.name}?</div>
        <div class="faq-a">${drama.name} is a ${genreStr} series from ${drama.originCountry}. It features ${drama.cast.slice(0,3).map(c=>c.name).join(', ')} in lead roles.</div>
      </div>
    </div>
  </div>

</div>

${siteFooter}

<script>
document.getElementById('searchInput')?.addEventListener('keypress', function(e){
  if(e.key === 'Enter'){ const q = this.value.trim(); if(q) window.location.href = '/search?q=' + encodeURIComponent(q); }
});
</script>
</body>
</html>`;

  const dir = `./dramas/${drama.countrySlug}`;
  makeDir(dir);
  fs.writeFileSync(`${dir}/${drama.slug}.html`, html);
  allUrls.push({ url: `/dramas/${drama.countrySlug}/${drama.slug}`, priority: '0.8', freq: 'weekly' });
  totalPages++;
};

// Generate all drama pages
console.log('\n🚀 Generating Drama Pages...\n' + '='.repeat(45));
dramas.forEach(generateDramaPage);
console.log(`✅ Drama pages generated: ${totalPages}`);

// Update sitemap
let existingUrls = [];
if (fs.existsSync('sitemap.xml')) {
  const sitemapContent = fs.readFileSync('sitemap.xml', 'utf8');
  const matches = sitemapContent.match(/<loc>(.*?)<\/loc>/g) || [];
  existingUrls = matches.map(m => m.replace(/<\/?loc>/g, '').replace('https://enjoyseason.com', ''));
}

const allUrlsCombined = [...new Set([...existingUrls, ...allUrls.map(u => u.url)])];
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${allUrlsCombined.map(u => `  <url>\n    <loc>https://enjoyseason.com${u}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`).join('\n')}\n</urlset>`;
fs.writeFileSync('./sitemap.xml', xml);
console.log(`✅ Sitemap updated: ${allUrlsCombined.length} URLs`);
console.log('='.repeat(45));
console.log(`\n🎉 TOTAL: ${totalPages} drama pages\n`);
console.log('📦 git add . && git commit -m "add drama pages" && git push\n');
