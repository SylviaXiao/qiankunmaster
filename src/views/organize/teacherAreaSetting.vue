<template>
  <div class="TeacherSetting-wrapper">
    <a-card :bordered="false" :style="{ margin: '20px 0' }">
      <search-com-pro
        :style="{ padding: '10px 0' }"
        @searchSubmit="searchSubmit"
        :searchParams="searchParams"
      ></search-com-pro>
    </a-card>
    <a-card :bordered="false">
      <div class="table-wrapper">
        <div class="btn-group">
          <perm-box perm="organize:tas-allocation:education:save">
            <a-button icon="plus-circle" type="primary" @click="saveTeacherSetting()">新增</a-button>
          </perm-box>
        </div>
        <perm-box perm="organize:tas-allocation:education:view">
          <s-table ref="table" :columns="roleColumns" :data="loadData" rowKey="id">
            <span slot="state" slot-scope="text, record">
              <perm-box :text="record.state == 'Y' ? '启用' : '禁用'" perm="education:TeacherSetting:status">
                <a-switch @change="changeStatus($event, record)" v-model="record.state == 'Y' ? true : false">
                  <a-icon type="check" slot="checkedChildren" />
                  <a-icon type="close" slot="unCheckedChildren" />
                </a-switch>
              </perm-box>
            </span>
            <span slot="action" slot-scope="text, record">
              <perm-box perm="organize:tas-allocation:education:save">
                <a href="javascript:;" @click="saveTeacherSetting(record)">编辑</a>
              </perm-box>
              <perm-box perm="organize:tas-allocation:education:del">
                <a href="javascript:;" @click="removeTeacherSetting(record)">删除</a>
              </perm-box>
            </span>
          </s-table>
        </perm-box>
      </div>
    </a-card>
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      v-model="saveModalVisible"
      :title="modalName"
      @ok="sendForm()"
      :confirmLoading='confirmLoading'
      okText="提交"
    >
      <a-spin :spinning="spinning">
        <a-form :form="teacherSettingForm">
            <a-form-item v-bind="formLayout" label="负责人">
              <a-input-search
                v-decorator="[`educator`, { rules: [{ required: true, message: '请选择负责人' }] }]"
                placeholder="点右侧图标选择"
                read-only
                style="width: 100%"
                @search="orgUserClick(`educator`)"
              />
            </a-form-item>
            <a-form-item v-bind="formLayout" label="地区">
              <a-select :allowClear="true" v-decorator="[`orgDeptIds`, { rules: [{ required: true, message: '请选择地区' }] }]" mode='multiple' placeholder="请选择地区 ">
                <a-select-option v-for="(item, index) in cityArr" :key="index" :value="item.id">{{ item.deptName }}</a-select-option>
              </a-select>
            </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
    <i-modal ref="imodal" :multiple="false" :userType="userType" @getBackData="getUserBack"> </i-modal>
  </div>
</template>
<script>
import { STable, SearchComPro, } from '@/components'
import PermBox from '@/components/PermBox'
import IModal from '@/components/InnerModal'
import { formLayout } from './organizeConst'
import { pageEduTeacherSetting, removeEduTeacherSetting, enableTeacherSetting, saveEduTeacherSetting, listEduType } from '@/api/education'
import { listArea, listEduDance, listEduType as listEduTypeCommon } from '@/api/common'
import {
  pageEduUserAllocationSetting,
  removeEduUserAllocationSettingById,
  saveEduUserAllocationSetting
} from '@/api/organize'
import { getSchoolList } from '@/api/education/card'

const roleColumns = [
  {
    title: '负责人',
    dataIndex: 'userName',
    key: 'userName',
  },
  {
    title: '地区',
    dataIndex: 'deptName',
    key: 'deptName',
  },
  // {
  //   title: '职位',
  //   dataIndex: 'desc',
  //   key: 'desc',
  // },
  {
    title: '操作',
    key: 'action',
    width: '150px',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  name: 'TeacherSetting',
  components: {
    SearchComPro,
    STable,
    PermBox,
    IModal
  },
  data() {
    return {
      roleColumns,
      queryParam: {},
      loadData: parameter => {
        return pageEduUserAllocationSetting(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      },
      formLayout,
      saveModalVisible: false,
      modalName: '新增',
      cityArr:[],
      spinning: false,
      confirmLoading:false,
      formValues: {},
      //搜索
      searchParams: [
        {
          type: 'chooseModal',
          key: 'educator',
          label: '选择负责人',
          placeholder: '请选择负责人'
        },
        {
          type: 'select',
          key: 'orgDeptId',
          label: '选择地区',
          placeholder: '请选择地区',
          apiOption: {
            api: listArea,
            string: 'deptName',
            value: 'id'
          }
        },
      ],
      userType: 'educator',
      positionName:''
    }
  },
  beforeCreate() {
    this.teacherSettingForm = this.$form.createForm(this)
  },
  created() {},
  methods: {
    getUserBack(data, type) {
      const { name, id ,positionName} = data
      // if(positionName!==this.positionName)
      // this.teacherSettingForm.setFieldsValue({ orgDeptId: '' })
      this.formValues[`${type}Name`] = name
      this.formValues[`${type}Id`] = id
      this.teacherSettingForm.setFieldsValue({ [type]: name })
      // this.positionName=positionName
    },
    orgUserClick(type) {
      this.userType = type
      this.$refs.imodal.open()
    },
    searchSubmit(data) {
      this.queryParam = data
      this._refreshTable()
    },
    saveTeacherSetting(data) {
      !data ? this.addTeacherSetting() : this.editTeacherSetting(data)
    },
    initTeacherSettingFrom() {
      return new Promise((resolve, reject) => {
        this.formValues = {}
        this.confirmLoading=false
        this.teacherSettingForm.resetFields()
        resolve()
      })
    },
    getcityArr() {
      return new Promise((resolve, reject) => {
        listArea()
          .then(res => {
            this.cityArr = res.data
            resolve()
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    addTeacherSetting() {
      this.modalName = '新增'
      this.getcityArr()
        .then(() => {
          this.saveModalVisible = true
          this.initTeacherSettingFrom()
        })
    },
    editTeacherSetting(data) {
      const { id ,orgUserId,orgdeptIds,userName} = data
      console.log(222,id)
      this.spinning = true
      this.modalName = '编辑'
      let that = this
      this.getcityArr()
        .then(() => {
          this.saveModalVisible = true
          this.spinning = false
          this.$nextTick(() => {
            that.initTeacherSettingFrom()
            that.teacherSettingForm.setFieldsValue({ ['educator']: userName })
            that.teacherSettingForm.setFieldsValue({ ['orgDeptIds']: orgdeptIds.split(',') })
            this.formValues[`educatorName`] = userName
            this.formValues[`educatorId`] = orgUserId
            this.formValues.id = id
          })
        })
    },
    removeTeacherSetting(data) {
      const _this = this,
        { id } = data
      this.$confirm({
        title: '系统提示',
        content: '确认删除该条数据吗?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          removeEduUserAllocationSettingById(id).then(res => {
            _this.$notification['success']({
              message: '系统通知',
              description: '操作成功'
            })
            _this.$refs.table.refresh()
          })
        }
      })
    },
    sendForm() {
      this.teacherSettingForm.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading=true
          const { orgDeptIds} = values
          console.log(111,orgDeptIds)
          let params = {
            orgUserId: this.formValues['educatorId'],
            orgDeptIds:orgDeptIds.join(','),
            id:this.formValues.id
          }
          console.log(222)
          saveEduUserAllocationSetting(params).then(res => {
            this.$notification['success']({
              message: '系统通知',
              description: '提交成功'
            })
            this.confirmLoading=false
            this.saveModalVisible = false
            this._refreshTable()
          }).catch(()=>{
            this.confirmLoading=false
          })
        }
      })
    },
    _refreshTable() {
      this.$refs.table.refresh()
    }
  }
}
</script>

<style scoped lang="less">
.TeacherSetting-wrapper {
  .search-card {
    margin: 20px 0;

    .search-group {
    }
  }

  .table-wrapper {
    .btn-group {
      margin-bottom: 20px;
    }
  }
}
</style>
