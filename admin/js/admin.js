const API_BASE = '/api';
const token = localStorage.getItem('token');

// login
if (document.getElementById('adminLoginForm')) {
  document.getElementById('adminLoginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      window.location.href = 'dashboard.html';
    } else {
      alert(data.message || 'Login failed');
    }
  });
}

// require token for admin pages
if (!window.location.pathname.endsWith('login.html') && window.location.pathname.includes('/admin')) {
  if (!token) {
    window.location.href = 'login.html';
  }
}

// dashboard stats
async function loadStats() {
  const statsDiv = document.getElementById('stats');
  if (!statsDiv) return;
  const bookings = await fetch(`${API_BASE}/admin/bookings`, {
    headers: { 'Authorization': 'Bearer ' + token }
  }).then(r => r.json());
  const services = await fetch(`${API_BASE}/admin/services`, {
    headers: { 'Authorization': 'Bearer ' + token }
  }).then(r => r.json());

  statsDiv.innerHTML = `
    <div class="stat-card"><h4>Total Bookings</h4><p>${bookings.length}</p></div>
    <div class="stat-card"><h4>Services</h4><p>${services.length}</p></div>
  `;
}

// services
async function loadAdminServices() {
  const tbody = document.getElementById('servicesTableBody');
  if (!tbody) return;
  const services = await fetch(`${API_BASE}/admin/services`, {
    headers: { 'Authorization': 'Bearer ' + token }
  }).then(r => r.json());
  tbody.innerHTML = services.map(s => `
    <tr><td>${s.id}</td><td>${s.name}</td><td>₹${s.price}</td><td>${s.desc}</td></tr>
  `).join('');
}

const serviceForm = document.getElementById('serviceForm');
if (serviceForm) {
  serviceForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(serviceForm).entries());
    await fetch(`${API_BASE}/admin/services`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    serviceForm.reset();
    loadAdminServices();
  });
  loadAdminServices();
}

// gallery admin - with better error handling
async function loadAdminGallery() {
  const container = document.getElementById('adminGallery');
  if (!container) {
    console.log('adminGallery container not found');
    return;
  }
  
  try {
    const res = await fetch(`${API_BASE}/admin/gallery`, {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    
    console.log('Gallery fetch status:', res.status);
    
    if (!res.ok) {
      console.error('Gallery API error:', res.status, res.statusText);
      container.innerHTML = `<p>Error: ${res.status} - ${res.statusText}</p>`;
      return;
    }
    
    const items = await res.json();
    console.log('Admin gallery items:', items);
    
    if (!items || items.length === 0) {
      container.innerHTML = '<p>No images uploaded yet.</p>';
      return;
    }
    
    container.innerHTML = items.map(i =>
      `<div style="text-align:center; margin: 1rem;">
        <img src="${i.url}" alt="${i.title}" style="max-width:150px; border-radius:8px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">
        <p style="margin-top: 0.5rem; font-size: 0.9rem;">${i.title}</p>
      </div>`
    ).join('');
  } catch (err) {
    console.error('Load gallery error:', err);
    container.innerHTML = `<p>Error loading gallery: ${err.message}</p>`;
  }
}

const galleryForm = document.getElementById('galleryForm');
if (galleryForm) {
  galleryForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.querySelector('input[name="title"]').value;
    const fileInput = document.querySelector('input[name="image"]');
    
    if (!title.trim() || !fileInput.files[0]) {
      alert('Please fill in title and select an image');
      return;
    }
    
    const fd = new FormData();
    fd.append('title', title);
    fd.append('image', fileInput.files[0]);
    
    console.log('Uploading image:', title);
    
    try {
      const res = await fetch(`${API_BASE}/admin/gallery`, {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + token },
        body: fd
      });
      
      console.log('Upload status:', res.status);
      
      if (res.ok) {
        const result = await res.json();
        console.log('Upload success:', result);
        galleryForm.reset();
        await loadAdminGallery();  // Reload after upload
        alert('Image uploaded successfully!');
      } else {
        const err = await res.text();
        console.error('Upload error:', res.status, err);
        alert(`Upload failed: ${res.status} - ${err}`);
      }
    } catch (err) {
      console.error('Upload exception:', err);
      alert('Upload error: ' + err.message);
    }
  });
  
  loadAdminGallery();  // Load on page init
}


/* gallery admin
async function loadAdminGallery() {
  const container = document.getElementById('adminGallery');
  if (!container) return;
  const items = await fetch(`${API_BASE}/admin/gallery`, {
    headers: { 'Authorization': 'Bearer ' + token }
  }).then(r => r.json());
  container.innerHTML = items.map(i =>
    `<div><img src="${i.url}" alt="${i.title}"><p>${i.title}</p></div>`
  ).join('');
}

const galleryForm = document.getElementById('galleryForm');
if (galleryForm) {
  galleryForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(galleryForm);
    await fetch(`${API_BASE}/admin/gallery`, {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + token },
      body: fd
    });
    galleryForm.reset();
    loadAdminGallery();
  });
  loadAdminGallery();
}
*/
// equipment
async function loadEquipment() {
  const tbody = document.getElementById('equipmentTableBody');
  if (!tbody) return;
  const items = await fetch(`${API_BASE}/admin/equipment`, {
    headers: { 'Authorization': 'Bearer ' + token }
  }).then(r => r.json());
  tbody.innerHTML = items.map(i =>
    `<tr><td>${i.id}</td><td>${i.name}</td><td>${i.type}</td></tr>`
  ).join('');
}

const equipmentForm = document.getElementById('equipmentForm');
if (equipmentForm) {
  equipmentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(equipmentForm).entries());
    await fetch(`${API_BASE}/admin/equipment`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    equipmentForm.reset();
    loadEquipment();
  });
  loadEquipment();
}

// bookings
async function loadBookings() {
  const tbody = document.getElementById('bookingsTableBody');
  if (!tbody) return;
  const bookings = await fetch(`${API_BASE}/admin/bookings`, {
    headers: { 'Authorization': 'Bearer ' + token }
  }).then(r => r.json());
  tbody.innerHTML = bookings.map(b =>
    `<tr><td>${b.id}</td><td>${b.service}</td><td>${b.date}</td><td>${b.email}</td><td>${b.status}</td></tr>`
  ).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  loadStats();
  loadBookings();
});
