
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

