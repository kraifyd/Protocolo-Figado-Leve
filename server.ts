import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("events.db");
db.exec(`
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_name TEXT,
    event_time INTEGER,
    user_data TEXT,
    custom_data TEXT,
    status TEXT,
    response TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Meta CAPI Endpoint
  app.post("/api/event", async (req, res) => {
    const { eventName, userData, customData, eventSourceUrl } = req.body;
    
    const pixelId = process.env.META_PIXEL_ID || "1707703070196851";
    const accessToken = process.env.META_ACCESS_TOKEN;

    if (!accessToken) {
      console.warn("META_ACCESS_TOKEN not found in environment variables.");
      return res.status(500).json({ error: "Meta Access Token not configured" });
    }

    const eventTime = Math.floor(Date.now() / 1000);
    const payload = {
      data: [
        {
          event_name: eventName,
          event_time: eventTime,
          action_source: "website",
          event_source_url: eventSourceUrl,
          user_data: {
            client_ip_address: req.ip,
            client_user_agent: req.headers["user-agent"],
            ...userData
          },
          custom_data: customData
        }
      ]
    };

    try {
      const response = await fetch(`https://graph.facebook.com/v20.0/${pixelId}/events?access_token=${accessToken}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      
      // Log to SQLite
      const stmt = db.prepare("INSERT INTO events (event_name, event_time, user_data, custom_data, status, response) VALUES (?, ?, ?, ?, ?, ?)");
      stmt.run(
        eventName,
        eventTime,
        JSON.stringify(userData),
        JSON.stringify(customData),
        response.ok ? "success" : "error",
        JSON.stringify(result)
      );

      res.json(result);
    } catch (error) {
      console.error("Error sending event to Meta CAPI:", error);
      res.status(500).json({ error: "Failed to send event" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
