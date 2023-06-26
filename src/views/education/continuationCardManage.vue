<template>
  <div ref="elementAll" style="height:calc(100vh - 84px)">
    <!-- <a-tabs :activeKey="selectKey" @change="selectKeyHandle" defaultActiveKey="0"> -->
    <!-- v-if="handlePermBox('finance:finteacher:view')" -->
    <!-- <a-tab-pane :tab="item.text" v-for="(item, index) in tabList" :key="item.type + ''"> -->
    <div ref="elementSearch" v-if="showSearch">
      <a-card :bordered="false" style="margin: 20px 0 ;">
        <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"></search-com-pro>
      </a-card>
    </div>
    <a-card :bordered="false">
      <div ref="elementBtn" style="display:flex;justify-content: space-between;margin-bottom:20px;">
        <div>
          <perm-box perm="student:cardnextlog:down">
            <a-button type="primary" icon="download" @click.native="downloadStu">
              导出
            </a-button>
          </perm-box>
        </div>
        <a-radio-group @change="_refreshTable" v-model="finCardStatus">
          <a-radio-button value="A">未确认</a-radio-button>
          <a-radio-button value="B">已确认</a-radio-button>
          <a-radio-button value="C">作废</a-radio-button>
          <a-radio-button value="">全部</a-radio-button>
        </a-radio-group>
      </div>
      <!-- <a-card :bordered="false"> -->
      <perm-box perm="student:cardnextlog:view">
        <!-- <s-table :ref="'table' + index" :columns="sc_solumns" :data="sc_loadData" :rowKey="(record,index)=>index"> -->
        <s-table :showSlider="true" :autoLoad='false' :locale="locale" ref="table" :columns="sc_solumns" :data="sc_loadData" :rowKey="(record, index) => index" :scroll="{ x: 1500 }">
          <span slot="stuName" slot-scope="text, record">
            <perm-box :text="record.stuName" perm="student:info:view">
              <router-link :to="{ path: `/reception/studentInfo/${record.stuId}` }">{{ record.stuName }}</router-link>
            </perm-box>
          </span>
          <span slot="usedMsgTitle">
            往期卡信息
            <a-tooltip placement="topLeft" title="往期卡种/往期卡号/结束日期">
              <a-icon type="info-circle" />
            </a-tooltip>
          </span>
          <div slot="usedMsg" slot-scope="text, record">
            <div>{{ record.lastCardName }}{{ '/' + record.lastCardNo }}{{ record.lastEndDate ? '/' + record.lastEndDate.split(' ')[0] : '' }}</div>
          </div>
          <span slot="teacherScore" slot-scope="text, record">
            <span v-for="(item, index) in record.teacher" :key="index">
              {{ item.teacherName }}
              <span v-if="record.teacher.length && record.teacher.length - 1 !== index">,</span>
            </span>
          </span>
          <span slot="score" slot-scope="text, record">
            <span>
              {{ addScore(record.teacher) }}
            </span>
          </span>
          <span slot="cardType" slot-scope="text, record">
            <span>
              {{ getCardType(record) }}
            </span>
          </span>
          <span slot="action" slot-scope="text, record">
            <perm-box perm="student:cardnextlog:save">
              <a href="javascript:;" @click="edit(record)" v-if="record.finCardStatus == 'A' || record.finCardStatus == null">修改</a>
            </perm-box>
            <perm-box perm="student:cardnextlog:save">
              <a href="javascript:;" @click="affirm(record)" v-if="record.finCardStatus == 'A' || record.finCardStatus == null">确认</a>
            </perm-box>
            <perm-box perm="student:cardnextlog:save">
              <a href="#" @click="cancel(record)" v-if="record.finCardStatus !== 'B' && record.finCardStatus !== 'C'">作废</a>
            </perm-box>
            <perm-box perm="student:cardnextlog:del">
              <a href="#" @click="delect(record)">删除</a>
            </perm-box>
          </span>
        </s-table>
      </perm-box>
    </a-card>
    <editContinuedCard @editSubmit="editSubmit" ref="editContinuedCard"></editContinuedCard>
    <!-- <a-modal
      :confirmLoading="loading"
      :maskClosable="$store.state.modalMaskClickEnable"
      :destroyOnClose="true"
      :width="600"
      title="确认绩效"
      @ok="performanceSubmit"
      @cancel="performanceCancel"
      v-model="performanceVisible"
    >
    <a-spin :spinning="spinning">
      <a-form-model-item v-bind="defaultLayout" :label="item.teacherName" prop="toIssueCard" v-for="(item,index) in teacherScore" :key='item.teacherId'>
          <a-input-number  v-model="item.score"  @blur="changePerformance(index,item.score)" :max="100"></a-input-number> 分
      </a-form-model-item>
    </a-spin>
    </a-modal> -->
  </div>
</template>

<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { listEduDance, listEduType, listSysValConf, treeEduClassType } from '@/api/common'
import { cardNextType } from '@/api/education'
import { STable, SearchComPro } from '@/components'
import PermBox from '@/components/PermBox'
import ChooseTea from '@/components/ChooseTea'
import { pageCardNextLog, saveStuTeacherScore, listStuCardNextLog, saveStuCardNextLog, removeStuCardNextLog } from '@/api/reception/student'
import { getSchoolList } from '@/api/education/card'
import editContinuedCard from './continue/editContinuedCard'
import axios from 'axios'
const defaultLayout = {
  labelCol: {
    sm: {
      span: 8
    }
  },
  wrapperCol: {
    sm: {
      span: 12
    }
  }
}

const sc_solumns = [
  {
    title: '续卡日期',
    dataIndex: 'createDate',
    width: 100,
    customRender: (text, record) => {
      const { createDate } = record
      return createDate.split(' ')[0]
    }
  },
  {
    title: '续卡分馆',
    dataIndex: 'deptName',
    width: 120
  },
  {
    title: '学员姓名',
    dataIndex: 'stuName',
    width: 100,
    scopedSlots: { customRender: 'stuName' }
  },
  {
    title: '手机号码',
    dataIndex: 'stuPhone',
    width: 100
  },
  {
    title: '人群',
    dataIndex: 'crowdType',
    key: 'crowdType',
    width: 50,
    customRender: (text, record) => {
      return text === 'B' ? '少儿' : text === 'A' ? '成人' : text === 'C' ? '通用' : ''
    }
  },
  {
    title: '顾问',
    dataIndex: 'userName',
    width: 100
  },
  {
    title: '续卡卡号',
    dataIndex: 'stuCardNo',
    scopedSlots: { customRender: 'stuCardNo' },
    width: 100
  },
  {
    title: '续卡卡种',
    dataIndex: 'cardName',
    width: 200
  },
  {
    title: '续卡班型',
    dataIndex: 'typeNameNew',
    width: 120
  },
  {
    title: '续卡舞种',
    dataIndex: 'danceNameNew',
    width: 120
  },
  {
    title: '续卡卡状态',
    dataIndex: 'cardNewStatus',
    width: 120,
    customRender: (text, record) => {
      return record.cardNewStatus === 'A'
        ? '未使用'
        : record.cardNewStatus === 'B'
        ? '使用中'
        : record.cardNewStatus === 'C'
        ? '停课'
        : record.cardNewStatus === 'D'
        ? '退卡'
        : record.cardNewStatus === 'E'
        ? '结业'
        : record.cardNewStatus === 'F'
        ? '撤销'
                  : record.cardNewStatus === 'G'
                    ? '结转'
        : ''
    }
  },
  {
    title: '续卡实缴金额',
    dataIndex: 'price',
    width: 100
  },
  {
    title: '续卡确认金额',
    dataIndex: 'cardLogPrice',
    width: 100
  },
  {
    title: '续卡个数',
    dataIndex: 'num',
    width: 100,
    customRender: (text, record) => {
      return text ? text : (record.price / record.totalPrice).toFixed(2)
    }
  },
  {
    title: '应缴金额',
    dataIndex: 'totalPrice',
    width: 100,
    scopedSlots: {
      customRender: 'totalPrice'
    }
  },
  // {
  //   title: '缴费类型',
  //   dataIndex: 'finType',
  //   width: 100,
  //   customRender: (text, record) => {
  //     return record.finType === 'A' ? '全款' : record.finType === 'B' ? '定金' : record.finType === 'C' ? '补缴' : record.finType === 'D' ? '退款' : ''
  //   }
  // },
  {
    title: '续卡老师',
    dataIndex: 'teacherScore',
    width: 200,
    scopedSlots: { customRender: 'teacherScore' }
  },
  {
    title: '续卡类型',
    dataIndex: 'cardType',
    width: 150,
    scopedSlots: { customRender: 'cardType' }
    // customRender: (text, record) => {
    //   if (record.cardType) {
    //     let name = ''
    //     name = this.cardNextList.filter(item => item.id == record.cardType)[0].name

    //     return name
    //   } else {
    //     return ''
    //   }

    //   if (record.cardType === 'A') {
    //     name = '本期续卡'
    //   } else if (record.cardType === 'B') {
    //     name = '往期续卡'
    //   } else if (record.cardType === 'C') {
    //     name = '到期续卡'
    //   } else if (record.cardType === 'D') {
    //     name = '未到期续卡'
    //   } else if (record.cardType === 'E') {
    //     name = '延期续卡'
    //   } else if (record.cardType) {
    //     name = record.cardType
    //   } else {
    //     name = ''
    //   }
    //   return name
    // }
  },
  {
    title: '续卡是否缴清',
    dataIndex: 'payoff',
    width: 100,
    customRender: (text, record) => {
      return record.payoff === true ? '已缴清' : record.payoff === false ? '未缴清' : ''
    }
  },
  {
    title: '续卡缴清日期',
    dataIndex: 'cardNewPayDate',
    width: 100,
    customRender: (text, record) => {
      const { cardNewPayDate } = record
      return cardNewPayDate ? cardNewPayDate.split(' ')[0] : ''
    }
  },
  {
    // title: '往期卡信息',
    dataIndex: 'usedMsg',
    width: 300,
    scopedSlots: { customRender: 'usedMsg', title: 'usedMsgTitle' }
  },
  {
    title: '往期卡退费日期',
    dataIndex: 'lastOperateDate',
    width: 120,
    customRender: (text, record) => {
      const { lastOperateDate } = record
      return lastOperateDate ? lastOperateDate.split(' ')[0] : ''
    }
  },
  {
    title: '往期卡班型',
    dataIndex: 'typeNameLast',
    width: 120
  },

  {
    title: '往期卡舞种',
    dataIndex: 'danceNameLast',
    width: 120,
    customRender: (text, record) => {
      let data = text
      if (Array.isArray(record.danceNameAll) && record.danceNameAll.length > 0) {
        data = record.danceNameAll.map(item => item.danceName).join(',')
      }
      return data
    },
    ellipsis: true
  },

  {
    title: '往期卡状态',
    dataIndex: 'cardStatus',
    width: 120,
    scopedSlots: { customRender: 'cardStatus' },
    customRender: (text, record) => {
      return record.cardStatus === 'A'
        ? '未使用'
        : record.cardStatus === 'B'
        ? '使用中'
        : record.cardStatus === 'C'
        ? '停课'
        : record.cardStatus === 'D'
        ? '退卡'
        : record.cardStatus === 'E'
        ? '结业'
        : record.cardStatus === 'F'
        ? '撤销'
                  : record.cardStatus  === 'G'
                    ? '结转'
        : ''
    }
  },
  {
    title: '往期卡是否缴清',
    dataIndex: 'lastPayoff',
    width: 120,
    scopedSlots: { customRender: 'lastPayoff' },
    customRender: (text, record) => {
      return record.lastPayoff === true ? '已缴清' : record.lastPayoff === false ? '未缴清' : ''
    }
  },
  {
    title: '续卡确认情况',
    dataIndex: 'finCardStatus',
    width: 100,
    customRender: (text, record) => {
      return record.finCardStatus === 'A' ? '未确认' : record.finCardStatus === 'B' ? '已确认' : record.finCardStatus === 'C' ? '已作废' : ''
    }
  },
  {
    title: '续卡分类',
    dataIndex: 'sysName',
    width: 200
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: 100
  },
  {
    title: '确认人',
    dataIndex: 'confirmUserName',
    width: 100
  },
  {
    title: '确认时间',
    dataIndex: 'updateDate',
    width: 140
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 150,
    scopedSlots: { customRender: 'action' },
    fixed: 'right'
  }
]
let cardNextTypeList = [
  { string: '本期续卡', value: 'A' },
  { string: '往期续卡', value: 'B' },
  { string: '到期续卡', value: 'C' },
  { string: '未到期续卡', value: 'D' },
  { string: '延期续卡', value: 'E' }
]
export default {
  name: 'stuCards',
  components: {
    SearchComPro,
    STable,
    PermBox,
    ChooseTea,
    editContinuedCard
  },
  data() {
    return {
      isReset:false,
      locale: { emptyText: <div style='font-size: 30px;padding: 100px 0;'>请选择相关筛选条件后，再查询学员信息哦</div> },
      showSearch: false,
      height: 0, //滚动条高度
      selectedRowKeys: [],
      sc_solumns,
      defaultLayout,
      searchParams: [
        {
          type: 'treeSelect',
          isShow: !!!this.$store.getters.school_id,
          key: 'school_id',
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
          type: 'text',
          key: 'stuInfo',
          label: '学员信息',
          placeholder: '学员姓名/手机号码'
        },
        {
          type: 'empty'
        },
        {
          type: 'text',
          key: 'lastStuCardName',
          label: '往期卡卡种',
          placeholder: '请输入往期卡卡种'
        },
        {
          type: 'select',
          key: 'typeNameLast',
          label: '往期卡班型',
          placeholder: '请选择往期卡班型',
          apiOption: {
            api: treeEduClassType,
            string: 'name',
            value: 'id'
          }
        },
        {
          type: 'select',
          key: 'danceNameLast',
          label: '往期卡舞种',
          placeholder: '请选择往期卡舞种',
          apiOption: {
            api: listEduDance,
            string: 'name',
            value: 'id'
          }
        },
        {
          type: 'select',
          key: 'cardState',
          label: '往期卡状态',
          placeholder: '请选择往期卡状态',
          staticArr: [
            {
              string: '未使用',
              value: 'A'
            },
            {
              string: '使用中',
              value: 'B'
            },
            {
              string: '停课',
              value: 'C'
            },
            {
              string: '退卡',
              value: 'D'
            },
            {
              string: '结业',
              value: 'E'
            },
            {
              string: '撤销',
              value: 'F'
            },
            {
              string: '结转',
              value: 'G'
            }
          ]
        },
        {
          type: 'date',
          key: 'CardOldOperateDate',
          label: '往期卡退费日期',
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD'
        },
        {
          type: 'empty'
        },
        {
          type: 'text',
          key: 'stuCardName',
          label: '续卡卡种',
          placeholder: '请输入续卡卡种'
        },
        {
          type: 'select',
          key: 'typeNameNew',
          label: '续卡班型',
          placeholder: '请选择续卡班型',
          apiOption: {
            api: treeEduClassType,
            string: 'name',
            value: 'id'
          }
        },
        {
          type: 'select',
          key: 'danceNameNew',
          label: '续卡舞种',
          placeholder: '请选择续卡舞种',
          apiOption: {
            api: listEduDance,
            string: 'name',
            value: 'id'
          }
        },
        {
          type: 'select',
          key: 'cardNewStatus',
          label: '续卡卡状态',
          placeholder: '请选择续卡卡状态',
          staticArr: [
            {
              string: '未使用',
              value: 'A'
            },
            {
              string: '使用中',
              value: 'B'
            },
            {
              string: '停课',
              value: 'C'
            },
            {
              string: '退卡',
              value: 'D'
            },
            {
              string: '结业',
              value: 'E'
            },
            {
              string: '撤销',
              value: 'F'
            },
            {
              string: '结转',
              value: 'G'
            }
          ]
        },
        {
          type: 'date',
          key: 'CardNewPayDate',
          label: '续卡缴清日期',
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD'
        },
        {
          type: 'date',
          key: 'Date',
          label: '续卡日期',
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD'
        },
        {
          type: 'select', // 静态select框
          key: 'payoff',
          label: '续卡是否缴清',
          placeholder: '请选择状态',
          staticArr: [
            {
              string: '已缴清',
              value: 'Y'
            },
            {
              string: '未缴清',
              value: 'N'
            }
          ]
        },
        {
          type: 'text',
          key: 'stuCardNo',
          label: '续卡卡号',
          placeholder: '请输入续卡卡号'
        },
        {
          type: 'select',
          key: 'sysValConfId',
          label: '续卡分类',
          placeholder: '请选择续卡分类',
          apiOption: {
            api: cardNextType,
            string: 'name',
            value: 'id'
          }
        },
        {
          type: 'select',
          key: 'cardType',
          label: '续卡类型',
          placeholder: '请选择续卡类型',
          staticArr: this.cardNextList
        },
        {
          type: 'select',
          key: 'zeroType',
          label: '续卡实缴金额为0',
          placeholder: '请选择',
          initialValue: '',
          staticArr: [
            {
              string: '全部',
              value: ''
            },
            {
              string: '是',
              value: 'A'
            },
            {
              string: '否',
              value: 'B'
            },
          ]
        },
      ],
      finCardStatus: 'A',
      queryParam: {},
      sc_loadData: parameter => {
        this.queryParam.finCardStatus = this.finCardStatus
        return pageCardNextLog(Object.assign(parameter, this.queryParam)).then(res => {
          if(!this.autoLoad&&this.isReset)return {data:[]}
          return res
        })
      },
      // tabList: [{ text: '学员续卡收入列表', type: 'B' }, { text: '学员连报收入列表', type: 'C' }],
      selectKey: 'B',
      rules: {
        toIssueCard: [{ required: true, message: '请选择往期卡种', trigger: 'blur' }],
        cardType: [{ required: true, message: '请选择续卡类型', trigger: 'blur' }],
        cardTea: [{ required: true, message: '请选择续卡老师', trigger: 'blur' }],
        sysValConfId: [{ required: true, message: '请选择续卡分类', trigger: 'blur' }]
      },
      editVisible: false, //修改弹窗
      loading: false,
      form: {
        toIssueCard: '',
        cardType: '',
        cardTea: '',
        teacherIds: [],
        cardId: null,
        sysValConfId: null
      },
      cardsType: [{ id: 'A', name: '本期续卡' }, { id: 'B', name: '往期续卡' }], //续卡类型下拉
      issueCards: [], //往期卡种下拉
      performanceVisible: false, //绩效弹窗
      teacher: [],
      spinning: false, //加载
      cardNextLogId: null, // 修改Ids
      finId: null, //确认tableID
      cardName: null, //续卡卡种
      cardNextList: []
    }
  },
  computed: {
    // rowSelection() {
    //   return {
    //     selectedRowKeys: this.selectedRowKeys,
    //     onChange: (selectedRowKeys, selectedRows) => {
    //       this.selectedRowKeys = selectedRowKeys
    //     },
    //     getCheckboxProps: record => ({
    //       props: {
    //         disabled: !record.payoff || !(record.status === 'A' || record.status == 'B' || record.status === 'C') || !!record.url
    //       }
    //     })
    //   }
    // }
  },

  created() {
    this.getCardNextList()
  },

  methods: {
    getCardType(record) {
      if (record.renewalCardTypeName) return record.renewalCardTypeName
      if (record.cardType) {
        let name = ''
        name = this.cardNextList.filter(item => item.value == record.cardType)[0].string
        return name
      } else {
        return ''
      }
    },
    downloadStu() {
      const { queryParam } = this
      const token = Vue.ls.get(ACCESS_TOKEN)
      let fields = [{ name: 'auth_token', value: token }]
      for (let k in queryParam) {
        fields.push({ name: k, value: queryParam[k] })
      }
      const form = document.createElement('form')
      form.action = `${process.env.VUE_APP_URL}/student/cardnextlog/downCardnextlog`
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
    getCardNextList() {
      listSysValConf('cardNext').then(res => {
        if (res.data) {
          let arr = this._handleTreeData(res.data, { label: 'name', value: 'id', children: 'children' })
          this.cardNextList = cardNextTypeList.concat(arr)
        } else {
          this.cardNextList = cardNextTypeList
        }
        this.$forceUpdate()
        //
        this.searchParams.forEach(item => {
          if (item.key == 'cardType') {
            item.staticArr = this.cardNextList
          }
        })
        this.showSearch = true
      })
    },
    _handleTreeData(data, itemObj) {
      let { label, value, children } = itemObj
      return data.map((item, index) => {
        let temObj = {}
        temObj.string = item[label]
        temObj.value = item[value]
        if (item[children]) {
          temObj.children = this._handleTreeData(item.children, itemObj)
        }
        return temObj
      })
    },
    affirmAndCancel(params) {
      saveStuTeacherScore(params).then(res => {
        this.$notification['success']({
          message: '系统通知',
          description: '确认成功'
        })
        this._refreshTable()
      })
    },
    //绩效总分
    addScore(val) {
      if (val.length) {
        let arr = val.map(item => {
          return item.score
        })
        if (arr.length > 1) {
          let total = arr.reduce(function(a, b) {
            return a + b
          })
          return total
        } else {
          return arr[0]
        }
      }
    },
    //确认
    affirm(record) {
      this.$refs.editContinuedCard.open(record, true, 'confirm')
      // const params = {
      //   finId: record.finId,
      //   cardStatus: 'B',
      //   stuCardNextLogId: record.id
      // }
      // this.$confirm({
      //   title: '系统提示',
      //   content: '确定要确认吗?',
      //   okText: '确认',
      //   cancelText: '取消',
      //   onOk: () => {
      //     this.affirmAndCancel(params)
      //   }
      // })
      // if(record.teacherScore.length) {
      //   console.log(record.teacherScore)
      //   this.teacherScore = JSON.parse(JSON.stringify(record.teacherScore.map( item =>{
      //     if( item.score === 0 ) {
      //       item.score = null
      //     }
      //     return item
      //   })
      //   ))
      // }
      // console.log(this.teacherScore)
      // this.performanceVisible = true
    },
    // changePerformance (index,val) {
    //   if(val) {
    //     this.teacherScore[index].score = Number(val.toFixed(2))
    //   }
    // },
    // performanceSubmit () {
    //   this.loading = true
    //   const params = {
    //     finId:this.finId,
    //     teacherScore: JSON.stringify(this.teacherScore)
    //   }
    //   saveStuTeacherScore(params).then(res=>{
    //     if(res.code == 200) {
    //       this.performanceVisible = false
    //       this.$notification['success']({
    //           message: '系统通知',
    //           description: '操作成功'
    //         })
    //         this._refreshTable()
    //     }else {
    //       this.$notification['error']({
    //           message: '系统通知',
    //           description: res.msg
    //         })
    //     }
    //   }).finally(this.loading = false)
    // },
    // performanceCancel () {
    //   this.teacherScore.forEach(item=>{
    //     item.score = null
    //   })
    //   this.performanceVisible = false
    // },
    getTeaData(data) {
      this.form.cardTea = data
        .map(item => {
          return item.teacherName
        })
        .join('、')
      this.form.teacherIds = data.map(item => {
        return item.teacherId
      })
    },
    openChooseTea() {
      this.$refs.choosetea.open()
    },
    //重置修改弹窗
    editreset() {
      Object.keys(this.form).forEach(item => {
        this.form[item] = ''
      })
    },
    editCancel() {
      this.editVisible = false
      this.editreset()
    },
    editSubmit() {
      this._refreshTable()
      // this.$refs.ruleForm.validate(valid => {
      // if (valid) {
      // let params = {
      //   cardNextLogId: this.cardNextLogId,
      //   finId: this.finId,
      //   cardLastId: form.toIssueCard,
      //   cardType: form.cardType,
      //   teacherIds: form.teacherIds.join(','),
      //   sysValConfId: form.sysValConfId
      // }
      // this.loading = true
      // saveStuCardNextLog(params)
      //   .then(res => {
      //     this.editCancel()
      //     this._refreshTable()
      //     this.$notification['success']({
      //       message: '系统通知',
      //       description: '操作成功'
      //     })
      //   })
      //   .finally((this.loading = false))
      // }
      // })
    },
    //修改
    async edit(record) {
      // this.finId = record.finId
      this.$refs.editContinuedCard.open(record, true, 'edit')
      // this.cardNextLogId = record.id
      // this.cardName = record.cardName
      // this.form.cardType = record.cardType
      // this.form.toIssueCard = record.stuCardId
      // if( record.lastEndDate ) {
      //   let date = record.lastEndDate.split(' ')[0]
      //   this.form.toIssueCard = `${record.lastCardNo}${record.lastCardName}(${date})`
      // }else {
      //   this.form.toIssueCard = `${record.lastCardNo}${record.lastCardName}`
      // }
      // this.form.cardTea = record.teacher
      // .map(item => {
      //   return item.teacherName
      // })
      // .join(',')
      // this.form.teacherIds = record.teacher.map(item => {
      //   return item.teacherId
      // })
      // this.form.sysValConfId = record.sysValConfId
      // this.editVisible = true
      // this.spinning = true
      // const res = await listStuCardNextLog({ cardId: record.cardId, stuId: record.stuId })
      // if (res.code == 200) {
      //   this.issueCards = res.data.map(item => {
      //     if (item.endDate) {
      //       let date = item.endDate.split(' ')[0]
      //       item.cardMsg = `${item.stuCardNo}${item.cardName}(${date})`
      //     } else {
      //       item.cardMsg = `${item.stuCardNo}${item.cardName}`
      //     }
      //     return item
      //   })
      // }
      // this.spinning = false
    },
    selectKeyHandle(e) {
      this.selectKey = e
      // this._refreshTable()
      console.log(this.selectKey)
    },
    cancel(record) {
      const params = {
        finId: record.finId,
        cardStatus: 'C',
        stuCardNextLogId: record.id
      }
      this.$confirm({
        title: '系统提示',
        content: '确定要作废吗?',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          this.affirmAndCancel(params)
        }
      })
    },
    //删除
    delect(record) {
      this.$confirm({
        title: '系统提示',
        content: '确定要删除吗?',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          removeStuCardNextLog(record.id).then(res => {
            this.$notification['success']({
              message: '系统通知',
              description: '删除成功'
            })
            this._refreshTable()
          })
        }
      })
    },

    searchSubmit(data,isReset) {
      this.isReset=''
      if(isReset==='isReset')this.isReset=true
      if (data.cardName) delete data.cardName
      if (Object.keys(data).length === 0) {
        this.routeQuery = this.$route.query
      }
      this.queryParam = data
      this._refreshTable()
    },
    _refreshTable() {
      // let index = null
      // switch (this.selectKey) {
      //   case 'B':
      //     index = '0'
      //     break
      //   case 'C':
      //     index = '1'
      //     break
      // }
      // let str = `table${index}`
      this.$nextTick(() => {
        // // this.$refs[str][0].refresh()
        this.$refs.table.refresh()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.image_wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
