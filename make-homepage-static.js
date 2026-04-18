const fs = require('fs');
const actors = JSON.parse(fs.readFileSync('data/actors.json', 'utf8'));
const dramas = JSON.parse(fs.readFileSync('data/dramas-full.json', 'utf8'));

const featuredActors = actors.filter(a => a.image).slice(0, 12);
const featuredDramas = dramas.filter(d => d.poster).slice(0, 12);

const actorsHTML = featuredActors.map(a => `<a href="/actors/${a.countrySlug}/${a.slug}" class="home-actor-card" role="listitem"><div class="home-card-img-wrap"><img src="${a.image}" alt="${a.name}" class="home-card-img" loading="lazy"></div><div class="home-card-body"><div class="home-card-title">${a.name}</div><div class="home-card-meta">${a.nationality}</div></div></a>`).join('');

const dramasHTML = featuredDramas.map(d => `<a href="/dramas/${d.countrySlug}/${d.slug}" class="home-media-card" role="listitem"><div class="home-media-img-wrap"><img src="${d.poster}" alt="${d.name}" class="home-media-img" loading="lazy"></div><div class="home-media-body"><div class="home-media-title">${d.name}</div><div class="home-media-meta">${d.originCountry}</div></div></a>`).join('');

let html = fs.readFileSync('index.html', 'utf8');

// Replace ENTIRE section content
html = html.replace(/(<div id="homeActorsGrid"[^>]*>)[\s\S]*?(<\/div>\s*(?=<\/section>|<section|<div class="section"))/,`$1${actorsHTML}</div>\n`);
html = html.replace(/(<div id="homeDramasGrid"[^>]*>)[\s\S]*?(<\/div>\s*(?=<\/section>|<section|<div class="section"))/,`$1${dramasHTML}</div>\n`);
html = html.replace(/(<div id="homeMoviesGrid"[^>]*>)[\s\S]*?(<\/div>\s*(?=<\/section>|<section|<div class="section"|<footer))/,`$1${dramasHTML}</div>\n`);

fs.writeFileSync('index.html', html);
console.log('Actor cards:', (html.match(/home-actor-card/g)||[]).length);
console.log('Drama cards:', (html.match(/home-media-card/g)||[]).length);