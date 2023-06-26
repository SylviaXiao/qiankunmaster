<template>
  <div class="belongs-teacher">
    <div class="belongs-teacher-header" style="height: 40px">
      <div></div>
      <a-button type="dashed" @click="addCounselorHandle"> <a-icon type="plus-circle" />分摊 </a-button>
    </div>
    <div>
      <div class="teacher-info" v-for="(item, index) in counselorInfo" :key="index">
        <span class="teacher-form">
          <span style="white-space: nowrap; margin-right: 10px;">选择分馆</span>
          <a-tree-select
            style="min-width:120px;"
            v-model="item.deptId"
            :allowClear="true"
            :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
            :treeData="schoolList"
            treeDefaultExpandAll
          />
        </span>
        <span class="teacher-form">
          <span style="white-space: nowrap; margin-right: 10px;">分摊比例</span>
          <a-input v-model="item.splitRatio" style="width:100px" addon-after="%" @blur="changesplitRatio(item.splitRatio, index)" />
        </span>
        <span>
          <a v-if="counselorInfo.length > 1" href="javascript:;" @click="deleteCounselorHandle(item)">删除</a>
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import { ratioEduPersonalClass } from '@/api/reception/transferCard'
import { getSchoolList } from '@/api/education/card'
import { uniqWith } from 'lodash'
export default {
  props: {
    schoolId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      counselorInfo: [
        {
          key: 0,
          splitRatio: 100,
          deptId: null
        }
      ],
      counselorkey: 0,
      id: null,
      schoolList: null,
      // num: 100,
      maxNum: 100
    }
  },
  mounted() {
    this.loadSchoolId()
  },
  // watch :{
  //   schoolId(nv) {
  //     this.counselorInfo[0].deptId = nv
  //   }
  // },
  // computed: {
  //   maxNum () {
  //    let arr = this.counselorInfo.map(item => {return item.splitRatio })
  //    let num = 100
  //    arr.forEach((item,index)=>{
  //     //  if(num >= Number(item)) {
  //        num = num - item
  //     //  }

  //    })
  //    console.log(num)
  //    return num
  //   }
  // },
  methods: {
    getDeptId(val) {
      this.counselorInfo[0].deptId = val
    },
    changesplitRatio(val, index) {
      let reg = /^[1-9]\d*|0$/
      if (!reg.test(val)) {
        this.$notification['error']({
          message: '系统通知',
          description: '分摊比例必须为正整数'
        })
        return (this.counselorInfo[index].splitRatio = 0)
      }
      let arr = this.counselorInfo.map(item => {
        return item.splitRatio
      })
      this.maxNum = 100
      arr.forEach((item, index) => {
        if (this.maxNum >= Number(item)) {
          this.maxNum = this.maxNum - Number(item)
        } else {
          this.counselorInfo[index].splitRatio = this.maxNum
          this.$notification['error']({
            message: '系统通知',
            description: '总分摊比不得超过100%'
          })
        }
      })
    },
    //获取分馆数据
    loadSchoolId() {
      //请求接口
      getSchoolList().then(res => {
        if (res.code === 200 && res.data) {
          console.log(res.data)
          this.schoolList = this._handleData(res.data)
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
          itemObj.selectable = false
        }
        return itemObj
      })
    },
    //清空
    clear() {
      this.counselorInfo = [
        {
          key: 0,
          splitRatio: 100,
          deptId: null
        }
      ]
      console.log(this.counselorInfo)
      this.id = null
    },
    addCounselorHandle() {
      // if(this.num ===0) {
      //   return this.$notification['error']({
      //         message: '系统通知',
      //         description: '已没有多余的分摊比例'
      //       })
      // }
      let temObj = {
        key: 0,
        splitRatio: 0,
        deptId: null
        // maxNum:
      }
      temObj.key = ++this.counselorkey
      this.counselorInfo.push(temObj)
    },
    deleteCounselorHandle(record) {
      this.counselorInfo = this.counselorInfo.filter(item => item.key !== record.key)
    },
    validate() {
      let msg = ''
      let num = this.$number(0)
      this.counselorInfo.forEach(item => {
        if (!item.splitRatio) msg = '分摊不能为0'
        if (!item.deptId) msg = '请选择分摊分馆'
        num = num.plus(item.splitRatio)
      })
      if (num.toNumber() != 100) {
        msg = '总分摊比例必须等于100'
      }
      if (this.counselorInfo.length != uniqWith(this.counselorInfo, (val1, val2) => val1.deptId === val2.deptId).length) {
        msg = '不允许提交相同的分摊分馆'
      }
      return msg
    },
    save() {
      const msg = this.validate()
      if (msg) {
        return this.$notification['error']({
          message: '系统通知',
          description: msg
        })
      }

      ratioEduPersonalClass({
        classId: this.id,
        deptSplits: JSON.stringify(this.counselorInfo)
      }).then(res => {
        if (res.code == 200) {
          this.$notification['success']({
            message: '系统通知',
            description: '操作成功'
          })
          this.$emit('closeAchiModal', res)
        }
      })
    },
    save2() {
      const msg = this.validate()
      if (msg) {
        return this.$notification['error']({
          message: '系统通知',
          description: msg
        })
      }

      return ratioEduPersonalClass({
        classId: this.id,
        deptSplits: JSON.stringify(this.counselorInfo)
      })
    },
    backData(data) {
      let key = 0
      this.counselorInfo = data.map(item => {
        let obj = {
          deptId: item.deptId,
          splitRatio: item.splitRatio
        }
        obj.key = ++this.counselorkey
        return obj
      })
      console.log(this.counselorInfo)
    }
  }
}
</script>
<style lang="less" scoped>
.belongs-teacher {
  // display: flex;
  // flex-flow: row nowrap;
  // align-items: center;
  // overflow-x: scroll;
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
      /*flex-flow: row nowrap;*/
      /*flex-wrap: wrap;*/
      align-items: center;
      margin: 0 10px 0 0;
    }
  }
}
</style>
