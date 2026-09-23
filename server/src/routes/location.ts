import { Router } from "express";

export const locationRouter = Router();

const countries = [
  { id: "AR", name: "Argentina" },
  { id: "CL", name: "Chile" },
  { id: "CO", name: "Colombia" },
  { id: "MX", name: "Mexico" },
  { id: "PE", name: "Peru" }
];

const countryNames: Record<string, string> = {
  AR: "Argentina",
  CL: "Chile",
  CO: "Colombia",
  MX: "Mexico",
  PE: "Peru"
};

locationRouter.get("/countries", (_req, res) => {
  res.json(countries);
});

locationRouter.get("/cities-search", async (req, res) => {
  const { query, country } = req.query;
  
  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "Query parameter is required" });
  }
  if (!country || typeof country !== "string") {
    return res.status(400).json({ error: "Country parameter is required" });
  }

  const countryName = countryNames[country];
  if (!countryName) {
    return res.status(404).json({ error: "Country not found" });
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(query)}&country=${encodeURIComponent(countryName)}&format=json&limit=10`;
    
    const response = await fetch(url, {
      headers: { 
        "User-Agent": "MatchVol-App (https://matchvol.app; contact@matchvol.app)" 
      }
    });
    
    if (!response.ok) throw new Error("Nominatim request failed");
    
    const data = await response.json();
    
    const cities = data
      .map((item: any) => item.address?.city || item.name)
      .filter((city: string, index: number, self: string[]) => city && self.indexOf(city) === index)
      .slice(0, 5);

    res.json(cities);
  } catch (error) {
    console.error("Error searching cities:", error);
    res.status(500).json({ error: "Failed to search cities" });
  }
});