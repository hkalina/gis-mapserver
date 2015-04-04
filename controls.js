
var map = new ol.Map({
  controls: ol.control.defaults({
    attributionOptions: {
      collapsible: false
    }
  }),
  target: 'map',
  view: new ol.View({
    center: [0,0],
    //center: [-591909.64, -1189823.30],
    //center: ol.proj.transform([16.735514831543, 48.941200861905635], 'EPSG:4326', jtskProjection),
    zoom: 6
  })
});

/*
$(map.getViewport()).on("click", function(e) {
    alert("click1");
    console.log(e);
    map.forEachFeatureAtPixel(map.getEventPixel(e), function (feature, layer) {
        alert("click2");
    });
});
*/

var ulElement = document.createElement("ul");
for(i = 0; i < layers.length; i++){
  
  var liElement = document.createElement("li");
  var labelElement = document.createElement("label");
  var inputElement = document.createElement("input");
  $(inputElement).attr("type","checkbox");
  $(labelElement).append(inputElement);
  $(labelElement).append(layers[i].group);
  $(labelElement).change(function(){ alert("a?"); });
  $(liElement).append(labelElement);
  var ul2Element = document.createElement("ul");
  
  for(j = 0; j < layers[i].items.length; j++){
    
    var li2Element = document.createElement("li");
    var label2Element = document.createElement("label");
    var input2Element = document.createElement("input");
    $(input2Element).attr("type","checkbox");
    $(input2Element).attr("layerid",j);
    $(input2Element).attr("groupid",i);
    $(label2Element).append(input2Element);
    $(label2Element).append(layers[i].items[j].name);
    $(input2Element).change(toggleLayer);
    $(li2Element).append(label2Element);
    $(ul2Element).append(li2Element);
    
    map.addLayer(layers[i].items[j].layer);
    
  }
  
  $(liElement).append(ul2Element);
  $(ulElement).append(liElement);
  $("#layers").append(ulElement);
}

function toggleLayer(){
  var groupid = parseInt($(this).attr("groupid"));
  var layerid = parseInt($(this).attr("layerid"));
  layers[groupid].items[layerid].layer.setVisible($(this).prop('checked'));
}


//console.log( ol.proj.transform([16.735514831543, 48.941200861905635], 'EPSG:4326', 'EPSG:4326') );


