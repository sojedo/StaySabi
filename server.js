import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import url from 'url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const DB_PATH = path.join(__dirname, 'listings.json');

function safeReadListings() {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read listings.json', e);
    return [];
  }
}

function parseQuery(q) {
  const text = (q || '').toLowerCase();
  const cities = ['lagos','abuja','port harcourt','ibadan','enugu','ph','phc'];
  const areas = ['lekki','ikeja','oniru','yaba','wuse','gwarinpa','victoria island','vi','gra','ring road','peter odili'];
  const amenities = ['wifi','ac','pool','gym','parking','security','kitchen','generator','fan'];
  let city = null, area = null, minPrice = null, maxPrice = null, bedrooms = null;
  const requestedAmenities = new Set();

  for (const c of cities) { if (text.includes(c)) { city = c.replace('phc','port harcourt').replace('ph','port harcourt'); break; } }
  for (const a of areas) { if (text.includes(a)) { area = a; break; } }

  const underMatch = text.match(/under\s*(\d{2,6}) ?k?/);
  const belowMatch = text.match(/below\s*(\d{2,6}) ?k?/);
  const maxMatch = text.match(/max\s*(\d{2,6}) ?k?/);
  const betweenMatch = text.match(/between\s*(\d{2,6}) ?k?\s*(?:and|to)\s*(\d{2,6}) ?k?/);
  if (betweenMatch) { minPrice = parseInt(betweenMatch[1]) * 1000; maxPrice = parseInt(betweenMatch[2]) * 1000; }
  else if (underMatch || belowMatch || maxMatch) {
    const num = parseInt((underMatch?.[1] || belowMatch?.[1] || maxMatch?.[1]));
    maxPrice = num * 1000;
  }
  if (text.includes('budget') || text.includes('cheap')) { maxPrice = maxPrice ? Math.min(maxPrice, 40000) : 40000; }

  const bedMatch = text.match(/(\d)\s*(?:bed|br|bedroom)/);
  if (bedMatch) bedrooms = parseInt(bedMatch[1]);

  for (const a of amenities) { if (text.includes(a)) requestedAmenities.add(a); }
  if (text.includes('24/7 security') || text.includes('security')) requestedAmenities.add('24/7 Security');

  return { city, area, minPrice, maxPrice, bedrooms, amenities: Array.from(requestedAmenities) };
}

function scoreListing(listing, parsed) {
  let score = 0;
  const reasons = [];

  if (parsed.city && listing.city.toLowerCase().includes(parsed.city)) { score += 25; reasons.push(`City matches ${listing.city}`); }
  if (parsed.area && listing.area.toLowerCase().includes(parsed.area)) { score += 15; reasons.push(`Area matches ${listing.area}`); }

  if (parsed.bedrooms != null) {
    const diff = Math.abs(listing.bedrooms - parsed.bedrooms);
    const s = Math.max(0, 20 - diff * 10);
    score += s; if (s>0) reasons.push(`Bedrooms ~${parsed.bedrooms}`);
  }

  if (parsed.maxPrice != null) {
    if (listing.price_per_night <= parsed.maxPrice) { score += 20; reasons.push(`Price ≤ ₦${parsed.maxPrice.toLocaleString()}`); }
    else { score -= 10; reasons.push('Price above budget'); }
  }
  if (parsed.minPrice != null) {
    if (listing.price_per_night >= parsed.minPrice) { score += 5; reasons.push(`Price ≥ ₦${parsed.minPrice.toLocaleString()}`); }
  }

  if (parsed.amenities?.length) {
    const got = parsed.amenities.filter(a => listing.amenities.map(x=>x.toLowerCase()).includes(a.toLowerCase()));
    score += got.length * 6;
    if (got.length) reasons.push(`Amenities: ${got.join(', ')}`);
  }

  if (listing.power?.hours_per_day >= 22) { score += 8; reasons.push('Reliable power'); }
  if (listing.host?.verified) { score += 7; reasons.push('Verified host'); }
  score += (listing.rating || 0);

  score = Math.max(0, Math.min(100, Math.round(score)));
  return {score, reasons};
}

app.get('/api/listings', (_req, res) => {
  const data = safeReadListings();
  res.json({ count: data.length, listings: data });
});

app.get('/api/search', (req, res) => {
  const q = req.query.text || '';
  const parsed = parseQuery(q);
  const data = safeReadListings();
  let results = data.map(l => {
    const {score, reasons} = scoreListing(l, parsed);
    return { listing: l, score, reasons };
  });
  if (parsed.city) results = results.filter(r => r.listing.city.toLowerCase().includes(parsed.city));
  if (parsed.area) results = results.filter(r => r.listing.area.toLowerCase().includes(parsed.area));
  if (parsed.maxPrice != null) results = results.filter(r => r.listing.price_per_night <= parsed.maxPrice);
  if (parsed.minPrice != null) results = results.filter(r => r.listing.price_per_night >= parsed.minPrice);
  if (parsed.bedrooms != null) results = results.filter(r => r.listing.bedrooms >= parsed.bedrooms);

  results.sort((a,b)=> b.score - a.score);
  res.json({ query: q, parsed, total: results.length, results });
});

app.post('/api/booking', (req, res) => {
  const body = req.body || {};
  res.json({ status: 'mock-booking-created', received: body });
});

app.get('/api/health', (_req,res)=> res.json({ ok: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`StaySabi server running on http://localhost:${PORT}`);
});
