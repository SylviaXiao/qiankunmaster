<template>
  <!-- 顾问业绩 -->
  <div class="belongs-teacher">
    <div v-if="achievements.length">
      <a-divider orientation="left"><span :style="{ color: 'rgba(1,1,1,.3)' }">顾问转出业绩</span></a-divider>
      <div style="margin-right:10px;margin-bottom: 20px;">转出日期：{{ achievements[0].cardDate }}</div>
      <div style="margin-right:10px;margin-bottom: 20px;">办卡分馆：{{ achievements[0].CardName }}</div>
      <div v-for="(item, index) in achievements" :key="index" style="display: flex;margin-bottom: 10px;">
        <div style="margin-right:20px">业绩转出分馆：{{ item.deptName }}</div>
        <div style="margin-right:20px">顾问：{{ item.adviserName }}</div>
        <div style="margin-right:20px">转出业绩：{{ item.changePrice }}</div>
        <div style="margin-right:20px">备注：{{ item.remark }}</div>
      </div>
    </div>
    <a-divider orientation="left"
      ><span :style="{ color: 'rgba(1,1,1,.3)' }">{{ distribution ? '顾问转入业绩' : '顾问转出业绩' }}</span></a-divider
    >
    <div class="belongs-teacher-header" style="height: 40px">
      <div style="margin-right:10px;margin-bottom: 20px;" v-if="achievements.length">转入分馆：{{ achievements[0].receptionName }}</div>
      <div v-else></div>
      <a-button type="dashed" @click="addCounselorHandle"> <a-icon type="plus-circle" />分单 </a-button>
    </div>
    <div style="overflow-x:auto;">
      <div class="teacher-info" v-for="(item, index) in counselorInfo" :key="index">
        <span class="teacher-form">
          <span style="margin-right: 10px;">顾问</span>
          <a-input style="width: 150px" disabled placeholder="请选择顾问" v-model="item.name" class="show-disabled">
            <a-icon slot="addonAfter" type="search" @click="selectUser(item.key)" />
          </a-input>
        </span>
        <span class="teacher-form">
          <span style="margin-right: 10px;">金额</span>
          <a-input-number v-model="item.price" :min="0" style="width:80px" />
        </span>
        <span class="teacher-form">
          <span style="margin-right: 10px;">备注</span>
          <a-input style="width: 150px" placeholder="备注" v-model="item.remark" />
        </span>
        <span>
          <a v-if="counselorInfo.length > 1" href="javascript:;" @click="deleteCounselorHandle(item)">删除</a>
        </span>
      </div>
    </div>
    <i-modal ref="imodal" :userType="usertype" @getBackData="getUser"></i-modal>
  </div>
</template>
<script>
import IModal from '@/components/InnerModal'
import { achievementRollOut, confirmAchievement } from '@/api/reception/transferCard'

export default {
  data() {
    return {
      counselorInfo: [
        {
          key: 0,
          name: null,
          price: 0,
          remark: null,
          id: null
        }
      ],
      counselorkey: 0,
      usertype: 'all',
      openedKey: null,
      stuCardChangeLogId: null,
      schoolId: null,
      achievements: [],
      cardDate: null
    }
  },
  props: {
    //是否用分配接口
    distribution: {
      type: Boolean,
      default: false
    },
    //回显数组
    achiInfo: {
      type: Array,
      default: () => []
    }
  },
  components: {
    IModal
  },
  methods: {
    //清空
    clear() {
      this.counselorInfo = [
        {
          key: 0,
          name: null,
          price: 0,
          remark: null,
          id: null
        }
      ]
      this.openedKey = null
      this.stuCardChangeLogId = null
      this.schoolId = null
      this.cardDate = null
    },
    addCounselorHandle() {
      let temObj = {
        name: null,
        price: 0,
        remark: null,
        id: null
      }
      temObj.key = ++this.counselorkey
      this.counselorInfo.push(temObj)
    },
    resetTeaValue() {
      this.name = null
      this.id = null
    },
    deleteCounselorHandle(record) {
      this.counselorInfo = this.counselorInfo.filter(item => item.key !== record.key)
    },
    selectUser(key) {
      this.openedKey = key
      this.usertype = 'all'
      this.$refs.imodal.open()
    },
    getUser(data) {
      let index = this.counselorInfo.findIndex(item => item.key == this.openedKey)
      this.counselorInfo[index].id = data.id
      this.counselorInfo[index].name = data.name
      console.log(this.counselorInfo)
    },
    save() {
      if (!this.distribution) {
        if (!this.cardDate) {
          return this.$notification['error']({
            message: '系统通知',
            description: '请选择转卡日期'
          })
        }
        if (!this.stuCardChangeLogId) {
          return this.$notification['error']({
            message: '系统通知',
            description: '请选择转卡信息'
          })
        }
        if (!this.schoolId) {
          return this.$notification['error']({
            message: '系统通知',
            description: '请选择分馆'
          })
        }
        achievementRollOut({
          stuCardChangeLogId: this.stuCardChangeLogId,
          schoolId: this.schoolId,
          achievements: JSON.stringify(this.counselorInfo),
          cardDate: this.cardDate
        }).then(res => {
          if (res.code == 200) {
            this.$notification['success']({
              message: '系统通知',
              description: '操作成功'
            })
            this.$emit('closeAchiModal')
          }
        })
      } else {
        let price = this.counselorInfo.reduce((sum, c) => (c.price || 0) + sum, 0)
        let changePrice = this.achievements.reduce((sum, c) => (c.changePrice || 0) + sum, 0)
        if (price!==changePrice) {
          return this.$notification['error']({
            message: '系统通知',
            description: '转入转出业绩金额不一致，请再次核对'
          })
        }
        confirmAchievement({
          stuCardChangeLogId: this.stuCardChangeLogId,
          achievements: JSON.stringify(this.counselorInfo)
        }).then(res => {
          if (res.code == 200) {
            this.$notification['success']({
              message: '系统通知',
              description: '操作成功'
            })
            this.$emit('closeAchiModal')
          }
        })
      }
    },
    backData(data, stuCardChangeLogId, deptId) {
      this.stuCardChangeLogId = stuCardChangeLogId
      this.schoolId = deptId
      console.log(this.stuCardChangeLogId, this.schoolId)
      let key = 0
      this.counselorInfo = data.map(item => {
        let obj = {
          name: item.adviserName,
          price: item.changePrice,
          remark: item.remark,
          id: item.adviserId
        }
        obj.key = ++this.counselorkey
        return obj
      })
    }
  }
}
</script>
<style lang="less" scoped>
.belongs-teacher {
  // display: flex;
  // flex-flow: row nowrap;
  // align-items: center;
  .belongs-teacher-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  .teacher-info {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    margin-bottom: 10px;
    .teacher-form {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      margin: 0 10px;
    }
  }
}
</style>
