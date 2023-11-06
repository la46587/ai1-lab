const usrLoc = document.getElementById('loc');

let center = [53.44704272080419, 14.492251060784335],
    width = 600,
    height = 400;

const osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    osm = L.tileLayer(osmUrl, {
        maxZoom: 18,
        attribution: osmAttrib
    });

map = new L.Map('map', {
    layers: [osm],
    center: new L.LatLng(center[0], center[1]),
    zoom: 7
});

var options = {
    radius: 12,
    opacity: 0.5,
    duration: 500,
    lng: function(d) {
        return d[0];
    },
    lat: function(d) {
        return d[1];
    },
    value: function(d) {
        return d.length;
    },
    valueFloor: 0,
    valueCeil: undefined
};

var hexLayer = L.hexbinLayer(options).addTo(map)
hexLayer.colorScale().range(['white', 'blue']);

var latFn = d3.random.normal(center[0], 1);
var longFn = d3.random.normal(center[1], 1);

function generateData() {
    const data = [];
    for (i = 0; i < 1000; i++) {
        data.push([longFn(), latFn()]);
    }
    hexLayer.data(data);
}

generateData();

function getOverlay() {
    // Select the first svg element
    var svg = d3.select('.leaflet-overlay-pane>svg'),
        img = new Image(),
        serializer = new XMLSerializer();

    svg.select("g").attr("transform", null);
    svg.style("margin-top", null);
    svg.style("margin-left", null);
    svg.attr("height", null);
    svg.attr("width", null);
    var svgStr = serializer.serializeToString(svg.node());

    img.src = 'data:image/svg+xml;base64,'+window.btoa(svgStr);

    return img;
}

function generateImage() {
    leafletImage(map, function(err, canvas) {

        var t = d3.select('.leaflet-map-pane').style('transform').split(", "),
            img = getOverlay(),
            x = parseInt(t[4]),
            y = parseInt(t[5]);

        canvas.getContext("2d").drawImage(img,
            x,
            y,
            width,
            height
        );

        // now you have canvas
        // example thing to do with that canvas:
        var img = document.createElement('img');
        var dimensions = map.getSize();
        img.width = dimensions.x;
        img.height = dimensions.y;
        img.src = canvas.toDataURL();
        document.getElementById('images').innerHTML = '';
        document.getElementById('images').appendChild(img);
    });
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        usrLoc.innerHTML = "Geolocation is not supported by this browser.";
    }
}


function showPosition(position) {
    usrLoc.innerHTML = "Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude;
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            usrLoc.innerHTML = "Użytkownik odmówił udostępnienia lokalizacji.";
            break;
        case error.POSITION_UNAVAILABLE:
            usrLoc.innerHTML = "Informacja o lokalizacji jest niedostępna.";
            break;
        case error.TIMEOUT:
            usrLoc.innerHTML = "Przekroczono limit czasu na pobranie lokalizacji.";
            break;
    }
}