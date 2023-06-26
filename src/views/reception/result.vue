<template>
  <div class="result-wrapper">
    <a-card class="card" :bordered="false">
      <result v-if="stuInfo.quickApplayShow" type="success" title="快速报名成功">
        <template slot="description">
          <span>您已为学员{{ stuInfo.stuName || '' }}提交成功,请继续完善信息</span>
        </template>
        <template slot="action">
          <span class="btn-group">
            <a-button type="primary" style="margin-left: 8px" @click="completeInfoHandle">继续完善信息</a-button>
            <a-button v-if="stuInfo.price && stuInfo.price != '0'" style="margin-left: 8px" @click="printBills()">打印单据</a-button>
          </span>
        </template>
      </result>
      <result v-else type="success" title="提交成功">
        <template slot="description">
          <span>您已为学员{{ stuInfo.stuName || '' }}提交成功!</span>
        </template>
        <template slot="action">
          <span class="btn-group">
            <span>
<!--              v-if="!stuInfo.isPayment && !stuInfo.previous"-->
              <perm-box perm="student:info:period" >
                <a-button type="primary" @click="routerChange('studentInfo')">学员详情</a-button>
<!--                <a-button type="primary" @click="routerChange('studentList')">学员列表</a-button>-->
              </perm-box>
<!--              v-else-->
              <perm-box perm="student:card:view" >
                <a-button style="margin-left: 8px" type="primary" @click="routerChange('stuCardsList')">学员卡列表</a-button>
              </perm-box>
            </span>
            <span v-if="!stuInfo.showBtn">
              <a-button style="margin-left: 8px" v-if="!stuInfo.isPayment && !stuInfo.previous" @click="routerChange('stuApplyForm')">报名新学员</a-button>
              <a-button style="margin-left: 8px" v-if="stuInfo.previous" @click="routerChange('previousStuForm')">继续录入老学员</a-button></span
            >
            <a-button v-if="stuInfo.price && stuInfo.price !== '0'" style="margin-left: 8px" @click="printBills()">打印单据</a-button>
          </span>
        </template>
      </result>
      <print-bills :stuInfo="stuInfo" ref="printBills"></print-bills>
    </a-card>
    <CertLink :studentId="this.stuInfo.stuId"></CertLink>
  </div>
</template>

<script>
import { Result, PrintBills, PermBox } from '@/components'
import CertLink from "@/views/reception/CertLink"
export default {
  name: 'stuApplyResult',
  components: {
    Result,
    PrintBills,
    PermBox,
    CertLink
  },
  data() {
    return {
      percent: 100,
    }
  },
  computed: {
    stuInfo() {
      const {
        $route,
        $route: { params: stuInfo }
      } = this
      if (stuInfo) {
        return JSON.parse(stuInfo.stuInfo)
      }
    }
  },
  created() {

  },
  methods: {

    completeInfoHandle() {
      this.$router.push({ path: '/reception/stuApply', query: { stuId: this.stuInfo.stuPhone } })
    },
    routerChange(router) {
      const { pageChange } = this
      pageChange(router).then(fullPath => this.$multiTab.close(fullPath))
    },
    pageChange(router) {
      return new Promise((resolve, reject) => {
        const {
          $route: { fullPath }
        } = this
        if(router==='studentInfo'){
          this.$router.push({
            name: 'studentInfo',
            params: {
              id: this.stuInfo.stuId
            }
          })
        }else{
          this.$router.push({ name: router })
        }
        resolve(fullPath)
      })
    },
    printBills() {
      //this.todayDateTime = this.$tools.tailor.getDateTime(new Date())
      this.$refs.printBills.printer()
    }
  }
}
</script>

<style scoped lang="less">
.bills {
  background-color: #cccccc;

  .bills-print-wrapper {
    background-color: #fff;

    margin: 0 auto;
  }
}
</style>
