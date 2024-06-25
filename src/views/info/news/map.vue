<template>
  <div class="newsMain">
    <div id="newsMap"></div>
    <div id="test" style="width: 100%;" ref='test'>
      <!-- <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item title="Consistency" name="1">
          <div>
            Consistent with real life: in line with the process and logic of real
            life, and comply with languages and habits that the users are used to;
          </div>
          <div>
            Consistent within interface: all elements should be consistent, such
            as: design style, icons and texts, position of elements, etc.
          </div>
        </el-collapse-item>
        <el-collapse-item title="Feedback" name="2">
          <div>
            Operation feedback: enable the users to clearly perceive their
            operations by style updates and interactive effects;
          </div>
          <div>
            Visual feedback: reflect current state by updating or rearranging
            elements of the page.
          </div>
        </el-collapse-item>
        <el-collapse-item title="Efficiency" name="3">
          <div>
            Simplify the process: keep operating process simple and intuitive;
          </div>
          <div>
            Definite and clear: enunciate your intentions clearly so that the
            users can quickly understand and make decisions;
          </div>
          <div>
            Easy to identify: the interface should be straightforward, which helps
            the users to identify and frees them from memorizing and recalling.
          </div>
        </el-collapse-item>
        <el-collapse-item title="Controllability" name="4">
          <div>
            Decision making: giving advices about operations is acceptable, but do
            not make decisions for the users;
          </div>
          <div>
            Controlled consequences: users should be granted the freedom to
            operate, including canceling, aborting or terminating current
            operation.
          </div>
        </el-collapse-item>
      </el-collapse> -->
      <el-container>
        <el-header ><div ref="newsHeader"></div></el-header>
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
  Map.addLayer(new FeatureLayer({
    url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads/FeatureServer/0",
    title: "Trailheads1",
  }), 7)
  const USALayer = new MapImageLayer({
    url: "http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer",
    title: "US Sample Data"
  });

  const testtttttt = new FeatureLayer({
    // url: "https://pqyportal.geoscene.cn/geoscene/rest/services/Hosted/地图_WFL1/FeatureServer/0",
    // url: "https://pqyportal.geoscene.cn/geoscene/rest/services/Hosted/Building_WFL1/FeatureServer/0",
    url: "https://pqyportal.geoscene.cn/geoscene/rest/services/Hosted/newsMap_WFL1/FeatureServer/0",
    title: "新闻地图",
    editingEnabled: true,
  })

  console.log(testtttttt)
  let customContentWidget = new CustomContent({
    outFields: ["*"],
    creator: (event) => {
      // creator function returns either string, HTMLElement, Widget, or Promise
      console.log("event?.graphic.attributes", event?.graphic.attributes);
      console.log("newsContent.value", newsContent.value);
      newsContent.value.innerHTML = `${event?.graphic.attributes?.content}`;
      newsHeader.value.innerHTML = `<h2>${event?.graphic.attributes?.title}</h2>`;
      
      return test.value
    }
  });
  const editThisAction = {
    title: "Edit feature",
    id: "edit-this",
    className: "esri-icon-edit"
  };
  const template = {
    outFields: ["*"],
    title: "新闻地图",
    content: [customContentWidget],
    actions: [editThisAction]
  };
  testtttttt.popupTemplate = template;
  Map.addLayer(testtttttt, 8)
  // 创建图层，显示美国的样本人口普查数据。
  // 设置可见性为false，这样在启动时不可见。
  const censusLayer = new MapImageLayer({
    url: "http://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer",
    title: "US Sample Census",
    visible: false
  });

  const demographicGroupLayer1 = new GroupLayer({
    title: "top",
    visible: true,
    visibilityMode: "exclusive",
    layers: [USALayer, censusLayer],
    opacity: 0.75
  });
  // Create GroupLayer with the two MapImageLayers created above
  // as children layers.
  const demographicGroupLayer = new GroupLayer({
    title: "US Demographics",
    visible: true,
    visibilityMode: "exclusive",
    layers: [demographicGroupLayer1],
    opacity: 0.75
  });

  Map.addLayer(demographicGroupLayer, 8);



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
      // console.log("item.layer.fullExtent", item.layer.fullExtent, "item.layer.opactity", item.layer.opacity);

      // if (item.title === "US Demographics") {
      // if (true) {
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
      // console.log(++a, item, item.title, item.children.length);
      // if (item.children.length > 1 && item.parent) {
      // item.children.length == 0 为没有子图层的图层创建滑块
      // item.children.length > 1 && item.parent 为有子图层且不是图层组的图层创建滑块
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
        // else if (id === "increase-opacity") {
        //   // 如果触发了增加不透明度操作，则增加GroupLayer的不透明度0.25
        //   if (demographicGroupLayer.opacity < 1) {
        //     demographicGroupLayer.opacity += 0.25;
        //   }
        // } else if (id === "decrease-opacity") {
        //   // 如果触发了减少不透明度操作，则减少GroupLayer的不透明度0.25
        //   if (demographicGroupLayer.opacity > 0) {
        //     demographicGroupLayer.opacity -= 0.25;
        //   }
        // }
      });
      Map.view.ui.remove('zoom');
      // 将部件添加到视图的右上角
      const layerListExpand = new Expand({
        view: Map.view,
        content: layerList
      });

      Map.view.ui.add(layerListExpand, "top-left");
      // console.log("layerList", layerList.domNode);

      const editor = new Editor({
        view: Map.view
      });

      // 每次单击“编辑要素”操作时执行
      function editThis() {
        // 如果编辑器的activeWorkflow为null，则使弹出窗口不可见

        console.log("editThis", editor.activeWorkflow);
        if (!editor.activeWorkflow) {
          Map.view.popup.visible = false;
          // 调用编辑器更新要素编辑工作流程
          editor.startUpdateWorkflowAtFeatureEdit(Map.view.popup.selectedFeature);
          // Map.view.ui.add(editor, "top-right");
          editThisFlag = [true, editorExpand.expanded];
          editorExpand.expanded = true;
        }

        // 当编辑器的viewModel状态为“ready”时，从显示中移除编辑器小部件，并重新添加弹出窗口。ready状态表示初始编辑器面板已经显示并准备好进行编辑。

        // 如果用户“返回”到当前编辑工作流程之外，编辑器将显示一个面板以选择要更新的要素。在这个特定的工作流程中不需要这样做，因为要素已经从弹出窗口中选择了。 “ready”状态表示初始编辑器面板是活动的，并且是通过“返回”按钮激活的。在这个例子中，我们从视图中移除编辑器，然后用弹出窗口替换它。
        // reactiveUtils.when(
        //   () => editor.viewModel.state === "ready",
        //   () => {
        //     // 移除编辑器并再次打开弹出窗口
        //     // Map.view.ui.remove(editor);
        //     editorExpand.expanded = false;

        //     Map.view.openPopup({
        //       fetchFeatures: true,
        //       shouldFocus: true
        //     });
        //   }
        // );
      }
      reactiveUtils.on(
        () => Map.view.popup,
        "trigger-action",
        (event) => {
          if (event.action.id === "edit-this") {
            editThis();
          }
        }
      );

      testtttttt.on("apply-edits", () => {
        // Once edits are applied to the layer, remove the Editor from the UI
        // Map.view.ui.remove(editor);
        if (editThisFlag) {
          editorExpand.expanded = editThisFlag[1];
          editThisFlag[0] = false;
        }

        // Cancel the workflow so that once edits are applied, a new popup can be displayed
        if (editor.activeWorkflow) {
          editor.viewModel.cancelWorkflow();
        }

      });

      const editorExpand = new Expand({
        view: Map.view,
        content: editor
      });
      let editThisFlag = [true, editorExpand.expanded];

      // Add the widget to the view
      Map.view.ui.add(editorExpand, "top-right");

      const ccWidget = new CoordinateConversion({
        view: Map.view
      });

      Map.view.ui.add(ccWidget, "bottom-left");
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
