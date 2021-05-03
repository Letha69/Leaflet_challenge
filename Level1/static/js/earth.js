// Load in geojson data
var geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// build map

function earthquake(){
    // Creating map object
    var myMap = L.map("mapid", {
        center: [34.0522, -118.2437],
        zoom: 8
    });
  // Adding tile layer
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);

  // Grab data with d3

  d3.json(geoData, function(data) {
    L.geoJSON(data, {
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, markerStyle(feature));
      },
    // Call pop-up for each feature
    onEachFeature: function(feature, layer) {
      layer.bindPopup("<h1> Magnitude: " + feature.properties.mag+ "</h1> <hr> <h2>" + feature.properties.place + "</h2>");
      }
    }).addTo(myMap);

    mapLegend(myMap);
});

};
  // Set up the legend
function mapLegend(map){
    var legend = L.control({ position: "bottomright" });
 
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        categories = [0,1,2,3,4,5];
    
        div.innerHTML += "<h3>Magnitude</h3>"

    for (var i = 0; i < categories.length; i++) {
        div.innerHTML +=
            '<i style="background: ' + chooseColor(categories[i] + 1) + '"></i> ' +
            categories[i] + (categories[i + 1] ? '&ndash;' + categories[i + 1] + '<br>' : '+');
        
    }
    return div;
  };
  legend.addTo(map);
};

//function for styling markers
function markerStyle (feature) {
    return {
        fillColor: markerColor(feature.properties.mag),
        radius: 4*feature.properties.mag,
        weight: 2,
        opacity: 1,
        color: markerColor(feature.properties.mag),
        fillOpacity: 0.8   
    };
  };
  

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
  };

  earthquake();


  