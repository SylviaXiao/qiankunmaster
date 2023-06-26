<template>
  <div style="width:100%;overflow-x:auto;">
    <div class="wc-wrapper">
      <div class="room-search">
        <a-row class="room-select" :gutter="16">
          <a-col :lg="8" :md="8" :sm="12">
            <a-form-item label="当前教室" :labelCol="{ span: 8 }" :wrapperCol="{ span: 16 }">
              <a-select placeholder="请选择教室" style="width: 100%;" v-model="queryParam.roomId" :disabled="dataLoading">
                <a-select-option :allowClear="true" value="0">所有教室</a-select-option>
                <a-select-option :allowClear="true" :value="room.id" v-for="(room, roomIndex) in roomList" :key="roomIndex">
                  {{ room.roomName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :lg="8" :md="8" :sm="12">
            <a-form-item label="时间" :labelCol="{ span: 8 }" :wrapperCol="{ span: 16 }">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <a-time-picker
                  style="width: 45%;"
                  v-model="queryParam.startTime"
                  :disabled="dataLoading"
                  format="HH:mm"
                  placeholder="开始时间"
                  :disabledHours="() => disabledHours('startTime')"
                  :disabledMinutes="hour => disabledMinutes('startTime', hour)"
                  @change="changeDate('startTime')"
                />
                ~
                <a-time-picker
                  style="width: 45%;"
                  v-model="queryParam.endTime"
                  :disabled="dataLoading"
                  format="HH:mm"
                  placeholder="结束时间"
                  :disabledHours="() => disabledHours('endTime')"
                  :disabledMinutes="hour => disabledMinutes('endTime', hour)"
                  @change="changeDate('endTime')"
                />
              </div>
            </a-form-item>
          </a-col>

          <a-col :lg="8" :md="8" :sm="12">
            <a-form-item>
              <a-button type="primary" :disabled="dataLoading" @click="listClassWeekPlan">查询</a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </div>
      <div class="course-container">
        <a-row :gutter="16" type="flex" justify="space-between" align="top" class="course-week">
          <a-col :lg="3" :md="3" :sm="3" v-for="(item, index) in weekOptions" :key="index">
            <div class="course-week-title">{{ item.weekStr }}</div>
          </a-col>
        </a-row>
        <div class="week-list">
          <a-spin :spinning="dataLoading">
            <a-row :gutter="16" type="flex" justify="space-between" align="top" class="course-item">
              <a-col :span="3" v-for="(item, index) in weekOptions" :key="index">
                <div class="wc-class">
                  <div class="wc-class-list" v-for="(val, classIndex) in weekCourseList[index + 1]" :key="classIndex">
                    <!--              <a-divider style="margin: 5px 0;"/>-->
                    <div class="wc-roomName">{{ `${val.roomName}` }}</div>
                    <div class="wc-time">{{ `${val.startTime}-${val.endTime}` }}</div>
                    <div class="wc-className">{{ `${val.className}` }}</div>
                    <!--                 <div class="wc-teacherName">{{`${val.teacherName}`}}</div>-->
                    <div class="wc-teacherName">
                      <span v-for="(item, idx) in val.teachers">
                        <span v-if="idx != 0">,</span>
                        <span>{{ item.teacherName }}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </a-col>
            </a-row>
          </a-spin>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { listEduRoom } from '@/api/common'
import { listClassWeekPlan } from '@/api/education'

const weekOptions = [
  { weekStr: '周一', weekNo: 1 },
  { weekStr: '周二', weekNo: 2 },
  { weekStr: '周三', weekNo: 3 },
  { weekStr: '周四', weekNo: 4 },
  { weekStr: '周五', weekNo: 5 },
  { weekStr: '周六', weekNo: 6 },
  { weekStr: '周日', weekNo: 7 }
]
export default {
  name: 'WeekCourse',
  props: {
    defaultRoomId: {
      type: String,
      default: '0'
    },
    isModal: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    isModal: (nv, ov) => {
      if (nv) {
      }
    }
  },
  data() {
    return {
      weekOptions,
      roomList: [],
      weekCourseList: {},
      dataLoading: false,
      queryParam: {
        roomId: this.defaultRoomId,
        startTime: null,
        endTime: null
      },
    }
  },
  created() {
    this.getRoomList()
    this.listClassWeekPlan()
  },
  methods: {
    getRoomList() {
      listEduRoom().then(res => (this.roomList = res.data))
    },
    listClassWeekPlan() {
      const { roomId, startTime, endTime } = this.queryParam
      let params = {
        roomId: (!roomId || roomId == '0') ? null : roomId,
        startTime: startTime ? startTime.format('HHmm') : null,
        endTime: endTime ? endTime.format('HHmm') : null
      }

      this.dataLoading = true
      listClassWeekPlan(params)
        .then(res => {
          this.weekCourseList = res.data
        })
        .finally(() => {
          this.dataLoading = false
        })
    },
    disabledHours(type) {
      const { startTime, endTime } = this.queryParam
      let hours = []
      if (type === 'startTime' && endTime) {
        for (let i = 23; i > endTime.hour(); i--) {
          hours.push(i)
        }
      } else if (type === 'endTime' && startTime) {
        for (let i = 0; i < startTime.hour(); i++) {
          hours.push(i)
        }
      }
      return hours
    },
    disabledMinutes(type, hour) {
      const { startTime, endTime } = this.queryParam
      let minute = []
      if (type === 'startTime' && endTime && endTime.hour() === hour) {
        for (let i = 59; i > endTime.minute(); i--) {
          minute.push(i)
        }
      } else if (type === 'endTime' && startTime && startTime.hour() === hour) {
        for (let i = 0; i < startTime.minute(); i++) {
          minute.push(i)
        }
      }
      return minute
    },
    changeDate(key) {
      const { startTime, endTime } = this.queryParam
      if (startTime && endTime && endTime.isBefore(startTime)) {
        if (key === 'startTime') {
          this.queryParam.endTime = this.queryParam.startTime
        } else if (key === 'endTime') {
          this.queryParam.startTime = this.queryParam.endTime
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.wc-wrapper {
  min-width: 1150px;
  .room-search {
  }

  .course-container {
    text-align: center;
    max-height: 500px;
    overflow-y: scroll;
    padding: 0 15px;
    .week-list {
    }
    .course-week {
      margin-bottom: 12px;
      .course-week-title {
        text-align: center;
      }
    }

    .course-item {
      .wc-class-list {
        margin-bottom: 10px;
        border: 1px dashed #dddddd;
      }

      .wc-roomName {
        line-height: 30px;
        background-color: #e3e3e3;
      }
    }
  }
}
</style>
