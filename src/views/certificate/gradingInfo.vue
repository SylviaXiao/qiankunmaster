<template>
  <div class="grading-wrapper">
    <a-card :bordered="false" :style="{ margin: '20px 0' }">
      <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"></search-com-pro>
    </a-card>
    <a-card :bordered="false">
      <div class="btn-wrapper">
        <perm-box perm="cer:grading:save">
          <a-button type="primary" icon="plus-circle" @click.native="handleAddStu">新增</a-button>
        </perm-box>
        <perm-box perm="cer:grading:down">
          <a-button type="primary" class="ml10" @click.native="exportExcel">导出</a-button>
        </perm-box>
      </div>
      <div class="table-wrapper">
        <s-table ref="table" size="default" :columns="infoColumns" :data="loadData" rowKey="gradingId">
          <span slot="action" slot-scope="text, record">
            <a href="#" @click="handleDownload(record)">下载附件</a>
            <perm-box perm="cer:grading:save">
              <a href="#" @click="handleEditStu(record)">修改</a>
            </perm-box>
            <a href="#" @click="handlePrint(record)">打印</a>
            <perm-box perm="cer:grading:del">
              <a href="#" @click="handleRemove(record)">删除</a>
            </perm-box>
          </span>
        </s-table>
      </div>
    </a-card>
    <div v-if="printInfo && printRecord">
      <PrintTable ref="PrintTable" :printRecord="printRecord" :printInfo="printInfo"></PrintTable>
    </div>
    <template v-if="printInfo">
      <CertAddInfoEdit :printInfo="printInfo" :title="addEditTitle" :record="recordStu" ref="CertAddInfoEdit" @refresh="_refreshTable"></CertAddInfoEdit>
    </template>

    <SignUpAttachment ref="attachment" :record="recordStu"></SignUpAttachment>
  </div>
</template>
<script>
import { STable, SearchComPro } from '@/components'
import PermBox from '@/components/PermBox'
import CertAddInfoEdit from './modules/CertAddInfoEdit'
import PrintTable from './modules/print/index.vue'
import { cerRankList } from './certificate'
import { getSchoolList } from '@/api/education/card'
import { removeGrading, pageGradingInfo, commonSiteById, downGrading } from '@/api/certificate/certificate'
import SignUpAttachment from './modules/SignUpAttachment.vue'
const infoColumns = [
  {
    title: '学员姓名',
    dataIndex: 'cerName',
    key: 'cerName',
    width: 100
  },
  {
    title: '姓名拼音',
    dataIndex: 'pinYing',
    key: 'pinYing',
    width: 50
  },
  {
    title: '国籍',
    dataIndex: 'cerNationality',
    key: 'cerNationality',
    width: 50
  },
  {
    title: '民族',
    dataIndex: 'cerEthnic',
    key: 'cerEthnic',
    width: 50
  },
  {
    title: '性别',
    dataIndex: 'cerSex',
    key: 'cerSex',
    customRender: (text, record) => (text === 'A' ? '男' : text === 'B' ? '女' : ''),
    width: 50
  },
  {
    title: '出生日期',
    dataIndex: 'cerBirthday',
    key: 'cerBirthday',
    customRender: (text, record) => {
      return text.slice(0, 10)
    },
    width: 100
  },
  {
    title: '证件类型',
    dataIndex: 'cerIdCardType',
    key: 'cerIdCardType',
    width: 100
  },
  {
    title: '证件号码',
    dataIndex: 'cerIdCard',
    key: 'cerIdCard',
    width: 200
  },
  {
    title: '报考级别',
    dataIndex: 'cerRank',
    key: 'cerRank',
    width: 100
  },
  {
    title: '已通过级别',
    dataIndex: 'cerCertificate',
    key: 'cerCertificate',
    width: 100
  },
  {
    title: '联系方式',
    dataIndex: 'cerPhone',
    key: 'cerPhone',
    width: 100
  },
  {
    title: '培训机构',
    dataIndex: 'deptName',
    key: 'deptName',
    width: 150
  },
  {
    title: '承办单位',
    dataIndex: 'organizerName',
    key: 'organizerName',
    width: 250
  },
  {
    title: '顾问老师',
    dataIndex: 'cerTeacher',
    key: 'cerTeacher',
    width: 100
  },
  {
    title: '所在班级',
    dataIndex: 'cerClass',
    key: 'cerClass',
    width: 100
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  components: {
    SearchComPro,
    PermBox,
    STable,
    CertAddInfoEdit,
    PrintTable,
    SignUpAttachment
  },
  data() {
    return {
      printRecord: null,
      printInfo: null,
      //搜索相关
      searchParams: [
        {
          type: 'text',
          key: 'cerName',
          label: '姓名',
          placeholder: '请输入姓名'
        },
        {
          type: 'select',
          key: 'cerSex',
          label: '性别',
          placeholder: '男/女',
          staticArr: [
            {
              string: '男',
              value: 'A'
            },
            {
              string: '女',
              value: 'B'
            }
          ]
        },
        {
          type: 'treeSelect',
          isShow: true,
          key: 'schoolId',
          label: '培训机构',
          placeholder: '请选择培训机构',
          expandAll: true,
          mutiple: false,
          treeCheckable: false,
          selectFather: false,
          treeOps: {
            api: getSchoolList,
            label: 'deptName',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'text',
          key: 'cerPhone',
          label: '联系方式',
          placeholder: '请输入联系方式'
        },
        {
          type: 'select',
          key: 'cerRank',
          label: '报考级别',
          placeholder: '请选择报考级别',
          staticArr: cerRankList
        },
        {
          type: 'text',
          key: 'cerIdCard',
          label: '证件号码',
          placeholder: '请输入证件号码'
        },
        {
          type: 'text',
          key: 'cerTeacher',
          label: '顾问老师',
          placeholder: '请输入顾问老师'
        },
        {
          type: 'text',
          key: 'cerClass',
          label: '所在班级',
          placeholder: '请输入所在班级'
        }
      ],
      cerRankList,
      //table相关
      infoColumns,
      queryParam: {},
      loadData: parameter => {
        let { id } = this.$route.params
        this.queryParam.siteId = id
        return pageGradingInfo(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      },
      // CertAddInfoEdit参数
      addEditTitle: '',
      recordStu: null
    }
  },
  computed: {},
  created() {
    this.init()
  },
  methods: {
    init() {
      let { id } = this.$route.params
      this.params = this.$route.params
      if (id) {
        commonSiteById({ siteId: id })
          .then(res => {
            if (res.code == 200 && res.data) {
              this.printInfo = res.data
            }
          })
          .catch(err => {})
      }
    },
    handleDownload(record) {
      this.recordStu = record
      this.$refs.attachment.openModal()
    },
    // 批量导出
    exportExcel() {
      const callback = res => {
        if (res.type !== 'application/vnd.ms-excel') {
          this.$message.error('导出失败')
          return false
        }
        const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
        const downloadElement = document.createElement('a')
        const href = window.URL.createObjectURL(blob)
        let filename = 'excel.xlsx'
        downloadElement.style.display = 'none'
        downloadElement.href = href
        downloadElement.download = filename //下载后文件名
        document.body.appendChild(downloadElement)
        downloadElement.click() //点击下载
        document.body.removeChild(downloadElement) //下载完成移除元素
        window.URL.revokeObjectURL(href) //释放掉blob对象
      }

      const errCallback = err => {}

      downGrading(this.queryParam)
        .then(callback)
        .catch(errCallback)
    },
    handlePrint(record) {
      document.title = record.cerName
      this.printRecord = record
      let birthday = record.cerBirthday.slice(0, 10)
      let birthdayArr = birthday.split('-')
      // .split('-')
      this.printRecord.birthday = birthday
      this.printRecord.birthdayArr = birthdayArr
      // [0] + '年' + birthday[1] + '月' + birthday[2] + '日'
      //
      let that = this
      this.$nextTick(() => {
        that.$refs.PrintTable.print()
      })
    },
    handleAddEditOk() {},
    handleAddEditCancel() {
      this.visibleAddEdit = false
    },
    handleAddStu() {
      this.addEditTitle = '添加'
      this.recordStu = {}
      this.$refs.CertAddInfoEdit.openModal()
    },
    handleEditStu(record) {
      this.addEditTitle = '修改'
      this.recordStu = record
      // 打开modal,清空数据,init考点下拉框
      this.$refs.CertAddInfoEdit.openModal()
      // this.$refs.CertAddInfoEdit.hideAddBtn()
      this.$refs.CertAddInfoEdit.backindData(record)
    },
    handleRemove(record) {
      let _this = this
      let params = {
        gradingId: record.gradingId
      }
      this.$confirm({
        title: '系统提示',
        content: '确认要删除吗?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          _this._removeApi(params)
        }
      })
    },
    searchSubmit(data) {
      this.queryParam = data
      this._refreshTable()
    },
    _removeApi(params) {
      removeGrading(params)
        .then(res => {
          if (res.code === 200) {
            this._refreshTable()
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    _handleData(date) {
      return date ? this.$tools.tailor.getStrDate(date) : ''
    },
    _refreshTable() {
      this.$refs.table.refresh()
    }
  }
}
</script>

<style scoped lang="less">
.grading-wrapper {
  .btn-wrapper {
    margin: 20px 0;
  }
}
</style>
