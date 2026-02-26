function createMapWithOsm(elementId) {
  var map = L.map(elementId).setView([51.505, -0.09], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  return map;
}

var mymap = createMapWithOsm("leaflet-map");

var markermap = createMapWithOsm("leaflet-map-marker");
L.marker([51.5, -0.09]).addTo(markermap);
L.circle([51.508, -0.11], {
  color: "#34c38f",
  fillColor: "#34c38f",
  fillOpacity: 0.5,
  radius: 500,
}).addTo(markermap);
L.polygon(
  [
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047],
  ],
  { color: "#556ee6", fillColor: "#556ee6" }
).addTo(markermap);

var popupmap = createMapWithOsm("leaflet-map-popup");
L.marker([51.5, -0.09])
  .addTo(popupmap)
  .bindPopup("<b>Hello world!</b><br />I am a popup.")
  .openPopup();
L.circle([51.508, -0.11], {
  color: "#f46a6a",
  fillColor: "#f46a6a",
  fillOpacity: 0.5,
  radius: 500,
})
  .addTo(popupmap)
  .bindPopup("I am a circle.");
L.polygon(
  [
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047],
  ],
  { color: "#556ee6", fillColor: "#556ee6" }
)
  .addTo(popupmap)
  .bindPopup("I am a polygon.");

var custommap = createMapWithOsm("leaflet-map-custom-icon");
var greenIcon = L.icon({
  iconUrl: "assets/images/logo.svg",
  iconSize: [38, 95],
  iconAnchor: [22, 94],
  popupAnchor: [-3, -76],
  shadowSize: [68, 95],
});
L.marker([51.5, -0.09], { icon: greenIcon }).addTo(custommap);

var drgMarker = createMapWithOsm("leaflet-map-drag-marker");
L.marker([51.5, -0.09], { draggable: true }).addTo(drgMarker);
