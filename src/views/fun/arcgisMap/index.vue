<template>
    <div class="layout-padding">
        <div class="layout-padding-auto layout-padding-view">
            <!-- <div ref="mapContainer" id="map" style="height: 100%">
                <div id="viewDiv" style="width:100%;height:100%;"></div>
            </div> -->
            <Map />
        </div>
    </div>
</template>

<script setup lang="ts" name="funArcgisMap">
import { ref, onMounted } from 'vue';
import esriConfig from '@arcgis/core/config';
// import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import "@arcgis/core/assets/esri/themes/light/main.css";
// import Map from '@arcgis/core/Map';
// import Home from "@arcgis/core/widgets/Home";
// import Search from "@arcgis/core/widgets/Search";

import Map from "./map.vue";
// 单击要素


// onMounted(() => {
//     esriConfig.apiKey = "AAPKdbc785317bd1468ebdd0139037c9ecedpFWnVVRdGVvaMI1FYhNTw4W3HG3DTBzShMRxi1_xHJVKVhZZBTA247rGoR4gDM_k";
//     const map = new Map({
//         basemap: "arcgis-topographic", // Basemap layer
//         layers: [new FeatureLayer({
//             url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads/FeatureServer/0"
//         })]
//     });

//     const view = new MapView({
//         map: map,
//         center: [-118.805, 34.027],
//         zoom: 13, // scale: 72223.819286
//         container: "viewDiv",
//         constraints: {
//             snapToZoom: false
//         }
//     });
//     let homeWidget = new Home({
//         view: view
//     });
//     let searchWidget = new Search({
//         view: view
//     });
//     view.ui.add(homeWidget, "top-left");
//     view.ui.add(searchWidget, "top-right");
// })

</script>

<style lang="scss" scoped>
.popup {
    position: absolute;
    background-color: white;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    top: 10px;
    left: 10px;
}

.popup button {
    margin-top: 5px;
    padding: 5px 10px;
    background-color: #f44336;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
}

.popup button:hover {
    background-color: #d32f2f;
}
</style>