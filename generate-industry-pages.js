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
.hero-banner{background:linear-gradient(135deg,var(--card2),var(--card));border-bottom:2px solid var(--gold);padding:3rem 1.5rem;}
.hero-inner{max-width:1200px;margin:0 auto;}
.hero-title{font-family:'Playfair Display',serif;font-size:3rem;color:var(--gold);margin-bottom:.5rem;}
.hero-sub{color:var(--muted);font-size:1.1rem;margin-bottom:1.5rem;}
.hero-stats{display:flex;gap:2rem;flex-wrap:wrap;}
.hero-stat{text-align:center;background:var(--bg);border:1px solid var(--border);border-radius:10px;padding:.8rem 1.5rem;}
.hero-stat-n{font-size:1.6rem;color:var(--gold);font-weight:700;font-family:'Playfair Display',serif;}
.hero-stat-l{font-size:.8rem;color:var(--muted);}
.container{max-width:1200px;margin:0 auto;padding:2rem 1.5rem}
.section{margin:3rem 0}
.section-title{font-family:'Playfair Display',serif;font-size:1.5rem;color:var(--gold);margin-bottom:1.2rem;padding-bottom:.6rem;border-bottom:2px solid var(--border);}
.prose{background:var(--card2);border-left:4px solid var(--gold);border-radius:0 12px 12px 0;padding:1.2rem 1.4rem;margin:1.5rem 0;font-size:.97rem;line-height:1.95;color:var(--text);}
.prose strong{color:var(--gold);display:block;margin-bottom:.4rem;}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:1rem;}
.card{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:1rem;text-decoration:none;color:var(--text);transition:all .25s;display:block;}
.card:hover{border-color:var(--gold);transform:translateY(-4px);text-decoration:none;}
.card img{width:100%;height:130px;object-fit:cover;border-radius:8px;margin-bottom:.5rem;}
.card-title{font-size:.88rem;color:var(--gold);font-weight:600;margin-bottom:.2rem;line-height:1.3;}
.card-meta{font-size:.75rem;color:var(--muted);}
.drama-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:1rem;}
.drama-card{background:var(--card);border:1px solid var(--border);border-radius:12px;overflow:hidden;text-decoration:none;color:var(--text);transition:all .25s;display:block;}
.drama-card:hover{border-color:var(--gold);transform:translateY(-4px);text-decoration:none;}
.drama-card img{width:100%;height:220px;object-fit:cover;}
.drama-card-info{padding:.8rem;}
.drama-card-title{font-size:.85rem;color:var(--gold);font-weight:600;margin-bottom:.2rem;}
.drama-card-meta{font-size:.75rem;color:var(--muted);}
.site-footer{background:var(--header);border-top:2px solid var(--border);margin-top:5rem;padding:3rem 1.5rem 1.5rem;}
.footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:2rem;margin-bottom:2rem;max-width:1200px;margin:0 auto 2rem;}
.footer-col h3{font-family:'Playfair Display',serif;color:var(--gold);font-size:1.2rem;margin-bottom:.8rem;}
.footer-col h4{color:var(--gold);font-size:.85rem;text-transform:uppercase;letter-spacing:1px;margin-bottom:.8rem;}
.footer-col p{color:var(--muted);font-size:.88rem;line-height:1.7}
.footer-col a{display:block;color:var(--muted);font-size:.87rem;padding:.2rem 0;}
.footer-col a:hover{color:var(--gold);text-decoration:none}
.footer-bottom{border-top:1px solid var(--border);padding-top:1.2rem;text-align:center;color:var(--muted);font-size:.83rem;max-width:1200px;margin:0 auto;}
@media(max-width:600px){.hero-title{font-size:2rem}.grid{grid-template-columns:repeat(2,1fr)}.footer-grid{grid-template-columns:1fr}}
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
      <h4>🎬 Industries</h4>
      <a href="/industry/bollywood">Bollywood</a>
      <a href="/industry/hollywood">Hollywood</a>
      <a href="/industry/lollywood">Lollywood</a>
      <a href="/industry/korean">K-Drama</a>
      <a href="/industry/turkish">Turkish</a>
      <a href="/industry/anime">Anime</a>
    </div>
    <div class="footer-col">
      <h4>🎭 Categories</h4>
      <a href="/category/actors">All Actors</a>
      <a href="/category/movies">All Movies</a>
      <a href="/category/dramas">All Dramas</a>
      <a href="/category/web-series">Web Series</a>
    </div>
    <div class="footer-col">
      <h4>📋 Pages</h4>
      <a href="/about">About Us</a>
      <a href="/contact">Contact</a>
      <a href="/privacy-policy">Privacy Policy</a>
      <a href="/sitemap.xml">Sitemap</a>
    </div>
  </div>
  <div class="footer-bottom">© ${getYear()} EnjoysSeason — World Entertainment Database</div>
</footer>`;

// Industry data
const industries = [
  {
    slug: 'bollywood',
    name: 'Bollywood',
    flag: '🇮🇳',
    country: 'India',
    countrySlug: 'india',
    language: 'Hindi',
    capital: 'Mumbai',
    description: 'Bollywood is the Hindi-language film industry based in Mumbai, India. It is the largest film producer in India and one of the largest in the world. The term "Bollywood" is a portmanteau of Bombay (former name of Mumbai) and Hollywood. Bollywood produces over 1,000 films annually and has a massive global audience, particularly in South Asia, the Middle East, and among Indian diaspora worldwide.',
    facts: [
      'Largest film industry in the world by number of films produced',
      'Based in Mumbai (formerly Bombay), Maharashtra, India',
      'Hindi language is primary, with some Urdu influences',
      'Known for colorful song and dance sequences',
      'Major stars include Shah Rukh Khan, Salman Khan, Aamir Khan, Deepika Padukone'
    ],
    keywords: 'Bollywood, Indian cinema, Hindi films, Mumbai film industry, Bollywood actors'
  },
  {
    slug: 'hollywood',
    name: 'Hollywood',
    flag: '🇺🇸',
    country: 'USA',
    countrySlug: 'usa',
    language: 'English',
    capital: 'Los Angeles',
    description: 'Hollywood is the American film industry centered in Los Angeles, California. It is the oldest and most influential film industry in the world, producing hundreds of films annually. Hollywood studios like Warner Bros, Universal, Disney, Sony, and Paramount dominate global cinema and television production. Hollywood films are distributed worldwide and have shaped global entertainment culture.',
    facts: [
      'Largest film industry by global revenue',
      'Based in Los Angeles, California, USA',
      'Home to major studios: Disney, Warner Bros, Universal, Sony, Paramount',
      'Oscar Awards (Academy Awards) are given annually',
      'Stars include Tom Hanks, Leonardo DiCaprio, Meryl Streep, Dwayne Johnson'
    ],
    keywords: 'Hollywood, American cinema, USA films, Oscar, Academy Awards, Hollywood actors'
  },
  {
    slug: 'lollywood',
    name: 'Lollywood',
    flag: '🇵🇰',
    country: 'Pakistan',
    countrySlug: 'pakistan',
    language: 'Urdu',
    capital: 'Lahore',
    description: 'Lollywood is the Pakistani film and television industry, named after Lahore — the cultural capital of Pakistan. The industry produces films and dramas primarily in Urdu and Punjabi languages. Pakistani dramas aired on channels like HUM TV, ARY Digital, and Geo TV are internationally acclaimed for their storytelling and acting quality. Popular dramas like Humsafar, Zindagi Gulzar Hai, and Mere Qatil Mere Dildar have gained massive international followings.',
    facts: [
      'Named after Lahore, the cultural capital of Pakistan',
      'Primarily Urdu and Punjabi language productions',
      'HUM TV, ARY Digital, Geo TV are major channels',
      'Pakistani dramas are internationally popular',
      'Stars include Fawad Khan, Mahira Khan, Hamza Ali Abbasi, Sajal Ali'
    ],
    keywords: 'Lollywood, Pakistani cinema, Urdu dramas, HUM TV, ARY Digital, Pakistani actors'
  },
  {
    slug: 'korean',
    name: 'K-Drama',
    flag: '🇰🇷',
    country: 'South Korea',
    countrySlug: 'south-korea',
    language: 'Korean',
    capital: 'Seoul',
    description: 'K-Drama refers to Korean television dramas produced in South Korea. The Korean Wave (Hallyu) has made K-Dramas enormously popular worldwide, especially after the global success of shows like Squid Game, Crash Landing on You, and Descendants of the Sun. K-Dramas are known for their high production quality, compelling storylines, and talented actors. Netflix and other streaming platforms have accelerated K-Drama global expansion.',
    facts: [
      'Part of the Korean Wave (Hallyu) cultural phenomenon',
      'Netflix is a major distributor of K-Dramas globally',
      'Known for high production quality and compelling stories',
      'Squid Game became the most-watched Netflix show ever',
      'Stars include Lee Min-ho, Song Joong-ki, Park Shin-hye, Jun Ji-hyun'
    ],
    keywords: 'K-Drama, Korean dramas, Korean Wave, Hallyu, Korean actors, Seoul'
  },
  {
    slug: 'turkish',
    name: 'Turkish Drama',
    flag: '🇹🇷',
    country: 'Turkey',
    countrySlug: 'turkey',
    language: 'Turkish',
    capital: 'Istanbul',
    description: 'Turkish dramas (Dizi) have become a global phenomenon, particularly popular in the Middle East, Latin America, South Asia, and Eastern Europe. Turkey is the second largest TV series exporter in the world after the USA. Shows like Dirilis Ertugrul, Kara Sevda, and Cesur ve Guzel have gained massive international audiences. Turkish productions are known for their high quality cinematography, strong storylines, and beautiful locations.',
    facts: [
      'Turkey is world\'s 2nd largest TV series exporter',
      'Turkish dramas are dubbed in Arabic, Urdu, Spanish and many languages',
      'Dirilis Ertugrul gained massive popularity in Pakistan and Middle East',
      'Istanbul is the primary filming location',
      'Stars include Engin Altan Duzyatan, Kıvanç Tatlıtuğ, Tuba Büyüküstün'
    ],
    keywords: 'Turkish dramas, Dizi, Turkey TV series, Dirilis Ertugrul, Turkish actors'
  },
  {
    slug: 'anime',
    name: 'Anime',
    flag: '🎌',
    country: 'Japan',
    countrySlug: 'japan',
    language: 'Japanese',
    capital: 'Tokyo',
    description: 'Anime is Japanese-style animation that has become a global cultural phenomenon. From classic series like Dragon Ball and Naruto to modern hits like Attack on Titan and Demon Slayer, anime covers every genre imaginable. Japanese animation studios like Studio Ghibli, Toei Animation, and Ufotable produce world-class content. The global anime market is worth billions of dollars with fans worldwide.',
    facts: [
      'Japan produces over 200 new anime series every year',
      'Global anime market worth over $25 billion',
      'Studio Ghibli films have won Academy Awards',
      'Dragon Ball, Naruto, One Piece are among most popular series ever',
      'Netflix, Crunchyroll, Funimation stream anime globally'
    ],
    keywords: 'Anime, Japanese animation, manga, Studio Ghibli, Tokyo, anime series'
  },
  {
    slug: 'tollywood',
    name: 'Tollywood',
    flag: '🇮🇳',
    country: 'India',
    countrySlug: 'india',
    language: 'Telugu/Bengali',
    capital: 'Hyderabad',
    description: 'Tollywood refers to two separate Indian film industries — the Telugu-language film industry based in Hyderabad (also called "T-Town") and the Bengali-language film industry based in Kolkata. The Telugu film industry is one of the largest in India, producing blockbuster films like RRR, Baahubali, and Pushpa that have achieved massive international success. These films are known for their spectacular action sequences, drama, and music.',
    facts: [
      'Telugu cinema is one of the highest-grossing in India',
      'Baahubali became the highest-grossing Indian film of its time',
      'RRR won the Academy Award for Best Original Song',
      'Based in Hyderabad (Telugu) and Kolkata (Bengali)',
      'Stars include Prabhas, Ram Charan, Allu Arjun, Jr NTR'
    ],
    keywords: 'Tollywood, Telugu cinema, Bengali cinema, Hyderabad, Baahubali, RRR'
  }
];

industries.forEach(industry => {
  const industryActors = actors.filter(a => a.country === industry.country).slice(0, 24);
  const industryDramas = dramas.filter(d => 
    d.originCountry === (industry.country === 'USA' ? 'US' : 
                        industry.country === 'South Korea' ? 'KR' :
                        industry.country === 'Japan' ? 'JP' :
                        industry.country === 'Turkey' ? 'TR' :
                        industry.country === 'Pakistan' ? 'PK' :
                        industry.country === 'India' ? 'IN' : 'US')
  ).slice(0, 24);

  makeDir(`industry/${industry.slug}`);

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": `${industry.name} — ${industry.flag} ${industry.country} Film Industry`,
    "description": industry.description.substring(0, 200),
    "url": `https://enjoyseason.com/industry/${industry.slug}`,
    "about": {
      "@type": "Thing",
      "name": industry.name,
      "description": industry.description.substring(0, 200)
    }
  };

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${industry.name} ${industry.flag} — Complete ${industry.country} Film Industry Guide | EnjoysSeason</title>
  <meta name="description" content="${industry.name}: Complete ${industry.country} film industry database. ${industryActors.length} actors, dramas, movies in ${industry.language}. ${industry.facts[0]}.">
  <meta name="keywords" content="${industry.keywords}">
  <meta property="og:title" content="${industry.name} — ${industry.country} Film Industry | EnjoysSeason">
  <meta property="og:description" content="${industry.description.substring(0, 200)}">
  <meta property="og:url" content="https://enjoyseason.com/industry/${industry.slug}">
  <link rel="canonical" href="https://enjoyseason.com/industry/${industry.slug}">
  <script type="application/ld+json">${JSON.stringify(schemaData)}</script>
  <style>${css}</style>
</head>
<body>

${header}

<div class="breadcrumb">
  <div class="breadcrumb-inner">
    <a href="/">Home</a><span class="sep">›</span>
    <a href="/category/movies">Movies</a><span class="sep">›</span>
    <span>${industry.name}</span>
  </div>
</div>

<div class="hero-banner">
  <div class="hero-inner">
    <h1 class="hero-title">${industry.flag} ${industry.name}</h1>
    <p class="hero-sub">${industry.country} Film & Television Industry — ${industry.language} Language Productions</p>
    <div class="hero-stats">
      <div class="hero-stat">
        <div class="hero-stat-n">${industryActors.length}+</div>
        <div class="hero-stat-l">Actors</div>
      </div>
      <div class="hero-stat">
        <div class="hero-stat-n">${industryDramas.length}+</div>
        <div class="hero-stat-l">Dramas/Shows</div>
      </div>
      <div class="hero-stat">
        <div class="hero-stat-n">${industry.language}</div>
        <div class="hero-stat-l">Language</div>
      </div>
      <div class="hero-stat">
        <div class="hero-stat-n">${industry.capital}</div>
        <div class="hero-stat-l">Film Capital</div>
      </div>
    </div>
  </div>
</div>

<div class="container">

  <div class="prose">
    <strong>About ${industry.name}</strong>
    ${industry.description}
  </div>

  <div class="prose">
    <strong>Key Facts about ${industry.name}</strong>
    <ul style="margin-left:1.2rem;margin-top:.5rem">
      ${industry.facts.map(f => `<li style="margin-bottom:.4rem">${f}</li>`).join('')}
    </ul>
  </div>

  <!-- ACTORS -->
  ${industryActors.length ? `
  <div class="section">
    <h2 class="section-title">🎭 Popular ${industry.name} Actors</h2>
    <div class="grid">
      ${industryActors.map(a => `
      <a href="/actors/${a.countrySlug}/${a.slug}" class="card">
        ${a.image ? `<img src="${a.image}" alt="${a.name}" loading="lazy" onerror="this.style.display='none'">` : ''}
        <div class="card-title">${a.name}</div>
        <div class="card-meta">${a.nationality} · ${cleanProfession(a.profession)[0]||'Actor'}</div>
      </a>`).join('')}
    </div>
    <p style="margin-top:1rem"><a href="/country/${industry.countrySlug}">View all ${industry.country} actors →</a></p>
  </div>` : ''}

  <!-- DRAMAS -->
  ${industryDramas.length ? `
  <div class="section">
    <h2 class="section-title">📺 Popular ${industry.name} Dramas & Shows</h2>
    <div class="drama-grid">
      ${industryDramas.map(d => `
      <a href="/dramas/${d.countrySlug}/${d.slug}" class="drama-card">
        ${d.poster ? `<img src="${d.poster}" alt="${d.name}" loading="lazy">` : ''}
        <div class="drama-card-info">
          <div class="drama-card-title">${d.name}</div>
          <div class="drama-card-meta">${d.genres[0]||'Drama'} · ⭐${d.rating||'N/A'}</div>
        </div>
      </a>`).join('')}
    </div>
  </div>` : ''}

  <!-- RELATED INDUSTRIES -->
  <div class="section">
    <h2 class="section-title">🎬 Other Film Industries</h2>
    <div class="grid">
      ${industries.filter(i => i.slug !== industry.slug).map(i => `
      <a href="/industry/${i.slug}" class="card">
        <div class="card-title">${i.flag} ${i.name}</div>
        <div class="card-meta">${i.country} · ${i.language}</div>
      </a>`).join('')}
    </div>
  </div>

</div>

${footer}
</body>
</html>`;

  fs.writeFileSync(`industry/${industry.slug}/index.html`, html);
  console.log(`✅ industry/${industry.slug}/index.html`);
});

console.log('\n🎉 All industry pages generated!');
console.log('Run: git add . && git commit -m "add industry pages" && git push origin main');
