<template>
  <div class="timetable w100 h100">
    <div class="time-b w100">
      <div class="time-detail">{{ startTime }} - {{ endTime }}</div>
      <div class="time-controller">
        <el-button-group>
          <el-button type="primary" @click="changeCount(1), getWeek(count)">上周</el-button>
          <el-button round class="date-btn" @click="changeCount(0), getWeek(count)">本周</el-button>
          <el-button type="primary" @click="changeCount(-1), getWeek(count)">下周</el-button>
        </el-button-group>
      </div>
    </div>
    <div class="timetable-b w100">
      <table class="timetable-content w100">
        <thead>
          <tr>
            <th></th>
            <th>周一</th>
            <th>周二</th>
            <th>周三</th>
            <th>周四</th>
            <th>周五</th>
            <th>周六</th>
            <th>周日</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item2, index2) in maxCourseLength" :key="index2">
            <td>
              <p>{{ "第" + numberToChinease(item2) + "节" }}</p>
            </td>

            <td v-for="(item3, index3) in weeks" :key="index3" :rowspan="showData(index3, index2 + 1).subject &&
        showData(index3, index2).subject ===
        showData(index3, index2 + 1).subject
        ? 2
        : ''
        " :style="[
        {
          display:
            showData(index3, index2 - 1).subject &&
              showData(index3, index2 - 1).subject ===
              showData(index3, index2).subject
              ? 'none'
              : '',
        },
      ]" @click="handleCellClick(showData(index3, index2))">
              <div class="dmsjandjs-b" :style="[
        {
          background: showData(index3, index2).index
            ? getRandomColor()
            : '#FFFFFF',
        },
        { color: '#fff' },
        { borderRadius: '15px' },
        { padding: '12px' },
        { height: '100%' },
      ]">
                <p>
                  {{ showData(index3, index2).startTime }}
                  {{ showData(index3, index2).startTime ? "-" : "" }}
                  {{ showData(index3, index2).endTime }}
                </p>
                <p>{{ showData(index3, index2).subject }}</p>
                <p>{{ showData(index3, index2).place }}</p>
                <p>{{ showData(index3, index2).class }}</p>
              </div>
            </td>

          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>


<script>
import moment from "moment";
import { useTimeTableApi } from "/@/api/fun/timeTable";

import { weekCourse, colorList } from "./timeTable.js";
const timeTableApi = useTimeTableApi();
export default {
  data() {
    return {
      weekStartTime: "2024.2.26",
      startTime: "2022.10.17",
      endTime: "2022.10.23",
      colorList: [], //随机颜色
      weekCourse: [], // 课程详细课程、数量
      weeks: [], //头部周期
      maxCourseLength: 0, //最大课节数,
      count: 1, //上周、下周、本周选择器flag
    };
  },
  created() {
    this.weekCourse = weekCourse;
    this.countInit();
    timeTableApi.getTimeTable({ week: this.count }).then((res) => {
      console.log("res:", res);
      this.weekCourse = res.data;
      this.colorList = colorList;
      this.sortData();
      this.init();
      this.getWeek(this.count);
      console.log(this.weeks)
    });

  },
  methods: {
    //改变选择器次数
    changeCount(i) {
      if (this.count == i) {
        this.count = 1;
        return this.count;
      } else if (i == 0) {
        this.countInit()
        timeTableApi.getTimeTable({ week: this.count }).then((res) => {
          console.log("res:", res);
          this.weekCourse = res.data;
          this.colorList = colorList;
          this.sortData();
          this.init();
          this.getWeek(this.count);
          console.log(this.weeks)
        });
        return this.count;
      }

      this.count -= i;
      timeTableApi.getTimeTable({ week: this.count }).then((res) => {
        console.log("res:", res);
        this.weekCourse = res.data;
        this.colorList = colorList;
        this.sortData();
        this.init();
        this.getWeek(this.count);
        console.log(this.weeks)
      });
      return this.count;
    },
    // 排序周期和课数
    sortData() {
      //周期
      // this.weekCourse.sort((a, b) => {
      //   return a.week - b.week;
      // });
      this.weekCourse.forEach((item) => {
        for (const key in item) {
          if (key === "courses") {
            item[key].sort((a, b) => {
              return a.index - b.index;
            });
          }
        }
      });
    },

    countInit() {
      this.count = 1 + this.getWeekNumber(this.weekStartTime, moment().format("YYYY.MM.DD"));
    },
    // 初始化课数(courses)与天数(week)
    init() {
      this.weeks = []; //周集合
      this.maxCourseLength = 0;
      this.weeks = this.weekCourse.map((item, index) => {
        for (const key in item) {
          if (key === "courses") {
            let max = 0; //
            //取出一周中最大的课节数及当天的最大课节数
            for (let j of item[key]) {
              j.index > this.maxCourseLength &&
                (this.maxCourseLength = j.index); //取所有一周里最大课节值
              j.index > max && (max = j.index); //取当天最大课节值
            }
            // console.log("max:", max);

            //如果当天的课节总数小于当天的最大课节值
            if (item[key].length < max) {
              //以最大课节值为终点遍历当天课节
              for (let i = 0; i < max; i++) {
                //如果下标课节不存在或着与循环的下标不匹配
                if (!item[key][i] || item[key][i].index != i + 1) {
                  item[key].splice(i, 0, " "); //填充空课节
                }
              }
            }
          }
        }
        return item.week;
      });
    },

    /**
     * 处理数据
     * @param { Number } weekIndex 周几对应的下标
     * @param { Number }  courseNum  第几节课对应的下标
     * @returns { String }   返回对应字符
     */
    showData(weekIndex, courseNum) {
      if (
        this.weekCourse[weekIndex] &&
        this.weekCourse[weekIndex].courses[courseNum] &&
        this.weekCourse[weekIndex].courses[courseNum].index === courseNum + 1
      ) {
        // this.getRandomColor();
        return this.weekCourse[weekIndex].courses[courseNum];
      }
      return false;
    },

    /**
     * 数字转中文
     * @param { Number } n 需转换的数字
     * @param { Boolean }  identifier  标识符
     * @returns { String }  identifier  转换后的中文
     */
    numberToChinease(n, identifier) {
      const chnArr = [
        "零",
        "一",
        "二",
        "三",
        "四",
        "五",
        "六",
        "七",
        "八",
        "九",
        "十",
        "十一",
        "十二",
      ];
      return identifier === "week" && (n === 0 || n === 7) ? "日" : chnArr[n];
    },

    //随机获取颜色
    getRandomColor() {
      let colorList = this.colorList;
      let colorRandom = Math.floor(Math.random() * colorList.length + 1) - 1;
      let color;
      for (let i = 0; colorList.length > i; i++) {
        if (i == colorRandom) {
          color = colorList[i];
        }
      }
      return color;
    },

    //随机上、本、下周 日期
    getWeek(i) {
      let weekOfDay = parseInt(moment(this.weekStartTime).format("E")); //计算今天是这周第几天
      let last_monday = moment(this.weekStartTime)
        .subtract(weekOfDay - 7 * (i - 1) - 1, "days")
        .format("YYYY-MM-DD"); //周一日期
      let last_sunday = moment(this.weekStartTime)
        .subtract(weekOfDay - 7 * (i), "days")
        .format("YYYY-MM-DD"); //周日日期
      console.log("weekOfDay:", weekOfDay);
      console.log("weekOfDay:", this.count);
      console.log("last_monday:", last_monday);
      console.log("last_sunday:", last_sunday);
      this.startTime = last_monday;
      this.endTime = last_sunday;
    },
    handleCellClick(courseData) {
      if (courseData.subject) {
        // console.log(JSON.parse(courseData.location));
        this.$emit('setPoint', JSON.parse(courseData.location))
      }
    },
    getWeekNumber(startDate, endDate) {
      const start = moment(startDate, "YYYY.MM.DD");
      const end = moment(endDate, "YYYY.MM.DD");
      return end.diff(start, 'weeks');
    },
  },
};
</script>

<style scoped lang="scss">
.timetable {
  background-color: #f1f7ff;

  .w100 {
    width: 100%;
    min-width: 800px;
  }

  .h100 {
    height: 100%;
  }

  .time-b {
    height: 46px;
    margin-bottom: 12px;
    padding-top: 12px;
    padding-left: 24px;
    padding-right: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .time-detail {
      color: #333333;
      font-weight: 700;
      font-size: 20px;
      font-family: "Microsoft YaHei";
    }
  }

  .timetable-b {
    // height: 1207px;
    background-color: #fff;
    overflow: auto;

    .timetable-content {
      height: 100%;
      table-layout: fixed;
      border-collapse: collapse; //设置表格的边框是否被合并为一个单一的边框
      text-align: center;
      color: #333333;
      font-weight: 400;
      font-size: 18px;

      thead {
        height: 50px;

        th {
          border: 2px solid rgba(27, 100, 240, 0.1);
        }
      }

      tbody {
        height: calc(100% - 2px) / 7;

        td {
          padding: 3px;
          border: 2px solid rgba(27, 100, 240, 0.1);
          height: 120px;

          .dmsjandjs-b {
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
        }
      }
    }
  }
}

::v-deep {
  .time-controller {
    .el-button-group {
      .el-button {
        height: 46px;
        background: #ffffff;
        font-size: 18px;
        font-weight: 600;
        border: 1px solid rgba(27, 100, 240, 0.1);
        border-radius: 55px;
        color: #1b64f0;
      }

      :nth-child(2) {
        margin: 0px 12px;
      }
    }
  }
}
</style>
