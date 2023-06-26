<template>
  <div>
    <a-card :bordered="false" style="margin: 20px 0 ;">
      <search-com-pro ref="searchForm" :style="{ padding: '10px 0' }" :searchParams="searchParams"
        @searchSubmit="searchSubmit" />
    </a-card>
    <a-card :bordered="false">
      <div class="mb20">
        <a-space :size="15">
          <perm-box perm="education:personalSignAbnormal:excel">
            <a-button type="primary" icon="download" @click="handleExport">导出</a-button>
          </perm-box>
        </a-space>
      </div>
      <s-table ref="table" size="default" :columns="columns" :rowKey="(record, index) => index" :data="loadData">
      </s-table>
    </a-card>
  </div>
</template>

<script>
import moment from 'moment'
import { getSchoolList } from '@/api/education/card'
import { listEduDance, listEduType, treeEduClassType } from "@/api/common"
import { getPersonalSignInList, exportPersonalSignIn } from '@/api/stat'
import { STable, SearchComPro, PermBox } from '@/components'
const defaultStart = moment()
  .startOf('month')
  .format('YYYY-MM-DD')
const defaultEnd = moment().format('YYYY-MM-DD')
const noPaddingCell = (record, rowIndex) => {
  return {
    style: {
      padding: '0px!important'
    }
  }
}
export default {
  name: 'EduClassPersonalSignIn',
  components: {
    STable,
    SearchComPro,
    PermBox
  },
  data() {
    return {
      searchParams: [
        {
          type: 'treeSelect',
          isShow: !this.$store.getters.school_id,
          key: 'branchIds',
          label: '选择分馆',
          placeholder: '请选择分馆',
          show: true,
          isShow: true,
          expandAll: true,
          mutiple: true,
          treeCheckable: true,
          selectFather: true,
          treeOps: {
            api: getSchoolList,
            label: 'deptName',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'text',
          key: 'clsName',
          label: '班级名称',
          placeholder: '请输入班级名称',
          show: true
        },
        {
          type: 'select', //动态select框
          key: 'danceIds',
          show: true,
          label: '舞种',
          placeholder: '请选择舞种',
          apiOption: {
            api: listEduDance, // promise类型的接口
            string: 'name',
            value: 'id'
          }
        },
        {
          type: 'chooseModal',
          key: 'teacher',
          label: '签到导师',
          placeholder: '请选择签到导师',
          show: true
        },
        {
          type: 'chooseModal',
          key: 'master',
          label: '顾问',
          placeholder: '请选择顾问',
          show: true
        },
        {
          type: 'date',
          key: 'clsDate',
          label: '上课时间',
          show: true,
          placeholder: '请选择',
          format: 'YYYY-MM-DD',
          defaultVal: [defaultStart, defaultEnd],
          isDate: true
        },
        {
          type: 'cascader',
          key: 'classType',
          label: '班型',
          placeholder: '请选择班型',
          show: true,
          treeOps: {
            api: treeEduClassType,
            label: 'name',
            value: 'id',
            children: 'children'
          }
        },
      ],
      queryParams: {
        clsStartDate: defaultStart,
        clsEndDate: defaultEnd
      },
      columns: [
        {
          title: '地区',
          align: 'center',
          dataIndex: 'deptName'
        },
        {
          title: '所在分馆',
          align: 'center',
          dataIndex: 'branchName'
        },
        {
          title: '班级名称',
          align: 'center',
          dataIndex: 'clsName'
        },
        {
          title: '舞种',
          align: 'center',
          dataIndex: 'danceName'
        },
        {
          title: '班型',
          align: 'center',
          dataIndex: 'clsTypeName'
        },
        {
          title: '班级顾问',
          align: 'center',
          dataIndex: 'orgUserName'
        },
        {
          title: '上课导师',
          align: 'center',
          dataIndex: 'teacherName'
        },
        {
          title: '排课时间',
          align: 'center',
          dataIndex: 'planDate'
        },
        {
          title: '排课分馆',
          align: 'center',
          dataIndex: 'planBranchName'
        },
        {
          title: '签到导师',
          align: 'center',
          dataIndex: 'signTeacherName'
        },
        {
          title: '总时长（分钟）',
          width: 120,
          align: 'center',
          dataIndex: 'totalDuration'
        },
        {
          title: <div style="padding:0 20px;background-color:#1ba97b;color:white;">签到计次（参考值）</div>,
          customHeaderCell: noPaddingCell,
          width: 120,
          align: 'center',
          dataIndex: 'planSignNumber'
        },
        {
          title: <div style="padding:0 20px;background-color:#1ba97b;color:white;">排课签到计次</div>,
          customHeaderCell: noPaddingCell,
          width: 100,
          align: 'center',
          dataIndex: 'planSignCount'
        },
        {
          title: <div style="padding:0 20px;background-color:#1ba97b;color:white;">导师签到计次</div>,
          customHeaderCell: noPaddingCell,
          width: 100,
          align: 'center',
          dataIndex: 'teacherSignNumber'
        },
        {
          title: <div style="padding:0 20px;background-color:#1ba97b;color:white;">学员签到计次</div>,
          customHeaderCell: noPaddingCell,
          width: 100,
          align: 'center',
          dataIndex: 'studentSignNumber'
        },

      ],
      loadData: parameter => {
        return getPersonalSignInList({ ...parameter, ...this.queryParams }).then(res => {
          return res
        })
      }
    }
  },
  methods: {
    _refreshTable() {
      this.$refs.table.refresh()
    },
    searchSubmit(data, reset) {
      // TODO: 搜索组件重构
      if (reset == 'isReset') {
        this.queryParams = {
          clsStartDate: defaultStart,
          clsEndDate: defaultEnd
        }
      } else {
        this.queryParams = { ...data }
        if (data.clsDate) {
          this.queryParams.clsStartDate = data.clsDate.split(',')[0]
          this.queryParams.clsEndDate = data.clsDate.split(',')[1]
          delete this.queryParams.clsDate
        } else {
          this.queryParams.clsStartDate = data.startclsDate
          this.queryParams.clsEndDate = data.endclsDate
          delete this.queryParams.startclsDate
          delete this.queryParams.endclsDate
        }
      }
      this._refreshTable()
    },
    handleExport() {
      // this.$refs.searchForm.getResult().then(res => {
      exportPersonalSignIn(this.queryParams).then(data => {
        this.$tools.exportExcel(data, '私教签到异常统计表')
      })
      // })
    }
  }
}
</script>

<style lang="less" scoped></style>
