<template>
  <div ref="elementAll">
    <a-card :bordered="false" style="margin: 20px 0 ;">
      <search-com-pro
        v-if="showSearch"
        :style="{ padding: '10px 0' }"
        :searchParams="searchParams"
        @searchSubmit="searchSubmit"
      />
    </a-card>
    <a-card :bordered="false">
      <div class="mb20">
        <perm-box perm="education:referenceValue:save">
          <a-button type="primary" icon="plus-circle" @click="handleEdit()">新增</a-button>
        </perm-box>
      </div>
      <a-table
        ref="table"
        bordered
        :columns="columns"
        :dataSource="dataSource"
        :loading="tableLoading"
        :rowKey="(record, index) => index"
        :pagination="false"
      >
        <span slot="action" slot-scope="text, record, index">
          <perm-box perm="education:referenceValue:update">
            <a @click="handleEdit(record)">编辑</a>
          </perm-box>
          <perm-box perm="education:referenceValue:delete">
            <a @click="handleDelete(record)">删除</a>
          </perm-box>
        </span>
      </a-table>
    </a-card>

    <a-modal
      title="参考值录入"
      :maskClosable="$store.state.modalMaskClickEnable"
      :width="600"
      :visible="editVisible"
      :confirmLoading="confirmLoading"
      @ok="handleEditOk"
      @cancel="handleEditCancel"
    >
      <a-form-model ref="ruleForm" :model="form" :rules="rules">
        <a-form-model-item v-bind="formItemLayout" label="地区" prop="areaId">
          <a-select v-model="form.areaId" placeholder="请选择地区" allowClear style="width:100%;">
            <a-select-option v-for="item in areaOptions" :value="item.value">{{item.string}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item v-bind="formItemLayout" label="舞种" prop="danceId">
          <a-select v-model="form.danceId" placeholder="请选择舞种" allowClear style="width:100%;">
            <a-select-option v-for="item in danceOptions" :value="item.value">{{item.string}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item v-bind="formItemLayout" label="班型" prop="classType">
          <a-cascader
            style="width:100%;"
            :options="classTypeOptions"
            :fieldNames="{ label: 'name', value: 'id', children: 'children' }"
            v-model="form.classType"
            placeholder="请选择班型"
          />
        </a-form-model-item>
        <a-form-model-item v-bind="formItemLayout" label="参考值" prop="referenceValue">
          <a-input-number v-model="form.referenceValue" placeholder="请输入数字" style="width:100%;" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
  import { STable, SearchComPro, PermBox } from '@/components'
  import { getSchoolList } from '@/api/education/card'
  import { scopeListArea, listEduDance, treeCoachClassType } from '@/api/common'
  import { referenceEntryPage, referenceEntrySave, referenceEntryUpdate, referenceEntryDelete } from '@/api/education'

  const formItemLayout = { labelCol: { span: 6 }, wrapperCol: { span: 14 } }
  const columns = [
    {
      title: '地区',
      dataIndex: 'deptName',
      width: 100
    },
    {
      title: '舞种',
      dataIndex: 'danceName',
      width: 120
    },
    {
      title: '班型',
      dataIndex: 'classTypeName',
      width: 200,
      customRender: (text, record) => {
        return record.typeName + '>' + record.classTypeName
      },
    },
    {
      title: '参考值',
      dataIndex: 'value',
      width: 150
    },
    {
      title: '操作',
      dataIndex: 'action',
      scopedSlots: { customRender: 'action' },
      width: 200
    }
  ]

  export default {
    name: 'referenceEntry',
    components: {
      SearchComPro,
      STable,
      PermBox
    },
    data() {
      return {
        showSearch: false,
        areaOptions: [],
        danceOptions: [],
        classTypeOptions: [],

        // table
        columns,
        searchParams: [
          {
            type: 'select',
            key: 'areaId',
            label: '地区',
            placeholder: '请选择地区',
            staticArr: []
          },
          {
            type: 'select',
            key: 'danceId',
            label: '舞种',
            placeholder: '请选择舞种',
            staticArr: []
          },
          {
            type: 'cascader',
            key: 'classTypeId',
            label: '班型',
            placeholder: '请选择班型',
            changeOnSelect: 'A',
            treeOps: {
              label: 'name',
              value: 'id',
              children: 'children',
            }
          }
        ],
        queryParam: {},
        dataSource: [],
        tableLoading: false,

        // 编辑
        formItemLayout,
        confirmLoading: false,
        editVisible: false,
        form: {
          areaId: undefined,
          danceId: undefined,
          classType: undefined,
          referenceValue: undefined
        },
        rules: {
          areaId: [{ required: true, message: '请选择地区', trigger: 'change' }],
          danceId: [{ required: true, message: '请选择舞种', trigger: 'change' }],
          classType: [{ required: true, message: '请选择班型', trigger: 'change' }],
          referenceValue: [{ required: true, message: '请输入参考值', trigger: 'change' }]
        }
      }
    },
    computed: {},
    created() {
      this.init()
      this.initList()
    },
    methods: {
      searchSubmit(data) {
        this.queryParam = data
        if (this.queryParam.classTypeId) {
          let arr = this.queryParam.classTypeId.split(',')
          this.queryParam.classTypeId = arr[arr.length - 1]
        }
        this.initList()
      },
      async init() {
        let areaRes = await scopeListArea()
        this.areaOptions = (areaRes.data || []).map(d => ({ string: d.deptName, value: d.id }))
        this.searchParams.find(d => d.key === 'areaId').staticArr = this.areaOptions

        let danceRes = await listEduDance()
        this.danceOptions = (danceRes.data || []).map(d => ({ string: d.name, value: d.id }))
        this.searchParams.find(d => d.key === 'danceId').staticArr = this.danceOptions

        let coachRes = await treeCoachClassType()
        this.classTypeOptions = coachRes.data || []
        this.searchParams.find(d => d.key === 'classTypeId').treeOps.options = this.classTypeOptions

        this.showSearch = true
      },

      initList() {
        this.tableLoading = true
        referenceEntryPage(Object.assign({ page: 0, limit: 0 }, this.queryParam))
          .then(res => {
            this.dataSource = []
            this.formatData(res.data || [])
          })
          .finally(() => this.tableLoading = false)
      },
      formatData(data) {
        data.forEach((d1, i1) => {
          if (Array.isArray(d1.danceList) && d1.danceList.length > 0) {
            d1.danceList.forEach((d2, i2) => {
              if (Array.isArray(d2.dataList) && d2.dataList.length > 0) {
                d2.dataList.forEach((d3, i3) => {
                  this.dataSource.push(Object.assign({}, d1, d2, d3))
                })
              } else {
                this.dataSource.push(Object.assign({}, d1, d2))
              }
            })
          } else {
            this.dataSource.push(Object.assign({}, d1))
          }
        })

        const customRender = (key, value, row, index) => {
          let arr = this.dataSource.map(d => d[key])
          let firstIndex = arr.indexOf(row[key])
          let lastIndex = arr.lastIndexOf(row[key])
          if (key !== 'deptName') {
            arr = this.dataSource.map(d => d.deptName + d[key])
            firstIndex = arr.indexOf(row.deptName + row[key])
            lastIndex = arr.lastIndexOf(row.deptName + row[key])
          }
          let rowSpan = undefined
          if (firstIndex === lastIndex) {
            rowSpan = undefined
          } else {
            if (index > firstIndex && index <= lastIndex) {
              rowSpan = 0
            } else if (index === firstIndex) {
              rowSpan = lastIndex - index + 1
            }
          }

          return {
            children: value,
            attrs: { rowSpan }
          }
        }
        this.columns[0].customRender = (value, row, index) => customRender('deptName', value, row, index)
        this.columns[1].customRender = (value, row, index) => customRender('danceName', value, row, index)
      },
      handleDelete(record) {
        this.$confirm({
          title: '系统提示',
          content: '确定要删除选中数据吗?',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            referenceEntryDelete(record.id)
              .then(res => {
                if (res.code === 200) {
                  this.$notification['success']({
                    message: '系统通知',
                    description: '操作成功'
                  })
                  this.initList()
                }
              })
          }
        })
      },
      handleEdit(record) {
        if (record) {
          const { id, deptId, danceId, typeId, classTypeId, value } = record
          this.form = {
            id,
            areaId: deptId,
            danceId,
            classType: [typeId, classTypeId],
            referenceValue: value
          }
        }
        this.editVisible = true
      },
      handleEditOk() {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            const { areaId, danceId, classType, referenceValue } = this.form
            const classTypeId = classType[classType.length - 1]
            let params = { areaId, danceId, classTypeId, referenceValue }
            if (this.form.id) params.id = this.form.id
            let request = this.form.id ? referenceEntryUpdate : referenceEntrySave

            this.confirmLoading = true
            request(params)
              .then(res => {
                if (res.code == 200) {
                  this.$notification['success']({
                    message: '系统通知',
                    description: '操作成功'
                  })
                  this.handleEditCancel()
                  this.initList()
                }
              })
              .finally(() => this.confirmLoading = false)
          }
        })
      },
      handleEditCancel() {
        this.form = {}
        this.$refs.ruleForm.resetFields()
        this.editVisible = false
      }
    }
  }
</script>

<style type="text/less" lang="less" scoped>
</style>
