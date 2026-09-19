import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT || 2909);
const DATA_FILE = process.env.BUNNY_DATA_FILE || path.join(
  fs.existsSync("/srv/chatgpt/sandbox/data") ? "/srv/chatgpt/sandbox/data" : path.join(__dirname, "data"),
  "data.json"
);

function loadData() {
  const d = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  if (!Number.isInteger(d.points) || d.points < 0 ||
      !Number.isInteger(d.strikes) || d.strikes < 0) {
    throw new Error("Invalid Bunny state; refusing to overwrite stored data");
  }
  return { points: d.points, strikes: d.strikes };
}
let data = loadData();
const save = () => {
  const temporary = DATA_FILE + ".tmp";
  fs.writeFileSync(temporary, JSON.stringify(data, null, 2), { mode: 0o640 });
  fs.renameSync(temporary, DATA_FILE);
};

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function isPookie(req) {
  const host = (req.hostname || "").toLowerCase();
  return host.startsWith("pookie.") || host === "localhost" || host === "127.0.0.1";
}

app.get("/api/state", (req,res) => res.json({ ...data, adminSite: isPookie(req) }));

app.post("/api/change", (req,res) => {
  if (!isPookie(req)) return res.status(403).json({error:"forbidden"});
  const {field} = req.body || {};
  const amount = Number(req.body?.amount);
  if (!["points","strikes"].includes(field) || !Number.isInteger(amount)) return res.status(400).json({error:"bad_request"});
  data[field] = Math.max(0, Math.min(999, data[field] + amount));
  save();
  res.json(data);
});

app.listen(PORT, "127.0.0.1", () => console.log(`Bunny's Little Garden running on 127.0.0.1:${PORT}`));
