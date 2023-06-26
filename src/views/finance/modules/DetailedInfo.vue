<template>
  <div class="detailed-wrapper">
    <template v-if="dataInfo">
      <a-row type="flex" justify="center" align="top">
        <a-col :span="22">
          <template>
            <a-col :lg="12" :md="24" :sm="24" class="item">上课分馆 : {{ dataInfo.deptName }} </a-col>
            <a-col :lg="12" :md="24" :sm="24" class="item">经手人姓名 : {{ dataInfo.recordName }} </a-col>

            <a-col :lg="12" :md="24" :sm="24" class="item"> 金额 : {{ dataInfo && dataInfo.price ? dataInfo.price : 0 }} </a-col>
            <a-col :lg="12" :md="24" :sm="24" class="item">
              操作时间 : {{ dataInfo.createDate }}
              <a href="javascript:;" @click="printBills" v-if="income">打印缴费单</a>
            </a-col>

            <a-col :lg="8" :md="24" :sm="24" class="item">审核人 : {{ dataInfo.appName }} </a-col>
            <a-col :lg="8" :md="24" :sm="24" class="item">确认人 : {{ dataInfo.confirmName }} </a-col>
            <a-col :lg="8" :md="24" :sm="24" class="item">确认日期 : {{ dataInfo.confirmDate }} </a-col>
            <template v-if="detailInfo && !income">
              <a-col :lg="8" :md="24" :sm="24" class="item">姓名 : {{ detailInfo.finance.bankUserName }} </a-col>
              <a-col :lg="8" :md="24" :sm="24" class="item">开户行 : {{ detailInfo.finance.bank }} </a-col>
              <a-col :lg="8" :md="24" :sm="24" class="item">卡号 : {{ detailInfo.finance.bankNo }} </a-col>
            </template>
          </template>
          <a-modal
            :maskClosable="$store.state.modalMaskClickEnable"
            :destroyOnClose="true"
            title="新增绩效"
            width="800px"
            v-model="addAchievementsModel"
            okText="保存"
            cancelText="取消"
            @ok="saveAchievements"
          >
            <belongs-table ref="belongsTable" :total="dataInfo && dataInfo.price && income ? dataInfo.price : 99999999"></belongs-table>
          </a-modal>
          <template>
            <a-col :lg="12" :md="12" :sm="12" class="item">
              <span style="display: flex;flex-flow: nowrap row;">
                <span style="width: 50px;">备注 :</span>
                <a-textarea readOnly :rows="2" v-model="isShowRemark" />
              </span>
            </a-col>
          </template>
        </a-col>
      </a-row>
    </template>
    <template v-if="cardInfoData.length > 0">
      <a-divider orientation="left"><span :style="{ color: '#e8e8e8' }">办卡信息</span></a-divider>

      <a-table :pagination="false" :columns="columnsCards" :rowKey="(item, index) => index" :dataSource="cardInfoData"> </a-table>
    </template>
    <a-divider orientation="left"><span :style="{ color: '#e8e8e8' }">业绩绩效</span></a-divider>
    <template v-if="achievements.length > 0">
      <a-table :pagination="false" :columns="columnsAchi" :rowKey="(item, index) => index" :dataSource="achievements">
        <span slot="name" slot-scope="text, record">
          {{ record.adviserName || record.teacherName }}
          <a-tag>{{ record.type === 'teacher' ? '导师' : '顾问' }}</a-tag>
        </span>
        <span slot="source" >
          {{ detailInfo.finance.source || '' }}
        </span>
        <span slot="price" slot-scope="text, record">
          {{ record.type === 'teacher' ? `${record.teacherPrice}（比例：${record.teacherRatio}%）` : record.price }}
        </span>
        <span slot="remark" slot-scope="text, record">
          {{ record.remark || record.teacherRemark }}
        </span>
      </a-table>
    </template>
    <template v-else>
      <div class="no-data">(暂无数据 请点击<a href="javascript:;" @click="addAchievements"> 这里 </a>添加业绩)</div>
    </template>

    <print-bills :stuInfo="dataInfo" ref="printBills"></print-bills>
  </div>
</template>
<script>
import { PrintBills } from '@/components'
import { detail } from '@/api/finance/finance'
import PermBox from '@/components/PermBox'
import BelongsTable from '@/components/BelongsTable'
import { changeAchievement } from '@/api/recep'

export default {
  props: {
    dataInfo: {
      type: Object,
      default: null
    },
    income: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      detailInfo: null,
      columnsAchi: [
        {
          title: '所属人',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '所属分馆',
          dataIndex: 'deptName',
          scopedSlots: { customRender: 'deptName' }
        },
        {
          title: '资源来源',
          dataIndex: 'source',
          scopedSlots: { customRender: 'source' }
        },
        {
          title: '金额',
          dataIndex: 'price',
          scopedSlots: { customRender: 'price' }
        },
        {
          title: '备注',
          dataIndex: 'remark',
          scopedSlots: { customRender: 'remark' }
        }
      ],
      columnsCards: [
        {
          title: '卡号',
          dataIndex: 'stuCardNo'
        },
        {
          title: '卡种',
          dataIndex: 'cardName'
        },
        {
          title: '缴费金额',
          dataIndex: 'paidPrice'
        },
        {
          title: '应缴金额',
          dataIndex: 'totalPrice'
        }
      ],
      addAchievementsModel: false,
      editInfoModal: false,
      newUploadFiles: [],
      rotateValue: 0
    }
  },
  computed: {
    cardInfoData() {
      if (this.detailInfo) {
        return this.detailInfo.cardInfo
      } else {
        return []
      }
    },
    isShowRemark() {
      const { detailInfo } = this
      return detailInfo ? detailInfo.finance.remark : ''
    },
    achievements() {
      const { detailInfo } = this
      if (!!detailInfo) {
        const { adviserAchievements, teacherAchievements, source } = detailInfo
        const arr = [...adviserAchievements, ...teacherAchievements]
        return arr.filter(item => item !== null)
      } else {
        return []
      }
    }
  },
  components: {
    PermBox,
    PrintBills,
    BelongsTable
  },

  watch: {
    dataInfo(nv) {
      if (nv) {
        this.loadInfo()
      }
    }
  },
  beforeCreate() {
    this.editForm = this.$form.createForm(this)
  },
  mounted() {
    this.loadInfo()
  },
  methods: {
    rotatePic() {
      this.rotateValue += 90
    },
    editDetailedInfo(dataInfo) {
      const {
        refundRemark,
        refundInfo: { bankUserName, bank, bankNo, userRelate, userRelateRemark },
        attachments
      } = dataInfo
      this.$nextTick(() => {
        this.newUploadFiles = [].concat(attachments)
        this.bankRemark = refundRemark
        this.bankUserName = bankUserName
        this.bank = bank
        this.bankNo = bankNo
        this.userRelate = userRelate
        this.userRelateRemark = userRelateRemark
        this.editInfoModal = true
      })
    },
    loadInfo() {
      detail(this.dataInfo.id).then(res => {
        this.detailInfo = res.data
        this.$forceUpdate()
      })
    },
    resetData() {
      if (!this.dataInfo.confirmName && this.achievements && this.achievements.length) {
        this.$refs.achi && this.$refs.achi._reset()
      }
      this.detailInfo = null
    },
    //修改业绩归属
    addAchievements() {
      this.addAchievementsModel = true
      if (this.$refs.belongsTable) {
        this.$refs.belongsTable.initBelongs()
      }
    },
    saveAchievements() {
      const {
        $notification,
        detailInfo: {
          finance: { id }
        }
      } = this
      this.$refs.belongsTable
        .getAllValue()
        .then(res => {
          console.log(res)
          return changeAchievement(id, res)
        })
        .then(res => {
          $notification.success({
            message: '系统通知',
            description: '提交成功'
          })
          this.addAchievementsModel = false
          this.loadInfo()
        })
    },
    printBills() {
      this.$refs.printBills.printer()
    }
  }
}
</script>

<style lang="less">
@import '~@/assets/style/index';

.uploadedFile {
  width: 250px;
  max-width: 250px;
  .close {
    cursor: pointer;
  }
}
.detailed-wrapper {
  .cus_modal {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -375px;
  }
  .paylog-wrapper {
    width: 100%;
    max-height: 400px;
    overflow-y: auto;
  }

  .item {
    margin: 10px 0;

    .label {
      padding-right: 15px;
    }
  }

  .log-scroll {
    /* max-height: 450px;
      overflow-y: scroll; */
  }

  .no-data {
    width: 100%;
    height: 20px;
    color: #999;
    font-size: 14px;
    margin: 10px 0;
    .center();
  }
}
</style>
