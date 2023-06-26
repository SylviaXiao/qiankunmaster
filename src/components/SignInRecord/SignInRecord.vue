<template>
  <div>
    <a-modal
      class="signin-record-wrapper"
      :width="1200"
      :maskClosable="$store.state.modalMaskClickEnable"
      title="签到记录" :visible="visibleTree"
      @cancel="handleTreeCancel"
      :footer="null">
      <a-form :form="form">
        <a-row>
          <a-col :span="8">
            <a-form-item label="选择日期" v-bind="formItemLayout2">
              <a-range-picker
                v-decorator="[ 'date']"
                style="width: 100%;"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-button class="button-search" @click="search">查询</a-button>
            <a-button :style="{marginLeft:'10px'}" class="button-search" @click="resetSearch">重置</a-button>
          </a-col>
        </a-row>
      </a-form>
      <a-row>
        <a-col :span="4">
          <div style="border-bottom: 1px solid #eaeaea;border-top: 1px solid #eaeaea;margin-right: 10px">
            <a-menu
              mode="inline"
              theme="light">
              <a-menu-item v-for="(item,index) in classNameList" style='position: relative;' :key="item.id" @click="classNameClick(item)">
                {{item.className}}
              </a-menu-item>
            </a-menu>
          </div>
        </a-col>
        <a-col :span="20">
          <s-table
            ref="table"
            size="default"
            :columns="columnsSelect"
            :rowKey="record => record.id"
            :data="loadData"
            :loading="loading">
            <span slot="updateDate" slot-scope="text, record">
                {{ $tools.tailor.getDate(text) }}
            </span>
            <span slot="teachers" slot-scope="text, record" style="display: flex;flex-flow: nowrap row;align-items: center;">
              <span v-for="(item,idx) in record.teachers">
                <span v-if="idx!=0"> ， </span>
                <span>
                  <span>
                    {{item.signName}}
                  </span>
                </span>
              </span>
            </span>
            <span slot="planStartDate" slot-scope="text, record" style="display: flex;flex-flow: nowrap row;align-items: center;">
                {{planStartDateFormat(record)}}
            </span>
            <span slot="action" slot-scope="text, record">
              <perm-box perm="student:signinlog:del">
                <a href="javascript:;" @click="cancalSignin(record)">取消签到</a>
              </perm-box>
              <perm-box perm="student:auditionlog:view" v-if="cardInfo.experience">
                <a href="javascript:;" @click="auditionSave(record)">添加试课</a>
              </perm-box>
            </span>
          </s-table>
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>
<script>
  import { filterEmptyObject } from '@/utils/util'
  import {
    listSignInClass
  } from '@/api/recep'
  import { SearchCom } from '@/components'
  import PermBox from '@/components/PermBox'
  import STable from '@/components/Table'
  import {
    pageSignInLogById
  } from '@/api/reception/student'
  import { saveTrialClass } from '@/api/student'
  import { deleteReplenishesPlan, removeSignInLog } from '@/api/education'

  const columnsSelect = [
    {
      title: '上课时间',
      dataIndex: 'planStartDate',
      key: 'planStartDate',
      scopedSlots: { customRender: 'planStartDate' }
    },
    {
      title: '签到时间',
      dataIndex: 'updateDate',
      key: 'updateDate',
      scopedSlots: { customRender: 'updateDate' }
    },
    {
      title: '班级名称',
      dataIndex: 'className',
      key: 'className',
      customRender: (text, record) => {
        return text + '[' + record.deptName + ']'
      }
    },
    {
      title: '类型',
      dataIndex: 'typeName',
      key: 'typeName'
    },
    {
      title: '学员名称',
      dataIndex: 'stuName',
      key: 'stuName'
    },
    {
      title: '卡号',
      dataIndex: 'stuCardNo',
      key: 'stuCardNo'
    },
    {
      title: '签到状态',
      dataIndex: 'state',
      key: 'state',
      customRender: (text, record) => {
        return text === 'Y' ? '已签到' : text === 'N' ? '取消签到' : ''
      }
    },
    {
      title: '签到计次',
      dataIndex: 'signCount',
      key: 'signCount'
    },
    {
      title: '签到导师',
      dataIndex: 'teachers',
      key: 'teachers',
      scopedSlots: { customRender: 'teachers' }
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      scopedSlots: { customRender: 'action' }
    },
  ]

  export default {
    props: {
      card: Object
    },
    watch: {
      record(nv) {
        this.cardInfo = nv
      }
    },
    data() {
      return {
        cardInfo: {},
        columnsSelect,
        // 搜索相关
        formItemLayout2: this.$tools.formItemLayout2,
        queryParam: {},
        // 沟通时间轴
        visibleTree: false,
        loading: false,
        record: null,
        loadData: parameter => {
          return pageSignInLogById(Object.assign(parameter, this.queryParam, this.params, { studentCardId: this.record.id })).then(res => {
            return res
          })
        },
        classNameList:[]
      }
    },
    components: {
      SearchCom,
      PermBox,
      STable
    },
    beforeCreate() {
      this.form = this.$form.createForm(this)
    },
    methods: {
      planStartDateFormat(record) {
        return this.$tools.tailor.getDateTimes(record.planStartDate) + '~' + this.$tools.tailor.getTime(record.planEndDate)
      },
      //沟通时间轴
      openSignInLog(record) {
        this.record = record
        const params = {
           studentCardId: record.id
        }
        listSignInClass(params).then(res => {
          this.classNameList = res.data || []
        })
        this.visibleTree = true
        this.$nextTick(() => {
          this.resetSearch()
        })
      },
      handleTreeCancel() {
        this.visibleTree = false
      },
      search() {
        this.form.validateFields().then(formData => {
          let timeParams = {
            startDate: formData.date && formData.date.length > 0 ? this.$tools.tailor.getDate(formData.date[0]) : null,
            endDate: formData.date && formData.date.length > 0 ? this.$tools.tailor.getDate(formData.date[1]) : null
          }
          this.queryParam = filterEmptyObject(timeParams)
          this._refreshTable()
        })
      },
      classNameClick(item) {
        this.queryParam = {
          classId: item.id
        }
        this._refreshTable()
      },
      resetSearch() {
        this.queryParam = {}
        this.form.resetFields()
        this._refreshTable()
      },
      _refreshTable() {
        if (this.$refs.table) {
          this.$refs.table.refresh()
        }
      },

      cancalSignin(record) {
        const { id } = record
        const _this = this
        this.$confirm({
          title: '系统提示',
          content: '确认取消该学员的签到吗?',
          okText: '确认',
          cancelText: '取消',
          onOk() {
            deleteReplenishesPlan(id)
              .then(res => {
                const { data } = res
                if (data) {
                  _this.removeSignInLogCompletely(record)
                } else {
                  _this._refreshTable()
                }
              })
          }
        })
      },
      // 取消学员和导师的签到
      removeSignInLogCompletely(record) {
        const { planId } = record
        this.$confirm({
          title: '系统提示',
          content: '取消当前签到记录会同步取消该节课导师的签到记录，是否确认取消？',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            removeSignInLog(planId).then(res => {
              this._refreshTable()
            })
          }
        })
      },

      // 添加试课
      auditionSave(record) {
        const { id } = record

        this.$confirm({
          title: '系统提示',
          content: '确认添加试课吗?',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            saveTrialClass({
              signId: id,
            }).then(res => {
              if (res.code === 200) {
                this._refreshTable()
                this.$notification['success']({
                  message: '系统通知',
                  description: '操作成功'
                })
                setTimeout(() => {
                  this.$router.push({ path: '/reception/finaAuditionDeduct' })
                }, 1000)
              }
            })
          }
        })
      }
    }
  }
</script>
<style scoped lang=less>
  @import '~@/assets/style/index';

  .signin-record-wrapper {
    .button-search {
      position: relative;
      top: 3px;
    }
  }
</style>
