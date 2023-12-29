let sqlite = require("better-sqlite3");
let fs = require("fs");

let db;
let _initialised = false;
function initdb() {
  if(_initialised) return;
  _initialised = true;
  db = new sqlite("bib.db");
  //db.exec(`DROP TABLE IF EXISTS bib;`)
  db.exec(`
    CREATE TABLE IF NOT EXISTS bib (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pid TEXT UNIQUE,
      wid INTEGER,
      json TEXT,
      fetched DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  // add pragmas for performance
  db.pragma("synchronous=NORMAL");
  db.pragma("journal_mode=WAL");
}
async function allPids() {
  initdb();
  return db.prepare(`SELECT pid FROM bib`).all().map(x => x.pid);
}
async function manifest(pid) {
  initdb();
  pid = decodeURIComponent(pid).toLowerCase();
  if (!db.prepare(`SELECT id FROM bib WHERE pid = ?`).get(pid)?.id) {
    console.log('fetching', pid);
    let work = await fetchWork(pid)
    for (const o of work) {
      dbput(o);
    }
    let workId = work[0].ownerWork.workId.replace("work-of:", "");
    let wid = db.prepare(`SELECT id FROM bib WHERE pid = ?`).get(workId)?.id;
    for(const o of work) {
      db.prepare(`UPDATE bib SET wid = ? WHERE pid = ?`).run(wid, o.pid);
    }
    for(const o of work) {
      for(const relName in o.relations) {
        for(const rel of o.relations[relName]) {
          if(rel.pid) await manifest(rel.pid);
        }
      }
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
async function fetchWork(pid) {
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
module.exports = {
  manifest,
  allPids
}
