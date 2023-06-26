<template>
  <div>
    <a-card :bordered="false" :style="{ margin: '20px 0' }">
      <search-com-pro :style="{ padding: '10px 0' }" :searchParams="searchParams" @searchSubmit="searchSubmit"></search-com-pro>
    </a-card>

    <a-card :bordered="false">
      <div class="mb20">
        <perm-box perm="finance:dept-visit:save">
          <a-button type="primary" icon="plus-circle" @click="handleAdd">来访人数录入</a-button>
        </perm-box>
      </div>
      <s-table
        ref="table"
        class="mt20"
        :data="loadData"
        :columns="columns"
        :rowKey="(record, index) => index"
      >
        <span slot="action" slot-scope="text, record">
          <perm-box perm="finance:dept-visit:save">
            <a @click="handleEdit(record)">修改</a>
          </perm-box>
          <perm-box perm="finance:dept-visit:del">
            <a @click="handleDelete(record.id)">删除</a>
          </perm-box>
        </span>
      </s-table>
    </a-card>

    <a-modal
      title="来访人数录入"
      :maskClosable="$store.state.modalMaskClickEnable"
      :width="600"
      :visible="visible"
      :confirmLoading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-table
        :columns="formColumns"
        :dataSource="form"
        :pagination='false'
        :rowKey="(record, index) => index"
      >
        <span slot="yearMonth" slot-scope="text, record">
          <a-month-picker v-model="record.yearMonth" valueFormat="YYYY-MM" style="width: 100%;" />
        </span>
        <span slot="orgDept" slot-scope="text, record">
          <a-tree-select
            style="width: 100%;"
            v-model="record.orgDept.id"
            placeholder="请选择分馆"
            treeNodeFilterProp="deptId"
            :replaceFields="replaceFields"
            :allowClear="true"
            :dropdownStyle="{maxHeight: '400px', overflow: 'auto'}"
            :treeData="deptList"
            :treeDefaultExpandAll="true"
          />
        </span>
        <span slot="visitNumber" slot-scope="text, record">
          <a-input-number v-model="record.visitNumber" :min="0" style="width: 100%;" />
        </span>
        <span slot="action" slot-scope="text, record, index">
          <a @click="handleRemove(index)"><a-icon type="close-circle" /></a>
        </span>
      </a-table>
      <a-button type="dashed" icon="plus-circle" block class="mt10" @click="handleAddRow">新增一行</a-button>
    </a-modal>
  </div>
</template>

<script>
  import Vue from 'vue'
  import moment from 'moment'
  import { STable, PermBox, SearchComPro } from '@/components'
  import { getSchoolList } from '@/api/education/card'
  import { listDeptVisit, removeDeptVisit, saveDeptVisit } from '@/api/organize'

  const defaultSchoolId =['0c18166a-679b-414e-ac2e-c05ba7a2f4c4', '8f63afe7-09ca-4d11-ac51-1187e4381e63', '407913a7-76ff-40ce-967f-0ce0bf0bcdd3', '8109e909-8c8e-463a-9e10-a0804bc59b79', '150d8748-87ab-4935-8f6f-7233d1294413', '4c58a4b3-157b-493f-8b72-707196a26453', 'e07cad7c-7415-421c-a77e-48146d33a3bc', '0c185455-7ae8-4207-a517-91a2f5f26030', '88c5e24d-15c1-4e7c-adfb-f5e291562c33', '5aa46e02-28b9-4e31-936f-60721e07696d', '2d30de5a-9e47-4669-a9e9-534085ab6353', '7b0f4b73-83d9-4d46-adb0-78138e7ed633', '080aabad-e46b-479e-b130-169e970427e0', '66298d15-894b-4e48-9551-5d3795470304', '4e94a672-0bbd-48cd-ab50-8db3a4f4a57f',  'b337887b-ce9d-49e6-89c5-4f822c94d457', '5c3f5874-f9aa-437a-b1cc-9c5cf6339c3f', '50232e74-16d1-438d-9c09-bc7454b13fe0', '999e8fb9-6c98-4cc5-bab3-2a2937a36836', 'd923d38e-1699-4137-8f2a-315dcf2fa017', '5c0f0a94-346f-4e82-8848-f8882a7ac0ae', '7aa9901b-6d7f-44a3-8640-e0935516514c', '1207948e-746c-4dc3-9dd8-ab9c4493b49e', '47a6e64a-c166-4bb6-874c-f7e5c91666d7', 'c066c789-e642-45c8-9486-d7e684d44dca', '457cadbe-f9a8-4d18-87b4-85051f99898b', '6209c9c1-9b8f-42f2-9214-a7db8d5ece5a', 'b29cfda3-9609-4939-a8c4-4fe240f54f91']
  const columns = [
    {
      title: '年份/月份',
      dataIndex: 'yearMonth'
    },
    {
      title: '地区',
      dataIndex: 'regionName'
    },
    {
      title: '分馆',
      dataIndex: 'deptName'
    },
    {
      title: '来访人数（个）',
      dataIndex: 'visitNumber'
    },
    {
      title: '操作',
      dataIndex: 'action',
      scopedSlots: { customRender: 'action' }
    }
  ]
  const formColumns = [
    {
      title: '年份/月份',
      dataIndex: 'yearMonth',
      width: 140,
      scopedSlots: { customRender: 'yearMonth' }
    },
    {
      title: '地区/分馆',
      dataIndex: 'orgDept',
      scopedSlots: { customRender: 'orgDept' }
    },
    {
      title: '来访人数',
      dataIndex: 'visitNumber',
      width: 100,
      scopedSlots: { customRender: 'visitNumber' }
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 100,
      scopedSlots: { customRender: 'action' }
    }
  ]

  export default {
    components: {
      STable,
      PermBox,
      SearchComPro
    },
    data() {
      let schoolIds = this.$store.getters.school_id ? [this.$store.getters.school_id] : defaultSchoolId
      return {
        schoolIds,
        searchParams: [
          {
            type: 'treeSelect',
            isShow: !!!this.$store.getters.school_id,
            key: 'school_id',
            label: '分馆',
            placeholder: '请选择分馆',
            expandAll: true,
            mutiple: true,
            show: true,
            treeCheckable: true,
            selectFather: true,
            defaultVal: schoolIds,
            treeOps: {
              api: getSchoolList,
              label: 'deptName',
              value: 'id',
              children: 'children'
            }
          },
          {
            type: 'date',
            key: 'Month',
            label: '时间区间',
            placeholder: '请选择时间区间',
            show: true,
            format: 'YYYY-MM',
            mode: ['month', 'month']
          },
        ],
        queryParam: {
          school_id: schoolIds.join(',')
        },
        columns,
        loadData: parameter => {
          return listDeptVisit(Object.assign({}, this.queryParam, parameter)).then(res => {
            return res
          })
        },
        visible: false,
        confirmLoading: false,
        replaceFields: { children: 'children', title: 'deptName', key: 'deptId', value: 'deptId' },
        deptList: [],
        formColumns,
        form: []
      }
    },
    created() {
      this.initSchoolList()
    },
    methods: {
      _refreshTable() {
        this.$refs.table.refresh()
      },
      searchSubmit(data, isReset) {
        this.queryParam = data
        if (isReset == 'isReset') {
          this.queryParam = {
            school_id: this.schoolIds.join(',')
          }
        }
        this._refreshTable()
      },
      async initSchoolList() {
        const userSchoolId = JSON.parse(Vue.ls.get('userSchoolId'))
        const deptRes = await getSchoolList()
        let deptList = deptRes.data || []
        if (Array.isArray(userSchoolId)&&userSchoolId.length>0) {
          let curDeptList = userSchoolId
          this.deptList = []
          deptList.forEach(item => {
            let index = curDeptList.findIndex(a => a.parentId === item.deptId)
            if (index >= 0 && Array.isArray(item.children) && item.children.length > 0) {
              let children = item.children.filter(a => curDeptList.findIndex(b => b.id === a.deptId) >= 0)
              this.deptList.push(Object.assign({}, item, { children, disabled: true }))
            }
          })
        } else {
          this.deptList = deptList.map(item => Object.assign({}, item, { disabled: true }))
        }
        this.initForm()
      },
      initForm(record) {
        this.form = []
        if (record) {
          const { id, deptId, yearMonth, visitNumber } = record
          this.form.push({
            id,
            yearMonth,
            orgDept: { id: deptId },
            visitNumber
          })
        } else {
          let month = moment().format('YYYY-MM')
          this.deptList.forEach(item => {
            if (Array.isArray(item.children) && item.children.length > 0) {
              item.children.forEach(child => {
                this.form.push({
                  yearMonth: month,
                  orgDept: { id: child.deptId },
                  visitNumber: 0
                })
              })
            }
          })
        }
      },
      handleAdd() {
        this.initForm()
        this.visible = true
      },
      handleEdit(record) {
        this.initForm(record)
        this.visible = true
      },
      handleAddRow() {
        this.form.push({
          yearMonth: undefined,
          orgDept: { id: '' },
          visitNumber: 0
        })
      },
      handleDelete(id) {
        this.$confirm({
          title: '系统提示',
          content: '确定要删除选中数据吗?',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            removeDeptVisit(id)
              .then(res => {
                if (res.code === 200) {
                  this.$notification['success']({
                    message: '系统通知',
                    description: '操作成功'
                  })
                  this._refreshTable()
                }
              })
          }
        })
      },
      handleRemove(index) {
        this.form.splice(index, 1)
      },
      handleOk() {
        let form = this.form
        //   .filter(item => item.visitNumber !== 0)
        // if (form.length === 0) {
        //   return this.$notification['error']({
        //     message: '系统通知',
        //     description: '只少要录入一条数据'
        //   })
        // }
        if (form.findIndex(d => !d.yearMonth) >= 0 || form.findIndex(d => !d.orgDept.id) >= 0) {
          return this.$notification['error']({
            message: '系统通知',
            description: '请选择年份/月份 和 地区/分馆'
          })
        }
        this.confirmLoading = true
        saveDeptVisit(form)
          .then(res => {
            if (res.code === 200) {
              this.$notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
              this._refreshTable()
            }
          })
          .finally(() => {
            this.confirmLoading = false
            this.handleCancel()
          })
      },
      handleCancel() {
        this.visible = false
      }
    }
  }
</script>

<style lang="less" scoped type="text/less">
  @import '~@/assets/style/index';
</style>
