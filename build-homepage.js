const fs = require('fs');

const actors = JSON.parse(fs.readFileSync('data/actors.json', 'utf8'));
const dramas = JSON.parse(fs.readFileSync('data/dramas-full.json', 'utf8'));

const featuredActors = actors.filter(a => a.image).slice(0, 12);
const featuredDramas = dramas.filter(d => d.poster).slice(0, 12);

const actorsHTML = featuredActors.map(a =>
  '<a href="/actors/' + a.countrySlug + '/' + a.slug + '" class="home-actor-card" role="listitem">' +
  '<div class="home-card-img-wrap"><img src="' + a.image + '" alt="' + a.name + '" class="home-card-img" loading="lazy"></div>' +
  '<div class="home-card-body"><div class="home-card-title">' + a.name + '</div>' +
  '<div class="home-card-meta">' + a.nationality + ' &middot; ' + (a.profession||['Actor'])[0] + '</div></div></a>'
).join('\n');

const dramasHTML = featuredDramas.map(d =>
  '<a href="/dramas/' + d.countrySlug + '/' + d.slug + '" class="home-media-card" role="listitem">' +
  '<div class="home-media-img-wrap"><img src="' + d.poster + '" alt="' + d.name + '" class="home-media-img" loading="lazy"></div>' +
  '<div class="home-media-body"><div class="home-media-title">' + d.name + '</div>' +
  '<div class="home-media-meta">' + d.originCountry + ' &middot; ' + (d.genres[0]||'Drama') + '</div></div></a>'
).join('\n');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="google-site-verification" content="1ktsrqlAfrYoCFCQKy_GdHjBtiHQCHkCY9_88LcZL-Y">
  <title>EnjoysSeason &ndash; World Actors, Movies, Dramas &amp; Web Series Database</title>
  <meta name="description" content="Explore ${actors.length.toLocaleString()} actors, movies, and TV dramas from 200+ countries. Biographies, ratings, posters, and full profiles on EnjoysSeason.">
  <link rel="canonical" href="https://enjoyseason.com/">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "EnjoysSeason",
    "url": "https://enjoyseason.com",
    "description": "World's complete entertainment database with ${actors.length.toLocaleString()} actors from 200+ countries.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://enjoyseason.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }
  </script>
  <style>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Source+Sans+3:wght@300;400;600&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
:root{
  --bg:#08091a;--bg2:#0c1024;--card:#131629;--card2:#1a1f38;
  --gold:#f5a623;--gold2:#c98a1a;--text:#f1f5f9;--muted:#94a3b8;
  --border:#1e3a5f;--header:#08091a;
}
body{background:var(--bg);color:var(--text);font-family:'Source Sans 3',sans-serif;line-height:1.8;font-size:16px;}
a{color:var(--gold);text-decoration:none}a:hover{text-decoration:underline}
.site-header{background:var(--header);border-bottom:2px solid var(--gold);position:sticky;top:0;z-index:1000;box-shadow:0 4px 20px rgba(0,0,0,.5);}
.header-inner{max-width:1400px;margin:0 auto;padding:.8rem 1.5rem;display:flex;align-items:center;gap:1.5rem;}
.logo{display:flex;align-items:center;gap:.5rem;text-decoration:none;flex-shrink:0;}
.logo-icon{font-size:1.6rem}.logo-text{font-family:'Playfair Display',serif;font-size:1.4rem;color:var(--gold);font-weight:900;}
.main-nav{display:flex;align-items:center;gap:.3rem;flex:1;}
.nav-item{position:relative}
.nav-btn{background:transparent;border:1px solid transparent;color:var(--text);padding:.45rem .9rem;border-radius:8px;cursor:pointer;font-size:.88rem;font-family:'Source Sans 3',sans-serif;transition:all .2s;}
.nav-btn:hover{border-color:var(--gold);color:var(--gold);}
.dropdown-menu{display:none;position:absolute;top:calc(100% + 8px);left:0;background:var(--card);border:1px solid var(--border);border-radius:12px;padding:1.2rem;min-width:220px;box-shadow:0 20px 60px rgba(0,0,0,.6);z-index:999;}
.mega-menu{display:none;left:-100px;min-width:700px;flex-direction:row;gap:1.5rem;}
.nav-item:hover .dropdown-menu{display:flex;flex-direction:column}
.nav-item:hover .mega-menu{display:flex;flex-direction:row}
.mega-col,.drop-col{flex:1;min-width:140px}
.dropdown-menu h4{color:var(--gold);font-size:.78rem;text-transform:uppercase;letter-spacing:1px;margin-bottom:.6rem;padding-bottom:.4rem;border-bottom:1px solid var(--border);}
.dropdown-menu a{display:block;color:var(--muted);padding:.25rem 0;font-size:.85rem;}
.dropdown-menu a:hover{color:var(--gold);text-decoration:none}
.nav-search{display:flex;gap:.4rem;margin-left:auto}
.search-input{background:var(--card);border:1px solid var(--border);color:var(--text);padding:.4rem .9rem;border-radius:8px;font-size:.85rem;width:260px;font-family:'Source Sans 3',sans-serif;}
.search-input:focus{outline:none;border-color:var(--gold)}
.search-btn{background:var(--gold);color:#000;border:none;padding:.4rem .9rem;border-radius:8px;cursor:pointer;font-weight:600;font-size:.85rem;}
.mobile-menu-btn{display:none;background:transparent;border:1px solid var(--border);color:var(--text);padding:.4rem .7rem;border-radius:6px;cursor:pointer;font-size:1.1rem;margin-left:auto;}
.mobile-nav{display:none;flex-direction:column;padding:1rem 1.5rem;border-top:1px solid var(--border);gap:.3rem;}
.mobile-nav a{color:var(--muted);padding:.4rem 0;font-size:.9rem;border-bottom:1px solid rgba(255,255,255,.05);}
.hero{background:linear-gradient(135deg,#08091a 0%,#0d1535 50%,#08091a 100%);padding:4rem 1.5rem;text-align:center;border-bottom:1px solid var(--border);}
.hero-inner{max-width:900px;margin:0 auto;}
.hero-title{font-family:'Playfair Display',serif;font-size:3rem;color:var(--gold);margin-bottom:1rem;line-height:1.2;}
.hero-sub{color:var(--muted);font-size:1.1rem;margin-bottom:2rem;max-width:600px;margin-left:auto;margin-right:auto;}
.hero-btns{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;}
.btn-primary{background:var(--gold);color:#000;padding:.8rem 1.8rem;border-radius:8px;font-weight:700;font-size:.95rem;}
.btn-primary:hover{background:var(--gold2);text-decoration:none}
.btn-secondary{border:1px solid var(--gold);color:var(--gold);padding:.8rem 1.8rem;border-radius:8px;font-weight:600;font-size:.95rem;}
.hero-stats{display:flex;gap:3rem;justify-content:center;margin-top:2.5rem;flex-wrap:wrap;}
.hero-stat{text-align:center;}
.hero-stat-n{font-family:'Playfair Display',serif;font-size:2rem;color:var(--gold);font-weight:700;}
.hero-stat-l{color:var(--muted);font-size:.85rem;}
.container{max-width:1300px;margin:0 auto;padding:2.5rem 1.5rem;}
.section{margin:3rem 0;}
.section-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.5rem;padding-bottom:.7rem;border-bottom:2px solid var(--border);}
.section-title{font-family:'Playfair Display',serif;font-size:1.5rem;color:var(--gold);}
.view-all{font-size:.85rem;color:var(--gold);border:1px solid var(--gold);padding:.3rem .8rem;border-radius:6px;}
.view-all:hover{background:var(--gold);color:#000;text-decoration:none}
.home-feature-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:1.2rem;}
.home-actor-card{background:var(--card);border:1px solid var(--border);border-radius:14px;overflow:hidden;text-decoration:none;color:var(--text);transition:all .25s;display:block;}
.home-actor-card:hover{border-color:var(--gold);transform:translateY(-5px);box-shadow:0 10px 30px rgba(245,166,35,.15);text-decoration:none;}
.home-card-img-wrap{width:100%;aspect-ratio:3/4;overflow:hidden;background:var(--card2);}
.home-card-img{width:100%;height:100%;object-fit:cover;transition:transform .3s;}
.home-actor-card:hover .home-card-img{transform:scale(1.05);}
.home-card-body{padding:.8rem 1rem 1rem;}
.home-card-title{font-size:.9rem;color:var(--gold);font-weight:600;margin-bottom:.2rem;line-height:1.3;}
.home-card-meta{font-size:.78rem;color:var(--muted);}
.home-media-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:1.2rem;}
.home-media-card{background:var(--card);border:1px solid var(--border);border-radius:14px;overflow:hidden;text-decoration:none;color:var(--text);transition:all .25s;display:block;}
.home-media-card:hover{border-color:var(--gold);transform:translateY(-5px);box-shadow:0 10px 30px rgba(245,166,35,.15);text-decoration:none;}
.home-media-img-wrap{width:100%;aspect-ratio:2/3;overflow:hidden;background:var(--card2);}
.home-media-img{width:100%;height:100%;object-fit:cover;transition:transform .3s;}
.home-media-card:hover .home-media-img{transform:scale(1.05);}
.home-media-body{padding:.8rem 1rem;}
.home-media-title{font-size:.88rem;color:var(--gold);font-weight:600;margin-bottom:.2rem;line-height:1.3;}
.home-media-meta{font-size:.75rem;color:var(--muted);}
.country-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:.8rem;}
.country-card{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:.9rem;text-align:center;text-decoration:none;color:var(--text);transition:all .2s;display:block;}
.country-card:hover{border-color:var(--gold);text-decoration:none}
.country-flag{font-size:1.8rem;margin-bottom:.3rem;}
.country-name{font-size:.85rem;color:var(--gold);font-weight:600;}
.site-footer{background:var(--header);border-top:2px solid var(--border);margin-top:5rem;padding:3rem 1.5rem 1.5rem;}
.footer-inner{max-width:1300px;margin:0 auto;}
.footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:2rem;margin-bottom:2rem;}
.footer-col h3{font-family:'Playfair Display',serif;color:var(--gold);font-size:1.2rem;margin-bottom:.8rem;}
.footer-col h4{color:var(--gold);font-size:.85rem;text-transform:uppercase;letter-spacing:1px;margin-bottom:.8rem;}
.footer-col p{color:var(--muted);font-size:.88rem;line-height:1.7}
.footer-col a{display:block;color:var(--muted);font-size:.87rem;padding:.2rem 0;}
.footer-col a:hover{color:var(--gold);text-decoration:none}
.footer-bottom{border-top:1px solid var(--border);padding-top:1.2rem;text-align:center;color:var(--muted);font-size:.83rem;}
@media(max-width:900px){
  .main-nav .nav-item{display:none}.nav-search{display:none}
  .mobile-menu-btn{display:block}
  .hero-title{font-size:2rem}
  .home-feature-grid,.home-media-grid{grid-template-columns:repeat(3,1fr)}
  .footer-grid{grid-template-columns:1fr 1fr}
}
@media(max-width:600px){
  .home-feature-grid,.home-media-grid{grid-template-columns:repeat(2,1fr)}
  .footer-grid{grid-template-columns:1fr}
  .hero-title{font-size:1.7rem}
  .hero-stats{gap:1.5rem}
}
  </style>
</head>
<body>

<header class="site-header">
  <div class="header-inner">
    <a href="/" class="logo">
      <span class="logo-icon">&#127916;</span>
      <span class="logo-text">EnjoysSeason</span>
    </a>
    <nav class="main-nav">
      <div class="nav-item dropdown">
        <button class="nav-btn">&#127757; Countries &#9662;</button>
        <div class="dropdown-menu mega-menu">
          <div class="mega-col">
            <h4>&#127823; Asia</h4>
            <a href="/country/pakistan">&#127477;&#127472; Pakistan</a>
            <a href="/country/india">&#127470;&#127475; India</a>
            <a href="/country/turkey">&#127481;&#127479; Turkey</a>
            <a href="/country/south-korea">&#127472;&#127479; South Korea</a>
            <a href="/country/japan">&#127471;&#127477; Japan</a>
            <a href="/country/china">&#127464;&#127475; China</a>
            <a href="/country/bangladesh">&#127463;&#127465; Bangladesh</a>
            <a href="/country/iran">&#127470;&#127479; Iran</a>
          </div>
          <div class="mega-col">
            <h4>&#127758; West</h4>
            <a href="/country/usa">&#127482;&#127480; USA</a>
            <a href="/country/uk">&#127468;&#127463; UK</a>
            <a href="/country/canada">&#127464;&#127462; Canada</a>
            <a href="/country/australia">&#127462;&#127482; Australia</a>
            <a href="/country/france">&#127467;&#127479; France</a>
            <a href="/country/germany">&#127465;&#127466; Germany</a>
            <a href="/country/spain">&#127466;&#127480; Spain</a>
            <a href="/country/italy">&#127470;&#127481; Italy</a>
          </div>
          <div class="mega-col">
            <h4>&#127757; Middle East &amp; Africa</h4>
            <a href="/country/saudi-arabia">&#127480;&#127462; Saudi Arabia</a>
            <a href="/country/egypt">&#127466;&#127468; Egypt</a>
            <a href="/country/uae">&#127462;&#127466; UAE</a>
            <a href="/country/nigeria">&#127475;&#127468; Nigeria</a>
            <a href="/country/south-africa">&#127487;&#127462; South Africa</a>
          </div>
          <div class="mega-col">
            <h4>&#127758; Latin America</h4>
            <a href="/country/brazil">&#127463;&#127479; Brazil</a>
            <a href="/country/mexico">&#127474;&#127485; Mexico</a>
            <a href="/country/argentina">&#127462;&#127479; Argentina</a>
            <a href="/country/colombia">&#127464;&#127476; Colombia</a>
            <a href="/country/all">&#127760; All 200 Countries &rarr;</a>
          </div>
        </div>
      </div>
      <div class="nav-item dropdown">
        <button class="nav-btn">&#127917; Categories &#9662;</button>
        <div class="dropdown-menu">
          <div class="drop-col">
            <h4>&#128100; People</h4>
            <a href="/category/actors">&#127917; Actors</a>
            <a href="/category/actresses">&#128105; Actresses</a>
            <a href="/category/directors">&#127916; Directors</a>
          </div>
          <div class="drop-col">
            <h4>&#127916; Content</h4>
            <a href="/category/movies">&#127916; Movies</a>
            <a href="/category/dramas">&#128250; Dramas</a>
            <a href="/category/web-series">&#128187; Web Series</a>
            <a href="/category/anime">&#127932; Anime</a>
          </div>
        </div>
      </div>
      <div class="nav-item dropdown">
        <button class="nav-btn">&#127909; Industry &#9662;</button>
        <div class="dropdown-menu">
          <div class="drop-col">
            <h4>&#127916; Film Industry</h4>
            <a href="/industry/bollywood">&#127470;&#127475; Bollywood</a>
            <a href="/industry/hollywood">&#127482;&#127480; Hollywood</a>
            <a href="/industry/lollywood">&#127477;&#127472; Lollywood</a>
            <a href="/industry/korean">&#127472;&#127479; K-Drama</a>
            <a href="/industry/turkish">&#127481;&#127479; Turkish</a>
            <a href="/industry/anime">&#127932; Anime</a>
          </div>
        </div>
      </div>
      <div class="nav-search">
        <input type="text" placeholder="Search actors, dramas..." class="search-input" id="searchInput">
        <button class="search-btn" onclick="doSearch()">Search</button>
      </div>
    </nav>
    <button class="mobile-menu-btn" onclick="toggleMobile()">&#9776;</button>
  </div>
  <div class="mobile-nav" id="mobileNav">
    <a href="/country/pakistan">&#127477;&#127472; Pakistan</a>
    <a href="/country/india">&#127470;&#127475; India</a>
    <a href="/country/usa">&#127482;&#127480; USA</a>
    <a href="/category/actors">&#127917; Actors</a>
    <a href="/category/movies">&#127916; Movies</a>
    <a href="/category/dramas">&#128250; Dramas</a>
    <a href="/industry/bollywood">&#127470;&#127475; Bollywood</a>
    <a href="/industry/hollywood">&#127482;&#127480; Hollywood</a>
  </div>
</header>

<section class="hero">
  <div class="hero-inner">
    <h1 class="hero-title">World Entertainment Database</h1>
    <p class="hero-sub">Actors, movies, dramas, and web series from 200+ countries &mdash; profiles, ratings, bios, and deep coverage in one place.</p>
    <div class="hero-btns">
      <a href="/category/actors" class="btn-primary">Browse Actors</a>
      <a href="/category/dramas" class="btn-secondary">Browse Dramas</a>
      <a href="/category/movies" class="btn-secondary">Browse Movies</a>
    </div>
    <div class="hero-stats">
      <div class="hero-stat">
        <div class="hero-stat-n">${actors.length.toLocaleString()}+</div>
        <div class="hero-stat-l">Actors</div>
      </div>
      <div class="hero-stat">
        <div class="hero-stat-n">200+</div>
        <div class="hero-stat-l">Countries</div>
      </div>
      <div class="hero-stat">
        <div class="hero-stat-n">${dramas.length.toLocaleString()}+</div>
        <div class="hero-stat-l">Dramas</div>
      </div>
    </div>
  </div>
</section>

<div class="container">

  <div class="section">
    <div class="section-header">
      <h2 class="section-title">Featured Actors</h2>
      <a href="/category/actors" class="view-all">View all &rarr;</a>
    </div>
    <div class="home-feature-grid" role="list">
${actorsHTML}
    </div>
  </div>

  <div class="section">
    <div class="section-header">
      <h2 class="section-title">Featured Dramas</h2>
      <a href="/category/dramas" class="view-all">View all &rarr;</a>
    </div>
    <div class="home-media-grid" role="list">
${dramasHTML}
    </div>
  </div>

  <div class="section">
    <div class="section-header">
      <h2 class="section-title">Explore by Country</h2>
      <a href="/country/all" class="view-all">All countries &rarr;</a>
    </div>
    <div class="country-grid">
      <a href="/country/pakistan" class="country-card"><div class="country-flag">&#127477;&#127472;</div><div class="country-name">Pakistan</div></a>
      <a href="/country/india" class="country-card"><div class="country-flag">&#127470;&#127475;</div><div class="country-name">India</div></a>
      <a href="/country/usa" class="country-card"><div class="country-flag">&#127482;&#127480;</div><div class="country-name">USA</div></a>
      <a href="/country/turkey" class="country-card"><div class="country-flag">&#127481;&#127479;</div><div class="country-name">Turkey</div></a>
      <a href="/country/south-korea" class="country-card"><div class="country-flag">&#127472;&#127479;</div><div class="country-name">South Korea</div></a>
      <a href="/country/japan" class="country-card"><div class="country-flag">&#127471;&#127477;</div><div class="country-name">Japan</div></a>
      <a href="/country/uk" class="country-card"><div class="country-flag">&#127468;&#127463;</div><div class="country-name">UK</div></a>
      <a href="/country/china" class="country-card"><div class="country-flag">&#127464;&#127475;</div><div class="country-name">China</div></a>
      <a href="/country/brazil" class="country-card"><div class="country-flag">&#127463;&#127479;</div><div class="country-name">Brazil</div></a>
      <a href="/country/canada" class="country-card"><div class="country-flag">&#127464;&#127462;</div><div class="country-name">Canada</div></a>
    </div>
  </div>

</div>

<footer class="site-footer">
  <div class="footer-inner">
    <div class="footer-grid">
      <div class="footer-col">
        <h3>&#127916; EnjoysSeason</h3>
        <p>World's most complete entertainment database. Actors, movies, dramas, web series and anime from 200+ countries with accurate biographies and filmographies.</p>
      </div>
      <div class="footer-col">
        <h4>&#127757; Popular Countries</h4>
        <a href="/country/pakistan">Pakistan Actors</a>
        <a href="/country/india">Indian Actors</a>
        <a href="/country/usa">American Actors</a>
        <a href="/country/turkey">Turkish Actors</a>
        <a href="/country/south-korea">Korean Actors</a>
        <a href="/country/japan">Japanese Actors</a>
      </div>
      <div class="footer-col">
        <h4>&#127917; Categories</h4>
        <a href="/category/actors">All Actors</a>
        <a href="/category/movies">All Movies</a>
        <a href="/category/dramas">All Dramas</a>
        <a href="/category/web-series">Web Series</a>
        <a href="/category/anime">Anime</a>
        <a href="/industry/bollywood">Bollywood</a>
      </div>
      <div class="footer-col">
        <h4>&#128203; Pages</h4>
        <a href="/about">About Us</a>
        <a href="/contact">Contact</a>
        <a href="/privacy-policy">Privacy Policy</a>
        <a href="/disclaimer">Disclaimer</a>
        <a href="/sitemap.xml">Sitemap</a>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2026 EnjoysSeason &mdash; World Actors, Movies, Dramas &amp; Web Series Database</p>
    </div>
  </div>
</footer>

<script>
function toggleMobile(){
  var nav = document.getElementById('mobileNav');
  nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
}
function doSearch(){
  var q = document.getElementById('searchInput').value.trim();
  if(q) window.location.href = '/search?q=' + encodeURIComponent(q);
}
document.getElementById('searchInput').addEventListener('keypress', function(e){
  if(e.key === 'Enter') doSearch();
});
</script>

</body>
</html>`;

fs.writeFileSync('index.html', html, 'utf8');
console.log('Done! Homepage generated.');
console.log('Actors:', (html.match(/home-actor-card/g)||[]).length);
console.log('Dramas:', (html.match(/home-media-card/g)||[]).length);
