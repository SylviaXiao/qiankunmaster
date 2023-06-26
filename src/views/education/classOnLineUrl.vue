<template>
  <div class="teacher-demand-wrapper">
    <a-card :bordered="false" :style="{ margin: '20px 0' }">
      <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"></search-com-pro>
    </a-card>
    <a-card :bordered="false">
      <div class="btnGroup" style="margin-bottom: 15px;">
        <perm-box perm="education:class-url:import">
          <a-button @click="dataImportHandle" type="primary" style="margin-bottom: 15px">邀请码导入</a-button>
        </perm-box>
      </div>
      <!-- <s-table ref="table"  :columns="columns" :data="loadData" :rowKey="(record, index) => index" showPagination="false"> -->
      <a-table ref="table" size="default" :columns="columns" :dataSource="dataArr" :rowKey="(record, index) => index" :pagination="false">
        <span slot="action" slot-scope="text, record">
          <perm-box perm="education:class-url:remove">
            <a href="#" @click="delect(record)">删除</a>
          </perm-box>
        </span>
        <!-- </s-table> -->
      </a-table>
    </a-card>
    <a-modal
      :confirmLoading="dataImportLoading"
      :maskClosable="$store.state.modalMaskClickEnable"
      :destroyOnClose="true"
      :width="600"
      title="体验课导入"
      @ok="dataImportSubmit"
      @cancel="dataImportCancel"
      v-model="dataImportVisible"
    >
      <div class="data_import_wrapper">
        <div style="display: flex;align-items:center;margin-bottom: 15px;">
          <div class="title">邀请码类型 :</div>
          <div style="margin-left:15px">
            <a-select placeholder="请选择邀请码类型" style="width: 200px" v-model="invitationType">
              <a-select-option :value="item.id" v-for="item in invitationTypeList" :key="item.id">
                {{ item.text }}
              </a-select-option>
            </a-select>
          </div>
        </div>
        <div style="display: flex;align-items:center;margin-bottom: 15px;" v-if="invitationType === 'C'">
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
        <div style="display: flex;align-items:center">
          <div class="title">选择卡种 :</div>
          <div @click="importChooseEduCard" style="width: 200px;margin-left:15px">
            <a-input ref="importEduCard" style="cursor: 'pointer', color: '#000'" disabled placeholder="请选择" :value="eduCardObj.name">
              <a-icon slot="addonAfter" type="search" />
            </a-input>
          </div>
        </div>
        <GetEduCard
          ref="cardEduModal"
          @getBackData="getCardBackEdu"
          :OnLine="true"
          :invitationType="invitationType"
          :danceType="danceType ? danceType : ''"
        ></GetEduCard>
        <div style="display: flex;align-items:center">
          <div class="title">上传文件 :</div>
          <div style="margin-top: 15px;margin-left:15px">
            <a-upload :fileList="fileList" :remove="handleRemove" :beforeUpload="beforeUpload">
              <a-button>
                <a-icon type="upload" />
                .csv格式文件
              </a-button>
            </a-upload>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { SearchComPro, STable } from '@/components'
import { liveAddressImport, listEduClassOnLineUrl, removeClassUrl } from '@/api/recep'
import PermBox from '@/components/PermBox'
import GetEduCard from '@/components/GetEduCard/GetEduCard.vue'
import { listEduDance } from '@/api/common'

const columns = [
  {
    title: '上传时间',
    dataIndex: 'createDate',
    customRender: (text, record) => {
      const { createDate } = record
      return createDate.split(' ')[0]
    }
  },
  {
    title: '卡种',
    dataIndex: 'cardName'
  },
  {
    title: '舞种',
    dataIndex: 'danceName'
  },
  {
    title: '班型',
    dataIndex: 'classTypeName'
  },
  {
    title: '类型',
    dataIndex: 'cardType',
    key: 'cardType',
    customRender: (text, record) => {
      return text === 'A' ? '单色' : text === 'B' ? '优鸽' : ''
    }
  },
  {
    title: '邀请码类型',
    dataIndex: 'invitationType',
    customRender: (text, record) => {
      const { invitationType } = record
      switch (invitationType) {
        case 'A':
          return '线上体验课'
        case 'B':
          return '教练预习课'
        case 'C':
          return '教练班资料包'
        case 'D':
          return '线上课码'
      }
    }
  },
  {
    title: '资料包类型',
    dataIndex: 'dataType',
    customRender: (text, record) => {
      const { dataType } = record
      switch (dataType) {
        case 'A':
          return '资料包A'
        case 'B':
          return '资料包B'
        case 'C':
          return '资料包C'
        case 'D':
          return '孕产瑜伽'
        case 'E':
          return '普拉提'
        case 'F':
          return '舞韵瑜伽'
        case 'G':
          return '阿斯汤加'
      }
    }
  },
  {
    title: '已使用',
    dataIndex: 'used'
  },
  {
    title: '未使用',
    dataIndex: 'unused'
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  name: 'stusource',
  components: {
    GetEduCard,
    SearchComPro,
    PermBox,
    STable
  },
  data() {
    return {
      // dataImport
      dataImportVisible: false,
      dataImportLoading: false,
      eduCardObj: {},
      fileList: [],

      columns,
      searchParams: [
        // {
        //   type: 'chooseModal',
        //   key: 'cardName', // 当chooseModal类型下 key为cardName时将调用另外的弹出组件
        //   label: '选择卡种',
        //   placeholder: '请选择卡种'
        // },
        {
          type: 'chooseModal',
          key: 'cardNameEdu',
          label: '选择卡种',
          placeholder: '请选择卡种'
        },
        {
          type: 'select', // 静态select框
          key: 'invitationType',
          label: '邀请码类型',
          placeholder: '请选择邀请码类型',
          staticArr: [
            {
              string: '线上体验课',
              value: 'A'
            },
            {
              string: '教练预习课',
              value: 'B'
            },
            {
              string: '教练班资料包',
              value: 'C'
            },
            {
              string: '线上课码',
              value: 'D'
            }
          ]
        }
      ],
      queryParam: null,
      dataArr: [],
      invitationTypeList: [{ text: '线上体验课', id: 'A' }, { text: '教练预习课', id: 'B' }, { text: '教练班资料包', id: 'C' }, { text: '线上课码', id: 'D' }],
      invitationType: null,
      dataGrams: [{ text: '资料包A', id: 'A' }, { text: '资料包B', id: 'B' }, { text: '资料包C', id: 'C' }],
      danceTypes: [],
      danceType: null,
      queryParam: {},
      loadData: parameter => {
        return listEduClassOnLineUrl(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      },
      dataType: null //资料包类型
    }
  },
  mounted() {
    this._loadData()
  },
  methods: {
    //切换舞种
    changeDanceType(val) {
      this.dataType = null
      if (val === 'B') {
        this.dataGrams = [{ text: '孕产瑜伽', id: 'D' }, { text: '普拉提', id: 'E' }, { text: '舞韵瑜伽', id: 'F' }, { text: '阿斯汤加', id: 'G' }]
      } else {
        this.dataGrams = [{ text: '资料包A', id: 'A' }, { text: '资料包B', id: 'B' }, { text: '资料包C', id: 'C' }]
      }
      console.log(val)
    },
    delect(record) {
      const params = {
        batchId: record.batchId,
        invitationType: record.invitationType,
        dataType: record.dataType || '',
        unFormData: true
      }
      this.$confirm({
        title: '系统提示',
        content: '确定要删除吗?',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          removeClassUrl(params).then(res => {
            this.$notification['success']({
              message: '系统通知',
              description: '删除成功'
            })
            this._refreshTable()
          })
        }
      })
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
    dataImportHandle() {
      this.invitationType = null
      this.fileList = []
      this.eduCardObj = {}
      this.danceType = null
      this.dataType = null
      this.getDanceType().then(res => {
        if (res.code == 200) {
          this.danceTypes = res.data
        }
      })
      this.dataImportVisible = true
    },
    importChooseEduCard() {
      if (!this.invitationType) {
        return this.$notification['error']({
          message: '系统通知',
          description: '请先选择卡种'
        })
      }
      this.$refs.cardEduModal.open()
    },
    handleRemove(file) {
      this.fileList.remove(file)
    },
    beforeUpload(file) {
      this.fileList = [file]
      return false
    },
    getCardBackEdu(data) {
      const temObj = {
        name: data.cardName,
        id: data.id
      }
      this.eduCardObj = temObj
    },
    dataImportSubmit() {
      // if( !this.eduCardObj.id) {
      //   return this.$notification['error']({
      //       message: '系统通知',
      //       description: '请选择卡种'
      //     })
      // }

      if (!this.invitationType) {
        return this.$notification['error']({
          message: '系统通知',
          description: '请选择邀请码类型'
        })
      }
      if (this.invitationType === 'C' && !this.danceType) {
        return this.$notification['error']({
          message: '系统通知',
          description: '请选择舞种'
        })
      }
      if (this.danceType === 'A' && !this.dataType) {
        return this.$notification['error']({
          message: '系统通知',
          description: '请选择资料包类型'
        })
      }
      if (!this.fileList[0]) {
        return this.$notification['error']({
          message: '系统通知',
          description: '请上传文件'
        })
      }
      this.dataImportLoading = true
      let formData = new FormData()
      formData.append('eduCardId', this.eduCardObj.id)
      formData.append('file', this.fileList[0])
      formData.append('invitationType', this.invitationType)
      formData.append('dataType', this.dataType ? this.dataType : '')
      formData.append('danceId', this.danceType ? this.danceType : '')
      let contentType = 'multipart/form-data;boundary = ' + new Date().getTime()
      liveAddressImport(formData, contentType)
        .then(res => {
          this.$notification['success']({
            message: '系统通知',
            description: res.data || '上传成功'
          })
          this._refreshTable()
          this.dataImportVisible = false
        })
        .finally(() => {
          this.dataImportLoading = false
        })
    },
    dataImportCancel() {
      this.dataImportVisible = false
    },
    searchSubmit(data) {
      console.log(data)
      this.queryParam = data
      this._refreshTable()
    },
    _loadData() {
      listEduClassOnLineUrl(this.queryParam).then(res => {
        this.dataArr = res.data
      })
    },
    _refreshTable() {
      this._loadData()
      // this.$refs.table.refresh()
    }
  }
}
</script>

<style lang="less" scoped>
.skill_wrapper {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 150px;
}
.title {
  text-align: right;
  width: 100px;
}
/deep/ .ant-upload-list-item-name {
  width: 420px;
}
</style>
