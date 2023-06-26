<template>
  <div class="test-address-wrapper">
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :width="800"
      :title="title"
      :visible="visibleAddEdit"
      @ok="handleAddEditOk"
      :confirmLoading="confirmAddEditLoading"
      @cancel="handleAddEditCancel"
    >
      <div>
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="formLayout.labelCol" :wrapper-col="formLayout.wrapperCol">
          <a-form-model-item label="报考日期" required prop="siteDate">
            <a-date-picker format="YYYY-MM-DD" valueFormat="YYYY-MM-DD" v-model="form.siteDate" type="date" placeholder="请输入报考日期" style="width: 100%;" />
          </a-form-model-item>
          <a-form-model-item label="舞种" prop="danceId">
            <a-select :allowClear="true" v-model="form.danceId" placeholder="请选择舞种">
              <a-select-option :allowClear="true" v-for="item in danceArr" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="类型" prop="type">
            <a-select v-model="form.type" placeholder="请选择类型">
              <a-select-option value="A">
                成人
              </a-select-option>
              <a-select-option value="B">
                少儿
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item ref="gradeName" label="考级名称" prop="gradeName">
            <a-input v-model="form.gradeName" />
            <p style="padding: 0px; margin: 0;line-height: 1;color: rgb(0 0 0 / 50%);">
              年份+地区+舞种+考级期数 例如，2022年武汉中国舞少儿考级1期
            </p>
          </a-form-model-item>
          <a-form-model-item label="承办单位" prop="organizerId">
            <a-select :allowClear="true" v-model="form.organizerId" placeholder="请选择承办单位">
              <a-select-option :allowClear="true" v-for="item in siteArr" :key="item.id" :value="item.id">{{ item.organizerName }}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="地区" prop="deptId">
            <a-select :allowClear="true" v-model="form.deptId" placeholder="请选择地区">
              <a-select-option :allowClear="true" v-for="item in deptIdList" :key="item.id" :value="item.id">{{ item.areaName }}</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-form-model>
      </div>
    </a-modal>
  </div>
</template>
<script>
import moment from 'moment'
import { listCerOrganizer, certSaveSite, listSiteById, saveAndPaidGrading, saveClassPaidGrading, commonCerDanceList } from '@/api/certificate/certificate'
import { formLayout, formBigLayout, columnsCer } from '../certificate'
export default {
  props: {
    title: String,
    record: Object
  },
  data() {
    return {
      formLayout,
      formBigLayout,
      visibleAddEdit: false,
      confirmAddEditLoading: false,
      // 考点集合
      siteArr: [],
      danceArr: [], //舞种集合
      deptIdList: [],
      form: {
        siteDate: undefined,
        danceId: '',
        gradeName: '',
        organizerId: '',
        deptId: '',
        type: ''
      },
      rules: {
        siteDate: [{ required: true, message: '请输入报考日期', trigger: 'change' }],
        danceId: [{ required: true, message: '请选择舞种', trigger: 'change' }],
        gradeName: [{ required: true, message: '请输入考级名称', trigger: 'blur' }, { min: 0, max: 50, message: '不能超过50个字', trigger: 'blur' }],
        organizerId: [{ required: true, message: '请选择承办单位', trigger: 'change' }],
        deptId: [{ required: true, message: '请选择地区', trigger: 'change' }],
        type: [{ required: true, message: '请选择类型', trigger: 'change' }]
      }
    }
  },
  components: {},
  created() {},
  methods: {
    openModal() {
      this.visibleAddEdit = true
      this.initForm()
    },
    backindData(data) {
      let record = JSON.parse(JSON.stringify(data))
      this.gradingId = record.id
      let params = {
        id: record.id,
        siteDate: record.siteDate,
        danceId: record.danceId,
        gradeName: record.gradeName,
        organizerId: record.organizerId,
        deptId: record.deptId,
        type: record.type
      }
      this.form = params
      console.log(this.form)
    },
    handleAddEditOk() {
      console.log(this.form)
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          certSaveSite(this.form)
            .then(res => {
              if (res.code === 200) {
                this.visibleAddEdit = false
                this.$notification['success']({
                  message: '系统通知',
                  description: '已录入成功!'
                })
                this.refreshTable()
              }
            })
            .catch(err => {
              console.log(err)
            })
            .finally(() => {
              this.confirmAddEditLoading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleAddEditCancel() {
      // 重置表单数据
      this.resetForm()
      this.visibleAddEdit = false
    },
    async initForm() {
      let danceArr = await commonCerDanceList()
      this.danceArr = danceArr.data
      let siteArr = await listSiteById()
      this.siteArr = siteArr.data
      let deptIdList = await listCerOrganizer()
      this.deptIdList = deptIdList.data
      console.log(this.title)
      if (this.title == '新增') {
        // 重置表单数据
        this.resetForm()
      }
    },
    resetForm() {
      let that = this
      this.form = {
        siteDate: undefined,
        danceId: '',
        gradeName: '',
        organizerId: '',
        deptId: '',
        type: ''
      }
    },
    refreshTable() {
      this.$emit('refresh')
    }
  }
}
</script>

<style scoped lang="less">
.test-address-wrapper {
}
:global {
  .dynamic-add {
    .ant-form-item {
      margin-bottom: 0;
    }
  }
}
</style>
