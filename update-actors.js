const fs = require('fs');
const https = require('https');

const API_KEY = process.env.TMDB_API_KEY;

if (!API_KEY) {
  console.error('❌ TMDB_API_KEY environment variable not set!');
  console.log('Run: $env:TMDB_API_KEY="your_key_here"');
  process.exit(1);
}

function fetchJSON(url) {
  return new Promise((resolve) => {
    https.get(url, {headers:{'User-Agent':'EnjoysSeason/1.0'}}, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch(e) { resolve({}); }
      });
    }).on('error', () => resolve({}));
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function makeSlug(name) {
  return (name||'').toLowerCase()
    .replace(/[^a-z0-9\s-]/g,'')
    .replace(/\s+/g,'-')
    .replace(/-+/g,'-')
    .trim();
}

async function main() {
  const actors = JSON.parse(fs.readFileSync('data/actors.json', 'utf8'));
  console.log(`Total actors to update: ${actors.length}`);

  let updated = 0;
  let failed = 0;

  for (let i = 0; i < actors.length; i++) {
    const actor = actors[i];

    try {
      // TMDB se actor search karo
      const searchUrl = `https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&query=${encodeURIComponent(actor.name)}&language=en-US`;
      const searchResult = await fetchJSON(searchUrl);
      await sleep(250);

      const person = searchResult.results?.[0];
      if (!person) {
        failed++;
        continue;
      }

      // Actor detail fetch karo with full credits
      const detailUrl = `https://api.themoviedb.org/3/person/${person.id}?api_key=${API_KEY}&language=en-US&append_to_response=movie_credits,tv_credits`;
      const detail = await fetchJSON(detailUrl);
      await sleep(250);

      if (!detail || !detail.id) {
        failed++;
        continue;
      }

      // Poori movies list (no limit)
      const movies = (detail.movie_credits?.cast || [])
        .sort((a,b) => (b.popularity||0)-(a.popularity||0))
        .map(m => makeSlug(m.title||''))
        .filter(Boolean);

      // Poori dramas list (no limit)
      const dramas = (detail.tv_credits?.cast || [])
        .sort((a,b) => (b.popularity||0)-(a.popularity||0))
        .map(t => makeSlug(t.name||''))
        .filter(Boolean);

      // Update actor data
      actors[i].movies = movies;
      actors[i].dramas = dramas;
      if (detail.profile_path) {
        actors[i].image = 'https://image.tmdb.org/t/p/w500' + detail.profile_path;
      }
      if (detail.biography && detail.biography.length > 50) {
        actors[i].bio = detail.biography.substring(0, 800);
      }

      updated++;

      if (updated % 100 === 0) {
        console.log(`✅ Updated: ${updated}/${actors.length} | Failed: ${failed}`);
        // Har 100 actors ke baad save karo
        fs.writeFileSync('data/actors.json', JSON.stringify(actors, null, 2));
        console.log('💾 Saved progress...');
      }

    } catch(e) {
      failed++;
    }
  }

  // Final save
  fs.writeFileSync('data/actors.json', JSON.stringify(actors, null, 2));
  console.log(`\n✅ Done! Updated: ${updated} | Failed: ${failed}`);
  console.log('Now run: node generate.js');
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
