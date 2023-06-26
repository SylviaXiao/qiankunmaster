<template>
  <div class="student-wrapper" ref="elementAll" style="height:calc(100vh - 84px)">
    <div ref="elementSearch">
      <a-card :bordered="false" :style="{ margin: '20px 0' }">
        <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams" />
      </a-card>
    </div>
    <a-card :bordered="false">
      <div ref="elementBtn">
        <a-space :size="15">
          <perm-box perm="student:out:down">
            <a-button @click.native="exportExcel()">导出</a-button>
          </perm-box>
        </a-space>
      </div>
      <s-table :showSlider="true" ref="table" class="mt20" :columns="columns" :data="loadData" rowKey="id" :scroll="{ x: 180 * columns.length }">
        <span slot="action" slot-scope="text, record">
          <perm-box perm="student:in:confirm" v-if="record.confirm !== 'Y'">
            <a href="javascript:;" @click="handleConfirm(record)">确认</a>
          </perm-box>
          <perm-box perm="student:in:confirm" v-if="record.confirm === 'Y'">
            <a href="javascript:;" @click="handleConfirm(record)">取消确认</a>
          </perm-box>
        </span>
      </s-table>
    </a-card>
  </div>
</template>
<script>
import Vue from 'vue'
import moment from 'moment'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { studentOutputColumns } from '@/utils/reception/student'
import { STable, SearchComPro, PermBox } from '@/components'
import { getSchoolList } from '@/api/education/card'
import { pageStuOut, confirmStuOut } from '@/api/reception/student'

const defaultStart = moment()
  .date(1)
  .format('YYYY-MM-DD')
const defaultEnd = moment()
  .add(1, 'months')
  .date(0)
  .format('YYYY-MM-DD')

export default {
  name: 'student',
  components: {
    SearchComPro,
    PermBox,
    STable
  },
  data() {
    let columns = studentOutputColumns.concat([
      {
        title: '确认人',
        dataIndex: 'userName',
        key: 'userName'
      },
      {
        title: '操作',
        key: 'action',
        fixed: 'right',
        scopedSlots: {
          customRender: 'action'
        }
      }
    ])
    return {
      height: 0, //滚动条高度
      columns,
      //table与搜索
      searchParams: [
        {
          type: 'treeSelect',
          show: true,
          isShow: true,
          key: 'outOrgDeptId',
          label: '输出分馆',
          placeholder: '请选择输出分馆',
          expandAll: true,
          selectFather: false,
          treeOps: {
            api: getSchoolList,
            label: 'deptName',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'treeSelect',
          show: true,
          isShow: true,
          key: 'inOrgDeptId',
          label: '接收分馆',
          placeholder: '请选择接收分馆',
          expandAll: true,
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
          key: 'stuInfo',
          show: true,
          label: '学员信息',
          placeholder: '请输入姓名/手机号'
        },
        {
          type: 'date',
          key: 'Date',
          show: true,
          label: '录入时间',
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD',
          defaultVal: [moment(defaultStart, 'YYYY-MM-DD'), moment(defaultEnd, 'YYYY-MM-DD')]
        },
        {
          type: 'text',
          key: 'adviserName',
          show: true,
          label: '顾问',
          placeholder: '请输入顾问名称'
        },
        {
          type: 'select',
          key: 'confirm',
          show: true,
          label: '状态',
          placeholder: '请选择状态',
          staticArr: [
            {
              string: '已确认',
              value: 'Y'
            },
            {
              string: '未确认',
              value: 'N'
            }
          ]
        },
        {
          type: 'text',
          key: 'scheduledShift',
          show: true,
          label: '预定班次',
          placeholder: '请输入预定班次'
        }
      ],
      queryParam: {},
      loadData: parameter => {
        let defaultDate = { startDate: defaultStart, endDate: defaultEnd }
        let correctParams = this.queryParam.hasOwnProperty('Date') ? this.queryParam : Object.assign({}, defaultDate, this.queryParam)
        return pageStuOut(
          Object.assign(
            {
              inOrgDeptId: this.$store.getters.school_id
            },
            parameter,
            correctParams
          )
        ).then(res => {
          return res
        })
      }
    }
  },

  methods: {
    //搜索功能
    searchSubmit(data) {
      this.queryParam = data
      this._refreshTable()
    },
    _refreshTable() {
      this.$refs.table.refresh()
    },

    handleConfirm(record) {
      let content = record.confirm === 'Y' ? '确定要取消选中数据吗?' : record.confirm === 'N' ? '确定要确认选中数据吗?' : ''
      this.$confirm({
        title: '系统提示',
        content,
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          let confirm = record.confirm === 'Y' ? 'N' : 'Y'
          confirmStuOut({ stuOutId: record.id, confirm }).then(res => {
            if (res.code === 200) {
              this.$notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
              this._refreshTable()
            }
          })
        }
      })
    },
    exportExcel() {
      let defaultDate = { startDate: defaultStart, endDate: defaultEnd }
      let correctParams = this.queryParam.hasOwnProperty('Date') ? this.queryParam : Object.assign({}, defaultDate, this.queryParam)
      const token = Vue.ls.get(ACCESS_TOKEN)
      const schoolId = Vue.ls.get('userDefaultId')
      let fields = [{ name: 'auth_token', value: token }, { name: 'school_id', value: schoolId }, { name: 'inOrgDeptId', value: this.$store.getters.school_id }]
      for (let k in correctParams) {
        fields.push({ name: k, value: correctParams[k] })
      }
      const form = document.createElement('form')
      form.action = `${process.env.VUE_APP_URL}/student/out/downStuOut`
      form.method = 'POST'
      form.target = 'downloadFrame'
      for (let i = 0; i < fields.length; i++) {
        const field = fields[i]
        const f = document.createElement('input')
        f.type = 'hidden'
        f.name = field.name
        f.value = field.value
        form.appendChild(f)
      }
      document.body.appendChild(form)
      form.submit()
      this.$message.success('正在下载...')
      document.body.removeChild(form)
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/style/index';
</style>
