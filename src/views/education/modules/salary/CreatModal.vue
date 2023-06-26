<template>
  <div>
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" v-model="modal" title="创编费管理" width="1200px" :footer="null">
      <div class="btn-group">
        <perm-box perm="salary:creationfee:save">
          <a-button type="primary" @click="openCreat()">新增创编费</a-button>
        </perm-box>
      </div>
      <perm-box perm="education:class-creationfee:view">
        <s-table ref="table" class="salary-table" :columns="columns" :data="loadData" rowKey="id">
          <span slot="action" slot-scope="text, record">
            <perm-box perm="salary:creationfee:save">
              <a href="javascript:;" @click="openCreat(record)">编辑</a>
            </perm-box>
            <perm-box perm="salary:creationfee:del">
              <a href="javascript:;" @click="delect(record)" style="margin-left: 15px;">删除</a>
            </perm-box>
          </span>
        </s-table>
      </perm-box>
    </a-modal>
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      v-model="editCreat"
      :title="title"
      width="1200px"
      @ok="submit()"
      okText="保存"
      :confirmLoading="isloading"
    >
      <div class="teacher-info" v-for="(item, index) in creatMsg" :key="index">
        
        <span class="teacher-form">
          <span style="width:90px;">关联班型</span>
          <a-cascader
            :options="classTypeList"
            disabled
            :showSearch="{ typeFilter }"
            placeholder="请选择班型"
            :fieldNames="{ label: 'name', value: 'id', children: 'children' }"
            changeOnSelect
            @change="changeClassType(item.eduClassTypeId, index)"
            v-model="item.eduClassTypeId"
          />
          <!-- <a-input v-model="item.classTypeName" style="width:100px" /> -->
        </span>
        <span class="teacher-form">
          <span style="margin-right: 10px;">关联薪酬类型</span>
          <a-select allowClear v-model="item.salTypeId" placeholder="选择班型后才会生成薪酬类型" style="width:200px;">
            <a-select-option :allowClear="true" :value="item.id" v-for="(item, index) in item.saleryTypeList" :key="index">
              {{ item.name }}
            </a-select-option>
          </a-select>
          <!-- <a-input-number v-model="item.salTypeName"  style="width:60px"   /> -->
        </span>
        <span class="teacher-form">
          <span style="width:90px;">价格</span>
          <a-input-number v-model="item.price" style="width:200px" />
        </span>
        <span>
          <a-icon type="plus-circle" class="icon" style="margin: 7px;" @click="add()" v-if="creatMsg.length - 1 == index && title === '新增创编费'" />
          <a-icon type="minus-circle" class="icon" style="margin: 7px;" @click.stop="subtract(index)" v-if="creatMsg.length !== 1 && title === '新增创编费'" />
        </span>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { STable, SearchComPro, ChooseTea } from '@/components'
import PermBox from '@/components/PermBox'
import { listSalCreationFee, saveSalCreationFee, removeSalCreationFee, getSalCreationFee, changeSalCreationFee } from '@/api/reception/student'
import { treeEduClassType, salTypeListById } from '@/api/common'
const columns = [
  {
    title: '价格',
    dataIndex: 'price',
    key: 'price',
    scopedSlots: { customRender: 'price' }
  },
  {
    title: '关联班型',
    dataIndex: 'classTypeName',
    key: 'classTypeName',
    customRender: (text, record) => {
      return '企业排舞'
    }
  },
  {
    title: '关联薪酬类型',
    dataIndex: 'salTypeName',
    key: 'salTypeName',
    scopedSlots: { customRender: 'salTypeName' }
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  data() {
    return {
      columns,
      modal: false,
      loadData: parameter => {
        return listSalCreationFee(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      },
      editCreat: false,
      isloading: false,
      creatMsg: [
        {
          eduClassTypeId: ['F', 'af6e2a48-2b3e-4364-a1d4-306319e9527b'],
          salTypeId: null,
          price: null,
          saleryTypeList: []
        }
      ],
      title: '新增创编费',
      id: null,
      classTypeList: []
    }
  },
  watch: {
    editCreat(n, o) {
      if (!n) {
        this.id = null
        this.creatMsg = [
          {
            eduClassTypeId: ['F', 'af6e2a48-2b3e-4364-a1d4-306319e9527b'],
            salTypeId: null,
            price: null,
            saleryTypeList: []
          }
        ]
      } else {
        this.getSelectList()
        this.getSalaryType('F')
      }
    }
  },
  components: {
    STable,
    PermBox,
    SearchComPro
  },

  computed: {},

  created() {
    // this.getSelectList()
    // this.getSalaryType('F')
  },

  methods: {
    getSelectList() {
      // getRoomList({ page: '1', limit: '100' }).then(res => this.roomList = res.data)
      treeEduClassType({ type: 'B' }).then(res => {
        this.$tools.transNullToArr(res.data)
        this.classTypeList = res.data
      })
    },
    typeFilter(inputValue, path) {
      return path.some(option => option.value.indexOf(inputValue) > -1)
    },
    changeClassType(val, index) {
      // this.$nextTick(() => {
      //   let classTypeIdArr = this.addClassForm.getFieldsValue(['classTypeId'])
      //   this.addClassForm.setFieldsValue({ ['salTypeId']: null })
      //   if (classTypeIdArr.classTypeId && classTypeIdArr.classTypeId.length > 0) {
      //     this.getSalaryType(classTypeIdArr.classTypeId[0],index)
      //   }
      // })
    },
    getSalaryType(classTypeId, index) {
      return salTypeListById({ eduTypeId: classTypeId }).then(res => {
        if (res.code === 200) {
          this.creatMsg[index ? index : 0].saleryTypeList = res.data
        }
      })
    },
    _refreshTable() {
      this.$refs.table.refresh()
    },
    openCreat(record) {
      if (record) {
        getSalCreationFee({ creationFeeId: record.id }).then(res => {
          if (res.code === 200) {
            let data = res.data
            this.id = data.id
            this.creatMsg[0].price = data.price
            this.creatMsg[0].classTypeId = data.classTypeId
            this.creatMsg[0].salTypeId = data.salTypeId
          }
        })
        this.title = '修改创编费'
      } else {
        this.title = '新增创编费'
      }
      this.editCreat = true
    },
    delect(record) {
      const { $confirm, $notification, _refreshTable } = this
      $confirm({
        title: '系统提示',
        content: '确认删除该条数据吗?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          removeSalCreationFee(record.id).then(res => {
            $notification['success']({
              message: '系统通知',
              description: '操作成功'
            })
            _refreshTable()
          })
        }
      })
    },
    subtract(index) {
      this.creatMsg.splice(index, 1)
    },
    add() {
      let obj = {
        eduClassTypeId: ['F', 'af6e2a48-2b3e-4364-a1d4-306319e9527b'],
        salTypeId: null,
        price: null,
        saleryTypeList: []
      }
      this.creatMsg.push(obj)
      this.getSalaryType('F', this.creatMsg.length - 1)
    },
    submit() {
      for (let i = 0; i < this.creatMsg.length; i++) {
        for (let key in this.creatMsg[i]) {
          if ((key !== 'saleryTypeList' && key !== 'eduClassTypeId' && !this.creatMsg[i][key]) || (key === 'eduClassTypeId' && !this.creatMsg[i][key].length)) {
            return this.$notification['error']({
              message: '系统通知',
              description: '请先填写完整表格'
            })
          }
        }
      }
      this.isloading = true
      if (this.title === '新增创编费') {
        let arr = this.creatMsg.map(item => {
          let todo = {
            eduClassTypeId: item.eduClassTypeId[item.eduClassTypeId.length - 1],
            salTypeId: item.salTypeId,
            price: item.price
          }
          return todo
        })
        saveSalCreationFee({ salCreationFees: JSON.stringify(arr) })
          .then(res => {
            if (res.code === 200) {
              this.editCreat = false
              this._refreshTable()
              this.$notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
            }
          })
          .finally((this.isloading = false))
      } else {
        changeSalCreationFee({
          id: this.id,
          eduClassTypeId: this.creatMsg[0].eduClassTypeId,
          salTypeId: this.creatMsg[0].salTypeId,
          price: this.creatMsg[0].price
        })
          .then(res => {
            if (res.code === 200) {
              this.editCreat = false
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
    open() {
      this.modal = true
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
