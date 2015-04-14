// predlohy:
// http://openlayers.org/en/v3.1.0/examples/measure.html
// http://openlayers.org/en/v3.1.0/examples/draw-and-modify-features.html

var sketch; // feature (contain geometry)
var draw; // interaction

var featureOverlay = new ol.FeatureOverlay({
  style: new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(255, 255, 255, 0.2)'
    }),
    stroke: new ol.style.Stroke({
      color: '#FC3',
      width: 2
    }),
    image: new ol.style.Circle({
      radius: 5,
      fill: new ol.style.Fill({
        color: '#FC3'
      })
    })
  })
});
featureOverlay.setMap(map);

/*
var modify = new ol.interaction.Modify({
  features: featureOverlay.getFeatures(),
  deleteCondition: function(event) {
    return ol.events.condition.shiftKeyOnly(event) && ol.events.condition.singleClick(event);
  }
});
map.addInteraction(modify);
*/

$(map.getViewport()).on('mousemove', function(evt){
  if(sketch){
    var output;
    var geom = sketch.getGeometry();
    if(geom instanceof ol.geom.Polygon){
      output = formatArea(geom);
    }else if (geom instanceof ol.geom.LineString){
      output = formatLength(geom);
    }
    $(sketchElement).children(".valueTd").html(output);
  }
});

function startDrawing(){
  var type = $("#drawingTool input[type='radio']:checked").val();
  draw = new ol.interaction.Draw({
    //source: vectorSource,
    features: featureOverlay.getFeatures(),
    type: type
  });
  map.addInteraction(draw);
  
  draw.on('drawstart', function(evt){
    sketch = evt.feature;
    sketchElement = document.createElement('tr');
    var titleTdElement = document.createElement('td');
    titleTdElement.className = "titleTd";
    titleTdElement.innerHTML = type == "LineString" ? "Trasa" : "Polygon";
    var valueTdElement = document.createElement('td');
    valueTdElement.className = "valueTd";
    sketchElement.appendChild(titleTdElement);
    sketchElement.appendChild(valueTdElement);
    $("#drawing table").append(sketchElement);
  }, this);
  
  draw.on('drawend', function(evt){
    sketch = null;
    sketchElement = null;
  }, this);
}

function stopDrawing(){
  map.removeInteraction(draw);
}

function deleteAllDrawing(){
  map.removeInteraction(draw);
  alert("not implemented");
}

var formatLength = function(line) {
  var length = Math.round(line.getLength() * 100) / 100;
  
  //var length = line.getGeodesicLength(new ol.proj.Projection("EPSG:5514"));
  
  var output;
  if (length > 100) {
    output = (Math.round(length / 1000 * 100) / 100) + ' km';
  } else {
    output = (Math.round(length * 100) / 100) + ' m';
  }
  return output;
};

var formatArea = function(polygon) {
  var area = polygon.getArea();
  var output;
  if (area > 10000) {
    output = (Math.round(area / 1000000 * 100) / 100) + ' km<sup>2</sup>';
  } else {
    output = (Math.round(area * 100) / 100) + ' m<sup>2</sup>';
  }
  return output;
};

$("#drawingTool input[type='radio']").change(function(){
  stopDrawing();
  startDrawing();
});

