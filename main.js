
$(function(){
  $(".menuaccordionOpened").accordion({
    collapsible: true,
    animate: 150
  });
  $(".menuaccordion").accordion({
    collapsible: true,
    animate: 150,
    active: false
  });
  printSelected();
});

var map = new ol.Map({
  controls: ol.control.defaults({}),
  interactions : ol.interaction.defaults({doubleClickZoom: false}),
  target: 'map',
  view: view
});

$(map.getViewport()).on("dblclick", function(e){
  var blank = true;
  var coords = map.getEventPixel(e);
  var jtsk = map.getEventCoordinate(e);
  $("#properties table").empty();
  tablePrintHead("#properties table","Kliknuto");
  tablePrintBody("#properties table","",jtsk);
  map.forEachFeatureAtPixel(coords, function(feature, layer){
    blank = true;
    console.log(feature);
    
    switch(feature.getGeometry().getType()){
      case "LineString": tablePrintHead("#properties table","Lomená úsečka"); break;
      case "Polygon": tablePrintHead("#properties table","Polygon"); break;
      case "Point": tablePrintHead("#properties table","Bod"); break;
      default: titleTdElement.innerHTML = feature.getGeometry().getType(); break;
    }
    
    var coords = feature.getGeometry().getCoordinates()[0];
    for(i=0; i < coords.length; i++){
      if(feature.getGeometry().getType() != "Polygon" || i != coords.length-1){
        tablePrintBody("#properties table","",coords[i]);
      }
    }
  });
  $("#properties").dialog("open");
});

function tablePrintHead(table,name){
  var tr = document.createElement('tr');
  var th1 = document.createElement('th');
  var th2 = document.createElement('th');
  var th3 = document.createElement('th');
  $(th1).text(name);
  $(th2).text("S-JTSK");
  $(th3).text("WGS 84");
  $(tr).append(th1);
  $(tr).append(th2);
  $(tr).append(th3);
  $(table).append(tr);
}

function tablePrintBody(table,name,jtsk){
  var tr = document.createElement('tr');
  var td1 = document.createElement('td');
  var td2 = document.createElement('td');
  var td3 = document.createElement('td');
  $(td1).text(name);
  $(td2).text(jtsk[0]+" "+jtsk[1]);
  var wgs84 = ol.proj.transform(jtsk, 'EPSG:5514', 'EPSG:4326');
  $(td3).text(wgs84[0]+" "+wgs84[1]);
  $(tr).append(td1);
  $(tr).append(td2);
  $(tr).append(td3);
  $(table).append(tr);
}

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
  $.each(event.features, function(index,feature){
    featureOverlay.getFeatures().push(feature);
  });
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
    $("#export-url").val(location.protocol+'//'+location.host+location.pathname+'#'+data);
  });
});


$(function(){ // loading of KML from URL
  if(!window.location.hash) return;
  var vector = new ol.layer.Vector({
    source: new ol.source.KML({
      projection: 'EPSG:5514',
      url: window.location.hash.substring(1)
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
