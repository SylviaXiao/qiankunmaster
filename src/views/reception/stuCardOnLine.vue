<template>
  <div ref="elementAll" style="height:calc(100vh - 84px)">
    <div ref="elementSearch">
      <a-card :bordered="false" style="margin: 20px 0 ;">
        <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"></search-com-pro>
      </a-card>
    </div>
    <a-card :bordered="false">
      <a-tabs :activeKey="selectKey" @change="selectKeyHandle" defaultActiveKey="0">
        <!-- v-if="handlePermBox('finance:finteacher:view')" -->
        <a-tab-pane :tab="item.text" v-for="(item, index) in tabList" :key="item.type + ''">
          <a-button v-if="showMutiBind" @click="MutiBindCardHandle" style="margin-bottom: 15px; margin-left: 15px">批量绑定</a-button>
          <perm-box perm="student:card:view">
            <s-table
              :showSlider="true"
              :sliderIndex="selectKey == 'D' ? 2 : selectKey == 'C' ? 1 : 0"
              :ref="'table' + index"
              :rowSelection="showMutiBind ? rowSelection : null"
              :scroll="{ x: 1500 }"
              :columns="sc_solumns"
              :data="sc_loadData"
              rowKey="id"
            >
              <span slot="stuName" slot-scope="text, record">
                <perm-box :text="record.stuName" perm="student:info:view">
                  <router-link :to="{ path: `/reception/studentInfo/${record.stuId}` }">{{ record.stuName }}</router-link>
                </perm-box>
              </span>
              <span slot="className" slot-scope="text, record">
                <perm-box :text="record.className" perm="education:class:view">
                  <router-link v-if="record.className" :to="{ path: `/reception/class/classInfo/${record.classId}` }">{{ record.className }}</router-link>
                </perm-box>
              </span>
              <span slot="stuCardNo" slot-scope="text, record" style="display: inline-flex; width: 100%;align-items: center;">
                <a-popover title="卡备注信息">
                  <template slot="content">
                    <div>{{ record.remark || '无' }}</div>
                  </template>
                  <a-icon type="qrcode" @click="qrcodeHandle(record)" style="margin-left: 8px;" />
                  {{ text }}
                </a-popover>
                <template v-if="record.cardNextId">
                  <a-icon type="link" style="margin-left: 8px;" />
                </template>
              </span>
              <span slot="totalPrice" slot-scope="text, record">
                {{ record.paidPrice | fixTofloat }}/{{ record.totalPrice | fixTofloat }}/{{ record.originalPrice | fixTofloat }}
              </span>
              <span slot="payoff" slot-scope="text, record">
                <template v-if="text"
                  >结清</template
                >
                <template v-else-if="record.status === 'D'"
                  >-</template
                >
                <template v-else>
                  <span style="color:red">{{ (record.paidPrice - record.totalPrice) | fixTofloat }}</span>
                </template>
              </span>
              <span slot="createDate" slot-scope="text">
                {{ handleDate(text) }}
              </span>
              <span slot="startDate" slot-scope="text">{{ handleDate(text) }}</span>
              <span slot="endDate" slot-scope="text">{{ handleDate(text) }}</span>

              <span slot="action" slot-scope="text, record">
                <perm-box perm="education:class-url:bind" v-if="!record.urlStatus || record.urlStatus == 'A'">
                  <a href="javascript:;" @click="bindCardHandle(record)">绑定</a>
                </perm-box>
                <perm-box perm="education:class-url:unbind" v-if="record.urlStatus == 'B'">
                  <a href="#" @click="unBindCardHandle(record)">作废</a>
                </perm-box>
                <span v-if="record.urlStatus == 'B'">
                  <a href="#" style="margin-left: 8px;" @click="copyClassUrlHandle(record)">复制上课链接</a>
                </span>
              </span>
            </s-table>
          </perm-box>
        </a-tab-pane>
      </a-tabs>
    </a-card>
    <a-modal
      :confirmLoading="loading"
      :maskClosable="$store.state.modalMaskClickEnable"
      :destroyOnClose="true"
      :width="600"
      title="绑定"
      @ok="bindSubmit"
      @cancel="bindCancel"
      v-model="bindVisible"
    >
      <div style="display: flex;align-items:center;margin-bottom: 15px;">
        <div class="title">舞种 :</div>
        <div style="margin-left:15px">
          <a-select placeholder="请选择邀请码类型" style="width: 200px" v-model="danceType" @change="changeDanceType">
            <a-select-option :value="item.id" v-for="item in danceTypes" :key="item.id">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </div>
      </div>
      <div style="display: flex;align-items:center;margin-bottom: 15px;" v-if="danceType === 'A' || danceType === 'B'">
        <div class="title">资料包类型 :</div>
        <div style="margin-left:15px">
          <a-select placeholder="请选择邀请码类型" style="width: 200px" v-model="dataType">
            <a-select-option :value="item.id" v-for="item in dataGrams" :key="item.id">
              {{ item.text }}
            </a-select-option>
          </a-select>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { listEduDance, listEduType } from '@/api/common'
import { STable, SearchComPro } from '@/components'
import PermBox from '@/components/PermBox'
import { pageOnLineStudentCard, bindLiveStudentCard, unBindLiveStudentCard, pageOnStudentCard } from '@/api/recep'
import { getSchoolList, activateInvitationCode } from '@/api/education/card'

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
    title: '卡号',
    dataIndex: 'stuCardNo',
    scopedSlots: { customRender: 'stuCardNo' },
    fixed: 'left'
  },
  {
    title: '学员姓名',
    dataIndex: 'stuName',
    width: 100,
    scopedSlots: { customRender: 'stuName' },
    fixed: 'left'
  },
  {
    title: '手机号码',
    dataIndex: 'stuPhone',
    width: 100,
    fixed: 'left'
  },
  {
    title: '上课分馆',
    dataIndex: 'deptName',
    width: 120
  },
  {
    title: '卡种名称',
    dataIndex: 'cardName',
    width: 150
  },
  {
    title: '舞种',
    dataIndex: 'danceName',
    width: 80
  },
  {
    title: '办卡日期',
    dataIndex: 'createDate',
    width: 100,
    scopedSlots: { customRender: 'createDate' }
  },
  {
    title: '办卡分馆',
    dataIndex: 'createDeptName',
    width: 120
  },
  {
    title: '激活时间',
    dataIndex: 'startDate',
    width: 100,
    scopedSlots: {
      customRender: 'startDate'
    }
  },
  {
    title: '有效期截止',
    dataIndex: 'endDate',
    width: 100,
    scopedSlots: { customRender: 'endDate' }
  },
  {
    title: '实收/应收/原价',
    dataIndex: 'totalPrice',
    width: 200,
    scopedSlots: { customRender: 'totalPrice' }
  },
  {
    title: '是否缴清',
    dataIndex: 'payoff',
    width: 80,
    scopedSlots: { customRender: 'payoff' }
  },
  {
    title: '卡状态',
    dataIndex: 'status',
    width: 80,
    customRender: (text, record) => {
      return text === 'A'
        ? '未使用'
        : text === 'B'
        ? '使用中'
        : text === 'C'
        ? '停课'
        : text === 'D'
        ? '退卡'
        : text === 'E'
        ? '结业'
        : text === 'F'
        ? '撤销'
                  : text === 'G'
                    ? '结转'
        : ''
    }
  },
  {
    title: '码状态',
    dataIndex: 'urlStatus',
    width: 80,
    customRender: (text, record) => {
      return text === 'A' ? '未分配' : text === 'B' ? '已分配' : text === 'C' ? '作废' : ''
    }
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 150,
    scopedSlots: { customRender: 'action' },
    fixed: 'right'
  }
]

export default {
  name: 'stuCards',
  components: {
    SearchComPro,
    STable,
    PermBox
  },
  data() {
    return {
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
          type: 'text',
          key: 'stuCardNo',
          label: '卡号',
          show: true,
          placeholder: '请输入卡号'
        },
        {
          type: 'text',
          key: 'stuInfo',
          label: '学员信息',
          show: true,
          placeholder: '学员姓名/手机号码'
        },
        {
          type: 'text',
          key: 'stuCardName',
          label: '卡种名称',
          show: true,
          placeholder: '请输入卡种名称'
        },
        {
          type: 'chooseModal',
          key: 'cardNameEdu', // 当chooseModal类型下 key为cardName时将调用另外的弹出组件
          label: '选择卡种',
          show: true,
          placeholder: '请选择卡种'
        },
        {
          type: 'select', //动态select框
          key: 'danceId',
          label: '舞种',
          show: true,
          placeholder: '请选择舞种',
          apiOption: {
            api: listEduDance, // promise类型的接口
            string: 'name',
            value: 'id'
          }
        },
        {
          type: 'date',
          key: 'Date',
          label: '办卡日期',
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD'
        },
        {
          type: 'select', // 静态select框
          key: 'payoff',
          label: '是否缴清',
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
          type: 'select',
          key: 'cardState',
          label: '卡状态',
          placeholder: '请选择卡状态',
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
          type: 'select',
          key: 'urlState',
          label: '分配状态',
          placeholder: '请选择',
          staticArr: [
            {
              string: '已分配',
              value: 'Y'
            },
            {
              string: '未分配',
              value: 'N'
            }
          ]
        }
      ],
      queryParam: {},
      routeQuery: this.$route.query,
      showMutiBind: false,
      sc_loadData: parameter => {
        if (this.routeQuery) {
          this.queryParam = Object.assign(this.queryParam, this.routeQuery)
          this.routeQuery = null
        }
        if (this.queryParam.eduCardId) {
          this.showMutiBind = true
          this.eduCardId = this.queryParam.eduCardId
        } else {
          this.showMutiBind = false
          this.eduCardId = ''
        }
        this.queryParam.invitationType = this.selectKey
        if (this.queryParam.invitationType === 'D') {
          this.queryParam.invitationType = null
          return pageOnLineStudentCard(Object.assign(parameter, this.queryParam)).then(res => {
            return res
          })
        } else {
          return pageOnStudentCard(Object.assign(parameter, this.queryParam)).then(res => {
            return res
          })
        }
      },
      stuCardId: '',
      tabList: [{ text: '教练预习课', type: 'B' }, { text: '教练班资料包', type: 'C' }, { text: '线上课码', type: 'D' }],
      selectKey: 'B',
      bindVisible: false, //selectKey为B时出绑定弹窗
      dataGrams: [{ text: '资料包A', id: 'A' }, { text: '资料包B', id: 'B' }, { text: '资料包C', id: 'C' }],
      danceTypes: [],
      danceType: null,
      dataType: null, //资料包类型
      loading: false,
      bindParams: {
        cardId: '',
        id: ''
      }
    }
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRowKeys = selectedRowKeys
        },
        getCheckboxProps: record => ({
          props: {
            disabled: !record.payoff || !(record.status === 'A' || record.status == 'B' || record.status === 'C') || !!record.url
          }
        })
      }
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
    this.formStop = this.$form.createForm(this)
  },
  mounted() {},
  methods: {
    changeDanceType(val) {
      this.dataType = null
      if (val === 'B') {
        this.dataGrams = [{ text: '孕产瑜伽', id: 'D' }, { text: '普拉提', id: 'E' }, { text: '舞韵瑜伽', id: 'F' }, { text: '阿斯汤加', id: 'G' }]
      } else {
        this.dataGrams = [{ text: '资料包A', id: 'A' }, { text: '资料包B', id: 'B' }, { text: '资料包C', id: 'C' }]
      }
      console.log(val)
    },
    // 获取舞种
    getDanceType() {
      return new Promise((resolve, reject) => {
        listEduDance().then(res => {
          resolve(res)
        })
      })
    },
    // 数据导入
    dataImportHandle(danceId, dataType) {
      if (danceId === 'A' || danceId === 'B') {
        this.getDanceType().then(res => {
          if (res.code == 200) {
            this.danceTypes = res.data
          }
        })
        this.danceType = danceId
        this.changeDanceType(danceId)
        this.dataType = null
        this.bindVisible = true
      } else {
        const params = {
          eduCardId: this.bindParams.cardId,
          studentCards: this.bindParams.id,
          invitationType: this.selectKey,
          dataType: dataType || '',
          danceId: danceId || ''
        }
        this.bind(params)
      }
    },
    importChooseEduCard() {
      this.$refs.cardEduModal.open()
    },
    bindCancel() {},
    bindSubmit() {
      console.log(this.bindParams)
      this.bindParams.dataType = this.dataType
      this.bindParams.danceId = this.danceType
      const params = {
        eduCardId: this.bindParams.cardId,
        studentCards: this.bindParams.id,
        invitationType: this.selectKey,
        dataType: this.bindParams.dataType,
        danceId: this.bindParams.danceId
      }
      this.loading = true
      bindLiveStudentCard(params)
        .then(res => {
          this.$notification['success']({
            message: '系统通知',
            description: '绑定成功'
          })

          this._refreshTable()
        })
        .finally((this.loading = false))
    },
    selectKeyHandle(e) {
      this.selectKey = e
      // this._refreshTable()
      console.log(this.selectKey)
    },
    // 绑定
    MutiBindCardHandle() {
      const params = {
        cardId: this.eduCardId,
        id: this.selectedRowKeys.join(','),
        invitationType: this.selectKey
      }

      this.bindCardHandle(params)
    },
    bindCardHandle(record) {
      console.log(record)
      const params = {
        eduCardId: record.cardId,
        studentCards: record.id,
        invitationType: this.selectKey,
        dataType: record.dataType || '',
        danceId: record.danceId || ''
      }
      if (this.selectKey === 'C') {
        this.bindParams.cardId = record.cardId
        this.bindParams.id = record.id
        console.log(this.bindParams)
        this.dataImportHandle(record.danceId, record.dataType)
        return
      }
      this.bind(params)
    },
    bind(params) {
      this.$confirm({
        title: '系统提示',
        content: '确定要绑定?',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          bindLiveStudentCard(params).then(res => {
            this.$notification['success']({
              message: '系统通知',
              description: '绑定成功'
            })
            this._refreshTable()
          })
        }
      })
    },
    unBindCardHandle(record) {
      const params = {
        studentCards: record.id
      }
      this.$confirm({
        title: '系统提示',
        content: '确定要解除绑定吗?',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          unBindLiveStudentCard(params).then(res => {
            this.$notification['success']({
              message: '系统通知',
              description: '解除成功'
            })
            this._refreshTable()
          })
        }
      })
    },
    copyClassUrlHandle(record) {
      if (this.selectKey === 'D') {
        activateInvitationCode(record.id)
          .then(res => {
            this._refreshTable()
          })
      }
      this.$tools.handleCopy(record.url)
    },
    handleDate(data) {
      return data ? this.$tools.tailor.getDate(data) : ''
    },
    searchSubmit(data) {
      if (data.cardName) delete data.cardName
      if (Object.keys(data).length === 0) {
        this.routeQuery = this.$route.query
      }
      this.queryParam = data
      this._refreshTable()
    },
    _refreshTable() {
      // console.log(`table${this.selectKey}`)
      let index = null
      switch (this.selectKey) {
        case 'B':
          index = '0'
          break
        case 'C':
          index = '1'
          break
        case 'D':
          index = '2'
          break
      }
      let str = `table${index}`
      this.$nextTick(() => {
        this.$refs[str][0].refresh()
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
.title {
  text-align: right;
  width: 100px;
}
</style>
