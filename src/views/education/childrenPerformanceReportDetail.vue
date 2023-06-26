<template>
  <div>
    <a-card :bordered="false" style="margin: 20px 0;">
      <search-com-pro :style="{ padding: '10px 0' }" :searchParams="searchParams" @searchSubmit="searchSubmit"></search-com-pro>
    </a-card>
    <a-card :bordered="false">
      <div class="mb20">
        <a-space :size="15">
          <perm-box perm="education:children:down">
            <a-button type="primary" @click="handleReportExport">导出</a-button>
          </perm-box>
        </a-space>
      </div>
      <a-table ref="table" :rowClassName="rowClassName" :columns="columns" :dataSource="dataSource" :rowKey="(record, index) => index" :pagination="false">
        <span slot="renewalCardNum" slot-scope="text, record">
          <a href="#" @click="handleInfoOpen('A', record)" :style="!handlePermBox(permMap.A) ? 'cursor: text' : ''">
            {{text || 0}}
          </a>
        </span>
        <span slot="expireRenewalCardNumber" slot-scope="text, record">
          <a href="#" @click="handleInfoOpen('C', record)" :style="!handlePermBox(permMap.C) ? 'cursor: text' : ''">
            <span class="greyColor">{{record.expireRenewalCardNumber || 0}} /</span>
            {{record.expireRenewalCardPrice || 0}}
          </a>
        </span>
        <span slot="unexpiredRenewalCardNumber" slot-scope="text, record">
          <a href="#" @click="handleInfoOpen('D', record)" :style="!handlePermBox(permMap.D) ? 'cursor: text' : ''">
            <span class="greyColor">{{record.unexpiredRenewalCardNumber || 0}} /</span>
            {{record.unexpiredRenewalCardPrice || 0}}
          </a>
        </span>
        <span slot="delayRenewalCardNumber" slot-scope="text, record">
          <a href="#" @click="handleInfoOpen('E', record)" :style="!handlePermBox(permMap.E) ? 'cursor: text' : ''">
            <span class="greyColor">{{record.delayRenewalCardNumber || 0}} /</span>
            {{record.delayRenewalCardPrice || 0}}
          </a>
        </span>
        <span slot="lossRenewalCardNum" slot-scope="text, record">
          <a href="#" @click="handleInfoOpen('B', record)" :style="!handlePermBox(permMap.B) ? 'cursor: text' : ''">
            {{text || 0}}
          </a>
        </span>
      </a-table>
    </a-card>

    <!-- 详情 -->
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :title="infoTitle"
      width="80%"
      v-model="infoVisible"
      @cancel="handleInfoCancel"
    >
      <childrenPerformanceReportInfo ref="reportInfo" v-if="infoVisible" :status="infoStatus" :id="$route.params.id" :deptId="deptId" :eduDance="eduDance" />
      <div slot="footer">
        <a-button @click.stop="handleInfoCancel">关闭</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { ACCESS_TOKEN } from '@/store/mutation-types'
  import { STable, SearchComPro, PermBox } from '@/components'
  import childrenPerformanceReportInfo from './childrenPerformanceReportInfo'
  import { listEduDance } from '@/api/common'
  import { getSchoolList } from '@/api/education/card'
  import { listAchievementDetail } from '@/api/education'

  const searchParams = [
    {
      type: 'treeSelect',
      isShow: true,
      key: 'schoolIds',
      label: '选择分馆',
      placeholder: '请选择分馆',
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
      type: 'select',
      key: 'eduDance',
      label: '舞种',
      placeholder: '请选择舞种',
      apiOption: {
        api: listEduDance,
        string: 'name',
        value: 'id'
      }
    }
  ]
  const columns = [
    {
      title: '地区',
      dataIndex: 'parentDeptName'
    },
    {
      title: '分馆',
      dataIndex: 'deptName'
    },
    {
      title: '应续卡人数',
      dataIndex: 'renewalCardNum',
      scopedSlots: { customRender: 'renewalCardNum' }
    },
    {
      title: '到期续卡计次/金额',
      dataIndex: 'expireRenewalCardNumber',
      scopedSlots: { customRender: 'expireRenewalCardNumber' }
    },
    {
      title: '未到期续卡计次/金额',
      dataIndex: 'unexpiredRenewalCardNumber',
      scopedSlots: { customRender: 'unexpiredRenewalCardNumber' }
    },
    {
      title: '延期续卡计次/金额',
      dataIndex: 'delayRenewalCardNumber',
      scopedSlots: { customRender: 'delayRenewalCardNumber' }
    },
    {
      title: '流失续卡人数',
      dataIndex: 'lossRenewalCardNum',
      scopedSlots: { customRender: 'lossRenewalCardNum' }
    }
  ]

  export default {
    name: 'childrenPerformanceReportDetail',
    components: {
      SearchComPro,
      STable,
      PermBox,
      childrenPerformanceReportInfo
    },
    data() {
      return {
        searchParams,
        columns,
        permMap: {
          A: 'education:children:renewalCard',
          B: 'education:children:loss',
          C: 'education:children:renewal',
          D: 'education:children:renewal',
          E: 'education:children:renewal',
        },
        queryParam: {},
        dataSource: [],
        infoVisible: false,
        infoTitle: '',
        infoStatus: '',
        deptId: '',
        eduDance: ''
      }
    },
    created() {
    },
    watch: {
      $route: {
        handler: function(nv, ov) {
          if (nv.name === 'childrenPerformanceReportDetail') {
            this.initTabTitle()
          }
          if (nv?.params?.id !== ov?.params?.id) {
            this.initTable()
          }
        },
        immediate: true
      }
    },
    methods: {
      rowClassName(record, idx) {
        if (idx % 2 === 1) return 'ant-table-even'
      },
      handlePermBox(str) {
        return this.$tools.checkPerm(str)
      },
      searchSubmit(data) {
        this.queryParam = data
        this.initTable()
      },
      initTabTitle() {
        this.$multiTab.rename(this.$route.fullPath, '少儿绩效报表 - ' + this.$route.params.title)
      },
      initTable() {
        const id = this.$route.params.id
        listAchievementDetail(Object.assign({ id }, this.queryParam)).then(res => {
          if (res.code == 200) {
            this.dataSource = res.data || []

            if (this.dataSource.length > 0) {
              const renewalCardNum = this.dataSource.map(d => d.renewalCardNum)
                .reduce((a, b) => this.$number(a || 0).plus(b || 0), this.$number(0))
                .toNumber()
              const expireRenewalCardNumber = this.dataSource.map(d => d.expireRenewalCardNumber)
                .reduce((a, b) => this.$number(a || 0).plus(b || 0), this.$number(0))
                .toNumber()
              const expireRenewalCardPrice = this.dataSource.map(d => d.expireRenewalCardPrice)
                .reduce((a, b) => this.$number(a || 0).plus(b || 0), this.$number(0))
                .toNumber()
              const unexpiredRenewalCardNumber = this.dataSource.map(d => d.unexpiredRenewalCardNumber)
                .reduce((a, b) => this.$number(a || 0).plus(b || 0), this.$number(0))
                .toNumber()
              const unexpiredRenewalCardPrice = this.dataSource.map(d => d.unexpiredRenewalCardPrice)
                .reduce((a, b) => this.$number(a || 0).plus(b || 0), this.$number(0))
                .toNumber()
              const delayRenewalCardNumber = this.dataSource.map(d => d.delayRenewalCardNumber)
                .reduce((a, b) => this.$number(a || 0).plus(b || 0), this.$number(0))
                .toNumber()
              const delayRenewalCardPrice = this.dataSource.map(d => d.delayRenewalCardPrice)
                .reduce((a, b) => this.$number(a || 0).plus(b || 0), this.$number(0))
                .toNumber()
              const lossRenewalCardNum = this.dataSource.map(d => d.lossRenewalCardNum)
                .reduce((a, b) => this.$number(a || 0).plus(b || 0), this.$number(0))
                .toNumber()
              this.dataSource.push({
                deptId: '',
                deptName: '',
                parentDeptName: '合计',
                renewalCardNum,
                expireRenewalCardNumber,
                expireRenewalCardPrice,
                unexpiredRenewalCardNumber,
                unexpiredRenewalCardPrice,
                delayRenewalCardNumber,
                delayRenewalCardPrice,
                lossRenewalCardNum,
              })
            }
          }
        })
      },

      // 批量导出
      handleReportExport() {
        const { queryParam, $route: { params: { id } } } = this
        const token = Vue.ls.get(ACCESS_TOKEN)
        let fields = [{ name: 'auth_token', value: token }, { name: 'id', value: id }]
        for (let k in queryParam) {
          fields.push({ name: k, value: queryParam[k] })
        }
        const form = document.createElement('form')
        form.action = `${process.env.VUE_APP_URL}/achievement/children/listAchievement/downDetail`
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

      handleInfoOpen(status, record) {
        if (this.handlePermBox(this.permMap[status])) {
          this.infoStatus = status
          this.deptId = record.deptId || this.queryParam.schoolIds
          this.eduDance = this.queryParam.eduDance
          this.infoVisible = true
          if (status === 'A') this.infoTitle = '应续卡人数'
          if (status === 'B') this.infoTitle = '流失续卡人数'
          if (status === 'C') this.infoTitle = '到期续卡计次/金额'
          if (status === 'D') this.infoTitle = '未到期续卡计次/金额'
          if (status === 'E') this.infoTitle = '延期续卡计次/金额'
        }
      },
      handleInfoCancel() {
        this.infoVisible = false
      }
    }
  }
</script>

<style lang="less" type="text/less" scoped>
  .greyColor {
    color: #646566;
  }
</style>
