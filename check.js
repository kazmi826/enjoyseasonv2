const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');
console.log('home-actor-card count:', (h.match(/home-actor-card/g)||[]).length);
console.log('home-media-card count:', (h.match(/home-media-card/g)||[]).length);
console.log('homeActorsGrid count:', (h.match(/homeActorsGrid/g)||[]).length);
console.log('homeDramasGrid count:', (h.match(/homeDramasGrid/g)||[]).length);