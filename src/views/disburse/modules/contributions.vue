<template>
  <div class="belongs-teacher">
    <div class="belongs-teacher-header" style="height: 40px">
      <div></div>
      <a-button type="dashed" @click="addCounselorHandle"> <a-icon type="plus-circle" />分摊 </a-button>
    </div>
    <div>
      <div class="teacher-info" v-for="(item, index) in counselorInfo" :key="index">
        <span class="teacher-form">
          <span style="margin-right: 10px;">分摊月份</span>
          <a-month-picker :disabledDate="disabledDate" v-model="item.startDate" @change="changeDate(item.startDate, index, 'startDate')" /> ~
          <a-month-picker :disabledDate="disabledDate" v-model="item.endDate" @change="changeDate(item.endDate, index, 'endDate')" />
        </span>
        <span class="teacher-form">
          <span style="min-width:100px;margin-right: 10px;">分摊部门/分馆</span>
          <!-- <a-tree-select
              @change="changeDept(item.deptId,index)"
              style="min-width:180px;"
              v-model="item.deptId"
              :allowClear="true"
              :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
              :treeData="schoolList"
              treeDefaultExpandAll
            /> -->
          <!--  -->
          <a-cascader
            @change="changeDept(item.deptId, index)"
            v-if="schoolList"
            style="width:100%;"
            :options="schoolList"
            :showSearch="true"
            :fieldNames="{ label: 'name', value: 'id', children: 'children' }"
            changeOnSelect
            v-model="item.deptId"
            placeholder="请选择提交部门/分馆"
          />
        </span>
        <span class="teacher-form">
          <span style="margin-right: 10px;">分摊金额</span>
          <a-input-number v-model="item.price" style="width:100px" @blur="changesplitRatio(item.price, index)" :min="negative ? NaN : 0" />
        </span>
        <span>
          <a href="javascript:;" @click="deleteCounselorHandle(item)">删除</a>
        </span>
        <!-- v-if="counselorInfo.length > 1" -->
      </div>
    </div>
  </div>
</template>

<script>
import { listOrgDept } from '@/api/education/card'
import moment from 'moment'
export default {
  data() {
    return {
      deptId: [],
      counselorInfo: [
        {
          key: 0,
          price: null,
          deptId: [],
          startDate: moment(new Date()).format('YYYY-MM'),
          endDate: moment(new Date()).format('YYYY-MM')
        }
      ],
      counselorkey: 0,
      id: null,
      schoolList: null,
      maxNum: null,
      DateIndex: null,
      data: []
    }
  },
  props: {
    negative: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this.loadSchoolId()
  },
  watch: {
    counselorInfo: {
      deep: true,
      handler(val) {
        // this.loadSchoolId()
      }
    }
    // schoolId(nv) {
    //   this.counselorInfo[0].deptId = nv
    // }
  },
  computed: {
    maxPrice() {
      let total = this.counselorInfo.map(item => item.price).reduce((a, b) => a + b)
      return Number(total.toFixed(2))
    }
  },
  methods: {
    disabledDate(current) {
      let date = new Date()
      let obj = moment(current).format('YYYY-MM-DD')
      let start = moment(date)
        .startOf('month')
        .format('YYYY-MM-DD')
      if (this.$store.getters.userInfo?.account?.id == 'admin') {
        return start > obj && start < obj
      }
      return start > obj
    },
    // 数组扁平化处理
    flatten(arr) {
      arr.forEach(item => {
        this.data.push({
          title: item.name,
          value: item.id,
          key: item.key
        })
        if (item.children) {
          this.flatten(item.children)
        }
      })
    },
    changeDept(val, index) {
      this.flatten(this.schoolList)
      let arr = this.data
      // let deptName = ''
      let deptName = this.counselorInfo[index].deptName
      deptName = []
      val.forEach(item => {
        deptName += arr.find(todo => item === todo.value).title + '/'
      })
      this.counselorInfo[index].deptName = deptName.substr(0, deptName.length - 1)
    },
    //改变后
    changeDate(date, index, type) {
      console.log(555, date, index, type)
      let obj = this.counselorInfo[index]
      obj[type] = this.$tools.tailor.getMonth(date)
      if (obj.startDate && obj.endDate) {
        let sYear = Number(obj.startDate.split('-')[0])
        let sTime = Number(obj.startDate.split('-')[1])
        let eYear = Number(obj.endDate.split('-')[0])
        let eTime = Number(obj.endDate.split('-')[1])
        if (sYear > eYear || (sYear === eYear && sTime > eTime)) {
          obj[type] = null
          return this.$notification['error']({
            message: '系统通知',
            description: '结束时间不得早于开始时间'
          })
        }
      }
    },
    // getDeptId(val) {
    //   this.counselorInfo[0].deptId = val
    // },
    changesplitRatio(val, index) {
      // let arr = this.counselorInfo.map(item => {
      //   return item.splitRatio
      // })
      if (this.maxPrice > this.maxNum) {
        this.counselorInfo[index].price = Number((this.maxNum - (this.maxPrice - val)).toFixed(2))
        this.$notification['error']({
          message: '系统通知',
          description: '分摊金额不得超过总打款金额'
        })
      }
      // arr.forEach((item, index) => {
      //   if (this.maxNum >= Number(item)) {
      //     this.maxNum = this.maxNum - Number(item)
      //   } else {
      //     this.counselorInfo[index].splitRatio = this.maxNum
      //     this.$notification['error']({
      //       message: '系统通知',
      //       description: '总分摊比不得超过100%'
      //     })
      //   }
      // })
    },
    //获取分馆数据
    loadSchoolId() {
      //请求接口
      listOrgDept().then(res => {
        if (res.code === 200 && res.data) {
          this.schoolList = res.data
        }
      })
    },
    //处理分馆数据
    _handleData(data) {
      return data.map((item, index) => {
        let itemObj = {}
        itemObj.title = item.deptName
        itemObj.value = item.id
        itemObj.key = item.id
        if (item.children) {
          itemObj.children = this._handleData(item.children)
          itemObj.selectable = true
        }
        return itemObj
      })
    },
    //清空
    clear() {
      this.counselorInfo = [
        {
          key: 0,
          price: null,
          deptId: [],
          deptName: null,
          startDate: moment(new Date()).format('YYYY-MM'),
          endDate: moment(new Date()).format('YYYY-MM')
        }
      ]
      this.id = null
    },
    addCounselorHandle() {
      let temObj = {
        key: 0,
        price: null,
        deptId: [],
        startDate: moment(new Date()).format('YYYY-MM'),
        endDate: moment(new Date()).format('YYYY-MM')
        // maxNum:
      }
      temObj.key = ++this.counselorkey
      this.counselorInfo.push(temObj)
    },
    deleteCounselorHandle(record) {
      this.counselorInfo = this.counselorInfo.filter(item => item.key !== record.key)
    },

    backData(record) {
      listOrgDept().then(res => {
        if (res.code === 200 && res.data) {
          this.schoolList = res.data
          if (record.spendingSplits.length) {
            this.counselorInfo = record.spendingSplits
            this.counselorkey = record.spendingSplits.length - 1
          }
          this.id = record.id
          this.maxNum = record.price
        }
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
      /deep/ .ant-calendar-picker {
        width: 120px;
      }
    }
  }
}
</style>
