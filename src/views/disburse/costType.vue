<template>
  <div style="display: flex;">
    <a-layout id="components-layout-demo-custom-trigger" style="padding: 24px 0; background: #fff">
      <a-layout-sider style="background: #fff">
        <a-menu mode="vertical" @click="changeTable" :default-selected-keys="['1']">
          <a-menu-item key="1">
            财务支出
          </a-menu-item>
          <a-menu-item key="2">
            工资社保
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
            <div class="btnClass">
              <perm-box perm="system:feename:save">
                <a-button type="primary" icon="plus-circle" @click.native="openModal()">新增</a-button>
              </perm-box>
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
      width="400px"
      okText="保存"
      cancelText="取消"
      @ok="submit"
      :confirmLoading="isloading"
    >
      <div class="teacher-info" v-for="(item, index) in costNames" :key="index">
        <span class="teacher-form">
          <span> <span class="star">*</span>费用归类</span>
          <a-input v-model="item.feeItemName" style="width:200px" />
        </span>
        <span class="teacher-form">
          <span> <span class="star">*</span>财务归类</span>
          <a-input v-model="item.financeName" style="width:200px" />
        </span>
        <span class="teacher-form">
          <span> <span class="star">*</span>经营归类</span>
          <a-input v-model="item.operateName" style="width:200px" />
        </span>
        <span class="teacher-form">
          <span>成本归类</span>
          <a-input v-model="item.costName" style="width:200px" />
        </span>
        <span class="teacher-form">
          <span>排序</span>
          <a-input-number v-model="item.feeItemOrder" style="width:100px" />
        </span>
        <span class="teacher-form">
          <span>描述</span>
          <a-input v-model="item.feeItemDesc" style="width:200px" />
        </span>
        <!-- <span>
          <a-icon type="plus-circle" class="icon" style="margin: 7px;" @click="add()" v-if="costNames.length - 1 == index && title === '新增'" />
          <a-icon type="minus-circle" class="icon" style="margin: 7px;" @click.stop="subtract(index)" v-if="costNames.length !== 1 && title === '新增'" />
        </span> -->
      </div>
    </a-modal>
  </div>
</template>
<script>
import { STable, SearchComPro } from '@/components'
import PermBox from '@/components/PermBox'
import { pageFeeItem, saveFeeItem, removeFeeItem, changeFeeItem, changeFeeItemState } from '@/api/education/card'
const columns = [
  {
    title: '费用归类',
    dataIndex: 'feeItemName'
  },
  {
    title: '财务归类',
    dataIndex: 'financeName'
  },
  {
    title: '经营归类',
    dataIndex: 'operateName'
  },
  {
    title: '成本归类',
    dataIndex: 'costName'
  },
  {
    title: '排序',
    dataIndex: 'feeItemOrder'
  },
  {
    title: '描述',
    dataIndex: 'feeItemDesc'
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
          key: 'feeItemName',
          label: '费用归类',
          placeholder: '请输入费用归类'
        }
      ],
      loadData: parameter => {
        return pageFeeItem(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      },
      queryParam: {
        feeItemIncType: 'A'
      },
      title: null,
      modal: false,
      isloading: false,
      costNames: [
        {
          feeItemName: '',
          financeName: '',
          operateName: '',
          costName: '',
          feeItemOrder: null,
          feeItemDesc: null
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
            feeItemName: '',
            financeName: '',
            operateName: '',
            costName: '',
            feeItemOrder: null,
            feeItemDesc: null
          }
        ]
      }
    }
  },
  methods: {
    delect(record) {
      const { $confirm, $notification, _refreshTable } = this
      $confirm({
        title: '系统提示',
        content: '确认删除该条数据吗?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          removeFeeItem(record.id)
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
        feeItemName: '',
        financeName: '',
        operateName: '',
        costName: '',
        feeItemOrder: null,
        feeItemDesc: null
      }
      this.costNames.push(obj)
    },
    unique(arr) {
      // 缓存用于记录
      const arr1 = []
      for (const t of arr) {
        // 检查缓存中是否已经存在
        if (
          arr1.find(c => c.feeItemName === t.feeItemName && c.financeName === t.financeName && c.operateName === t.operateName && c.costName === t.costName)
        ) {
          // 已经存在说明以前记录过，现在这个就是多余的，直接忽略
          continue
        }
        // 不存在就说明以前没遇到过，把它记录下来
        arr1.push(t)
      }
      // 记录结果就是过滤后的结果
      return arr1
    },
    submit() {
      // if (this.queryParam.feeItemIncType == 'B') {
      //   let arr = JSON.parse(JSON.stringify(this.costNames))
      //   let new_arr = this.unique(arr)
      //   if (new_arr.length < arr.length) {
      //     return this.$notification['error']({
      //       message: '系统通知',
      //       description: '请勿填写重复数据'
      //     })
      //   }
      // }
      // if (this.queryParam.feeItemIncType == 'A') {
      //   let arr = this.costNames.map(item => item.feeItemName)
      //   let new_arr = Array.from(new Set(arr))
      //   if (new_arr.length < arr.length) {
      //     return this.$notification['error']({
      //       message: '系统通知',
      //       description: '费用归类不能重复'
      //     })
      //   }
      // }
      let str = 'feeItemName,financeName,operateName'
      for (let i = 0; i < this.costNames.length; i++) {
        for (let key in this.costNames[i]) {
          if (str.indexOf(key) != -1 && !this.costNames[i][key]) {
            return this.$notification['error']({
              message: '系统通知',
              description: '请先填写完整表格'
            })
          }
        }
      }
      this.isloading = true
      if (this.title === '新增') {
        saveFeeItem(Object.assign(this.costNames[0], { feeItemIncType: this.queryParam.feeItemIncType }))
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
        changeFeeItem({
          id: this.id,
          feeItemName: this.costNames[0].feeItemName,
          operateName: this.costNames[0].operateName,
          financeName: this.costNames[0].financeName,
          costName: this.costNames[0].costName,
          feeItemOrder: this.costNames[0].feeItemOrder,
          feeItemDesc: this.costNames[0].feeItemDesc,
          feeItemIncType: this.queryParam.feeItemIncType
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
        this.costNames[0].costName = record.costName
        this.costNames[0].financeName = record.financeName
        this.costNames[0].operateName = record.operateName
        this.costNames[0].feeItemName = record.feeItemName
        this.costNames[0].feeItemOrder = record.feeItemOrder
        this.costNames[0].feeItemDesc = record.feeItemDesc
        this.title = '修改'
      } else {
        this.title = '新增'
      }
      this.modal = true
    },
    //搜索功能
    searchSubmit(data) {
      let val = this.queryParam.feeItemIncType
      this.queryParam = Object.assign({ feeItemIncType: val }, data)
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
          that.queryParam.feeItemIncType = 'A'
          that._refreshTable()
        } else {
          that.queryParam.feeItemIncType = 'B'
          that._refreshTable()
        }
      }, 100)
    },
    changeState(record) {
      let { id, state } = record
      changeFeeItemState({ id, state: state === 'Y' ? 'N' : 'Y' })
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
  // flex-flow: row nowrap;
  // align-items: center;
  flex-direction: column;
  margin-bottom: 10px;
  padding: 0 20px;
  .teacher-form {
    display: flex;
    flex-flow: row nowrap;
    // align-items: center;
    margin: 0 0px 10px 10px;
    /deep/ .ant-calendar-picker {
      width: 120px;
    }
    > span {
      min-width: 80px;
    }
    .star {
      color: red;
      margin-right: 5px;
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
