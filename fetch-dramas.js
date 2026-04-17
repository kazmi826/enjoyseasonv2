const fs = require('fs');
const https = require('https');

const API_KEY = process.env.TMDB_API_KEY;

if (!API_KEY) {
  console.error('❌ TMDB_API_KEY not set!');
  console.log('Run: $env:TMDB_API_KEY="your_key_here"');
  process.exit(1);
}

function fetchJSON(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'EnjoysSeason/1.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { resolve({}); }
      });
    }).on('error', () => resolve({}));
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function makeSlug(name) {
  return (name || '').toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

const TARGET = 4632;

async function main() {
  console.log('🚀 Fetching dramas from TMDB...');

  // Load existing dramas if any
  let existingDramas = [];
  if (fs.existsSync('data/dramas-full.json')) {
    existingDramas = JSON.parse(fs.readFileSync('data/dramas-full.json', 'utf8'));
  }
  const existingSlugs = new Set(existingDramas.map(d => d.slug));
  console.log(`Existing dramas: ${existingDramas.length}`);

  const newDramas = [];

  for (let page = 1; page <= 500; page++) {
    if (newDramas.length >= TARGET) break;

    console.log(`\n📄 Fetching page ${page}...`);

    const url = `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=en-US&page=${page}`;
    const result = await fetchJSON(url);
    await sleep(300);

    if (!result.results || !result.results.length) break;

    for (const show of result.results) {
      if (newDramas.length >= TARGET) break;

      const slug = makeSlug(show.name || '');
      if (!slug || existingSlugs.has(slug)) continue;
      existingSlugs.add(slug);

      await sleep(250);

      // Full details fetch
      const detailUrl = `https://api.themoviedb.org/3/tv/${show.id}?api_key=${API_KEY}&language=en-US&append_to_response=credits,similar,videos,content_ratings`;
      const detail = await fetchJSON(detailUrl);
      await sleep(250);

      if (!detail || !detail.name) continue;

      // Origin country
      const originCountry = (detail.origin_country || [])[0] || 'US';
      const countrySlug = makeSlug(originCountry);

      // Cast
      const cast = (detail.credits?.cast || [])
        .slice(0, 10)
        .map(c => ({
          name: c.name,
          slug: makeSlug(c.name),
          character: c.character,
          image: c.profile_path ? `https://image.tmdb.org/t/p/w200${c.profile_path}` : ''
        }));

      // Crew
      const director = (detail.credits?.crew || [])
        .filter(c => c.job === 'Director' || c.job === 'Executive Producer')
        .slice(0, 3)
        .map(c => c.name);

      // Similar shows
      const similar = (detail.similar?.results || [])
        .slice(0, 6)
        .map(s => ({ name: s.name, slug: makeSlug(s.name) }));

      // Seasons info
      const seasons = (detail.seasons || [])
        .filter(s => s.season_number > 0)
        .map(s => ({
          number: s.season_number,
          name: s.name,
          episodes: s.episode_count,
          airDate: s.air_date
        }));

      // Genres
      const genres = (detail.genres || []).map(g => g.name);

      // Networks
      const networks = (detail.networks || []).map(n => n.name);

      // Rating
      const rating = detail.vote_average ? detail.vote_average.toFixed(1) : '';

      const drama = {
        id: show.id,
        slug: slug,
        name: detail.name,
        originalName: detail.original_name || detail.name,
        overview: detail.overview || '',
        tagline: detail.tagline || '',
        poster: detail.poster_path ? `https://image.tmdb.org/t/p/w500${detail.poster_path}` : '',
        backdrop: detail.backdrop_path ? `https://image.tmdb.org/t/p/w1280${detail.backdrop_path}` : '',
        firstAirDate: detail.first_air_date || '',
        lastAirDate: detail.last_air_date || '',
        status: detail.status || '',
        type: detail.type || 'Drama',
        originCountry: originCountry,
        countrySlug: countrySlug,
        originalLanguage: detail.original_language || '',
        genres: genres,
        networks: networks,
        totalEpisodes: detail.number_of_episodes || 0,
        totalSeasons: detail.number_of_seasons || 0,
        seasons: seasons,
        rating: rating,
        voteCount: detail.vote_count || 0,
        popularity: detail.popularity || 0,
        cast: cast,
        director: director,
        similar: similar,
        homepage: detail.homepage || ''
      };

      newDramas.push(drama);
      console.log(`✅ [${newDramas.length}/${TARGET}] ${drama.name} (${originCountry})`);
    }
  }

  console.log(`\n✅ Fetched ${newDramas.length} new dramas!`);

  const merged = [...existingDramas, ...newDramas];
  if (!fs.existsSync('data')) fs.mkdirSync('data');
  fs.writeFileSync('data/dramas-full.json', JSON.stringify(merged, null, 2));
  console.log(`💾 Total dramas saved: ${merged.length}`);
  console.log('\nNow run: node generate-dramas.js');
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
