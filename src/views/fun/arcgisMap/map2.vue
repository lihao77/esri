<template>
  <div class="main">
    <div id="map"></div>
  </div>
</template>


<script lang="ts" setup name="map2">
import ArcGIS from "../../../map/init.js";
import { onMounted } from "vue";
import Measurement from '@arcgis/core/widgets/Measurement'
import ScaleBar from "@arcgis/core/widgets/ScaleBar";
import { onBeforeUnmount } from "vue";
const Map = new ArcGIS();

onMounted(() => {
  Map.init("map");

  // 测量工具初始化
  let measurement = new Measurement(
    {
      view: Map.view,
      activeTool: "distance"
    },
  );

  console.log('map2 onMounted');
  // Add widget to the bottom left corner of the view
  Map.addUI([{ component: measurement, position: "bottom-left", index: 0 }]);
});

onBeforeUnmount(() => {
  console.log('map2 onBeforeUnmount');
});
</script>

<style lang="scss" scoped>
.main {
  position: absolute;
  // top: 70px;
  // bottom: 0;
  width: 100%;
  height: 100%;

  #map {
    width: 100%;
    height: 100%;
  }
}
</style>
