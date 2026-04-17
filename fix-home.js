const fs = require('fs');
const actors = JSON.parse(fs.readFileSync('data/actors.json', 'utf8'));
const dramas = JSON.parse(fs.readFileSync('data/dramas-full.json', 'utf8'));

const featuredActors = actors.filter(a => a.image).slice(0, 12);
const featuredDramas = dramas.filter(d => d.poster).slice(0, 12);

const actorsHTML = featuredActors.map(a => `<a href="/actors/${a.countrySlug}/${a.slug}" class="home-actor-card" role="listitem"><div class="home-card-img-wrap"><img src="${a.image}" alt="${a.name}" class="home-card-img" loading="lazy"></div><div class="home-card-body"><div class="home-card-title">${a.name}</div><div class="home-card-meta">${a.nationality} · ${(a.profession||['Actor'])[0]}</div></div></a>`).join('');

const dramasHTML = featuredDramas.map(d => `<a href="/dramas/${d.countrySlug}/${d.slug}" class="home-media-card" role="listitem"><div class="home-media-img-wrap"><img src="${d.poster}" alt="${d.name}" class="home-media-img" loading="lazy"></div><div class="home-media-body"><div class="home-media-title">${d.name}</div><div class="home-media-meta">${d.originCountry} · ${d.genres[0]||'Drama'} · ⭐${d.rating||'N/A'}</div></div></a>`).join('');

let html = fs.readFileSync('index.html', 'utf8');

// Remove all existing content inside grids
const actorsGridRegex = /(<div id="homeActorsGrid"[^>]*>)[\s\S]*?(<\/div>\s*<\/section>)/;
const dramasGridRegex = /(<div id="homeDramasGrid"[^>]*>)[\s\S]*?(<\/div>\s*<\/section>)/;
const moviesGridRegex = /(<div id="homeMoviesGrid"[^>]*>)[\s\S]*?(<\/div>\s*<\/section>)/;

html = html.replace(actorsGridRegex, `<div id="homeActorsGrid" class="home-feature-grid" role="list">${actorsHTML}</div></section>`);
html = html.replace(dramasGridRegex, `<div id="homeDramasGrid" class="home-media-grid" role="list">${dramasHTML}</div></section>`);
html = html.replace(moviesGridRegex, `<div id="homeMoviesGrid" class="home-media-grid" role="list">${dramasHTML}</div></section>`);

fs.writeFileSync('index.html', html);
console.log('Actor cards:', (html.match(/home-actor-card/g)||[]).length);
console.log('Media cards:', (html.match(/home-media-card/g)||[]).length);