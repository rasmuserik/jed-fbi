let fs = require("fs");
let {manifest} = require("./fbi.js");

function shuffle(arr) {
  for(let i = 0; i < arr.length; ++i) {
    let j = Math.floor(Math.random() * arr.length);
    let t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
  }
}

let pids = fs
  .readFileSync("./pids.txt", "utf8")
  .split("\n")
  .filter((x) => x);

let errors = [];
async function main() {
  let i = 0;
  let t0 = Date.now();
  let t1 = Date.now();
  shuffle(pids);
  for (const pid of pids) {
    try {
      console.log(++i, errors.length, Date.now() - t1,(Date.now() - t0)/i | 0,  pid);
      t1 = Date.now();
      let o = await manifest(pid);
    } catch (e) {
      errors.push(pid);
      console.error(e);
    }
  }
  fs.writeFileSync("errors.txt", errors.join("\n"));
  await sleep(100000000);
}
main();
