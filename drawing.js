
var featureOverlay = new ol.FeatureOverlay({});
featureOverlay.setMap(map);

var drawingMode = false;

var drawing;
var modify;
var select = new ol.interaction.Select();
map.addInteraction(select);


function startDrawing(){
  drawingMode = true;
  map.removeInteraction(select);
  select.getFeatures().clear();
  
  drawing = new ol.interaction.Draw({
    features: featureOverlay.getFeatures(),
    type: $("#drawingTool input[type='radio']:checked").val()
  })
  map.addInteraction(drawing);
  
  modify = new ol.interaction.Modify({
    features: featureOverlay.getFeatures(),
    deleteCondition: function(event) {
      return ol.events.condition.shiftKeyOnly(event) && ol.events.condition.singleClick(event);
    }
  });
  map.addInteraction(modify);
  
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
  drawingMode = false;
  map.removeInteraction(drawing);
  map.removeInteraction(modify);
  map.addInteraction(select);
}

function formatLength(feature) {
  var length = Math.round(feature.getLength() * 100) / 100;
  var output;
  if (length > 100) {
    output = (Math.round(length / 1000 * 100) / 100) + ' km';
  } else {
    output = (Math.round(length * 100) / 100) + ' m';
  }
  return output;
};

function formatArea(feature) {
  var area = feature.getArea();
  var output;
  if (area > 10000) {
    output = (Math.round(area / 1000000 * 100) / 100) + ' km<sup>2</sup>';
  } else {
    output = (Math.round(area * 100) / 100) + ' m<sup>2</sup>';
  }
  return output;
};

$("#drawingTool input[type='radio']").click(function(){
  stopDrawing();
  startDrawing();
});

$("#drawingDelete").click(function(){
  map.removeInteraction(drawing);
  removeSelected();
});

function removeSelected(){
  select.getFeatures().forEach(function(feature){
    featureOverlay.removeFeature(feature);
    select.getFeatures().remove(feature);
  });
}

$(document).on('keyup',function(evt){
  if(evt.keyCode == 27){ // Esc
    stopDrawing();
    select.getFeatures().clear();
  }
  if(evt.keyCode == 46){ // Delete
    stopDrawing();
    removeSelected();
  }
});

select.getFeatures().on('add',function(){
  printSelected();
});

select.getFeatures().on('remove',function(){
  printSelected();
});

function printSelected(){
  $("#features table").empty();
  if(!drawingMode){
    select.getFeatures().forEach(function(feature){
      var type = $("#drawingTool input[type='radio']:checked").val();
      featureElement = document.createElement('tr');
      var titleTdElement = document.createElement('td');
      titleTdElement.className = "titleTd";
      switch(feature.getGeometry().getType()){
        case "LineString": titleTdElement.innerHTML = "Lom. úsečka"; break;
        case "Polygon": titleTdElement.innerHTML = "Polygon"; break;
        case "Point": titleTdElement.innerHTML = "Bod"; break;
        default: titleTdElement.innerHTML = feature.getGeometry().getType(); break;
      }
      var valueTdElement = document.createElement('td');
      valueTdElement.className = "valueTd";
      
      switch(feature.getGeometry().getType()){
        case "LineString": valueTdElement.innerHTML = formatLength(feature.getGeometry()); break;
        case "Polygon": valueTdElement.innerHTML = formatArea(feature.getGeometry()); break;
        default: valueTdElement.innerHTML = ""; break;
      }
      
      featureElement.appendChild(titleTdElement);
      featureElement.appendChild(valueTdElement);
      $("#features table").append(featureElement);
    });
  }
  /*
  console.log(select.getFeatures().length);
  if(select.getFeatures().length != undefined && select.getFeatures().length > 0){
    $("#featuresAccordion").show();
  }else{
    $("#featuresAccordion").hide();
  }
  */
  $(".menuaccordion, .menuaccordionOpened").accordion("refresh");
}

