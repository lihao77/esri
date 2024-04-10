<template>
    <div class="ele-body">
      <el-card shadow="never">
      <!-- 表标题 -->
      <div class="table-heard">
        <el-tag type="info">{{
          this.currentWeekRange[0] + '至' + this.currentWeekRange[1]
        }}</el-tag>
        <div class="center">
          <el-button @click="weekPre" size="mini"
            ><i class="el-icon-arrow-left"></i>上一周</el-button
          >
          <p>{{ currentYear }}年{{ currentMonth }}月</p>
          <el-button @click="weekNext" size="mini"
            >下一周<i class="el-icon-arrow-right"></i
          ></el-button>
        </div>
        <div>右边</div>
      </div>
      <table align="center" cellpadding="0" cellspacing="0">
        <tr class="sepacialy">
          <td></td>
          <!-- 周 -->
          <td v-for="(item, index) in weekGround" :key="index">{{ item }}</td>
        </tr>
   
        <tr v-for="(item, index) in timeGround" :key="index">
          <!-- 课程时间轴 -->
          <td class="time">{{ item }}</td>
          <!-- 第几周 -->
          <td
            align="center"
            valign="middle"
            v-for="(item, index1) in weekGround"
            :key="index1"
          >
            <!-- 第几周的所有课程 -->
            <div v-for="(item, index2) in course[index1]" :key="index2">
              <!-- 这天的课程开始时间 <=> 时间轴的开始时间 -->
              <div
                class="course-item"
                v-if="item.dateStart === timeGround[index]"
                :style="{ backgroundColor: coachColorMap[item.coach] }"
              >
                <p>{{ item.coach }}</p>
                <p>{{ item.title }}</p>
                <p>{{ item.dateStart + '-' + item.dateEnd }}</p>
              </div>
            </div>
          </td>
        </tr>
      </table>
      </el-card>
    </div>
  </template>
   
  <script>
  export default {
    props: {
      
    },
    data() {
      return {
        // 一周7天
        weekGround: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
   
          course: [
          [
            {
              coach: '张三',
              dateStart: '09:30',
              dateEnd: '10:30',
              title: '数学',
              detail:
                'Metting (German: Mettingen) is a commune in the Moselle department in Grand Est in north-eastern France.'
            },
            {
              coach: '李四',
              dateStart: '16:00',
              dateEnd: '17:00',
              title: '英语',
              detail:
                'Metting (German: Mettingen) is a commune in the Moselle department in Grand Est in north-eastern France.'
            },
            {
              coach: '王五',
              dateStart: '11:30',
              dateEnd: '13:50',
              title: '语文',
              detail:
                'Metting (German: Mettingen) is a commune in the Moselle department in Grand Est in north-eastern France.'
            }
          ],
          [
            {
              coach: '张三',
              dateStart: '10:30',
              dateEnd: '12:00',
              title: '语文'
            },
            {
              coach: '李四',
              dateStart: '12:30',
              dateEnd: '14:50',
              title: '英语'
            }
          ],
          [
            {
              coach: '王五',
              dateStart: '12:30',
              dateEnd: '13:30',
              title: '数学'
            },
            {
              coach: '张三',
              dateStart: '15:30',
              dateEnd: '16:50',
              title: 'Metting'
            }
          ],
          [
            {
              coach: '李四',
              dateStart: '09:50',
              dateEnd: '10:50',
              title: 'Metting'
            },
            {
              coach: '王五',
              dateStart: '11:30',
              dateEnd: '13:50',
              title: 'Metting'
            }
          ],
          [
            {
              coach: '张三',
              dateStart: '12:30',
              dateEnd: '13:30',
              title: 'Metting'
            },
            {
              coach: '李四',
              dateStart: '14:30',
              dateEnd: '15:50',
              title: 'Metting'
            }
          ],
          [
            {
              coach: '王五',
              dateStart: '09:50',
              dateEnd: '10:50',
              title: 'Metting'
            },
            {
              coach: '张三',
              dateStart: '11:30',
              dateEnd: '13:50',
              title: 'Metting'
            }
          ],
          [
            {
              coach: '李四',
              dateStart: '12:30',
              dateEnd: '13:30',
              title: 'Metting'
            },
            {
              coach: '王五',
              dateStart: '14:30',
              dateEnd: '15:50',
              title: 'Metting'
            }
          ]
        ],
   
        //  课程时间轴
        timeGround: [],
   
        currentYear: '', // 年份
        currentMonth: '', // 月份
        currentDay: '', // 日期
        currentWeek: '', // 星期
        days: [],
   
        //   当前周的日期范围
        currentWeekRange: [],
   
        // 默认周
        defalultWeekGround: [
          '周一',
          '周二',
          '周三',
          '周四',
          '周五',
          '周六',
          '周日'
        ],
   
        // 教练颜色map映射
        coachColorMap: {
          张三: '#2B2E4A',
          李四: '#521262',
          王五: '#903749'
        }
      };
    },
    methods: {
      formatDate(year, month, day) {
        const y = year;
        let m = month;
        if (m < 10) m = `0${m}`;
        let d = day;
        if (d < 10) d = `0${d}`;
        return `${y}-${m}-${d}`;
      },
      initData(cur) {
        let date = '';
        if (cur) {
          date = new Date(cur);
        } else {
          date = new Date();
        }
        this.currentDay = date.getDate(); // 今日日期 几号
        this.currentYear = date.getFullYear(); // 当前年份
        this.currentMonth = date.getMonth() + 1; // 当前月份
        this.currentWeek = date.getDay(); // 1...6,0   // 星期几
        if (this.currentWeek === 0) {
          this.currentWeek = 7;
        }
        const str = this.formatDate(
          this.currentYear,
          this.currentMonth,
          this.currentDay
        ); // 今日日期 年-月-日
   
        this.days.length = 0;
        // 今天是周日，放在第一行第7个位置，前面6个 这里默认显示一周，如果需要显示一个月，则第二个循环为 i<= 35- this.currentWeek
        /* eslint-disabled */
        for (let i = this.currentWeek - 1; i >= 0; i -= 1) {
          const d = new Date(str);
          d.setDate(d.getDate() - i);
          this.days.push(d);
        }
        for (let i = 1; i <= 7 - this.currentWeek; i += 1) {
          const d = new Date(str);
          d.setDate(d.getDate() + i);
          this.days.push(d);
        }
   
        //  当前周的日期范围
        this.currentWeekRange = [
          this.formatDate(
            this.days[0].getFullYear(),
            this.days[0].getMonth() + 1,
            this.days[0].getDate()
          ),
          this.formatDate(
            this.days[6].getFullYear(),
            this.days[6].getMonth() + 1,
            this.days[6].getDate()
          )
        ];
        //获取到这周7个日期,不要年份，eg:周一(7/31)
        let dataArr = [];
   
        this.days.forEach((item) => {
          dataArr.push(`${item.getMonth() + 1}/${item.getDate()}`);
        });
   
        this.defalultWeekGround.map((item, index) => {
          this.weekGround[index] = item + `(${dataArr[index]})`;
        });
      },
      //  上个星期
      weekPre() {
        const d = this.days[0]; // 如果当期日期是7号或者小于7号
        d.setDate(d.getDate() - 7);
        this.initData(d);
      },
      //  下个星期
      weekNext() {
        const d = this.days[6]; // 如果当期日期是7号或者小于7号
        d.setDate(d.getDate() + 7);
        this.initData(d);
      }
    },
    created() {
      // 根据course中每个数组中每个对象的dateStart生成时间轴
      this.course.forEach((item) => {
        item.forEach((item) => {
          this.timeGround.push(item.dateStart);
        });
      });
   
      this.initData();
    },
    computed: {}
  };
  </script>
   
  <style lang='scss' scoped>
  .index {
    width: 100%;
    box-sizing: border-box;
    padding: 10px;
    background-color: #fff;
  }
  table {
    width: 100%;
    background-color: #fff;
    border-color: #e3e8ee;
    text-align: center;
    border-radius: 4px;
     border-top: 1px solid #e3e8ee;
    border-left: 1px solid #e3e8ee;
  }
  tr {
    border: none;
    text-align: center;
  }
  td {
    border-bottom: 1px solid #e3e8ee;
    border-right: 1px solid #e3e8ee;
    text-align: center;
    box-sizing: border-box;
    padding: 6px;
  }
  tr:nth-child(1) {
    height: 30px;
    background-color: #f3f3f3;
    border: none;
    color: #525252;
    font-weight: bold;
  }
   
  tr:first-child {
    width: 50px;
    // background: #f7f7f7;
  }
  .sepacialy {
    border-top: 1px solid #e3e8ee;
    border-left: 1px solid #e3e8ee;
  }
  .table-heard {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    box-sizing: border-box;
    padding: 10px 10px;
    .center {
      display: flex;
      justify-content: center;
      align-items: center;
      p {
        font-size: 20px;
        margin: 0 30px;
      }
    }
  }
  .course-item {
    display: flex;
    justify-content: center;
    flex-direction: column;
    gap: 6px;
    align-items: center;
    background: #318bff;
    min-height: 80px;
    border-radius: 4px;
   
    box-sizing: border-box;
    padding: 10px 0;
    p {
      color: #fff;
    }
  }
  .time {
    background: #f7f7f7;
    color: #707070;
    font-weight: bold;
  }
  </style>