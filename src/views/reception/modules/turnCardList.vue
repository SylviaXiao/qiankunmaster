<template>
  <div class="teacher-finance-wrapper" ref="elementAll" style="height:calc(100vh - 148px)">
    <perm-box perm="finance:achievementchange:view">
      <div class="search-wrapper" ref="elementSearch">
        <a-card :bordered="false">
          <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"> </search-com-pro>
        </a-card>
      </div>
      <div class="table-wrapper">
        <a-card :bordered="false">
          <s-table
            ref="table"
            :showSlider="true"
            :sliderIndex="1"
            :scroll="{ x: 1600 }"
            :columns="tableColumns"
            :data="loadData"
            :rowKey="(record, index) => index"
          >
            <span slot="GetOutConsultingTitle">
              业绩转出顾问
              <a-tooltip placement="topLeft" title="办卡分馆/转出顾问/转出业绩/备注">
                <a-icon type="info-circle" />
              </a-tooltip>
            </span>
            <span slot="GetInConsultingTitle">
              接收业绩顾问
              <a-tooltip placement="topLeft" title="业绩接收分馆/接收顾问/接收业绩/备注">
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
<!--              <perm-box perm="finance:achievementchange:allocation">-->
<!--                <a href="javascript:;" @click="editFinteacher(record)" v-if="record.allocationType === true">修改</a>-->
<!--              </perm-box>-->
              <perm-box perm="finance:achievementchange:allocation">
                <a href="javascript:;" @click="allocation(record)" v-if="record.allocationType === false && record.isShow==='Y'">分配顾问</a>
              </perm-box>
              <perm-box perm="finance:achievementchange:allocation">
                <a href="javascript:;" @click="cancelAllocation(record)" v-if="record.allocationType === true && record.isShow==='Y'">取消分配</a>
              </perm-box>
              <perm-box perm="finance:achievementchange:del">
                <a v-if="record.isShow==='Y'" href="javascript:;" @click="remove(record)">删除</a>
              </perm-box>
            </span>
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
          <counselorBelongsTable
            ref="counselorBelongsTable"
            :total="total"
            :data-backing="achiInfo"
            @closeAchiModal="closeAchiModal"
            :distribution="true"
          ></counselorBelongsTable>
        </a-spin>
      </a-modal>
    </perm-box>
  </div>
</template>

<script>
import STable from '@/components/Table'
import SearchComPro from '@/components/SearchComPro'
// import BelongsTable from '@/components/BelongsTable'
import PermBox from '@/components/PermBox'
import counselorBelongsTable from './counselorBelongsTable'
// import { pageFinTeacher, finTeacherChange, finTeacherDelete, finTeacherDetail } from '@/api/recep'
import { pageAchievementInto, removeAchievementChangeLog, cancelAchievement,getIntoAchievementChangeLog, getRollOutAchievementChangeLog } from '@/api/reception/transferCard'
import { getSchoolList } from '@/api/education/card'
const tableColumns = [
  {
    title: '转入日期',
    dataIndex: 'intoDate',
    key: 'intoDate',
    customRender: (text, record) => {
      const { intoDate } = record
      return intoDate.split(' ')[0]
    },
    width: 120
  },
  {
    title: '接收业绩分馆',
    dataIndex: 'deptName',
    scopedSlots: { customRender: 'deptName' },
    key: 'deptName',
    width: 130
  },
  {
    title: '学员转卡信息',
    dataIndex: 'stuName',
    customRender: (text, record) => {
      const { type, originalClassName, stuName, targetClassName, targetStuName } = record
      return `${stuName} 转给 ${targetStuName}`
    },
    key: 'stuName',
    width: 220
  },
  {
    title: '卡号',
    dataIndex: 'stuCardNo',
    scopedSlots: { customRender: 'stuCardNo' },
    key: 'stuCardNo',
    width: 120
  },
  {
    title: '卡种名称',
    dataIndex: 'cardName',
    scopedSlots: { customRender: 'cardName' },
    key: 'cardName',
    width: 180
  },
  {
    title: '接收业绩金额',
    dataIndex: 'achPrice',
    scopedSlots: { customRender: 'achPrice' },
    key: 'achPrice',
    width: 200
  },

  {
    // title: '接收业绩顾问',
    dataIndex: 'adviserName',
    // scopedSlots: { customRender: 'adviserName' },
    key: 'adviserName',
    scopedSlots: { customRender: 'GetInConsulting', title: 'GetInConsultingTitle' },
    width: 300
  },
  {
    title: '业绩转出分馆',
    dataIndex: 'planDeptName',
    scopedSlots: { customRender: 'planDeptName' },
    key: 'planDeptName',
    width: 120
  },
  {
    // title: '业绩转出顾问',
    dataIndex: 'changeRemark',
    scopedSlots: { customRender: 'GetOutConsulting', title: 'GetOutConsultingTitle' },
    key: 'changeRemark',
    width: 300
  },
  {
    title: '分配状态',
    dataIndex: 'allocationType',
    customRender: (text, record) => {
      const { allocationType } = record
      return allocationType === false ? '未分配' : allocationType === true ? '已分配' : ''
    },
    key: 'allocationType',
    width: 80
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
    width: 100
  }
]

export default {
  name: 'teacherFinance',
  components: {
    STable,
    SearchComPro,
    PermBox,
    counselorBelongsTable
    // BelongsTable
  },
  watch: {
    $route: {
      handler: function(route) {
        let { selectKey } = this.$route.query
        if (route.name == 'transferCardManagement' && selectKey == '1') {
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
  data() {
    return {
      height: 0, //滚动条高度
      // 修改业绩
      total: 0,
      achiModal: false,
      achiInfo: {},
      spinning: false,

      tableColumns,
      searchParams: [
        {
          type: 'date',
          key: 'Date',
          label: '转入日期查询',
          placeholder: '请选择转出日期',
          format: 'YYYY-MM-DD'
        },
        {
          type: 'treeSelect',
          isShow: !!!this.$store.getters.school_id,
          key: 'school_id',
          label: '选择转入分馆',
          placeholder: '请选择转出分馆',
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
        },
        // {
        //   type: 'text',
        //   key: 'adviser',
        //   label: '顾问',
        //   placeholder: '请选择顾问'
        // },
        {
          type: 'select', // 静态select框
          key: 'allocation',
          label: '分配状态',
          placeholder: '请选择分配状态',
          staticArr: [
            {
              string: '已分配',
              value: 'true'
            },
            {
              string: '未分配',
              value: 'false'
            }
          ]
        }
      ],
      queryParam: {},
      loadData: parameter => {
        let params = Object.assign({}, this.queryParam, parameter)
        return pageAchievementInto(params).then(res => {
          return res
        })
      },
      title: '分配顾问业绩'
    }
  },

  methods: {
    cancelAllocation(record){
      const _this = this
      this.$confirm({
        title: '系统提示',
        content: '确认删除该条数据吗?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          cancelAchievement({
            stuCardChangeLogId:record.stuCardChangeLogId
          }).then(res=>{
            _this.$notification['success']({
              message: '系统通知',
              description: '操作成功'
            })
            _this.updateTable()
          })
        }
      })


    },
    saveAhievement() {
      this.$refs.counselorBelongsTable.stuCardChangeLogId = this.stuCardChangeLogId
      this.$refs.counselorBelongsTable.schoolId = this.schoolSelect
      this.$refs.counselorBelongsTable.save()
    },
    closeAchiModal() {
      this.achiModal = false
      this.$refs.counselorBelongsTable.clear()
      this.updateTable()
    },
    //分配
    async allocation(record) {
      this.title = '分配顾问业绩'
      this.stuCardChangeLogId = record.stuCardChangeLogId
      //获取转出详情
      const { data } = await getRollOutAchievementChangeLog(record.achievementChangeId)
      this.achiModal = true
      if (data) {
        let array = data.achievements.map(item => {
          item.CardName = data.planDeptName
          item.receptionName = data.deptName
          item.cardDate = data.cardDate.split(' ')[0]
          return item
        })
        console.log(array)
        this.$nextTick(() => {
          this.$refs.counselorBelongsTable.achievements = array
        })
      }
    },

    // saveAhievement() {
    //   this.$refs.belongsTable.getTeacherValue().then(res => {
    //     const params = {
    //       financeId: this.financeId,
    //       finTeachers: JSON.stringify(res)
    //     }
    //     if (res.length === 1 && !res[0].teacherId) {
    //       delete params.finTeachers
    //     }
    //     finTeacherChange(this.financeId, params).then(() => {
    //       this.cancelModal()
    //       this.$notification['success']({
    //         message: '系统通知',
    //         description: '操作成功'
    //       })
    //       this.$refs.table.refresh()
    //     })
    //   })
    // },
    async editFinteacher(record) {
      const { data } = await getRollOutAchievementChangeLog(record.achievementChangeId)
      this.achiModal = true
      if (data) {
        let array = data.achievements.map(item => {
          item.CardName = data.planDeptName
          item.receptionName = data.deptName
          item.cardDate = data.cardDate.split(' ')[0]
          return item
        })
        console.log(array)
        this.$nextTick(() => {
          this.$refs.counselorBelongsTable.achievements = array
        })
      }
      getIntoAchievementChangeLog(record.achievementChangeId).then(res => {
        console.log(res)
        if (res.code == 200) {
          this.title = '修改'
          this.stuCardChangeLogId = res.data.stuCardChangeLogId
          if (res.data.achievements.length) {
            this.achiInfo = res.data.achievements
            this.$nextTick(() => {
              this.$refs.counselorBelongsTable.backData(this.achiInfo, res.data.stuCardChangeLogId)
            })
          }
          this.loadSchoolId()
          this.achiModal = true
        }
      })
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

<style scoped lang="less"></style>
