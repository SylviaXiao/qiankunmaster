<template lang="html">
  <div class="suspend-date">
    <a-modal v-if="isModal" :maskClosable="$store.state.modalMaskClickEnable"
      :width="800"
      title="签到记录"
      :visible="visible"
      :footer="null"
      @cancel="handleCancel">
      <a-card :bordered="false">
        <perm-box perm="student:signinlog:view" text="无权限访问">
          <reports ref="reports" reportsType="reports" :reportsTable="stuSignInLog" :reportsTitle="false"/>
        </perm-box>
      </a-card>
   </a-modal>
   <a-card v-else :bordered="false">
     <perm-box perm="student:signinlog:view" text="无权限访问">
       <reports :cusStyle="cusStyle" ref="reports" reportsType="reports" :reportsTable="stuSignInLog" :reportsTitle="false"/>
     </perm-box>
   </a-card>
  </div>
</template>

<script>
import PermBox from '@/components/PermBox'
import Reports from '@/components/Reports'
import { stuSignInLog } from '@/api/reports'
export default {
  components: {
    PermBox,
    Reports
  },
  props: {
    cusStyle: {
      type: String,
      default: ''
    },
    isModal: {
      type:Boolean,
      default: true
    },
    classId: String,
    danceplanId: String,
    type: String
  },
  data() {
    return {
      visible: false,
      searchParams: [
        {
          type:'month',
          key:'month',
          label:'月份',
          placeholder: '月份',
          format:"YYYY-MM"
        }
      ],
      stuSignInLog: () => {
        let propsPrams = {classId:this.classId, danceplanId:this.danceplanId, type:this.type}
        let params = Object.assign({}, propsPrams)
        return stuSignInLog(params)
      }
    }
  },
  watch: {
    danceplanId(nv,ov) {
      if(ov) {
        if (this.$refs.reports) {
          this.$refs.reports.refresh()
        }

      }
    }
  },
  methods: {
    refresh() {
      this.$refs.reports.refresh()
    },
    open() {
      this.visible = true
    },
    handleCancel() {
      this.visible = false
    }
  }
}
</script>

<style lang="less" scoped>
.suspend-date {

}
</style>
