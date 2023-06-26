<template>
  <div>
    <a-card :bordered="false">
      <search-com-pro :style="{ padding: '10px 0' }" :searchParams="searchParams" @searchSubmit="searchSubmit"></search-com-pro>
    </a-card>

    <a-card :bordered="false" :style="{ margin: '20px 0' }">
      <div class="mb20">
        <a-button type="primary" icon="download" @click.native="downloadStu">导出</a-button>
      </div>
      <a-spin tip="加载中..." :spinning="spinning">
        <a-table
          ref="table1"
          class="mt20"
          bordered
          :pagination="false"
          :data-source="dataSource1"
          :columns="columns1"
          :rowKey="(record, index) => index"
          :rowClassName="rowClassName"
          :scroll="{ x: true }"
        >
          <span slot="number" slot-scope="text, record, index, indent">
            <span v-if="Number(text || 0) === 0">{{text}}</span>
            <a v-else @click="toDetail(record, indent)">{{text}}</a>
          </span>
        </a-table>
      </a-spin>
      <a-spin tip="加载中..." :spinning="spinning">
        <a-table
          ref="table2"
          class="mt20"
          bordered
          :pagination="false"
          :data-source="dataSource2"
          :columns="columns2"
          :rowKey="(record, index) => index"
          :rowClassName="rowClassName"
          :scroll="{ x: true }"
        >
          <span slot="number" slot-scope="text, record, index, indent">
            <span v-if="Number(text || 0) === 0">{{text}}</span>
            <a v-else @click="toDetail(record, indent)">{{text}}</a>
          </span>
        </a-table>
      </a-spin>
      <a-spin tip="加载中..." :spinning="spinning">
        <a-table
          ref="table3"
          class="mt20"
          bordered
          :pagination="false"
          :data-source="dataSource3"
          :columns="columns3"
          :rowKey="(record, index) => index"
          :rowClassName="rowClassName"
        >
          <span slot="number" slot-scope="text, record, index, indent">
            <span v-if="Number(text || 0) === 0">{{text}}</span>
            <a v-else @click="toDetail(record, indent)">{{text}}</a>
          </span>
        </a-table>
      </a-spin>
    </a-card>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { ACCESS_TOKEN } from '@/store/mutation-types'
  import moment from 'moment'
  import { STable, PermBox, SearchComPro } from '@/components'
  import { getSchoolList } from '@/api/education/card'
  import { auditionRegisterReport } from '@/api/organize'

  const defaultStart = moment()
    .date(1)
    .format('YYYY-MM-DD')
  const defaultEnd = moment()
    .format('YYYY-MM-DD')
  const defaultSchoolId =['0c18166a-679b-414e-ac2e-c05ba7a2f4c4', '8f63afe7-09ca-4d11-ac51-1187e4381e63', '407913a7-76ff-40ce-967f-0ce0bf0bcdd3', '8109e909-8c8e-463a-9e10-a0804bc59b79', '150d8748-87ab-4935-8f6f-7233d1294413', '4c58a4b3-157b-493f-8b72-707196a26453', 'e07cad7c-7415-421c-a77e-48146d33a3bc', '0c185455-7ae8-4207-a517-91a2f5f26030', '88c5e24d-15c1-4e7c-adfb-f5e291562c33', '5aa46e02-28b9-4e31-936f-60721e07696d', '2d30de5a-9e47-4669-a9e9-534085ab6353', '7b0f4b73-83d9-4d46-adb0-78138e7ed633', '080aabad-e46b-479e-b130-169e970427e0', '66298d15-894b-4e48-9551-5d3795470304', '4e94a672-0bbd-48cd-ab50-8db3a4f4a57f',  'b337887b-ce9d-49e6-89c5-4f822c94d457', '5c3f5874-f9aa-437a-b1cc-9c5cf6339c3f', '50232e74-16d1-438d-9c09-bc7454b13fe0', '999e8fb9-6c98-4cc5-bab3-2a2937a36836', 'd923d38e-1699-4137-8f2a-315dcf2fa017', '5c0f0a94-346f-4e82-8848-f8882a7ac0ae', '7aa9901b-6d7f-44a3-8640-e0935516514c', '1207948e-746c-4dc3-9dd8-ab9c4493b49e', '47a6e64a-c166-4bb6-874c-f7e5c91666d7', 'c066c789-e642-45c8-9486-d7e684d44dca', '457cadbe-f9a8-4d18-87b4-85051f99898b', '6209c9c1-9b8f-42f2-9214-a7db8d5ece5a', 'b29cfda3-9609-4939-a8c4-4fe240f54f91']
  const customHeaderCell1 = column => {
    return {
      style: {
        background: '#f7fbff'
      }
    }
  }
  const customHeaderCell2 = column => {
    return {
      style: {
        background: '#fafafa'
      }
    }
  }
  const columns1 = [
    {
      title: '地区',
      dataIndex: 'deptArea',
      align: 'center',
      fixed: 'left',
      width: 100,
      customRender: (value, row, index) => {
        const obj = {
          children: value,
          attrs: {},
        }
        if (value === '合计') {
          obj.attrs.colSpan = 2
        }
        return obj
      }
    },
    {
      title: '分馆',
      dataIndex: 'deptName',
      align: 'center',
      fixed: 'left',
      width: 160,
      customRender: (value, row, index) => {
        const obj = {
          children: value,
          attrs: {},
        }
        if (value === '合计') {
          obj.attrs.colSpan = 0
        }
        return obj
      }
    },
    {
      title: '资源总数（常规班+未定班型）',
      dataIndex: 'resourceCount',
      align: 'center',
      width: 100
    },
    {
      title: '来访人数',
      dataIndex: 'visitNumber',
      align: 'center',
      width: 100
    },
    {
      title: '邀约率',
      dataIndex: 'invitationRate',
      align: 'center',
      width: 100
    },
    {
      title: '分馆总计',
      customHeaderCell: customHeaderCell1,
      children: [
        {
          title: '试课总人数',
          dataIndex: 'danceCount.auditionCourseCount',
          align: 'center',
          width: 100,
          scopedSlots: { customRender: 'number' }
        },
        {
          title: '总报名人数',
          dataIndex: 'danceCount.enrollCourseCount',
          align: 'center',
          width: 100,
          scopedSlots: { customRender: 'number' }
        },
        {
          title: '成功率',
          dataIndex: 'danceCount.successRate',
          align: 'center',
          width: 100
        },
        {
          title: '总金额',
          dataIndex: 'danceCount.enrollMoneyCount',
          align: 'center',
          width: 100,
          scopedSlots: { customRender: 'number' }
        }
      ]
    }
  ]
  const columns2 = [
    {
      title: '地区/合计',
      dataIndex: 'deptArea',
      align: 'center',
      fixed: 'left',
      width: 100
    },
    {
      title: '资源总数（常规班+未定班型）',
      dataIndex: 'resourceCount',
      align: 'center',
      width: 100
    },
    {
      title: '来访人数',
      dataIndex: 'visitNumber',
      align: 'center',
      width: 100
    },
    {
      title: '邀约率',
      dataIndex: 'invitationRate',
      align: 'center',
      width: 100
    },
    {
      title: '分馆总计',
      customHeaderCell: customHeaderCell1,
      children: [
        {
          title: '试课总人数',
          dataIndex: 'danceCount.auditionCourseCount',
          align: 'center',
          width: 100,
          scopedSlots: { customRender: 'number' }
        },
        {
          title: '总报名人数',
          dataIndex: 'danceCount.enrollCourseCount',
          align: 'center',
          width: 100,
          scopedSlots: { customRender: 'number' }
        },
        {
          title: '成功率',
          dataIndex: 'danceCount.successRate',
          align: 'center',
          width: 100
        },
        {
          title: '总金额',
          dataIndex: 'danceCount.enrollMoneyCount',
          align: 'center',
          width: 100,
          scopedSlots: { customRender: 'number' }
        }
      ]
    }
  ]
  const columns3 = [
    {
      title: '地区/平均值',
      dataIndex: 'deptArea',
      align: 'center',
    },
    {
      title: '资源总数（常规班+未定班型）',
      dataIndex: 'resourceCount',
      align: 'center',
    },
    {
      title: '来访人数',
      dataIndex: 'visitNumber',
      align: 'center',
    },
    {
      title: '邀约率',
      dataIndex: 'invitationRate',
      align: 'center',
    },
    {
      title: '分馆总计',
      customHeaderCell: customHeaderCell1,
      children: [
        {
          title: '试课总人数',
          dataIndex: 'danceCount.auditionCourseCount',
          align: 'center',
          scopedSlots: { customRender: 'number' }
        },
        {
          title: '总报名人数',
          dataIndex: 'danceCount.enrollCourseCount',
          align: 'center',
          scopedSlots: { customRender: 'number' }
        }
      ]
    }
  ]

  export default {
    components: {
      STable,
      PermBox,
      SearchComPro
    },
    data() {
      let schoolIds = this.$store.getters.school_id ? [this.$store.getters.school_id] : defaultSchoolId
      return {
        schoolIds,
        searchParams: [
          {
            type: 'treeSelect',
            isShow: !!!this.$store.getters.school_id,
            key: 'school_id',
            label: '分馆',
            placeholder: '请选择分馆',
            expandAll: true,
            mutiple: true,
            show: true,
            treeCheckable: true,
            selectFather: true,
            defaultVal: schoolIds,
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
            label: '时间日期',
            placeholder: '请选择时间',
            show: true,
            format: 'YYYY-MM-DD',
            defaultVal: [moment(defaultStart, 'YYYY-MM-DD'), moment(defaultEnd, 'YYYY-MM-DD')],
            isDate: true
          },
          {
            type: 'select',
            key: 'classType',
            label: '试课班型',
            placeholder: '请选择试课班型',
            initialValue: ['B', 'E'],
            initialIndex: [1, 2],
            show: true,
            mode:'multiple',
            staticArr: [
              {
                string: '教练班',
                value: 'A'
              },
              {
                string: '少儿班',
                value: 'B'
              },
              {
                string: '常规班',
                value: 'E'
              },
              {
                string: '集训班',
                value: 'd5b119a6-d7df-403d-a9e1-cb3de7af1479'
              }
            ]
          },
        ],
        queryParam: {
          startDate: defaultStart,
          endDate: defaultEnd,
          school_id: schoolIds.join(','),
          classType: 'B,E',
        },
        columns1,
        columns2,
        columns3,
        dataSource1: [],
        dataSource2: [],
        dataSource3: [],
        spinning: false
      }
    },
    created() {
      this.initTable()
    },
    methods: {
      rowClassName(record, index) {
        if (index % 2 === 1) return 'ant-table-even'
      },
      searchSubmit(data, isReset) {
        this.queryParam = data
        if (isReset == 'isReset') {
          this.queryParam = {
            startDate: defaultStart,
            endDate: defaultEnd,
            school_id: this.schoolIds.join(','),
            classType: 'A'
          }
        }
        this.initTable()
      },
      initTable() {
        this.spinning = true
        auditionRegisterReport(Object.assign({}, this.queryParam))
          .then(res => {
            if (res.code == 200 && res.data) {
              const { list, listCount, listAvg } = res.data
              this.columns1 = columns1
              this.dataSource1 = this.formatData(1, list)
              this.dataSource2 = this.formatData(2, listCount)
              this.dataSource3 = listAvg
            }
          })
          .finally(() => {
            this.spinning = false
          })
      },
      formatData(type, list) {
        this['columns' + type] = type === 1 ? columns1 : type === 2 ? columns2 : type === 3 ? columns3 : []
        return list.map((item, index) => {
          item.danceList.forEach((dance, dIndex) => {
            let columnKey = 'dance_' + dIndex
            item[columnKey] = dance
            if (this['columns' + type].findIndex(d => d.title === dance.danceName) < 0) {
              this['columns' + type].push({
                title: dance.danceName,
                customHeaderCell: dIndex % 2 === 1 ? customHeaderCell1 : customHeaderCell2,
                children: [
                  {
                    title: '试课人数',
                    dataIndex: columnKey + '.auditionCount',
                    align: 'center',
                    width: 100,
                    scopedSlots: { customRender: 'number' }
                  },
                  {
                    title: '报名人数',
                    dataIndex: columnKey + '.enrollCount',
                    align: 'center',
                    width: 100,
                    scopedSlots: { customRender: 'number' }
                  },
                  {
                    title: '成功率',
                    dataIndex: columnKey + '.successRate',
                    align: 'center',
                    width: 100
                  },
                  {
                    title: '总金额',
                    dataIndex: columnKey + '.enrollMoney',
                    align: 'center',
                    width: 100,
                    scopedSlots: { customRender: 'number' }
                  }
                ]
              })
            }
          })
          delete item.danceList
          return item
        })
      },
      toDetail(record, indent) {
        const { dataIndex } = indent
        let danceIndex = indent.dataIndex.split('.')[0]
        let params = {}
        if (record.branchId) params.school_id = record.branchId
        if (record.branchIds) params.school_id = record.branchIds
        if (dataIndex.includes('danceCount')) {
          params.detailType = dataIndex.includes('audition') ? 'audition' : dataIndex.includes('enroll') ? 'enroll' : ''
        } else if (dataIndex.includes('dance_')) {
          params.crowdType = record[danceIndex].crowdType
          params.danceId = record[danceIndex].danceId
          params.detailType = dataIndex.includes('audition') ? 'audition' : dataIndex.includes('enroll') ? 'enroll' : ''
        }
        const queryParam = Object.assign({}, this.queryParam, params)
        // localStorage.setItem('auditionRegisterReport', JSON.stringify(queryParam))
        const { href } = this.$router.resolve({
          name: 'auditionRegisterReportDetails',
          query:queryParam
        })
        //结合open打开新的页面
        window.open(href, '_blank')
      },
      downloadStu() {
        let exportUrl = '/auditionCourseEnroll/auditionCourseEnrollMasterReportByExport'
        const queryParam = this.queryParam
        const token = Vue.ls.get(ACCESS_TOKEN)
        let fields = [{ name: 'auth_token', value: token }]
        for (let k in queryParam) {
          fields.push({ name: k, value: queryParam[k] })
        }
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
      }
    }
  }
</script>

<style lang="less" scoped type="text/less">
</style>
