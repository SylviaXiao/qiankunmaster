<template>
  <div class="belongs-teacher">
    <div class="belongs-teacher-header" style="height: 40px">
      <div></div>
      <a-button type="dashed" @click="addCounselorHandle"> <a-icon type="plus-circle" />分摊 </a-button>
    </div>
    <div>
      <div class="teacher-info" v-for="(item, index) in counselorInfo" :key="index">
        <span class="teacher-form">
          <span style="min-width:30px;margin-right: 10px;">舞种</span>
          <a-select
            v-model='item.danceId'
            placeholder="请选择舞种"
            style="width:200px;"
            :default-active-first-option="false"
            :show-arrow="false"
            :filter-option="false"
            :not-found-content="null"
            :allowClear="true"
            @change='danceChange(item.danceId,index)'
          >
              <a-select-option v-for="d in danceList" :key="d.id" :value="d.id">
                {{ d.name }}
              </a-select-option>
          </a-select>
        </span>
        <span class="teacher-form" >
          <span style="min-width:50px;margin-right: 10px;">班型</span>
          <a-cascader
            @change="changeDept(item.eduTypeId, index)"
            v-if="eduTypeList"
            style="width:300px;"
            :options="eduTypeList"
            :showSearch="true"
            :fieldNames="{ label: 'name', value: 'id', children: 'children' }"
            v-model="item.eduTypeId"
            placeholder="请选择班型"
          />
        </span>
        <span class="teacher-form">
          <span style="margin-right: 10px;">金额</span>
          <a-input-number v-model="item.price" style="width:100px" @blur="changesplitRatio(item.price, index)" />
        </span>
        <span>
          <a href="javascript:;" @click="deleteCounselorHandle(item)">删除</a>
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import { treeEduClassType , listEduDance } from '@/api/common.js'
import moment from 'moment'
export default {
  data() {
    return {
      counselorInfo: [
        {
          key: 0,
          price: null,
          danceId: '',
          eduTypeId: [],
          eduTypeClassId: ''
        }
      ],
      counselorkey: 0,
      id: null,
      schoolList: null,
      maxNum: null,
      DateIndex: null,
      data: [],
      eduTypeList:[],
      eduTypeClassList:[],
      danceList:[],
    }
  },
  props: {
    negative: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this.init()
  },
  watch: {
    counselorInfo: {
      deep: true,
      handler(val) {}
    }
  },
  computed: {
    maxPrice() {
      let total = this.counselorInfo.map(item => item.price || 0).reduce((a, b) => a + b)
      return Number(total.toFixed(2))
    }, //审批中分摊月份选择
    splitMonthSelect() {
      // return true
      return this.getFormData('splitMonthSelect')
    }
  },
  methods: {
    // 数组扁平化处理
    flatten(arr) {
      arr.forEach(item => {
        this.eduTypeClassList.push({
          name: item.name,
          id: item.id
        })
        if (item.children) {
          this.flatten(item.children)
        }
      })
    },
    getData(){
      let counselorInfo = JSON.parse(JSON.stringify((this.counselorInfo)))
      let data = counselorInfo.map(item=> {
        return {
        key:item.key,
        price:item.price,
        danceId:item.danceId,
        eduTypeId:item.eduTypeId[0],
        eduTypeClassId: item.eduTypeId[1],
        danceName:item.danceName,
        eduTypeName:item.eduTypeName,
        eduTypeClassName:item.eduTypeClassName
      }})
      return data
    },
    danceChange(e,index){
      this.counselorInfo[index].danceName=this.danceList.filter(item=>item.id===e)[0]?.name
    },
    changeDept(e,index){
      let id = this.counselorInfo[index].eduTypeId
      this.counselorInfo[index].eduTypeName=this.eduTypeClassList.filter(item=>item.id===id[0])[0]?.name
      this.counselorInfo[index].eduTypeClassName=this.eduTypeClassList.filter(item=>item.id===id[1])[0]?.name
    },
   async init(){
     treeEduClassType().then(res => {
        if (res.code === 200 && res.data) {
          this.eduTypeList = res.data || []
          this.flatten(res.data)
        }
      })
     listEduDance().then(res => {
       if (res.code === 200 && res.data) {
         this.danceList = res.data || []
       }
     })
    },
    getFormData(flag) {
      var root = this.$parent
      while (root) {
        if (flag in root) {
          return root[flag]
        }
        root = root.$parent
      }
    },
    disabledDate(current) {
      let date = new Date()
      let obj = moment(current).format('YYYY-MM-DD')
      let start = moment(date)
        .startOf('month')
        .format('YYYY-MM-DD')
      if (this.splitMonthSelect == 'B') {
        start = moment(new Date())
          .subtract(1, 'months')
          .startOf('month')
          .format('YYYY-MM-DD')
      }
      if (this.$store.getters.userInfo?.account?.id === 'admin' || this.splitMonthSelect === 'C') {
        return start > obj && start < obj
      }
      return start > obj
    },
    changesplitRatio(val, index) {
      if (this.maxPrice > this.maxNum) {
        this.counselorInfo[index].price = Number((this.maxNum - (this.maxPrice - val)).toFixed(2))
        this.$notification['error']({
          message: '系统通知',
          description: '分摊金额不得超过总打款金额'
        })
      }
    },
    // 清空
    clear() {
      this.counselorInfo = [
        {
          key: 0,
          price: null,
          danceId:'',
          eduTypeId: [],
          eduTypeClassId: ''
        }
      ]
      this.id = null
    },
    addCounselorHandle() {
      let temObj = {
        key: 0,
        price: null,
        danceId: '',
        eduTypeId: [],
        eduTypeClassId: ''
      }
      temObj.key = ++this.counselorkey
      this.counselorInfo.push(temObj)
    },
    deleteCounselorHandle(record) {
      this.counselorInfo = this.counselorInfo.filter(item => item.key !== record.key)
    },
    backData(record) {
      const backData = () => {
        if (record.spendingSplits && record.spendingSplits.length) {
          this.counselorInfo = record.spendingSplits.map(item=>{
            return {
              key:item.key,
              price:item.price,
              danceId:item.danceId,
              eduTypeId:[item.eduTypeId,item.eduTypeClassId],
              eduTypeClassId: '',
              danceName:item.danceName,
              eduTypeName:item.eduTypeName,
              eduTypeClassName:item.eduTypeClassName
            }
          })
          this.counselorkey = record.spendingSplits.length - 1
        }
        this.maxNum = record.price
      }
        backData()
    }
  }
}
</script>
<style lang="less" scoped>
.belongs-teacher {
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
