var pmap
var polygon

export function initialD() {
    pmap = L.map('imap').setView([-12.08, -77.0], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    }).addTo(pmap);

    console.log("Hi Godzilla");

    polygon = L.polygon([
        [-12.08, -77.01],
        [-12.08, -77.02],
        [-12.05, -77.03]
    ]).addTo(pmap).bindPopup('<button id="routeToPolygon" class="btn btn-success">Ir al Polígono</button>');

    var control;

    // Añadir evento al botón en el popup del polígono
    polygon.on('popupopen', function () {
        document.getElementById('routeToPolygon').addEventListener('click', function () {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    var userLatLng = L.latLng(position.coords.latitude, position.coords.longitude);

                    if (control) {
                        pmap.removeControl(control);
                    }
                    control = L.Routing.control({
                        waypoints: [
                            userLatLng,
                            polygon.getBounds().getCenter()
                        ],
                        routeWhileDragging: true
                    }).addTo(pmap);
                });
            } else {
                alert("Geolocalización no es soportada por este navegador.");
            }
        });
    });
}

window.geoJsonLayer = null;

export function loadGeoJsonData(geoJsonName) {
    console.log(geoJsonName);
    if (window.geoJsonLayer) {
        pmap.removeLayer(window.geoJsonLayer);
    }

    fetch(`geojson/${geoJsonName}.json`)
        .then(response => response.json())
        .then(data => {
            window.geoJsonLayer = L.geoJson(data, {
                onEachFeature: function (feature, layer) {
                    const nombre = feature.properties.NOMB_CCPP;
                    const properties = feature.properties;

                    // Crear el contenido del popup con el botón
                    const popupContent = `
                    <div>
                        <strong>${nombre}</strong><br>
                        <button onclick="showProperties(${properties.OBJECTID})" class="btn btn-warning">
                            Mostrar Propiedades
                        </button>
                    </div>
                `;

                    // Bind popup al layer
                    layer.bindPopup(popupContent);
                }
            }).addTo(pmap);
            pmap.fitBounds(window.geoJsonLayer.getBounds());
        });

    function showProperties(alpha) {
        console.log(alpha);
    };
};
