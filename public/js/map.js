mapboxgl.accessToken = mapToken;

const coords = listing.geometry.coordinates; // get coordinates

const map = new mapboxgl.Map({
  container: "map",
  center: [coords[0], coords[1]], // IMPORTANT ORDER: [longitude, latitude]
  zoom: 9
});

const marker = new mapboxgl.Marker({ color: "#fe424d" })
  .setLngLat([coords[0], coords[1]]) 
  .setPopup(
    new mapboxgl.Popup({ 
      offset: 25,
      closeButton: false,
      className: "custom-popup"
    })
    .setHTML(`
      <div class="popup-card">
        <div class="popup-header">
          <img src="${listing.image.url}" class="popup-img-circle" />
          <h6>📍 ${listing.title}</h6>
        </div>
        <p class="popup-price">₹ ${listing.price.toLocaleString("en-IN")} / night</p>
      </div>
    `)
  )
  .addTo(map);
