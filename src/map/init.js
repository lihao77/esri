/* eslint-disable no-unused-vars */
/*
 * @Author       : 震雨 LuckRain7
 * @Date         : 2020-08-20 10:44:38
 * @LastEditTime : 2020-12-15 11:53:45
 * @Description  : arcgis地图部分
 * @ Love and Peace
 */
import config from "./config"; // 配置项
import Map from '@arcgis/core/Map'
import Extent from '@arcgis/core/geometry/Extent'
import Measurement from '@arcgis/core/widgets/Measurement'
import ScaleBar from "@arcgis/core/widgets/ScaleBar.js";
import MapView from '@arcgis/core/views/MapView'
import SceneView from "@arcgis/core/views/SceneView";
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import WebMap from '@arcgis/core/WebMap'
import SpatialReference from '@arcgis/core/geometry/SpatialReference'
import esriConfig from '@arcgis/core/config'
console.log(esriConfig)
class ArcGIS {
  constructor() {
    this.map = undefined; // 地图
    this.view = undefined; // 视图
    this.baseMap = undefined; // 地图底图 
  }
  init(domID) {
    esriConfig.apiKey = "AAPKdbc785317bd1468ebdd0139037c9ecedpFWnVVRdGVvaMI1FYhNTw4W3HG3DTBzShMRxi1_xHJVKVhZZBTA247rGoR4gDM_k";
    console.log(esriConfig.apiKey)
    // 设置地图底图
    /*                                  2D Map Layers
     **     ||        Value	                          ||        Source
     **     ||        satellite	                      ||        World Imagery 
     **     ||        hybrid	                        ||        Hybrid Reference Layer and World Imagery
     **     ||        oceans	                        ||        World Ocean Reference and World Ocean Base
     **     ||        osm	                            ||        OpenStreetMapLayer
     **     ||        terrain	                        ||        World Reference Overlay and World Terrain Base
     **     ||        dark-gray / dark-gray-vector	  ||        Dark Gray Canvas
     **     ||        gray / gray-vector	            ||        Light Gray Canvas
     **     ||        streets / streets-vector	      ||        World Street Map
     **     ||        streets-night-vector	          ||        World Street Map (Night)
     **     ||        streets-navigation-vector	      ||        World Navigation Map
     **     ||        topo / topo-vector	            ||        World Hillshade and World Topographic Map
     **     ||        streets-relief-vector	          ||        World Hillshade and World Street Map (with Relief) 
                                       3D Map Layers
     **     ||        Value	                          ||        Source
     **     ||        topo-3d                         ||        Topographic
     **     ||        navigation-3d                   ||        Navigation
     **     ||        navigation-dark-3d              ||        Navigation (Dark)
     **     ||        osm-3d                          ||        OpenStreetMap
     **     ||        gray-3d                         ||        Light Gray Canvas
     **     ||        dark-gray-3d                    ||        Dark Gray Canvas
     **     ||        streets-3d                      ||        Streets
     **     ||        streets-dark-3d                 ||        Streets (Dark)
      */
    this.baseMap = {
      // vectorMap: "arcgis-topographic", //矢量地图
      vectorMap: "osm", //矢量地图
      // rasterMap: new SDRasterLayer(), //影像地图
      // rasterMapAnnotation: new SDRSAnnoLayer(), //影像注记
      // type: 1, // 1 为矢量 | 2：影像
    }

    // 设置初始化地图位置
    const startExtent = new Extent(
      // ...config.startExtent,
      {
        xmin: -9000514.7891084,
        ymin: 4194091.13204278,
        xmax:  -8996841.24591222,
        ymax: 4195317.60058408,
        spatialReference: new SpatialReference({ wkid: 3857 })

      }

      //  new SpatialReference({ wkid: 4490 })
    );

    const webmap = new WebMap({
      portalItem: {
        id: "4793230052ed498ebf1c7bed9966bd35"
      }
    });

    // 添加地图实例
    this.map = new Map({
      basemap: this.baseMap.vectorMap,
      extent: startExtent, // 初始化位置
      zoom: 10, // 缩放级别
      logo: false, // esri logo
      maxZoom: 18, // 最大缩放级别
      sliderPosition: "bottom-right", // 缩小放大按钮位置

    });

    // this.map = new Map({
    //   basemap: "arcgis-topographic", // Basemap layer
    //   layers: [new FeatureLayer({
    //     url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads/FeatureServer/0"
    //   })]
    // });
    this.map = webmap;
    this.view = new MapView({
      container: domID,
      // map: this.map,
      map: webmap,

      extent: startExtent,
      // zoom: 15
      // map: this.map,
      // center: [-118.805, 34.027],
      // zoom: 13, // scale: 72223.819286
      // container: domID,
      // constraints: {
      //   snapToZoom: true
      // }
    });

  }

  // 添加UI组件
  addUI(ui) {
    this.view.ui.add(ui);
  }

  // // 移除UI组件
  // removeUI(ui) {
  //   this.view.ui.remove(ui);
  // }

  // // 添加地图图层
  // addLayer(layer) {
  //   this.map.add(layer);
  // }

  // // 移除地图图层
  // removeLayer(layer) {
  //   this.map.remove(layer);
  // }

  // // 设置视图范围
  // setExtent(extent) {
  //   this.view.extent = extent;
  // }

  // // 获取视图范围
  // getExtent() {
  //   return this.view.extent;
  // }

  // // 设置视图缩放级别
  // setZoom(zoom) {
  //   this.view.zoom = zoom;
  // }

  // // 获取视图缩放级别
  // getZoom() {
  //   return this.view.zoom;
  // }

  // // 设置视图中心点
  // setCenter(center) {
  //   this.view.center = center;
  // }

  // // 获取视图中心点
  // getCenter() {
  //   return this.view.center;
  // }

  // // 设置视图比例尺
  // setScale(scale) {
  //   this.view.scale = scale;
  // }
}

export default ArcGIS;
