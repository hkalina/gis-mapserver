
$(function(){
  $(".menuaccordion").accordion({
    collapsible: true,
    animate: 200
  });
});

var map = new ol.Map({
  controls: ol.control.defaults({}),
  target: 'map',
  view: view
});

$(map.getViewport()).on("click", function(e){
    map.forEachFeatureAtPixel(map.getEventPixel(e), function (feature, layer) {
        console.log(feature);
        console.log(layer);
    });
});

function printLayers(){
 $("#layers").empty();
 var ulElement = document.createElement("ul");
 for(i = 0; i < layers.length; i++){
  
  var liElement = document.createElement("li");
  var labelElement = document.createElement("label");
  var inputElement = document.createElement("input");
  $(inputElement).attr("type","checkbox");
  $(labelElement).append(inputElement);
  $(labelElement).append(layers[i].group);
  $(inputElement).attr("groupid",i);
  $(inputElement).change(function(){
    var state = $(this).prop("checked");
    $(this).parent().parent().find('ul').find('input').each(function(){
      $(this).prop("checked",state);
      $(this).trigger("change");
    });
  });
  $(liElement).append(labelElement);
  var ul2Element = document.createElement("ul");
  
  for(j = 0; j < layers[i].items.length; j++){
    var li2Element = document.createElement("li");
    var label2Element = document.createElement("label");
    var input2Element = document.createElement("input");
    $(input2Element).attr("type","checkbox");
    $(input2Element).attr("layerid",j);
    $(input2Element).attr("groupid",i);
    if(layers[i].items[j].layer.getVisible()){
      $(input2Element).attr("checked","checked");
    }
    $(label2Element).append(input2Element);
    $(label2Element).append(layers[i].items[j].name);
    $(input2Element).change(function(){
      var groupid = parseInt($(this).attr("groupid"));
      var layerid = parseInt($(this).attr("layerid"));
      layers[groupid].items[layerid].layer.setVisible($(this).prop('checked'));
    });
    $(li2Element).append(label2Element);
    $(ul2Element).append(li2Element);
    map.addLayer(layers[i].items[j].layer);
  }
  
  $(liElement).append(ul2Element);
  $(ulElement).append(liElement);
  $("#layers").append(ulElement);
 }
}
printLayers();

// dragging files into map window
var dragAndDropInteraction = new ol.interaction.DragAndDrop({
  formatConstructors: [
    ol.format.GPX,
    ol.format.GeoJSON,
    ol.format.IGC,
    ol.format.KML,
    ol.format.TopoJSON
  ]
});
dragAndDropInteraction.on('addfeatures', function(event){
  map.getLayers().push(new ol.layer.Image({
    source: new ol.source.ImageVector({
      source: new ol.source.Vector({
        features: event.features,
        projection: event.projection
      })
    })
  }));
});
map.addInteraction(dragAndDropInteraction);

// export into KML
$("#export-kml").click(function(){
  var kmlFormat = new ol.format.KML({});
  var exported = kmlFormat.writeFeatures(featureOverlay.getFeatures().getArray(),{
    dataProjection: 'EPSG:4326',
    featureProjection: 'EPSG:5514'
  });
  window.location.href = 'data:application/vnd.google-earth.kml+xml;base64,' + btoa(exported);
});

var selectInteraction = new ol.interaction.Select();
map.addInteraction(selectInteraction);

/*
function saveHash(){ // save encoded GeoJSON into URL
  var geoJSON = new ol.format.GeoJSON;
  var exported = {
    features: geoJSON.writeFeatures(featureOverlay.getFeatures().getArray())
  };
  window.location.hash = '#' + encodeURIComponent(JSON.stringify(exported));
  $("#export-url").val(window.location.href);
}

$(function(){ // load URL encoded GeoJSON
  if(window.location.hash.length <= 1) return;
  var geoJSON = new ol.format.GeoJSON;
  var exported = JSON.parse(decodeURIComponent(window.location.hash.substring(1)));
  
  featureOverlay.getFeatures().clear();
  $.each(geoJSON.readFeatures(exported.features), function(index, feature){
    console.log(feature);
    featureOverlay.getFeatures().push(feature);
  });
});
*/

// export into KML, save to server and get URL
$("#export-link").click(function(){
  var kmlFormat = new ol.format.KML({});
  var exported = kmlFormat.writeFeatures(featureOverlay.getFeatures().getArray(),{
    dataProjection: 'EPSG:4326',
    featureProjection: 'EPSG:5514'
  });
  
  $.post("save.php", { exported: exported }, function(data){
    window.location.hash = '#' + data;
    $("#export-url").val(window.location.href);
  });
});

$("#export-link").click(function(){
  var kmlFormat = new ol.format.KML({});
  var exported = kmlFormat.writeFeatures(featureOverlay.getFeatures().getArray(),{
    dataProjection: 'EPSG:4326',
    featureProjection: 'EPSG:5514'
  });
  
  $.post("save.php", { exported: exported }, function(data){
    window.location.hash = '#' + data;
    $("#export-url").val(window.location.href);
  });
});


$(function(){ // loading of KML from URL
  var vector = new ol.layer.Vector({
    source: new ol.source.KML({
      projection: 'EPSG:5514',
      url: decodeURIComponent(window.location.hash.substring(1))
    })
  });
  var wasLoaded = false;
  vector.getSource().on('change', function(evt){
    if(!wasLoaded){
      wasLoaded = true;
      console.log("loading...");
      vector.getSource().forEachFeature(function(feature){
        console.log(feature);
        featureOverlay.getFeatures().push(feature);
      });
    }
  });
});


/*
map.on('singleclick', function(evt) {
  alert("click");
  
  var wmsSource = new ol.source.ImageWMS({
            url: 'http://app.hustopece-city.cz/mapcache/',
            params: {
              'LAYERS': 'Hustopecsko'
            },
            serverType: 'mapserver',
            projection: projectionCuzk
          });
  
  var url = wmsSource.getGetFeatureInfoUrl(
      evt.coordinate, view.getResolution(), 'EPSG:3857',
      {'INFO_FORMAT': 'text/html'});
  alert(url);
});
*/
