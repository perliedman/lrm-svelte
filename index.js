var map = L.map('map');

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var waypoints = [
	[57.74, 11.94],
	[57.6792, 11.949]
]
var control = new lrm.Control({
	waypoints: waypoints
	// geocoder: L.Control.Geocoder.nominatim()
}).addTo(map);

map.fitBounds(new L.latLngBounds(waypoints))