const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// 🛠 Tillåt CORS för alla domäner (för testing)
app.use(cors({
    origin: "https://säkerid.se", // Byt till din frontend-URL i produktion, t.ex. "https://dinhemsida.com"
    methods: ["GET"],
    allowedHeaders: ["Content-Type", "hibp-api-key"]
}));

// 📌 Huvud-rout för att kolla breaches
app.get("/check-breach", async (req, res) => {
    const email = req.query.email;
    if (!email) {
        return res.status(400).json({ error: "Ingen e-postadress angiven" });
    }

    try {
        const apiKey = process.env.HIBP_API_KEY;
        const response = await fetch(`https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}`, {
            method: "GET",
            headers: {
                "hibp-api-key": apiKey,
                "User-Agent": "HIBP Checker"
            }
        });

        if (response.status === 404) {
            return res.json({ message: "✅ Din e-post har inte hittats i några kända dataläckor." });
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Serverfel. Försök igen senare." });
    }
});

// 🔥 Starta servern
app.listen(PORT, () => {
    console.log(`Servern körs på http://localhost:${PORT}`);
});
