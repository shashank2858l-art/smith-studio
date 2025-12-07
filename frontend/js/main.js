// Load services for index & services page
async function loadServices() {
  const res = await fetch('/api/admin/services', {
    headers: { 'Authorization': 'Bearer ' + (localStorage.getItem('token') || '') }
  });
  let services;
  try { services = await res.json(); } catch { services = []; }

  const grid = document.getElementById('servicesGrid') || document.getElementById('servicesList');
  if (!grid) return;

  grid.innerHTML = services.map(s => `
    <div class="card">
      <img src="/images/service-${s.id || 1}.jpg" alt="${s.name}">
      <div class="card-body">
        <div class="card-title">${s.name}</div>
        <div class="card-price">₹${s.price}</div>
        <p>${s.desc}</p>
      </div>
    </div>
  `).join('');
}

// Populate service dropdown on booking page
async function populateServiceSelect() {
  const select = document.getElementById('serviceSelect');
  if (!select) return;
  const res = await fetch('/api/admin/services', {
    headers: { 'Authorization': 'Bearer ' + (localStorage.getItem('token') || '') }
  });
  const services = await res.json();
  services.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.name;
    opt.textContent = s.name;
    select.appendChild(opt);
  });

  const form = document.getElementById('bookingForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      alert('Booking submitted! We will contact you soon.');
      form.reset();
    } else {
      alert('Error submitting booking.');
    }
  });
}

// Gallery + lightbox
async function loadGallery() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;
  
  try {
    const res = await fetch('/api/public/gallery');  // ← CHANGE THIS
    const items = await res.json();
    
    console.log('Gallery loaded:', items);  // Debug
    
    if (!items || items.length === 0) {
      grid.innerHTML = '<p>No images yet.</p>';
      return;
    }

    grid.innerHTML = items.map(i => `
      <div class="gallery-item" data-url="${i.url}" data-title="${i.title}">
        <img src="${i.url}" alt="${i.title}">
        <div class="gallery-caption">${i.title}</div>
      </div>
    `).join('');

    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const close = document.getElementById('lightboxClose');

    grid.addEventListener('click', (e) => {
      const item = e.target.closest('.gallery-item');
      if (!item) return;
      lightboxImg.src = item.dataset.url;
      lightboxTitle.textContent = item.dataset.title;
      lightbox.classList.remove('hidden');
    });
    close.addEventListener('click', () => lightbox.classList.add('hidden'));
  } catch (err) {
    console.error('Gallery error:', err);
  }
}

// init
document.addEventListener('DOMContentLoaded', () => {
  loadServices();
  populateServiceSelect();
  loadGallery();
});

