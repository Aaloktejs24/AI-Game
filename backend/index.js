import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import JSZip from "jszip";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/generate-assets", async (req, res) => {
  const { prompt } = req.body;
  try {
    const response = await fetch("http://localhost:6006/generate-assets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });
    const data = await response.json();
    res.json({ assets: data.assets });
  } catch (err) {
    console.error("Asset generation failed:", err.message);
    res.status(500).json({ error: "AI asset generation failed." });
  }
});

app.post("/api/adjust-parameters", (req, res) => {
  const { prompt } = req.body;
  const lower = prompt.toLowerCase();
  const hard = lower.includes("hard") || lower.includes("fast");

  res.json({
    parameters: {
      gravity: hard ? 9.8 : 4.5,
      speed: hard ? 12 : 6,
      obstacleGap: hard ? 100 : 200
    }
  });
});

app.post("/api/export-game", async (req, res) => {
  const { game, assets, parameters } = req.body;
  const zip = new JSZip();
  const folder = game.toLowerCase().replace(/\s+/g, "-");
  const gamePath = path.join("backend", "templates", folder);

  if (!fs.existsSync(gamePath)) {
    return res.status(400).json({ error: `Game "${game}" not found.` });
  }

  let html = fs.readFileSync(path.join(gamePath, "index.html"), "utf8");
  html = html.replace("</body>", `
    <script>
      const injectedAssets = ${JSON.stringify(assets)};
      const injectedParams = ${JSON.stringify(parameters)};
    </script>
    </body>`);

  zip.file("index.html", html);
  zip.file("config.json", JSON.stringify({ game, assets, parameters }, null, 2));

  const assetDir = path.join(gamePath, "assets");
  if (fs.existsSync(assetDir)) {
    for (const file of fs.readdirSync(assetDir)) {
      const data = fs.readFileSync(path.join(assetDir, file));
      zip.file(`assets/${file}`, data);
    }
  }

  const buffer = await zip.generateAsync({ type: "nodebuffer" });
  res.setHeader("Content-Disposition", `attachment; filename=${game}_custom.zip`);
  res.setHeader("Content-Type", "application/zip");
  res.send(buffer);
});

export default app;