<template>
  <div class="fluxDataManage">
    <a-card :bordered="false" :style="{ margin: '20px 0' }">
      <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"></search-com-pro>
    </a-card>
    <div style="display:flex;margin-bottom:20px;width: 100%;overflow-x: scroll;">
      <div class="priceText">
        新增引流数
        <div class="totalPrice">{{ priceTotal.addAnaNum }}</div>
      </div>
      <div class="priceText">
        新增资源数
        <div class="totalPrice">{{ priceTotal.addSouNum }}</div>
      </div>
      <div class="priceText">
        净引流数
        <div class="totalPrice">{{ priceTotal.onlyAnaNum }}</div>
      </div>
      <div class="priceText">
        已咨询数
        <div class="totalPrice">{{ priceTotal.adviceedNum }}</div>
      </div>
      <div class="priceText" v-if="selectKey === 1">
        新加好友数
        <div class="totalPrice">{{ priceTotal.leftPhoneNum }}</div>
      </div>
      <div class="priceText">
        总转化率
        <div class="totalPrice">{{ priceTotal.rate }}</div>
      </div>
    </div>
    <a-card :bordered="false">
      <a-tabs :activeKey="selectKey" @change="selectKeyHandle" defaultActiveKey="0">
        <!-- v-if="handlePermBox('finance:finteacher:view')" -->
        <a-tab-pane :tab="item.name" v-for="(item, index) in tabList" :key="item.id">
          <perm-box :perm="selectKey === 1 ? 'analysis:business:save' : 'analysis:newmedia:save'">
            <a-button icon="plus-circle" @click="openModal()" style="margin-bottom:10px;">{{ selectKey === 1 ? '推广组资源录入' : '新媒体资源录入' }}</a-button>
          </perm-box>
          <perm-box perm="analysis:business:repair" v-if="selectKey === 2">
            <a-button icon="plus-circle" @click="openUploadModal()" style="margin-bottom:10px;margin-left:10px;">上传</a-button>
          </perm-box>
          <s-table
            :ref="`table${index}`"
            :columns="selectKey === 1 ? columns : two_columns"
            :data="tableLoad"
            :rowKey="rowKey => `${rowKey.id}-${Math.random()}`"
          >
            <span slot="date" slot-scope="text">
              <span>{{ $tools.tailor.getDate(text) }}</span>
            </span>
            <span slot="redTitle">
              标红
              <a-tooltip placement="topLeft" title="有效客资">
                <a-icon type="question-circle" style="font-size:12px;color:#999;" />
              </a-tooltip>
            </span>
            <span slot="yellowTitle">
              标黄
              <a-tooltip placement="topLeft" title="有联系方式，暂时发不出去">
                <a-icon type="question-circle" style="font-size:12px;color:#999;" />
              </a-tooltip>
            </span>
            <span slot="orangeTitle">
              标橙
              <a-tooltip placement="topLeft" title="外地教练班未留到联系方式">
                <a-icon type="question-circle" style="font-size:12px;color:#999;" />
              </a-tooltip>
            </span>
            <span slot="blackTitle">
              标黑
              <a-tooltip placement="topLeft" title="无聊/骂人/已是资源/学员/合作">
                <a-icon type="question-circle" style="font-size:12px;color:#999;" />
              </a-tooltip>
            </span>
            <span slot="blueTitle">
              标蓝
              <a-tooltip placement="topLeft" title="只说了一句话，就走了 ">
                <a-icon type="question-circle" style="font-size:12px;color:#999;" />
              </a-tooltip>
            </span>
            <span slot="greenTitle">
              标绿
              <a-tooltip placement="topLeft" title="本地的资源客服没有留到联系方式的">
                <a-icon type="question-circle" style="font-size:12px;color:#999;" />
              </a-tooltip>
            </span>
            <span slot="grayTitle">
              标灰
              <a-tooltip placement="topLeft" title="外地少儿未满14岁">
                <a-icon type="question-circle" style="font-size:12px;color:#999;" />
              </a-tooltip>
            </span>
            <span slot="action" slot-scope="text, record">
              <perm-box :perm="selectKey === 1 ? 'analysis:business:save' : 'analysis:newmedia:save'">
                <a href="javascript:;" @click="openModal(record)">修改</a>
              </perm-box>
              <perm-box :perm="selectKey === 1 ? 'analysis:business:del' : 'analysis:newmedia:del'">
                <a href="javascript:;" @click="deletes(record)">删除</a>
              </perm-box>
              <!-- <perm-box :perm="selectKey === 1 ? 'analysis:business:view' : 'analysis:newmedia:view'">
                <a href="javascript:;" @click="refresh(record)">刷新</a>
              </perm-box> -->
            </span>
          </s-table>
        </a-tab-pane>
      </a-tabs>
    </a-card>
    <fluxDataEnter ref="fluxDataEnter" :selectKey="selectKey" @refresh="_refreshTable" />
    <!-- uploadModal -->
    <a-modal
      :confirmLoading="uploadLoading"
      :maskClosable="$store.state.modalMaskClickEnable"
      :destroyOnClose="true"
      :width="600"
      title="上传"
      @ok="uploadSubmit"
      @cancel="uploadCancel"
      v-model="uploadModal"
    >
      <a-upload :fileList="fileList" :remove="handleRemove" :beforeUpload="beforeUpload">
        <a-button>
          <a-icon type="upload" />
          上传
        </a-button>
      </a-upload>
    </a-modal>
  </div>
</template>

<script>
import SearchComPro from '@/components/SearchComPro'
import STable from '@/components/Table'
import PermBox from '@/components/PermBox'
import fluxDataEnter from './modules/fluxDataEnter'
import {
  pageAnaBusiness,
  saveAnaBusiness,
  removeAnaBus,
  pageAnaNewMedia,
  removeAnaMedia,
  busRefreshAnaSource,
  refreshAnaSource,
  repairAnalysis,
  getNewmedia,
  getAnaBusiness
} from '@/api/intentionStu/adviser'
import { getChannelTreeByUser } from '@/api/common'
import UploadSth from '@/components/UploadSth'

const columns = [
  {
    title: '日期',
    dataIndex: 'date',
    scopedSlots: { customRender: 'date' },
    width: 150
  },
  {
    title: '渠道',
    dataIndex: 'channelName',
    scopedSlots: { customRender: 'channelName' },
    width: 200
  },
  {
    title: '新增引流数',
    dataIndex: 'addAnaNum'
  },
  {
    title: '新增资源数',
    dataIndex: 'addSouNum'
  },
  {
    title: '净引流数',
    dataIndex: 'onlyAnaNum'
  },
  {
    title: '已咨询数',
    dataIndex: 'adviceedNum'
  },
  // {
  //   title: '微信资源',
  //   dataIndex: 'weChatSouNum',
  //   scopedSlots: { customRender: 'weChatSouNum' }
  // },
  // {
  //   dataIndex: 'markRedNum',
  //   scopedSlots: { customRender: 'markRedNum', title: 'redTitle' }
  // },
  // {
  //   dataIndex: 'markYellowNum',
  //   scopedSlots: { customRender: 'markYellowNum', title: 'yellowTitle' }
  // },
  // {
  //   dataIndex: 'markGreenNum',
  //   scopedSlots: { customRender: 'markGreenNum', title: 'greenTitle' }
  // },
  // {
  //   dataIndex: 'markOrangeNum',
  //   scopedSlots: { customRender: 'markOrangeNum', title: 'orangeTitle' }
  // },
  // {
  //   dataIndex: 'markBlackNum',
  //   scopedSlots: { customRender: 'markBlackNum', title: 'blackTitle' }
  // },
  // {
  //   dataIndex: 'markBlueNum',
  //   scopedSlots: { customRender: 'markBlueNum', title: 'blueTitle' }
  // },
  // {
  //   dataIndex: 'markGrayNum',
  //   scopedSlots: { customRender: 'markGrayNum', title: 'grayTitle' }
  // },
  {
    title: '新加好友数',
    dataIndex: 'leftPhoneNum',
    scopedSlots: { customRender: 'leftPhoneNum' }
  },
  {
    title: '总转化率',
    dataIndex: 'rate',
    scopedSlots: { customRender: 'rate' }
  },
  {
    title: '提交人',
    dataIndex: 'orgUserName',
    scopedSlots: { customRender: 'orgUserName' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
    width: 200
  }
]
const two_columns = [
  {
    title: '日期',
    dataIndex: 'date',
    scopedSlots: { customRender: 'date' },
    width: 150
  },
  {
    title: '渠道',
    dataIndex: 'channelName',
    scopedSlots: { customRender: 'channelName' },
    width: 200
  },
  {
    title: '新增引流数',
    dataIndex: 'addAnaNum'
  },
  {
    title: '新增资源数',
    dataIndex: 'addSouNum'
  },
  {
    title: '已咨询数',
    dataIndex: 'adviceedNum'
  },
  {
    title: '净引流数',
    dataIndex: 'onlyAnaNum'
  },
  {
    title: '总转化率',
    dataIndex: 'rate',
    scopedSlots: { customRender: 'rate' }
  },
  {
    title: '提交人',
    dataIndex: 'orgUserName'
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  data() {
    return {
      tab: [{ name: '推广组数据管理', id: 1, perm: 'analysis:business:view' }, { name: '新媒体数据管理', id: 2, perm: 'analysis:newmedia:view' }],
      tabList: [],
      selectKey: 1,
      searchParams: [
        {
          type: 'date',
          key: 'Date',
          label: '录入日期',
          show: true,
          placeholder: '请选择录入日期',
          format: 'YYYY-MM-DD'
        },
        {
          type: 'treeSelect',
          key: 'classTypeId',
          isShow: true,
          label: '渠道',
          placeholder: '请选择资源渠道',
          expandAll: false,
          mutiple: true,
          search: true,
          show: true,
          selectFather: true,
          noBranch: true,
          treeOps: {
            api: getChannelTreeByUser,
            label: 'name',
            value: 'id',
            children: 'children'
          }
        },
        // {
        //   type: 'cascader',
        //   key: 'classTypeId',
        //   label: '渠道',
        //   show: true,
        //   placeholder: '请选择渠道',
        //   treeOps: {
        //     api: getChannelTreeByUser,
        //     // type: 'D',
        //     label: 'name',
        //     value: 'id',
        //     children: 'children'
        //   }
        // },
        {
          type: 'chooseModal',
          key: 'service',
          show: true,
          label: '客服',
          placeholder: '请选择'
        }
      ],
      queryParam: {},
      columns,
      two_columns,
      tableLoad: parameter => {
        let request = pageAnaBusiness
        if (this.selectKey === 2) {
          request = pageAnaNewMedia
        }
        return request(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      },
      newUploadFiles: [],
      fileList: [],
      uploadLoading: false,
      uploadModal: false,
      priceTotal: {}
    }
  },

  components: {
    SearchComPro,
    STable,
    fluxDataEnter,
    PermBox,
    UploadSth
  },

  computed: {},

  created() {
    this.getTab()
    this.getTotal()
  },

  methods: {
    getTotal() {
      let request = getAnaBusiness
      if (this.selectKey === 2) {
        request = getNewmedia
      }
      console.log(request)
      request(this.queryParam).then(res => {
        if (res.code === 200) {
          const { addAnaNum, addSouNum, onlyAnaNum, adviceedNum, leftPhoneNum, rate } = res.data
          this.priceTotal = { addAnaNum, addSouNum, onlyAnaNum, adviceedNum, leftPhoneNum, rate }
        }
      })
    },
    openUploadModal() {
      this.fileList = []
      this.uploadModal = true
    },
    handleRemove(file) {
      this.fileList.remove(file)
    },
    beforeUpload(file) {
      this.fileList = [file]
      return false
    },
    uploadCancel() {
      this.fileList = []
    },
    uploadSubmit() {
      //
      this.uploadLoading = true
      let formData = new FormData()
      formData.append('file', this.fileList[0])
      let contentType = 'multipart/form-data;boundary = ' + new Date().getTime()
      repairAnalysis(formData, contentType)
        .then(() => {
          this.$notification.success({
            message: '系统通知',
            description: '提交成功'
          })
          this.uploadModal = false
        })
        .finally((this.uploadLoading = false))
    },
    refresh(record) {
      if (this.selectKey === 1) {
        busRefreshAnaSource(record.id).then(res => {
          this.$notification['success']({
            message: '系统通知',
            description: '操作成功'
          })
          this._refreshTable()
        })
      } else {
        refreshAnaSource(record.id).then(res => {
          this.$notification['success']({
            message: '系统通知',
            description: '操作成功'
          })
          this._refreshTable()
        })
      }
    },
    //删除按钮
    deletes(record) {
      let _this = this
      let cardId = record.id
      this.$confirm({
        title: '系统提示',
        content: '确认删除该条数据吗?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          if (_this.selectKey === 1) {
            removeAnaBus(cardId).then(res => {
              _this.$notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
              _this._refreshTable()
            })
          } else {
            removeAnaMedia(cardId).then(res => {
              _this.$notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
              _this._refreshTable()
            })
          }
        }
      })
    },
    openModal(record) {
      let title = ''
      if (record) {
        title = this.selectKey === 1 ? '推广组资源修改' : '新媒体资源修改'
      } else {
        title = this.selectKey === 1 ? '推广组资源录入' : '新媒体资源录入'
      }
      this.$refs.fluxDataEnter.open(title, record)
    },
    selectKeyHandle(e) {
      this.selectKey = e
      this.getTotal()
      this._refreshTable()
    },
    getTab() {
      let arr = ['analysis:business:view', 'analysis:newmedia:view']
      arr.forEach(item => {
        if (this.handlePermBox(item)) {
          this.tabList.push(this.tab.find(todo => todo.perm === item))
          this.selectKey = this.tabList[0].id
        }
      })
    },
    handlePermBox(str) {
      return this.$tools.checkPerm(str)
    },
    searchSubmit(data) {
      this.queryParam = data
      this._refreshTable()
      this.getTotal()
    },
    _refreshTable() {
      if (this.tabList.length === 2) {
        let index = null
        switch (this.selectKey) {
          case 1:
            index = '0'
            break
          case 2:
            index = '1'
            break
        }
        let str = `table${index}`
        this.$nextTick(() => {
          this.$refs[str][0].refresh()
        })
      } else {
        this.$nextTick(() => {
          this.$refs['table0'].refresh()
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.priceText {
  padding: 10px;
  width: 180px;
  height: 90px;
  background-color: #fff;
  margin-right: 15px;
}
.totalPrice {
  margin-left: 50px;
  margin-top: 10px;
  font-weight: bold;
  font-size: 17px;
}
</style>
