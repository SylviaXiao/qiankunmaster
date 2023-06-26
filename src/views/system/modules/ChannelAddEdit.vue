<template>
  <div class="channel-add-edit-wrapper">
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :title="title"
      :visible="visibleAddEdit"
      @ok="handleAddEditOk"
      :confirmLoading="confirmAddEditLoading"
      @cancel="handleAddEditCancel"
      width="1200px"
    >
      <div class="teacher-info" v-for="(item, index) in list" :key="index">
        <span class="teacher-form">
          <span style="width:70px;">{{ title.substring(2) }}</span>
          <a-input v-model="item.name" style="width:200px" />
        </span>
        <span class="teacher-form">
          <span class="teacher-form">
            <span style="width:90px;">关联客服</span>
            <a-popover v-if="item.userNames.length > 15">
              <template slot="content">
                {{ item.userNames }}
              </template>
              <a-input disabled v-model="item.userNames" style="color: #000;">
                <a-icon style="cursor: pointer" slot="addonAfter" type="search" @click="openTreeModal('service', index)" />
              </a-input>
            </a-popover>
            <a-input disabled v-model="item.userNames" style="color: #000;" v-else>
              <a-icon style="cursor: pointer" slot="addonAfter" type="search" @click="openTreeModal('service', index)" />
            </a-input>
          </span>
        </span>
        <span class="teacher-form">
          <span style="margin-right: 10px;">排序</span>
          <a-input-number v-model="item.sysChannelOrder" style="width:60px" />
        </span>
        <span class="teacher-form">
          <span style="margin-right: 10px;">描述</span>
          <a-input v-model="item.desc" style="width:200px" />
        </span>
        <span>
          <a-icon type="plus-circle" class="icon" style="margin: 7px;" @click="add()" v-if="list.length - 1 == index && title.includes('添加')" />
          <a-icon type="minus-circle" class="icon" style="margin: 7px;" @click.stop="subtract(index)" v-if="list.length !== 1 && title.includes('添加')" />
        </span>
      </div>
    </a-modal>
    <i-modal
      ref="modal"
      :multiple="false"
      :userType="userType"
      @ok="imodalOk"
      @close="imodalClose"
      @getBackData="getBackData"
      :checkBox="true"
      :serverGroupSwitch="true"
      :defaultPagination="true"
    >
    </i-modal>
  </div>
</template>
<script>
const defaultLayout = {
  labelCol: {
    sm: {
      span: 8
    }
  },
  wrapperCol: {
    sm: {
      span: 12
    }
  }
}
const bigLayout = {
  labelCol: {
    sm: {
      span: 6
    }
  },
  wrapperCol: {
    sm: {
      span: 12
    }
  }
}
import { saveSysChannel } from '@/api/system'
import { filterEmptyObject } from '@/utils/util'
import IModal from '@/components/InnerModal/modal.vue'

export default {
  data() {
    return {
      //modal
      visibleAddEdit: false,
      addEditTitle: '无',
      confirmAddEditLoading: false,
      formItemLayout: defaultLayout,
      fromBigItemLayout: bigLayout,
      list: [{ sysChannelOrder: '', name: '', desc: '', orgUsers: '', userNames: '' }],
      userType: 'service',
      index: null
    }
  },
  props: {
    title: String,
    handleType: String,
    id: String, // 有则改1级,无则新建
    // secParentId: String, //有则改2级,无则新建
    // thiParentId: String, //有则改3级,无则新建
    parentId: String //有则改3级,无则新建
  },
  watch: {
    visibleAddEdit(nv) {
      if (!nv) {
        this._reset()
      }
    }
  },
  components: {
    IModal
  },
  beforeCreate() {
    // this.form = this.$form.createForm(this)
  },
  methods: {
    subtract(index) {
      this.list.splice(index, 1)
    },
    add() {
      let obj = { sysChannelOrder: '', name: '', desc: '', orgUsers: '', userNames: '' }
      this.list.push(obj)
    },
    getBackData(data, type) {
      console.log(data)
      this.$nextTick(() => {
        this.list[this.index].userNames = data
          .map(item => {
            return item.userName
          })
          .join(',')
        this.list[this.index].orgUsers = data
          .map(item => {
            return item.id
          })
          .join(',')
      })
    },
    imodalOk() {},
    imodalClose() {},
    openTreeModal(type, index) {
      // this.userType = type
      this.index = index
      this.$refs.modal.open()
    },
    handleAddEditOk() {
      for (let i = 0; i < this.list.length; i++) {
        let item = this.list[i]
        if (!item.name) {
          return this.$notification['error']({
            message: '系统通知',
            description: '请填写完整表格'
          })
        }
      }
      let arr = this.list.map(item => {
        return {
          sysChannelOrder: item.sysChannelOrder,
          name: item.name,
          desc: item.desc,
          orgUsers: item.orgUsers,
          userNames: item.userNames,
          id: this.id || ''
        }
      })
      saveSysChannel({ SysChannels: JSON.stringify(arr), parentSysChannel: this.parentId || '' })
        .then(res => {
          this.confirmAddEditLoading = true
          if (res.code === 200) {
            this.$notification['success']({
              message: '系统通知',
              description: '操作完成'
            })
            this.$emit('refresh')
            this.handleAddEditCancel()
          }
        })
        .catch(err => {})
        .finally(() => {
          this.confirmAddEditLoading = false
        })
    },
    handleAddEditCancel() {
      this.visibleAddEdit = false
    },
    openModal() {
      this.visibleAddEdit = true
    },
    //数据回填
    backingData(record) {
      console.log(record)
      this.list = []
      this.list.push({
        desc: record.desc,
        name: record.name,
        userNames: record.userList ? record.userList.map(item => item.name).join(',') : '',
        orgUsers: record.userList ? record.userList.map(item => item.id).join(',') : '',
        sysChannelOrder: record.order
      })
    },
    // 验证
    validateData() {
      return this.form.validateFields()
    },
    // 重置form
    _reset() {
      this.list = [{ sysChannelOrder: '', name: '', desc: '', orgUsers: '', userNames: '', id: '' }]
      // this.form.resetFields()
    }
  }
}
</script>

<style scoped lang="less">
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
</style>
