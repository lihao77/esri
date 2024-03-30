<script setup>
function onReady(event) {
  console.log("MapView ready", event);
}
</script>

<template>
  <!-- <arcgis-map item-id="45b3b2fb35e94ab09381d0caa0da5946" @arcgisViewReadyChange="onReady" style="width: 100%; height: 100%;">
    <arcgis-search position="top-right" />
    <arcgis-legend position="bottom-left" />
    <arcgis-compass position="top-right"></arcgis-compass>
    <arcgis-basemap-toggle position="top-right">
  </arcgis-basemap-toggle>
  </arcgis-map> -->

  <arcgis-scene item-id="f477c289e93347aba6a0c052bfe0e0a4" style="width: 100%; height: 100%;">
  <arcgis-building-explorer visible-elements-disciplines="true"
    visible-elements-levels="true" visible-elements-phases="true"
    position="top-right">
  </arcgis-building-explorer>
</arcgis-scene>

<!-- <arcgis-scene item-id="5ce0de673d3b41a3bf3a217942211c4b" style="width: 100%; height: 100%;">
  <arcgis-area-measurement-3d position="top-right">
  </arcgis-area-measurement-3d>
  <arcgis-search position="top-left" />
  <arcgis-basemap-toggle position="top-right">
  </arcgis-basemap-toggle>
</arcgis-scene> -->
</template>