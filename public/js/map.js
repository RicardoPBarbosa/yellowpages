 // map plugin

 const lat = 37.351994
 const lon = -122.102261
 const zoom = 13
 
 const j = new ol.interaction.MouseWheelZoom()
 
 const oldFn = j.handleEvent
 j.handleEvent = function (e) {
     const type = e.type
     if (type !== "wheel" && type !== "wheel") {
         return true
     }
 
     if (!e.originalEvent.altKey) {
         return true
     }
 
     oldFn.call(this, e)
 }
 
 map = new ol.Map({
     layers: [new ol.layer.Tile({
         source: new ol.source.OSM()
     })],
     target: document.getElementById('map'),
     view: new ol.View({
         center: [parseFloat(lon), parseFloat(lat)],
         zoom: zoom,
         minZoom: 8,
         projection: 'EPSG:4326'
     }),
     interactions: ol.interaction.defaults({ mouseWheelZoom: false }).extend([j])
 })
 
 map.on('pointermove', function (e) {
     map.getTarget().style.cursor = 'default'
 });
 
 let features = []
 let k = 0

 coordinates = parseCoords(coordinates)
 for (let i = 0; i < coordinates.length; i++) {
    iconFeature = new ol.Feature({
         geometry: new ol.geom.Point(coordinates[i])
     })
 
     if (i == 0) {
         iconStyle = new ol.style.Style({
             image: new ol.style.Icon(({
                 anchor: [0.5, 46],
                 anchorXUnits: 'fraction',
                 anchorYUnits: 'pixels',
                 src: '/storage/point-1.png'
             }))
         })
     } else if (i == 1) {
         iconStyle = new ol.style.Style({
             image: new ol.style.Icon(({
                 anchor: [0.5, 46],
                 anchorXUnits: 'fraction',
                 anchorYUnits: 'pixels',
                 src: '/storage/point-2.png'
             }))
         })
     } else if (i == 2) {
         iconStyle = new ol.style.Style({
             image: new ol.style.Icon(({
                 anchor: [0.5, 46],
                 anchorXUnits: 'fraction',
                 anchorYUnits: 'pixels',
                 src: '/storage/point-3.png'
             }))
         })
     }
 
     iconFeature.setStyle(iconStyle)
 
     features[k] = iconFeature
     k++
 }
 
 vectorSource = new ol.source.Vector({
     features: features
 })
 
 vectorLayer = new ol.layer.Vector({
     source: vectorSource
 })
 map.addLayer(vectorLayer)