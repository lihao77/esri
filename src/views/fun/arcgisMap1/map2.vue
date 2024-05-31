<template>
  <div class="mapMain">
    <div id="map1"></div>
    <div id="test" style="height: 10%;width: 10%;">
      <p>hello</p>
    </div>
  </div>

</template>


<script lang="ts" setup name="map21">
import ArcGIS from "../../../map/index.js";
import { onMounted, onBeforeUnmount } from "vue";
import Measurement from '@arcgis/core/widgets/Measurement'
import ScaleBar from "@arcgis/core/widgets/ScaleBar";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
const Map = new ArcGIS();

onMounted(() => {
  Map.init("map1");

  // 测量工具初始化
  let measurement = new Measurement(
    {
      view: Map.view,
      activeTool: "distance"
    },
  );

  let scaleBar = new ScaleBar({
    view: Map.view
  });
  console.log("map21");

  // Add widget to the bottom left corner of the view
  Map.addUI([{ component: measurement, position: "bottom-left", index: 0 }, { component: scaleBar, position: "bottom-left", index: 1 }]);
  Map.addLayer(new FeatureLayer({
    url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads/FeatureServer/0"
  }), 7)
  Map.view.ui.add('test', 'top-right')
});

onBeforeUnmount(() => {
  console.log("map21 before unmount");
  // Map.destroy();
});
</script>

<style lang="scss" scoped>
.mapMain {
  // position: absolute;
  // top: 70px;
  // bottom: 0;
  width: 100%;
  height: 100%;

  #map1 {
    width: 100%;
    height: 100%;
  }
}
</style>
