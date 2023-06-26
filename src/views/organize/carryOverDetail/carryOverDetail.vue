<template>
  <div class="fin-profit-paytype-wrapper">
    <div ref="elementSearch" :style="{ padding: '20px 0' }">
      <a-card :bordered="false">
        <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" ref="elementSearch" :searchParams="searchParams"> </search-com-pro>
      </a-card>
    </div>
    <div class="table-wrapper">
      <a-card :bordered="false">
        <div class="mt10 mb10">
          <a-button type="primary" icon="download" @click.native="downloadStu">
            导出
          </a-button>
        </div>
        <s-table
          :showSlider="true"
          ref="table"
          size="default"
          :columns="columns"
          :data="loadData"
          :alert="false"
          rowKey="id"
          :scroll="{ x: 1700 }"
          bordered
          :defaultRowKeys="true"
        >
          <div slot="cardPreTitle" style="width:1250px;text-align:center;">
            <div style="border-bottom:1px solid #e8e8e8;padding:5px;">结转前</div>
            <div style="display:flex;">
              <div v-for="(item, index) in columnsPre" :key="index" :style="`width:${item.width}px;padding:5px;`">{{ item.title }}</div>
            </div>
          </div>
          <span slot="cardPre" slot-scope="text, record">
            <div v-for="(item, index) in record.source" :key="index" style="display:flex;width:1250px">
              <div v-for="col in columnsPre" :key="col.dataIndex" :style="`width:${col.width}px;`">
                {{ item[col.dataIndex] }}
                <!-- {{ col.dataIndex }} -->
              </div>
            </div>
          </span>
          <div slot="cardNextTitle" style="width:890px;text-align:center;">
            <div style="border-bottom:1px solid #e8e8e8;padding:5px;">结转后</div>
            <div style="display:flex;">
              <div v-for="(item, index) in columnsNext" :key="index" :style="`width:${item.width}px;padding:5px;`">{{ item.title }}</div>
            </div>
          </div>
          <span slot="cardNext" slot-scope="text, record">
            <div v-for="(item, index) in record.target" :key="index" style="display:flex;width:1250px">
              <div v-for="col in columnsNext" :key="col.dataIndex" :style="`width:${col.width}px;`">{{ item[col.dataIndex] }}</div>
            </div>
          </span>
        </s-table>
      </a-card>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import ReportTable from '@/components/ReportsTable/ReportsTable.vue'
import { getSchoolList } from '@/api/education/card'
import { pageSizeOptions } from '@/utils/tableDetails/details'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { STable } from '@/components'
import { SearchComPro } from '@/components'
import { queryCardChangeReport } from '@/api/organize'
const date = new Date()
const defaultStart = moment(date)
  .startOf('month')
  .format('YYYY-MM-DD')
const defaultEnd = moment(date).format('YYYY-MM-DD')

export default {
  name: 'balanceConsumpution',
  data() {
    const columns = [
      {
        dataIndex: 'cardPre',
        width: 1250,
        ellipsis: true,
        align: 'center',
        scopedSlots: { title: 'cardPreTitle', customRender: 'cardPre' }
      },
      {
        dataIndex: 'cardNext',
        width: 890,
        ellipsis: true,
        align: 'center',
        scopedSlots: { title: 'cardNextTitle', customRender: 'cardNext' }
      },
      {
        title: '操作时间',
        align: 'center',
        dataIndex: 'operationDate',
        width: 150
      },
      {
        title: '操作分馆',
        align: 'center',
        dataIndex: 'operationDept',
        width: 150
      },
      {
        title: '操作人',
        align: 'center',
        dataIndex: 'operationUser',
        width: 150
      }
    ]
    return {
      columnsPre: [
        {
          title: '办卡分馆',
          dataIndex: 'openDept',
          width: 120
        },
        {
          title: '结转前卡号',
          dataIndex: 'cardNo',
          width: 120
        },
        {
          title: '学员姓名',
          dataIndex: 'stuName',
          width: 120
        },
        {
          title: '人群',
          dataIndex: 'stuType',
          width: 50
        },
        {
          title: '上课分馆',
          dataIndex: 'schoolDept',
          width: 120
        },
        {
          title: '班型',
          dataIndex: 'classType',
          width: 120
        },

        {
          title: '舞种',
          dataIndex: 'danceType',
          width: 120
        },
        {
          title: '卡价值',
          dataIndex: 'cardPrice',
          width: 120
        },
        {
          title: '结转金额',
          dataIndex: 'carryOverPrice',
          width: 120
        },
        {
          title: '扣除课耗',
          dataIndex: 'courseConsume',
          width: 120
        },
        {
          title: '剩余金额',
          dataIndex: 'balance',
          width: 120
        }
      ],
      columnsNext: [
        {
          title: '结转后卡号',
          dataIndex: 'cardNo',
          width: 120
        },
        {
          title: '上课分馆',
          dataIndex: 'schoolDept',
          width: 120
        },
        {
          title: '班型',
          dataIndex: 'classType',
          width: 120
        },
        {
          title: '舞种',
          dataIndex: 'danceType',
          width: 120
        },

        {
          title: '抵扣金额',
          dataIndex: 'carryOverPrice',
          width: 120
        },
        {
          title: '补缴金额',
          dataIndex: 'cardPrice',
          width: 120
        },
        {
          title: '学员姓名',
          dataIndex: 'stuName',
          width: 120
        },
        {
          title: '人群',
          dataIndex: 'stuType',
          width: 50
        }
      ],
      total: 0,
      pageSizeOptions: pageSizeOptions,
      columns,
      datalength: 0,
      //表内容
      loadData: parameter => {
        return queryCardChangeReport(Object.assign(parameter, this.queryParams)).then(res => {
          return res
        })
      },
      //搜索项
      searchParams: [
        {
          type: 'date',
          key: 'Date',
          label: '操作时间',
          placeholder: '请选择月份',
          format: 'YYYY-MM-DD',
          show: true,
          defaultVal: [moment(defaultStart, 'YYYY-MM-DD'), moment(defaultEnd, 'YYYY-MM-DD')]
        },
        {
          type: 'treeSelect',
          isShow: !this.$store.getters.school_id,
          key: 'deptIds',
          label: '办卡分馆',
          placeholder: '请选择办卡分馆',
          expandAll: true,
          mutiple: true,
          show: true,
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
          key: 'userInfo',
          label: '学员信息',
          show: true,
          placeholder: '请输入学员信息'
        },
        {
          type: 'text',
          key: 'beforeStuCard',
          show: true,
          label: '结转前卡号',
          placeholder: '请输入结转前卡号'
        },
        {
          type: 'text',
          show: true,
          key: 'afterStuCard',
          label: '转后卡号',
          placeholder: '请输入转后卡号'
        },
        {
          type: 'select', // 静态select框
          key: 'beforeUserType',
          show: true,
          label: '结转前人群',
          placeholder: '请选择人群',
          staticArr: [
            {
              string: '成人',
              value: 'A'
            },
            {
              string: '少儿',
              value: 'B'
            }
          ]
        },
        {
          type: 'select', // 静态select框
          key: 'afterUserType',
          show: true,
          label: '结转后人群',
          placeholder: '请选择人群',
          staticArr: [
            {
              string: '成人',
              value: 'A'
            },
            {
              string: '少儿',
              value: 'B'
            }
          ]
        }
      ],
      queryParams: {
        startDate: defaultStart,
        endDate: defaultEnd
      },
      //表格是否加载
      rpSpinning: false
    }
  },
  components: {
    ReportTable,
    STable,
    SearchComPro
  },
  created() {},
  methods: {
    //导出
    downloadStu() {
      let exportUrl = '/studentCardChange/queryCardChangeReportByExportExcel'
      const queryParam = this.queryParams
      const token = Vue.ls.get(ACCESS_TOKEN)
      let fields = [{ name: 'auth_token', value: token }]
      for (let k in queryParam) {
        if (k !== 'page' && k != 'limit' && queryParam[k]) fields.push({ name: k, value: queryParam[k] })
      }
      fields.push({ name: 'page', value: 0 })
      fields.push({ name: 'limit', value: 0 })
      const form = document.createElement('form')
      form.action = `${process.env.VUE_APP_URL}${exportUrl}`
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
    },
    searchSubmit(data, reset) {
      this.queryParams = data
      if (reset == 'isReset') {
        this.queryParams = {
          startDate: defaultStart,
          endDate: defaultEnd
        }
      }
      this._refreshTable()
    },
    _refreshTable() {
      if (this.$refs.table) this.$refs.table.refresh()
    }
  }
}
</script>

<style lang="less" scoped>
.priceText {
  padding: 3px;
  min-width: 180px;
  // height: 90px;
  background-color: #fff;
  margin-right: 15px;
  font-size: 14px;
}
.totalPrice {
  margin-left: 50px;
  // margin-top: 10px;
  font-weight: bold;
  font-size: 17px;
}
.totalTitle {
  background: #f7fbff;
  padding: 5px;
  font-weight: 700;
}
.page {
  margin-top: 20px !important;
  float: right;
}

/deep/.ant-pagination-total-text {
  position: absolute;
  left: 10px;
}
@media screen and (max-width: 1200px) {
  /deep/.ant-pagination-total-text {
    position: static;
  }
}
/deep/.ant-pagination {
  display: flex;
  justify-content: flex-end;
}
/deep/.ant-table-thead > tr > th {
  padding: 0 !important;
}
</style>
