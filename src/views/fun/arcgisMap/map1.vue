<template>
    <div ref="mapContainer" id="map" style="height: 100%">
        <div id="viewDiv" style="width:100%;height:100%;"></div>
    </div>


</template>

<script setup>
import { onMounted } from 'vue'
import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'
import esriConfig from '@arcgis/core/config';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import Home from '@arcgis/core/widgets/Home';
import Search from '@arcgis/core/widgets/Search';
import Sketch from '@arcgis/core/widgets/Sketch';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
onMounted(() => {
    esriConfig.apiKey = "AAPKdbc785317bd1468ebdd0139037c9ecedpFWnVVRdGVvaMI1FYhNTw4W3HG3DTBzShMRxi1_xHJVKVhZZBTA247rGoR4gDM_k";
    const graphicsLayer = new GraphicsLayer();
    const map = new Map({
        basemap: "arcgis-topographic", // Basemap layer
        layers: [new FeatureLayer({
            url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads/FeatureServer/0"
        }), graphicsLayer]
    });

    const view = new MapView({
        map: map,
        center: [-118.805, 34.027],
        zoom: 13, // scale: 72223.819286
        container: "viewDiv",
        constraints: {
            snapToZoom: true
        }
    });
    let homeWidget = new Home({
        view: view
    });
    let searchWidget = new Search({
        view: view
    });
    view.when(() => {
        const sketch = new Sketch({
          layer: graphicsLayer,
          view: view,
          // graphic will be selected as soon as it is created
          creationMode: "update"
        });

        view.ui.add(sketch, "top-right");
      });
    view.ui.add(homeWidget, "bottom-left");
    view.ui.add(searchWidget, "top-right");
})
</script>

<style scoped>
.viewDiv {
    height: 100vh;
    width: 100vw;
}
</style>