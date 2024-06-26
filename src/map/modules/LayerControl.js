/*
 * @Author       : 震雨 LuckRain7
 * @Date         : 2020-12-15 11:07:31
 * @LastEditTime : 2020-12-15 11:07:36
 * @Description  : 图层控制模块
 * @ Love and Peace
 */

// 图层约定
// 1 2 层被底图层
// 3 层为 边界边界图层

// import { DataType } from "@/utils/index"; // 工具函数

function DataType(tgt, type) {
  const dataType = Object.prototype.toString
    .call(tgt)
    .replace(/\[object (\w+)\]/, "$1")
    .toLowerCase();
  return type ? dataType === type : dataType;
}

/*
 *  description:  添加图层
 *  param {Layer,Array<Layer>} layer  需添加的图层
 *  param {number,Array<number>} lever 添加图层的层数
 */
const addLayer = function addLayer(layer, lever) {
  // 判断是
  if (DataType(layer, "array")) {
    layer.forEach((item, index) => {
      lever ? this.map.add(item, lever[index]) : this.map.add(item);
    });
  } else {
    lever ? this.map.add(layer, lever) : this.map.add(layer);
  }
};

const removeLayer = function removeLayer(layer) {
  this.map.removeLayer(layer);
};

export { addLayer, removeLayer };
