<template>
  <div class="choose-tea-wrapper">
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      title="选择导师"
      :width="1000"
      :visible="visible"
      @cancel="handleCancel"
      :confirmLoading="confirmLoading"
    >
      <div class="search-group" @keyup.13="searchTable" tabindex="1" v-if="!teacherGap">
        <a-form :form="searchForm">
          <a-row>
            <a-col :lg="6" :md="6" :sm="24">
              <a-form-item label="关键字" v-bind="itemLayout">
                <a-input placeholder="请输入手机号码或姓名" v-decorator="['name']"></a-input>
              </a-form-item>
            </a-col>
            <a-col :lg="6" :md="6" :sm="24">
              <a-form-item label="地区" v-bind="itemLayout">
                <a-input placeholder="请输入地区" v-decorator="['areaName']"></a-input>
              </a-form-item>
            </a-col>
            <a-col :lg="6" :md="6" :sm="24">
              <a-form-item label="舞种" v-bind="itemLayout">
                <a-select allowClear v-decorator="['danceId']" placeholder="请选择舞种">
                  <a-select-option :value="dance.id" v-for="(dance, danceIndex) in danceList" :key="danceIndex">
                    {{ dance.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :lg="6" :md="6" :sm="24">
              <a-form-item>
                <span>
                  <a-button @click="searchTable()">查询</a-button>
                </span>
                <span style="margin-left:5px;">
                  <a-button @click="resetSearch">重置</a-button>
                </span>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <div class="select-table">
        <a-table
          :columns="teacherGap ? two_columns1 : columns1"
          :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: checkType ? 'checkbox' : 'radio' }"
          :row-key="record => record.id"
          :data-source="selectedRows"
          :pagination="false"
          ref="tableSelected"
        >
        </a-table>
      </div>
      <div class="table-wrapper">
        <s-table
          ref="table"
          :columns="teacherGap ? two_columns : columns"
          :data="tableLoad"
          :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: checkType ? 'checkbox' : 'radio' }"
          rowKey="id"
        >
        </s-table>
      </div>
      <template slot="footer">
        <a-row>
          <a-col v-if="teaFields === 'assistant'" :offset="2" :span="6">
            <div class="assistant-name-style">
              <a-input v-model="assistantName" placeholder="助教姓名" />
            </div>
          </a-col>
          <a-col :span="teaFields === 'assistant' ? 16 : 24">
            <a-button key="back" @click="handleCancel">取消</a-button>
            <a-button type="primary" key="submit" @click="handleOk">确定</a-button>
          </a-col>
        </a-row>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { pageTeachers, pageTeacherDemand } from '@/api/common'
import STable from '@/components/Table'
import { listEduDance } from '@/api/common'

const itemLayout = {
  labelCol: {
    xs: { span: 6 },
    sm: { span: 6 }
  },
  wrapperCol: {
    xs: { span: 17 },
    sm: { span: 17 }
  }
}
const columns = [
  {
    title: '姓名',
    dataIndex: 'teacherName',
    key: 'teacherName',
    width: 150
  },
  {
    title: '手机号码',
    dataIndex: 'teacherMobile',
    key: 'teacherMobile'
  },
  {
    title: '地区',
    dataIndex: 'areaName',
    key: 'areaName'
  },
  {
    title: '舞种',
    dataIndex: 'danceName',
    key: 'danceName'
  },
  {
    title: '正式员工',
    dataIndex: 'official',
    key: 'official',
    customRender: text => {
      let show = ' '
      text === 'A' ? (show = '正式') : text === 'B' ? (show = '试用') : (show = '兼职')
      return show
    }
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    customRender: text => {
      let show = ' '
      text === 'Y' ? (show = '在职') : text === 'N' ? (show = '离职') : (show = '')
      return show
    }
  }
]
const two_columns = [
  {
    title: '最晚入职时间',
    dataIndex: 'expectDate',
    scopedSlots: { customRender: 'expectDate' },
    customRender: (text, record) => record.expectDate.split(' ')[0]
    // this.$tools.tailor.dateToMoment(tmpObj.expectDate)
  },
  {
    title: '录入时间',
    dataIndex: 'createDate',
    scopedSlots: { customRender: 'createDate' },
    customRender: (text, record) => record.createDate.split(' ')[0]
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
  }
]
const columns1 = [
  { title: '序号', dataIndex: 'isNumber', key: 'isNumber' },
  {
    title: '姓名',
    dataIndex: 'teacherName',
    key: 'teacherName',
    width: 150
  },
  {
    title: '手机号码',
    dataIndex: 'teacherMobile',
    key: 'teacherMobile'
  },
  {
    title: '地区',
    dataIndex: 'areaName',
    key: 'areaName'
  },
  {
    title: '舞种',
    dataIndex: 'danceName',
    key: 'danceName'
  },
  {
    title: '正式员工',
    dataIndex: 'official',
    key: 'official',
    customRender: text => {
      let show = ' '
      text === 'A' ? (show = '正式') : text === 'B' ? (show = '试用') : (show = '兼职')
      return show
    }
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    customRender: text => {
      let show = ' '
      text === 'Y' ? (show = '在职') : text === 'N' ? (show = '离职') : (show = '')
      return show
    }
  }
]
const two_columns1 = [
  { title: '序号', dataIndex: 'isNumber', key: 'isNumber' },
  {
    title: '最晚入职时间',
    dataIndex: 'expectDate',
    scopedSlots: { customRender: 'expectDate' },
    customRender: (text, record) => record.expectDate.split(' ')[0]
    // this.$tools.tailor.dateToMoment(tmpObj.expectDate)
  },
  {
    title: '录入时间',
    dataIndex: 'createDate',
    scopedSlots: { customRender: 'createDate' },
    customRender: (text, record) => record.createDate.split(' ')[0]
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
  }
]
export default {
  name: 'ChooseTea',
  props: {
    dimission: {
      type: Boolean,
      default: false
    },
    teaFields: {
      type: String,
      default: ''
    },
    multiple: {
      type: Boolean,
      default: false
    },
    //列表是否多选
    checkType: {
      type: Boolean,
      default: false
    },
    //老师缺口展示及接口
    teacherGap: {
      type: Boolean,
      default: false
    },
    danceId: {
      type: String,
      default: ''
    },
    areaId: {
      type: String,
      default: ''
    },
    params: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    STable
  },
  data() {
    return {
      two_columns1,
      columns1,
      assistantName: '',
      //modal
      visible: false,
      confirmLoading: false,
      itemLayout,
      columns,
      two_columns,
      queryParam: {},
      tableLoad: parameter => {
        const { queryParam } = this
        let request = pageTeachers
        if (this.teacherGap) {
          request = pageTeacherDemand
          this.queryParam.danceId = this.danceId
          this.queryParam.areaId = this.areaId
        }
        if (this.dimission) {
          this.queryParam.isJob = 1
        } else {
          this.queryParam.isJob = 0
        }
        return request(Object.assign(parameter, queryParam, this.params)).then(res => {
          let that = this
          this.$nextTick(() => {
            that.setNumber()
          })
          return res
        })
      },
      selectedRowKeys: [],
      selectedRows: [],
      danceList: []
    }
  },
  beforeCreate() {
    this.searchForm = this.$form.createForm(this)
  },
  methods: {
    setNumber() {
      if (this.selectedRows.length > 0) {
        this.selectedRows.forEach((item, index) => {
          item.isNumber = index + 1
        })
        this.$forceUpdate()
      }
    },
    open() {
      this.visible = true
      this.$nextTick(() => {
        this.selectedRowKeys = []
        this.selectedRows = []
        this.dataRefesh()
      })
    },
    getDanceList() {
      return listEduDance().then(res => {
        this.danceList = res.data
      })
    },
    dataRefesh() {
      this.queryParam.deptId = this.defValue
      this.$nextTick(() => {
        this.getDanceList()
        this.searchForm.resetFields()
      })
      if (this.$refs.table) {
        this.$refs.table.refresh()
      }
    },

    handleOk() {
      if (this.selectedRows.length === 0 && this.teaFields !== 'assistant') {
        this.$notification['error']({
          message: '系统通知',
          description: '请选择一条数据'
        })
      } else {
        if ((this.checkType||this.multiple) && this.teaFields === 'teacher') {
          this.$emit('getBackData', this.selectedRows, this.teaFields)
          this.visible = false
          return
        }
        const backData = {
          id: this.selectedRows[0] && this.selectedRows[0].id,
          name: this.selectedRows[0] && this.selectedRows[0].teacherName
        }
        if (this.teaFields === 'assistant' && this.selectedRows.length == 0 && this.assistantName) {
          backData.name = this.assistantName
        }
        this.$emit('getBackData', backData, this.teaFields)
        this.visible = false
      }
    },
    close() {
      this.visible = false
    },
    handleCancel() {
      this.close()
    },
    searchTable() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          this.queryParam = values
          this.$refs.table.refresh()
        }
      })
    },
    resetSearch() {
      this.searchForm.resetFields()
      this.queryParam = {}
      this.$refs.table.refresh()
    },
    unique(arr, a) {
      // 缓存用于记录
      const arr1 = []
      for (const t of arr) {
        // 检查缓存中是否已经存在
        if (arr1.find(c => c[a] === t[a])) {
          // 已经存在说明以前记录过，现在这个就是多余的，直接忽略
          continue
        }
        // 不存在就说明以前没遇到过，把它记录下来
        arr1.push(t)
      }
      // 记录结果就是过滤后的结果
      return arr1
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      let pageSelectRows = this.unique(this.selectedRows.concat(selectedRows), 'id')
      this.selectedRows = pageSelectRows.filter(item => this.selectedRowKeys.includes(item.id))
      let that = this
      this.$nextTick(() => {
        that.setNumber()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.search-group {
  outline: none;
}
.assistant-name-style {
  &::before {
    content: '助教 : ';
    position: absolute;
    left: -45px;
    top: 6px;
  }
}
</style>
