<template>
  <div class="test-page-wrapper">
    <perm-box perm="student:card:valid:save">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="分馆" prop="schools">
          <a-tree-select :show-search="true" treeNodeFilterProp="title" v-model="form.schools" :multiple="false"
            tree-default-expand-all :replace-fields="replaceFields" placeholder="请选择分馆" :dropdownStyle="{
              maxHeight: '400px',
              overflow: 'auto'
            }" :treeData="deptList" />
        </a-form-model-item>
        <div class="flex">
          <div class="flex-1">
            <a-form-model-item required label="类型" prop="type" :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }">
              <a-select v-model="form.type" placeholder="请选择类型" @change="handleTypeChange">
                <a-select-option v-for="item in [{ label: '卡种班型', value: 'A' }, { label: '卡种人群', value: 'B' }]"
                  :value="item.value" :key="`type - ${item.value}`">
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </div>
          <div class="flex-1 pl-8">
            <!-- <div v-if="form.type === 'A'" class="flex"> -->
            <!-- <div class="flex-1">
                <a-form-model-item required prop="eduTypeId" :labelCol="{ span: 0 }" :wrapperCol="{ span: 24 }">
                  <a-select v-model="form.eduTypeId" placeholder="请选择大班型" @change="form.eduClassTypeIds = null">
                    <a-select-option v-for="item in eduTypeList" :value="item.id" :key="item.id">
                      {{ item.name }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </div> -->
            <!-- <div class="flex-1"> -->
            <a-form-model-item v-if="form.type === 'A'" prop="eduClassTypeIds" :labelCol="{ span: 6 }"
              :wrapperCol="{ span: 24 }">
              <a-tree-select multiple treeCheckable v-model="form.eduClassTypeIds" treeNodeFilterProp="title"
                tree-default-expand-all :replace-fields="{ title: 'name', value: 'id', children: 'children' }"
                placeholder="请选择班型" :dropdownStyle="{
                  maxHeight: '400px',
                  overflow: 'auto'
                }" :treeData="eduTypeList" />
              <!-- <a-select v-model="form.eduClassTypeIds" placeholder="请选择班型">
                  <a-select-option v-for="item in eduClassList" :value="item.id" :key="`eduClassTypeIds - ${item.id}`">
                    {{ item.name }}
                  </a-select-option>
                </a-select> -->
            </a-form-model-item>
            <!-- </div> -->
            <!-- </div> -->
            <a-form-model-item v-else-if="form.type === 'B'" prop="crowdType" :labelCol="{ span: 6 }"
              :wrapperCol="{ span: 18 }">
              <a-select v-model="form.crowdType" placeholder="请选择人群">
                <a-select-option v-for="item in [{ label: '成人', value: 'A' }, { label: '少儿', value: 'B' }]"
                  :value="item.value" :key="`crowdType - ${item.value}`">
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </div>
        </div>
        <a-form-model-item label="停课开始时间" required prop="stopDate">
          <a-date-picker v-model="form.stopDate" @change="handleDateChange" />
        </a-form-model-item>
        <a-form-model-item label="复课时间" required prop="restartDate">
          <a-date-picker v-model="form.restartDate" :disabledDate="disabledDate" @change="handleDateChange" />
        </a-form-model-item>
        <a-form-model-item label="延长天数" required prop="day">
          <a-input-number disabled v-model="form.day" />
        </a-form-model-item>
        <a-form-model-item label="学员卡ID" prop="cardIds">
          <a-input v-model="form.cardIds" />
        </a-form-model-item>
        <a-form-model-item label="备注" prop="remark">
          <a-textarea v-model="form.remark" rows="4" placeholder="请输入描述" />
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" :loading="submitLoading" @click="onSubmit">
            提交
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </perm-box>
    <div class="mt20">
      <s-table ref="table" :columns="columns" :data="loadData" rowKey="id">
        <a-icon slot="filterIcon" slot-scope="filtered" type="search"
          :style="{ color: filtered ? '#1ba97b' : undefined }" />
        <div slot="filterDropdown" slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
          class="pa-10" style="width: 240px;">
          <template v-if="column.dataIndex === 'createDate'">
            <a-range-picker :value="getFilterDate(column.dataIndex)"
              @change="handleFilterDateChange($event, column.dataIndex)" />
          </template>
          <template v-if="column.dataIndex === 'deptName'">
            <a-tree-select style="width:200px" :show-search="true" treeNodeFilterProp="title" v-model="queryParams.deptId" :multiple="false"
              tree-default-expand-all :replace-fields="replaceFields" placeholder="请选择分馆" :dropdownStyle="{
                maxHeight: '400px',
                overflow: 'auto'
              }" :treeData="deptList" />
          </template>
          <template v-else-if="column.dataIndex === 'eduTypeName'">
            <a-input v-model="queryParams.text" placeholder="请输入班型/人群"></a-input>
          </template>
          <template v-else-if="column.dataIndex === 'stopDate'">
            <a-range-picker :value="getFilterDate(column.dataIndex)"
              @change="handleFilterDateChange($event, column.dataIndex)" />
          </template>
          <template v-else-if="column.dataIndex === 'restartDate'">
            <a-range-picker :value="getFilterDate(column.dataIndex)"
              @change="handleFilterDateChange($event, column.dataIndex)" />
          </template>
          <div class="flex mt-10">
            <a-button type="primary" size="small" @click="handleSearch(clearFilters, confirm, column.dataIndex)">
              搜索
            </a-button>
            <a-button class="ml-10" size="small" @click="handleSearchReset(clearFilters, column.dataIndex)">
              重置
            </a-button>
          </div>
        </div>
        <span slot="action" slot-scope="text, record">
          <perm-box perm="student:card:valid:down">
            <a @click="downloadFile(record)">下载附件</a>
          </perm-box>
        </span>
      </s-table>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { getSchoolList } from '@/api/education/card'
import { STable } from '@/components'
import PermBox from '@/components/PermBox'
import { treeEduClassType, saveExtValidStudentCard, listStuCardExtVaildLog } from '@/api/common'
import { downloadCardValid } from '@/api/system'
let columns = [
  {
    title: '操作时间',
    align: 'center',
    dataIndex: 'createDate',
    scopedSlots: {
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon'
    }
  },
  {
    title: '分馆',
    align: 'center',
    dataIndex: 'deptName',
    scopedSlots: {
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon'
    }
  },
  {
    title: '班型/人群',
    align: 'center',
    dataIndex: 'eduTypeName',
    scopedSlots: {
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon'
    },
    customRender: (val, record) => {
      if (record.eduTypeName) {
        return `${record.eduTypeName}/${record.eduClassTypeName || ''}`
      }
      if (record.crowdType === 'A') return '成人'
      if (record.crowdType === 'B') return '少儿'
      return val
    }
  },
  {
    title: '停课开始时间',
    align: 'center',
    dataIndex: 'stopDate',
    scopedSlots: {
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon'
    }
  },
  {
    title: '复课时间',
    align: 'center',
    dataIndex: 'restartDate',
    scopedSlots: {
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon'
    }
  },
  {
    title: '延长天数',
    align: 'center',
    dataIndex: 'validDay'
  },
  {
    title: '操作人',
    align: 'center',
    dataIndex: 'userName'
  },
  {
    title: '生效卡种',
    align: 'center',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  name: 'stuCardOff',
  components: {
    STable,
    PermBox
  },
  data() {
    return {
      loadData: parameter => {
        return listStuCardExtVaildLog({ ...parameter, ...this.queryParams }).then(res => {
          return res
        })
      },
      moment,
      queryParams: {
        deptId: null, //
        text: null, // 
        startDate: null, // 
        endDate: null,
        startStopDate: null,
        endStopDate: null,
        startRestartDate: null,
        endRestartDate: null
      },
      columns,
      schools: [],
      labelCol: { span: 3 },
      wrapperCol: { span: 9 },
      other: '',
      deptList: [],
      eduTypeList: [],
      form: {
        type: 'A',
        schools: [],
        eduTypeId: null,
        eduClassTypeIds: null,
        crowdType: null,
        day: null,
        cardIds: null,
        stopDate: null,
        restartDate: null,
        day: null,
        remark: 'it部操作，疫情导致学员卡批量延期',
      },
      replaceFields: {
        children: 'children',
        title: 'deptName',
        value: 'id'
      },
      rules: {
        type: [{ required: true, message: '请选择类型', trigger: 'change' }],
        schools: [{ required: true, message: '请选择分馆', trigger: 'change' }],
        eduTypeId: [{ required: false, message: '请选择大班型', trigger: 'change' }],
        eduClassTypeIds: [{ required: false, message: '请选择小班型', trigger: 'change' }],
        crowdType: [{ required: false, message: '请选择人群', trigger: 'change' }],
        day: [{ required: true, message: '请输入延长天数', trigger: 'change' }],
        stopDate: [{ required: true, message: '请输入停课开始时间', trigger: 'change' }],
        restartDate: [{ required: true, message: '请输入复课时间', trigger: 'change' }]
      },
      submitLoading: false
    }
  },
  created() {
    this.getALLDeptSchools()
  },
  computed: {
    eduClassList() {
      let list = this.eduTypeList?.filter(item => {
        return item.id == this.form.eduTypeId
      })
      return list?.length > 0 ? list[0].children : []
    }
  },
  methods: {
    _refreshTable() {
      this.$refs.table.refresh()
    },
    disabledDate(current) {
      if (!this.form.stopDate) return true
      return current < this.form.stopDate.endOf('day')
    },
    handleTypeChange(value) {
      this.form.eduTypeId = null
      this.form.eduClassTypeIds = null
      this.form.crowdType = null
      const isEdu = value === 'A'
      this.rules.eduTypeId[0].required = isEdu
      this.rules.eduClassTypeIds[0].required = isEdu
      this.rules.crowdType[0].required = !isEdu
    },
    // 停课开始时间和复课时间改变
    handleDateChange() {
      if (this.form.stopDate && this.form.restartDate) {
        this.form.day = this.form.restartDate.diff(this.form.stopDate, 'days') + 1
      }
    },

    onSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let params = { ...this.form }
          params.stopDate = params.stopDate.format('YYYY-MM-DD')
          params.restartDate = params.restartDate.format('YYYY-MM-DD')
          params.eduClassTypeIds = params.eduClassTypeIds?.join(',')
          // params.schools = params.schools.join(',')
          this.submitLoading = true
          saveExtValidStudentCard(params)
            .then(res => {
              if (res.code == 200) {
                this.form = {
                  schools: [],
                  eduTypeId: null,
                  eduClassTypeIds: null,
                  crowdType: null,
                  day: null,
                  cardIds: null,
                  stopDate: null,
                  restartDate: null,
                  day: null
                }
                this.$notification['success']({
                  message: '系统通知',
                  description: '操作成功'
                })
                this._refreshTable()
              }
            })
            .finally(() => {
              this.submitLoading = false
            })
        }
      })
    },
    getALLDeptSchools() {
      getSchoolList().then(res => {
        this.deptList = res.data
        this.rewriteDataTree(this.deptList)
      })
      treeEduClassType().then(res => {
        this.eduTypeList = res.data
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
    },
    async downloadFile(record) {
      const { id, deptName } = record
      let res = await downloadCardValid({ logId: id })
      this.$tools.exportExcel(res, `${deptName} - 生效卡种`)
    },
    getFilterDate(dataIndex) {
      if (dataIndex === 'createDate') {
        return this.queryParams.startDate && this.queryParams.endDate ? [moment(this.queryParams.startDate), moment(this.queryParams.endDate)] : null
      } else if (dataIndex === 'stopDate') {
        return this.queryParams.startStopDate && this.queryParams.endStopDate ? [moment(this.queryParams.startStopDate), moment(this.queryParams.endStopDate)] : null
      } else if (dataIndex === 'restartDate') {
        return this.queryParams.startRestartDate && this.queryParams.endRestartDate ? [moment(this.queryParams.startRestartDate), moment(this.queryParams.endRestartDate)] : null
      }
    },
    handleFilterDateChange(date, dataIndex) {
      const date0 = date[0].format('YYYY-MM-DD')
      const date1 = date[1].format('YYYY-MM-DD')
      if (dataIndex === 'createDate') {
        this.queryParams.startDate = date0
        this.queryParams.endDate = date1
      } else if (dataIndex === 'stopDate') {
        this.queryParams.startStopDate = date0
        this.queryParams.endStopDate = date1
      } else if (dataIndex === 'restartDate') {
        this.queryParams.startRestartDate = date0
        this.queryParams.endRestartDate = date1
      }
    },
    handleSearch(clearFilters, confirm, dataIndex) {
      this._refreshTable()
    },
    handleSearchReset(clearFilters, dataIndex) {
      this.queryParams = {
        deptId: null,
        text: null,
        startDate: null,
        endDate: null,
        startStopDate: null,
        endStopDate: null,
        startRestartDate: null,
        endRestartDate: null
      }
      this._refreshTable()
      clearFilters()
    }
  }
}
</script>

<style scoped lang="less" scoped>
.ant-table-thead>tr>th .ant-table-filter-icon {
  right: unset;
}
</style>
