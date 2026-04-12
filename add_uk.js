const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data/actors.json','utf8'));

const uk = [
{"id":"benedict-cumberbatch","name":"Benedict Cumberbatch","slug":"benedict-cumberbatch","country":"UK","countrySlug":"uk","movies":["doctor-strange","sherlock","the-imitation-game"]},
{"id":"tom-holland","name":"Tom Holland","slug":"tom-holland","country":"UK","countrySlug":"uk","movies":["spider-man-no-way-home","uncharted","the-impossible"]},
{"id":"henry-cavill","name":"Henry Cavill","slug":"henry-cavill","country":"UK","countrySlug":"uk","movies":["man-of-steel","the-witcher","mission-impossible-fallout"]},
{"id":"idris-elba","name":"Idris Elba","slug":"idris-elba","country":"UK","countrySlug":"uk","movies":["luther","thor","beasts-of-no-nation"]},
{"id":"daniel-radcliffe","name":"Daniel Radcliffe","slug":"daniel-radcliffe","country":"UK","countrySlug":"uk","movies":["harry-potter","guns-akimbo","the-woman-in-black"]},
{"id":"emma-watson","name":"Emma Watson","slug":"emma-watson","country":"UK","countrySlug":"uk","movies":["harry-potter","beauty-and-the-beast","little-women"]},
{"id":"rupert-grint","name":"Rupert Grint","slug":"rupert-grint","country":"UK","countrySlug":"uk","movies":["harry-potter","servant","snatch"]},
{"id":"kate-winslet","name":"Kate Winslet","slug":"kate-winslet","country":"UK","countrySlug":"uk","movies":["titanic","the-reader","avatar-2"]},
{"id":"christian-bale","name":"Christian Bale","slug":"christian-bale","country":"UK","countrySlug":"uk","movies":["batman-begins","american-psycho","ford-v-ferrari"]},
{"id":"gary-oldman","name":"Gary Oldman","slug":"gary-oldman","country":"UK","countrySlug":"uk","movies":["darkest-hour","harry-potter","leon"]},

{"id":"keira-knightley","name":"Keira Knightley","slug":"keira-knightley","country":"UK","countrySlug":"uk","movies":["pirates-of-the-caribbean","pride-and-prejudice","atonement"]},
{"id":"orlando-bloom","name":"Orlando Bloom","slug":"orlando-bloom","country":"UK","countrySlug":"uk","movies":["lord-of-the-rings","pirates-of-the-caribbean","troy"]},
{"id":"tom-hardy","name":"Tom Hardy","slug":"tom-hardy","country":"UK","countrySlug":"uk","movies":["venom","mad-max-fury-road","inception"]},
{"id":"andrew-garfield","name":"Andrew Garfield","slug":"andrew-garfield","country":"UK","countrySlug":"uk","movies":["the-amazing-spider-man","hacksaw-ridge","tick-tick-boom"]},
{"id":"robert-pattinson","name":"Robert Pattinson","slug":"robert-pattinson","country":"UK","countrySlug":"uk","movies":["the-batman","twilight","tenet"]},
{"id":"colin-firth","name":"Colin Firth","slug":"colin-firth","country":"UK","countrySlug":"uk","movies":["the-kings-speech","kingsman","pride-and-prejudice"]},
{"id":"hugh-grant","name":"Hugh Grant","slug":"hugh-grant","country":"UK","countrySlug":"uk","movies":["notting-hill","love-actually","paddington-2"]},
{"id":"emilia-clarke","name":"Emilia Clarke","slug":"emilia-clarke","country":"UK","countrySlug":"uk","movies":["game-of-thrones","me-before-you","terminator-genisys"]},
{"id":"richard-madden","name":"Richard Madden","slug":"richard-madden","country":"UK","countrySlug":"uk","movies":["bodyguard","eternals","cinderella"]},
{"id":"kit-harington","name":"Kit Harington","slug":"kit-harington","country":"UK","countrySlug":"uk","movies":["game-of-thrones","eternals","pompeii"]},

{"id":"john-boyega","name":"John Boyega","slug":"john-boyega","country":"UK","countrySlug":"uk","movies":["star-wars","attack-the-block","detroit"]},
{"id":"taron-egerton","name":"Taron Egerton","slug":"taron-egerton","country":"UK","countrySlug":"uk","movies":["kingsman","rocketman","black-bird"]},
{"id":"eddie-redmayne","name":"Eddie Redmayne","slug":"eddie-redmayne","country":"UK","countrySlug":"uk","movies":["theory-of-everything","fantastic-beasts","the-good-nurse"]},
{"id":"jude-law","name":"Jude Law","slug":"jude-law","country":"UK","countrySlug":"uk","movies":["sherlock-holmes","the-talented-mr-ripley","fantastic-beasts"]},
{"id":"helena-bonham-carter","name":"Helena Bonham Carter","slug":"helena-bonham-carter","country":"UK","countrySlug":"uk","movies":["harry-potter","fight-club","the-crown"]},
{"id":"maggie-smith","name":"Maggie Smith","slug":"maggie-smith","country":"UK","countrySlug":"uk","movies":["harry-potter","downton-abbey","the-lady-in-the-van"]},
{"id":"rowan-atkinson","name":"Rowan Atkinson","slug":"rowan-atkinson","country":"UK","countrySlug":"uk","movies":["mr-bean","johnny-english","blackadder"]},
{"id":"jason-statham","name":"Jason Statham","slug":"jason-statham","country":"UK","countrySlug":"uk","movies":["transporter","fast-and-furious","the-meg"]},
{"id":"vinnie-jones","name":"Vinnie Jones","slug":"vinnie-jones","country":"UK","countrySlug":"uk","movies":["snatch","lock-stock","x-men"]},
{"id":"charlie-hunnam","name":"Charlie Hunnam","slug":"charlie-hunnam","country":"UK","countrySlug":"uk","movies":["sons-of-anarchy","pacific-rim","king-arthur"]},

{"id":"dev-patel","name":"Dev Patel","slug":"dev-patel","country":"UK","countrySlug":"uk","movies":["slumdog-millionaire","lion","the-green-knight"]},
{"id":"naomie-harris","name":"Naomie Harris","slug":"naomie-harris","country":"UK","countrySlug":"uk","movies":["moonlight","skyfall","pirates-of-the-caribbean"]},
{"id":"carey-mulligan","name":"Carey Mulligan","slug":"carey-mulligan","country":"UK","countrySlug":"uk","movies":["drive","promising-young-woman","the-great-gatsby"]},
{"id":"felicity-jones","name":"Felicity Jones","slug":"felicity-jones","country":"UK","countrySlug":"uk","movies":["rogue-one","theory-of-everything","inferno"]},
{"id":"lily-james","name":"Lily James","slug":"lily-james","country":"UK","countrySlug":"uk","movies":["cinderella","baby-driver","mamma-mia-2"]},
{"id":"jodie-comer","name":"Jodie Comer","slug":"jodie-comer","country":"UK","countrySlug":"uk","movies":["killing-eve","free-guy","the-last-duel"]},
{"id":"florence-pugh","name":"Florence Pugh","slug":"florence-pugh","country":"UK","countrySlug":"uk","movies":["oppenheimer","midsommar","black-widow"]},
{"id":"vanessa-kirby","name":"Vanessa Kirby","slug":"vanessa-kirby","country":"UK","countrySlug":"uk","movies":["the-crown","mission-impossible","napoleon"]},
{"id":"rachel-weisz","name":"Rachel Weisz","slug":"rachel-weisz","country":"UK","countrySlug":"uk","movies":["the-mummy","black-widow","the-favourite"]},
{"id":"thandie-newton","name":"Thandie Newton","slug":"thandie-newton","country":"UK","countrySlug":"uk","movies":["westworld","mission-impossible","crash"]},

{"id":"mark-strong","name":"Mark Strong","slug":"mark-strong","country":"UK","countrySlug":"uk","movies":["kingsman","shazam","1917"]},
{"id":"clive-owen","name":"Clive Owen","slug":"clive-owen","country":"UK","countrySlug":"uk","movies":["children-of-men","closer","inside-man"]},
{"id":"timothy-spall","name":"Timothy Spall","slug":"timothy-spall","country":"UK","countrySlug":"uk","movies":["harry-potter","mr-turner","secrets-and-lies"]},
{"id":"domhnall-gleeson","name":"Domhnall Gleeson","slug":"domhnall-gleeson","country":"UK","countrySlug":"uk","movies":["ex-machina","about-time","star-wars"]},
{"id":"bill-nighy","name":"Bill Nighy","slug":"bill-nighy","country":"UK","countrySlug":"uk","movies":["love-actually","about-time","living"]},
{"id":"ben-kingsley","name":"Ben Kingsley","slug":"ben-kingsley","country":"UK","countrySlug":"uk","movies":["gandhi","shutter-island","iron-man-3"]},
{"id":"olivia-colman","name":"Olivia Colman","slug":"olivia-colman","country":"UK","countrySlug":"uk","movies":["the-favourite","the-crown","hot-fuzz"]},
{"id":"paul-bettany","name":"Paul Bettany","slug":"paul-bettany","country":"UK","countrySlug":"uk","movies":["wanda-vision","a-beautiful-mind","iron-man"]},
{"id":"daniel-craig","name":"Daniel Craig","slug":"daniel-craig","country":"UK","countrySlug":"uk","movies":["james-bond","knives-out","casino-royale"]},
{"id":"pierce-brosnan","name":"Pierce Brosnan","slug":"pierce-brosnan","country":"UK","countrySlug":"uk","movies":["james-bond","mamma-mia","goldeneye"]}
];

const existing = new Set(data.map(a=>a.slug));
const newActors = uk.filter(a=>!existing.has(a.slug));
const merged = [...data, ...newActors];

fs.writeFileSync('data/actors.json', JSON.stringify(merged, null, 2));

console.log('Added:', newActors.length, 'UK actors');
console.log('Total now:', merged.length);