const resultsEl = document.getElementById('results');
const form = document.getElementById('searchForm');
const qEl = document.getElementById('q');
const parsedEl = document.getElementById('parsed');
document.getElementById('year').textContent = new Date().getFullYear();

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const q = qEl.value.trim();
  const { data } = await axios.get(`/api/search`, { params: { text: q } });
  parsedEl.textContent = `Parsed → ${JSON.stringify(data.parsed)}`;
  renderResults(data.results);
});

async function initialLoad(){
  const { data } = await axios.get('/api/listings');
  renderResults(data.listings.map(l => ({ listing: l, score: 0, reasons: ['No query — showing all'] })));
}
initialLoad();

function naira(n){ return `₦${n.toLocaleString()}`; }

function renderResults(items){
  if (!items.length){
    resultsEl.innerHTML = `<div class="col-12 text-center text-muted">No results. Try changing your query.</div>`;
    return;
  }
  resultsEl.innerHTML = items.map(({listing, score, reasons}) => `
    <div class="col-md-6 col-lg-4">
      <div class="card listing-card h-100 shadow-sm border-0">
        <img src="${listing.images?.[0]||''}" class="w-100" height="180" style="object-fit:cover" alt="${listing.title}"/>
        <div class="card-body d-flex flex-column">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="score-pill">Match ${score}%</span>
            <span class="badge bg-success">${listing.host?.verified ? 'Verified host' : 'Unverified'}</span>
          </div>
          <h5 class="card-title mb-1">${listing.title}</h5>
          <div class="text-muted mb-2">${listing.area}, ${listing.city} • ${naira(listing.price_per_night)}/night</div>
          <div class="small mb-2">Bedrooms: ${listing.bedrooms} • Sleeps: ${listing.sleeps}</div>
          <div class="d-flex flex-wrap gap-1 mb-2">
            ${listing.amenities.map(a => `<span class="badge rounded-pill text-dark badge-soft">${a}</span>`).join('')}
          </div>
          <div class="small text-muted mb-3">Power: ${listing.power?.hours_per_day}h/day • Net: ${listing.internet_mbps} Mbps • Rating: ${listing.rating}</div>
          <details class="small mb-3">
            <summary>Why this matched</summary>
            <ul class="mb-0">${reasons.map(r => `<li>${r}</li>`).join('')}</ul>
          </details>
          <button class="btn btn-primary w-100 mt-auto" onclick='mockBook(${JSON.stringify(listing.id)})'>Book (demo)</button>
        </div>
      </div>
    </div>
  `).join('');
}

async function mockBook(id){
  const payload = { listingId: id, checkIn: '2025-09-01', checkOut: '2025-09-05', guests: 2 };
  const { data } = await axios.post('/api/booking', payload);
  alert(`Booking created (mock): ${JSON.stringify(data)}`);
}
