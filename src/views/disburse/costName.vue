<template>
  <div style="display: flex;">
    <a-layout id="components-layout-demo-custom-trigger" style="padding: 24px 0; background: #fff">
      <a-layout-sider style="background: #fff">
        <a-menu mode="vertical" @click="changeTable" :default-selected-keys="['1']">
          <a-menu-item key="1">
            财务支出
          </a-menu-item>
          <a-menu-item key="2">
            社保支出
          </a-menu-item>
        </a-menu>
      </a-layout-sider>

      <div style="width:100%;">
        <a-card :bordered="false" :style="{ margin: '20px 0' }">
          <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams" ref="searchComPro"></search-com-pro>
        </a-card>
        <a-layout-content>
          <!-- <a-card :bordered="false" :style="{ margin: '20px 0' }">
          <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"></search-com-pro>
        </a-card> -->
          <a-card :bordered="false">
            <div class="btnClass flex" style="justify-content: space-between;">
              <perm-box perm="system:feename:save">
                <a-button type="primary" icon="plus-circle" @click.native="openModal()">新增费用名称</a-button>
              </perm-box>
              <a-button type="primary" icon="download" @click.native="downloadStu"> 导出 </a-button>
            </div>
            <perm-box perm="system:feename:view">
              <s-table ref="table" size="default" :columns="columns" :data="loadData" :alert="false" :rowKey="(record, index) => index">
                <span slot="state" slot-scope="text, record">
                  <a-switch :checked="record.state == 'Y'" @change="changeState(record)">
                    <a-icon type="check" slot="checkedChildren"/>
                    <a-icon type="close" slot="unCheckedChildren"/>
                  </a-switch>
                </span>
                <span slot="action" slot-scope="text, record">
                  <perm-box perm="system:feename:save">
                    <a href="javascript:;" @click="openModal(record)">修改</a>
                  </perm-box>
                  <perm-box perm="system:feename:del">
                    <a href="javascript:;" @click="delect(record)">删除</a>
                  </perm-box>
                </span>
              </s-table>
            </perm-box>
          </a-card>
        </a-layout-content>
      </div>
    </a-layout>
    <!-- 编辑 -->
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :title="title"
      v-model="modal"
      width="1100px"
      okText="保存"
      cancelText="取消"
      @ok="submit"
      :confirmLoading="isloading"
    >
      <div class="teacher-info" v-for="(item, index) in costNames" :key="index">
        <span class="teacher-form">
          <span style="width:90px;">费用名称</span>
          <a-input v-model="item.feeName" style="width:200px" />
          <!-- <a-tree-select
              style="min-width:120px;"
              v-model="item.deptId"
              :allowClear="true"
              :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
              :treeData="schoolList"
              treeDefaultExpandAll
            /> -->
        </span>
        <span class="teacher-form">
          <span class="teacher-form">
            <span style="width:50px;">单位</span>
            <a-input v-model="item.feeUnit" style="width:100px" />
          </span>
        </span>
        <span class="teacher-form">
          <span style="margin-right: 10px;">排序</span>
          <a-input-number v-model="item.feeOrder" style="width:60px" />
        </span>
        <span class="teacher-form">
          <span style="margin-right: 10px;">描述</span>
          <a-input v-model="item.feeDesc" style="width:200px" />
        </span>
        <span>
          <a-icon type="plus-circle" class="icon" style="margin: 7px;" @click="add()" v-if="costNames.length - 1 == index && title === '新增费用名称'" />
          <a-icon
            type="minus-circle"
            class="icon"
            style="margin: 7px;"
            @click.stop="subtract(index)"
            v-if="costNames.length !== 1 && title === '新增费用名称'"
          />
        </span>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { STable, SearchComPro } from '@/components'
import PermBox from '@/components/PermBox'
import { feenameList, saveFeeName, feenameRemove, changeFeeName, changeFeeNameState } from '@/api/education/card'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
const columns = [
  // {
  //   title: '支出类型',
  //   dataIndex: 'feeType',
  //   key: 'feeType',
  //   customRender: (text, record) => {
  //     const { feeType } = record
  //     if(feeType==='A') {
  //       return '财务支出'
  //     }else if(feeType==='B'){
  //       return '社保支出'
  //     }
  //   },
  // },
  {
    title: '费用名称',
    dataIndex: 'feeName'
  },
  {
    title: '单位',
    dataIndex: 'feeUnit'
  },
  {
    title: '排序',
    dataIndex: 'feeOrder'
  },
  {
    title: '描述',
    dataIndex: 'feeDesc'
  },
  {
    title: '状态',
    dataIndex: 'state',
    scopedSlots: { customRender: 'state' }
  },
  {
    title: '操作',
    key: 'action',
    width: '150px',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  data() {
    return {
      columns,
      searchParams: [
        {
          type: 'text',
          key: 'name',
          label: '费用名称',
          placeholder: '请输入费用名称'
        }
      ],
      loadData: parameter => {
        return feenameList(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      },
      queryParam: {
        feeType: 'A'
      },
      title: null,
      modal: false,
      isloading: false,
      costNames: [
        {
          feeName: null,
          feeUnit: null,
          feeOrder: null,
          feeDesc: null
        }
      ],
      id: null
    }
  },
  components: {
    STable,
    SearchComPro,
    PermBox
  },
  watch: {
    modal(n, o) {
      if (!n) {
        this.id = null
        this.costNames = [
          {
            feeName: null,
            feeUnit: null,
            feeOrder: null,
            feeDesc: null
          }
        ]
      }
    }
  },
  methods: {
    //导出
    downloadStu() {
      let exportUrl = '/system/feename/feeNameDown'
      const queryParam = this.queryParam
      const token = Vue.ls.get(ACCESS_TOKEN)
      let fields = [{ name: 'auth_token', value: token }]
      for (let k in queryParam) {
        if (k !== 'page' && k !== 'limit' && queryParam[k]) fields.push({ name: k, value: queryParam[k] })
      }
      fields.push({ name: 'page', value: 0 })
      fields.push({ name: 'limit', value: 0 })
      const form = document.createElement('form')
      form.action = `${process.env.VUE_APP_URL}${exportUrl}`
      form.method = 'POST'
      form.target = 'downloadFrame'
      for (let i = 0; i < fields.length; i++) {
        const field = fields[i]
        const f = document.createElement('input')
        f.type = 'hidden'
        f.name = field.name
        f.value = field.value
        form.appendChild(f)
      }
      document.body.appendChild(form)
      form.submit()
      this.$message.success('正在下载...')
      document.body.removeChild(form)
    },
    delect(record) {
      const { $confirm, $notification, _refreshTable } = this
      $confirm({
        title: '系统提示',
        content: '确认删除该条数据吗?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          feenameRemove(record.id)
            .then(res => {
              $notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
            })
            .finally(() => _refreshTable())
        }
      })
    },
    subtract(index) {
      this.costNames.splice(index, 1)
    },
    add() {
      let obj = {
        feeName: null,
        feeUnit: null,
        feeOrder: null,
        feeDesc: null
      }
      if (this.queryParam.feeType === 'B') {
        obj.feeUnit = '人'
      }
      this.costNames.push(obj)
    },
    submit() {
      let arr = this.costNames.map(item => item.feeName)
      let new_arr = Array.from(new Set(arr))
      if (new_arr.length < arr.length) {
        return this.$notification['error']({
          message: '系统通知',
          description: '请勿填写重复的费用名称'
        })
      }
      for (let i = 0; i < this.costNames.length; i++) {
        for (let key in this.costNames[i]) {
          console.log(this.costNames[i])
          if (key === 'feeName' && !this.costNames[i][key]) {
            return this.$notification['error']({
              message: '系统通知',
              description: '请先填写完整表格'
            })
          }
        }
      }
      this.isloading = true
      if (this.title === '新增费用名称') {
        saveFeeName({ feeNames: JSON.stringify(this.costNames), feeType: this.queryParam.feeType })
          .then(res => {
            if (res.code === 200) {
              this.modal = false
              this._refreshTable()
              this.$notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
            }
          })
          .finally((this.isloading = false))
      } else {
        changeFeeName({
          id: this.id,
          feeName: this.costNames[0].feeName,
          feeOrder: this.costNames[0].feeOrder,
          feeUnit: this.costNames[0].feeUnit,
          feeDesc: this.costNames[0].feeDesc,
          feeType: this.queryParam.feeType
        })
          .then(res => {
            if (res.code === 200) {
              this.modal = false
              this._refreshTable()
              this.$notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
            }
          })
          .finally((this.isloading = false))
      }
    },
    openModal(record) {
      if (record) {
        this.id = record.id
        this.costNames[0].feeDesc = record.feeDesc
        this.costNames[0].feeUnit = record.feeUnit
        this.costNames[0].feeOrder = record.feeOrder
        this.costNames[0].feeName = record.feeName
        this.title = '修改费用名称'
      } else {
        this.title = '新增费用名称'
        if (this.queryParam.feeType === 'B') {
          this.costNames[0].feeUnit = '人'
        }
      }
      this.modal = true
    },
    //搜索功能
    searchSubmit(data) {
      let val = this.queryParam.feeType
      this.queryParam = Object.assign({ feeType: val }, data)
      this._refreshTable()
    },
    _refreshTable() {
      this.$refs.table.refresh()
    },
    changeTable(e) {
      let that = this
      this.$refs.searchComPro.reset()
      setTimeout(() => {
        if (e.key == 1) {
          that.queryParam.feeType = 'A'
          that._refreshTable()
        } else {
          that.queryParam.feeType = 'B'
          that._refreshTable()
        }
      }, 100)
    },
    changeState(record) {
      let { id, state } = record
      changeFeeNameState({ id, state: state === 'Y' ? 'N' : 'Y' })
        .then(res => {
          if (res.code == 200) this._refreshTable()
        })
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .ant-menu .ant-menu-vertical .ant-menu-root .ant-menu-light {
  width: auto !important;
}
.belongs-teacher-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.teacher-info {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  margin-bottom: 10px;
  .teacher-form {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    margin: 0 10px;
    /deep/ .ant-calendar-picker {
      width: 120px;
    }
  }
}
.icon {
  color: #1890ff;
  font-size: 16px;
}
.btnClass {
  margin-bottom: 10px;
}
</style>
