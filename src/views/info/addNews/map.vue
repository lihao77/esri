<template>
  <div class="newsMain">
    <div id="newsMap"></div>
    <div id="test" style="width: 100%;" ref='test'>

      <el-container>
        <el-header>
          <div ref="newsHeader"></div>
        </el-header>
        <el-main>
          <div class="article-content">
            <!-- 文章内容 -->
            <p ref="newsContent">这里是文章的第一段内容...</p>
            <!-- 更多内容 -->
          </div>
        </el-main>
      </el-container>
    </div>
  </div>


</template>


<script lang="ts" setup name="newsMap">
import ArcGIS from "../../../map/index.js";
import { onMounted, onBeforeUnmount, ref } from "vue";
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
import Legend from "@arcgis/core/widgets/Legend";
import Locate from "@arcgis/core/widgets/Locate";
import HeatmapRenderer from "@arcgis/core/renderers/HeatmapRenderer";
const Map = new ArcGIS();
let a = 0;
let features;
const activeNames = ref(['1'])
const handleChange = (val: string[]) => {
  console.log(val)
}
const test = ref()
const newsContent = ref()
const newsHeader = ref()
onMounted(() => {
  Map.init("newsMap");
  const USALayer = new MapImageLayer({
    url: "http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer",
    title: "US Sample Data"
  });

  // Map.view.ui.add(
  //   new Legend({
  //     view: Map.view
  //   }),
  //   "bottom-right"
  // );



  // 当Map视图准备就绪时执行的操作
  Map.view?.when(() => {
    // 创建一个LayerList部件
    const layerList = new LayerList({
      view: Map.view,
      // 对LayerList中的每个ListItem执行的函数
      listItemCreatedFunction: defineActions
    });

    // 在LayerList中创建操作
    async function defineActions(event) {
      const { item } = event; // 从event对象中获取item属性
      // 等待图层加载完成
      await item.layer.when();

      if (item.layer.fullExtent && item.layer.url) {
        // 在LayerList中创建操作的对象数组
        item.actionsSections = [
          [
            {
              title: "缩放至图层",
              icon: "zoom-out-fixed",
              id: "full-extent"
            },
            {
              title: "图层信息",
              icon: "information",
              id: "information"
            }
          ],
          // [
          //   {
          //     title: "增加不透明度",
          //     icon: "chevron-up",
          //     id: "increase-opacity"
          //   },
          //   {
          //     title: "减少不透明度",
          //     icon: "chevron-down",
          //     id: "decrease-opacity"
          //   }
          // ]
        ];
      } else if (item.layer.url) {
        item.actionsSections = [
          [
            {
              title: "图层信息",
              icon: "information",
              id: "information"
            }
          ],
        ];
      }

      if (item.layer.opacity || item.layer.opacity === 0) {
        // 为更新图层不透明度创建滑块
        const slider = new Slider({
          min: 0,
          max: 1,
          precision: 2,
          values: [1],
          visibleElements: {
            labels: true,
            rangeLabels: true
          }
        });

        // 配置滑块的参数
        item.panel = {
          content: slider,
          icon: "sliders-horizontal",
          title: "改变图层不透明度"
        };

        // 监视滑块值的数组并更新图层的不透明度
        reactiveUtils.watch(
          // 获取滑块的值数组并更新图层的不透明度
          () => slider.values.map((value) => value),
          (values) => (item.layer.opacity = values[0])
        );

      }
    }

    // 当Map视图准备就绪时再次执行
    Map.view.when(() => {
      // 创建LayerList部件并添加到视图的右上角
      const layerList = new LayerList({
        view: Map.view,
        listItemCreatedFunction: defineActions
      });
      // 触发操作时的事件监听器
      layerList.on("trigger-action", (event) => {
        // 当前视图中可见的图层
        // const visibleLayer = USALayer.visible ? USALayer : censusLayer;
        const visibleLayer = event.item.layer;
        // 获取操作的ID
        const id = event.action.id;

        if (id === "full-extent") {
          // 如果触发了完整范围操作，则导航到可见图层的完整范围
          Map.view.goTo(visibleLayer.fullExtent).catch((error) => {
            if (error.name != "AbortError") {
              console.error(error);
            }
          });
        } else if (id === "information") {
          // 如果触发了信息操作，则打开服务图层的项目详情页面
          window.open(visibleLayer.url);
        }

      });
      Map.view.ui.remove('zoom');
      // 将部件添加到视图的右上角
      const layerListExpand = new Expand({
        view: Map.view,
        content: layerList
      });

      Map.view.ui.add(layerListExpand, "top-left");
      const ccWidget = new CoordinateConversion({
        view: Map.view
      });

      Map.view.ui.add(ccWidget, "bottom-left");

      const locateBtn = new Locate({
        view: Map.view
      });

      // Add the locate widget to the top left corner of the view
      Map.view.ui.add(locateBtn, {
        position: "top-left"
      });
    });


  });
});


onBeforeUnmount(() => {
  console.log("newsVue before unmount");
  // Map.destroy();
});
</script>

<style lang="scss" scoped>
.newsMain {
  // position: absolute;
  // top: 70px;
  // bottom: 0;
  width: 100%;
  height: 100%;

  #newsMap {
    width: 100%;
    height: 100%;
  }

  .article-content p {
    margin-bottom: 1em;
  }
}
</style>
