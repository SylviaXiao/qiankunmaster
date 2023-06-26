<template>
  <div>
    <a-card :bordered="false" :style="{ margin: '20px 0' }">
      <search-com-pro :searchParams="searchParams" @searchSubmit="searchSubmit">
        <template slot="custom">
          <a-col :lg="8" :md="12" :sm="24"
            style="line-height: 40px;display: flex;flex-flow: row nowrap;justify-content: center;">
            12
          </a-col>
        </template>
      </search-com-pro>
    </a-card>

    <a-card :bordered="false">
      <s-table ref="table" :columns="columns" :data="loadData" :autoLoad="false" :locale="locale"
        :rowKey="(record, index) => index" :showPagination="false">
      </s-table>

      <div class="py-40">
        <div :id="chartID" :style="{ width: '100%', height: '400px' }"></div>
      </div>
      <!-- <f-charts type="line" :data="chartsValue" :format="{ x: 'cardMonth', y: 'cardCount' }" tooltip="累计报名率"></f-charts> -->
    </a-card>
  </div>
</template>

<script>
import { STable, SearchComPro } from '@/components'
import { getSchoolList } from '@/api/education/card'
import { listEduDance, treeEduClassType, listChannelTree } from '@/api/common'
import FCharts from '@/components/FCharts/FCharts'
import { resourcesEnrollConversion, resourcesEnrollConversionReport } from '@/api/echart/analysisChannel'
import moment from 'moment'
let defaultChannel = ['1ae98845-de06-4870-8161-d47559cfdd7e', '65c45032-6fd4-4778-b6fb-08b3b6b8ed8f']
export default {
  name: 'resourcesEnroll',
  components: {
    STable,
    SearchComPro,
    FCharts
  },
  data() {
    return {
      seriesLabel: {
        normal: {
          show: true,
          lineHeight: 10,
          formatter:'{c}',
          position: 'top',
          textStyle: {
            color: '#000',
            fontSize: 10
          }
        }
      },
      searchParams: [
        {
          type: 'treeSelect',
          isShow: !this.$store.getters.school_id,
          key: 'deptIds',
          label: '分配分馆',
          placeholder: '请选择分馆',
          expandAll: true,
          mutiple: true,
          treeCheckable: true,
          selectFather: true,
          show: true,
          treeOps: {
            api: getSchoolList,
            label: 'deptName',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'date',
          key: 'Date',
          label: '资源录入日期',
          show: true,
          isDate: true,
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD',
        },
        {
          type: 'month',
          key: 'closingDate',
          show: true,
          isShow: true,
          label: '报名截止月份',
          placeholder: '月份',
          format: 'YYYY-MM',
        },
        {
          type: 'treeSelect',
          key: 'channelIds',
          isShow: true,
          label: '资源渠道',
          placeholder: '请选择渠道',
          expandAll: false,
          mutiple: true,
          search: true,
          show: true,
          selectFather: true,
          noBranch: true,
          defaultVal: defaultChannel,
          treeOps: {
            api: listChannelTree,
            label: 'name',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'cascader',
          key: 'resourcesClassType',
          label: '资源班型',
          placeholder: '请选择班型',
          show: true,
          treeOps: {
            api: treeEduClassType,
            type: 'D',
            label: 'name',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'select',
          key: 'resourcesType',
          label: '资源类型',
          show: true,
          placeholder: '请选择资源类型',
          staticArr: [
            {
              string: '全部',
              value: ''
            },
            {
              string: '线上课',
              value: 'A'
            },
            {
              string: '线下课',
              value: 'B'
            }
          ]
        },
        {
          type: 'select',
          key: 'regionalAttribution',
          label: '地域归属',
          show: true,
          placeholder: '请选择地域归属',
          staticArr: [
            {
              string: '本地资源',
              value: 'A'
            },
            {
              string: '地级市资源',
              value: 'B'
            },
            {
              string: '外地资源',
              value: 'C'
            }
          ]
        },
        {
          type: 'select',
          key: 'isYouGe',
          label: '是否包含优鸽',
          show: true,
          placeholder: '请选择是否包含优鸽',
          initialValue: 'N',
          initialIndex: 1,
          staticArr: [
            {
              string: '包含',
              value: 'Y'
            },
            {
              string: '不包含',
              value: 'N'
            }
          ]
        },
        {
          type: 'select',
          key: 'resourcesDance',
          label: '资源舞种',
          placeholder: '请选择舞种',
          show: true,
          apiOption: {
            api: listEduDance,
            string: 'name',
            value: 'id'
          }
        },
      ],
      queryParams: {
        channelIds: defaultChannel.join(','),
      },
      columns: [
      ],
      locale: { emptyText: <div style='font-size: 30px;padding: 100px 0;'>请选择相关筛选条件后，再查询信息哦</div> },
      loadData: parameter => {
        const params = { ...parameter, ...this.queryParams }
        this.queryChart(params)
        return resourcesEnrollConversion(params).then(res => {
          return this.configColumns(res)
        })
      },
      chartID: 'resourceChart',
    }
  },
  methods: {
    configColumns(res) {
      const { data } = res

      this.columns = [
        {
          title: '渠道',
          width: 100,
          align: 'center',
          dataIndex: 'channelName',
        },
        {
          title: '资源数',
          align: 'center',
          dataIndex: 'resourcesCount',
        },
      ]

      let months = data[0].months
      for (const key in months) {
        let item = months[key]
        const col1 = {
          title: `${key}报名数`,
          align: 'center',
          dataIndex: `months.${key}.enrollNumber`,
        }

        const col2 = {
          title: `${key}累计报名率`,
          align: 'center',
          dataIndex: `months.${key}.enrollRate`,
        }
        this.columns.push(col1)
        this.columns.push(col2)
      }
      return res
    },
    async queryChart(params) {
      let res = await resourcesEnrollConversionReport(params)
      this.drawChart(res.data)
    },
    drawChart(queryData) {
      let chart = this.$charts.init(document.getElementById(this.chartID))
      chart.clear()

      let option = {
        title: {
          text: '渠道资源报名率转化周期看板',
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: [],
          bottom: 0
        },
        xAxis: {
          name: '月份',
          type: 'category',
          axisTick: {
            alignWithLabel: true,
          },
          data: []
        },
        yAxis: {
          name: '报名率',
          align: 'left',
          type: 'value',
          axisLabel: {
            formatter: "{value}%",
          },
        },
        series: [
        ]
      }

      const { series, xAxis } = queryData

      if (series.length > 0) {
        for (const item of series) {
          const { name } = item
          item.type = 'line'
          item.label=this.seriesLabel
          option.legend.data.push(name)
        }
      } else {
        option.yAxis.min = 0
        option.yAxis.max = 100
      }
      for (const item of xAxis) {
        option.xAxis.data.push(item)
      }
      option.series = series

      window.addEventListener("resize", () => {
        chart.resize()
      })
      chart.setOption(option)
    },
    _refreshTable() {
      this.$refs.table.refresh()
    },
    searchSubmit(data, type) {
      if (type == 'isReset') {
        this.queryParams = {
          isYouGe: false,
          channelIds: defaultChannel.join(','),
        }
        return
      }

      const { closingDate, startDate, endDate } = data
      if (!startDate || !endDate) {
        return this.$notification['warning']({
          message: '提示',
          description:
            '请选择资源录入日期',
        })
      }

      if (moment(closingDate).isBefore(moment(startDate))) {
        return this.$notification['warning']({
          message: '提示',
          description:
            '报名截止月份不能早于资源录入开始日期',
        })
      }

      this.queryParams = data
      this._refreshTable()

    },

  }
}
</script>

<style lang="less" scoped>

</style>