// predlohy:
// http://openlayers.org/en/v3.1.0/examples/measure.html
// http://openlayers.org/en/v3.1.0/examples/draw-and-modify-features.html

var drawing; // interaction

var featureOverlay = new ol.FeatureOverlay({});
featureOverlay.setMap(map);

var modify = new ol.interaction.Modify({
  features: featureOverlay.getFeatures(),
  deleteCondition: function(event) {
    return ol.events.condition.shiftKeyOnly(event) && ol.events.condition.singleClick(event);
  }
});
map.addInteraction(modify);

function startDrawing(){
  
  drawing = new ol.interaction.Draw({
    features: featureOverlay.getFeatures(), // vrstva kam ukladat nakreslene objekty
    type: $("#drawingTool input[type='radio']:checked").val()
  });
  map.addInteraction(drawing);
  
  drawing.on('drawend', function(evt){
    var opacitedColor = ol.color.asArray($("#backgroundColorPicker").data("plugin_tinycolorpicker").colorHex).slice();
    opacitedColor[3] = $("#visibilitySlider").slider("value")/100.0;
    evt.feature.setStyle(new ol.style.Style({
      fill: new ol.style.Fill({
        color: opacitedColor
      }),
      stroke: new ol.style.Stroke({
        color: $("#colorPicker").data("plugin_tinycolorpicker").colorHex,
        width: 2
      }),
      image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({
          color: $("#colorPicker").data("plugin_tinycolorpicker").colorHex
        })
      })
    }));
  }, this);
}

function stopDrawing(){
  map.removeInteraction(drawing);
}

/*
// jen vypis v prubehu kresleni
$(map.getViewport()).on('mousemove', function(evt){
  if(sketch){
    var output = "?";
    var geom = sketch.getGeometry();
    if(geom instanceof ol.geom.Polygon){
      output = formatArea(geom);
    }else if (geom instanceof ol.geom.LineString){
      output = formatLength(geom);
    }
    $(sketchElement).children(".valueTd").html(output);
  }
});

  draw.on('drawstart', function(evt){
    var type = $("#drawingTool input[type='radio']:checked").val();
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

var formatLength = function(line) {
  var length = Math.round(line.getLength() * 100) / 100;
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
*/

$("#drawingTool input[type='radio']").click(function(){
  stopDrawing();
  startDrawing();
});

$("#drawingDelete").click(function(){
  map.removeInteraction(drawing);
  featureOverlay.getFeatures().clear();
});

