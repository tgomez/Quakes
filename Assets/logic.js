// Set Map Object, Set Desired Center and Zoom
var myMap = L.map("map", {
  center: [38,-90],
  zoom: 3,
});

  // Title Layer
  L.tileLayer("https://api.mapbox.com/v4/mapbox.outdoors/{z}/{x}/{y}.png?" +
  "access_token=pk.eyJ1IjoidGdvbWV6OTQiLCJhIjoiY2poeG9vY3VqMGR1cTNscGJoaGNydGVibyJ9.bbnx7P5oVrQ8f2h06rRcsQ").addTo(myMap);
 
// QueryURL & get geojson from usgs

var queryUrl = new XMLHttpRequest(); 
queryUrl.open("GET",'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson',false);
queryUrl.send(null);
queryUrl.responseText

var json_obj = JSON.parse(queryUrl.responseText);

// FXN Markersize
function markerSize(num) {
  return num;
}
// set the color array for magnitudes
 var colors = ['white','Blue','Green','Yellow','Orange','Red']

// Create loop for geojson to create markers then bind popup w mag, depth, time, and color based on magnitude, 

for (var i = 0; i < json_obj.features.length; i++) {
  var feature = json_obj.features[i];
  var loc = feature.geometry.coordinates;
  var magnitude = feature.properties.mag;
  var depth = feature.geometry.coordinates[2];
  if (magnitude < 1){
    col = colors[0]
  } else if (magnitude >= 1 && magnitude < 2){
    col = colors[1]
  } else if (magnitude >= 2 && magnitude < 3){
    col = colors[2]
  } else if (magnitude >= 3 && magnitude < 4){
    col = colors[3]
  } else if (magnitude >= 4 && magnitude < 5){
    col = colors[4]
  } else {
    col = colors[5]
  }
  L.circleMarker([loc[1], loc[0]], {
    fillOpacity: .6,
    color: "silver",
    fillColor: col,
    weight: 1,
    radius: markerSize(magnitude)
  }).bindPopup("<h3>Magnitude : " + magnitude + "</h3>"+"<strong>Depth: </strong>" + depth + ' kilometers'+
      '<br>'+new Date(feature.properties.time) )
    .addTo(myMap);
}

// Set Legend (LLQ)
var legend = L.control({position: 'bottomleft'});

legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend'),
      
        grades = [0,1,2,3,4,5];
        div.innerHTML = '<h3>Earthquake Magnitude</h3>'
    // Create loop for diff categories and create label a colored square for each:) 
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
          '<i class="legend" style="background:' + colors[i] + '; color:' + colors[i] + ';">....</i> ' +
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '++');
  }
  return div;
};

legend.addTo(myMap);
