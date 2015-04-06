/* Definice vrstev */

// JTSK = EPSG:5514
// Hustopece JTSK:  -591909.64 -1189823.30
// Hustopece WGS:   16.735514831543 48.941200861905635

/*var jtskProjection = new ol.proj.Projection({
  code: "EPSG:5514",
  units: "m",
  extent: [-904590, -1240000, -425000, -920000]
});*/
/*
proj4.defs('WGS84', "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees");

proj4.defs( "EPSG:5514", "+title=Krovak +proj=krovak +lat_0=49.5 +lon_0=24.83333333333333 +alpha=30.28813972222222 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +units=m +towgs84=570.8,85.7,462.8,4.998,1.587,5.261,3.56 +no_defs" );


var point = [ -747963.64999999851, -1041493.3299999982 ];
$("#source").text(point);
proj4.defs( "EPSG:5514", "+title=Krovak +proj=krovak +lat_0=49.5 +lon_0=24.83333333333333 +alpha=30.28813972222222 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +units=m +towgs84=570.8,85.7,462.8,4.998,1.587,5.261,3.56 +no_defs" );
var coord_wgs = proj4( "EPSG:5514" ).inverse( point );
console.log(coord_wgs);
var coord_jtsk = proj4( "EPSG:5514" ).forward( coord_wgs );
console.log(coord_jtsk);
*/

var projection = ol.proj.get("EPSG:3857");
var projectionExtent = projection.getExtent();
var size = ol.extent.getWidth(projectionExtent) / 256;
var resolutions = new Array(14);
var matrixIds = new Array(14);
for (var z = 0; z < 14; ++z){
  resolutions[z] = size / Math.pow(2, z);
  matrixIds[z] = z;
}
var wmtsTileGrid = new ol.tilegrid.WMTS({
  origin: ol.extent.getTopLeft(projectionExtent),
  resolutions: resolutions,
  matrixIds: matrixIds
});

var view = new ol.View({
  center: [0,0],
  //center: [-591909.64, -1189823.30],
  //center: ol.proj.transform([16.735514831543, 48.941200861905635], 'EPSG:4326', jtskProjection),
  zoom: 6
});

var layers = [
  
  {
    group: "ČÚZK (skupina)",
    items: [
      
      {
        name: "ČÚZK: Fotomapa",
        layer: new ol.layer.Tile({
          visible: false,
          source: new ol.source.WMTS({
            url: 'http://geoportal-orto.cuzk.cz/WMTS_ORTOFOTO/service.svc/get?', // load-balanced
            layer: 'orto',
            style: 'default',
            matrixSet: 'jtsk:epsg:5514',
            format: 'image/jpg',
            tileGrid: wmtsTileGrid
          })
        })
      },
      
      {
        name: "ČÚZK: Základní mapa",
        layer: new ol.layer.Tile({
          visible: false,
          source: new ol.source.WMTS({
            url: 'http://geoportal-zm.cuzk.cz/WMTS_ZM/WMTService.aspx?',
            layer: 'zm',
            style: 'default',
            matrixSet: 'jtsk:epsg:5514',
            format: 'image/png',
            tileGrid: wmtsTileGrid
          })
        })
      },
      
      /*
      {
        name: "ČÚZK: Základní mapa",
        layer: new ol.layer.Tile({
          visible: false,
          source: new ol.source.WMTS({
            url: 'http://geoportal-zm.cuzk.cz/WMTS_ZM/service.svc/get?', // load-balanced
            layer: 'zm',
            style: 'default',
            matrixSet: 'jtsk:epsg:5514',
            format: 'image/png',
            tileGrid: wmtsTileGrid
          })
        })
      },
      */
      /*
      {
        name: "Test",
        layer: new ol.layer.Tile({
          visible: false,
          source: new ol.layer.Tile({
            source: new ol.source.TileWMS({
              url: 'http://app.hustopece-city.cz/mapcache/wmts',
              params: {'LAYERS': 'Hustopecsko', 'TILED': true},
              //extent: [-13884991, 2870341, -7455066, 6338219]
              extent: [-904590, -1240000, -425000, -920000]
            })
          })
        })
      }
      */
    ]
  },
  {
    group: "Testovací",
    items: [
      
      {
        name: "Open street map",
        layer: new ol.layer.Tile({
          visible: false,
          source: new ol.source.OSM()
        })
      },
      
      {
        name: "Test",
        layer: new ol.layer.Tile({
          visible: false,
          source: new ol.source.WMTS({
            url: 'http://app.hustopece-city.cz/mapcache/wmts?',
            layer: 'Hustopecsko',
            style: 'default',
            matrixSet: 'jtsk:epsg:5514',
            format: 'image/png',
            tileGrid: wmtsTileGrid
          })
        })
      },
      
    ]
  }
];

