const fs = require('fs');

const actors = JSON.parse(fs.readFileSync('data/actors.json', 'utf8'));
const dramas = JSON.parse(fs.readFileSync('data/dramas-full.json', 'utf8'));

// Top 12 actors with images
const featuredActors = actors.filter(a => a.image).slice(0, 12);

// Top 12 dramas with posters
const featuredDramas = dramas.filter(d => d.poster).slice(0, 12);

// Generate actors HTML - using original CSS classes
const actorsHTML = featuredActors.map(a => `
<a href="/actors/${a.countrySlug}/${a.slug}" class="home-actor-card" role="listitem">
  <div class="home-card-img-wrap">
    <img src="${a.image}" alt="${a.name}" class="home-card-img" loading="lazy"
         onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(a.name)}&size=400&background=131629&color=f5a623'">
  </div>
  <div class="home-card-body">
    <div class="home-card-title">${a.name}</div>
    <div class="home-card-meta">${a.nationality} · ${(a.profession||['Actor'])[0]}</div>
  </div>
</a>`).join('');

// Generate dramas HTML - using original CSS classes
const dramasHTML = featuredDramas.map(d => `
<a href="/dramas/${d.countrySlug}/${d.slug}" class="home-media-card" role="listitem">
  <div class="home-media-img-wrap">
    <img src="${d.poster}" alt="${d.name}" class="home-media-img" loading="lazy"
         onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(d.name)}&size=400&background=131629&color=f5a623'">
  </div>
  <div class="home-media-body">
    <div class="home-media-title">${d.name}</div>
    <div class="home-media-meta">${d.originCountry} · ${d.genres[0] || 'Drama'} · ⭐${d.rating||'N/A'}</div>
  </div>
</a>`).join('');

// Read index.html
let html = fs.readFileSync('index.html', 'utf8');

// Replace actors grid
html = html.replace(
  /<div id="homeActorsGrid"[^>]*>[\s\S]*?<\/div>/,
  `<div id="homeActorsGrid" class="home-feature-grid" role="list">${actorsHTML}</div>`
);

// Replace dramas grid
html = html.replace(
  /<div id="homeDramasGrid"[^>]*>[\s\S]*?<\/div>/,
  `<div id="homeDramasGrid" class="home-media-grid" role="list">${dramasHTML}</div>`
);

// Replace movies grid
html = html.replace(
  /<div id="homeMoviesGrid"[^>]*>[\s\S]*?<\/div>/,
  `<div id="homeMoviesGrid" class="home-media-grid" role="list">${dramasHTML}</div>`
);

fs.writeFileSync('index.html', html);
console.log('✅ Homepage static content updated!');
console.log(`✅ Featured actors: ${featuredActors.length}`);
console.log(`✅ Featured dramas: ${featuredDramas.length}`);
