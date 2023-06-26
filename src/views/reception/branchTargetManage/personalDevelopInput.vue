<template>
  <div class="student-wrapper">
    <a-card :bordered="false" :style="{ margin: '20px 0' }">
      <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"/>
    </a-card>
    <a-card :bordered="false">
      <a-space :size="15">
        <perm-box perm="finance:target-perdevnum:save">
          <a-button type="primary" icon="plus-circle" @click="handleSaveOpen">个人开发数录入</a-button>
        </perm-box>
      </a-space>
      <s-table ref="table" class="mt20" :data="loadData" :columns="columns" :rowKey="(record, index) => index">
        <span slot="action" slot-scope="text, record">
          <perm-box perm="finance:target-perdevnum:save">
            <a href="#" @click="handleUpdateOpen(record)">修改</a>
          </perm-box>
          <perm-box perm="finance:target-perdevnum:del">
            <a href="#" @click="handleDelete(record)">删除</a>
          </perm-box>
        </span>
      </s-table>
    </a-card>

    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      title="个人开发数录入"
      :width="800"
      v-model="visible"
      :confirmLoading="confirmLoading"
      @ok="handleSave"
      @cancel="handleCancel"
    >
      <a-table
        ref="saveTable"
        :rowClassName="rowClassName"
        :columns="saveColumns"
        :dataSource="formData"
        :rowKey="(record, index) => index" :pagination="false">
        <span slot="year" slot-scope="text, record">
           <a-month-picker  valueFormat="YYYY-MM"  v-model="record.yearMonth" placeholder="请选择月份" />
        </span>
        <span slot="deptId" slot-scope="text, record">
          <a-tree-select
            style="width: 200px"
            v-model="record.orgDept.id"
            treeNodeFilterProp="title"
            placeholder="请选择分馆"
            :allowClear="true"
            :dropdownStyle="{maxHeight: '400px', overflow: 'auto'}"
            :treeData="deptList"
            :treeDefaultExpandAll="true"
          />
        </span>
        <span slot="stage" slot-scope="text, record">
                <a-select  style="width:150px;" showSearch v-model='record.stage' >
                  <a-select-option v-for="(item, index) in stageList" :key="index" :value="item.id">{{ item.name }}</a-select-option>
                </a-select>
        </span>
        <span slot="number" slot-scope="text, record">
          <a-input-number v-model="record.number" placeholder="请输入金额" style="width: 100px" />
        </span>
        <span slot="action" slot-scope="text, record, index">
          <a href="#" class="ml10 mr10" @click="removeRow(index)" v-if="formData.length > 1">
            <a-icon type="close-circle" :style="{ fontSize: '16px' }" />
          </a>
        </span>
      </a-table>
      <a-button type="dashed" icon="plus-circle" block class="mt10" @click="addRow">新增一行</a-button>
    </a-modal>
  </div>
</template>
<script>
  import { SearchComPro, PermBox, STable } from '@/components'
  import { getSchoolList } from '@/api/education/card'
  import { listFinPersonalDevelopmentNumber, saveOrUpdate, removeFinPersonalDevelopmentNumber, updateFinTarget } from '@/api/finance/finance'
  const columns = [
    {
      title: '年份/月份',
      dataIndex: 'yearMonth',
      customRender: (text, record) => {
        return text
      }
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
      title: '阶段',
      dataIndex: 'stage',
      customRender: (text, record, index) => {
        let flag = text==='A'?'第一阶段(1-9号)':text==='B'?'第二阶段(1-19号)':text==='C'?'第三阶段(1-31号)':''
        return flag
      },
    },
    {
      title: '个人开发数',
      dataIndex: 'number'
    },
    {
      title: '操作',
      dataIndex: 'action',
      scopedSlots: { customRender: 'action' }
    }
  ]
  const saveColumns = [
    {
      title: '年份/月份',
      dataIndex: 'yearMonth',
      scopedSlots: { customRender: 'year' }
    },
    {
      title: '地区/分馆',
      dataIndex: 'deptId',
      scopedSlots: { customRender: 'deptId' }
    },
    {
      title: '阶段',
      dataIndex: 'stage',
      scopedSlots: { customRender: 'stage' }
    },
    {
      title: '个人开发数 ',
      dataIndex: 'number',
      scopedSlots: { customRender: 'number' }
    },
    {
      title: '操作',
      dataIndex: 'action',
      scopedSlots: { customRender: 'action' }
    }
  ]
  const defaultLayout = {
    labelCol: { md: { span: 6 } },
    wrapperCol: { md: { span: 14 } }
  }

  export default {
    name: 'personalDevelopInput',
    components: {
      SearchComPro,
      PermBox,
      STable
    },
    data() {
      return {
        stageList:[
          {
            name:'一阶段（1-9号）',
            id:'A'
          },
          {
            name:'二阶段（1-19号）',
            id:'B'
          },         {
            name:'三阶段（1-31号）',
            id:'C'
          }
        ],
        columns,
        searchParams: [
          {
            type: 'treeSelect',
            isShow: true,
            key: 'school_id',
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
          },
          {
            type: 'date',
            key: 'Month',
            label: '年份',
            placeholder: '请选择年份',
            format: 'YYYY-MM',
            mode: ['month', 'month']
          },
        ],
        queryParam: {},
        loadData: parameter => {
          return listFinPersonalDevelopmentNumber(Object.assign(parameter, this.queryParam)).then(res => {
            return res
          })
        },

        /* 年度目标录入 */
        confirmLoading: false,
        visible: false,
        saveColumns,
        formData: [],
        deptList: [],
      }
    },
    created() {
      this.getALLDeptSchools()
    },
    methods: {
      rowClassName(record, idx) {
        if (idx % 2 === 1) return 'ant-table-even'
      },
      //搜索功能
      searchSubmit(data) {
        this.queryParam = data
        this._refreshTable()
      },
      _refreshTable() {
        this.$refs.table.refresh()
      },

      getALLDeptSchools() {
        getSchoolList().then(res => {
          this.deptList = this._handleTreeData(res.data, true)
        })
      },
      _handleTreeData(data, disabled) {
        return data.map((item, index) => {
          let temObj = { disabled }
          temObj.title = item.name || item.deptName
          temObj.value = item.id
          temObj.deptType = item.deptType
          if (item.children && item.children.length > 0) {
            temObj.children = this._handleTreeData(item.children, false)
          }
          return temObj
        })
      },
      addRow() {
        this.formData.push({
          yearMonth: '',
          orgDept: { id: '' },
          number: 0,
          stage:''
        })
      },
      removeRow(index) {
        this.formData.splice(index, 1)
      },
      handleSaveOpen() {
        this.visible = true
        this.formData = [{
          yearMonth: '',
          orgDept: { id: '' },
          number: 0,
          stage:''
        }]
      },
      handleSave() {
        let form = JSON.parse(JSON.stringify((this.formData)))
        if (form.length === 0) {
          return this.$notification['error']({
            message: '系统通知',
            description: '至少要录入一条数据'
          })
        }
        if (form.findIndex(d => !d.yearMonth) >= 0 ) {
          return this.$notification['error']({
            message: '系统通知',
            description: '请选择年份/月份'
          })
        }
        if ( form.findIndex(d => !d.orgDept.id) >= 0) {
          return this.$notification['error']({
            message: '系统通知',
            description: '请选择地区/分馆'
          })
        }
        if ( form.findIndex(d => !d.stage) >= 0) {
          return this.$notification['error']({
            message: '系统通知',
            description: '请选择阶段'
          })
        }
        if ( form.findIndex(d => !d.number) >= 0) {
          return this.$notification['error']({
            message: '系统通知',
            description: '请输入个人开发数'
          })
        }
        this.confirmLoading = true
        saveOrUpdate(form)
          .then(res => {
            if (res.code === 200) {
              this.$notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
              this.handleCancel()
              this._refreshTable()
            }
          })
          .finally(() => {
            this.confirmLoading = false
          })
      },
      handleCancel() {
        this.visible = false
      },
      initForm(record) {
        this.formData = []
        if (record) {
          const { id, deptId, yearMonth, number ,stage} = record
          this.formData.push({
            id,
            yearMonth,
            orgDept: { id: deptId },
            number,
            stage
          })
        }
      },
      handleUpdateOpen(record) {
        this.initForm(record)
        this.visible = true
      },
      handleUpdateSave() {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            this.confirmLoading = true
            updateFinTarget(this.updateForm)
              .then(res => {
                if (res.code === 200) {
                  this.$notification['success']({
                    message: '系统通知',
                    description: '保存成功'
                  })
                  this.handleUpdateCancel()
                  this._refreshTable()
                } else {
                  this.$notification['error']({
                    message: '系统通知',
                    description: res.msg
                  })
                }
              })
              .finally(() => {
                this.confirmLoading = false
              })
          }
        })
      },
      handleUpdateCancel() {
        this.updateVisible = false
        this.updateForm = {}
        this.$refs.ruleForm.resetFields()
      },
      handleDelete(record) {
        this.$confirm({
          title: '系统提示',
          content: '确定要删除选中数据吗?',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            removeFinPersonalDevelopmentNumber(record.id).then(res => {
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
      }
    }
  }
</script>

<style scoped lang="less">
</style>
