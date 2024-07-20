<template>
    <div class="ttMain">
        <div id="ttMap"></div>
        <div ref="button">
            <el-button @click="handleButtonClick">返回课表</el-button>
        </div>

    </div>
</template>


<script lang="ts" setup name="ttMap">
import ArcGIS from "../../../map/index.js";
import { onMounted, onBeforeUnmount, ref, defineProps } from "vue";
import Measurement from '@arcgis/core/widgets/Measurement'
import ScaleBar from "@arcgis/core/widgets/ScaleBar";
import Expand from "@arcgis/core/widgets/Expand";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import LayerList from "@arcgis/core/widgets/LayerList";
import MapImageLayer from "@arcgis/core/layers/MapImageLayer";
import GroupLayer from "@arcgis/core/layers/GroupLayer";
import Slider from "@arcgis/core/widgets/Slider";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils";
import Editor from "@arcgis/core/widgets/Editor";
import CoordinateConversion from "@arcgis/core/widgets/CoordinateConversion";
import CustomContent from "@arcgis/core/popup/content/CustomContent";
import PopupTemplate from "@arcgis/core/PopupTemplate";
import Graphic from "@arcgis/core/Graphic";
const Map = new ArcGIS();
let a = 0;
let features;
const activeNames = ref(['1'])
const handleChange = (val: string[]) => {
    console.log(val)
}
const test = ref()
const button = ref()
const emit = defineEmits(['changeDisplay'])
const handleButtonClick = () => {
    console.log("button clicked");
    Map.map.destroy();
     emit('changeDisplay')


}
const props = defineProps(['point'])
onMounted(() => {
    Map.init("ttMap");
    // // 测量工具初始化
    // let measurement = new Measurement(
    //   {
    //     view: Map.view,
    //     activeTool: "distance"
    //   },
    // );

    // let scaleBar = new ScaleBar({
    //   view: Map.view
    // });
    // // Add widget to the bottom left corner of the view
    // Map.addUI([{ component: measurement, position: "bottom-left", index: 0 }, { component: scaleBar, position: "bottom-left", index: 1 }]);
    Map.view?.when(() => {
        Map.addLayer(new FeatureLayer({
            url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads/FeatureServer/0",
            title: "Trailheads1",
        }), 7)

        
        const editThisAction = {
            title: "Edit feature",
            id: "edit-this",
            className: "esri-icon-edit"
        };

        let point = {
            type: "point",
            x: props.point.x,
            y: props.point.y,
            spatialReference: { wkid: 4326 }
        };
        const simpleMarkerSymbol = {
            type: "simple-marker",
            color: [226, 119, 40],
            outline: {
                color: [255, 255, 255],
                width: 2
            }
        };

        const pointGraphic = new Graphic({
            geometry: point,
            symbol: simpleMarkerSymbol
        });

        Map.view.graphics.add(pointGraphic);
        Map.view.goTo({ center: [props.point.x, props.point.y] }, { duration: 1000 }).then(() => {
            console.log("Map view centered at point");
        })
        Map.view.ui.add(button.value, "top-right");
    })
});
onBeforeUnmount(() => {
    console.log("newsVue before unmount");
    Map.map.destroy();
});
</script>

<style lang="scss" scoped>
.ttMain {
    // position: absolute;
    // top: 70px;
    // bottom: 0;
    width: 100%;
    height: 100%;

    #ttMap {
        width: 100%;
        height: 100%;
    }

    .article-content p {
        margin-bottom: 1em;
    }
}
</style>