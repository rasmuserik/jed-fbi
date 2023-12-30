let { manifest, allPids } = require("./fbi.js");

function shuffle(arr) {
    for (let i = 0; i < arr.length; ++i) {
          let j = Math.floor(Math.random() * arr.length);
          let t = arr[i];
          arr[i] = arr[j];
          arr[j] = t;
        }
} 

let sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let stats = {};
let enumerate = [
  ".accessTypes[].code",
  ".audience.childrenOrAdults[].code",
  ".subjects.all[].type",
  ".workTypes[]",
];
enumerate = [];
function stat(o, prefix = "") {
  let s = stats[prefix] || (stats[prefix] = { count: 0, has: 0, samples: [] });
  s.count++;
  if (enumerate.includes(prefix)) {
    t =
      stats[prefix + '"' + o + '"'] ||
      (stats[prefix + '"' + o + '"'] = { has: 0, count: 0, samples: [] });
    t.has++;
    t.count++;
  }
  if (o === null || o === undefined || (Array.isArray(o) && o.length === 0)) {
    return;
  }
  s.has++;
  if (
    typeof o !== "object" &&
    s.samples.length < 10 &&
    (s.samples.length < 1 || Math.random() < 0.03)
  ) {
    s.samples.push(o);
  }
  if (Array.isArray(o)) {
    for (const x of o) {
      stat(x, prefix + "[]");
    }
  } else if (typeof o === "object") {
    for (const k in o) {
      stat(o[k], prefix + "." + k);
    }
  }
}
function writeStats() {
  let keys = Object.keys(stats);
  keys.sort();
  for (const k of keys) {
    let s = stats[k];
    let line = `${k} ${(((1000 * s.has) / s.count) | 0) / 10}% ${s.has}/${
      s.count
    } ${JSON.stringify(s.samples)}`;
    line = line.slice(0, 200);
    console.log(line);
  }
}
async function main() {
  let i = 0;
  let pids = await allPids();
  shuffle(pids);
  for (const pid of pids) {
    //if ( pid.match(/^[0-9]*-katalog:/)) 
    //if ( pid.match(/^870970-basis:/)) 
      stat(await manifest(pid));
    if (++i % 1000 === 0) {
      console.error(i, pids.length, pid);
    }
  }
  writeStats();
  //await sleep(100000000);
}
main();
