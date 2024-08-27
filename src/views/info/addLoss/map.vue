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
import { onMounted, onBeforeUnmount, ref, watchEffect } from "vue";
import Expand from "@arcgis/core/widgets/Expand";
import LayerList from "@arcgis/core/widgets/LayerList";
import MapImageLayer from "@arcgis/core/layers/MapImageLayer";
import Slider from "@arcgis/core/widgets/Slider";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils";
import CoordinateConversion from "@arcgis/core/widgets/CoordinateConversion";

import Locate from "@arcgis/core/widgets/Locate";
import Point from "@arcgis/core/geometry/Point";


import Graphic from '@arcgis/core/Graphic';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
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
const props = defineProps({
  isSelecting: {
    type: Boolean,
    required: true
  }
});
const emit = defineEmits(['wkt-selected'])
const clickHandler = (event: { mapPoint: { x: any; y: any; spatialReference: any; }; }) => {
  // 清除地图视图中的所有图形
  Map.view.graphics.removeAll();

  const point = new Point({
    x: event.mapPoint.x,
    y: event.mapPoint.y,
    spatialReference: event.mapPoint.spatialReference
  });

  // 构建WKT字符串
  const wktString = `POINT (${point.longitude.toFixed(6)} ${point.latitude.toFixed(6)})`;

  // 创建一个简单的标记符号
  const markerSymbol = new SimpleMarkerSymbol({
    color: [226, 119, 40], // 设置符号的颜色
    outline: {
      color: [255, 255, 255], // 设置轮廓的颜色
      width: 2 // 设置轮廓的宽度
    }
  });

  // 创建一个图形对象
  const graphic = new Graphic({
    geometry: point,
    symbol: markerSymbol
  });

  // 将图形添加到地图视图中
  Map.view.graphics.add(graphic);
  emit('wkt-selected', wktString);

  setTimeout(() => {
    Map.view.goTo(point);
  }, 0);
};
const clearGraphics = () => {
  Map.view.graphics.removeAll();
};
onMounted(() => {
  Map.init("newsMap");
  const USALayer = new MapImageLayer({
    url: "http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer",
    title: "US Sample Data"
  });

  // 当Map视图准备就绪时执行的操作
  Map.view?.when(() => {


    // 在LayerList中创建操作
    async function defineActions(event: { item: any; }) {
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
    // Map.view.when(() => {
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
        Map.view.goTo(visibleLayer.fullExtent).catch((error: { name: string; }) => {
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
    // });

    if (props.isSelecting) {
      clickEvent = Map.view?.on('click', clickHandler);
    }
  });
});


onBeforeUnmount(() => {
  console.log("newsVue before unmount");
  // Map.destroy();
});

let clickEvent: { remove: () => void; } | null = null;
watchEffect(() => {

  if (props.isSelecting) {
    clickEvent = Map.view?.on('click', clickHandler);
  } else {
    if (clickEvent) {
      clickEvent.remove();
    }
  }

});

defineExpose({
  Map,
  clearGraphics
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
