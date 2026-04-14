const fs = require('fs');
const https = require('https');

const API_KEY = process.env.TMDB_API_KEY;

const countries = [
  {name:'Pakistan',slug:'pakistan'},{name:'India',slug:'india'},
  {name:'Turkey',slug:'turkey'},{name:'South Korea',slug:'south-korea'},
  {name:'Brazil',slug:'brazil'},{name:'Italy',slug:'italy'},
  {name:'France',slug:'france'},{name:'Spain',slug:'spain'},
  {name:'Japan',slug:'japan'},{name:'China',slug:'china'},
  {name:'Mexico',slug:'mexico'},{name:'United States',slug:'usa'},
  {name:'United Kingdom',slug:'uk'},{name:'Germany',slug:'germany'},
  {name:'Argentina',slug:'argentina'},{name:'Russia',slug:'russia'},
  {name:'Canada',slug:'canada'},{name:'Australia',slug:'australia'},
  {name:'Egypt',slug:'egypt'},{name:'Nigeria',slug:'nigeria'},
  {name:'South Africa',slug:'south-africa'},{name:'Iran',slug:'iran'},
  {name:'Morocco',slug:'morocco'},{name:'Indonesia',slug:'indonesia'},
  {name:'Malaysia',slug:'malaysia'},{name:'Thailand',slug:'thailand'},
  {name:'Philippines',slug:'philippines'},{name:'Vietnam',slug:'vietnam'},
  {name:'Bangladesh',slug:'bangladesh'},{name:'Greece',slug:'greece'},
  {name:'Portugal',slug:'portugal'},{name:'Netherlands',slug:'netherlands'},
  {name:'Sweden',slug:'sweden'},{name:'Norway',slug:'norway'},
  {name:'Denmark',slug:'denmark'},{name:'Poland',slug:'poland'},
  {name:'Ukraine',slug:'ukraine'},{name:'Romania',slug:'romania'},
  {name:'Colombia',slug:'colombia'},{name:'Chile',slug:'chile'},
  {name:'Peru',slug:'peru'},{name:'Israel',slug:'israel'},
  {name:'Saudi Arabia',slug:'saudi-arabia'},{name:'UAE',slug:'uae'},
  {name:'Lebanon',slug:'lebanon'},{name:'Jordan',slug:'jordan'},
  {name:'Taiwan',slug:'taiwan'},{name:'Hong Kong',slug:'hong-kong'}
];

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
  const existingData = JSON.parse(fs.readFileSync('data/actors.json','utf8'));
  const existingSlugs = new Set(existingData.map(a => a.slug));
  const newActors = [];
  const TARGET = 1000;

  console.log('Current actors:', existingData.length);
  console.log('Fetching', TARGET, 'new actors...');

  const startPage = Math.floor(Math.random() * 300) + 1;
  console.log('Starting from TMDB page:', startPage);

  for (const country of countries) {
    if (newActors.length >= TARGET) break;
    console.log('Country:', country.name, '| Progress:', newActors.length + '/' + TARGET);

    for (let page = startPage; page <= startPage + 20; page++) {
      if (newActors.length >= TARGET) break;

      const url = 'https://api.themoviedb.org/3/person/popular?api_key=' + API_KEY + '&language=en-US&page=' + page;
      const result = await fetchJSON(url);
      await sleep(300);

      if (!result.results || !result.results.length) break;

      for (const person of result.results) {
        if (newActors.length >= TARGET) break;
        if (person.known_for_department !== 'Acting') continue;

        const slug = makeSlug(person.name);
        if (!slug || existingSlugs.has(slug)) continue;
        existingSlugs.add(slug);

        await sleep(200);

        const detailUrl = 'https://api.themoviedb.org/3/person/' + person.id + '?api_key=' + API_KEY + '&language=en-US&append_to_response=movie_credits,tv_credits';
        const detail = await fetchJSON(detailUrl);
        if (!detail || !detail.name) continue;

        const movies = (detail.movie_credits?.cast || [])
          .sort((a,b) => (b.popularity||0)-(a.popularity||0))
          .slice(0,5)
          .map(m => makeSlug(m.title||''))
          .filter(Boolean);

        const dramas = (detail.tv_credits?.cast || [])
          .sort((a,b) => (b.popularity||0)-(a.popularity||0))
          .slice(0,5)
          .map(t => makeSlug(t.name||''))
          .filter(Boolean);

        const bio = detail.biography && detail.biography.length > 50
          ? detail.biography.substring(0,800)
          : detail.name + ' is a popular ' + country.name + ' actor known for outstanding work in film and television.';

        const professions = [];
        if (detail.known_for_department === 'Acting') professions.push('Actor');
        if (detail.also_known_as && detail.also_known_as.length > 0) professions.push('Model');

        newActors.push({
          id: slug,
          name: detail.name,
          fullName: detail.name,
          slug: slug,
          country: country.name,
          countrySlug: country.slug,
          born: detail.birthday || '',
          birthPlace: detail.place_of_birth || country.name,
          nationality: country.name,
          profession: professions.length > 0 ? professions : ['Actor'],
          genre: ['Drama','Action','Romance'],
          bio: bio,
          image: detail.profile_path ? 'https://image.tmdb.org/t/p/w500' + detail.profile_path : '',
          wikipedia: '',
          movies: movies,
          dramas: dramas,
          costars: [],
          awards: [],
          active: detail.birthday ? detail.birthday.substring(0,4) : '',
          netWorth: '',
          spouse: '',
          children: '0'
        });

        if (newActors.length % 100 === 0) {
          console.log('Progress:', newActors.length, '/', TARGET);
        }
      }
    }
  }

  console.log('New actors fetched:', newActors.length);

  if (newActors.length > 0) {
    const merged = [...existingData, ...newActors];
    fs.writeFileSync('data/actors.json', JSON.stringify(merged, null, 2));
    console.log('Total actors in database:', merged.length);
    await submitToIndexNow(newActors);
    console.log('Submitted to IndexNow!');
  } else {
    console.log('No new actors found');
  }
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
async function submitToIndexNow(actors) {
  const urls = actors.map(a => 
    'https://enjoyseason.com/actors/' + a.countrySlug + '/' + a.slug
  );
  
  const body = JSON.stringify({
    host: 'enjoyseason.com',
    key: '9c0c59f42d0c4b1fb9d275d18d201f53',
    keyLocation: 'https://enjoyseason.com/9c0c59f42d0c4b1fb9d275d18d201f53.txt',
    urlList: urls.slice(0, 10000)
  });

  return new Promise((resolve) => {
    const req = https.request({
      hostname: 'api.indexnow.org',
      path: '/indexnow',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    }, (res) => {
      console.log('IndexNow status:', res.statusCode);
      resolve();
    });
    req.on('error', () => resolve());
    req.write(body);
    req.end();
  });
}