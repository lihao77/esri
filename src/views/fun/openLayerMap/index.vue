<template>
    <div class="layout-padding">
        <div class="layout-padding-auto layout-padding-view">
            <div ref="mapContainer" id="map" style="height: 100%"></div>
            <layer-control :map="map" :layers="mapLayers"></layer-control>
            <div ref="popupRef" id="popup" class="popup">
                <el-button type="text" icon="el-icon-close" ref="popupCloserRef" class="popupCloser"
                    @click="closePopup"></el-button>
                <el-descriptions title="该点信息" direction="vertical" :column="4" border size="small" v-if="featureProps">
                    <el-descriptions-item v-for="(item, index) in featureProps.lableTips" :key="index"
                        :label="item.label">{{ featureProps[item.prop] }}</el-descriptions-item>
                </el-descriptions>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="funOpenLayerMap">
import { ref, onMounted } from 'vue';
import 'ol/ol.css';
import Map, { MapOptions } from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import TileArcGISRest from 'ol/source/TileArcGISRest';
import Overlay from 'ol/Overlay';
import layerControl from './layerControl.vue';
import { fromLonLat } from 'ol/proj';

// 定义一个 ref 来存储地图容器
const mapContainer: any = ref();
// 定义一个 ref 来存储地图实例
let map = ref<null | Map>(null);
// 定义一个 ref 来存储图层信息
const mapLayers = ref(<Array<any>>[]);
// 定义一个 ref 来存储当前点击的要素信息
const featureProps = ref(undefined);
const popup = ref<undefined | Overlay>(undefined);
const popupContainer = ref<undefined | HTMLElement>(undefined);
const popupCloser = ref(null);

// 定义一个方法来初始化地图
function initMap() {
    map.value = new Map({
        target: mapContainer.value,
        layers: [
            new TileLayer({         // 高德卫星
                title: '高德卫星',
                type: '卫星底图',
                source: new XYZ({
                    url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=6&x={x}&y={y}&z={z}',
                    wrapX: false,
                    crossOrigin: 'anonymous',
                })
            }),
            new TileLayer({         // 高德地图
                title: '高德地图',
                type: '地图底图',
                source: new XYZ({
                    url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}',
                    wrapX: false,
                    crossOrigin: 'anonymous',
                })
            }),
            new TileLayer({           // OSM地图
                title: 'OSM地图',
                type: '地图底图',
                source: new OSM()
            }),
            // new TileLayer({         // ArcGIS地图
            //     title: 'ArcGIS地图',
            //     type: '地图底图',
            //     source: new TileArcGISRest({
            //         url: 'https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer',
            //         crossOrigin: 'anonymous',
            //     })
            // }),
        ],
        view: new View({
            center: [0, 0],
            zoom: 2
        })
    });

    map.value.setView(
        new View({
            center: [0, 0],
            zoom: 2,
            projection: 'EPSG:4326'
        })
    );



    // 获取地图实例的图层信息并存储在 mapLayers 中
    mapLayers.value = map.value.getLayers().getArray();
    console.log(mapLayers.value);


}
// 初始化覆盖层
function initOverlay() {
    popup.value = new Overlay({
        element: popupContainer.value,
        autoPan: true,
        autoPanAnimation: {
            duration: 250,
        },
    });
    if (map.value) {
        map.value.addOverlay(popup.value);
    }
}
// 单击要素
// function clickFeature() {

//     map.value.on("singleclick", function (evt) {
//         if (map.value) {
//             var clickCoord = evt.coordinate;
//             var pixel = map.value.getEventPixel(evt.originalEvent);
//             var feature = map.value.forEachFeatureAtPixel(
//                 pixel,
//                 function (feature) {
//                     return feature;
//                 }
//             );
//             /* console.log(
//               "feature",
//               feature.getProperties().hasOwnProperty("features")
//             ); */
//             if (feature && feature.getProperties().hasOwnProperty("features")) {
//                 if (feature.getProperties().features.length > 1) {
//                     _$notify({
//                         title: "提示",
//                         message: "该点聚合了多个点数据，请放大后查看",
//                         offset: 150,
//                         type: "warning",
//                     });
//                     _featureProps = undefined;
//                     _closePopup();
//                 } else {
//                     console.log(
//                         "_featureProps",
//                         feature.getProperties(),
//                         feature.getProperties().features[0]
//                     );
//                     _featureProps = feature.getProperties().features[0].values_;

//                     _popup.setPosition(
//                         feature.getProperties().features[0].values_.coordinates
//                     );
//                 }
//             } else if (feature) {
//                 featureProps.value = feature.values;

//                 _popup.setPosition(feature.values_.coordinates);
//                 console.log(
//                     "_featureProps",
//                     feature,
//                     _featureProps,
//                     feature.coordinates
//                 );
//             } else {
//                 _featureProps = undefined;
//                 _closePopup();
//             }
//         }
//     });
// };
// 关闭弹框
function closePopup() {
    if (popup.value) {
        popup.value.setPosition(undefined);
    }
};
onMounted(() => {
    initMap();
});


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