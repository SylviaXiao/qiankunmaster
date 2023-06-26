<template>
  <div class="teacher-finance-wrapper" ref="elementAll" style="height:calc(100vh - 148px)">
    <perm-box perm="finance:achievementchange:view">
      <div class="search-wrapper" ref="elementSearch">
        <a-card :bordered="false">
          <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"> </search-com-pro>
        </a-card>
      </div>
      <div class="table-wrapper">
        <div ref="elementBtn1">
          <perm-box perm="finance:achievementchange:rollout">
            <a-button icon="plus-circle" type="primary" @click="add()">新增</a-button>
          </perm-box>
        </div>
        <a-card :bordered="false">
          <s-table :showSlider="true" ref="table" :columns="tableColumns" :data="loadData" :scroll="{ x: 1600 }" :rowKey="(record, index) => index">
            <span slot="GetOutConsultingTitle">
              转出业绩顾问
              <a-tooltip placement="topLeft" title="办卡分馆/转出顾问/转出业绩/备注">
                <a-icon type="info-circle" />
              </a-tooltip>
            </span>
            <span slot="GetInConsultingTitle">
              业绩转入顾问
              <a-tooltip placement="topLeft" title="业绩转入分馆/转入顾问/转入业绩/备注">
                <a-icon type="info-circle" />
              </a-tooltip>
            </span>
            <div slot="GetOutConsulting" slot-scope="text, record">
              <div v-for="(item, index) in record.achievementRollOut" :key="index" style="overflow: hidden; text-overflow: ellipsis;">
                <a-tooltip
                  placement="topLeft"
                  :title="`${item.deptName}/${item.adviserName}${item.changePrice ? '/' + item.changePrice + '元' : ''}${item.remark ? '/' + item.remark : ''}`"
                >
                  {{ item.deptName }}{{ '/' + item.adviserName }}{{ item.changePrice ? '/' + item.changePrice + '元' : ''
                  }}{{ item.remark ? '/' + item.remark : '' }}
                </a-tooltip>
              </div>
            </div>
            <div slot="GetInConsulting" slot-scope="text, record">
              <div v-for="(item, index) in record.achievementInto" :key="index" style="overflow: hidden; text-overflow: ellipsis;">
                <a-tooltip
                  placement="topLeft"
                  :title="`${item.deptName}/${item.adviserName}${item.changePrice ? '/' + item.changePrice + '元' : ''}${item.remark ? '/' + item.remark : ''}`"
                >
                  {{ item.deptName }}{{ '/' + item.adviserName }}{{ item.changePrice ? '/' + item.changePrice + '元' : ''
                  }}{{ item.remark ? '/' + item.remark : '' }}
                </a-tooltip>
              </div>
            </div>
            <span slot="action" slot-scope="text, record">
              <perm-box perm="finance:achievementchange:rollout">
                <a v-if="record.isShow==='Y'&&record.achievementInto.length===0"  href="javascript:;" @click="editFinteacher(record)">修改</a>
              </perm-box>
              <perm-box perm="finance:achievementchange:del">
                <a v-if="record.isShow==='Y'"  href="javascript:;" @click="remove(record)">删除</a>
              </perm-box>
            </span>
            <!-- <span slot="createDate" slot-scope="text">
             {{text|filterDate}}
          </span> -->
          </s-table>
        </a-card>
      </div>
      <a-modal
        :maskClosable="$store.state.modalMaskClickEnable"
        :destroyOnClose="true"
        :width="800"
        :title="title"
        :visible="achiModal"
        :showSource="false"
        okText="保存"
        cancelText="取消"
        @cancel="closeAchiModal"
        @ok="saveAhievement()"
      >
        <a-spin :spinning="spinning">
          <a-form :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-row>
              <a-col :lg="12" :md="12" :sm="24">
                <a-form-item label="转卡日期" class="star" v-bind="shortLayout">
                  <a-date-picker format="YYYY-MM-DD" placeholder="请选择时间" :disabled-date="disabledDate" v-model="changeDate" @change="changetime" />
                </a-form-item>
              </a-col>
              <a-col :lg="12" :md="12" :sm="24">
                <a-form-item label="学员转卡信息" class="star" v-bind="defaultLayout">
                  <a-input class="chooseStuCard" disabled placeholder="请选择转卡信息" v-model="ChangeCard">
                    <a-icon slot="addonAfter" type="search" @click="openChooseCard" />
                  </a-input>
                </a-form-item>
              </a-col>
            </a-row>

            <counselorBelongsTable ref="counselorBelongsTable" :total="total" :data-backing="achiInfo" @closeAchiModal="closeAchiModal"></counselorBelongsTable>
            <a-divider orientation="left"><span :style="{ color: 'rgba(1,1,1,.3)' }">顾问转入业绩</span></a-divider>
            <a-row>
              <a-col :lg="12" :md="12" :sm="24">
                <a-form-item label="转入分馆" class="star" v-bind="defaultLayout">
                  <a-tree-select
                    @change="changeSchoolId"
                    v-model="schoolSelect"
                    :allowClear="true"
                    :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                    :treeData="schoolList"
                    treeDefaultExpandAll
                  >
                  </a-tree-select>
                </a-form-item>
              </a-col>
            </a-row>
            <template v-if="achievementInto.length">
              <div v-for="(item, index) in achievementInto" :key="index" style="display: flex;margin-bottom: 10px;">
                <div style="margin-right:20px">业绩转入分馆：{{ item.deptName }}</div>
                <div style="margin-right:20px">顾问：{{ item.adviserName }}</div>
                <div style="margin-right:20px">转入业绩：{{ item.changePrice }}</div>
                <!-- <div style="margin-right:20px">备注：{{ item.remark }}</div> -->
              </div>
            </template>
          </a-form>
        </a-spin>
        <!-- 选择转卡的学生 -->
        <ChooseCard ref="ChooseCard" :multiple="false" @getBackData="getStuData" :invoiceList="true" :noArea="true" :branch="true" :studentNumber="true" />
        <ChooseStu
          ref="choosestu"
          :multiple="false"
          @getBackData="getStuData"
          :invoiceList="true"
          :noArea="true"
          :branch="true"
          :studentNumber="true"
        ></ChooseStu>
      </a-modal>
    </perm-box>
  </div>
</template>

<script>
import STable from '@/components/Table'
import SearchComPro from '@/components/SearchComPro'
import counselorBelongsTable from './counselorBelongsTable'
import PermBox from '@/components/PermBox'
import ChooseCard from '@/components/ChooseCard'
import ChooseStu from '@/components/ChooseStu'
// import { pageFinTeacher, finTeacherChange, finTeacherDelete, finTeacherDetail } from '@/api/recep'
import { pageAchievementRollOut, removeAchievementChangeLog, getRollOutAchievementChangeLog } from '@/api/reception/transferCard'
import { getSchoolList } from '@/api/education/card'
import moment from 'moment'
const defaultLayout = {
  labelCol: { md: { span: 8 } },
  wrapperCol: { md: { span: 14 } }
}
const shortLayout = {
  labelCol: { md: { span: 4 } },
  wrapperCol: { md: { span: 14 } }
}
const tableColumns = [
  {
    title: '转出日期',
    dataIndex: 'rollOutDate',
    key: 'rollOutDate',
    customRender: (text, record) => {
      const { rollOutDate } = record
      console.log(rollOutDate)
      return rollOutDate.split(' ')[0]
    }
  },
  {
    title: '办卡分馆',
    dataIndex: 'planDeptName',
    scopedSlots: { customRender: 'planDeptName' },
    key: 'planDeptName'
  },
  {
    title: '学员转卡信息',
    dataIndex: 'stuPhone',
    customRender: (text, record) => {
      const { type, originalClassName, stuName, targetClassName, targetStuName } = record
      return `${stuName} 转给 ${targetStuName}`
    },
    key: 'stuPhone',
    width: 230
  },
  {
    title: '卡号',
    dataIndex: 'stuCardNo',
    scopedSlots: { customRender: 'stuCardNo' },
    key: 'stuCardNo'
  },
  {
    title: '卡种名称',
    dataIndex: 'cardName',
    scopedSlots: { customRender: 'cardName' },
    key: 'cardName'
  },
  {
    title: '转出业绩金额',
    dataIndex: 'achPrice',
    scopedSlots: { customRender: 'achPrice' },
    key: 'achPrice'
  },
  {
    // title: '转出业绩顾问',
    dataIndex: 'adviserName',
    scopedSlots: { customRender: 'GetOutConsulting', title: 'GetOutConsultingTitle' },
    key: 'adviserName',
    width: 270
  },
  {
    title: '业绩转入分馆',
    dataIndex: 'deptName',
    scopedSlots: { customRender: 'deptName' },
    key: 'deptName'
  },
  {
    // title: '业绩转入顾问',
    dataIndex: 'changeRemark',
    scopedSlots: { customRender: 'GetInConsulting', title: 'GetInConsultingTitle' },
    key: 'changeRemark',
    width: 270
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
    key: 'action'
  }
]

export default {
  components: {
    STable,
    SearchComPro,
    PermBox,
    counselorBelongsTable,
    ChooseCard,
    ChooseStu
  },
  data() {
    return {
      height: 0, //滚动条高度
      // 修改业绩
      total: 0,
      achiModal: false,
      achiInfo: [], //回显数组
      spinning: false,
      tableColumns,
      defaultLayout,
      shortLayout,
      searchParams: [
        {
          type: 'date',
          key: 'Date',
          label: '转出日期查询',
          placeholder: '请选择转出日期',
          format: 'YYYY-MM-DD'
        },
        {
          type: 'treeSelect',
          isShow: !!!this.$store.getters.school_id,
          key: 'school_id',
          label: '选择转出分馆',
          placeholder: '请选择转入分馆',
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
          key: 'stuCard',
          label: '卡信息',
          placeholder: '请输入卡信息'
        },
        {
          type: 'text',
          key: 'stuInfo',
          label: '学员信息',
          placeholder: '请输入学员信息'
        }
        // {
        //   type: 'text',
        //   key: 'adviser',
        //   label: '顾问',
        //   placeholder: '请选择顾问'
        // }
      ],
      queryParam: {},
      loadData: parameter => {
        let params = Object.assign({}, this.queryParam, parameter)
        return pageAchievementRollOut(params).then(res => {
          return res
        })
      },
      title: '新增转出业绩',
      ChangeCard: '', //
      stuCardChangeLogId: '', //学生转卡选择ID
      //分馆id
      schoolList: [],
      schoolSelect: null,
      deptId: null,
      changeSchool: false,
      changeDate: null,
      achievementInto: []
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        let { selectKey } = this.$route.query
        if (route.name == 'transferCardManagement' && selectKey == '0') {
          let { stuCard, endDate, startDate } = this.$route.query
          if (stuCard) this.queryParam.stuCard = stuCard
          if (endDate) this.queryParam.endDate = endDate
          if (startDate) this.queryParam.startDate = startDate
          this.$forceUpdate()
          if (this.$refs.table) this.$refs.table.refresh()
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    moment,
    changetime(date) {
      this.changeDate = this.$tools.tailor.getDate(date)
    },
    disabledDate(current) {
      if (moment().date() <= 2) {
        return current < moment().subtract(1, 'months').startOf('month') || current > moment().endOf('day')
      }
      return current < moment().startOf('month') || current > moment().endOf('day')
    },
    changeSchoolId() {
      this.changeSchool = true
    },
    closeAchiModal() {
      this.achiModal = false
      this.stuCardChangeLogId = ''
      this.ChangeCard = null
      this.schoolSelect = null
      this.deptId = null
      this.changeSchool = false
      this.changeDate = null
      this.$refs.counselorBelongsTable.clear()
      this.updateTable()
    },
    //获取分馆数据
    loadSchoolId() {
      //请求接口
      getSchoolList().then(res => {
        if (res.code === 200 && res.data) {
          console.log(res.data)
          this.schoolList = this._handleData(res.data)
        }
      })
    },
    //处理分馆数据
    _handleData(data) {
      return data.map((item, index) => {
        let itemObj = {}
        itemObj.title = item.deptName
        itemObj.value = item.id
        itemObj.key = item.id
        if (item.children) {
          itemObj.children = this._handleData(item.children)
          itemObj.selectable = false
        }
        return itemObj
      })
    },
    saveAhievement() {
      this.$refs.counselorBelongsTable.stuCardChangeLogId = this.stuCardChangeLogId
      this.$refs.counselorBelongsTable.schoolId = this.changeSchool ? this.schoolSelect : this.deptId
      this.$refs.counselorBelongsTable.cardDate = this.changeSchool ? this.changeDate : this.changeDate
      this.$refs.counselorBelongsTable.save()
    },
    add() {
      this.title = '新增转出业绩'
      this.loadSchoolId()
      this.achiModal = true
    },
    //选择学生转卡
    openChooseCard() {
      this.$refs.ChooseCard.open()
      this.ChooseCardOpen = true
    },
    getStuData(data) {
      this.stuCardChangeLogId = data.logId
      this.ChangeCard = `${data.stuName} 转给 ${data.targetName}`
    },
    //修改绩效
    editFinteacher(record) {
      // this.financeId = record.financeId
      this.title = '修改转出业绩'
      this.achievementInto = record.achievementInto
      getRollOutAchievementChangeLog(record.achievementChangeId).then(res => {
        if (res.code == 200) {
          this.ChangeCard = `${res.data.stuName} 转给 ${res.data.targetStuName}`
          this.schoolSelect = res.data.deptName
          this.stuCardChangeLogId = res.data.stuCardChangeLogId
          this.deptId = res.data.deptId
          this.changeDate = res.data.cardDate.split(' ')[0]
          if (res.data.achievements.length) {
            this.achiInfo = res.data.achievements
            this.$nextTick(() => {
              this.$refs.counselorBelongsTable.backData(this.achiInfo, res.data.stuCardChangeLogId, res.data.deptId)
            })
          }
          this.loadSchoolId()
          this.achiModal = true
        }
      })

      // this.spinning = true
      // finTeacherDetail(record.financeId)
      //   .then(res => {
      //     this.total = res.data.totalPrice
      //     this.achiInfo = res.data
      //   })
      //   .finally(() => {
      //     this.spinning = false
      //   })
    },
    remove(record) {
      const _this = this
      this.$confirm({
        title: '系统提示',
        content: '确认删除该条数据吗?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          removeAchievementChangeLog(record.achievementChangeId).then(res => {
            _this.$notification['success']({
              message: '系统通知',
              description: '操作成功'
            })
            _this.updateTable()
          })
        }
      })
    },
    searchSubmit(data) {
      this.queryParam = data
      this.updateTable()
    },
    updateTable() {
      this.$refs.table.loadData()
    }
  }
}
</script>

<style scoped lang="less">
.chooseStuCard {
  /deep/ .ant-input-group {
    width: 200px;
  }
}
.star {
  /deep/ .ant-col-5::before {
    content: '*';
    color: red;
  }
}
</style>
