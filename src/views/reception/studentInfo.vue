<template>
  <div class="studentinfo-wrapper">
    <!-- align="top" -->
    <a-row :gutter="20" type="flex" justify="start">
      <a-col ref="infoRow" :xxl="18" :xl="16" :lg="14" :md="24" :sm="24" style="background:#fff;">
        <a-card :bordered="false" title="学员信息">
          <span slot="extra">
            <perm-box perm="student:info:save" v-if="studentInfo && !studentInfo.parentId">
              <a href="javascript:;" @click="addParentingCard">添加亲属号</a>
            </perm-box>
            <perm-box perm="student:info:special">
              <a href="javascript:;" @click="openSepcialCardModal">办理特殊卡</a>
            </perm-box>

            <!-- 其他编辑（修改不限制） -->
            <perm-box perm="student:info-nolimit:save">
              <a href="javascript:;" @click="handleEdit('A')">编辑</a>
            </perm-box>
            <!-- 前台编辑（只允许修改一次人群） -->
            <perm-box perm="student:info:save">
              <a href="javascript:;" @click="handleEdit('B')">编辑(前台)</a>
            </perm-box>
          </span>
          <div class="student-info-wrapper" v-if="studentInfo">
            <!-- <div class="flex"> -->
            <a-row>
              <a-col :lg="8" :md="24" :sm="24" :xs="24">
                <div class="mr20">
                  <a-row type="flex" justify="start">
                    <a-avatar
                      shape="square"
                      style="width: 160px;height: 205px;line-height: 205px;font-size: 80px;"
                      icon="user"
                      :src="studentInfo.avatar"
                      v-if="studentInfo.avatar"
                    />
                    <a-avatar v-else shape="square" style="width: 160px;height: 205px;line-height: 205px;font-size: 80px;" icon="user" />
                  </a-row>
                  <a-row v-if="handlePermBox('student:info:synchronous')" type="flex" justify="end">
                    <div class="avatar-btn">
                      <!--<a-button icon='cloud' :loading="avatarLoading" @click="uploadStuAvatar">同步人脸识别</a-button>-->
                    </div>
                  </a-row>
                </div>
              </a-col>
              <a-col :lg="16" :md="24" :sm="24" :xs="24">
                <a-row class="infoItem" type="flex" justify="space-between">
                  <a-col :lg="8" :md="12" :sm="24" :xs="24">
                    <div class="class-info">
                      <span class="info-item-label">姓名 :</span>
                      <span class="info-item-content">{{ studentInfo.stuName || '未知' }}</span>
                    </div>
                  </a-col>
                  <a-col :lg="8" :md="12" :sm="24" :xs="24">
                    <div class="class-info">
                      <span class="info-item-label">学号 :</span>
                      <span class="info-item-content">{{ studentInfo.stuNo || '无' }}</span>
                    </div>
                  </a-col>
                  <a-col :lg="8" :md="12" :sm="24" :xs="24">
                    <div class="class-info">
                      <span class="info-item-label">人群分类 :</span>
                      <span class="info-item-content">{{ studentInfo.stuType === 'A' ? '成人' : studentInfo.stuType === 'B' ? '少儿' : '未知' }}</span>
                    </div>
                  </a-col>
                  <a-col :lg="8" :md="12" :sm="24" :xs="24">
                    <div class="class-info">
                      <span class="info-item-label">电话 :</span>
                      <span class="info-item-content">{{ studentInfo.stuPhone || '无' }}</span>
                    </div>
                  </a-col>
                  <a-col :lg="8" :md="12" :sm="24" :xs="24">
                    <div class="class-info">
                      <span class="info-item-label">QQ号 :</span>
                      <span class="info-item-content">{{ studentInfo.stuQQ || '无' }}</span>
                    </div>
                  </a-col>
                  <a-col :lg="8" :md="12" :sm="24" :xs="24">
                    <div class="class-info">
                      <span class="info-item-label">微信号 :</span>
                      <span class="info-item-content">{{ studentInfo.stuWechat || '无' }}</span>
                    </div>
                  </a-col>
                  <a-col :lg="8" :md="12" :sm="24" :xs="24">
                    <div class="class-info">
                      <span class="info-item-label">身份证 :</span>
                      <span class="info-item-content">{{ studentInfo.stuIdcard || '无' }}</span>
                    </div>
                  </a-col>
                  <a-col :lg="8" :md="12" :sm="24" :xs="24">
                    <div class="class-info">
                      <span class="info-item-label">性别 :</span>
                      <span class="info-item-content" v-if="studentInfo.stuSex === 'A'">男</span>
                      <span class="info-item-content" v-if="studentInfo.stuSex === 'B'">女</span>
                      <span class="info-item-content" v-if="!studentInfo.stuSex">未知</span>
                    </div>
                  </a-col>
                  <a-col :lg="8" :md="12" :sm="24" :xs="24">
                    <div class="class-info">
                      <span class="info-item-label">省市 :</span>
                      <span class="info-item-content">{{ studentInfo.stuArea || '无' }}</span>
                    </div>
                  </a-col>
                  <a-col :lg="8" :md="12" :sm="24" :xs="24">
                    <div class="class-info">
                      <span class="info-item-label">紧急联系人 :</span>
                      <span class="info-item-content">{{ studentInfo.stuEmergency || '无' }}</span>
                    </div>
                  </a-col>
                  <a-col :lg="8" :md="12" :sm="24" :xs="24">
                    <div class="class-info">
                      <span class="info-item-label">顾问 :</span>
                      <span class="info-item-content">{{ studentInfo.adviserName || '无' }}</span>
                    </div>
                  </a-col>
                  <a-col :lg="8" :md="12" :sm="24" :xs="24">
                    <div class="class-info">
                      <span class="info-item-label">资源来源 :</span>
                      <span class="info-item-content">{{ studentInfo.finSource || studentInfo.source || '无' }}</span>
                    </div>
                  </a-col>
                  <a-col :lg="8" :md="12" :sm="24" :xs="24">
                    <div class="class-info">
                      <span class="info-item-label">备注 :</span>
                      <span class="info-item-content info-item-content-remark">{{ studentInfo.stuRemark || '无' }}</span>
                    </div>
                  </a-col>
                  <a-col :lg="8" :md="12" :sm="24" :xs="24">
                    <div class="class-info">
                      <span class="info-item-label">是否试课 :</span>
                      <span class="info-item-content">
                        {{ studentInfo.stuAudition == 'A' ? '是' : studentInfo.stuAudition == 'B' ? '否' : '' }}
                      </span>
                    </div>
                  </a-col>
                  <a-col :lg="8" :md="12" :sm="24" :xs="24"></a-col>
                  <a-col :lg="24" :md="24" :sm="24" :xs="24" v-if="studentInfo.StudentInfoList && studentInfo.StudentInfoList.length > 0">
                    <div class="class-info">
                      <span class="info-item-label">亲属号 :</span>
                      <span class="info-item-content">
                        <a-table :dataSource="studentInfo.StudentInfoList" :columns="parentingColumns" :rowKey="(record, index) => index" :pagination="false">
                          <span slot="stuName" slot-scope="text, record">
                            <router-link :to="{ path: `/reception/studentInfo/${record.id}` }">{{ record.stuName }}</router-link>
                          </span>
                          <span slot="action" slot-scope="text, record">
                            <a @click="unbindParenting(record)">解绑</a>
                          </span>
                        </a-table>
                      </span>
                    </div>
                  </a-col>
                </a-row>
              </a-col>
            </a-row>
            <!-- align="top" -->
            <!-- </div> -->
          </div>
        </a-card>
      </a-col>
      <a-col :xxl="6" :xl="8" :lg="10" :md="24" :sm="24" :style="{ height: infoHeight }">
        <a-card :bordered="false" title="快捷操作" style="height: 100%;">
          <div class="grid">
            <div class="grid-item" @click="stuApply" v-if="handlePermBox('student:leave:save')">
              <img :src="operationImg.inviteImg" />
              <span>学员报名</span>
            </div>
            <div class="grid-item" @click="addLeave" v-if="handlePermBox('student:leave:save')">
              <img :src="operationImg.inviteImg" />
              <span>学员请假</span>
            </div>
            <div class="grid-item" @click="openaddinvoice('A')" v-if="handlePermBox('finance:invoice:save')">
              <img :src="operationImg.inviteImg" />
              <span>新增开票</span>
            </div>
            <!-- <div class="grid-item" @click="openaddinvoice('B')" v-if="handlePermBox('finance:invoice:edit')">
              <img :src="operationImg.inviteImg" />
              <span>补录开票</span>
            </div> -->
            <div class="grid-item" @click="openStuCardOnLine('B')">
              <img :src="operationImg.inviteImg" />
              <span>预习课</span>
            </div>
            <div class="grid-item" @click="openStuCardOnLine('C')">
              <img :src="operationImg.inviteImg" />
              <span>资料包</span>
            </div>
            <div class="grid-item" @click="openStuCardOnLine('D')">
              <img :src="operationImg.inviteImg" />
              <span>线上邀请</span>
            </div>
            <div class="grid-item" @click="openReorderModal" v-if="handlePermBox('student:nextlog:view')">
              <img :src="operationImg.inviteImg" />
              <span>补录续卡</span>
            </div>
            <div class="grid-item" @click="openChoosePop" v-if="handlePermBox('education:class-url:student:bind')">
              <img :src="operationImg.inviteImg" />
              <span>线上试课</span>
            </div>
            <div class="grid-item" @click="bindParenting" v-if="handlePermBox('student:info:parentage')">
              <img :src="operationImg.inviteImg" />
              <span>绑定亲属</span>
            </div>
            <div class="grid-item" @click="copy" >
              <img :src="operationImg.inviteImg" />
              <span>复制档案链接</span>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <a-card :bordered="false" style="margin-top: 20px;" v-if="(stuBalance || (studentInfo && studentInfo.balance) || 0) > 0">
      <div class="student-info-wrapper" v-if="studentInfo">
        <a-row type="flex" justify="start" align="top">
          <a-col :span="16">
            <a-row class="infoItem" type="flex" justify="space-between" align="top">
              <a-col :lg="12" :md="12" :sm="24">
                <div class="class-info">
                  <span class="info-item-label">可用余额 :</span>
                  <span class="info-item-content">{{ (stuBalance || (studentInfo && studentInfo.balance) || 0) | fixTofloat }}</span>
                  <span style="margin-left: 8px;">
                    <a-icon v-if="balanceIcon" class="iconye" type="sync" @click="refreshStuBalance" />
                    <a-icon v-else class="iconye" type="sync" spin />
                  </span>
                  <perm-box perm="student:card:save">
                    <a :style="{ marginLeft: '10px' }" href="#" @click="openSepcialCardModal">办理特殊卡</a>
                  </perm-box>
                </div>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </div>
    </a-card>

    <a-card :bordered="false" style="margin-top: 20px;">
      <div class="tab-wrapper">
        <!-- :defaultActiveKey="1" -->
        <a-tabs @change="callback" :activeKey="activeKey">
          <a-tab-pane tab="卡种情况" :key="1" v-if="handlePermBox('student:card:view')">
            <StudentInfoCardList v-show="activeKey == 1 && stuId" ref="stuInfoCardList" :stuId="stuId"></StudentInfoCardList>
          </a-tab-pane>
          <!-- <a-tab-pane tab="缴费记录" :key="handlePermBox('student:card:view') ? '2' : '1'" forceRender>
            <perm-box perm="student:info:view">
              <StudentInfoAccount ref="stuAccount" :stuId="stuId"></StudentInfoAccount>
            </perm-box>
          </a-tab-pane> -->
          <a-tab-pane tab="操作日志" :key="2" forceRender>
            <perm-box perm="student:info:view">
              <OperatingRecord ref="opRecord" v-if="activeKey == 2" :stuId="stuId"></OperatingRecord>
            </perm-box>
          </a-tab-pane>
          <a-tab-pane tab="学员请假" :key="3" forceRender>
            <perm-box perm="student:leave:view">
              <StuLeave :stuId="stuId" v-if="activeKey == 3"></StuLeave>
            </perm-box>
          </a-tab-pane>
          <a-tab-pane tab="预习课记录" :key="4" forceRender>
            <StuCardOnLineTable
              v-if="activeKey == 4"
              ref="stuCardOnLineTableB"
              :queryParams="{ invitationType: 'B', urlState: 'Y', stuId: $route.params.id }"
            ></StuCardOnLineTable>
          </a-tab-pane>
          <a-tab-pane tab="资料包记录" :key="5" forceRender>
            <StuCardOnLineTable
              v-if="activeKey == 5"
              ref="stuCardOnLineTableC"
              :queryParams="{ invitationType: 'C', urlState: 'Y', stuId: $route.params.id }"
            ></StuCardOnLineTable>
          </a-tab-pane>
          <a-tab-pane tab="线上邀请码" :key="6" forceRender>
            <StuCardOnLineTable
              v-if="activeKey == 6"
              ref="stuCardOnLineTableD"
              :queryParams="{ invitationType: 'D', urlState: 'Y', stuId: $route.params.id }"
            ></StuCardOnLineTable>
          </a-tab-pane>
          <a-tab-pane tab="开票列表" :key="7" forceRender>
            <perm-box perm="finance:invoice:view">
              <InvoiceList v-if="activeKey == 7" :stuId="stuId" :stuPhone="studentInfo.stuPhone" @openaddinvoice="openaddinvoice" ref="InvoiceList" @editInvoice="editInvoice"></InvoiceList>
            </perm-box>
          </a-tab-pane>
          <a-tab-pane tab="线上试课" :key="8" forceRender>
            <StuCardOnLineTableFormate
              v-if="activeKey == 8"
              ref="stuCardOnLineTableD"
              :queryParams="{ studentInfoId: $route.params.id }"
            ></StuCardOnLineTableFormate>
          </a-tab-pane>
          <a-tab-pane tab="操作日志（旧）" :key="9" forceRender>
            <perm-box perm="student:info:view">
              <OperatingRecordOld ref="opRecord" v-if="activeKey == 9" :loadData="studentChangeLog" :stuId="stuId"></OperatingRecordOld>
            </perm-box>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card>
    <!--
       * @param school_id      分馆ID
         * @param studentId      学员ID
         * @param danceId        舞种
         * @param typeId         类型
         * @param classTypeId    班型
         * @param price          金额
         * @param validDay     有效期
         * @param availableCount 可用次数
    -->
    <!-- 特殊卡 -->
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      title="办理特殊卡"
      width="80%"
      :visible="sepcialCardModal"
      :confirmLoading="sepcialCardModalLoading"
      @ok="saveSecpialCard"
      @cancel="cancelSecpialCard"
    >
      <a-form :form="sepcialCardForm">
        <a-row>
          <a-col :xxl="12" :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
            <a-form-item v-bind="defaultLayout" label="可用余额" v-if="(stuBalance || (studentInfo && studentInfo.balance) || 0) > 0">
              <span class="info-item-content">{{ (stuBalance || (studentInfo && studentInfo.balance) || 0) | fixTofloat }}</span>
              <span style="margin-left: 8px;">
                <a-icon v-if="balanceIcon" class="iconye" type="sync" @click="refreshStuBalance" />
                <a-icon v-else class="iconye" type="sync" spin />
              </span>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :xxl="12" :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
            <a-form-item v-bind="defaultLayout" label="舞种">
              <a-select :allowClear="true" placeholder="请选择舞种" v-decorator="['danceId', { rules: [{ required: true, message: '请选择舞种' }] }]">
                <a-select-option v-for="(dance, danceIdx) in danceList" :value="dance.id" :key="danceIdx">
                  {{ dance.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xxl="12" :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
            <a-form-item v-bind="defaultLayout" label="办卡金额">
              <a-input-number
                @change="handleTotalPrice"
                class="number-ipt"
                :min="0"
                :max="studentInfo ? studentInfo.banlance : 0"
                v-decorator="['totalPrice', { rules: [{ required: true, message: '请输入办卡金额' }] }]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :xxl="12" :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
            <a-form-item v-bind="defaultLayout" label="类型">
              <a-select
                :allowClear="true"
                placeholder="请选择类型"
                @change="getClassTypeList"
                v-decorator="['typeId', { rules: [{ required: true, message: '请选择类型' }] }]"
              >
                <a-select-option v-for="(type, typeIdx) in typeList" :value="type.id" :key="typeIdx">
                  {{ type.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xxl="12" :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
            <a-form-item v-bind="defaultLayout" label="班型">
              <a-select
                :style="{width: showMultiClass ? 'calc(100% - 80px)' : '100%'}"
                :allowClear="true"
                placeholder="请选择类型后选择班型"
                v-decorator="['classTypeId', { rules: [{ required: true, message: '请选择班型' }] }]"
              >
                <a-select-option v-for="(classType, classTypeIdx) in classTypeList" :value="classType.id" :key="classTypeIdx">
                  {{ classType.name }}
                </a-select-option>
              </a-select>
              <a-checkbox v-if="showMultiClass" class="ml10" v-model="multiClass">通班</a-checkbox>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :xxl="12" :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
            <a-form-item v-bind="defaultLayout" label="有效期">
              <a-input addonAfter="天" v-decorator="['validDay', { rules: [{ required: true, message: '请输入有效期' }, { validator: $verify.isInt }] }]" />
            </a-form-item>
          </a-col>
          <a-col :xxl="12" :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
            <a-form-item v-bind="defaultLayout" label="可用次数">
              <a-input
                addonAfter="次"
                v-decorator="['availableCount', { rules: [{ required: false, message: '请输入可用次数' }, { validator: $verify.isNum }] }]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :xxl="12" :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
            <a-form-item v-bind="defaultLayout" label="备注">
              <a-input v-decorator="['cardRemark']" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <PaymentCount v-show="showPayment" ref="paymentCount" :disabled="false" :shouldPayMoney="999999" :studentInfo="studentInfo" :specialCard="sepcialCardModal" @getBalancePrice="getBalancePrice" ></PaymentCount>
    </a-modal>
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :width="1100"
      title="编辑学员"
      :visible="editVisible"
      @ok="handleOk"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
    >
      <StudentForm ref="studentForm" :studentLimit="studentLimit" :studentData="studentInfo" :isApply="false"></StudentForm>
    </a-modal>
    <AddinvoiceSetAmodal ref="AddinvoiceSetAmodal" :studentInfo="studentInfo" @updateTable="updateTable" v-if="studentInfo" />
    <!-- //补录开票 -->
    <invoiceFinance ref="invoiceFinance" :studentInfo="studentInfo" @updateTable="updateTable" />

    <!--学员请假-->
    <StuLeaveAddEdit @refresh="refreshStuLeave" :stuId="$route.params.id" title="请假申请" ref="stuLeaveAddEdit"></StuLeaveAddEdit>

    <!--预习课/资料包/线上邀请码-->
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :width="1100"
      :title="invitationType == 'B' ? '预习课' : invitationType == 'C' ? '资料包' : invitationType == 'D' ? '线上邀请码' : ''"
      :visible="stuCardOnLineVisible"
      :confirmLoading="confirmLoading"
      @ok="stuCardOnLineOk"
      @cancel="stuCardOnLineCancel"
    >
      <StuCardOnLineTable
        v-if="stuCardOnLineVisible"
        :queryParams="{ invitationType, urlState: 'N', stuId: $route.params.id }"
        @refreshTable="refreshStuCardOnLineTable"
      ></StuCardOnLineTable>
    </a-modal>
    <!-- 续卡弹框 -->
    <Reorder ref="Reorder" :stuId="studentInfo" v-if="studentInfo"></Reorder>
    <!-- 线上邀请码选择卡种 -->
    <GetEduCard ref="cardEduModal" @getBackData="getCardBackEdu" :OnLineExperience="true" :noPrice="true"></GetEduCard>

    <ChooseStu
      ref="choosestu"
      :checkBox="true"
      :branch="true"
      :schooShow="true"
      :adviser="true"
      :stuType="true"
      :parenting="true"
      :params="parentingModalParams"
      @getBackData="getBackData"
    />
  </div>
</template>
<script>
import inviteImg from '@/assets/resource/invite.png'
import { PermBox, PaymentCount } from '@/components'
import { getStudentInfo, synchronousStuAvatar, saveStudentLimit, saveStudentNoLimit, bindParenting, unbindParenting } from '@/api/reception/student'
import invoiceFinance from '../finance/modules/invoiceFinance'

import { filterEmptyObject } from '@/utils/util'
import { studentChangeLog, getStudentBalance } from '@/api/education'
import StudentForm from './modules/StudentForm.vue'
import StudentInfoCardList from './modules/StudentInfoCardList'
import StudentInfoAccount from './modules/StudentInfoAccount'
import StuCardOnLineTableFormate from './modules/StuCardOnLineTableFormate'
import StuLeave from './modules/StuLeave'
import InvoiceList from './modules/InvoiceList'
import StuLeaveAddEdit from './modules/StuLeaveAddEdit'
import OperatingRecord from './modules/OperatingRecord'
import OperatingRecordOld from '../education/modules/operatingRecord'
import StuCardOnLineTable from './modules/StuCardOnLineTable.vue'
import AddinvoiceSetAmodal from '@/components/AddinvoiceSetAmodal/AddinvoiceSetAmodal'
import { listEduDance, listEduType } from '@/api/common'
import { cardTypeList } from '@/api/education/card'
import { saveSpecialCard } from '@/api/recep'
import Reorder from './modules/reorder.vue'
import Vue from 'vue'
import GetEduCard from '@/components/GetEduCard/GetEduCard.vue'
import { bindStudentInfo } from '@/api/intentionStu/adviser'
import ChooseStu from '@/components/ChooseStu'
const userDefaultId = Vue.ls.get('userDefaultId')
const defaultLayout = {
  labelCol: { md: { span: 6 } },
  wrapperCol: { md: { span: 16 } }
}

export default {
  components: {
    StuCardOnLineTableFormate,
    Reorder,
    PermBox,
    PaymentCount,
    StuLeave,
    StudentInfoCardList,
    StudentInfoAccount,
    StudentForm,
    OperatingRecord,
    OperatingRecordOld,
    StuCardOnLineTable,
    InvoiceList,
    AddinvoiceSetAmodal,
    invoiceFinance,
    StuLeaveAddEdit,
    GetEduCard,
    ChooseStu
  },
  props: {
    getStuId: null
  },
  data() {
    return {
      studentLimit: 'B',
      activeKey: 1,
      infoHeight: 'auto',
      operationImg: {
        inviteImg
      },
      showPayment: false,
      defaultLayout,
      userDefaultId,
      balanceIcon: true,
      stuBalance: null,
      avatarLoading: false,
      studentInfo: null,
      stuId: '',
      studentChangeLog: parameter => {
        return studentChangeLog({ studentId: this.$route.params.id })
      },
      sepcialCardModal: false,
      sepcialCardModalLoading: false,
      danceList: [],
      typeList: [],
      classTypeList: [],
      // edit
      editVisible: false,
      studentData: null,
      confirmLoading: false,

      /* 预习课/资料包/线上邀请码 */
      stuCardOnLineVisible: false,
      invitationType: '',
      parentingModalParams: {},

      showMultiClass: false,
      multiClass: false
    }
  },
  computed: {
    school_id() {
      return this.$store.getters.school_id
    },
    parentingColumns() {
      let columns = [
        {
          title: '姓名',
          dataIndex: 'stuName',
          scopedSlots: {
            customRender: 'stuName'
          }
        },
        {
          title: '电话',
          dataIndex: 'stuPhone'
        }
      ]
      if (this.handlePermBox('student:info:parentage-unbind')) {
        columns.push({
          title: '操作',
          dataIndex: 'action',
          scopedSlots: {
            customRender: 'action'
          }
        })
      }
      return columns
    }
  },
  watch: {
    $route(nv) {
      if (nv.meta.title === '学员详情') {
        this.pageLoad()
      }
    },
    getStuId(nv) {
      this.pageLoad()
    },
    studentInfo(o, n) {}
  },
  beforeCreate() {
    this.sepcialCardForm = this.$form.createForm(this)
  },
  created() {
    let tabKey = this.$route.params && this.$route.params.tabKey
    if (tabKey) {
      this.callback(Number(tabKey))
    }
    this.pageLoad()
    // this.$nextTick(() => {
    //   let timeout = setTimeout(() => {
    //     this.infoHeight = this.$refs.infoRow.$el.offsetHeight + 'px'
    //     clearTimeout(timeout)
    //   }, 300)
    // })
  },
  methods: {
    copy(record) {
      let url = window.location.origin + `/user/studentRecordApply/` + this.$route.params.id
      this.$copyText(url)
        .then(message => {
          this.$message.success('复制完毕')
        })
        .catch(err => {
          this.$message.error('复制失败')
        })
    },
    // 线上邀请码刷新列表
    invitationCodeRefreshTable() {
      this.$refs.StuCardOnLineTableFormate && this.$refs.StuCardOnLineTableFormate._refreshTable()
    },
    // 选择卡种数据
    getCardBackEdu(data) {
      bindStudentInfo({ studentInfoId: this.stuId, eduCardIds: data.id }).then(res => {
        if (res.code == 200) {
          this.$notification['success']({
            message: '系统通知',
            description: '操作成功'
          })
          this.invitationCodeRefreshTable()
        }
      })
    },
    // 点击线上邀请码
    openChoosePop() {
      this.$refs.cardEduModal.open()
    },
    //续卡
    openReorderModal() {
      this.$refs.Reorder.open()
    },
    addFinance(record) {
      if (record) {
        this.$refs.invoiceFinance.title = '编辑'
        this.$refs.invoiceFinance.MsgShow(record)
      }
      this.$refs.invoiceFinance.invoiceSetModal = true
    },
    //编辑开票弹窗
    editInvoice(record) {
      if (record.invoiceType === 'A') {
        if (record) {
          this.$refs.invoiceFinance.title = '编辑'
          this.$refs.invoiceFinance.MsgShow(record)
        }
        this.$refs.invoiceFinance.invoiceSetModal = true
      } else {
        if (record) {
          this.$refs.AddinvoiceSetAmodal.title = '编辑'
          this.$refs.AddinvoiceSetAmodal.MsgShow(record)
        }
        this.$refs.AddinvoiceSetAmodal.invoiceSetModal = true
      }
    },
    //更新开票列表
    updateTable() {
      this.pageLoad()
      this.$refs.InvoiceList.loadData(this.stuId)
    },
    //打开设置开票弹窗
    openaddinvoice(type) {
      if (type === 'A') {
        this.$nextTick(() => {
          this.$refs.AddinvoiceSetAmodal.title = '新增'
          this.$refs.AddinvoiceSetAmodal.invoiceSetModal = true
          this.$refs.AddinvoiceSetAmodal.getStudentInfo('studentInfo')
        })
      } else {
        this.$nextTick(() => {
          this.$refs.invoiceFinance.title = '新增'
          this.$refs.invoiceFinance.invoiceSetModal = true
          this.$refs.invoiceFinance.getStudentInfo()
        })
      }
    },
    handleTotalPrice(value) {
      this.showPayment = value
    },
    // 特殊卡功能更新
    getBalancePrice(obj) {},
    // 编辑
    handleEdit(limit) {
      this.studentLimit = limit
      this.editVisible = true
    },
    handleOk(e) {
      // let msg = this.studentId ? '您已修改成功' : '成功添加一名新学员'
      let msg = '操作成功'
      let editData = this.$refs.studentForm.handleOk()
      editData.id = editData.id ? editData.id : this.studentId
      let filterData = filterEmptyObject(editData)
      // filterData.modifyUserType = this.studentLimit
      let request = this.studentLimit == 'A' ? saveStudentNoLimit : saveStudentLimit
      this.$refs.studentForm
        .validateData()
        .then(() => {
          this.confirmLoading = true
          return request(filterData)
        })
        .then(res => {
          if (res.code === 200) {
            this.$notification.success({
              message: '系统通知',
              description: msg
            })
            this.pageLoad()
            this.editVisible = false
          }
          this.confirmLoading = false
        })
        .catch(err => {
          this.confirmLoading = false
          console.log(err)
        })
        .finally(() => {
          this.confirmLoading = false
        })
    },
    handleCancel(e) {
      this.editVisible = false
    },
    //办理特殊卡
    openSepcialCardModal() {
      this.sepcialCardModal = true
      this.getSepcialCardSelectList()
      this.$nextTick(() => {
        if (this.showPayment) {
          this.$refs.paymentCount.resetForm()
        }
      })
    },
    saveSecpialCard() {
      const {
        showMultiClass,
        multiClass,
        showPayment,
        sepcialCardForm: { validateFields, resetFields },
        stuId,
        $notification,
        refreshStuBalance
      } = this
      let params = {}
      return validateFields()
        .then(value => {
          return Object.assign({ studentId: stuId }, value)
        })
        .then(value => {
          params = Object.assign({}, value)
          if (showMultiClass) params.multiClass = multiClass
          if (showPayment) {
            return this.$refs.paymentCount.getValueSimple()
          } else {
            return { price: 0 }
          }
        })
        .then(paymentCount => {
          params = Object.assign({}, params, paymentCount)
          return Object.assign({}, params, paymentCount)
        })

        .then(params => {
          return saveSpecialCard(params)
        })
        .then(res => {
          // $notification['success']({
          //   message: '系统通知',
          //   description: '操作成功'
          // })
          if (res.code === 200) {
            this.pageChange(params).then(fullPath => {
              this.cancelSecpialCard()
              this.$multiTab.close(fullPath)
            })
          }
          // this.$refs.stuInfoCardList ? this.$refs.stuInfoCardList._refreshTable() : ''
          // resetFields()
          // refreshStuBalance()
          // this.sepcialCardModal = false
        })
    },
    pageChange(data) {
      return new Promise((resolve, reject) => {
        const {
          $route: { fullPath }
        } = this
        data = Object.assign({ isPayment: true, showBtn: true }, data, this.studentInfo)
        let params = {}
        params.stuName = data.stuName
        params.stuPhone = data.stuPhone
        params.price = data.price
        params.isPayment = data.isPayment
        params.createDate = data.createDate
        params.enrollDate = data.enrollDate
        params.quickApplayShow = data.quickApplayShow
        params.showBtn = data.showBtn
        params.stuId = data.id
        this.$router.push({ path: '/reception/stuApplyResult/' + JSON.stringify(params) })
        resolve(fullPath)
      })
    },
    cancelSecpialCard() {
      this.sepcialCardModal = false
    },
    //获取下拉框数据
    getSepcialCardSelectList() {
      listEduDance()
        .then(dance => {
          this.danceList = dance.data
        })
        .then(listEduType)
        .then(type => {
          this.typeList = type.data
        })
    },
    getClassTypeList(typeId) {
      this.showMultiClass = typeId === 'E'
      cardTypeList({ typeId }).then(res => (this.classTypeList = res.data))
      this.$nextTick(() => {
        this.sepcialCardForm.resetFields(['classTypeId'])
      })
    },
    uploadStuAvatar() {
      this.avatarLoading = true
      synchronousStuAvatar({
        stuId: this.stuId
      })
        .then(res => {
          if (res.code === 200) {
            this.$notification['success']({
              message: '系统通知',
              description: '恭喜,同步成功'
            })
          }
        })
        .finally(() => {
          this.avatarLoading = false
        })
    },
    callback(key) {
      this.activeKey = key
      // if (key == 2) {
      //   this.$refs.opRecord.getTable()
      // }
    },
    refreshStuBalance() {
      if (this.studentInfo) {
        const {
          studentInfo: { id }
        } = this
        this.balanceIcon = false
        setTimeout(() => {
          getStudentBalance(id)
            .then(res => {
              this.stuBalance = res.data
            })
            .finally(() => (this.balanceIcon = true))
        }, 800)
      }
    },
    pageLoad() {
      let id = (this.$route.params && this.$route.params.id) || this.getStuId
      this.$refs.opRecord ? this.$refs.opRecord._refreshTable() : ''
      getStudentInfo(id).then(res => {
        if (res.code === 200 && res.data) {
          this.stuId = res.data.id
          this.studentInfo = res.data
        } else {
          //错误处理
        }
      })
    },
    handlePermBox(str) {
      return this.$tools.checkPerm(str)
    },

    /* 预习课/资料包/线上邀请码 */
    openStuCardOnLine(type) {
      this.invitationType = type
      this.stuCardOnLineVisible = true
    },
    stuCardOnLineOk() {},
    stuCardOnLineCancel() {
      this.stuCardOnLineVisible = false
    },
    refreshStuCardOnLineTable(invitationType) {
      this.$refs['stuCardOnLineTable' + invitationType] && this.$refs['stuCardOnLineTable' + invitationType]._refreshTable()
    },
    /* 学员报名 */
    stuApply() {
      this.$router.push({
        path: '/reception/stuApply',
        query: {
          stuId: this.studentInfo && this.studentInfo.id
        }
      })
    },
    /* 学员请假 */
    addLeave() {
      this.$refs.stuLeaveAddEdit.openModal()
      this.$nextTick(() => {
        this.$refs.stuLeaveAddEdit.resetForm()
      })
    },
    refreshStuLeave() {
      this.$refs.stuLeaveAddEdit.loadData(this.$route.params.id)
    },

    addParentingCard() {
      let { id, stuPhone, StudentInfoList } = this.studentInfo
      let after = 0
      if (StudentInfoList && StudentInfoList.length > 0) {
        let afterList = StudentInfoList.filter(data => data.stuPhone && data.stuPhone.length === 12).map(data => Number(data.stuPhone.substring(11)))
        if (afterList.length > 0) after = Math.max(...afterList) + 1
      }

      this.$router.push({
        path: '/reception/stuApply',
        query: {
          parentId: id,
          stuPhone: stuPhone + '' + after
        }
      })
    },

    // 绑定亲属
    bindParenting() {
      this.parentingModalParams = {
        stuId: this.studentInfo && this.studentInfo.id
      }
      this.$refs.choosestu.open()
    },
    getBackData(data) {
      bindParenting({
        parentStuId: this.studentInfo && this.studentInfo.id,
        stuIds: data.map(d => d.id).join(',')
      })
        .then(res => {
          if (res.code == 200) {
            this.$notification['success']({
              message: '系统通知',
              description: '绑定成功'
            })
            this.pageLoad()
          } else {
            this.$notification['error']({
              message: '系统通知',
              description: res.msg
            })
          }
        })
    },
    unbindParenting(data) {
      this.$confirm({
        title: '系统提示',
        content: '确认要解绑该学员吗?',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          unbindParenting({ stuId: data.id })
            .then(res => {
              if (res.code == 200) {
                this.$notification['success']({
                  message: '系统通知',
                  description: '解绑成功'
                })
                this.pageLoad()
              } else {
                this.$notification['error']({
                  message: '系统通知',
                  description: res.msg
                })
              }
            })
        }
      })
    }
  }
}
</script>

<style scoped lang="less" type="text/less">
@import '~@/assets/style/index';

.ant-checkbox-wrapper {
  color: rgba(0, 0, 0, 0.85);
}

.grid {
  display: flex;
  flex-wrap: wrap;

  > * {
    box-sizing: border-box;
    width: calc(100% / 3);
    // width: 100px;
    min-width: 56px;
    padding: 10px;
  }

  .grid-item {
    display: flex;
    flex-flow: column;
    align-items: center;
    flex-shrink: 0;
    cursor: pointer;

    img {
      width: 46px;
      height: 46px;
    }

    a {
      display: inline-block;
      width: 100%;
      margin-top: 10px;
    }
  }
}

.number-ipt {
  width: 100%;
}

.studentinfo-wrapper {
  width: 100%;

  .student-info-wrapper {
    width: 100%;

    .avatar-btn {
      width: 160px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 15px;
    }

    .name-wrapper {
      width: 100%;
      padding: 10px 45px;
      box-sizing: border-box;

      .student-name {
        font-size: 22px;
        font-weight: bold;
        color: #333;
      }
    }
  }

  .infoItem {
    .class-info {
      margin: 10px 0;
    }

    .info-item-label {
      text-align: right;
    }

    .info-item-content {
      padding-left: 5px;
      box-sizing: border-box;
      .ellipsis();
    }
    .info-item-content-remark{
      white-space: pre-wrap;
    }
  }
}
</style>
