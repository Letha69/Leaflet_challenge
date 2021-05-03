//console.log("earthquake")
var myMap = L.map("mapid", {
  center: [34.0522, -118.2437],
  zoom: 8
  });


  // create LayerGroup
  var earthquakes = new L.LayerGroup();

  //create Tile Layers
  var satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var grayscaleMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  });

  var outdoorsMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox/outdoors-v11",
    accessToken: API_KEY
  });


  // create baseMap to hold Base Layers
  var baseMaps = {
    "Satellite": satelliteMap,
    "Grayscale": grayscaleMap,
    "Outdoors": outdoorsMap 
  };

  // create OverlayMaps to hold overlay Layers
  var overlayMaps = {
    "Earthquakes": earthquakes,
  };
  
  // Creating map object
  //var myMap = L.map("mapid", {
  //center: [45.52,-122.67],
  //zoom: 13,
  //layers: [ satelliteMap,earthquakes]
  //});

  // create a LayerControl and add to the map
  L.control.layers(baseMaps, overlayMaps).addTo(myMap);

var geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
  //console.log("earthquake")
  // Grab data with d3
  d3.json(geoData, function(data) {

  // size of marker based on the magnitude
  function markerSize(magnitude){
    if (magnitude === 0){
      return 1;
    }
    return magnitude *3;
  }

  // style of marker based on the magnitude
  function styleInfo(feature){
    return{
      opacity: 1,
      fillOpacity: 1,
      fillColor: chooseColor(feature.properties.mag),
      color: "#000000",
      radius: markerSize(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  // color of marker based on the magnitude
  function markerColor(magnitude){
    switch(true){
      case magnitude > 5:
          return "#581845";
      case magnitude > 4:
          return "#900C3F";
      case magnitude > 3:
          return "#C70039";
      case magnitude > 2:
          return "#FF5733";
      case magnitude > 1:
          return "#FFC300";
      default:
          return "#DAF7A6";
    }
  }
  // create a GeoJSON Layer containing the features array
  L.geoJSON(data, {
    pointToLayer: function(feature,latlng){
      return L.cicleMarker(latlng);
    },
    style:styleInfo,
    onEachFeature: function(feature, layer) {
      layer.bindPopup("<h4>Location: " + feature.properties.place + 
      "</h4><hr><p>Date & Time: " + new Date(feature.properties.time) + 
      "</p><hr><p>Magnitude: " + feature.properties.mag + "</p>");
    }
  }).addTo(earthquakes);
  earthquakes.addTo(myMap);

  // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    magnitudeLevels = [0,1,2,3,4,5];
    
    div.innerHTML += "<h3>Magnitude</h3>"

    for (var i = 0; i < magnitudeLevels.length; i++) {
        div.innerHTML +=
            '<i style="background: ' + chooseColor(magnitudeLevels[i] + 1) + '"></i> ' +
            magnitudeLevels[i] + (magnitudeLevels[i + 1] ? '&ndash;' + magnitudeLevels[i + 1] + '<br>' : '+');
    }
    return div;
  };

  L.circle(location, {
    fillOpacity: 0.75,
    color: "white",
    fillColor: color,
    // Adjust radius
    radius: mag * 10
  }).bindPopup("<h1>" + feature.properties.place + "</h1> <hr> <h3>Points: " + feature.properties.mag + "</h3>").addTo(myMap);

  // Adding legend to the map
  legend.addTo(myMap);

});

