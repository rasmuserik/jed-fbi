let sqlite = require("better-sqlite3");
let fs = require("fs");

let db;
function initdb() {
  db = new sqlite("bib.db");
  db.exec(`
    CREATE TABLE IF NOT EXISTS bib (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pid TEXT UNIQUE,
      wid INTEGER,
      json TEXT
    );
  `);
}
async function jed(pid) {
  pid = decodeURIComponent(pid).toLowerCase();
  if (!db.prepare(`SELECT id FROM bib WHERE pid = ?`).get(pid)?.id) {
    for (const o of await fetchWork(pid)) {
      dbput(o);
    }
  }
  return JSON.parse(
    db.prepare(`SELECT json FROM bib WHERE pid = ?`).get(pid)?.json ||
      "undefined"
  );
}
function dbput(o) {
  let pid = o.pid;
  pid = decodeURIComponent(pid).toLowerCase();
  if (db.prepare(`SELECT id FROM bib WHERE pid = ?`).get(pid)?.id) return;
  let stmt = db.prepare(`INSERT INTO bib (pid, json) VALUES (?, ?)`);
  stmt.run(pid, JSON.stringify(o));
}
let _token;
async function getToken() {
  if (!_token) {
    let res = await fetch("https://auth.dbc.dk/oauth/token", {
      method: "POST",
      headers: {
        authorization:
          "Basic " +
          Buffer.from(
            `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
          ).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=password&username=@&password=@",
    });
    _token = (await res.json()).access_token;
    console.log("access token:", _token);
  }
  return _token;
}
let manifestFields = fs.readFileSync("./manifest.graphql", "utf8");
let pids = fs
  .readFileSync("./pids.txt", "utf8")
  .split("\n")
  .filter((x) => x);
async function fetchWork(pid) {
  console.log("fetchWork", pid);
  let res = await fetch("https://fbi-api.dbc.dk/SimpleSearch/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: "bearer " + (await getToken()),
    },
    body: JSON.stringify({
      query: `
        query ($pid: String!) {
          work(pid: $pid) {
            manifestations {all {${manifestFields}}}
          }
        }
      `,
      variables: { pid },
    }),
  });
  return (await res.json()).data.work.manifestations.all;
}

let sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let errors = [];
async function main() {
  initdb();
  let i = 0;
  let t0 = Date.now();
  let t1 = Date.now();
  for (const pid of pids) {
    try {
      console.log(++i, errors.length, Date.now() - t1,(Date.now() - t0)/i | 0,  pid);
      t1 = Date.now();
      await jed(pid);
    } catch (e) {
      errors.push(pid);
      console.error(e);
    }
  }
  fs.writeFileSync("errors.txt", errors.join("\n"));
  await sleep(100000000);
}
main();
