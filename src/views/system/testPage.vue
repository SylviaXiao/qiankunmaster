<template>
  <div class="test-page-wrapper">
    <a-card :bordered="false" :style="{ margin: '20px 0' }">
      <a-tabs>
        <a-tab-pane key="1" tab="同步学员人脸库">
          <div class="test-page-content">
            <div class="tp-item" v-for="(item, idx) in btnArr" :key="idx">
              <a-divider class="divider" orientation="left">{{ item.btnName }}功能块</a-divider>
              <div class="date" v-if="item.hasDate">
                <a-divider class="divider" orientation="left">选择起止时间</a-divider>
                <a-range-picker :allowClear="false" :disabledDate="disabledDate" v-model="item.date" />
              </div>
              <div class="school" v-if="item.hasSchool">
                <a-divider class="divider" orientation="left">校区id输入</a-divider>
                <a-input v-model="item.schoolId" />
              </div>
              <a-button type="primary" @click="item.callback(item)" :loading="item.loading">{{ item.btnName }}</a-button>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="学员卡延期" v-if="handlePermBox('student:card:valid:view')">
          <perm-box perm="student:card:valid:view"> <StuCardOff></StuCardOff></perm-box>
        </a-tab-pane>
        <a-tab-pane key="3" tab="删除未上课课表" v-if="handlePermBox('education:plan:del')">
          <perm-box perm="education:plan:del"> <deleteSchedule></deleteSchedule></perm-box>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>
<script>
import PermBox from '@/components/PermBox'
import moment from 'moment'
import { repairSchedule, synchronousStuAvatar } from '@/api/system'
import StuCardOff from './modules/stuCardOff'
import deleteSchedule from './modules/deleteSchedule'
const baseUrl = process.env.VUE_APP_URL
const dalayDateStr = 15
const todayStr = moment()
  .subtract(0, 'days')
  .format('YYYY-MM-DD')

export default {
  name: 'testPage',
  data() {
    return {
      btnArr: [
        {
          btnName: '同步学员人脸库',
          callback: this.stuAvatarSyn,
          loading: false,
          date: [],
          hasSchool: true,
          schoolId: null
        }
      ]
    }
  },
  components: {
    StuCardOff,
    PermBox,
    deleteSchedule
  },
  methods: {
    handlePermBox(str) {
      return this.$tools.checkPerm(str)
    },
    disabledDate(current) {
      return current && current > moment(todayStr).add(dalayDateStr, 'days')
    },
    stuAvatarSyn(data) {
      const params = {
        school_id: data.schoolId
      }
      synchronousStuAvatar(params).then(res => {
        this.$message.success('同步成功')
      })
    }
  }
}
</script>

<style scoped lang="less">
.test-page-wrapper {
  .test-page-content {
    .tp-item {
      margin: 15px 0;

      > div {
        width: 250px;
        margin: 10px 0;

        .divider {
          font-size: 14px;
          color: #aaaaaa;
        }
      }
    }
  }
}
</style>
