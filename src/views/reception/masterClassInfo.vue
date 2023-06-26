<template>
  <div class="master-class-info">
    <a-card :bordered="false" title="班级信息">
      <MasterClassInfoBase :classInfo="classInfo"></MasterClassInfoBase>
    </a-card>
    <a-card :bordered="false" style="margin-top: 15px;">
      <div class="tab-wrapper">
        <a-tabs defaultActiveKey="1">
          <a-tab-pane tab="学员收录" v-if="$tools.checkPerm('student:masterclass:view')" key="1" :forceRender="true">
            <MasterClassInfoStu :masterClassId="classId" ref="masterClassInfoStu"></MasterClassInfoStu>
          </a-tab-pane>
          <a-tab-pane
            tab="支出记录"
            v-if="$tools.checkPerm('education:masterclassspending:view')"
            :key="$tools.checkPerm('student:masterclass:view')?'2':'1'"
            :forceRender="true"
          >
            <MasterClassInfoDetail :masterClassId="classId" ref="masterClassInfoDetail"></MasterClassInfoDetail>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card>
  </div>
</template>

<script>
import MasterClassInfoBase from './modules/MasterClassInfoBase'
import MasterClassInfoStu from './modules/MasterClassInfoStu'
import MasterClassInfoDetail from './modules/MasterClassInfoDetail'
import { getMasterClass } from '@/api/recep'
export default {
  components: {
    MasterClassInfoDetail,
    MasterClassInfoStu,
    MasterClassInfoBase
  },
  data() {
    return {
      classId: '',
      classInfo: null
    }
  },
  watch: {
    $route(nv) {
      if (nv.name === 'masterClassInfo') {
        this.init()
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.reset()
      this.classId = this.$route.params.classid
      this.getMasterClassFn()
      this.initMasterClassInfoStu()
      this.initMasterClassInfoDetail()
    },
    getMasterClassFn() {
      getMasterClass({ masterClassId: this.classId }).then(res => {
        this.classInfo = Object.assign({}, res.data.eduDance || {}, res.data.masterClass || {})
      })
    },
    initMasterClassInfoStu() {
      // stable 的刷新工作在组件内部进行
    },
    initMasterClassInfoDetail() {
      this.$nextTick(() => {
        if(this.$tools.checkPerm('education:masterclassspending:view')) {
          this.$refs.masterClassInfoDetail.refresh()
        }
      })
    },
    reset() {
      this.classId = ''
      this.classInfo = null
    }
  }
}
</script>

<style lang="less" scoped>
.master-class-info {
}
</style>
