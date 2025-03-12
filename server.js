const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.HIBP_API_KEY; // Sätt API-nyckeln i miljövariabler

app.use(cors());

app.get("/check-breach", async (req, res) => {
    const email = req.query.email;
    if (!email) return res.status(400).json({ error: "Email is required" });

    try {
        const response = await fetch(`https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}`, {
            method: "GET",
            headers: {
                "hibp-api-key": API_KEY,
                "user-agent": "DinAppNamn"
            }
        });

        if (response.status === 200) {
            const data = await response.json();
            res.json(data);
        } else if (response.status === 404) {
            res.json({ message: "Ingen breach hittades för denna e-post" });
        } else {
            res.status(response.status).json({ error: "Fel vid API-anrop" });
        }
    } catch (error) {
        res.status(500).json({ error: "Serverfel" });
    }
});

app.listen(PORT, () => console.log(`Server körs på port ${PORT}`));
