const https = require('https');
const fs = require('fs');

const TMDB_KEY = '69927258942f4d1906f5833e0bcdc4fa';
const ACTORS_FILE = 'data/actors.json';

function fetchTMDB(path) {
  return new Promise((resolve, reject) => {
    const base = path.includes('?') 
      ? `https://api.themoviedb.org/3${path}&api_key=${TMDB_KEY}&language=en-US`
      : `https://api.themoviedb.org/3${path}?api_key=${TMDB_KEY}&language=en-US`;
    https.get(base, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } 
        catch(e) { resolve({}); }
      });
    }).on('error', () => resolve({}));
  });
}

function toSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function randomPage() {
  return Math.floor(Math.random() * 200) + 1;
}

async function convertActor(person) {
  try {
    await new Promise(r => setTimeout(r, 300));
    const detail = await fetchTMDB(`/person/${person.id}`);
    await new Promise(r => setTimeout(r, 300));
    const credits = await fetchTMDB(`/person/${person.id}/combined_credits`);

    const dramas = (credits.cast || [])
      .filter(c => c.media_type === 'tv' && c.name)
      .slice(0, 5)
      .map(c => toSlug(c.name));

    const movies = (credits.cast || [])
      .filter(c => c.media_type === 'movie' && c.title)
      .slice(0, 5)
      .map(c => toSlug(c.title));

    const birthPlace = detail.place_of_birth || '';
    const parts = birthPlace.split(',');
    const country = parts.length > 0 ? parts[parts.length - 1].trim() : 'Unknown';
    const slug = toSlug(detail.name || person.name);
    const bio = detail.biography || '';

    return {
      id: slug,
      name: detail.name || person.name,
      fullName: detail.name || person.name,
      slug: slug,
      country: country,
      countrySlug: toSlug(country),
      born: detail.birthday || '',
      birthPlace: birthPlace,
      nationality: country,
      profession: ['Actor', 'Actress'],
      genre: ['Drama', 'Action', 'Romance'],
      bio: bio || `${detail.name} is a talented performer known for their work in film and television.`,
      image: detail.profile_path ? `https://image.tmdb.org/t/p/w500${detail.profile_path}` : '',
      wikipedia: `https://en.wikipedia.org/wiki/${(detail.name || '').replace(/ /g, '_')}`,
      movies: movies,
      dramas: dramas,
      costars: [],
      awards: [],
      active: detail.birthday ? detail.birthday.substring(0, 4) : '',
      netWorth: '',
      spouse: '',
      children: '0'
    };
  } catch(e) {
    console.log('  Error converting:', e.message);
    return null;
  }
}

async function main() {
  // ✅ 1000 actors at once!
  const TARGET = 1000;
  console.log(`🚀 Auto fetching ${TARGET} actors from TMDB...`);

  let existing = [];
  if (fs.existsSync(ACTORS_FILE)) {
    existing = JSON.parse(fs.readFileSync(ACTORS_FILE, 'utf8'));
  }
  const existingSlugs = new Set(existing.map(a => a.slug));
  console.log(`📊 Existing actors: ${existing.length}`);

  let newActors = [];
  let page = randomPage();

  while (newActors.length < TARGET) {
    console.log(`\nFetching page ${page}... (${newActors.length}/${TARGET})`);
    
    const result = await fetchTMDB(`/person/popular?page=${page}`);
    const persons = result.results || [];

    if (persons.length === 0) {
      page = randomPage();
      continue;
    }

    for (const person of persons) {
      if (newActors.length >= TARGET) break;

      const slug = toSlug(person.name);
      if (existingSlugs.has(slug)) {
        console.log(`  Skip (exists): ${person.name}`);
        continue;
      }

      console.log(`  Adding: ${person.name} (${newActors.length + 1}/${TARGET})`);
      const actor = await convertActor(person);

      if (actor) {
        newActors.push(actor);
        existingSlugs.add(slug);

        // Save every 100 actors — data safe rahega
        if (newActors.length % 100 === 0) {
          const merged = [...existing, ...newActors];
          fs.writeFileSync(ACTORS_FILE, JSON.stringify(merged, null, 2));
          console.log(`\n💾 Auto-saved at ${newActors.length} actors!`);
        }
      }
    }
    page++;
    if (page > 500) page = 1;
  }

  // Final save
  const merged = [...existing, ...newActors];
  fs.writeFileSync(ACTORS_FILE, JSON.stringify(merged, null, 2));
  
  console.log(`\n✅ Fetched ${newActors.length} new actors!`);
  console.log(`📊 Total actors now: ${merged.length}`);
  console.log('✅ Done!');
  
  // Auto generate pages
  console.log('\n🔄 Generating pages...');
  const { execSync } = require('child_process');
  execSync('node generate.js', { stdio: 'inherit' });
  console.log('✅ Pages generated!');
}

main().catch(console.error);