<template>
  <div class="test-address-wrapper">
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :width="600"
      :dialog-style="{ top: '290px' }"
      title="学员档案"
      :visible="visibleAddEdit"
      :confirmLoading="confirmAddEditLoading"
      :footer="false"
      @cancel="handleAddEditCancel"
    >
      <div>
        <h3>请将下方链接复制后发送给学员填写相关信息</h3>
        <p style="color:#ccc;">若连接丢失可在学员详情的操作栏再次复制</p>
        <a-row style="line-height:30px;" class="mt20" >
          <a-col :span="4"> <div style="text-align: right;" class="mr20">链接</div></a-col>
          <a-col :span="20">
            {{ link }}{{studentId}}
            <a href="javascript:;" class="ml20" @click="copy()">复制</a>
<!--            <span></span>-->
          </a-col>
        </a-row>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { getStudentInfoById } from "@/api/common"

export default {
  props: {
    studentId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      visibleAddEdit: false,
      confirmAddEditLoading: false,
      link: ''
    }
  },
  watch: {
    $route(nv, ov) {
      console.log(888888,nv, ov)
      if(nv.name ==='stuApplyResult'){
        this.init()
      }
    }
  },
  components: {},
  created() {
    this.init()
  },
  methods: {
    init(){
      getStudentInfoById(this.studentId).then(res=>{
        if(res.data){
          this.visibleAddEdit=false
        } else{
          this.visibleAddEdit=true
          this.initLink()
        }
      })
    },
    copy(record) {
      let url = this.link +this.studentId
      this.$copyText(url)
        .then(message => {
          this.$message.success('复制完毕')
        })
        .catch(err => {
          this.$message.error('复制失败')
        })
      console.log(888888888)
    },
    openModal() {
      this.link = ''
      this.visibleAddEdit = true
    },
    handleAddEditCancel(){      this.visibleAddEdit = false},
    initLink() {
      this.link = window.location.origin + `/user/studentRecordApply/`
    },
    refreshTable() {
      this.$emit('refresh')
    }
  }
}
</script>

<style scoped lang="less">
.test-address-wrapper {
}
:global {
  .dynamic-add {
    .ant-form-item {
      margin-bottom: 0;
    }
  }
}
</style>
