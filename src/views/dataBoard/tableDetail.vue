<template>
  <div class="table">
    <div class="action">
      <div style="font-size:0.2rem;font-weight:bold;margin-bottom:0.2rem;">{{ title }}</div>
      <div style="display:flex;">
        <EchartSearch :searchParams="searchParams" style="margin-right:0.1rem;margin-top:-0.03rem;height:40px;" @searchSubmit="searchSubmit" />
      <perm-box :perm='$route.params.perm'>
        <a-button type="primary" icon="download" @click.native="downloadStu">
          导出
        </a-button>
      </perm-box>
      </div>
    </div>
    <a-card>
      <!-- <div style="display:flex;justify-content: space-between;">
      <div></div>
      <div class="active">筛选</div>
    </div> -->
      <s-table
        ref="table"
        size="default"
        :showSlider="true"
        slideWidth='100%'
        :columns="tableColumns"
        :data="loadData"
        :rowKey="(record, index) => index"
        @result="result"
        :scroll="{ x: 200 * tableColumns.length }"
      >
        <span slot="approveStatus" slot-scope="text">
          {{ text === 'A' ? '待审核' : text === 'B' ? '审批中' : text === 'C' ? '通过' : text === 'D' ? '驳回' : '' }}
        </span>
        <span slot="tfRefund" slot-scope="text">
          {{ text === true ? '真' : '假' }}
        </span>
        <span slot="isCardOpened" slot-scope="text">
          {{ text === true ? '是' : '否' }}
        </span>
      </s-table>
    </a-card>
  </div>
</template>

<script>
import { STable } from '@/components'
import PermBox from '@/components/PermBox'
import EchartSearch from '@/components/EchartSearch/index.vue'
import { refundDetail } from '@/api/echart/refundStat'
import { resourceDetail } from '@/api/echart/resourceValue'
import { cardDetail } from '@/api/echart/studentCard'
import { analysisResourceDetail } from '@/api/echart/analysisChannel'
import { achievementDetail } from '@/api/echart/achievement'
import achievementDetailApi from '@/api/echart/achievement'
import analysisResourceDetailApi from '@/api/echart/analysisChannel'
import resourceDetailApi from '@/api/echart/resourceValue'
import refundDetailApi from '@/api/echart/refundStat'
import cardDetailApi from '@/api/echart/studentCard'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import axios from 'axios'

export default {
  data() {
    return {
      tableColumns: [],
      searchParams: [
        {
          type: 'date',
          key: 'Date',
          label: '',
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD',
          defaultDaySection: 7,
          defaultLastWeek: false,
          defaultSelectMonth: false,
          disabledDate: true,
          allowClear: false,
          customDate: {
            endDate: this.$route.params.endDate,
            startDate: this.$route.params.startDate
          }
        }
      ],
      request: {
        refundDetail: refundDetail,
        resourceDetail: resourceDetail,
        cardDetail: cardDetail,
        analysisResourceDetail: analysisResourceDetail,
        achievementDetail: achievementDetail
      },
      apis: {
        refundDetailApi: refundDetailApi.refundDetail,
        cardDetailApi: cardDetailApi.cardDetail,
        resourceDetailApi: resourceDetailApi.resourceDetail,
        analysisResourceDetailApi: analysisResourceDetailApi.analysisResourceDetail,
        achievementDetailApi: achievementDetailApi.achievementDetail
      },
      loadData: parameter => {
        let obj = {
          limit: parameter.limit,
          page: parameter.page,
          sorter: {
            sortField: parameter.sortField,
            sortOrder: parameter.sortOrder
          }
        }
        return this.request[this.$route.params.loadTableData](Object.assign(obj, this.params)).then(res => {
          return res
        })
      },
      title: '',
      searchData: {}
    }
  },
  watch: {
    // $route: {
    //   immediate: true,
    //   handler(nv) {
    //     console.log(nv.params.loadTableData)
    //   }
    // }
  },
  computed: {
    params() {
      const {dimension,dimensionValue,endDate,startDate,sceneData,operate,indicator,module} = this.$route.params
      let obj = {
        dimension: dimension === 'null' ? null : dimension,
        dimensionValue: JSON.parse(dimensionValue) ? [JSON.parse(dimensionValue)] : [],
        endDate: this.searchData.endDate ? this.searchData.endDate : endDate,
        startDate: this.searchData.startDate ? this.searchData.startDate : startDate,
        sceneData: JSON.parse(sceneData),
        operate: operate,
        indicator: indicator,
        module: module
        // title:this.$route.params.title,
      }
      return obj
    }
  },
  components: {
    STable,
    EchartSearch,
    PermBox
  },
  created() {},
  methods: {
    searchSubmit(val) {
      if (!val.startDate) return
      this.searchData = val
      this.loadTable()
    },
    downloadStu() {
      const token = Vue.ls.get(ACCESS_TOKEN)
      axios({
        method: 'post',
        responseType: 'arraybuffer',
        url: `${process.env.VUE_APP_REPORT_URL}${this.apis[`${this.$route.params.loadTableData}Api`]}/export?auth_token=${token}`,
        data: {
          auth_token: token,
          ...this.params
        }
      }).then(res => {
        if (res) {
          let type = res.headers.content - type
          let blob = new Blob([res.data], {
            type: type,
            charset: 'utf-8'
          })
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = `${this.title}.xls`
          var event = new MouseEvent('click')
          link.dispatchEvent(event)
        }
      })
    },
    //列表接口数据
    result(res) {
      this.title = res.data.title
      let arr = res.data.headers.map(item => {
        return {
          title: item.name,
          dataIndex: item.key,
          sorter: item.sortable,
          scopedSlots: {
            customRender: item.key
          },
          width: 130,
          className: 'column-money',
          fixed: item.fixed ? 'left' : ''
        }
      })
      this.tableColumns = arr
      // this.tableColumns.forEach(item => {
      //   if (item.dataIndex !== 'key') {
      //     this.tableKey.push(item.dataIndex)
      //   }
      // })
    },
    loadTable() {
      this.$refs.table.refresh()
    }
  }
}
</script>

<style lang="less" scoped>
.table {
  background-color: #f0f2f5;
  padding: 20px;
}
.active {
  color: #1890ff;
}
.action {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
</style>
