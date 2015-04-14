/* Definice vrstev */

// geoportal:
// +proj=krovak +lat_0=49.5 +lon_0=24.83333333333333 +alpha=30.28813972222222 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +towgs84=589,76,480,0,0,0,0 +units=m +no_defs
// extent: -1011629.1169187829364091, -1315378.8275233022868633, -375334.0235986501793377, -831288.5369589240290225

// hust:
// extent: -87146434.2217337489128113, -58211149.8546549826860428, 91958982.9656133651733398, -520186.0811873441562057

// JTSK = EPSG:5514
// Hustopece Kostel JTSK:  X=-591 773.170 Y=-1 189 974.371
// Hustopece Kostel WGS:     48.9399231, 16.7375636

// From epsg.io/5514
//proj4.defs("EPSG:5514", "+proj=krovak +lat_0=49.5 +lon_0=24.83333333333333 +alpha=30.28813972222222 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +towgs84=589,76,480,0,0,0,0 +units=m +no_defs");
// From QGIS
//proj4.defs("EPSG:5514", "+proj=krovak +lat_0=49.5 +lon_0=24.83333333333333 +alpha=30.28813972222222 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +towgs84=542.5,89.2,456.9,5.517,2.275,5.516,6.96 +pm=greenwich +units=m +no_defs");
// raon
proj4.defs("EPSG:5514", "+proj=krovak +lat_0=49.5 +lon_0=24.83333333333333 +alpha=30.28813972222222 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +pm=greenwich +units=m +no_defs +towgs84=570.8,85.7,462.8,4.998,1.587,5.261,3.56");

console.log(proj4("EPSG:4326", "EPSG:4326", [16.7375636, 48.9399231])); // WGS84 -> JTSK
console.log(proj4("EPSG:4326", "EPSG:5514", [16.7375636, 48.9399231])); // WGS84 -> JTSK


// z getCapabalities geoportalu (jtsk:epsg:5514)
var projectionCuzk = new ol.proj.Projection({
  code: "EPSG:5514",
  units: "m",
  extent: [-925000.000000000000, -1444353.535999999800, -400646.464000000040, -920000.000000000000]
});

var wmtsTileGridCuzk = new ol.tilegrid.WMTS({
  // z getCapabalities geoportalu
  origin: ol.extent.getTopLeft(projectionCuzk.getExtent()), // pocatek souradneho systemu
  resolutions: [2048.2559999999976, 1024.1279999999988, 512.0639999999994, 256.0319999999997, 128.01599999999985, 64.00799999999992, 32.00399999999996, 16.00199999999998, 8.00099999999999, 4.000499999999995, 2.0002499999999976, 1.0001249999999988, 0.5000624999999994, 0.2500312499999997, 0.12501562499999985],
  matrixIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
});

var wmtsTileGridHust = new ol.tilegrid.WMTS({
  // z getCapabalities generovanych Mapcache
  // http://app.hustopece-city.cz/mapcache/wmts/1.0.0/WMTSCapabilities.xml
  origins: [
    [-904590.000000, -715646.464000], // 0
    [-904590.000000, -715646.464000],
    [-904590.000000, -846734.848000],
    [-904590.000000, -912279.040000],
    [-904590.000000, -912279.040000],
    [-904590.000000, -912279.040000],
    [-904590.000000, -912279.040000],
    [-904590.000000, -916375.552000],
    [-904590.000000, -918423.808000],
    [-904590.000000, -919447.936000],
    [-904590.000000, -919960.000000],
    [-904590.000000, -919960.000000],
    [-904590.000000, -919960.000000],
    [-904590.000000, -919960.000000],
    [-904590.000000, -919992.004000] // 14
  ],
  resolutions: [
    2048.2559999999976, // 0
    1024.1279999999988,
    512.0639999999994,
    256.0319999999997,
    128.01599999999985,
    64.00799999999992,
    32.00399999999996,
    16.00199999999998,
    8.00099999999999,
    4.000499999999995,
    2.0002499999999976,
    1.0001249999999988,
    0.5000624999999994,
    0.2500312499999997,
    0.12501562499999985 // 14
  ],
  matrixIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
  tileSizes: [256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256, 256]
});

var view = new ol.View({
  projection: projectionCuzk,
  //center: [-591909.64, -1189823.30], // JTSK
  center: ol.proj.transform([16.7375636, 48.9399231], 'EPSG:4326', 'EPSG:5514'), // WGS84 -> JTSK
  //zoom: 9
  zoom: 6
});

var iconFeatures=[];

iconFeatures.push(new ol.Feature({
  geometry: new ol.geom.Point(ol.proj.transform([16.7375636, 48.9399267], 'EPSG:4326', 'EPSG:5514')),
  name: 'Kostel'
}));

iconFeatures.push(new ol.Feature({
  geometry: new ol.geom.Point(ol.proj.transform([16.7161864, 48.9391936], 'EPSG:4326', 'EPSG:5514')),
  name: 'Vodojem'
}));

var vectorLayer = new ol.layer.Vector({
  source: new ol.source.Vector({
    features: iconFeatures
  }),
  style: new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 1.0],
      anchorXUnits: 'fraction',
      anchorYUnits: 'fraction',
      opacity: 0.7,
      src: 'http://www.clker.com/cliparts/D/K/l/x/c/2/map-marker-th.png'
    })
  })
});

var layers = [
  {
    group: "ČÚZK",
    items: [
      
      {
        name: "Fotomapa",
        layer: new ol.layer.Tile({
          visible: false,
          source: new ol.source.WMTS({
            url: 'http://geoportal-orto.cuzk.cz/WMTS_ORTOFOTO/service.svc/get?',
            layer: 'orto',
            style: 'default',
            matrixSet: 'jtsk:epsg:5514',
            projection: projectionCuzk,
            format: 'image/jpg',
            tileGrid: wmtsTileGridCuzk
          })
        })
      },
      
      {
        name: "Základní mapa",
        layer: new ol.layer.Tile({
          visible: true,
          source: new ol.source.WMTS({
            url: 'http://geoportal-zm.cuzk.cz/WMTS_ZM/WMTService.aspx?',
            layer: 'zm',
            style: 'default',
            matrixSet: 'jtsk:epsg:5514',
            projection: projectionCuzk,
            format: 'image/png',
            tileGrid: wmtsTileGridCuzk
          })
        })
      },
      
    ]
  },
  
  {
    group: "Mapcache Hustopeče",
    items: [
      
      {
        name: "Hustopečsko",
        layer: new ol.layer.Tile({
          visible: true,
          source: new ol.source.WMTS({
            url: 'http://app.hustopece-city.cz/mapcache/wmts?',
            layer: 'Hustopecsko',
            style: 'default',
            matrixSet: 'epsg5514',
            projection: projectionCuzk,
            format: 'image/png',
            tileGrid: wmtsTileGridHust
          })
        })
      },
      
      {
        name: "Brumovice",
        layer: new ol.layer.Tile({
          visible: false,
          source: new ol.source.WMTS({
            url: 'http://app.hustopece-city.cz/mapcache/wmts?',
            layer: 'Brumovice',
            style: 'default',
            matrixSet: 'epsg5514',
            projection: projectionCuzk,
            format: 'image/png',
            tileGrid: wmtsTileGridHust
          })
        })
      },
      
      {
        name: "WMS: Hustopecsko",
        layer: new ol.layer.Image({
          visible: false,
          opacity: 0.9,
          source: new ol.source.ImageWMS({
            url: 'http://app.hustopece-city.cz/mapcache/',
            params: {
              'LAYERS': 'Hustopecsko'
            },
            serverType: 'mapserver',
            projection: projectionCuzk
          })
        })
      },
      
      {
        name: "WMS: Brumovice",
        layer: new ol.layer.Image({
          visible: false,
          source: new ol.source.ImageWMS({
            url: 'http://app.hustopece-city.cz/mapcache/',
            params: {
              'LAYERS': 'Brumovice'
            },
            serverType: 'mapserver'
          })
        })
      },
      
      {
        name: "Kostel",
        layer: vectorLayer
      },
      
    ]
  }
];

