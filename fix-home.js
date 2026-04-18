const fs = require('fs');
const actors = JSON.parse(fs.readFileSync('data/actors.json', 'utf8'));
const dramas = JSON.parse(fs.readFileSync('data/dramas-full.json', 'utf8'));

const fa = actors.filter(a => a.image).slice(0, 12);
const fd = dramas.filter(d => d.poster).slice(0, 12);

const ah = fa.map(a => '<a href="/actors/' + a.countrySlug + '/' + a.slug + '" class="home-actor-card" role="listitem"><div class="home-card-img-wrap"><img src="' + a.image + '" alt="' + a.name + '" class="home-card-img" loading="lazy"></div><div class="home-card-body"><div class="home-card-title">' + a.name + '</div><div class="home-card-meta">' + a.nationality + '</div></div></a>').join('');

const dh = fd.map(d => '<a href="/dramas/' + d.countrySlug + '/' + d.slug + '" class="home-media-card" role="listitem"><div class="home-media-img-wrap"><img src="' + d.poster + '" alt="' + d.name + '" class="home-media-img" loading="lazy"></div><div class="home-media-body"><div class="home-media-title">' + d.name + '</div><div class="home-media-meta">' + d.originCountry + '</div></div></a>').join('');

let h = fs.readFileSync('index.html', 'utf8');

// Split by grid IDs and rebuild
const actorsStart = h.indexOf('id="homeActorsGrid"');
const dramasStart = h.indexOf('id="homeDramasGrid"');
const moviesStart = h.indexOf('id="homeMoviesGrid"');

function replaceGrid(html, startIdx, newContent) {
  const openTag = html.indexOf('>', startIdx) + 1;
  let depth = 1;
  let i = openTag;
  while (i < html.length && depth > 0) {
    if (html[i] === '<') {
      if (html[i+1] === '/') depth--;
      else if (html[i+1] !== '!' && html[i+1] !== '?') depth++;
    }
    i++;
  }
  return html.substring(0, openTag) + newContent + html.substring(i - 1);
}

h = replaceGrid(h, actorsStart, ah);
h = replaceGrid(h, h.indexOf('id="homeDramasGrid"'), dh);
h = replaceGrid(h, h.indexOf('id="homeMoviesGrid"'), dh);

fs.writeFileSync('index.html', h, 'utf8');
console.log('Actors:', (h.match(/home-actor-card/g)||[]).length);
console.log('Dramas:', (h.match(/home-media-card/g)||[]).length);