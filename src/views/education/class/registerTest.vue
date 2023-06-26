<template>
  <div class="register-test-wrapper">
    <div v-show="!success">
      <a-card :bordered="false" :style="{margin:'20px 0'}" title="报考信息">
        <a-form :form="form">
          <a-row :gutter="8">
            <a-col :lg="16" :md="16" :sm="16">
              <a-row :gutter="8">
                <a-col :lg="12" :md="24" :sm="24">
                  <a-form-item v-bind="formItemLayout" label="专业">
                    <a-input v-decorator="[
                    'professional',
                    {rules: [{ required: false, message: '请输入专业'}]}]"/>
                  </a-form-item>
                </a-col>
                <a-col :lg="12" :md="24" :sm="24">
                  <a-form-item v-bind="formItemLayout" label="级别">
                    <a-input v-decorator="[
                    'cerRank',
                    {rules: [{ required: false, message: '请输入级别'}]}]"/>
                  </a-form-item>
                </a-col>
                <a-col :lg="12" :md="24" :sm="24">
                  <a-form-item v-bind="formItemLayout" label="民族">
                    <a-input v-decorator="[
                    'cerEthnic',
                    {rules: [{ required: false, message: '请输入级别'}]}]"/>
                  </a-form-item>
                </a-col>
                <a-col :lg="12" :md="24" :sm="24">
                  <a-form-item v-bind="formItemLayout" label="国籍">
                    <a-input v-decorator="[
                    'cerNationality',
                    {rules: [{ required: false, message: '请输入级别'}]}]"/>
                  </a-form-item>
                </a-col>
                <a-col :lg="12" :md="12" :sm="24">
                  <a-form-item v-bind="formItemLayout" label="成绩">
                    <a-select :allowClear="true"
                     style="width: 50%;"

                     v-decorator="['cerScore',{rules: [{required: false, message: '请选择'}]}]"
                     placeholder="请选择成绩">
                      <a-select-option :allowClear="true" value="A">合格</a-select-option>
                      <a-select-option :allowClear="true" value="B">不合格</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :lg="12" :md="12" :sm="24">
                  <a-form-item v-bind="formItemLayout" label="考点信息">
                    <a-select :allowClear="true"

                     v-decorator="['siteId',{rules: [{required: true, message: '考点为必填项'}]}]"
                     placeholder="请选择考点">
                      <a-select-option :allowClear="true" v-for="item in siteArr" :key="item.id" :value="item.id">{{item.address}}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-col>
          </a-row>
        </a-form>
      </a-card>
      <a-card :bordered="false" :style="{margin:'20px 0'}">
        <div class="table-wrapper">
          <a-table
            ref="table"
            :pagination = "false"
            :rowSelection="rowSelection"
            :columns="columnsReg"
            :rowKey="record => record.stuId"
            :dataSource="dataSource"
            :loading="loading">
            <!-- <span slot="action" slot-scope="text, record">
              <perm-box perm='education:class:save'>
                <a href="javascript:;" @click="handleEditStu(record)">编辑</a>
              </perm-box>
            </span> -->
          </a-table>
        </div>
      </a-card>
      <a-button type="primary" @click="handleSubmit()" :loading="loadingBtn">提交</a-button>
    </div>
    <div v-show="success">
      <a-card class="card" :bordered='false'>
        <result type="success" description="请关闭该页面" title="提交成功"></result>
      </a-card>
    </div>
    <CertAddEdit :title="addEditTitle" :isResiger="true" :record="recordStu" ref="CertAddEdit" @refresh = "_refreshTable"></CertAddEdit>
  </div>
</template>
<script>
import { formItemLayout, columnsReg } from './class.js'
import { getClassStuList } from '@/api/education'
import { listSite, saveAndPaidGrading } from '@/api/certificate/certificate'
import { Result } from '@/components'
import PermBox from '@/components/PermBox'
import CertAddEdit from '@/views/certificate/modules/CertAddEdit'
export default {
  data() {
    return {
      success: false,
      formItemLayout,
      // table所需
      columnsReg,
      dataSource: null,
      loading: false,
      loadingBtn: false,
      selectedRowKeys: [],

      //通用参数
      classId:'',

      //modal参数
      recordStu: null,
      addEditTitle: '',
      // 考点集合
      siteArr:[]
    }
  },
  components: {
    Result,
    CertAddEdit,
    PermBox,
  },
  computed: {
    rowSelection() {
      const { selectedRowKeys } = this;
      return {
        selectedRowKeys: selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {

          this.selectedRowKeys = selectedRowKeys
        }
      }
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  created() {
    this.classId = this.$route.params.classId
  },
  mounted() {
    this.loadTable()
    this.loadSite()
  },
  methods: {
    handleAddStu() {
      this.addEditTitle = '添加'
      this.$refs.CertAddEdit.openModal()
    },
    handleEditStu(record) {
      this.addEditTitle = '修改'
      this.recordStu = record
      this.$refs.CertAddEdit.openModal()
    },
    handleSubmit() {
      this.validateData().then(formData => {

        let stuIds = {
          stuIds:this.selectedRowKeys.join()
        }
        let params = Object.assign({},formData,stuIds)
        saveAndPaidGrading(params).then(res => {
          if(res.code === 200) {
            this.success = true
          }
        }).catch(err => {
          console.log(err);
        })
      })
    },
    loadTable() {
      this.loading = true
      getClassStuList(this.classId).then(res=>{
        if(res.code===200&&res.data){
          this.dataSource = res.data
        }
      })
      .catch((err)=>{
        console.log(err)
      })
      .finally(() => {
        this.loading = false
      })
    },
    loadSite() {
      listSite().then(res => {
        if (res.code === 200) {
          this.siteArr = res.data
        }
      }).catch(err => {
        console.log(err);
      })
    },
    validateData() {
      return this.form.validateFields()
    },
    _refreshTable() {
      this.loadTable()
    }
  }
}
</script>

<style scoped lang=less>
.register-test-wrapper {
  .btn-wrapper {
    margin: 20px 0;
  }
}
</style>
