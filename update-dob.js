const fs = require('fs');
const https = require('https');

const API_KEY = process.env.TMDB_API_KEY;

if (!API_KEY) {
  console.error('TMDB_API_KEY not set!');
  console.log('Run: $env:TMDB_API_KEY="8265bd1679663a7ea12ac168da84d2e8"');
  process.exit(1);
}

const actors = JSON.parse(fs.readFileSync('data/actors.json', 'utf8'));
console.log('Total actors:', actors.length);

function fetchJSON(url, cb) {
  const req = https.get(url, { headers: { 'User-Agent': 'EnjoysSeason/1.0' } }, (res) => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => {
      try { cb(JSON.parse(data)); }
      catch(e) { cb(null); }
    });
  });
  req.on('error', () => cb(null));
  req.setTimeout(8000, () => { req.destroy(); cb(null); });
}

let i = 0;
let updated = 0;
let failed = 0;

// Keep event loop alive
const keepAlive = setInterval(() => {}, 1000);

function processNext() {
  if (i >= actors.length) {
    fs.writeFileSync('data/actors.json', JSON.stringify(actors, null, 2));
    console.log('\n✅ DONE!');
    console.log('Updated:', updated);
    console.log('Failed:', failed);
    console.log('Now run: node generate.js');
    clearInterval(keepAlive);
    process.exit(0);
    return;
  }

  const actor = actors[i];
  const searchUrl = 'https://api.themoviedb.org/3/search/person?api_key=' + API_KEY + '&query=' + encodeURIComponent(actor.name) + '&language=en-US';

  fetchJSON(searchUrl, (result) => {
    if (!result || !result.results || !result.results.length) {
      failed++;
      i++;
      setTimeout(processNext, 150);
      return;
    }

    const person = result.results[0];
    const detailUrl = 'https://api.themoviedb.org/3/person/' + person.id + '?api_key=' + API_KEY + '&language=en-US';

    fetchJSON(detailUrl, (detail) => {
      if (!detail || !detail.id) {
        failed++;
        i++;
        setTimeout(processNext, 150);
        return;
      }

      let changed = false;

      // Fix DOB
      if (detail.birthday && detail.birthday !== actors[i].born) {
        actors[i].born = detail.birthday;
        changed = true;
      }

      // Fix birthplace
      if (detail.place_of_birth && !actors[i].birthPlace) {
        actors[i].birthPlace = detail.place_of_birth;
        changed = true;
      }

      // Fix image
      if (detail.profile_path && !actors[i].image) {
        actors[i].image = 'https://image.tmdb.org/t/p/w500' + detail.profile_path;
        changed = true;
      }

      // Fix bio
      if (detail.biography && detail.biography.length > 100 && (!actors[i].bio || actors[i].bio.length < 50)) {
        actors[i].bio = detail.biography.substring(0, 800);
        changed = true;
      }

      if (changed) updated++;

      // Save every 100
      if (i % 100 === 0 && i > 0) {
        console.log('Progress:', i + '/' + actors.length, '| Updated:', updated, '| Failed:', failed);
        fs.writeFileSync('data/actors.json', JSON.stringify(actors, null, 2));
        console.log('💾 Saved!');
      }

      i++;
      setTimeout(processNext, 250);
    });
  });
}

console.log('Starting...');
processNext();