<template>
  <div ref="elementAll" style="height:calc(100vh - 84px)">
    <div ref="elementSearch">
      <a-card :bordered="false" style="margin: 20px 0 ;">
        <search-com-pro ref="searchComPro" :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"></search-com-pro>
      </a-card>
    </div>

    <a-card :bordered="false">
      <div ref="elementBtn" class="btn-wrapper mt10 mb20">
        <perm-box perm="student:info:view" style="margin-left: 15px;">
          <span class="selectBtn">
            <a-button :disabled="showRowkeys" @click.native="handledistribution('adviser')">批量修改顾问</a-button>
            <span v-if="showRowkeys && this.type == 'adviser'">
              <span @click="handleRight" class="checkIcon check">
                确定
              </span>
              <span @click="handleClose" class="checkIcon close">
                取消
              </span>
            </span>
          </span>
        </perm-box>
        <perm-box perm="student:card:active-hand" style="margin-left: 15px;">
          <span class="selectBtn">
            <a-button :disabled="showRowkeys" @click.native="handledistribution('active')">批量手工激活</a-button>
            <span v-if="showRowkeys && this.type == 'active'">
              <span @click="handleRight" class="checkIcon check">
                确定
              </span>
              <span @click="handleClose" class="checkIcon close">
                取消
              </span>
            </span>
          </span>
        </perm-box>
        <perm-box perm="student:card:frozen" style="margin-left: 15px;">
          <span class="selectBtn">
            <a-button :disabled="showRowkeys" @click.native="handledistribution('frozen')">批量还原未使用</a-button>
            <span v-if="showRowkeys && this.type == 'frozen'">
              <span @click="handleRight" class="checkIcon check">
                确定
              </span>
              <span @click="handleClose" class="checkIcon close">
                取消
              </span>
            </span>
          </span>
        </perm-box>
        <perm-box perm="student:card:graduation" style="margin-left: 15px;">
          <span class="selectBtn">
            <a-button :disabled="showRowkeys" @click.native="handledistribution('complete')">批量结业</a-button>
            <span v-if="showRowkeys && this.type == 'complete'">
              <span @click="handleRight" class="checkIcon check">
                确定
              </span>
              <span @click="handleClose" class="checkIcon close">
                取消
              </span>
            </span>
          </span>
        </perm-box>
        <perm-box perm="student:card:save-remark" style="margin-left: 15px;">
          <span class="selectBtn">
            <a-button :disabled="showRowkeys" @click.native="handledistribution('remark')">备注</a-button>
            <span v-if="showRowkeys && this.type == 'remark'">
              <span @click="handleRight" class="checkIcon check">
                确定
              </span>
              <span @click="handleClose" class="checkIcon close">
                取消
              </span>
            </span>
          </span>
        </perm-box>
      </div>
      <perm-box perm="student:card:view">
        <s-table
          :showSlider="true"
          ref="table"
          :autoLoad='false'
          :locale="locale"
          :columns="sc_solumns"
          :rowSelection="showRowkeys ? rowSelection : undefined"
          :scroll="{ x: true }"
          :data="sc_loadData"
          rowKey="id"
        >
          <div slot="usedCount" slot-scope="text, record">
            <template v-if="!record.usedCount">
              <span :style="{ padding: '0px 5px' }">{{ record.usedCount }}</span>
            </template>
            <template v-else>
              <perm-box perm="student:signinlog:view" :text="`${record.usedCount}`">
                <a href="#" @click="openSignInLog(record)">{{ record.usedCount }}</a>
              </perm-box>
            </template>
            <span>/</span>
            <perm-box perm="student:card:changenum" :text="_handleUsedCount(record)">
              <a href="#" @click="onEditStuCardCount(record)" v-if="record.status !== 'D'">{{ record.totalCount === 0 ? '不限' : record.totalCount }}</a>
              <span v-else>{{ record.totalCount === 0 ? '不限' : record.totalCount }}</span>
            </perm-box>
          </div>

          <div slot="adviserName" slot-scope="text, record">
            <perm-box perm="student:info:view">
              <a href="#" @click="changeAdviser(record, 'all')">{{ record.adviserName ? record.adviserName : '分配' }}</a>
            </perm-box>
          </div>

          <span slot="stuName" slot-scope="text, record">
            <perm-box :text="record.stuName" perm="student:info:view">
              <router-link :to="{ path: `/reception/studentInfo/${record.stuId}` }">{{ record.stuName }}</router-link>
            </perm-box>
          </span>
          <span slot="className" slot-scope="text, record">
            <span :title="record.className">
              <perm-box :text="record.className" perm="education:class:view">
                <router-link
                  v-if="record.className"
                  :to="
                    record.typeId === 'C'
                      ? { path: `/reception/personal/classInfo/${record.classId}` }
                      : { path: `/reception/class/classInfo/${record.classId}` }
                  "
                  >{{ record.className }}</router-link
                >
              </perm-box>
            </span>
          </span>
          <span slot="stuCardNo" slot-scope="text, record" style="display: inline-flex; width: 100%;align-items: center;">
            <!-- <a-popover title="备注" @visibleChange="handleHoverChange(record.id)" placement="right"> -->
            <!-- <template slot="content">
              <div class="mb10">卡备注信息：{{ record.remark || '无' }}</div>
              <table>
                <tr>
                  <td>添加时间</td>
                  <td>备注</td>
                  <td>操作</td>
                </tr>
                <template v-if="remarkList.length">
                  <tr v-for="(item, index) in remarkList" :key="index">
                    <td>{{ item.createDate }}</td>
                    <td>{{ item.stuCardRemark }}</td>
                    <td>
                      <a href="#" @click="editRemark(item)">修改 </a>
                      <a href="#" class="ml10" @click="deleteRemark(item)">删除</a>
                    </td>
                  </tr>
                </template>
              </table>
            </template> -->
            <a-icon
              v-if="handlePermBox('student:card:jy_remark') && record.cardRemarkNum && record.cardRemarkNum > 0"
              type="info-circle"
              style="color:#1BA97B;margin-right: 2px;"
            />
            <a @click="handleHoverChange(record, 1)">{{ text }}</a>
            <!-- </a-popover> -->
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
            <template v-else-if="record.status === 'D' || record.status === 'E' || record.status === 'F'"></template>
            <template v-else>
              <span style="color:red">{{ (record.paidPrice - record.totalPrice) | fixTofloat }}</span>
            </template>
          </span>
          <span slot="createDate" slot-scope="text, record">
            <perm-box :text="handleDate(text)" perm="student:card:modifytime">
              <a href="#" @click="changeEndData($event, record)">{{ handleDate(text) }}</a>
              <a-icon type="info-circle" @click="showStuCardModifyRecord(record)" />
            </perm-box>
          </span>
          <span slot="startDate" slot-scope="text">{{ handleDate(text) }}</span>
          <span slot="endDate" slot-scope="text">{{ handleEndDate(text) }}</span>
          <span slot="action" slot-scope="text, record">
            <perm-box perm="student:info:cardchange" v-if="record.status === 'A' || record.status === 'B' || record.status === 'C'">
              <router-link :to="{ path: '/reception/carryOver', query: { stuId: record.stuId } }">结转</router-link>
            </perm-box>
            <!-- <perm-box perm="student:card:active" v-if="(record.status === 'A' || record.status === 'C') && record.payoff">
              <a href="#" @click="reActiveCardBtn(record, 'active')">激活</a>
            </perm-box>
            <perm-box perm="student:card:frozen" v-if="record.status === 'B' && !record.classId">
              <a href="#" @click="reActiveCardBtn(record, 'frozen')">还原</a>
            </perm-box> -->
            <!-- <perm-box perm="student:card:graduation" v-if="(record.status === 'A' || record.status === 'B' || record.status === 'C') && record.payoff">
              <a href="#" @click="graduationCardBtn(record)">结业</a>
            </perm-box> -->
            <perm-box perm="student:card:active" v-if="record.status === 'E'">
              <a href="#" @click="activeCardBtn(record)">激活</a>
            </perm-box>
            <perm-box perm="student:card:refund-all" v-if="record.status === 'A' || record.status === 'B' || record.status === 'C'">
              <a href="#" @click="openAllDrawbackModal(record)">退卡</a>
            </perm-box>
<!--            <perm-box perm="student:card:stop" v-if="record.status === 'B'">-->
<!--              <a href="#" @click="stopCardBtn(record)">停卡</a>-->
<!--            </perm-box>-->
            <perm-box perm="student:leave:save" v-if="record.status === 'B'">
              <a href="#" @click="addLeave(record)">停卡</a>
            </perm-box>
            <perm-box perm="student:card:change-class" v-if="record.classId && (record.status === 'A' || record.status === 'B' || record.status === 'C')">
              <a href="#" @click="openDrawbackModal(record, 'returnInClass')">转班</a>
            </perm-box>
            <perm-box perm="student:info:paid">
              <router-link
                :to="{ path: `/reception/stuPayment/${record.id}_${record.stuId}` }"
                v-if="!record.payoff && (record.status === 'A' || record.status === 'B')"
                >补缴</router-link
              >
            </perm-box>
            <!-- <perm-box perm="student:card:save">
              <a href="#" @click="remark(record)">备注</a>
            </perm-box> -->
            <perm-box perm="student:card:del">
              <a href="#" @click="delCardBtn(record)">删除</a>
            </perm-box>
          </span>
        </s-table>
      </perm-box>
      <SignInRecord ref="signInRecord"></SignInRecord>
      <StuCardActive ref="cardActive" @refresh="_refreshTable" :record="recordInfo"></StuCardActive>
      <StuCardEndDate ref="cardEndDate" @refresh="_refreshTable" :record="recordInfo"></StuCardEndDate>
      <StuCardEditCardCount ref="stuCardEditCardCount" @refresh="_refreshTable" :record="recordInfo"></StuCardEditCardCount>
      <a-modal
        :maskClosable="$store.state.modalMaskClickEnable"
        :title="titleChangeClass"
        :visible="visibleClass"
        @ok="submitChangeClass"
        :confirmLoading="confirmChangeLoading"
        @cancel="handleClassCancel"
      >
        <a-form :form="form">
          <a-form-item v-bind="defaultLayout" label="班级名称" v-if="modalType === 'change'">
            <a-select :allowClear="true" v-decorator="['classId']" placeholder="请选择班级">
              <a-select-option :allowClear="true" v-for="(item, index) in classIdArr" :key="index" :value="item.classId">{{ item.className }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item :style="{ marginBottom: '0px' }" v-bind="defaultLayout" label="卡余额">
            <p>{{ stuInfo.paidPrice }}</p>
          </a-form-item>
          <a-form-item v-bind="defaultLayout" label="扣除金额">
            <a-input
              @change="handlePriceChange"
              placeholder="请输入金额"
              v-decorator="[
                'price',
                {
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      type: 'number',
                      transform(value) {
                        if (value) {
                          return Number(value)
                        }
                      },
                      message: '请输入正确的金额'
                    }
                  ]
                }
              ]"
            />
          </a-form-item>
          <a-form-item :style="{ marginBottom: '5px' }" v-bind="defaultLayout" label="剩余余额">
            <p>{{ banlance === 'init' ? stuInfo.paidPrice : banlance }}</p>
          </a-form-item>
          <a-form-item v-bind="defaultLayout" label="备注">
            <a-textarea
              style="width: 100%;"
              placeholder="请输入备注信息"
              :rows="4"
              v-decorator="['logRemark', { rules: [{ required: true, message: '请输入备注信息' }] }]"
            />
          </a-form-item>
          <a-row>
            <a-col :offset="8" :span="12">
              <div>
                <UploadSth btnText="附件上传" ref="uploadSth" :required="true" filePath="reason"></UploadSth>
              </div>
            </a-col>
          </a-row>
        </a-form>
      </a-modal>
      <StudentInfoDrawback ref="drawback" @refund="_refreshTable" :record="drawbackRecord" :type="drawbackType"></StudentInfoDrawback>
      <StudentCardDrawback ref="alldrawback" @refund="_refreshTable" :record="drawbackRecord" :staffStateOptions="staffStateOptions"></StudentCardDrawback>
    </a-card>
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :destroyOnClose="true"
      :width="600"
      title="停卡"
      @ok="stopCardSubmit"
      @cancel="stopCardCancel"
      v-model="stopCardVisible"
    >
      <div class="stopCard_wrapper">
        <a-form :form="formStop">
          <a-form-item v-bind="{ labelCol: { span: 6 }, wrapperCol: { span: 16 } }" label="备注">
            <a-textarea
              style="width: 100%;"
              placeholder="请输入备注信息"
              :rows="4"
              v-decorator="['logRemark', { rules: [{ required: true, message: '请输入备注信息' }] }]"
            />
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :destroyOnClose="true"
      :width="600"
      title="备注"
      @ok="remarkSubmit"
      @cancel="remarkCancel"
      :zIndex="9999999"
      v-model="remarkPop"
    >
      <div style="display:flex;align-items:center;margin-bottom: 10px;">
        类型：
        <a-radio-group v-model="remarkType" :disabled="remarkTitle == '修改备注'">
          <a-radio value="A">前台</a-radio>
          <a-radio value="B">教研</a-radio>
        </a-radio-group>
      </div>
      <div style="display:flex;align-items:center;">
        {{ remarkTitle }}：
        <a-textarea v-model="remarks" style="width:80%;" :auto-size="{ minRows: 3, maxRows: 5 }" />
      </div>
      <!-- <a-divider></a-divider>
      <table>
        <tr>
          <td>添加时间</td>
          <td>备注</td>
        </tr>
        <template v-if="remarkList.length">
          <tr v-for="(item, index) in remarkList" :key="index">
            <td>{{ item.createDate }}</td>
            <td>{{ item.stuCardRemark }}</td>
          </tr>
        </template>
      </table>

      <div v-if="!remarkList.length" style="padding:40px 0;text-align:center;color:#999;border:1px solid #333;border-top:none;">暂无数据</div> -->
    </a-modal>
    <a-modal :destroyOnClose="true" :width="600" title="备注" :footer="null" v-model="remarkInfoVisual">
      <div>
        <!-- getRemarkList -->
        <div class="mb20" style="display: flex; align-items: center; justify-content: space-between;">
          <div>卡备注信息：{{ remarkInfo || '无' }}</div>
          <a-button type="primary" @click="editRemark()">新增</a-button>
        </div>
        <table>
          <tr>
            <td>添加时间</td>
            <td>类型</td>
            <td>备注</td>
            <td>操作</td>
          </tr>
          <template v-if="remarkList.length">
            <tr v-for="(item, index) in remarkList" :key="index">
              <td>{{ item.updateDate }}</td>
              <td>{{ item.remarkType === 'B' ? '教研' : '前台' }}</td>
              <td>{{ item.stuCardRemark }}</td>
              <td>
                <a href="#" @click="editRemark(item)">修改 </a>
                <perm-box perm="student:card:del-remark">
                  <a href="#" @click="deleteRemark(item)">删除</a>
                </perm-box>
              </td>
            </tr>
          </template>
        </table>
      </div>
    </a-modal>
    <i-modal ref="modal" :multiple="false" :userType="userType" @ok="imodalOk" @close="imodalClose" @getBackData="getBackData"></i-modal>
    <StuCardModifyRecord ref="stuCardModifyRecord" :cardId="stuCardModifyRecordId" />
    <!--学员请假-->
    <StuLeaveAddEdit @refresh="refreshStuLeave" :stuId="stuId" title="请假申请" ref="stuLeaveAddEdit"></StuLeaveAddEdit>
  </div>
</template>

<script>
import Vue from 'vue'
import moment from 'moment'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { listEduDance, listEduType } from '@/api/common'
import { insertRemark, allCardRemark, deleteRemark, updateRemark } from '@/api/student'
import { STable, IModal, SearchComPro } from '@/components'
import PermBox from '@/components/PermBox'
import SignInRecord from '@/components/SignInRecord'
import StuCardEndDate from './modules/StuCardEndDate.vue'
import StuCardActive from './modules/StuCardActive.vue'
import StuCardEditCardCount from './modules/StuCardEditCardCount.vue'
import StuCardModifyRecord from './modules/stuCardModifyRecord.vue'
import {
  pageStudentCard,
  removeStudentCard,
  activeStuCardById,
  getStuCardInfo,
  frozenStuCardById,
  graduationStuCardById,
  stopStuCardById,
  changeAdviser
} from '@/api/recep'
import { refundClassStatus } from '@/api/education'
import UploadSth from '@/components/UploadSth'
import { getSchoolList } from '@/api/education/card'
import StudentInfoDrawback from '@/views/reception/modules/StudentInfoDrawback'
import StudentCardDrawback from '@/views/reception/modules/StudentCardDrawback'
import StuLeaveAddEdit from './modules/StuLeaveAddEdit'
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
    fixed: 'left',
    width: 100
  },
  {
    title: '学员姓名',
    dataIndex: 'stuName',
    scopedSlots: { customRender: 'stuName' },
    fixed: 'left',
    width: 120
  },
  {
    title: '手机号码',
    dataIndex: 'stuPhone',
    fixed: 'left',
    width: 100
  },
  {
    title: '上课分馆',
    dataIndex: 'deptName'
  },
  {
    title: '卡种名称',
    dataIndex: 'cardName',
    width: 170
  },
  {
    title: '类型',
    dataIndex: 'typeName',
    width: 100
  },
  {
    title: '舞种',
    dataIndex: 'danceName',
    width: 70
  },
  {
    title: '班级',
    dataIndex: 'className',
    scopedSlots: { customRender: 'className' },
    width: 120,
    ellipsis: true
  },
  {
    title: '办卡日期',
    dataIndex: 'createDate',
    scopedSlots: { customRender: 'createDate' },
    width: 80
  },
  {
    title: '办卡分馆',
    dataIndex: 'createDeptName'
  },
  {
    title: '激活时间',
    dataIndex: 'startDate',
    scopedSlots: {
      customRender: 'startDate'
    },
    width: 80
  },
  {
    title: '有效期截止',
    dataIndex: 'endDate',
    scopedSlots: { customRender: 'endDate' },
    width: 150
  },
  {
    title: '使用/总次数',
    scopedSlots: {
      customRender: 'usedCount'
    }
  },
  {
    title: '实收/应收/原价',
    dataIndex: 'totalPrice',
    scopedSlots: { customRender: 'totalPrice' },
    width: 190
  },
  {
    title: '是否缴清',
    dataIndex: 'payoff',
    scopedSlots: { customRender: 'payoff' }
  },
  {
    title: '卡状态',
    dataIndex: 'status',
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
    },
    width: 80
  },
  {
    title: '卡属性',
    dataIndex: 'ctype',
    customRender: (text, record) => {
      return text === 'A' ? '正常' : text === 'B' ? '赠卡' : text === 'C' ? '老卡' : ''
    },
    width: 80
  },
  {
    title: '顾问',
    dataIndex: 'adviserName',
    scopedSlots: { customRender: 'adviserName' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
    fixed: 'right',
    width: 140
  }
]

export default {
  name: 'stuCards',
  components: {
    StuCardModifyRecord,
    SearchComPro,
    StuCardActive,
    StuCardEditCardCount,
    SignInRecord,
    StuCardEndDate,
    STable,
    PermBox,
    UploadSth,
    StudentInfoDrawback,
    StudentCardDrawback,
    IModal,
    StuLeaveAddEdit
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRowKeys = selectedRowKeys
          this.selectedRows = selectedRows
        },
        getCheckboxProps: record => ({
          props: {
            // disabled: this.allow(record)
            disabled: record._disabled || false
          }
        })
      }
    }
  },
  data() {
    return {
      isReset:false,
      //学员卡相关日期修改存储日志
      stuCardModifyRecordId: '',
      height: 0, //滚动条高度
      remarkInfoMation: {},
      remarkInfo: '',
      remarkInfoVisual: false,
      showRowkeys: false,
      selectedRowKeys: [],
      selectedRows: [],
      stopCardVisible: false,
      recordInfo: {},
      sc_solumns,
      defaultLayout,
      stuCardInfo: {},
      searchParams: [
        {
          type: 'text',
          show: true,
          key: 'stuCardNo',
          label: '卡号',
          placeholder: '请输入卡号',
          autoComplete: true
        },
        {
          type: 'text',
          show: true,
          key: 'stuInfo',
          label: '学员信息',
          placeholder: '学员姓名/手机号码',
          autoComplete: true
        },
        {
          type: 'select', //动态select框
          key: 'typeId',
          show: true,
          label: '类型',
          placeholder: '请选择类型',
          apiOption: {
            api: listEduType, // promise类型的接口
            string: 'name',
            value: 'id'
          }
        },
        {
          type: 'select', //动态select框
          key: 'danceId',
          show: true,
          label: '舞种',
          placeholder: '请选择舞种',
          apiOption: {
            api: listEduDance, // promise类型的接口
            string: 'name',
            value: 'id'
          }
        },
        {
          type: 'dateSlot',
          show: true,
          key: 'Date',
          selectKey: 'dateType',
          label: '日期：',
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD',
          lg: 0,
          md: 0,
          sm: 0,
          staticArr: [
            {
              string: '办卡',
              value: 'A'
            },
            {
              string: '开卡',
              value: 'B'
            },
            {
              string: '过期',
              value: 'C'
            },
            {
              string: '停课',
              value: 'D'
            },
            {
              string: '结业',
              value: 'E'
            },
            {
              string: '退卡',
              value: 'F'
            }
          ]
        },
        {
          type: 'select',
          key: 'cardState',
          label: '卡状态',
          show: true,
          mode: 'multiple',
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
          type: 'treeSelect',
          isShow: !!!this.$store.getters.school_id,
          key: 'school_id',
          label: '选择分馆',
          placeholder: '请选择分馆',
          expandAll: true,
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
          key: 'stuCardName',
          label: '卡种名称',
          placeholder: '请输入卡种名称'
        },
        {
          type: 'chooseModal',
          key: 'cardName', // 当chooseModal类型下 key为cardName时将调用另外的弹出组件
          label: '选择卡种',
          placeholder: '请选择卡种',
          multiple: true
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
          type: 'text',
          key: 'pricePreferentialRatio',
          label: '优惠金额',
          placeholder: '输入1到100',
          addonBefore: '超过',
          addonAfter: '%'
        },
        {
          type: 'text',
          key: 'countPreferentialRatio',
          label: '赠送次数',
          placeholder: '输入1到100',
          addonBefore: '超过',
          addonAfter: '%'
        },
        {
          type: 'select',
          key: 'stuType',
          label: '卡属性',
          placeholder: '请选择卡属性',
          staticArr: [
            {
              string: '正常',
              value: 'A'
            },
            {
              string: '赠卡',
              value: 'B'
            },
            {
              string: '老卡',
              value: 'C'
            }
          ]
        },
        {
          type: 'arrText',
          key: 'usedCount',
          label: '消耗次数',
          placeholder: '输入已使用次数',
          addonAfter: '次',
          selectKey: 'usedCountType',
          arrPlaceholder: '请选择',
          staticArr: [
            {
              string: '大于',
              value: 'A'
            },
            {
              string: '等于',
              value: 'B'
            },
            {
              string: '小于',
              value: 'C'
            }
          ]
        },
        {
          type: 'arrText',
          key: 'surplusCount',
          selectKey: 'surplusCountType',
          arrPlaceholder: '输入剩余次数',
          label: '剩余次数',
          placeholder: '请选择',
          addonAfter: '次',
          staticArr: [
            {
              string: '大于',
              value: 'A'
            },
            {
              string: '等于',
              value: 'B'
            },
            {
              string: '小于',
              value: 'C'
            }
          ]
        },
        {
          type: 'arrText',
          key: 'surplusDate',
          label: '剩余天数',
          placeholder: '输入剩余天数',
          addonAfter: '天',
          selectKey: 'surplusDateType',
          arrPlaceholder: '请选择',
          staticArr: [
            {
              string: '大于',
              value: 'A'
            },
            {
              string: '等于',
              value: 'B'
            },
            {
              string: '小于',
              value: 'C'
            }
          ]
        },
        {
          type: 'text',
          key: 'adviserName',
          label: '顾问',
          placeholder: '顾问名称'
        },
        {
          type: 'select',
          key: 'masterState',
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
        },
        {
          type: 'text',
          key: 'className',
          label: '班级名称',
          placeholder: '请输入'
        },
        {
          type: 'arrText',
          key: 'totalCount',
          label: '总次数',
          placeholder: '请输入总次数',
          addonAfter: '次',
          selectKey: 'totalCountType',
          arrPlaceholder: '请选择',
          staticArr: [
            {
              string: '大于',
              value: 'A'
            },
            {
              string: '等于',
              value: 'B'
            },
            {
              string: '小于',
              value: 'C'
            }
          ]
        }
        // {
        //   type: 'text',
        //   key: 'month',
        //   label: '未上课学员月份',
        //   placeholder: '输入1到12',
        //   addonAfter: '月'
        // }
      ],
      titleChangeClass: '',
      confirmChangeLoading: false,
      modalType: '',
      banlance: 'init',
      drawbackRecord: {},
      drawbackType: 'returnInClass',
      stuInfo: {},
      visibleClass: false,
      queryParam: {},
      routeQuery: this.$route.query,
      locale: { emptyText: <div style='font-size: 30px;padding: 100px 0;'>请选择相关筛选条件后，再查询学员信息哦</div> },
      sc_loadData: parameter => {
        if (this.routeQuery) {
          this.queryParam = Object.assign(this.queryParam, this.routeQuery)
          this.routeQuery = null
        }
        if (Array.isArray(this.queryParam.cardState)) this.queryParam.cardState = this.queryParam.cardState.join(',')
        return pageStudentCard(Object.assign(parameter, this.queryParam)).then(res => {
          if(!this.autoLoad&&this.isReset)return {data:[]}
          this.seleteList = res.data
          return res
        })
      },
      seleteList: [],

      stuCardId: '',
      userType: 'all',
      remarkPop: false,
      remarkTitle: '添加备注',
      remarkType: 'A',
      remarks: '',
      remarkList: [],
      cardId: null,
      staffStateOptions: [{ value: 'Y', label: '在职' }, { value: 'B', label: '离职（3个月内）' }],
      stuId:''
    }
  },
  watch: {
    visibleClass(nv) {
      if (nv) {
        this.$nextTick(() => {
          this.form.resetFields()
          this.classIdArr = []
          this.$refs.uploadSth.reset()
          this.banlance = 'init'
        })
      } else {
      }
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
    this.formStop = this.$form.createForm(this)
  },
  activated() {
    this.search()
  },
  methods: {
    refreshStuLeave() {
      this._refreshTable()
    },
    /* 学员请假 */
    addLeave(record) {
      this.stuId=record.stuId
      this.$nextTick(() => {
        this.$refs.stuLeaveAddEdit.openModal(record.stuCardNo)
        this.$nextTick(() => {
          this.$refs.stuLeaveAddEdit.resetForm()
        })
      })

    },
    search() {
      const { dateType, startDate, endDate, cardState, usedCount, surplusCount, surplusDate, masterState, totalCount } = this.$route.query
      this.searchParams.forEach(item => {
        if (item.key === 'Date') {
          item.initialValue = dateType || undefined
          item.defaultVal = startDate && endDate ? [moment(startDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD')] : undefined
        }
        if (item.key === 'cardState') {
          item.initialValue = cardState || undefined
        }
        if (item.key === 'usedCount') {
          item.initialValue = usedCount || undefined
          item.arrInitialValue = 'A'
        }
        if (item.key === 'surplusCount') {
          item.initialValue = surplusCount || undefined
          item.arrInitialValue = 'A'
        }
        if (item.key === 'surplusDate') {
          item.initialValue = surplusDate || undefined
          item.arrInitialValue = 'A'
        }
        if (item.key === 'masterState') {
          item.initialValue = masterState || undefined
        }
        if (item.key === 'totalCount') {
          item.initialValue = totalCount || undefined
          item.arrInitialValue = 'A'
        }
      })
      this.$refs.searchComPro.showAll()
      this.$refs.searchComPro.showAll()
      if(dateType|| startDate|| endDate||cardState|| usedCount|| surplusCount|| surplusDate|| masterState|| totalCount){
        this.$refs.searchComPro.reset()
      }
    },
    showStuCardModifyRecord(record) {
      this.stuCardModifyRecordId = record.id
      this.$nextTick(() => {
        this.$refs.stuCardModifyRecord.open(record.id)
      })
    },
    handlePermBox(str) {
      return this.$tools.checkPerm(str)
    },
    deleteRemark(record) {
      let _this = this
      let stuCardRemarkId = record.id
      this.$confirm({
        title: '系统提示',
        content: '确认删除该条数据吗?',
        okText: '确认',
        zIndex: 9999999,
        cancelText: '取消',
        onOk() {
          deleteRemark({ stuCardRemarkId }).then(res => {
            if (res.code == 200) {
              _this.$notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
              _this.handleHoverChange(_this.remarkInfoMation)
            } else {
              _this.$notification['error']({
                message: '系统通知',
                description: res.msg
              })
            }
          })
        }
      })
    },
    editRemark(record) {
      this.remarkPop = true
      if (record) {
        this.remarkTitle = '修改备注'
        this.cardId = record.id
        this.remarkType = record.remarkType || 'A'
        this.remarks = record.stuCardRemark
      } else {
        this.remarkTitle = '添加备注'
        this.cardId = this.remarkInfoMation.id
        this.remarkType = 'A'
        this.remarks = ''
      }
    },
    //校验是否有勾选
    examine() {
      return new Promise((resolve, reject) => {
        if (this.selectedRowKeys.length === 0) {
          this.$notification['error']({
            message: '系统通知',
            description: '请先进行勾选！'
          })
        } else {
          resolve()
        }
      })
    },
    handleRight() {
      this.examine().then(() => {
        if (this.type == 'active') {
          this.reActiveCardBtn('', 'active')
        } else if (this.type == 'frozen') {
          this.reActiveCardBtn('', 'frozen')
        } else if (this.type == 'complete') {
          this.graduationCardBtn()
        } else if (this.type == 'remark') {
          this.remark()
        } else {
          this.changeAdviser('', 'all')
        }
      })
    },
    handleClose() {
      this.showRowkeys = false
      this.selectedRowKeys = []
      this.selectedRows = []
      this.type = ''
    },
    allow(record) {
      if (this.type == 'active') {
        return !(record.status === 'A' || record.status === 'C') || !record.payoff
      }
      if (this.type == 'frozen') {
        return record.status !== 'B' || record.classId
      }
      if (this.type == 'complete') {
        return !(record.status === 'A' || record.status === 'B' || record.status === 'C') || !record.payoff
      }
      return false
    },
    handledistribution(type) {
      this.type = type
      this.seleteList.forEach((record, index) => {
        if (this.type == 'active') {
          this.$set(this.seleteList, index, Object.assign(record, { _disabled: !(record.status === 'A' || record.status === 'C') || !record.payoff }))
        } else if (this.type == 'frozen') {
          this.$set(this.seleteList, index, Object.assign(record, { _disabled: !!(record.status !== 'B' || record.classId) }))
        } else if (this.type == 'complete') {
          this.$set(
            this.seleteList,
            index,
            Object.assign(record, { _disabled: !(record.status === 'A' || record.status === 'B' || record.status === 'C') || !record.payoff })
          )
        } else {
          this.$set(this.seleteList, index, Object.assign(record, { _disabled: false }))
        }
      })

      this.showRowkeys = true
    },
    remarkCancel() {
      this.remarkPop = false
      this.remarkType = 'A'
      this.remarks = ''
      // this.remarkList = []
    },
    remarkSubmit() {
      if (!this.remarks) {
        return this.$notification['error']({
          message: '系统通知',
          description: '请先填写备注'
        })
      }
      if (this.remarks.length > 200) {
        return this.$notification['error']({
          message: '系统通知',
          description: '备注不能超过两百字'
        })
      }
      if (this.remarkTitle == '修改备注') {
        updateRemark({ stuCardRemarkId: this.cardId, remark: this.remarks, remarkType: this.remarkType }).then(res => {
          if (res.code === 200) {
            this.$notification['success']({
              message: '系统通知',
              description: '操作成功'
            })
            this.handleHoverChange(this.remarkInfoMation)
            this.remarkCancel()
          }
        })
      } else {
        insertRemark({ stuCardId: this.cardId, stuCardRemark: this.remarks, remarkType: this.remarkType }).then(res => {
          if (res.code === 200) {
            this.$notification['success']({
              message: '系统通知',
              description: '操作成功'
            })
            this.handleHoverChange(this.remarkInfoMation)
            this.remarkCancel()
            this.selectedRowKeys = []
            this.selectedRows = []
            this.showRowkeys = false
          }
        })
      }
    },
    //备注弹窗s
    remark(record) {
      this.cardId = this.selectedRowKeys.join(',')
      this.remarkTitle = '添加备注'
      this.remarkPop = true
    },
    handleHoverChange(record, type) {
      allCardRemark({ stuCardId: record.id }).then(res => {
        if (res.code === 200) {
          this.remarkList = res.data || []
        }
      })
      if (type) {
        this.remarkInfoMation = record
        this.remarkInfo = record.remark
        this.remarkInfoVisual = true
      }
    },
    getStuCardInfo(id) {
      return getStuCardInfo(id).then(res => {
        this.stuCardInfo = res.data
      })
    },
    openSignInLog(record) {
      this.$refs.signInRecord.openSignInLog(record)
    },
    openDrawbackModal(record, type) {
      this.drawbackRecord = record
      this.drawbackType = type
      this.$refs.drawback.showModal()
    },
    openAllDrawbackModal(record) {
      this.drawbackRecord = record
      this.$refs.alldrawback.showModal()
    },

    //changeEndData修改截止日期
    changeEndData(e, record) {
      this.recordInfo = record
      this.$refs.cardEndDate.openModal()
      this.$refs.cardEndDate.resetForm()
      this.$nextTick(() => {
        this.$refs.cardEndDate.backingData(record)
      })
    },
    handleDate(data) {
      return data ? this.$tools.tailor.getDate(data) : ''
    },
    handleEndDate(data) {
      return data
        ? moment(data)
            .subtract(1, 'seconds')
            .format('YYYY-MM-DD HH:mm')
        : ''
    },

    //激活按钮
    activeCardBtn(record) {
      this.recordInfo = record
      this.$refs.cardActive.openModal()
    },
    handlePriceChange() {
      this.$nextTick(() => {
        if (this.stuInfo.paidPrice >= this.form.getFieldValue('price')) {
          this.banlance = this.stuInfo.paidPrice - this.form.getFieldValue('price')
        } else {
          this.$notification['error']({
            message: '系统通知',
            description: '扣除余额不能大于卡余额'
          })
        }
      })
    },
    //删除按钮
    delCardBtn(record) {
      let _this = this
      let cardId = record.id
      this.$confirm({
        title: '系统提示',
        content: '确认删除该条数据吗?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          removeStudentCard(cardId).then(res => {
            _this.$notification['success']({
              message: '系统通知',
              description: '操作成功'
            })
            _this._refreshTable()
          })
        }
      })
    },
    //手工结业
    graduationCardBtn(record) {
      let _this = this
      let cardId = this.selectedRowKeys.join(',')
      let params = {
        stuCardId: cardId
      }
      this.$confirm({
        title: '系统提示',
        content: '学员卡结业,是否确定?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          _this.$nextTick().then(() => {
            graduationStuCardById(params).then(res => {
              _this.$notification['success']({
                message: '系统通知',
                description: res.msg || '操作成功'
              })
              _this.handleClose()
              _this._refreshTable()
            })
          })
        }
      })
    },

    //手工停卡
    stopCardBtn(record) {
      if (record.stuLeaveList >= 2) {
        let that = this
        this.$confirm({
          title: '温馨提示',
          content: h => <div style="color:red;">当前停卡次数已超过2次，请确认是否停卡</div>,
          onOk() {
            that.comfirmStopCardBtn(record)
          },
          onCancel() {},
          class: 'test'
        })
      } else {
        this.comfirmStopCardBtn(record)
      }
    },
    comfirmStopCardBtn(record) {
      this.stopCardVisible = true
      this.record = record
      this.$nextTick(() => {
        this.formStop.resetFields()
      })
    },
    stopCardCancel() {
      this.stopCardVisible = false
    },
    stopCardSubmit() {
      this.formStop
        .validateFields()
        .then(v => {
          let params = {
            stuCardId: this.record.id,
            remark: v.logRemark
          }
          return stopStuCardById(params)
        })
        .then(res => {
          this.$notification['success']({
            message: '系统通知',
            description: res.msg || '操作成功'
          })
          this._refreshTable()
          this.stopCardVisible = false
        })
    },
    //激活卡
    reActiveCardBtn(record, type = 'active') {
      let _this = this
      let cardId = ''
      if (record) {
        cardId = record.id
      } else {
        cardId = this.selectedRowKeys.join(',')
      }
      let params = {
        stuCardId: cardId
      }
      this.$confirm({
        title: '系统提示',
        content: type == 'active' ? '确认激活吗?' : '将已激活的学生卡改为未激活状态,并清空签到记录,是否确定?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          type == 'active'
            ? _this.$nextTick().then(() => {
                activeStuCardById(params).then(res => {
                  _this.$notification['success']({
                    message: '系统通知',
                    description: '操作成功'
                  })
                  _this._refreshTable()
                })
              })
            : _this.$nextTick().then(() => {
                frozenStuCardById(params).then(res => {
                  _this.$notification['success']({
                    message: '系统通知',
                    description: res.msg || '操作成功'
                  })
                  _this._refreshTable()
                })
              })
        }
      })
    },
    changeClassBtn(e, record, type) {
      this.modalType = type
      this.visibleClass = true
      this.stuInfo = record
      if (type === 'remove') {
        this.titleChangeClass = '退班管理'
      }
    },
    submitChangeClass() {
      let _this = this
      if (this.modalType === 'remove') {
        this.form.validateFields().then(() => {
          this.$confirm({
            title: '系统提示',
            content: '确认退班吗?',
            okText: '确认',
            cancelText: '取消',
            onOk() {
              _this.confirmChangeLoading = true
              _this.$refs.uploadSth
                .handleUpload()
                .then(res => {
                  _this.fileId = res
                  _this.removeClassApi()
                })
                .catch(err => {
                  _this.confirmChangeLoading = false
                })
            },
            onCancel() {}
          })
        })
      }
    },
    removeClassApi() {
      let formData = this.form.getFieldsValue()
      let stuCardId = this.stuInfo.id
      let params = {
        price: formData.price,
        logRemark: formData.logRemark,
        attachment: this.fileId
      }
      this.confirmChangeLoading = true
      refundClassStatus(stuCardId, params)
        .then(res => {
          if (res.code === 200) {
            this.$notification['success']({
              message: '系统通知',
              description: '已退班成功'
            })
            this._refreshTable()
            this.visibleClass = false
          }
        })
        .catch(err => {})
        .finally(() => {
          this.confirmChangeLoading = false
        })
    },
    handleClassCancel() {
      this.visibleClass = false
      this.visibleReClass = false
    },
    searchSubmit(data,isReset) {
      this.isReset=''
      if(isReset==='isReset')this.isReset=true
      if (data.cardName) delete data.cardName
      if (Object.keys(data).length === 0) {
        this.routeQuery = this.$route.query
      }
      this.queryParam = data
      if (this.queryParam.stuCardName) this.queryParam.stuCardName = encodeURI(this.queryParam.stuCardName.replace(' ',''))
      this._refreshTable()
    },
    onEditStuCardCount(record) {
      this.recordInfo = record
      this.$refs.stuCardEditCardCount.open()
      this.$refs.stuCardEditCardCount.backindData(record)
    },
    _handleUsedCount(record) {
      return `${record.totalCount === 0 ? '不限' : record.totalCount}`
    },
    _refreshTable() {
      this.handleClose()
      this.$refs.table.refresh()
    },

    //分配顾问
    changeAdviser(record, userType) {
      if (record) {
        this.stuCardId = record.id
      } else {
        this.stuCardId = this.selectedRowKeys.join(',')
      }
      this.userType = userType
      this.$refs.modal.open()
    },
    imodalOk() {},
    imodalClose() {},
    getBackData(data, type) {
      let params = {
        stuCardId: this.stuCardId,
        orgUserId: data.id
      }
      changeAdviser(params)
        .then(res => {
          if (res.code === 200) {
            this._refreshTable()
            this.$notification['success']({
              message: '系统通知',
              description: res.msg || '已成功修改顾问'
            })
          }
        })
        .catch(err => {})
    }
  }
}
</script>

<style lang="less" type="text/less" scoped>
.image_wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  .refresh {
    position: absolute;
    top: 270px;
    left: 66px;
    width: 223px;
    height: 223px;
    cursor: pointer;
  }

  .tip {
    position: absolute;
    bottom: 20px;
  }
}

// table,th,td{border:1px solid gray}
// table{border-collapse:collapse;}
// table {

//   border-color: #999!important;
// }
td {
  border: 1px solid #ddd;

  line-height: 30px;
  width: 300px;
  text-align: center;
}

// table {
//   tbody {
//     tr {
//       td {
//         border:1px solid #999;
//         // border-color: #999 !important;
//       }
//     }
//   }
// }
.checkIcon {
  margin-right: 10px;
  font-size: 14px;
  font-weight: 500;
}

.checkIcon.check {
  color: #1ba97b;
  margin-left: 6px;
}

.selectBtn {
  border: 1px solid #d9d9d9;
  vertical-align: middle;
  display: inline-block;
  height: 32px;
  line-height: 1.499;
  white-space: nowrap;
  text-align: center;
  // box-shadow: 0 2px 0 rgba(0, 0, 0, 2%);
  cursor: pointer;
  border-radius: 4px;
  overflow: hidden;

  .ant-btn {
    border: 0;
    box-shadow: none;
  }
}

.selectBtn.active {
  // background-color: #f5f5f5;
  .ant-btn {
    border: 0;
  }
}
</style>
