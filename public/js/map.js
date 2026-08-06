document.addEventListener("DOMContentLoaded", function initLeafletMap() {
  const currentListing = typeof listing !== "undefined" && listing ? listing : {};
  const title = currentListing.title || "";
  const loc = currentListing.location || "";
  const country = currentListing.country || "";
  const geometry = currentListing.geometry || null;

  const mapContainer = document.getElementById("map");
  const fallbackContainer = document.getElementById("mapFallback");

  function showFallback() {
    if (mapContainer) mapContainer.classList.add("hidden");
    if (fallbackContainer) fallbackContainer.classList.remove("hidden");
  }

  function createMap(lat, lng, popupText) {
    if (!mapContainer || typeof L === 'undefined') {
      showFallback();
      return;
    }

    try {
      const map = L.map('map', { scrollWheelZoom: false }).setView([lat, lng], 12);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      setTimeout(() => {
        map.invalidateSize();
      }, 150);

      const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `<div style="background-color: #fe424d; width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 4px 12px rgba(254, 66, 77, 0.45); border: 3px solid white;">
                 <i class="fa-solid fa-house-chimney text-base"></i>
               </div>`,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
        popupAnchor: [0, -19]
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 4px;">
          <h4 style="margin: 0 0 4px; font-size: 14px; font-weight: 700; color: #111;">${popupText}</h4>
          <p style="margin: 0; font-size: 12px; color: #666;">${loc}, ${country}</p>
        </div>
      `).openPopup();
    } catch (err) {
      console.error("Map initialization error:", err);
      showFallback();
    }
  }

  if (geometry && Array.isArray(geometry.coordinates) && geometry.coordinates.length === 2) {
    const [lng, lat] = geometry.coordinates;
    createMap(lat, lng, title);
    return;
  }

  if (loc || country) {
    if (typeof showLoader === 'function') showLoader("Locating on map...");
    const query = encodeURIComponent(`${loc}, ${country}`);
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lng = parseFloat(data[0].lon);
          createMap(lat, lng, title);
        } else {
          showFallback();
        }
      })
      .catch(() => showFallback())
      .finally(() => {
        if (typeof hideLoader === 'function') hideLoader();
      });
  } else {
    showFallback();
  }
});
