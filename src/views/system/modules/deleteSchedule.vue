<template>
  <div class="test-page-wrapper">
    <perm-box perm="student:card:valid:save">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="分馆" prop="schools">
          <a-tree-select
            :show-search="true"
            treeNodeFilterProp="title"
            v-model="form.schools"
            :multiple="true"
            tree-default-expand-all
            :replace-fields="replaceFields"
            placeholder="请选择分馆"
            :dropdownStyle="{
              maxHeight: '400px',
              overflow: 'auto'
            }"
            :treeData="deptList"
          />
        </a-form-model-item>
        <a-form-model-item label="截止时间" prop="endDate">
          <a-date-picker
            format="YYYY-MM-DD"
            valueFormat="YYYY-MM-DD"
            v-model="form.endDate"
            show-time
            type="date"
            placeholder="请选择截止时间"
            style="width: 100%;"
          />
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" @click="onSubmit">
            提交
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </perm-box>
  </div>
</template>

<script>
import moment from 'moment'
import { getSchoolList } from '@/api/education/card'
import { removeEduDancePlanSchool } from '@/api/common'
export default {
  name: 'stuCardOff',
  data() {
    return {
      schools: [],
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      deptList: [],
      form: {
        schools: [],
        endDate: null
      },
      replaceFields: {
        children: 'children',
        title: 'deptName',
        value: 'id'
      },
      rules: {
        schools: [{ required: true, message: '请选择分馆', trigger: 'change' }],
        endDate: [{ required: true, message: '请选择截止时间', trigger: 'change' }]
      }
    }
  },
  components: {},
  created() {
    this.getALLDeptSchools()
  },
  methods: {
    onSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let params = JSON.parse(JSON.stringify(this.form))
          params.schools = params.schools.join(',')
          removeEduDancePlanSchool(params)
            .then(res => {
              if (res.code == 200) {
                this.form = {
                  schools: [],
                  typeId: null,
                  day: null
                }
                this.$notification['success']({
                  message: '系统通知',
                  description: '操作成功'
                })
              }
            })
            .catch(err => {})
        }
      })
    },
    getALLDeptSchools() {
      getSchoolList().then(res => {
        this.deptList = res.data
        this.rewriteDataTree(this.deptList)
      })
    },
    rewriteDataTree(data, parent) {
      data.forEach((item, index) => {
        if (item.title && item.key && item.value) {
          return false
        }
        item.title = item.name || item.deptName
        item.value = item.id
        item.disabled = !!!parent
        if (item.children && item.children.length > 0) {
          this.rewriteDataTree(item.children, 'parent')
        }
      })
    }
  }
}
</script>

<style scoped lang="less" scoped></style>
