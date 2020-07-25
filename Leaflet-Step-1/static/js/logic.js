// Leaflet Challenge Step 1 code

// Function to determine marker size based on population
function markerSize(mag) {
    return mag;
  }
  // Store API endpoint inside apiURL
  var apiURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";
  // Perform a GET request to the api URL
  d3.json(apiURL, function(data) {
  // Send the data.features object to the createFeatures function
  createFeatures(data.features);
  });
  function createFeatures(earthquakeData) {
  // Define a function to run for each feature in the array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<p> Magnitude: " +  feature.properties.mag + "</p>");
  }
  // Create a GeoJSON layer containing the features array on the earthquakeData object
   var quakeMap = L.geoJSON(earthquakeData, {
        pointToLayer: function(feature, latlng) {
          return new L.CircleMarker(latlng, {
            radius: feature.properties.mag,
          });
        },
  // Run onEachFeature function for each piece of data in the array
    onEachFeature: onEachFeature
  });
  function getColor(d) {
    if (d > 6)
        return '#800026';
    if (d > 5)
        return '#BD0026';
    if (d > 4)
        return '#E31A1C';
    if (d > 3)
        return '#FC4E2A';
    if (d > 2)
        return '#FD8D3C';
    if (d > 1)
        return '#FEB24C';
    if (d  > 0)
      return "#FED976";
  }
  var quakeMap = L.geoJSON(earthquakeData, {
          style: function (feature) {
              return feature.properties && feature.properties.style;
          },
          onEachFeature: onEachFeature,
          pointToLayer: function (feature, latlng) {
      console.log(getColor(feature.properties.mag));
        return new L.circleMarker(latlng, {
                radius: feature.properties.mag *6,
                  fillColor: getColor(feature.properties.mag),
          color: getColor(feature.properties.mag),
          weight: 1,
                  opacity: 1,
                  fillOpacity: 0.8
              });
          }
      })
  // Send earthquake layer to the createMap function
  createMap(quakeMap);
  }
  function createMap(quakeMap) {
  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });
  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });
  // Define a baseMaps object to hold base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };
  // Create overlay object to hold overlay layer
  var overlayMaps = {
    quakeMap: quakeMap
  };
  // Create map with the streetmap and quakeMap layers set to display on load
  var fullMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, quakeMap]
  });

  // Create a layer control, pass in our baseMaps and overlayMaps and add layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(fullMap);
  function getColor(d) {
    if (d > 6)
        return '#800026';
    if (d > 5)
        return '#BD0026';
    if (d > 4)
        return '#E31A1C';
    if (d > 3)
        return '#FC4E2A';
    if (d > 2)
        return '#FD8D3C';
    if (d > 1)
        return '#FEB24C';
    if (d  > 0)
      return "#FED976";
  }
  var legend = L.control({position: 'bottomright'});
  legend.onAdd = function (fullMap) {
    var div = L.DomUtil.create('div', 'info legend'),
        quakes = [0, 1, 2, 3, 4, 5, 6],
        labels = [];
    // loop through the density intervals and create a label with a colored square for each interval
    for (var i = 0; i < quakes.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(quakes[i] + 1) + '"></i> ' +
            quakes[i] + (quakes[i + 1] ? '&ndash;' + quakes[i + 1] + '<br>' : '+');
    }
    return div;
  };
  legend.addTo(fullMap);
  };