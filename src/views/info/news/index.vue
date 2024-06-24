<template>
    <div class="layout-padding">
        <div class="layout-padding-auto layout-padding-view">
            <Map />
        </div>
    </div>
</template>

<script setup lang="ts" name="funArcgisMap1">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import esriConfig from '@arcgis/core/config';
// import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
// import "@arcgis/core/assets/esri/themes/light/main.css";
// import Map from '@arcgis/core/Map';
// import Home from "@arcgis/core/widgets/Home";
// import Search from "@arcgis/core/widgets/Search";

import Map from "./map.vue";
// 单击要素

onBeforeUnmount(() => {
    console.log("news/index.vue 组件销毁");
})
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