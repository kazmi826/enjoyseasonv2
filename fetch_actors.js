name: Auto Generate 1000 Actor Pages Daily

on:
  schedule:
    - cron: '0 2 * * *'
  workflow_dispatch:

permissions:
  contents: write

jobs:
  generate:
    runs-on: ubuntu-latest
    timeout-minutes: 120

    steps:
    - name: Checkout repo
      uses: actions/checkout@v4
      with:
        token: ${{ secrets.GITHUB_TOKEN }}
        fetch-depth: 0

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'

    - name: Verify structure
      run: |
        echo "=== Files ==="
        ls -la
        echo "=== Data ==="
        ls -la data/
        node -e "const d=require('./data/actors.json'); console.log('Current actors:', d.length);"

    - name: Fetch 1000 new actors from TMDB
      env:
        TMDB_API_KEY: ${{ secrets.TMDB_API_KEY }}
      run: |
        node << 'EOF'
        const fs = require('fs');
        const https = require('https');
        const API_KEY = process.env.TMDB_API_KEY;

        const countries = [
          {name:'Pakistan',slug:'pakistan'},
          {name:'India',slug:'india'},
          {name:'Turkey',slug:'turkey'},
          {name:'South Korea',slug:'south-korea'},
          {name:'Brazil',slug:'brazil'},
          {name:'Italy',slug:'italy'},
          {name:'France',slug:'france'},
          {name:'Spain',slug:'spain'},
          {name:'Japan',slug:'japan'},
          {name:'China',slug:'china'},
          {name:'Mexico',slug:'mexico'},
          {name:'United States',slug:'usa'},
          {name:'United Kingdom',slug:'uk'},
          {name:'Germany',slug:'germany'},
          {name:'Argentina',slug:'argentina'},
          {name:'Russia',slug:'russia'},
          {name:'Canada',slug:'canada'},
          {name:'Australia',slug:'australia'},
          {name:'Egypt',slug:'egypt'},
          {name:'Nigeria',slug:'nigeria'},
          {name:'South Africa',slug:'south-africa'},
          {name:'Iran',slug:'iran'},
          {name:'Morocco',slug:'morocco'},
          {name:'Indonesia',slug:'indonesia'},
          {name:'Malaysia',slug:'malaysia'},
          {name:'Thailand',slug:'thailand'},
          {name:'Philippines',slug:'philippines'},
          {name:'Vietnam',slug:'vietnam'},
          {name:'Bangladesh',slug:'bangladesh'},
          {name:'Greece',slug:'greece'},
          {name:'Portugal',slug:'portugal'},
          {name:'Netherlands',slug:'netherlands'},
          {name:'Sweden',slug:'sweden'},
          {name:'Norway',slug:'norway'},
          {name:'Denmark',slug:'denmark'},
          {name:'Poland',slug:'poland'},
          {name:'Ukraine',slug:'ukraine'},
          {name:'Romania',slug:'romania'},
          {name:'Colombia',slug:'colombia'},
          {name:'Chile',slug:'chile'},
          {name:'Peru',slug:'peru'},
          {name:'Venezuela',slug:'venezuela'},
          {name:'Cuba',slug:'cuba'},
          {name:'Israel',slug:'israel'},
          {name:'Saudi Arabia',slug:'saudi-arabia'},
          {name:'UAE',slug:'uae'},
          {name:'Lebanon',slug:'lebanon'},
          {name:'Jordan',slug:'jordan'},
          {name:'Taiwan',slug:'taiwan'},
          {name:'Hong Kong',slug:'hong-kong'},
          {name:'Kazakhstan',slug:'kazakhstan'},
          {name:'Azerbaijan',slug:'azerbaijan'},
          {name:'Georgia',slug:'georgia'},
          {name:'Armenia',slug:'armenia'},
          {name:'Serbia',slug:'serbia'},
          {name:'Croatia',slug:'croatia'},
          {name:'Czech Republic',slug:'czech-republic'},
          {name:'Hungary',slug:'hungary'},
          {name:'Bulgaria',slug:'bulgaria'},
          {name:'Slovakia',slug:'slovakia'},
          {name:'Slovenia',slug:'slovenia'},
          {name:'Finland',slug:'finland'},
          {name:'Switzerland',slug:'switzerland'},
          {name:'Austria',slug:'austria'},
          {name:'Belgium',slug:'belgium'},
          {name:'Ireland',slug:'ireland'},
          {name:'New Zealand',slug:'new-zealand'},
          {name:'Singapore',slug:'singapore'},
          {name:'Sri Lanka',slug:'sri-lanka'},
          {name:'Nepal',slug:'nepal'},
          {name:'Algeria',slug:'algeria'},
          {name:'Tunisia',slug:'tunisia'},
          {name:'Kenya',slug:'kenya'},
          {name:'Ghana',slug:'ghana'},
          {name:'Tanzania',slug:'tanzania'},
          {name:'Ethiopia',slug:'ethiopia'},
          {name:'Dominican Republic',slug:'dominican-republic'},
          {name:'Puerto Rico',slug:'puerto-rico'},
          {name:'Jamaica',slug:'jamaica'},
          {name:'Panama',slug:'panama'},
          {name:'Costa Rica',slug:'costa-rica'},
          {name:'Guatemala',slug:'guatemala'},
          {name:'Ecuador',slug:'ecuador'},
          {name:'Bolivia',slug:'bolivia'},
          {name:'Paraguay',slug:'paraguay'},
          {name:'Uruguay',slug:'uruguay'}
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

          // Random starting page to get different actors each day
          const startPage = Math.floor(Math.random() * 300) + 1;
          console.log('Starting from page:', startPage);

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
                  console.log('✅ Progress:', newActors.length, '/', TARGET);
                }
              }
            }
          }

          console.log('✅ New actors fetched:', newActors.length);

          if (newActors.length > 0) {
            const merged = [...existingData, ...newActors];
            fs.writeFileSync('data/actors.json', JSON.stringify(merged, null, 2));
            console.log('✅ Total actors in database:', merged.length);
          } else {
            console.log('ℹ️ No new actors today');
          }
        }

        main().catch(err => {
          console.error('❌ Error:', err.message);
          process.exit(1);
        });
        EOF

    - name: Generate ALL HTML pages + sitemap
      run: |
        echo "=== Generating pages ==="
        node generate.js
        echo "=== Checking results ==="
        echo "Actor folders:"
        ls actors/ | wc -l
        echo "Sitemap URLs:"
        grep -c '<loc>' sitemap.xml || echo "Sitemap check"
        echo "=== Done ==="

    - name: Commit and push EVERYTHING
      run: |
        git config --global user.email "action@github.com"
        git config --global user.name "GitHub Actions Bot"
        git add -A
        git status
        CHANGES=$(git diff --staged --name-only | wc -l)
        echo "Files changed: $CHANGES"
        if [ "$CHANGES" -gt "0" ]; then
          git commit -m "auto: $(date +'%Y-%m-%d') - new actor pages added"
          git push origin main
          echo "✅ Successfully pushed!"
        else
          echo "ℹ️ No changes to push"
        fi