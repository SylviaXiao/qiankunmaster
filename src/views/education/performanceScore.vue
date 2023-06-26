<template>
  <div ref="printHtml" style="margin: 20px 0; padding-top: 20px; background: #FFF;">
    <a-card :bordered="false">
      <a-row :gutter="[8, 16]">
        <a-col :span="6">上课分馆：{{ classInfo.deptName }}</a-col>
        <a-col :span="6">开班日期：{{ $tools.tailor.getDate(classInfo.startDate) }}</a-col>
        <a-col :span="6">结业日期：{{ $tools.tailor.getDate(classInfo.endDate) }}</a-col>
        <a-col :span="6">上课导师：{{ Array.isArray(classInfo.teacherName) ? classInfo.teacherName.join(',') : '' }}</a-col>
        <a-col :span="6">班型：{{ classInfo.eduTypeName }}>{{ classInfo.eduClassTypeName }}</a-col>
        <a-col :span="6">舞种：{{ classInfo.eduDanceName }}</a-col>
        <a-col :span="6">教研负责人：{{ classInfo.userName }}</a-col>
        <a-col :span="6" v-if="classInfo.eduTypeName === '教练班' && classInfo.eduClassTypeName === '教练班'">
          <a @click="openRenewalCardOk">续卡人头：{{ classInfo.renewCardNum }} ></a>
        </a-col>
      </a-row>

      <div class="mt30">
        <div class="title mb10">上课人数</div>
        <a-table
          ref="table1"
          bordered
          :columns="columns1"
          :dataSource="dataSource1"
          :loading="tableLoading"
          :rowKey="(record, index) => index"
          :pagination="false"
        >
          <span slot="sysValConfId" slot-scope="text, record">
            <a-select
              :allowClear="false"
              v-model="record.sysValConfId"
              placeholder="请选择学员状态"
              :dropdownMatchSelectWidth="false"
              style="width: 100%"
              @change="stateChange(record)"
            >
              <a-select-option v-for="(item, index) in stuStatusList" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
            </a-select>
          </span>
          <span slot="stuContinuity" slot-scope="text, record">
            <a-checkbox :checked="record.stuContinuity === 'A'" @change="continuityChange(record)">是</a-checkbox>
          </span>
          <span slot="cardInfo" style="display: flex">
            <div class="head" style="width: 120px;">签到卡号</div>
            <div class="head" style="width: 120px;">续卡卡号</div>
            <div class="head" style="width: 160px;">续卡卡种名称</div>
            <div class="head" style="width: 160px;">续班课程（班型）</div>
            <div class="head" style="width: 120px;">续卡确认金额</div>
            <div class="head" style="width: 120px;">续卡类型</div>
            <div class="head" style="width: 120px;">续卡个数</div>
            <div class="head" style="width: 120px;">续卡确认情况</div>
            <div class="head" style="width: 180px;">操作</div>
          </span>
          <span slot="cardInfo" slot-scope="text, record">
            <div v-for="(signCard, si) in record.card" :key="si" class="row">
              <div class="cell" style="width: 120px;">{{ signCard.signCardNo }}</div>
              <div v-if="Array.isArray(signCard.renewalCard) && signCard.renewalCard.length > 0">
                <div v-for="(nextCard, ni) in signCard.renewalCard" :key="ni" class="row">
                  <div class="cell" style="width: 120px;">{{ nextCard.renewalCardNo }}</div>
                  <div class="cell" style="width: 160px;">
                    <div class="ellipsis" :title="nextCard.renewalCardName">{{ nextCard.renewalCardName }}</div>
                  </div>
                  <div class="cell" style="width: 160px;">{{ nextCard.eduTypeName }}>{{ nextCard.eduClassTypeName }}</div>
                  <div class="cell" style="width: 120px;">{{ nextCard.price }}</div>
                  <div class="cell" style="width: 120px;">{{ nextCard.cardType | cardTypeFilter }}</div>
                  <div class="cell" style="width: 120px;">{{ nextCard.num }}</div>
                  <div class="cell" style="width: 120px;">{{ nextCard.cardStatus | cardStatusFilter }}</div>
                  <div class="cell" style="width: 180px;">
                    <perm-box perm="education:instruct:renewal_del">
                      <a v-if="!detailMode" @click="handleDelete(1, record, si, ni)">删除续卡</a>
                    </perm-box>
                    <perm-box perm="education:instruct:renewCard_user">
                      <a v-if="!detailMode && nextCard.cardStatus == 'A'" @click="handleRenewConfirm(1, record, si, ni)">确认续卡</a>
                    </perm-box>
                  </div>
                </div>
              </div>
              <div v-else>
                <div class="row">
                  <div class="cell" style="width: 120px;">&nbsp;</div>
                  <div class="cell" style="width: 160px;">&nbsp;</div>
                  <div class="cell" style="width: 160px;">&nbsp;</div>
                  <div class="cell" style="width: 120px;">&nbsp;</div>
                  <div class="cell" style="width: 120px;">&nbsp;</div>
                  <div class="cell" style="width: 120px;">&nbsp;</div>
                  <div class="cell" style="width: 120px;">&nbsp;</div>
                  <div class="cell" style="width: 180px;">&nbsp;</div>
                </div>
              </div>
            </div>
          </span>
          <template v-if="showPageData" slot="footer">
            <span class="score-text">续卡分：{{ classScore }}</span>
            <span class="ml-20 score-text">流失分：{{ classLossScore }}</span>
          </template>
        </a-table>
      </div>

      <div class="mt30">
        <div class="title mb10">特殊续卡 （例如：上课学员存在续卡，但无法显示的续卡）</div>
        <a-table
          ref="table2"
          bordered
          :columns="columns2"
          :dataSource="dataSource2"
          :loading="tableLoading"
          :rowKey="(record, index) => index"
          :pagination="false"
        >
          <span slot="cardInfo" style="display: flex">
            <div class="head" style="width: 120px;">续卡卡号</div>
            <div class="head" style="width: 180px;">续卡卡种名称</div>
            <div class="head" style="width: 180px;">续班课程（班型）</div>
            <div class="head" style="width: 120px;">续卡确认金额</div>
            <div class="head" style="width: 180px;">续卡类型</div>
            <div class="head" style="width: 120px;">续卡个数</div>
            <div class="head" style="width: 180px;">续卡确认情况</div>
            <div class="head" style="width: 180px;">操作</div>
          </span>
          <span slot="cardInfo" slot-scope="text, record, index">
            <div v-for="(card, ni) in record.renewalCard" :key="ni" class="row">
              <div class="cell" style="width: 120px;">{{ card.renewalCardNo }}</div>
              <div class="cell" style="width: 180px;">
                <div class="ellipsis" :title="card.cardName">{{ card.cardName }}</div>
              </div>
              <div class="cell" style="width: 180px;">{{ card.eduTypeName }}>{{ card.eduClassTypeName }}</div>
              <div class="cell" style="width: 120px;">{{ card.price }}</div>
              <div class="cell" style="width: 180px;">{{ card.cardType | cardTypeFilter }}</div>
              <div class="cell" style="width: 120px;">{{ card.num }}</div>
              <div class="cell" style="width: 180px;">{{ card.cardStatus | cardStatusFilter }}</div>
              <div class="cell" style="width: 180px;">
                <perm-box perm="education:instruct:renewal_del">
                  <a v-if="!detailMode" @click="handleDelete(2, record, ni)">删除续卡</a>
                </perm-box>
                <perm-box perm="education:instruct:renewCard_user">
                  <a v-if="!detailMode && card.cardStatus == 'A'" @click="handleRenewConfirm(2, record, ni)">确认续卡</a>
                </perm-box>
              </div>
            </div>
          </span>
          <template v-if="showPageData" slot="footer">
            <span class="score-text">续卡分：{{ specialScore }}</span>
          </template>
        </a-table>
      </div>

      <div class="mt30">
        <div class="title mb10">往期续卡</div>
        <a-table
          ref="table3"
          bordered
          :columns="columns3"
          :dataSource="dataSource3"
          :loading="tableLoading"
          :rowKey="(record, index) => index"
          :pagination="false"
        >
          <span slot="cardInfo" style="display: flex">
            <div class="head" style="width: 120px;">续卡卡号</div>
            <div class="head" style="width: 180px;">续卡卡种名称</div>
            <div class="head" style="width: 180px;">续班课程（班型）</div>
            <div class="head" style="width: 120px;">续卡确认金额</div>
            <div class="head" style="width: 180px;">续卡类型</div>
            <div class="head" style="width: 120px;">续卡个数</div>
            <div class="head" style="width: 180px;">续卡确认情况</div>
            <div class="head" style="width: 180px;">操作</div>
          </span>
          <span slot="cardInfo" slot-scope="text, record, index">
            <div v-for="(card, ni) in record.renewalCard" :key="ni" class="row">
              <div class="cell" style="width: 120px;">{{ card.renewalCardNo }}</div>
              <div class="cell" style="width: 180px;">
                <div class="ellipsis" :title="card.cardName">{{ card.cardName }}</div>
              </div>
              <div class="cell" style="width: 180px;">{{ card.eduTypeName }}>{{ card.eduClassTypeName }}</div>
              <div class="cell" style="width: 120px;">{{ card.price }}</div>
              <div class="cell" style="width: 180px;">{{ card.cardType | cardTypeFilter }}</div>
              <div class="cell" style="width: 120px;">{{ card.num }}</div>
              <div class="cell" style="width: 180px;">{{ card.cardStatus | cardStatusFilter }}</div>
              <div class="cell" style="width: 180px;">
                <perm-box perm="education:instruct:renewal_del">
                  <a v-if="!detailMode" @click="handleDelete(3, record, ni)">删除续卡</a>
                </perm-box>
                <perm-box perm="education:instruct:renewCard_user">
                  <a v-if="card.cardStatus == 'A'" @click="handleRenewConfirm(3, record, ni)">确认续卡</a>
                </perm-box>
              </div>
            </div>
          </span>
          <template v-if="showPageData" slot="footer">
            <span class="score-text">续卡分：{{ renewalScore }}</span>
          </template>
        </a-table>
      </div>

      <div class="mt30">
        <a-form-model ref="ruleForm">
          <a-row>
            <a-col :span="24">
              <div class="title mb10">奖金退费</div>
            </a-col>
            <a-col :span="6">
              <a-form-model-item v-bind="{ labelCol: { span: 6 }, wrapperCol: { span: 18 } }" label="退费金额" prop="area">
                <a-input-number v-model="refundPrice" :disabled="!hasPerm('education:instruct:bonus_edit')" :min="0" placeholder="请输入" style="width:100%;" />
              </a-form-model-item>
            </a-col>
            <a-col :span="18">
              <a-form-model-item v-bind="{ labelCol: { span: 4 }, wrapperCol: { span: 20 } }" label="备注" prop="area">
                <a-input v-model="refundReason" :disabled="!hasPerm('education:instruct:bonus_edit')" placeholder="请输入" style="width:100%;" />
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <div class="title mb10">连报分</div>
            </a-col>
            <a-col :span="6">
              <a-form-model-item v-bind="{ labelCol: { span: 6 }, wrapperCol: { span: 18 } }" label="分数" prop="area">
                <a-input-number
                  v-model="continuityScore"
                  :disabled="!hasPerm('education:instruct:continuity_edit')"
                  :min="0"
                  placeholder="请输入"
                  style="width:100%;"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="18">
              <a-form-model-item v-bind="{ labelCol: { span: 4 }, wrapperCol: { span: 20 } }" label="备注" prop="area">
                <a-input v-model="continuityReason" :disabled="!hasPerm('education:instruct:continuity_edit')" placeholder="请输入" style="width:100%;" />
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </div>

      <div class="score-wrapper mt-30">
        <div class="title mb-10">绩效评分</div>
        <template>
          <div v-for="(config, configIndex) in localScoreData" :key="configIndex">
            <div class="mb-10">
              <span class="score-title">{{ `${config.name}(${config.score}分)` }}</span>
              <span class="ml-10 text-weight-b">{{ config.detail }}</span>
            </div>
            <div class="mb-30">
              <a-table
                bordered
                :columns="config.columns"
                :dataSource="expandDataSource(config)"
                :loading="tableLoading"
                :rowKey="(record, index) => index"
                :pagination="false"
              >
                <span slot="scorer" slot-scope="text, record">
                  <a-input
                    :value="record.scorer"
                    placeholder="请输入名称"
                    @change="handleScorerChange($event, record)"
                    @blur.native="handleScorerBlur($event, record)"
                  />
                </span>

                <span slot="customDataTitleX">
                  <div class="flex">
                    <div v-for="child in config.children" :key="`${configIndex}-${child.id}`" :ref="`${configIndex}-${child.id}`">
                      <div class="table-header-cell">{{ child.name + `*${child.score}` }}</div>
                    </div>
                  </div>
                </span>

                <span slot="customDataX" slot-scope="text, record">
                  <div class="flex">
                    <div v-for="customItem in record.customData" :key="`customDataX-${customItem.id}`" class="table-cell">
                      <a-input-number :disabled="!record.scorer" style="width:200px;" v-model="customItem.total" :min="0" :max="customItem.score" />
                    </div>
                  </div>
                </span>

                <span slot="total" slot-scope="text, record, index">
                  <div>{{ getXTotalScore(record, index) }}</div>
                </span>

                <span slot="reason" slot-scope="text, record">
                  <a-input :style="{minWidth: '160px'}" :disabled="!record.scorer" v-model="record.reason" placeholder="请输入备注" />
                </span>

                <span slot="customDataY" slot-scope="text, record">
                  <div v-for="item in record.customData" :key="item.id" class="table-cell-y">
                    {{ `${item.name}*${item.score}` }}
                  </div>
                  <div class="table-cell-y">总分：</div>
                </span>
                <span slot="evaluateY" slot-scope="text, record">
                  <div v-for="item in record.customData" :key="item.id" class="table-cell-y">
                    <a-input-number :disabled="!record.scorer" style="width:120px;" v-model="item.total" :min="0" :max="item.score" />
                  </div>
                  <div class="table-cell-y">{{ getYTotalScore(record) }}</div>
                </span>

                <span slot="reasonY" slot-scope="text, record">
                  <div v-for="item in record.customData" :key="item.id" class="table-cell-y px-20">
                    <a-input :style="{minWidth: '160px'}" :disabled="!record.scorer" v-model="item.reason" placeholder="请输入备注" />
                  </div>
                  <div class="table-cell-y"></div>
                </span>

                <template v-if="showPageData" slot="footer" slot-scope="_">
                  <div class="score-text">平均分：{{ config.finalScore }}</div>
                </template>
              </a-table>
            </div>
          </div>
        </template>
      </div>

      <div v-if="showPageData" class="final-data">
        <a-space :size="80">
          <div>评分合计：{{ finalPerformanceScore.toFixed(2) }}</div>
          <div>总分：{{ pageTotal }}</div>
          <div>奖金：{{ bonus }}</div>
          <div>实发奖金：{{ realBonus }}</div>
        </a-space>
      </div>
    </a-card>

    <div class="ant-modal-footer mt-10">
      <!-- <a-button>取消</a-button> -->
      <!-- 有权限且是确认页面 -->
      <perm-box perm="education:instruct:confirm">
        <a-button v-if="showConfirm && this.classInfo.scoreState === 'C'" type="primary" class="ml-10" @click="handleTotalConfirm">确认</a-button>
      </perm-box>
      <!-- 有权限且是编辑页面 -->
      <a-button v-if="showSave" type="primary" class="ml-10" @click="handleSubmit">保存</a-button>
      <perm-box perm="education:instruct:score_print">
        <a-button v-if="showPrint" type="primary" class="ml-10" @click="handlePrint">打印</a-button>
      </perm-box>
    </div>

    <a-modal
      title="续卡人头"
      :maskClosable="$store.state.modalMaskClickEnable"
      :width="800"
      :visible="renewalCardVisible"
      :confirmLoading="confirmLoading"
      @ok="handleRenewalCardOk"
      @cancel="handleRenewalCardCancel"
    >
      <div class="mb-20 flex flex-between">
        <div>
          <span class="required">续卡人头：</span>
          <a-radio-group v-model="renewalCardNum">
            <a-radio :value="0">0</a-radio>
            <a-radio :value="1">1</a-radio>
          </a-radio-group>
        </div>
        <a-button @click="queryRenewList">刷新</a-button>
      </div>
      <a-table bordered :columns="renewalCardColumns" :dataSource="renewalCardDataSource" :rowKey="(record, index) => index" :pagination="false">
        <span
          v-for="slotName in ['renewalCardNo', 'renewalCardName', 'classType', 'price']"
          :key="`renewlist-custom-${slotName}`"
          :slot="slotName"
          slot-scope="text, record"
        >
          <div v-for="item in record.renewalCard" :key="item.id" class="table-cell-y">
            {{ item[slotName] }}
          </div>
        </span>
      </a-table>
    </a-modal>

    <editContinuedCard ref="editContinuedCard" @change="initList" />
  </div>
</template>

<script>
import { STable, SearchComPro, PermBox } from '@/components'
import editContinuedCard from './continue/scoreContinuedCard.vue'
import {
  getAchClassStudentDetail,
  listSysValConf,
  performanceScoreList,
  listAchClassStudentStateSave,
  listAchClassStudentContinuitySave,
  performanceScoreDelete,
  performanceScoreSpecialList,
  performanceScoreSpecialDelete,
  getAchClassStudentEvaluate,
  saveAchClassScore,
  saveRenewCardNum,
  confirmAchClassScore,
  getAchClassStudentDetailRenweList
} from '@/api/education'
import { pageOnStudentCard } from '@/api/recep'
import html2canvas from 'html2canvas'
import printJs from 'print-js'

const noPaddingCell = (record, rowIndex) => {
  return {
    style: {
      padding: '0px!important'
    }
  }
}
const columns1 = [
  {
    title: '学员姓名',
    dataIndex: 'stuName',
    width: 120
  },
  {
    title: '手机号',
    dataIndex: 'stuPhone',
    width: 120
  },
  {
    title: '学员状态',
    dataIndex: 'sysValConfId',
    scopedSlots: { customRender: 'sysValConfId' },
    customCell: noPaddingCell,
    width: 200
  },
  {
    title: '是否连报',
    dataIndex: 'stuContinuity',
    scopedSlots: { customRender: 'stuContinuity' },
    width: 80
  },
  {
    dataIndex: 'cardInfo',
    slots: { title: 'cardInfo' },
    scopedSlots: { customRender: 'cardInfo' },
    customHeaderCell: noPaddingCell,
    customCell: noPaddingCell,
    width: 1220
  }
]
const columns2 = [
  {
    title: '学员姓名',
    dataIndex: 'stuName',
    width: 120
  },
  {
    title: '手机号',
    dataIndex: 'stuPhone',
    width: 120
  },
  {
    dataIndex: 'cardInfo',
    slots: { title: 'cardInfo' },
    scopedSlots: { customRender: 'cardInfo' },
    customHeaderCell: noPaddingCell,
    customCell: noPaddingCell,
    width: 1260
  }
]
const columns3 = [
  {
    title: '学员姓名',
    dataIndex: 'stuName',
    width: 120
  },
  {
    title: '手机号',
    dataIndex: 'stuPhone',
    width: 120
  },
  {
    dataIndex: 'cardInfo',
    slots: { title: 'cardInfo' },
    scopedSlots: { customRender: 'cardInfo' },
    customHeaderCell: noPaddingCell,
    customCell: noPaddingCell,
    width: 1260
  }
]
const renewalCardColumns = [
  {
    title: '学员姓名',
    align: 'center',
    dataIndex: 'stuName'
  },
  {
    title: '手机号',
    align: 'center',
    dataIndex: 'stuPhone'
  },
  {
    title: '签到卡号',
    align: 'center',
    dataIndex: 'signCardNo'
  },
  {
    title: '续卡卡号',
    align: 'center',
    dataIndex: 'renewalCardNo',
    customCell: noPaddingCell,
    scopedSlots: { customRender: 'renewalCardNo' }
  },
  {
    title: '续卡卡种名称',
    align: 'center',
    dataIndex: 'renewalCardName',
    customCell: noPaddingCell,
    scopedSlots: { customRender: 'renewalCardName' }
  },
  {
    title: '续班课程（班型）',
    align: 'center',
    dataIndex: 'classType',
    customCell: noPaddingCell,
    scopedSlots: { customRender: 'classType' }
  },
  {
    title: '续卡实缴金额',
    align: 'center',
    dataIndex: 'price',
    customCell: noPaddingCell,
    scopedSlots: { customRender: 'price' }
  }
]

export default {
  name: 'performanceScore',
  components: {
    SearchComPro,
    STable,
    PermBox,
    editContinuedCard
  },
  data() {
    return {
      // 显示全部数据，包括单个绩效表的平均分和下方评分/总分/奖金/实发奖金
      showFullData: false,

      id: null,
      className: null,
      classInfo: {},
      tableLoading: false,
      confirmLoading: false,
      stuStatusList: [],

      columns1,
      dataSource1: [],
      columns2,
      dataSource2: [],
      selectedRowKeys2: [],
      selectedRows2: [],
      columns3,
      dataSource3: [],
      selectedRowKeys3: [],
      selectedRows3: [],

      scoreValue: {}, // 回显绩效表数据
      scoreConfigs: [],
      scoreColumns1: [],
      scoreColumns2: [],
      localScoreData: [], // 单元格缩减存放

      // 续卡人头
      renewalCardVisible: false,
      renewalCardNum: null,
      renewalCardColumns,
      renewalCardDataSource: [],

      // 奖金退费
      refundPrice: 0,
      refundReason: null,

      // 连报分
      continuityScore: 0,
      continuityReason: null,

      // 总绩效评分
      finalPerformanceScore: 0,
      finalScoreList: []

      // // 奖金
      // rewardPrice: 0,
      // // 实发奖金
      // realPrice: 0,
    }
  },
  computed: {
    // TODO: 封装全局方法
    loginId() {
      return this.$store.state.user.info.user.id
    },
    loginRoles() {
      let roles = this.$store.state.user.info.roles || []
      let roleList = []
      roles.forEach(role => {
        const { roleId } = role
        roleList.push(roleId)
      })
      return roleList
    },
    perms() {
      return this.$store.state.user.info.perms || []
    },
    isAdmin() {
      return this.loginId == 'admin'
    },
    // 如果是确认和详情进来则显示分数
    showPageData() {
      if (this.isAdmin) return true
      let type = this.$route.params.type
      return this.showConfirm || type == 'detail' || this.showPrint
    },
    // 详情状态下,无法调用接口
    detailMode() {
      return !this.showConfirm && !this.showSave
    },
    showConfirm() {
      return this.$route.params.type === 'confirm'
    },
    showSave() {
      return this.$route.params.type === 'edit'
    },
    showPrint() {
      return this.$route.params.type === 'print'
    },
    // 匹配角色,如果当前角色是在已配置的列表中,则只能查看到对应的角色打分
    // 例如: 当前角色为教研专员,而评分列表里面有教研主管等其他角色,看的时候隐藏
    // 如果当前的角色id不匹配,则放开表格所有内容查看
    scoreTableLimit() {
      let limit = false
      let roles = this.classInfo?.roles || []
      roles.forEach(role => {
        const { roleId, roleName } = role
        if (this.loginRoles.includes(roleId)) {
          limit = true
        }
      })
      return limit
    },
    // 上课人数续卡分
    classScore() {
      let result = 0
      this.dataSource1.forEach(({ card }, index) => {
        for (const { renewalCard } of card) {
          for (const item of renewalCard) {
            const { cardType, num } = item
            if (num == null) {
              console.log('无续卡个数')
            } else if (cardType === 'A') {
              // 本期续卡 *5
              result += num * 5
            } else if (cardType === 'B') {
              // 往期续卡 *2
              result += num * 2
            }
            // 其他情况忽略
          }
        }
      })
      return result
    },
    // 上课人数流失分
    classLossScore() {
      let result = 0
      let lostNum = 0
      this.dataSource1.forEach(({ sysValConfId, sysValConfName }) => {   
        if (this.isLostType(sysValConfName)) {
          lostNum++
        }
      })
      // 免流失人数
      let countFreeNum = this.dataSource1?.length >= 20 ? 2 : 1
      result = 10 - (lostNum - countFreeNum) * 2
      // 最终分数 [0,10]
      return result > 10 ? 10 : result < 0 ? 0 : result
    },
    // 特殊续卡分
    specialScore() {
      return this.getContinuityScore(this.dataSource2)
    },
    // 往期续卡分
    renewalScore() {
      return this.getContinuityScore(this.dataSource3)
    },
    // 所有模块总分
    pageTotal() {
      let total = (this.classScore || 0) + (this.classLossScore || 0) + (this.specialScore || 0) + (this.renewalScore || 0) + (this.continuityScore || 0) + (this.finalPerformanceScore || 0)
      return total.toFixed(2)
    },
    // 奖金
    bonus() {
      if (this.pageTotal >= 80) {
        return (3000 + (this.pageTotal - 80) * 200).toFixed(2)
      }
      return 0
    },
    // 实发奖金
    realBonus() {
      return (this.bonus - this.refundPrice).toFixed(2)
    }
  },
  // watch: {
  //   config: {
  //     healder: ()
  //     deep: true
  //   },
  // },
  filters: {
    cardTypeFilter(type) {
      const map = {
        A: '本期续卡',
        B: '往期续卡',
        C: '到期续卡',
        D: '未到期续卡',
        E: '延期续卡'
      }
      return map[type] || ''
    },
    cardStatusFilter(type) {
      const map = {
        A: '未确认',
        B: '已确认',
        C: '已作废'
      }
      return map[type] || ''
    }
  },
  created() {},
  mounted() {
    // this.currentRole
    this.id = this.$route.params.id
    this.className = this.$route.params.className
    this.$multiTab.rename(this.$route.fullPath, this.className)
    this.initBasicInfo()
    this.initOptions()
    this.initList()
    this.initScoreList()
    this.queryRenewList()
  },
  methods: {
    hasPerm(permStr) {
      if (this.isAdmin) return true
      return this.perms.includes(permStr)
    },
    matchRole(roleId) {
      // if (this.isAdmin) return true
      return this.loginRoles.includes(roleId)
    },
    // 流失类型
    isLostType(value) {
      return [
        '续卡流失',
        '新报流失',
        '补课未结课'
      ].includes(value)
    },
    getContinuityScore(dataSource) {
      let result = 0
      dataSource.forEach(({ renewalCard }, index) => {
        for (const item of renewalCard) {
          const { cardType, num } = item
          // 本期续卡 *5
          if (cardType === 'A') {
            result += num * 5
          } else if (cardType === 'B') {
            // 往期续卡 *2
            result += num * 2
          }
        }
      })
      return result
    },
    // 横屏 x轴 竖屏 y轴
    isEvaluteX(showType) {
      return showType === 'A'
    },
    queryRenewList() {
      getAchClassStudentDetailRenweList({ id: this.id }).then(res => {
        this.renewalCardDataSource = res.data
      })
    },

    initOptions() {
      listSysValConf('instructAch').then(res => {
        this.stuStatusList = res.data || []
      })
    },
    async initBasicInfo() {
      let res = await getAchClassStudentDetail({ id: this.id })
      this.classInfo = res.data
      const { renewCardNum, refundPrice, refundReason, continuityScore, continuityReason } = res.data
      // 同步续卡人头
      this.renewalCardNum = renewCardNum
      // 同步奖金退费和连报分
      this.refundPrice = refundPrice
      this.refundReason = refundReason
      this.continuityScore = continuityScore
      this.continuityReason = continuityReason
    },
    initList() {
      this.dataSource1 = []
      this.dataSource2 = []
      this.dataSource3 = []
      performanceScoreList({ id: this.id }).then(res => {
        this.dataSource1 = res.data || []
      })
      performanceScoreSpecialList({ id: this.id }).then(res => {
        const dataSource = res.data || []
        dataSource.forEach(item => {
          const { renewalCardType, studentInfoId, stuName, stuPhone, renewalCard } = item
          if (renewalCardType === 'A') {
            this.dataSource2.push({
              studentInfoId,
              stuName,
              stuPhone,
              renewalCard
            })
          } else if (renewalCardType === 'B') {
            this.dataSource3.push({
              studentInfoId,
              stuName,
              stuPhone,
              renewalCard
            })
          }
        })
      })
    },
    // 初始化绩效评分列表
    async initScoreList() {
      const {
        data: { scoreTitle, scoreValue }
      } = await getAchClassStudentEvaluate({ id: this.id })

      this.scoreValue = scoreValue && JSON.parse(scoreValue)
      // console.log(`回显绩效表scoreValue`, this.scoreValue)
      this.localScoreData = []
      this.scoreConfigs = scoreTitle.filter(item => {
        // 过滤无效数据
        const { children, showType } = item
        if (!showType) return
        if (showType != 'A' && showType != 'B') return false
        return children?.length > 0
      })
      this.scoreConfigs.forEach((table, tableIndex) => {
        const { id: tableId, name, score, detail, children, showType, scoreItemRole } = table
        let tableConfig = {
          id: tableId,
          name,
          score,
          showType,
          detail,
          children,
          scoreItemRole,
          dataSource: [],
          columns: [],
          finalScore: 0
        }

        /*
            当前页面权限由前面列表页控制
            如果自己的角色id都没有匹配上列表分配的角色，那么可以看全部
            默认是可以看全部
        */

        this.finalScoreList[tableIndex] = 0
        let columns = []
        // 横版
        if (this.isEvaluteX(showType)) {
          columns = [
            {
              title: '角色',
              align: 'center',
              dataIndex: 'roleName',
              width: 120,
              customRender: (value, row, index) => {
                const obj = {
                  children: value,
                  attrs: {
                    rowSpan: 1
                  }
                }
                return obj
              }
            },
            {
              title: '评分人员*',
              align: 'center',
              scopedSlots: { customRender: 'scorer' },
              width: 120
            },
            {
              slots: { title: 'customDataTitleX' },
              scopedSlots: { customRender: 'customDataX' },
              customHeaderCell: noPaddingCell,
              customCell: noPaddingCell,
              width: children.length * 120
            },
            {
              title: '总分',
              align: 'center',
              scopedSlots: { customRender: 'total' },
              width: 80
            },
            {
              title: '备注',
              align: 'center',
              scopedSlots: { customRender: 'reason' }
            },
            {
              title: '操作',
              align: 'center',
              fixed: 'right',
              customRender: (value, row, index) => {
                let tableConfig = this.localScoreData[row.tableIndex]
                return {
                  children: (
                    <a>
                      <a-icon type="plus-circle" onClick={() => this.addScoreRow(tableConfig, row, index)} />
                      <a-icon class="ml-10" type="minus-circle" onClick={() => this.deleteScoreRow(tableConfig, row, index)} />
                    </a>
                  ),
                  attrs: {
                    rowSpan: 1
                  }
                }
              },
              width: 120
            }
          ]

          // 每个角色下可能有多个用户
          scoreItemRole.forEach((roleItem, groupIndex) => {
            const { id: roleId, roleName } = roleItem
            tableConfig.dataSource.push([])
            // 已存在则回显
            if (this.scoreValue) {
              let scorers = this.scoreValue[tableId]?.[roleId]
              scorers?.forEach(scorer => {
                let customData = []
                let scorerName = null
                let rowReason = null
                children.forEach(child => {
                  let localItem = {
                    ...child,
                    reason: null,
                    total: null // 评价分数 , 原本score字段表示最大得分
                  }
                  // 遍历单个评分项，回填评分内容
                  scorer.forEach(remoteItem => {
                    scorerName = remoteItem.scorer
                    if (localItem.id == remoteItem.id) {
                      rowReason = remoteItem.reason
                      localItem.reason = remoteItem.reason
                      localItem.total = remoteItem.score
                    }
                  })
                  customData.push(localItem)
                })
                tableConfig.dataSource[groupIndex].push({
                  roleId,
                  groupIndex,
                  roleName,
                  scorer: scorerName,
                  customData,
                  total: 0,
                  reason: rowReason,
                  tableIndex
                })
              })
            } else {
              // 如果没有回显，则每个角色添加默认一条数据
              let customData = []
              children.forEach(child => {
                customData.push({
                  ...child,
                  reason: null,
                  total: null // 评价分数 , 原本score字段表示最大得分
                })
              })
              tableConfig.dataSource[groupIndex].push({
                roleId,
                groupIndex,
                roleName,
                scorer: null,
                customData, // 存放配置的评分内容，计算总分时遍历一遍
                total: 0,
                reason: null,
                tableIndex
              })
            }
          })
        } else {
          // 竖屏
          columns = [
            {
              title: '角色',
              align: 'center',
              dataIndex: 'roleName',
              width: 120,
              customRender: (value, row, index) => {
                const obj = {
                  children: value,
                  attrs: {
                    rowSpan: row.rowSpan
                  }
                }
                return obj
              }
            },
            {
              title: '评分人员*',
              align: 'center',
              scopedSlots: { customRender: 'scorer' },
              width: 120
            },
            {
              title: '评分内容',
              align: 'center',
              scopedSlots: { customRender: 'customDataY' },
              customHeaderCell: noPaddingCell,
              customCell: noPaddingCell,
              width: 460
            },
            {
              title: '评分',
              align: 'center',
              scopedSlots: { customRender: 'evaluateY' },
              customCell: noPaddingCell,
              width: 140
            },
            {
              title: '备注',
              align: 'center',
              scopedSlots: { customRender: 'reasonY' },
              customCell: noPaddingCell
            },
            {
              title: '操作',
              align: 'center',
              customRender: (value, row, index) => {
                let tableConfig = this.localScoreData[row.tableIndex]
                return {
                  children: (
                    <a>
                      <a-icon type="plus-circle" onClick={() => this.addScoreRow(tableConfig, row, index)} />
                      <a-icon class="ml-10" type="minus-circle" onClick={() => this.deleteScoreRow(tableConfig, row, index)} />
                    </a>
                  ),
                  attrs: {
                    rowSpan: 1
                  }
                }
              },
              width: 120
            }
          ]

          // 每个角色下可能有多个用户
          scoreItemRole.forEach((roleItem, groupIndex) => {
            const { id: roleId, roleName } = roleItem
            tableConfig.dataSource.push([])
            if (this.scoreValue) {
              let scorers = this.scoreValue[tableId]?.[roleId]
              scorers?.forEach(scorer => {
                let customData = []
                let scorerName = null
                children.forEach(child => {
                  let localItem = {
                    ...child,
                    reason: null,
                    total: null // 评价分数 , 原本score字段表示最大得分
                  }
                  // 遍历单个评分项，回填评分内容
                  scorer.forEach(remoteItem => {
                    scorerName = remoteItem.scorer
                    if (localItem.id == remoteItem.id) {
                      localItem.reason = remoteItem.reason
                      localItem.total = remoteItem.score
                    }
                  })
                  customData.push(localItem)
                })
                tableConfig.dataSource[groupIndex].push({
                  roleId,
                  groupIndex,
                  roleName,
                  scorer: scorerName,
                  customData,
                  total: 0,
                  reason: null,
                  tableIndex
                })
              })
            } else {
              // 如果没有回显，则每个角色添加默认一条数据
              let customData = []
              children.forEach(child => {
                customData.push({
                  ...child,
                  reason: null,
                  total: null // 评价分数 , 原本score字段表示最大得分
                })
              })
              tableConfig.dataSource[groupIndex].push({
                roleId,
                groupIndex,
                roleName,
                scorer: null,
                customData,
                total: 0,
                reason: null,
                tableIndex
              })
            }
          })
        }

        tableConfig.columns = columns
        this.localScoreData.push(tableConfig)
      })
    },
    handleScorerChange(e, record) {
      let value = e.target.value && e.target.value.trim()
      if (value) {
        // 名称必填
        record.scorer = value
      }
    },
    handleScorerBlur(e, record) {
      let value = e.target.value && e.target.value.trim()
      if (value) {
        record.scorer = value
      } else {
        e.target.value = record.scorer
        this.$message.warning('评分人员不能为空')
      }
    },
    expandDataSource(config) {
      const { dataSource, showType, scoreItemRole } = config
      let expandList = []

      dataSource.forEach((roleGroup, index) => {
        if (this.scoreTableLimit) {
          roleGroup.forEach(scorerData => {
            const { roleId, groupIndex } = scorerData
            if (this.matchRole(roleId)) {
              expandList.push(scorerData)
            }
            // 不能查看其它角色的数据
          })
        } else {
          // 没有限制查看全部
          expandList.push(...roleGroup)
        }
      })

      // // 横版展开
      // if (this.isEvaluteX(showType)) {
      //   for (const groups of dataSource) {
      //     expandList.push(...groups)
      //   }
      // } else {
      //   for (const groups of dataSource) {
      //     expandList.push(...groups)
      //   }
      // }
      return expandList
    },
    // 横屏 单人（行）总分
    getXTotalScore(record) {
      const { customData, tableIndex } = record
      let total = 0
      // customData []
      for (let item of customData) {
        if (item.total && item.total >= 0) {
          total += item.total
        }
      }
      record.total = total
      this.getAverageScore(tableIndex)
      return total
    },
    // 竖屏 单人总分
    getYTotalScore(record) {
      const { customData, tableIndex } = record
      let total = 0
      // customData []
      for (let item of customData) {
        if (item.total && item.total >= 0) {
          total += item.total
        }
      }
      record.total = total
      this.getAverageScore(tableIndex)
      return total
    },
    // 计算单个表格下所有人评分的平均分
    getAverageScore(tableIndex) {
      let config = this.localScoreData[tableIndex]
      let { dataSource, showType } = config
      let tableTotal = 0 // 当前表的总分
      let scorerCount = 0 // 当前表的评分人数
      let finalScore = 0 // 最终得分 取平均分
      if (this.isEvaluteX(showType)) {
        dataSource.forEach(scorers => {
          scorers.forEach(scorer => {
            scorerCount++
            tableTotal += scorer.total
          })
        })
      } else {
        dataSource.forEach(scorers => {
          scorers.forEach(scorer => {
            scorerCount++
            tableTotal += scorer.total
          })
        })
      }

      scorerCount = scorerCount || 1
      finalScore = (tableTotal / scorerCount).toFixed(2)
      config.finalScore = finalScore
      // // 计算实际得分
      let former = this.finalScoreList[tableIndex]
      let diff = parseFloat(finalScore) - parseFloat(former)
      this.finalPerformanceScore += diff
      this.finalScoreList[tableIndex] = finalScore

      return finalScore
    },

    // 绩效评分增加行
    addScoreRow(tableConfig, record, currentIndex) {
      const { dataSource, columns, showType, children } = tableConfig
      const { groupIndex, roleName, tableIndex, roleId } = record
      const currentGroup = dataSource[groupIndex]
      if (this.isEvaluteX(showType)) {
        let customData = []
        children.forEach(child => {
          customData.push({
            ...child,
            reason: null,
            total: null
          })
        })
        tableConfig.dataSource[groupIndex].push({
          roleId,
          groupIndex,
          roleName,
          scorer: null,
          customData,
          total: 0,
          reason: null,
          tableIndex,
          hidden: false
        })
      } else {
        let customData = []
        children.forEach(child => {
          customData.push({
            ...child,
            reason: null,
            total: null // 评价分数 , 原本score字段表示最大得分
          })
        })
        tableConfig.dataSource[groupIndex].push({
          roleId,
          groupIndex,
          roleName,
          scorer: null,
          customData,
          total: 0,
          reason: null,
          tableIndex,
          hidden: false
        })
      }
    },
    deleteScoreRow(tableConfig, record, currentIndex) {
      const { dataSource, columns, showType, children } = tableConfig
      const { groupIndex, roleName, tableIndex, roleId } = record
      const currentGroup = dataSource[groupIndex]
      if (currentGroup.length <= 1) {
        this.$message.warning('最少保留一条评分')
        return
      }

      let actualIndex = currentIndex
      if (groupIndex === 0) {
        currentGroup.splice(actualIndex, 1)
      } else {
        for (let i = 0; i < dataSource.length; i++) {
          if (i == groupIndex) break
          actualIndex -= dataSource[i].length
        }
        currentGroup.splice(actualIndex, 1)
      }

      if (this.isEvaluteX(showType)) {
        // 重新调整布局
        // const [firstRow] = currentGroup
        // firstRow.rowSpan = currentGroup.length
      } else {
      }
    },

    stateChange(record) {
      const { id, studentInfoId, sysValConfId } = record
      listAchClassStudentStateSave({ id, studentInfoId, sysValConfId })
    },
    continuityChange(record) {
      if (record.stuContinuity !== 'A') {
        record.stuContinuity = 'A'
      } else {
        record.stuContinuity = 'B'
      }
      const { id, studentInfoId, stuContinuity } = record
      listAchClassStudentContinuitySave({ id, studentInfoId, stuContinuity })
    },
    // 确认续卡
    handleRenewConfirm(type, record, si, ni) {
      if (this.detailMode) {
        this.$message.warning('绩效已确认,无法修改')
        return
      }
      const { studentInfoId, sysValConfId } = record
      // 当期
      if (type === 1) {
        let card = record.card[si]
        let renewalCard = card.renewalCard[ni]
        this.$refs.editContinuedCard.open({ studentInfoId, card, renewalCard })
        // 特殊 / 往期
      } else if (type === 2 || type === 3) {
        let renewalCard = record.renewalCard[si]
        this.$refs.editContinuedCard.open({ studentInfoId, renewalCard })
      }
    },
    handleDelete(type, record, si, ni) {
      if (this.detailMode) {
        this.$message.warning('绩效已确认,无法修改')
        return
      }
      this.$confirm({
        title: '系统提示',
        content: '确认删除该条数据吗?',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          if (type === 1) {
            const { renewalCardNo } = record.card[si].renewalCard[ni]
            performanceScoreDelete({ renewalCardNo, id: this.id }).then(res => {
              if (res.code == 200) {
                this.$message.success('修改成功')
                this.initList()
              }
            })
          } else if (type === 2 || type === 3) {
            const { renewalCardNo } = record.renewalCard[si]
            let renewalCardType = type === 2 ? 'A' : 'B'
            performanceScoreSpecialDelete({ renewalCardNo, renewalCardType, id: this.id }).then(res => {
              if (res.code == 200) {
                this.$message.success('修改成功')
                this.initList()
              }
            })
          }
        }
      })
    },

    removeRow(record, userIndex) {
      record.userList.splice(userIndex, 1)
    },

    openRenewalCardOk() {
      this.renewalCardVisible = true
    },
    handleRenewalCardCancel() {
      this.renewalCardVisible = false
    },
    async handleRenewalCardOk() {
      if (this.detailMode) {
        this.$message.warning('绩效已确认,无法修改')
        return
      }
      const params = {
        id: this.id,
        renewCardNum: this.renewalCardNum
      }
      let res = saveRenewCardNum(params)
      this.classInfo.renewCardNum = this.renewalCardNum
      this.$message.success('修改成功')
      this.renewalCardVisible = false
    },
    setSubmitUnfinished(params) {
      if (params.scoreState == 'B') return
      params.scoreState = 'B'
    },
    // 过滤绩效评分表
    filterEvaluate(params) {
      const scoreDetail = []
      const scoreData = {}
      this.localScoreData.forEach(table => {
        const { dataSource, showType, children, scoreItemRole, id: tableId } = table
        /*
          list -> map 降低回显查找数据时间复杂度
          {
            'tableId': {
              'roleId1': [
                  {
                  'id': 'id1',
                    'score': 1,
                    'reason': '平均成绩',
                    'scorer': '主管1'
                  }
              ]
              },
              'roleId2': {

              }
            }
          }
        */
        scoreData[tableId] = {}
        if (this.isEvaluteX(showType)) {
          /*
              dataSource: [
                第一种角色
                [

                ],
                第二种角色
                [

                ]
              ]
          */
          dataSource.forEach((scorers, roleIndex) => {
            const roleId = scoreItemRole[roleIndex].id
            scoreData[tableId][roleId] = []
            // 当前角色种类下，初始认为都完成，只要有没完成的，数量减1
            // 最终完成数 = 0,则表示没有完成填写,那么总体绩效表格就不算完成
            let completeCount = scorers.length

            scorers.forEach(row => {
              const { customData, scorer, reason } = row
              let roleDataList = []
              scoreData[tableId][roleId].push(roleDataList)
              //
              if (!scorer) {
                this.setSubmitUnfinished(params)
                return
              }

              customData.forEach(customRecord => {
                const { id, total } = customRecord
                if (scorer && total != null && total >= 0) {
                  let validData = {
                    id,
                    score: total,
                    scorer,
                    reason
                  }
                  scoreDetail.push(validData)
                  roleDataList.push(validData)
                } else {
                  // 只要有一项没填完,当前行算没完成
                  completeCount--
                }
              })
              if (completeCount < 1) {
                this.setSubmitUnfinished(params)
              }
            })
          })
        } else {
          dataSource.forEach((scorers, roleIndex) => {
            const roleId = scoreItemRole[roleIndex].id
            scoreData[tableId][roleId] = []

            // 当前角色种类下，初始认为都完成，只要有没完成的，数量减1
            // 最终完成数 = 0,则表示没有完成填写,那么总体绩效表格就不算完成
            let completeCount = scorers.length

            scorers.forEach(row => {
              const { customData, scorer } = row
              let roleDataList = []
              scoreData[tableId][roleId].push(roleDataList)

              customData.forEach(customRecord => {
                const { id, total, reason } = customRecord
                // 有评分人员且填写了对应的分数
                if (scorer && total != null && total >= 0) {
                  let validData = {
                    id,
                    score: total,
                    scorer,
                    reason
                  }
                  scoreDetail.push(validData)
                  roleDataList.push(validData)
                } else {
                  // 只要有一项没填完,当前行算没完成
                  completeCount--
                }
              })
              if (completeCount < 1) {
                this.setSubmitUnfinished(params)
              }
            })
          })
        }
      })
      params.scoreDetail = JSON.stringify(scoreDetail)
      params.scoreData = JSON.stringify(scoreData)
      return params
    },
    // 过滤续卡，只要有未确认的续卡，就不算完成
    filterRenew(params) {
      this.dataSource1.forEach(({ card }, index) => {
        for (const { renewalCard } of card) {
          for (const item of renewalCard) {
            const { cardStatus } = item
            if (cardStatus === 'A') {
              this.setSubmitUnfinished(params)
            }
          }
        }
      })
      this.dataSource2.forEach(({ renewalCard }, index) => {
        for (const item of renewalCard) {
          const { cardStatus } = item
          if (cardStatus === 'A') {
            this.setSubmitUnfinished(params)
          }
        }
      })
      this.dataSource3.forEach(({ renewalCard }, index) => {
        for (const item of renewalCard) {
          const { cardStatus } = item
          if (cardStatus === 'A') {
            this.setSubmitUnfinished(params)
          }
        }
      })
    },
    async handleSubmit() {
      let params = {
        id: this.id,
        refundPrice: this.refundPrice,
        refundReason: this.refundReason,
        continuityScore: this.continuityScore,
        continuityReason: this.continuityReason,
        totalScore: this.pageTotal,
        rewardPrice: this.bonus,
        realPrice: this.realBonus,
        scoreState: 'C', // 默认完成，从上往下，一旦有未完成条件，则设置为'B'
        scoreData: {}
      }
      this.filterRenew(params)
      this.filterEvaluate(params)

      console.log(`params `, params)
      let res = await saveAchClassScore(params)
      this.$message.success('保存成功')
      this.$router.back()
    },
    handlePrint() {
      html2canvas(this.$refs.printHtml, {
        useCORS: true,
        scale: 2,
        dpi: 150
      })
        .then(canvas => {
          const printable = canvas.toDataURL()
          printJs({ printable, type: 'image' })
        })
        .catch(err => console.log(err))
    },
    // 评分结果确认
    async handleTotalConfirm() {
      let params = {
        id: this.id
      }
      let res = await confirmAchClassScore(params)
      this.$message.success('确认成功')
      this.$router.back()
    }
  }
}
</script>

<style type="text/less" lang="less" scoped>
@import '~@/assets/style/index';

/*/deep/ .ant-table-tbody > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td {*/
/*background-color: #FFF !important;*/
/*}*/

.required:before {
  display: inline-block;
  margin-right: 0.04rem;
  color: #f5222d;
  font-size: 0.14rem;
  font-family: SimSun, sans-serif;
  line-height: 1;
  content: '*';
}

.title {
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  width: 100%;

  &:before {
    display: block;
    content: '';
    width: 4px;
    height: 22px;
    background: @theme-colorNew;
    margin-right: 5px;
  }
}

.head {
  display: flex;
  align-items: center;
  height: 45px;
  padding: 0 5px;
  margin-left: -1px;
  border-left: 1px solid #e8e8e8;
}

.head-item:extend(.head) {
  width: 140px;
}

.head-item-limit:extend(.head) {
  min-width: 140px;
  max-width: 600px;
}

.head-item-lg:extend(.head) {
  width: 500px;
}

.table-header-cell {
  align-self: stretch;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  margin-left: -1px;
  border-left: 1px solid #e8e8e8;
  height: 100%;
  width: 120px;
}

.table-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 0 -1px -1px;
  padding: 12px 5px;
  border-left: 1px solid #e8e8e8;
  border-bottom: 1px solid #e8e8e8;
  width: 120px;
}

.table-cell-y {
  display: flex;
  justify-content: center;
  align-items: center;
  // padding: 0px 5px;
  height: 56px;
  border-bottom: 1px solid #e8e8e8;
}

div .table-cell-y:last-child {
  border-bottom: 0px;
}

.row {
  display: flex;

  /*&:hover > .cell {*/
  /*background-color: #e5e5e5 !important;*/
  /*}*/
}

.row-vertical {
  display: flex;
  flex-wrap: wrap;

  /*&:hover > .cell {*/
  /*background-color: #e5e5e5 !important;*/
  /*}*/
}

.cell {
  display: flex;
  align-items: center;
  padding: 12px 5px;
  margin: 0 0 -1px -1px;
  border-left: 1px solid #e8e8e8;
  border-bottom: 1px solid #e8e8e8;
}

.cell-vertical {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 12px 5px;
  margin: 0 0 -1px -1px;
  border-left: 1px solid #e8e8e8;
  border-bottom: 1px solid #e8e8e8;
}

.ellipsis {
  .ellipsis();
}

.score-wrapper {
  .score-title {
    font-size: 16px;
    font-weight: bold;
  }
}

.score-text {
  font-weight: bold;
  font-size: 16rpx;
}

.final-data {
  font-size: 28px;
  font-weight: bold;
}
</style>
