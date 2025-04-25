let map;

function initMap() {
  const local = { lat: 41.450491, lng: -8.294101 };
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 15,
    center: local,
  });

  new google.maps.Marker({
    position: local,
    map: map,
    title: "Localização inicial"
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggle-search");
  const searchBox = document.getElementById("search-box");
  const searchInput = document.getElementById("search-input");

  toggleBtn.addEventListener("click", () => {
    searchBox.style.display = searchBox.style.display === "none" ? "block" : "none";
    searchInput.focus();
  });

  searchInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      const geocoder = new google.maps.Geocoder();
      const address = searchInput.value;
      geocoder.geocode({ address: address }, function (results, status) {
        if (status === "OK") {
          map.setCenter(results[0].geometry.location);
          new google.maps.Marker({
            map: map,
            position: results[0].geometry.location
          });
        } else {
          alert("Localização não encontrada: " + status);
        }
      });
    }
  });
});
