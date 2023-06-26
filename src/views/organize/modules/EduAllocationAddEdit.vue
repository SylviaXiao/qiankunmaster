<template>
  <div class="stu-leave-addedit">
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :title="title"
      :visible="visibleAddEdit"
      @ok="handleAddEditOk"
      :confirmLoading="confirmAddEditLoading"
      @cancel="handleAddEditCancel"
    >
      <div>
        <a-form :form="formEdit">
          <a-row :gutter="8">
            <a-col :lg="24" :md="24" :sm="24">
              <a-form-item v-bind="formLayout" label="负责人">
                <a-input-search
                  v-decorator="[`educator,photographer,curator`, { rules: [{ required: true, message: '请选择地区' }] }]"
                  placeholder="点右侧图标选择"
                  read-only
                  style="width: 100%"
                  @search="orgUserClick(`educator,photographer,curator`)"
                />
                <!-- <a-input style="width: 100%" disabled placeholder="点右侧图标选择" v-decorator="[`educator`,{rules: [{required: true, message: '请选择地区'}]}]">
                  <a-icon slot="addonAfter" type="search" @click="orgUserClick('educator,photographer')" />
                </a-input> -->
              </a-form-item>
            </a-col>
            <a-col :lg="24" :md="24" :sm="24" v-if='positionName==="店长"'>
              <a-form-item v-bind="formLayout" label="分馆">
                <a-tree-select
                  style="width:100%"
                  v-decorator="[`orgDeptId`, { rules: [{ required: true, message: '请选择分馆' }] }]" placeholder="请选择分馆 "
                  :allowClear="true"
                  :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                  :treeData="schoolList"
                  treeDefaultExpandAll
                  :multiple="false"
                />
              </a-form-item>
            </a-col>

            <a-col v-else :lg="24" :md="24" :sm="24">
              <a-form-item v-bind="formLayout" label="地区">
                <a-select :allowClear="true" v-decorator="[`orgDeptId`, { rules: [{ required: true, message: '请选择地区' }] }]" placeholder="请选择地区 ">
                  <a-select-option v-for="(item, index) in cityArr" :key="index" :value="item.id">{{ item.deptName }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :lg="24" :md="24" :sm="24">
              <a-form-item label="人群" v-bind="formLayout">
                <a-select
                  mode="multiple"
                  :allowClear="true"
                  placeholder="请选择人群"
                  v-decorator="['crowd', { rules: [{ required: true, message: '请选择人群' }] }]"
                >
                  <a-select-option :allowClear="true" :value="item.id" v-for="(item, index) in crowdList" :key="index">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :lg="24" :md="24" :sm="24">
              <a-form-item v-bind="formLayout" label="查看数据舞种">
                <a-select
                  mode="multiple"
                  :allowClear="true"
                  v-decorator="[`eduDanceId`, { rules: [{ required: false, message: '请选择查看数据舞种' }] }]"
                  placeholder="请选择查看数据舞种 "
                >
                  <a-select-option v-for="(item, index) in eduDanceArr" :key="index" :value="item.id">{{ item.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :lg="24" :md="24" :sm="24">
              <a-form-item v-bind="formLayout" label="打分推送舞种">
                <a-select
                  mode="multiple"
                  :allowClear="true"
                  v-decorator="[`eduDanceAllocId`, { rules: [{ required: false, message: '请选择打分推送舞种' }] }]"
                  placeholder="请选择打分推送舞种 "
                >
                  <a-select-option v-for="(item, index) in eduDanceArr" :key="index" :value="item.id">{{ item.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-modal>
    <i-modal ref="imodal" :multiple="false" :userType="userType" @getBackData="getUserBack"> </i-modal>
  </div>
</template>
<script>
import { findEduUserAllocation, saveEduUserAllocation } from '@/api/organize'
import { listArea, listEduDance } from '@/api/common'
import { formLayout } from '../organizeConst'
import IModal from '@/components/InnerModal'
import { getSchoolList } from '@/api/education/card'
export default {
  components: {
    IModal
  },
  props: {
    title: {
      type: String,
      default: '学员请假'
    },
    stuId: String
  },
  data() {
    return {
      schoolList: [],
      positionName:'',
      crowdList: [{ id: '1', name: '成人' }, { id: '2', name: '少儿' }], //人群
      userType: 'all',
      imodalValue: {},
      cityArr: [],
      eduDanceArr: [],
      id: '',
      formLayout,
      visibleAddEdit: false,
      confirmAddEditLoading: false
    }
  },
  computed: {
    addMode() {
      return !this.id
    }
  },
  beforeCreate() {
    this.formEdit = this.$form.createForm(this)
  },
  methods: {
    handleAddEditOk(openId) {
      this.validateData()
        .then(res => {
          const { orgDeptId, eduDanceId, eduDanceAllocId, crowd } = res
          let params = {
            orgUserId: this.imodalValue['educator,photographer,curatorId'],
            orgDeptId,
            eduDanceId: Array.isArray(eduDanceId) && eduDanceId.length > 0 ? eduDanceId.join(',') : '',
            eduDanceAllocId: Array.isArray(eduDanceAllocId) && eduDanceAllocId.length > 0 ? eduDanceAllocId.join(',') : '',
            crowd: crowd.join(',')
          }
          if (this.id) {
            params.id = this.id
          }
          return saveEduUserAllocation(params)
        })
        .then(res => {
          if (res.code === 200) {
            this.$notification['success']({
              message: '系统提示',
              description: '已操作成功'
            })
            this.refreshTable()
            this.handleAddEditCancel()
          }
        })
        .finally(() => {
          this.confirmAddEditLoading = false
        })
    },
    handleAddEditCancel() {
      this.visibleAddEdit = false
    },
    open() {
      this.visibleAddEdit = true
      this.resetForm()
      this.initForm()
    },
    backindData(record) {
      this.positionName=record.positionName
      findEduUserAllocation(record.id)
        .then(res => {
          const { orgUserId, userName, orgDeptId, danceData, danceAllocData, trCrowd } = res.data || {}
          this.id = record.id
          this.imodalValue['educator,photographer,curatorId'] = orgUserId
          let eduDanceId = Array.isArray(danceData) && danceData.length > 0 ? danceData.map(d => d.danceId) : []
          let eduDanceAllocId = Array.isArray(danceAllocData) && danceAllocData.length > 0 ? danceAllocData.map(d => d.danceId) : []
          let crowd = trCrowd ? trCrowd.split(',') : []
          let formData = {
            ['educator,photographer,curator']: userName,
            orgDeptId,
            eduDanceId,
            eduDanceAllocId,
            crowd
          }
          this.$nextTick(() => {
            this.formEdit.setFieldsValue(formData)
          })
        })
    },
    orgUserClick(type) {
      this.userType = type
      this.$refs.imodal.open()
    },
    getUserBack(data, type) {
      const { name, id ,positionName} = data
      if(positionName!==this.positionName) this.formEdit.setFieldsValue({ orgDeptId: '' })
      this.imodalValue[`${type}Name`] = name
      this.imodalValue[`${type}Id`] = id
      this.formEdit.setFieldsValue({ [type]: name })
      this.positionName=positionName
    },
    validateData() {
      return this.formEdit.validateFields()
    },
    initForm() {
      listArea().then(res => {
        this.cityArr = res.data
      })
      listEduDance().then(res => {
        this.eduDanceArr = res.data
      })
      getSchoolList().then(res => {
        if (res.code === 200 && res.data) {
          this.schoolList = this._handleData(res.data)
        }
      })
    },
    //处理分馆数据
    _handleData(data) {
      return data.map((item, index) => {
        let itemObj = {}
        itemObj.title = item.deptName
        itemObj.value = item.id
        itemObj.key = item.id
        if (item.children) {
          itemObj.children = this._handleData(item.children)
          itemObj.selectable = false
          itemObj.disabled = true
        }
        return itemObj
      })
    },
    resetForm() {
      this.id = ''
      this.userType = 'all'
      this.cityArr = []
      this.eduDanceArr = []
      this.formEdit.resetFields()
    },
    refreshTable() {
      this.$emit('refresh')
    }
  }
}
</script>

<style scoped lang="less">
.stu-leave-addedit {
}
</style>
