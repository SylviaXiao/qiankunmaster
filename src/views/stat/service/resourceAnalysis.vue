<template>
  <div class="fin-profit-paytype-wrapper">
    <div ref="elementSearch" :style="{ padding: '20px 0' }">
      <a-card :bordered="false">
        <search-com-pro :hideReset="false" :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" ref="elementSearch" :searchParams="searchParams">
        </search-com-pro>
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
          ref="table"
          size="default"
          :pageSizeOptions="pageSizeOptions"
          :columns="columns"
          :data="loadData"
          :rowKey="(record, index) => index"
          :scroll="{ x: 2000 }"
        >
          <span slot="stuTags" slot-scope="text, record">
            <a-tooltip>
              <template slot="title">
                {{ formatTags(text) }}
                <!-- <div v-for="item in formatTags(text)" :key="item.id"> -->
                <!-- <span> {{ item.tagName }}</span> -->
                <!-- <span style="padding-right:2px;font-size:12px" v-for="col in item.tagList" :key="col.id"> {{ col.tagName }}</span> -->
                <!-- </div> -->
              </template>
              <span v-show="formatTags(text).length > 0"> {{ formatTags(text) }}</span>
            </a-tooltip>
          </span>
        </s-table>
        <!-- <div v-for="item in totalList" :key="item.key">{{ item.title }}：{{ item.totalValue }}</div> -->
      </a-card>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { resourceAnalysisList } from '@/api/table/table'
import { listEduType, listChannelTree, listEduDance } from '@/api/common'
import { ageBracketNoPermissionList } from '@/api/system'
import { danceTimeListOthers, danceAimListOthers } from '@/utils/intentionStu/adviser'
import { pageSizeOptions } from '@/utils/tableDetails/details'
import { STable } from '@/components'
import { getSchoolList } from '@/api/education/card'
import { SearchComPro } from '@/components'
import { stuTagNoPermissionList } from '@/api/system'
const columns = [
  {
    title: '客户昵称',
    dataIndex: 'userName',
    key: 'userName',
    width: 150
  },
  {
    title: '手机号/微信号/QQ号',
    dataIndex: 'userPhone',
    key: 'userPhone',
    align: 'center',
    width: 300,
    customRender: (text, record) => {
      let { userPhone, userWeChat, userQQ } = record
      return (userPhone || '') + (userPhone && userWeChat ? '/' : '') + (userWeChat || '') + (userQQ && userWeChat ? '/' : '') + (userQQ || '')
    }
  },
  {
    title: '客服',
    dataIndex: 'userSource',
    key: 'userSource',
    ellipsis: true,
    width: 120
  },
  {

    title: '部门/渠道',
    dataIndex: 'channelName',
    key: 'channelName',
    ellipsis: true,
    width: 170
  },
  {
    title: '分配分馆',
    dataIndex: 'deptName',
    key: 'deptName',
    width: 200
  },
  {
    title: '分单分馆',
    dataIndex: 'spitDeptName',
    key: 'spitDeptName',
    width: 200,
    ellipsis: true
  },
  {
    title: '资源录入日期',
    dataIndex: 'createDate',
    width: 135,
    key: 'createDate'
  },
  {
    title: '所在城市',
    dataIndex: 'userArea',
    width: 200,
    key: 'userArea',
    ellipsis: true
  },
  {
    title: '地域归属',
    dataIndex: 'regionalAttribution',
    key: 'regionalAttribution',
    width: 70,
    customRender: (text, record) => {
      if (text == 'A') {
        return '本地资源'
      } else if (text == 'B') {
        return '地级市资源'
      } else if (text == 'C') {
        return '外地资源'
      } else {
        return ''
      }
    }
  },
  {
    title: '客户年龄',
    dataIndex: 'userAge',
    width: 100,
    key: 'userAge',
    isTotal: true
  },
  {
    title: '客户年龄段',
    dataIndex: 'ageStart',
    width: 100,
    key: 'ageStart',
    customRender: (text, record) => {
      let { ageStart, ageEnd } = record
      if (!ageEnd) return ''
      return ageStart + '-' + ageEnd
    }
  },
  {
    title: '报名年龄',
    dataIndex: 'birthday',
    width: 100,
    key: 'birthday'
  },

  {
    title: '是否已试课',
    dataIndex: 'userAudition',
    width: 120,
    key: 'userAudition',
    customRender: (text, record) => {
      if (text == 'Y') {
        return '是'
      } else if (text == 'N') {
        return '否'
      } else {
        return ''
      }
    }
  },
  {
    title: '咨询班型',
    dataIndex: 'classTypeName',
    key: 'classTypeName',
    width: 100
  },
  {
    title: '跟进顾问',
    dataIndex: 'followAdviser',
    key: 'followAdviser',
    width: 100
  },
  {
    title: '报名状态',
    dataIndex: 'isSign',
    width: 100,
    key: 'isSign',
    customRender: (text, record) => {
      if (text === 'Y') {
        return '已报名'
      } else if (text == 'N') {
        return '未报名'
      } else {
        return ''
      }
    }
  },
  {
    title: '是否退费',
    dataIndex: 'isRefund',
    key: 'isRefund',
    width: 100
  },
  {
    title: '报名班型',
    dataIndex: 'enrollClassTypeName',
    width: 150,
    key: 'enrollClassTypeName',
    ellipsis: true
  },
  {
    title: '报名舞种',
    dataIndex: 'enrollDanceName',
    key: 'enrollDanceName',
    width: 100,
    ellipsis: true

  },
  {
    title: '报名类型',
    dataIndex: 'signType',
    width: 100,
    key: 'signType',
    ellipsis: true
  },
  {
    title: '报名金额',
    dataIndex: 'signPrice',
    width: 150,
    key: 'signPrice'
  },
  {
    title: '客服金额',
    dataIndex: 'servicePrice',
    width: 150,
    key: 'servicePrice'
  },
  {
    title: '报名时间',
    dataIndex: 'registrationDate',
    width: 135,
    key: 'registrationDate'
  },
  {
    title: '报名操作时间',
    dataIndex: 'finCreateDate',
    width: 135,
    key: 'finCreateDate'
  },
  {
    title: '舞种',
    dataIndex: 'danceName',
    width: 100,
    key: 'danceName'
  },
  {
    title: '标签',
    dataIndex: 'stuTags',
    key: 'stuTags',
    width: 100,
    scopedSlots: { customRender: 'stuTags' },
    ellipsis: true
  },
  {
    title: '适合学舞时间',
    dataIndex: 'learningDanceTime',
    width: 100,
    key: 'learningDanceTime',
    ellipsis: true,
    customRender: (text, record) => {
      return text
    }
  },
  {
    title: '学舞目的',
    dataIndex: 'dancePurpose',
    width: 100,
    ellipsis: true,
    key: 'dancePurpose'
  }
]
import DISTRICTS from '@/tools/citydata'
const addressOptions = DISTRICTS
const date = new Date()
const defaultStart = moment(date)
  .date(1)
  .format('YYYY-MM-DD')
const defaultEnd = moment()
  .add(1, 'months')
  .date(0)
  .format('YYYY-MM-DD')
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
export default {
  name: 'resourceAnalysis',
  data() {
    return {
      addressOptions,
      stuTagList: [],
      columns,
      //表内容
      loadData: parameter => {
        return resourceAnalysisList(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      }, //搜索项
      //搜索项
      searchParams: [
        {
          type: 'treeSelect',
          isShow: true,
          show: true,
          key: 'channelName',
          label: '资源渠道',
          placeholder: '请选择资源渠道',
          expandAll: true,
          mutiple: true,
          search: true,
          selectFather: true,
          noBranch: true,
          // treeCheckable: true,
          treeOps: {
            api: listChannelTree,
            label: 'name',
            value: 'id',
            children: 'children'
          }
        },
        // {
        //   type: 'cascader',
        //   key: 'channelName',
        //   label: '资源渠道',
        //   show: true,
        //   placeholder: '请选择资源渠道',
        //   treeOps: {
        //     api: listChannelTree,
        //     label: 'name',
        //     value: 'id',
        //     children: 'children'
        //   }
        // },
        {
          type: 'date',
          key: 'Date',
          label: '资源录入日期',
          show: true,
          placeholder: '请选择日期',
          format: 'YYYY-MM-DD',
          defaultVal: [moment(defaultStart, 'YYYY-MM-DD'), moment(defaultEnd, 'YYYY-MM-DD')],
          isDate: true
        },
        {
          type: 'cascader',
          key: 'city',
          label: '所在城市',
          show: true,
          search: true,
          placeholder: '请选择所在城市',
          treeOps: {
            options: addressOptions,
            api: '',
            label: 'value',
            value: 'value',
            children: 'children'
          }
        },
        {
          type: 'select', // 静态select框
          key: 'ascription',
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
          type: 'select', // 静态select框
          key: 'ageBracket',
          label: '年龄段',
          show: true,
          placeholder: '请选择年龄段',
          apiOption: {
            api: ageBracketNoPermissionList, // promise类型的接口
            string: this.getAgeList,
            value: 'id'
          }
        },
        {
          type: 'select', // 静态select框
          key: 'audition',
          label: '是否试课',
          show: true,
          placeholder: '请选择是否试课',
          staticArr: [
            {
              string: '是 ',
              value: 'Y'
            },
            {
              string: '否',
              value: 'N'
            }
          ]
        },
        // {
        //   type: 'select', //动态select框
        //   key: 'classTypeName',
        //   show: true,
        //   label: '报名班型',
        //   placeholder: '请选择报名班型',
        //   apiOption: {
        //     api: listEduType, // promise类型的接口
        //     string: 'name',
        //     value: 'name'
        //   }
        // },
        {
          type: 'select', // 静态select框
          key: 'danceTime',
          label: '学舞时间',
          show: true,

          placeholder: '请选择学舞时间',
          staticArr: danceTimeListOthers
        },
        {
          type: 'select', // 静态select框
          key: 'dancePurpose',
          label: '学舞目的',

          show: true,
          placeholder: '请选择学舞目的',
          staticArr: danceAimListOthers
        },
        {
          type: 'select', // 静态select框
          key: 'youGe',
          label: '是否包含优鸽',
          show: true,
          placeholder: '请选择是否包含优鸽',
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
          type: 'select', // 静态select框
          key: 'isSign',
          label: '报名状态',
          show: true,
          placeholder: '请选择报名状态',
          staticArr: [
            {
              string: '已报名',
              value: 'Y'
            },
            {
              string: '未报名',
              value: 'N'
            }
          ]
        },
        {
          type: 'select', // 静态select框
          key: 'resourceType',
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
          type: 'select', // 静态select框
          key: 'isRefund',
          label: '是否含退费',
          show: true,
          placeholder: '请选择是否含退费',
          staticArr: [
            {
              string: '包含',
              value: 'Y'
            },
            {
              string: '不含',
              value: 'N'
            }
          ]
        },
        {
          type: 'treeSelect',
          isShow: true,
          key: 'deptIds',
          label: '分配分馆',
          placeholder: '请选择分配分馆',
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
          type: 'treeSelect',
          isShow: true,
          show: true,
          key: 'spitSchoolId',
          label: '分单分馆',
          placeholder: '请选择分馆',
          expandAll: true,
          mutiple: true,
          selectFather: true,
          treeCheckable: true,
          treeOps: {
            api: getSchoolList,
            label: 'deptName',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'select', //动态select框
          key: 'tagId',
          show: true,

          label: '标签',
          placeholder: '请选择标签',
          apiOption: {
            api: stuTagNoPermissionList, // promise类型的接口
            string: 'tagName',
            value: 'id'
          }
        },
        {
          type: 'date',
          key: 'RegistrationDate',
          label: '报名时间',
          show: true,
          placeholder: '请选择报名时间',
          format: 'YYYY-MM-DD',
          isDate: true
        },
        {
          type: 'text',
          key: 'userSource',
          label: '客服',
          placeholder: '请输入客服',
          show: true,
        },
        // {
        //   type: 'select', //动态select框
        //   key: 'enrollDanceIds',
        //   show: true,
        //   label: '报名舞种',
        //   placeholder: '请选择舞种',
        //   mode: 'multiple',
        //   apiOption: {
        //     api: listEduDance, // promise类型的接口
        //     string: 'name',
        //     value: 'id'
        //   }
        // },
        {
          type: 'chooseModal',
          key: 'master',
          label: '跟进顾问',
          multiple: false,
          placeholder: '请选择',
          show: true,
        },
        {
          type: 'select', //动态select框
          key: 'eduTypeId',
          show: true,
          mode:'multiple',
          label: '咨询班型',
          placeholder: '请选择班型',
          apiOption: {
            api: listEduType, // promise类型的接口
            string: 'name',
            value: 'id'
          }
        },
      ],
      totalList: [],
      pageSizeOptions: pageSizeOptions,
      queryParam: {
        startDate: defaultStart,
        endDate: defaultEnd
      },
      //表格是否加载
      rpSpinning: false
    }
  },
  components: {
    STable,
    SearchComPro
  },
  created() {
    this.getStuTagList()
  },

  methods: {
    getStuTagList() {
      stuTagNoPermissionList().then(res => {
        this.stuTagList = res.data
      })
    },
    formatTags(tags) {
      if (tags) {
        let tag = tags ? tags.split(',') : ''
        let tagList = []
        this.stuTagList.forEach(item => {
          if (tag.includes(item.id)) {
            tagList.push({
              tagName: item.tagName,
              id: item.id
            })
          }
        })
        return tagList.map(item => item.tagName).join(',')
      } else {
        return ''
      }
    },
    getAgeList(item) {
      return item.ageStart + '-' + item.ageEnd
    },
    searchSubmit(data,reset) {
      this.queryParam = data
      if(reset){
          this.queryParam.startDate = defaultStart
          this.queryParam.endDate = defaultEnd
      }
      console.log(111,this.queryParam)
      this.$refs.table.refresh()
    }, //导出
    downloadStu() {
      let exportUrl = '/student/user/resourceAnalysisListByExportExcel'
      const { queryParam } = this
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
    }
  }
}
</script>

<style lang="less" scoped></style>
