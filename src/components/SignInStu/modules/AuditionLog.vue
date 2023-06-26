<template>
  <div class="auditionlog-wrapper">
    <edit-table
      :columnsOptions="audioColumns"
      :tableArr="auditionLogList"
      :eidtParams="eidtParams"
      ref="editTable"
      usertype="all"
      @saved="saveAuditionLog"
      @delete="deleteAuditionLog"
    >
      <span slot="customActive" slot-scope="{ record }">
        <a href="javascript:;" @click="qrcodeHandle(record)">试课学生二维码</a>
        <a href="javascript:;" style="margin-left:12px" v-if="record.signState !== 'Y'" @click="signAudiHandle(record)">签到</a>
        <a href="javascript:;" style="margin-left:12px" v-if="record.signState === 'Y'" @click="signAudiHandle(record)">取消签到</a>
        <a href="javascript:;" style="margin-left:12px" v-if="$tools.checkPerm('student:auditionlog:update')" @click="changeAuditionClass(record)">更换班级</a>
      </span>
    </edit-table>
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :destroyOnClose="true"
      :width="400"
      title="体验试课学生二维码"
      :footer="null"
      @cancel="qrcodeCancel"
      v-model="qrcodeVisible"
    >
      <div class="image_wrapper">
        <img :src="qrcodeUrl" style="width: 350px" />
      </div>
    </a-modal>
    <!-- 修改试课班级 -->
    <ChangeAuditionClass ref="changeAuditionClass" @confirm="changeAuditionClassConfirm" />
  </div>
</template>

<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import EditTable from '@/components/EditTable'
import ChangeAuditionClass from '@/components/ChangeAuditionClass'
import { dancePlanAuditionLog, saveAuditionLog, removeAuditionLog, signAuditionLog, removeSignAuditionLog, deleteSignAuditionLog } from '@/api/student'

const audioColumns = [
  {
    title: '姓名',
    width: 200,
    dataIndex: 'name',
    input: 'input',
    scopedSlots: { customRender: 'name' }
  },
  {
    title: '手机号码',
    width: 200,
    dataIndex: 'phone',
    input: 'input',
    scopedSlots: { customRender: 'phone' }
  },
  {
    title: '状态',
    dataIndex: 'signState',
    customRender: (text, record) => {
      return text === 'Y' ? '已签到' : ''
    }
  },

  {
    title: '备注',
    dataIndex: 'logRemark',
    input: 'input',
    scopedSlots: { customRender: 'logRemark' }
  },
  {
    title: '顾问',
    width: 200,
    dataIndex: 'adviser',
    input: 'adviser'
  }
]

export default {
  name: 'AuditionLog',
  components: {
    EditTable,
    ChangeAuditionClass
  },
  props: {
    dancePlanId: { type: String, default: null }
  },
  data() {
    return {
      qrcodeVisible: false,
      qrcodeUrl: null,

      audioColumns,
      auditionLogList: [],
      eidtParams: {
        name: null,
        phone: null,
        logRemark: null
      }
    }
  },
  created() {
    this.getAuditionLog()
  },
  methods: {
    //学员二维码
    qrcodeHandle(record) {
      const token = Vue.ls.get(ACCESS_TOKEN)
      this.qrcodeUrl = process.env.VUE_APP_URL + '/student/auditionlog/qrcodeAuditionLog/' + record.id + '?auth_token=' + token
      this.qrcodeVisible = true
    },
    qrcodeCancel() {
      this.qrcodeVisible = false
    },
    refreshList(res) {
      this.$notification['success']({
        message: '系统通知',
        description: res.msg || '操作成功'
      })
      this.getAuditionLog()
    },
    //试课签到
    signAudiHandle(record) {
      let _this = this
      let params = {
        auditionLogId: record.id
      }
      this.$confirm({
        title: '系统提示',
        content: '是否确定?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          _this.$nextTick().then(() => {
            signAuditionLog(params).then(res => {
              const { data } = res
              if (data) {
                _this.removeSignInLogCompletely(record)
              } else {
                _this.refreshList(res)
              }
            })
          })
        }
      })
    },
    // 取消学员和导师的签到
    removeSignInLogCompletely(record) {
      const { id } = record
      this.$confirm({
        title: '系统提示',
        content: '取消当前签到记录会同步取消该节课导师的签到记录，是否确认取消？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          const params = {
            auditionLogId: id
          }
          removeSignAuditionLog(params).then(res => {
            this.refreshList(res)
          })
        }
      })
    },
    //线上试课记录
    getAuditionLog() {
      const { dancePlanId } = this
      this.$nextTick(() => {
        this.$refs.editTable.cancelTableItem()
        dancePlanAuditionLog({ dancePlanId }).then(res => {
          this.auditionLogList = res.data
        })
      })
    },
    saveAuditionLog(item) {
      if(!item.adviser||!item.name||!item.phone){
        this.$notification['error']({
          message: '系统通知',
          description: '姓名、手机号、顾问必填'
        })
        return
      }
      const { dancePlanId } = this
      saveAuditionLog(Object.assign({ dancePlanId }, item)).then(res => {
        this.$notification['success']({
          message: '系统通知',
          description: '操作成功'
        })
        this.getAuditionLog()
        this.$refs.editTable.cancelTableItem()
      })
    },
    refreshListWhenDelete() {
      this.getAuditionLog()
      this.$refs.editTable.cancelTableItem()
    },
    deleteAuditionLog(record) {
      const { id } = record
      const _this = this
      this.$confirm({
        title: '系统提示',
        content: '确认删除该条数据吗?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          removeAuditionLog({ auditionLogId: id }).then(res => {
            const { data } = res
              if (data) {
                _this.deleteSignInLogCompletely(record)
              } else {
                _this.refreshListWhenDelete()
              }
          })
        }
      })
    },
    // 取消学员和导师的签到（删除试课时）
    deleteSignInLogCompletely(record) {
      const { id } = record
      this.$confirm({
        title: '系统提示',
        content: '取消当前签到记录会同步取消该节课导师的签到记录，是否确认取消？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          const params = {
            auditionLogId: id
          }
          deleteSignAuditionLog(params).then(res => {
            this.refreshListWhenDelete(res)
          })
        }
      })
    },
    // 修改试课班级
    changeAuditionClass(record) {
      const { dancePlanId } = this
      const { id: auditionId, name: className } = record
      this.$refs.changeAuditionClass.open({ auditionId, dancePlanId, className })
    },
    changeAuditionClassConfirm(res) {
      if (res.code == 200) {
        this.$refs.changeAuditionClass.close()
        this.getAuditionLog()
      }
    }
  }
}
</script>

<style scoped></style>
