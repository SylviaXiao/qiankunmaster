<template>
  <div class="teacher-demand-wrapper">
    <a-card :bordered="false" :style="{ margin: '20px 0' }">
      <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"></search-com-pro>
    </a-card>
    <a-card :bordered="false">
      <div class="btnGroup" style="margin-bottom: 15px;">
        <perm-box perm="salary:teacher-demand:save">
          <a-button icon="plus-circle" type="primary" @click="handleEditStu">新增</a-button>
        </perm-box>
        <perm-box style="margin-left:20px;" perm="salary:interview-phase:save">
          <a-button type="primary" @click="handlePhase()">阶层管理</a-button>
        </perm-box>
      </div>
      <s-table ref="table" size="default" :columns="columns" :data="loadData" rowKey="id">
        职者姓名、手机号、入职时间
        <span slot="interviews" slot-scope="text, record">
          <div v-for="(item, index) in record.interviews" :key="index">
            姓名:{{ item.name }}、手机号:{{ item.phone }}、入职时间:{{ item.inductionDate | filterDate }}
          </div>
        </span>
        <span slot="action" slot-scope="text, record">
          <perm-box perm="salary:teacher-demand:save">
            <a href="#" @click="handleEditStu(record)">修改</a>
          </perm-box>
          <perm-box perm="salary:teacher-demand:del">
            <a href="#" @click="handleRemove(record)">删除</a>
          </perm-box>
        </span>
        <span slot="expectDate" slot-scope="text">
          {{ text | filterDate }}
        </span>
        <span slot="createDate" slot-scope="text">
          {{ text | filterDate }}
        </span>
        <span slot="skill" slot-scope="text">
          <div class="skill_wrapper">
            <a-popover title="特殊要求">
              <template slot="content">
                <div style="width: 400px">{{ text }}</div>
              </template>
              <a-icon type="exclamation-circle" />
            </a-popover>
            {{ text }}
          </div>
        </span>
      </s-table>
    </a-card>
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" title="新增/修改" v-model="stusourceModal" width="800px" @ok="sendForm()" okText="提交">
      <a-form :form="stusourceForm">
        <a-row>
          <a-form-item style="display: none;">
            <a-input v-decorator="['id']" />
          </a-form-item>
          <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <a-form-item label="地区" :labelCol="{ span: 6 }" :wrapperCol="{ span: 16 }">
              <a-select :allowClear="true" placeholder="请选择地区" v-decorator="['areaId', { rules: [{ required: true, message: '请选择地区' }] }]">
                <a-select-option :allowClear="true" :value="item.id" v-for="(item, index) in areaList" :key="index">
                  {{ item.deptName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <a-form-item label="舞种" :labelCol="{ span: 6 }" :wrapperCol="{ span: 16 }">
              <a-select :allowClear="true" placeholder="请选择舞种" v-decorator="['danceId', { rules: [{ required: true, message: '请选择舞种' }] }]">
                <a-select-option :allowClear="true" :value="item.id" v-for="(item, index) in danceList" :key="index">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <a-form-item label="教学对象" :labelCol="{ span: 6 }" :wrapperCol="{ span: 16 }">
              <a-select :allowClear="true" placeholder="请选择教学对象" v-decorator="['target', { rules: [{ required: true, message: '请选择教学对象' }] }]">
                <a-select-option :allowClear="true" value="A">
                  成人
                </a-select-option>
                <a-select-option :allowClear="true" value="B">
                  少儿
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <a-form-item label="舞种阶层" :labelCol="{ span: 6 }" :wrapperCol="{ span: 16 }">
              <a-select :allowClear="true" placeholder="请选择舞种阶层" v-decorator="['phaseId', { rules: [{ required: false, message: '请选择舞种阶层' }] }]">
                <a-select-option :allowClear="true" :value="item.id" v-for="(item, index) in phaseList" :key="index">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <a-form-item label="补充人数" :labelCol="{ span: 6 }" :wrapperCol="{ span: 16 }">
              <a-input-number placeholder="请输入补充人数" :min="0" v-decorator="['num', { rules: [{ required: true, message: '请输入补充人数' }] }]" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <a-form-item label="补充类型" :labelCol="{ span: 6 }" :wrapperCol="{ span: 16 }">
              <a-select :allowClear="true" placeholder="请选择补充类型" v-decorator="['type', { rules: [{ required: true, message: '请选择补充类型' }] }]">
                <a-select-option :allowClear="true" value="A">
                  急招
                </a-select-option>
                <a-select-option :allowClear="true" value="B">
                  储备
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="专攻方向" :labelCol="{ md: 3, sm: 6, xs: 6 }" :wrapperCol="{ md: 14, sm: 14, xs: 18 }">
              <!--<a-input placeholder="请输入专攻方向" v-decorator="['specialty', { rules: [{ required: true, message: '请输入专攻方向' }] }]" />-->
              <a-tree-select
                v-decorator="['specialty', { rules: [{ required: true, message: '请输入专攻方向' }] }]"
                :treeData="specialtyTree"
                :treeDefaultExpandAll="true"
                :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                placeholder="请输入专攻方向"
                multiple
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="特殊要求" :labelCol="{ md: 3, sm: 6, xs: 6 }" :wrapperCol="{ md: 14, sm: 14, xs: 18 }">
              <a-textarea
                placeholder="请输入特殊要求"
                :autosize="{ minRows: 4, maxRows: 8 }"
                v-decorator="['skill', { rules: [{ required: false, message: '请输入特殊要求' }] }]"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <a-form-item label="最晚入职时间" :labelCol="{ span: 6 }" :wrapperCol="{ span: 16 }">
              <a-date-picker
                format="YYYY-MM-DD"
                placeholder="请选择时间"
                v-decorator="['expectDate', { rules: [{ required: true, message: '请选择时间' }] }]"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" title="阶层管理" v-model="phaseModal" width="800px" :footer="null">
      <a-spin :spinning="spinning">
        <edit-table
          :columnsOptions="editColumn"
          :tableArr="editTableList"
          :eidtParams="eidtParams"
          ref="editTable"
          @saved="saveEditLog"
          @delete="deleteEditLog"
        >
        </edit-table>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import { STable, SearchComPro } from '@/components'
import { listTeacherDemand, removeTeacherDemand, saveTeacherDemand, listInterviewPhase, removeInterviewPhase, saveInterviewPhase } from '@/api/education'
import { scopeDanceList, scopeListArea } from '@/api/common'
import PermBox from '@/components/PermBox'
import EditTable from '@/components/EditTable'
const editColumn = [
  {
    title: '阶层名称',
    width: 200,
    dataIndex: 'name',
    input: 'input',
    scopedSlots: { customRender: 'name' }
  }
]

const columns = [
  {
    title: '最晚入职时间',
    dataIndex: 'expectDate',
    scopedSlots: { customRender: 'expectDate' }
  },
  {
    title: '录入时间',
    dataIndex: 'createDate',
    scopedSlots: { customRender: 'createDate' }
  },
  {
    title: '地区',
    dataIndex: 'areaName'
  },
  {
    title: '舞种',
    dataIndex: 'danceName'
  },
  {
    title: '教学对象',
    dataIndex: 'target',
    customRender: (text, record) => (text === 'A' ? '成人' : text === 'B' ? '少儿' : '')
  },
  {
    title: '舞种阶层',
    dataIndex: 'phaseName'
  },
  {
    title: '补充类型',
    dataIndex: 'type',
    customRender: (text, record) => (text === 'A' ? '急招' : text === 'B' ? '储备' : '')
  },
  {
    title: '补充人数',
    dataIndex: 'num'
  },
  {
    title: '专攻方向',
    dataIndex: 'specialty'
  },
  {
    title: '特殊要求',
    dataIndex: 'skill',
    scopedSlots: { customRender: 'skill' }
  },
  {
    title: '入职情况',
    dataIndex: 'interviews',
    scopedSlots: { customRender: 'interviews' }
  },
  {
    title: '操作',
    key: 'action',
    width: '150px',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  name: 'stusource',
  components: {
    EditTable,
    SearchComPro,
    PermBox,
    STable
  },
  data() {
    return {
      // editTable
      editColumn,
      editTableList: [],
      phaseModal: false,
      eidtParams: {
        name: null
      },
      spinning: false,

      areaList: [],
      danceList: [],
      phaseList: [],
      columns,
      stusourceList: [],
      tableLoading: false,
      formValues: {},
      stusourceModal: false,
      searchParams: [
        {
          type: 'date',
          key: 'DateCreate',
          label: '录入时间',
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD'
        },
        {
          type: 'select',
          key: 'areaId',
          label: '地区',
          placeholder: '请选择地区',
          apiOption: {
            api: scopeListArea,
            string: 'deptName',
            value: 'id'
          }
        },
        {
          type: 'select',
          key: 'danceId',
          label: '舞种',
          placeholder: '请选择舞种',
          apiOption: {
            api: scopeDanceList,
            string: 'name',
            value: 'id'
          }
        },
        {
          type: 'select',
          key: 'phaseId',
          label: '应聘阶层',
          placeholder: '请选择应聘阶层',
          apiOption: {
            api: listInterviewPhase,
            string: 'name',
            value: 'id'
          }
        },
        {
          type: 'date',
          key: 'Date',
          label: '近期急缺',
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD'
        }
      ],
      queryParam: null,
      loadData: parameter => {
        return listTeacherDemand(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      },
      specialtyTree: [
        {
          label: '中国舞',
          value: '中国舞',
          children: [
            { label: '古典', value: '中国舞/古典' },
            { label: '民族民间', value: '中国舞/民族民间' },
            { label: '技术技巧', value: '中国舞/技术技巧' },
            { label: '汉唐现代', value: '中国舞/汉唐现代' },
          ]
        },
        {
          label: '拉丁舞',
          value: '拉丁舞',
          children: [
            { label: '精通四支舞', value: '拉丁舞/精通四支舞' },
            { label: '精通五支舞', value: '拉丁舞/精通五支舞' },
            { label: '舞蹈创编', value: '拉丁舞/舞蹈创编' },
          ]
        },
        {
          label: '流行舞',
          value: '流行舞',
          children: [
            { label: 'jazz', value: '流行舞/jazz' },
            { label: 'hiphop', value: '流行舞/hiphop' },
            { label: 'urban', value: '流行舞/urban' },
            { label: '舞蹈创编', value: '流行舞/舞蹈创编' },
          ]
        },
        {
          label: '瑜伽',
          value: '瑜伽',
          children: [
            { label: '哈他', value: '瑜伽/哈他' },
            { label: '流', value: '瑜伽/流' },
            { label: '阴', value: '瑜伽/阴' },
            { label: '理疗', value: '瑜伽/理疗' },
            { label: '舞韵', value: '瑜伽/舞韵' },
            { label: '普拉提', value: '瑜伽/普拉提' },
            { label: '孕产', value: '瑜伽/孕产' },
            { label: '阿斯汤加', value: '瑜伽/阿斯汤加' },
          ]
        },
        {
          label: '东方舞',
          value: '东方舞',
          children: [
            { label: 'pop song', value: '东方舞/pop song' },
            { label: '鼓舞', value: '东方舞/鼓舞' },
            { label: '融合', value: '东方舞/融合' },
            { label: 'shaabi', value: '东方舞/shaabi' },
            { label: 'baladi', value: '东方舞/baladi' },
          ]
        }
      ]
    }
  },
  beforeCreate() {
    this.stusourceForm = this.$form.createForm(this)
  },
  methods: {
    handlePhase() {
      this.phaseModal = true
      this.spinning = true
      listInterviewPhase()
        .then(res => {
          this.editTableList = res.data
        })
        .finally(() => {
          this.spinning = false
        })
    },
    getEditList() {
      const { dancePlanId } = this
      listInterviewPhase().then(res => {
        this.editTableList = res.data
      })
    },
    saveEditLog(item) {
      const { dancePlanId } = this
      saveInterviewPhase(Object.assign({ dancePlanId }, item)).then(res => {
        this.$notification['success']({
          message: '系统通知',
          description: '操作成功'
        })
        this.getEditList()
        this.$refs.editTable.cancelTableItem()
      })
    },
    deleteEditLog(item) {
      const { id } = item
      const _this = this
      this.$confirm({
        title: '系统提示',
        content: '确认删除该条数据吗?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          removeInterviewPhase(id).then(res => {
            _this.getEditList()
            _this.$refs.editTable.cancelTableItem()
          })
        }
      })
    },
    searchSubmit(data) {
      this.queryParam = data
      this._refreshTable()
    },
    initForm() {
      const {
        stusourceForm: { resetFields },
        _loadModalData
      } = this
      resetFields()
      this.formValues = {}
      return _loadModalData()
    },
    _loadModalData() {
      return Promise.all([
        listInterviewPhase().then(res => {
          this.phaseList = res.data
        }),
        scopeDanceList().then(res => {
          this.danceList = res.data
        }),
        scopeListArea().then(res => {
          this.areaList = res.data
        })
      ])
    },
    handleEditStu(record) {
      this.stusourceModal = true
      this.tableLoading = true
      const { initForm, databack } = this
      initForm()
        .then(() => {
          record ? databack(record) : ''
        })
        .finally(() => {
          this.tableLoading = false
        })
    },
    databack(record) {
      const {
        $nextTick,
        stusourceForm: { setFieldsValue }
      } = this
      let tmpObj = Object.assign({}, record)
      delete tmpObj.areaName
      delete tmpObj.createDate
      delete tmpObj.danceName
      delete tmpObj.phaseName
      delete tmpObj.reserve
      tmpObj.expectDate = this.$tools.tailor.dateToMoment(tmpObj.expectDate)
      tmpObj.specialty = tmpObj.specialty.split('，')
      console.log(tmpObj)
      this.$nextTick(() => {
        setFieldsValue(tmpObj)
      })
    },
    handleRemove(record) {
      const { $confirm, $notification, _refreshTable } = this
      $confirm({
        title: '系统提示',
        content: '确认删除该条数据吗?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          removeTeacherDemand(record.id)
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
    sendForm() {
      const {
        stusourceForm: { validateFields },
        formValues,
        _refreshTable
      } = this
      validateFields().then(values => {
        values.expectDate = this.$tools.tailor.getDate(values.expectDate)
        let params = Object.assign({}, formValues, values)
        params.specialty = params.specialty.join('，')
        saveTeacherDemand(params)
          .then(res => {
            this.stusourceModal = false
            this.$notification['success']({
              message: '系统通知',
              description: '操作成功'
            })
          })
          .finally(() => _refreshTable())
      })
    },
    _refreshTable() {
      this.$refs.table.refresh()
    }
  }
}
</script>

<style lang="less" scoped>
.skill_wrapper {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 150px;
}
</style>
