import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT || 2909);
const DATA_FILE = path.join(__dirname, "data.json");

function loadData() {
  try {
    const d = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    return { points: Math.max(0, Number(d.points)||0), strikes: Math.max(0, Number(d.strikes)||0) };
  } catch {
    return { points: 5, strikes: 2 };
  }
}
let data = loadData();
const save = () => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
save();

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
