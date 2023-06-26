<template>
  <div class="user-sign-wrapper">
    <a-card :bordered="false" :style="{ margin: '20px 0' }">
      <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"></search-com-pro>
    </a-card>

    <a-card :bordered="false">
      <div class="mt10 mb20">
        <a-space :size="15">
          <a-button type="primary" @click="handleEdit()">批量修改</a-button>
        </a-space>
      </div>
      <a-table ref="table" :rowClassName="rowClassName" :columns="columns" :dataSource="dataSource" :rowKey="(record, index) => index" :pagination="false">
        <span slot="action" slot-scope="text, record">
          <a href="#" @click="handleEdit(record)">修改</a>
        </span>
      </a-table>
    </a-card>

    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :width="600"
      title="修改"
      :visible="visible"
      :confirmLoading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form-model ref="ruleForm" :model="form" :rules="rules">
        <a-form-model-item v-bind="defaultLayout" label="分馆" prop="schoolIds">
          <div v-if="!record">
            <a-tree-select
              :treeCheckable="true"
              treeNodeFilterProp="title"
              :maxTagCount="1"
              :allowClear="true"
              :multiple="true"
              :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
              :treeData="schoolList"
              :treeDefaultExpandAll="true"
              v-model="form.schoolIds"
              placeholder="请选择分馆"
            />
          </div>
          <div v-else>
            <a-input type="hidden" v-model="form.schoolIds" />
            {{record.deptName}}
          </div>
        </a-form-model-item>
        <a-form-model-item v-bind="defaultLayout" label="本月休息天数" prop="day">
          <a-input-number v-model="form.day" placeholder="请输入天数" :min="1" :precision="0" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
  import { SearchComPro, STable, PermBox } from '@/components'
  import { getSchoolList } from '@/api/education/card'
  import { listOrgDeptRestDay, saveDeptRestDay } from '@/api/recep'
  import moment from 'moment'

  const month = moment().startOf('month')
  const defaultLayout = {
    labelCol: { md: { span: 6 } },
    wrapperCol: { md: { span: 14 } }
  }

  export default {
    name: 'branchRestDay',
    components: {
      SearchComPro,
      STable,
      PermBox
    },
    data() {
      return {
        defaultLayout,
        searchParams: [
          {
            type: 'month',
            key: 'month',
            label: '选择时间',
            placeholder: '请选择时间',
            defaultVal: month,
            format: 'YYYY-MM'
          },
          {
            type: 'treeSelect',
            isShow: true,
            key: 'schoolIds',
            label: '选择分馆',
            placeholder: '请选择分馆',
            expandAll: true,
            mutiple: true,
            treeCheckable: true,
            selectFather: true,
            treeOps: {
              api: getSchoolList,
              label: 'deptName',
              value: 'id',
              children: 'children'
            }
          }
        ],
        queryParam: {},
        columns: [
          {
            title: '区域',
            dataIndex: 'areaName'
          },
          {
            title: '分馆',
            dataIndex: 'deptName'
          },
          {
            title: '休息日',
            dataIndex: 'deptRestDay'
          },
          {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: { customRender: 'action' }
          }
        ],
        dataSource: [],

        confirmLoading: false,
        visible: false,
        schoolList: [],
        rules: {
          schoolIds: [{ required: true, message: '请选择分馆', trigger: 'change' }],
          day: [{ required: true, message: '请输入天数', trigger: 'change' }]
        },
        form: {
          schoolIds: undefined,
          day: undefined
        },
        record: null
      }
    },
    created() {
      this.queryParam.month = new Date(month.format('YYYY-MM'))
      this.initTable()
      this.initSchoolList()
    },
    methods: {
      rowClassName(record, index) {
        if (index % 2 === 1) return 'ant-table-even'
      },
      searchSubmit(data) {
        this.queryParam = data
        if (data.month) {
          this.queryParam.month = new Date(data.month)
        } else {
          this.queryParam.month = new Date(month.format('YYYY-MM'))
        }
        this.initTable()
      },
      initSchoolList() {
        getSchoolList().then(res => {
          if (res.code === 200) {
            this.schoolList = this._handleTreeData(res.data)
          }
        })
      },
      _handleTreeData(data) {
        return data.map((item, index) => {
          let temObj = {
            title: item.deptName,
            value: item.id,
            key: item.id,
            deptType: item.deptType
          }
          if (item.children) {
            temObj.children = this._handleTreeData(item.children)
          }
          return temObj
        })
      },
      initTable() {
        let param = this.queryParam
        listOrgDeptRestDay(param).then(res => {
          if (res.code === 200) {
            this.dataSource = res.data
          }
        })
      },
      handleEdit(record) {
        this.visible = true
        if (record) {
          this.record = record
          this.form.schoolIds = this.record.schoolId
        } else {
          this.record = null
        }
      },
      handleCancel() {
        this.visible = false
        this.$refs.ruleForm.resetFields()
        this.form = {
          schoolIds: undefined,
          day: undefined
        }
      },
      handleOk() {
        const { schoolIds, day } = this.form
        let param = {
          month: this.queryParam.month,
          schoolIds: Array.isArray(schoolIds) ? schoolIds.join(',') : schoolIds,
          day
        }

        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            this.confirmLoading = true
            saveDeptRestDay(param)
              .then(res => {
                if (res.code === 200) {
                  this.$notification['success']({
                    message: '系统通知',
                    description: '修改成功'
                  })
                  this.handleCancel()
                  this.initTable()
                }
              })
              .finally(() => (this.confirmLoading = false))
          }
        })
      }
    }
  }
</script>

<style scoped lang="less">
</style>
