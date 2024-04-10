<!-- <script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import IconText from "@/views/common/IconText.vue";
import {
  Timer,
  Location,
  HomeFilled,
  UserFilled
} from "@element-plus/icons-vue";
const props = defineProps({
  //下午节次数
  afternoonLength: {
    type: [Number],
    default: 4
  },
  // 总节次
  length: {
    type: [Number],
    default: 12
  },
  //课表数据
  events: {
    type: Array<any>,
    default: null
  }
});
const tableCellStyle = ({ row, column }) => {
  if (row[column.property].title !== undefined) {
    //return { color: "#FFFFFF", "text-align": "center" };
    if (row[column.property].type === 1) {
      return {
        "background-color": "#2B65EC",
        "border-radius": "10px",
        color: "#fff"
      };
    } else if (row[column.property].type === 2) {
      return {
        "background-color": "#7F38EC",
        "border-radius": "10px",
        color: "#fff"
      };
    }
  }
};
// let maxHeight = 400;
const timetable = ref([]);
const makeTimetable = () => {
  timetable.value = [];
  for (let i = 0; i < props.length; i++) {
    const one = {
      sjd: "",
      jc: i + 1,
      mon: {},
      tue: {},
      wed: {},
      thu: {},
      fri: {},
      sat: {},
      sun: {}
    };
    if (i < 4) {
      one.sjd = "上午";
    } else if (i > 3 && i < props.afternoonLength + 4) {
      one.sjd = "下午";
    } else {
      one.sjd = "晚上";
    }
    timetable.value.push(one);
  }
};
const weeks = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const mergeData = () => {
  // 合并数据
  if (props.events.length > 0) {
    for (let i = 0; i < props.events.length; i++) {
      // 获取星期几
      const week = weeks[props.events[i].xq - 1];
      timetable.value[props.events[i].start - 1][week] = props.events[i];
    }
  }
};
 
const objectSpanMethod = ({ row, rowIndex, columnIndex }) => {
  if (columnIndex === 0) {
    if (rowIndex < 4) {
      if (rowIndex === 0) {
        return {
          rowspan: 4,
          colspan: 1
        };
      } else {
        return {
          rowspan: 0,
          colspan: 0
        };
      }
    } else if (rowIndex > 3 && rowIndex < 4 + props.afternoonLength) {
      if (rowIndex === 4) {
        return {
          rowspan: props.afternoonLength,
          colspan: 1
        };
      } else {
        return {
          rowspan: 0,
          colspan: 0
        };
      }
    } else {
      if (rowIndex === 4 + props.afternoonLength) {
        return {
          rowspan: props.length - 4 - props.afternoonLength,
          colspan: 1
        };
      } else {
        return {
          rowspan: 0,
          colspan: 0
        };
      }
    }
  }
  if (columnIndex === 2) {
    if (row.mon.title !== undefined) {
      return {
        rowspan: row.mon.end - row.mon.start + 1,
        colspan: 1
      };
    } else {
      return {
        rowspan: 1,
        colspan: 1
      };
    }
  }
  if (columnIndex === 3) {
    if (row.tue.title !== undefined) {
      return {
        rowspan: row.tue.end - row.tue.start + 1,
        colspan: 1
      };
    } else {
      return {
        rowspan: 1,
        colspan: 1
      };
    }
  }
  if (columnIndex === 4) {
    if (row.wed.title !== undefined) {
      return {
        rowspan: row.wed.end - row.wed.start + 1,
        colspan: 1
      };
    } else {
      return {
        rowspan: 1,
        colspan: 1
      };
    }
  }
  if (columnIndex === 5) {
    if (row.thu.title !== undefined) {
      return {
        rowspan: row.thu.end - row.thu.start + 1,
        colspan: 1
      };
    } else {
      return {
        rowspan: 1,
        colspan: 1
      };
    }
  }
  if (columnIndex === 6) {
    if (row.fri.title !== undefined) {
      return {
        rowspan: row.fri.end - row.fri.start + 1,
        colspan: 1
      };
    } else {
      return {
        rowspan: 1,
        colspan: 1
      };
    }
  }
  if (columnIndex === 7) {
    if (row.sat.title !== undefined) {
      return {
        rowspan: row.sat.end - row.sat.start + 1,
        colspan: 1
      };
    } else {
      return {
        rowspan: 1,
        colspan: 1
      };
    }
  }
  if (columnIndex === 8) {
    if (row.sun.title !== undefined) {
      return {
        rowspan: row.sun.end - row.sun.start + 1,
        colspan: 1
      };
    } else {
      return {
        rowspan: 1,
        colspan: 1
      };
    }
  }
};
makeTimetable();
onMounted(() => {
  // maxHeight = document.documentElement.clientHeight;
  mergeData();
});
watch(
  props,
  (_newValue, _oldValue) => {
    mergeData();
  },
  { immediate: true, deep: true }
);
</script>
 
<template>
  <div>
    <div class="panel">
      <el-table
        :data="timetable"
        :border="true"
        :span-method="objectSpanMethod"
        :header-cell-style="{
          background: '#d9e5fd',
          color: 'black',
          fontWeight: 1000
        }"
        style="width: 100%"
        :cell-style="tableCellStyle"
      >
        <el-table-column prop="sjd" label="时间段" width="80" align="center" />
        <el-table-column prop="jc" label="节次" width="80" align="center" />
        <el-table-column prop="mon" label="星期一" align="left">
          <template v-slot="scope">
            <div v-if="scope.row.mon.title !== undefined">
              <h4>
                {{ scope.row.mon.title.toString().split(';').join('<br />') }}
              </h4>
              <h5><IconText :icon="Timer" :text="scope.row.mon.skjc" /></h5>
              <h5><IconText :icon="Location" :text="scope.row.mon.addr" /></h5>
              <h5>
                <IconText :icon="HomeFilled" :text="scope.row.mon.jxbzc" />
              </h5>
              <h5><IconText :icon="UserFilled" :text="scope.row.mon.num" /></h5>
            </div>
            <div v-else />
          </template>
        </el-table-column>
        <el-table-column prop="tue" label="星期二" align="left">
          <template v-slot="scope">
            <div v-if="scope.row.tue.title !== undefined">
              <h4>{{ scope.row.tue.title }}</h4>
              <h5><IconText :icon="Timer" :text="scope.row.tue.skjc" /></h5>
              <h5><IconText :icon="Location" :text="scope.row.tue.addr" /></h5>
              <h5>
                <IconText :icon="HomeFilled" :text="scope.row.tue.jxbzc" />
              </h5>
              <h5><IconText :icon="UserFilled" :text="scope.row.tue.num" /></h5>
            </div>
            <div v-else />
          </template>
        </el-table-column>
        <el-table-column prop="wed" label="星期三" align="left">
          <template v-slot="scope">
            <div v-if="scope.row.wed.title !== undefined">
              <h4>{{ scope.row.wed.title }}</h4>
              <h5><IconText :icon="Timer" :text="scope.row.wed.skjc" /></h5>
              <h5><IconText :icon="Location" :text="scope.row.wed.addr" /></h5>
              <h5>
                <IconText :icon="HomeFilled" :text="scope.row.wed.jxbzc" />
              </h5>
              <h5><IconText :icon="UserFilled" :text="scope.row.wed.num" /></h5>
            </div>
            <div v-else />
          </template>
        </el-table-column>
        <el-table-column prop="thu" label="星期四" align="left">
          <template v-slot="scope">
            <div v-if="scope.row.thu.title !== undefined">
              <h4>
                <span
                  v-html="
                    scope.row.thu.title.toString().split(';').join('<br />')
                  "
                />
              </h4>
              <h5><IconText :icon="Timer" :text="scope.row.thu.skjc" /></h5>
              <h5><IconText :icon="Location" :text="scope.row.thu.addr" /></h5>
              <h5>
                <IconText :icon="HomeFilled" :text="scope.row.thu.jxbzc" />
              </h5>
              <h5><IconText :icon="UserFilled" :text="scope.row.thu.num" /></h5>
            </div>
            <div v-else />
          </template>
        </el-table-column>
        <el-table-column prop="fri" label="星期五" align="left">
          <template v-slot="scope">
            <div v-if="scope.row.fri.title !== undefined">
              <h4>{{ scope.row.fri.title }}</h4>
              <h5><IconText :icon="Timer" :text="scope.row.fri.skjc" /></h5>
              <h5><IconText :icon="Location" :text="scope.row.fri.addr" /></h5>
              <h5>
                <IconText :icon="HomeFilled" :text="scope.row.fri.jxbzc" />
              </h5>
              <h5><IconText :icon="UserFilled" :text="scope.row.fri.num" /></h5>
            </div>
            <div v-else />
          </template>
        </el-table-column>
        <el-table-column prop="sat" label="星期六" align="left">
          <template v-slot="scope">
            <div v-if="scope.row.sat.title !== undefined">
              <h4>{{ scope.row.sat.title }}</h4>
              <h5><IconText :icon="Timer" :text="scope.row.sat.skjc" /></h5>
              <h5><IconText :icon="Location" :text="scope.row.sat.addr" /></h5>
              <h5>
                <IconText :icon="HomeFilled" :text="scope.row.sat.jxbzc" />
              </h5>
              <h5><IconText :icon="UserFilled" :text="scope.row.sat.num" /></h5>
            </div>
            <div v-else />
          </template>
        </el-table-column>
        <el-table-column prop="sun" label="星期日" align="left">
          <template v-slot="scope">
            <div v-if="scope.row.sun.title !== undefined">
              <h4>{{ scope.row.sun.title }}</h4>
              <h5><IconText :icon="Timer" :text="scope.row.sun.skjc" /></h5>
              <h5><IconText :icon="Location" :text="scope.row.sun.addr" /></h5>
              <h5>
                <IconText :icon="HomeFilled" :text="scope.row.sun.jxbzc" />
              </h5>
              <h5><IconText :icon="UserFilled" :text="scope.row.sun.num" /></h5>
            </div>
            <div v-else />
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<style scoped lang="scss">
.cellStyle {
  background-color: rgb(24 144 255 / 80%);
  color: #fff;
  border-radius: 10px;
}
</style> -->