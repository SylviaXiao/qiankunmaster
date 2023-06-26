<template>
  <div class="org-user">
    <a-card :bordered="false" :style="{ margin: '20px 0' }">
      <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"></search-com-pro>
    </a-card>
    <a-card :bordered="false">
      <a-row :gutter="8">
        <a-col :span="6">
          <a-tree
            showIcon
            v-if="deptTree.length > 0"
            :defaultExpandKeys="expandedKeys"
            :defaultExpandAll="true"
            :treeData="deptTree"
            @select="onSelect"
            :defaultSelectedKeys="SelectedKey"
          >
            <a-icon slot="environment" type="environment" />
            <a-icon slot="home" type="home" />
            <a-icon slot="cluster" type="cluster" />
          </a-tree>
        </a-col>
        <a-col :span="18">
          <div class="btnClass">
            <perm-box perm="organize:user:save">
              <a-button type="primary" icon="plus-circle" @click.native="openModal()">新增</a-button>
            </perm-box>
          </div>
          <s-table ref="table" size="default" :columns="columns" :data="loadData" :alert="false" rowKey="id">
            <span slot="userNo" slot-scope="text, record">
              <perm-box perm="organize:user:view" :text="record.userNo">
                <a href="javascript:;" @click="openUserModal(record, 1)">{{ record.userNo }}</a>
              </perm-box>
            </span>
            <span slot="positionName" slot-scope="text, record"> {{ text }} <a-tag v-if="record.isLeader">主管</a-tag> </span>
            <span slot="userState" slot-scope="text, record">
              <perm-box perm="organize:user:onjob" :text="record.userState == 'Y' ? '在职' : '离职'">
                <a-switch :checked="record.userState == 'Y'" @change="changeUserState($event, record)">
                  <a-icon type="check" slot="checkedChildren" />
                  <a-icon type="close" slot="unCheckedChildren" />
                </a-switch>
              </perm-box>
            </span>

            <span slot="userLoginState" slot-scope="text, record">
              <perm-box perm="organize:user:onlogin" :text="record.userLoginState == 'Y' ? '允许' : '禁止'">
                <a-switch :checked="record.userLoginState == 'Y'" @change="changeUserLoginState($event, record)">
                  <a-icon type="check" slot="checkedChildren" />
                  <a-icon type="close" slot="unCheckedChildren" />
                </a-switch>
              </perm-box>
            </span>

            <span slot="action" slot-scope="text, record">
              <perm-box perm="organize:user:userrole">
                <a href="javascript:;" @click="updateOrgUserRole(record)">角色授权</a>
              </perm-box>
              <perm-box perm="organize:user:save">
                <a href="javascript:;" @click="openModal(record)">编辑</a>
              </perm-box>
              <perm-box perm="organize:user:resetpwd">
                <a href="javascript:;" @click="resetPwd(record)">重置密码</a>
              </perm-box>
            </span>
          </s-table>
        </a-col>
      </a-row>

      <!-- 编辑用户 -->
      <a-modal
        :maskClosable="$store.state.modalMaskClickEnable"
        :title="Modaltitle"
        v-model="userModal"
        width="850px"
        okText="保存"
        cancelText="取消"
        @ok="saveOrgUser"
        :confirmLoading="isloading"
      >
        <a-spin :spinning="spinning">
          <a-form :form="form">
            <a-row class="form-row" :gutter="16">
              <a-col :lg="12" :md="12" :sm="24">
                <a-form-item label="工号" v-bind="formItemLayout">
                  <span>{{ userNo }}</span>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row class="form-row" :gutter="16">
              <a-col :lg="12" :md="12" :sm="24">
                <a-form-item label="姓名" v-bind="formItemLayout">
                  <a-input placeholder="请输入姓名" v-decorator="['userName', { rules: [{ required: true, message: '请输入姓名' }] }]" />
                </a-form-item>
              </a-col>
              <a-col :lg="12" :md="12" :sm="24">
                <a-form-item label="手机号码" v-bind="formItemLayout">
                  <a-input
                    placeholder="请输入手机号码"
                    v-decorator="['userTel', { rules: [{ required: true, message: ' ' }, { validator: verifyUserTel }] }]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row class="form-row" :gutter="16">
              <a-col :lg="12" :md="12" :sm="24">
                <a-form-item label="性别" v-bind="formItemLayout">
                  <a-radio-group :options="userSexOptions" v-decorator="['userSex', { rules: [{ required: true, message: '请选择员工性别' }] }]" />
                </a-form-item>
              </a-col>
              <a-col :lg="12" :md="12" :sm="24">
                <a-form-item label="邮箱" v-bind="formItemLayout">
                  <a-input autocomplete="email" placeholder="请输入邮箱" v-decorator="['userMail']" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row class="form-row" :gutter="16">
              <a-col :lg="12" :md="12" :sm="24">
                <a-form-item label="身份证号码" v-bind="formItemLayout">
                  <a-input placeholder="请输入身份证号码" v-decorator="['userIdcard', { rules: [{ required: true, message: '请输入身份证号码' }, { validator: verifyIdCard }] }]" />
                </a-form-item>
              </a-col>
              <a-col :lg="12" :md="12" :sm="24">
                <a-form-item label="生日" placeholder="请选择生日时间" v-bind="formItemLayout">
                  <a-date-picker v-decorator="['userBirthday']" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :lg="12" :md="12" :sm="24">
                <a-form-item label="开户银行" v-bind="formItemLayout">
                  <a-input placeholder="请输入开户行" disabled v-decorator="['bank', { rules: [{ required: true, message: '请输入开户银行' }] }]" />
                </a-form-item>
              </a-col>
              <a-col :lg="12" :md="12" :sm="24">
                <a-form-item label="银行卡号" v-bind="formItemLayout">
                  <a-input
                    placeholder="请输入银行卡号"
                    @change="verifyBankNo"
                    v-decorator="['bankNo', { rules: [{ required: true, message: '请输入银行卡号' }, { validator: $verify.isNum }] }]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :lg="24" :md="24" :sm="24">
                <a-form-item label="上传银行卡" v-bind="aLineLayout">
                  <UploadBank ref="uploadBank" @uploadSuccess="uploadBankSuccess" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row class="form-row" :gutter="16">
              <a-col :lg="12" :md="12" :sm="24">
                <a-form-item label="正式员工" v-bind="formItemLayout">
                  <a-radio-group :options="options" v-decorator="['userOfficial', { rules: [{ required: true, message: '请选择员工类型' }] }]" />
                  <br />
                </a-form-item>
              </a-col>
              <a-col :lg="12" :md="12" :sm="24">
                <a-form-item label="在职类型" v-bind="formItemLayout">
                  <a-radio-group
                    :options="userStateOptions"
                    @change="userStateChange"
                    v-decorator="['userState', { rules: [{ required: true, message: '请选择员工类型' }] }]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row class="form-row" :gutter="16">
              <a-col :lg="12" :md="12" :sm="24">
                <a-form-item label="入职时间" placeholder="请选择入职时间" v-bind="formItemLayout">
                  <a-date-picker v-decorator="['userEntryTime', config]" />
                </a-form-item>
              </a-col>
              <a-col :lg="12" :md="12" :sm="24">
                <a-form-item label="转正时间" placeholder="请选择转正时间" v-bind="formItemLayout">
                  <a-date-picker v-decorator="['userOfficialTime']" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row class="form-row" :gutter="16" v-if="userStateLeave">
              <a-col :lg="12" :md="12" :sm="24">
                <a-form-item label="离职时间" placeholder="请选择离职时间" v-bind="formItemLayout">
                  <a-date-picker
                    format="YYYY-MM-DD"
                    valueFormat="YYYY-MM-DD"
                    v-decorator="['leaveDate', { rules: [{ required: true, message: '请选择离职时间' }] }]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <!-- 组织架构  在职类型 -->
            <a-row class="form-row" :gutter="16">
              <a-col :lg="12" :md="12" :sm="24">
                <a-form-item label="组织架构(部门)" v-bind="formItemLayout">
                  <a-tree-select
                    placeholder="请选择部门"
                    :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                    treeDefaultExpandAll
                    multiple
                    showLine
                    :treeData="deptTree"
                    v-decorator="['orgDeptIds', { rules: [{ required: true, message: '请选择部门' }] }]"
                  >
                    <a-icon slot="smile" type="smile-o" />
                  </a-tree-select>
                </a-form-item>
              </a-col>
              <a-col :lg="8" :md="8" :sm="24">
                <a-form-item
                  label="职位"
                  v-bind="{
                    labelCol: {
                      xs: { span: 10 },
                      sm: { span: 10 }
                    },
                    wrapperCol: {
                      xs: { span: 14 },
                      sm: { span: 14 }
                    }
                  }"
                >
                  <a-select :allowClear="true" placeholder="请选择职位类型" v-decorator="['orgPositionId']">
                    <a-select-option :allowClear="true" v-for="item in positionList" :key="item.id" :value="item.id">
                      {{ item.positionName }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :lg="4" :md="4" :sm="24">
                <a-form-item>
                  <a-checkbox :checked="this.isLeader" @change="handleCheckboxleader">主管</a-checkbox>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-spin>
      </a-modal>
      <a-modal title="修改" :visible="leaveVisible" :confirm-loading="confirmLoading" @ok="handleLeaveOk" @cancel="handleLeaveCancel">
        <a-form :form="leaveForm">
          <a-row class="form-row" :gutter="16">
            <a-col :lg="24" :md="24" :sm="24" v-if="leaveStatus">
              <a-form-item label="入职时间" placeholder="请选择入职时间" v-bind="formItemLayout">
                <a-date-picker
                  format="YYYY-MM-DD"
                  valueFormat="YYYY-MM-DD"
                  v-decorator="['leaveDate', { rules: [{ required: true, message: '请选择入职时间' }] }]"
                />
              </a-form-item>
            </a-col>
            <a-col :lg="24" :md="24" :sm="24" v-if="!leaveStatus">
              <a-form-item label="离职时间" placeholder="请选择离职时间" v-bind="formItemLayout">
                <a-date-picker
                  format="YYYY-MM-DD"
                  valueFormat="YYYY-MM-DD"
                  v-decorator="['leaveDate', { rules: [{ required: true, message: '请选择离职时间' }] }]"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-modal>
      <!-- 角色权限 -->
      <a-modal
        :maskClosable="$store.state.modalMaskClickEnable"
        title="角色授权"
        v-model="userRoleModal"
        width="600px"
        okText="保存"
        cancelText="取消"
        @ok="userRoleSubmit"
        :confirmLoading="isloading"
      >
        <a-spin :spinning="spinning">
          <a-form :form="roleform">
            <a-row class="form-row" :gutter="16">
              <a-col :lg="24" :md="24" :sm="24">
                <a-form-item label="角色权限" v-bind="formItemLayout">
                  <a-select
                    :allowClear="true"
                    mode="multiple"
                    placeholder="请选择职位类型后显示"
                    v-decorator="['orgRoleIds', { rules: [{ required: true, message: '请选择角色' }] }]"
                  >
                    <a-select-option :value="role.id" v-for="(role, roleIdx) in roleList" :key="roleIdx">{{ role.roleName }} </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-spin>
      </a-modal>

      <!-- 查看用户 -->
      <a-modal :maskClosable="$store.state.modalMaskClickEnable" title="用户信息" v-model="userInfoModal" width="850px" :footer="null">
        <div class="userList">
          <detail-list title="基本信息">
            <span>
              <detail-list-item term="工号">{{ userInfoById.userNo }}</detail-list-item>
              <detail-list-item term="用户姓名">{{ userInfoById.userName }}</detail-list-item>
              <detail-list-item term="性别">{{ userInfoById.userSex !== 'A' ? '女' : '男' }}</detail-list-item>
            </span>
            <span>
              <detail-list-item term="身份证">{{ userInfoById.userIdcard }}</detail-list-item>
              <detail-list-item term="开户银行">{{ userInfoById.bank }}</detail-list-item>
              <detail-list-item term="银行卡号">{{ userInfoById.bankNo }}</detail-list-item>
            </span>
            <span>
              <detail-list-item term="联系方式">{{ userInfoById.userTel }}</detail-list-item>
              <detail-list-item term="入职时间">{{ userInfoById.userEntryTime }}</detail-list-item>
              <detail-list-item term="转正时间">{{ userInfoById.userOfficialTime }}</detail-list-item>
            </span>
            <span>
              <detail-list-item term="人员类型">{{
                userInfoById.userOfficial == 'A' ? '正式' : userInfoById.userOfficial == 'B' ? '试用' : '兼职'
              }}</detail-list-item>
              <detail-list-item term="是否在职">{{ userInfoById.userState == 'Y' ? '在职' : '离职' }}</detail-list-item>
              <detail-list-item term="职位名称">{{ posInfoById.positionName }}</detail-list-item>
            </span>
            <span>
              <detail-list-item term="离职时间">{{ userInfoById.leaveDate }}</detail-list-item>
            </span>
          </detail-list>
          <div>
            <a-radio-group v-model="tableMode" @change="tableModeChange" :style="{ marginBottom: '8px' }">
              <a-radio-button value="branch">
                转馆时间
              </a-radio-button>
              <a-radio-button value="position">
                转岗时间
              </a-radio-button>
            </a-radio-group>
            <!-- <span>转岗时间:</span> -->
            <!-- :defaultPagination="true" -->
            <a-table
              ref="jobTransferTable"
              :pagination="false"
              size="default"
              :columns="tableMode == 'branch' ? branchTransferColumns : jobTransferColumns"
              :alert="false"
              rowKey="userdeptId"
              :data-source="jobTransferLoadData"
            >
              <span slot="action" slot-scope="text, record">
                <perm-box perm="education:class:save">
                  <a href="javascript:;" @click="editJobTransferTime(record)">修改</a>
                </perm-box>
              </span>
            </a-table>
          </div>
        </div>
      </a-modal>
    </a-card>
    <!-- 添加学生,修改学生modal层 -->
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :width="600"
      title="修改"
      :visible="editJobTransferVisual"
      @ok="editSave"
      :confirmLoading="confirmLoading"
      @cancel="editCancel"
    >
      <a-form :form="editForm" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
        <a-form-item :label="tableMode == 'branch' ? '转馆时间' : '转岗时间'">
          <a-date-picker
            style="width:100%"
            v-decorator="['transferTime', { rules: [{ required: true, message: '请选择转岗时间' }] }]"
            placeholder="选择日期"
            format="YYYY-MM-DD"
            valueFormat="YYYY-MM-DD"
            :allowClear="false"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { STable, SearchComPro, PermBox, UploadBank } from '@/components'
import moment from 'moment'
import { checkCardbin } from '@/api/common'
import {
  getDeptTree,
  getUserList,
  listOrgPosition,
  listOrgPositionNew,
  saveOrgUser,
  listOrgRole,
  listOrgRoleNew,
  getUserInfo,
  changeUserState,
  changeUserLoginState,
  resetPwd,
  saveOrgUserRole,
  updateUserDeptDate,
  listOrgPositionLog,
  updateOrgPositionLog
} from '@/api/organize'
import { getOrgUser } from '@/api/login'
import DetailList from '@/components/tools/DetailList'

const DetailListItem = DetailList.Item

const fieldNameList = ['userName', 'userNickName', 'userSex', 'userTel', 'userMail', 'userState', 'userOfficial', 'userIdcard', 'bank']

const columns = [
  {
    title: '工号',
    dataIndex: 'userNo',
    key: 'userNo',
    scopedSlots: { customRender: 'userNo' }
  },
  {
    title: '用户名称',
    dataIndex: 'userName'
  },
  {
    title: '手机号',
    dataIndex: 'userTel'
  },
  {
    title: '性别',
    dataIndex: 'userSex',
    customRender: text => {
      let show = '暂无'
      text === 'A' ? (show = '男') : (show = '女')
      return show
    }
  },
  {
    title: '职位',
    dataIndex: 'positionName',
    scopedSlots: { customRender: 'positionName' }
  },
  {
    title: '角色',
    dataIndex: 'userRoleList',
    customRender: text => {
      return text ? text.map(item => item.roleName).join(',') : ''
    }
  },
  {
    title: '人员类型',
    dataIndex: 'userOfficial',
    customRender: (text, record) => {
      let show = ''
      if (text === 'A') {
        show = '正式'
      } else if (text === 'B') {
        show = '试用'
      } else {
        show = '兼职'
      }
      return show
    }
  },
  {
    title: '允许登录',
    dataIndex: 'userLoginState',
    key: 'userLoginState',
    scopedSlots: { customRender: 'userLoginState' }
  },
  {
    title: '在职/离职',
    dataIndex: 'userState',
    key: 'userState',
    scopedSlots: { customRender: 'userState' }
  },
  {
    title: '操作',
    key: 'action',
    width: '150px',
    scopedSlots: { customRender: 'action' }
  }
]
const jobTransferColumns = [
  {
    title: '岗位',
    dataIndex: 'positionName',
    key: 'positionName'
  },
  {
    title: '转岗时间',
    dataIndex: 'startDate'
  },
  {
    title: '操作',
    key: 'action',
    width: '150px',
    scopedSlots: { customRender: 'action' }
  }
]
const branchTransferColumns = [
  {
    title: '部门',
    dataIndex: 'deptName',
    key: 'deptName'
  },
  {
    title: '转馆时间',
    dataIndex: 'obj_update_date'
  },
  {
    title: '操作',
    key: 'action',
    width: '150px',
    scopedSlots: { customRender: 'action' }
  }
]
const userStateOptions = [{ label: '在职', value: 'Y' }, { label: '离职', value: 'N' }]
const userSexOptions = [{ label: '男', value: 'A' }, { label: '女', value: 'B' }]
const options = [{ label: '正式', value: 'A' }, { label: '试用', value: 'B' }, { label: '兼职', value: 'C' }]
const formItemLayout = {
  labelCol: {
    xs: { span: 8 },
    sm: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 14 },
    sm: { span: 14 }
  }
}
const aLineLayout = {
  labelCol: {
    xs: { span: 4 },
    sm: { span: 4 }
  },
  wrapperCol: {
    xs: { span: 18 },
    sm: { span: 18 }
  }
}
const treeData = [
  {
    title: 'ERP系统',
    key: '0',
    value: '0',
    slots: {
      icon: 'smile'
    },
    children: []
  }
]

import Vue from 'vue'
export default {
  name: 'organizeDept',
  components: {
    STable,
    SearchComPro,
    PermBox,
    UploadBank,
    DetailList,
    DetailListItem
  },
  watch: {
    selectedId(nv, ov) {
      nv !== '' ? this._refreshTable() : ''
    }
  },
  data() {
    return {
      tableMode: 'branch',
      leaveStatusInfo: null,
      leaveStatus: false,
      leaveVisible: false,
      userStateLeave: false,
      //转馆时间数据
      branchTransferColumns,
      //转岗时间数据
      jobTransferColumns,
      jobTransferLoadData: [],
      // jobTransferLoadData: parameter => {
      //   return getUserList(parameter).then(res => {
      //     return res
      //   })
      // },
      confirmLoading: false,
      editJobTransferVisual: false,
      editJobTransferInfo: {},
      //角色授权
      userRoleModal: false,
      //主管
      isLeader: false,
      deptTree: [],
      columns,
      deptValue: '',
      treeData,
      userStateOptions,
      userSexOptions,
      options,
      formItemLayout,
      aLineLayout,
      positionList: [],
      roleList: [],
      deptModal: false,
      config: {
        rules: [{ type: 'object', required: true, message: '请选择时间' }]
      },
      userEntryTime: '',
      userOfficialTime: '',
      userModal: false,
      openKeys: ['key-01'],
      // 查询参数
      rowKey: '1',
      searchParams: [
        {
          type: 'text',
          key: 'userNo',
          label: '工号',
          placeholder: '请输入工号'
        },
        {
          type: 'text',
          key: 'userName',
          label: '用户名称',
          placeholder: '请输入用户名称/手机号'
        },
        {
          type: 'select', // 静态select框
          key: 'userState',
          label: '在职/离职',
          placeholder: '请选择在职状态',
          staticArr: [
            {
              string: '在职',
              value: 'Y'
            },
            {
              string: '离职',
              value: 'N'
            }
          ]
        },
        {
          type: 'select', // 静态select框
          key: 'userOfficial',
          label: '人员类型',
          placeholder: '请选择正式状态',
          staticArr: [
            {
              string: '正式',
              value: 'A'
            },
            {
              string: '试用',
              value: 'B'
            },
            {
              string: '兼职',
              value: 'C'
            }
          ]
        },
        {
          type: 'select', // 静态select框
          key: 'userLoginState',
          label: '允许登录',
          placeholder: '请选择',
          staticArr: [
            {
              string: '允许',
              value: 'Y'
            },
            {
              string: '禁止',
              value: 'N'
            }
          ]
        }
      ],
      //编辑新增,标记位
      openFor: '',
      queryParam: {},
      SelectedKey: [],
      expandedKeys: [],
      // 表头
      list: [],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        if (this.flag) {
          let orgDeptId = this.queryParam.orgDeptId
          this.queryParam.orgDeptId = orgDeptId
          return getUserList(Object.assign(parameter, this.queryParam)).then(res => {
            return res
          })
        }
      },
      orgTree: [],
      Modaltitle: '',
      selectedRowKeys: [],
      selectedRows: [],
      spinning: false,
      formValues: {},
      userNo: '系统自动生成',
      userInfoModal: false,
      userInfoById: {},
      posInfoById: {},
      selectedId: '',
      isloading: false,
      lastSelect: this.expandedKeys,
      usedPhone: null,
      flag: false
    }
  },
  mounted() {},
  beforeCreate() {
    this.form = this.$form.createForm(this)
    this.roleform = this.$form.createForm(this)
    this.editForm = this.$form.createForm(this)
    this.leaveForm = this.$form.createForm(this)
  },
  created() {
    this.getDefList().then(res => {})
  },
  methods: {
    verifyIdCard(rule, value, callback) {
      this.$verify.idCard(rule, value, callback, false)
    },
    tableModeChange(e) {
      this.openUserModal(this.userInfoById)
    },
    userStateChange(e) {
      this.userStateLeave = e.target.value == 'Y' ? false : true
    },
    editSave() {
      this.editForm.validateFields((err, values) => {
        // 验证表单没错误
        if (!err) {
          if (this.tableMode == 'branch') {
            updateUserDeptDate({ date: values.transferTime, userDeptIds: this.editJobTransferInfo.userdeptId }).then(res => {
              this.$notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
              this.openUserModal(this.userInfoById)
              this.editCancel()
            })
          } else {
            updateOrgPositionLog({ startDate: values.transferTime, id: this.editJobTransferInfo.id }).then(res => {
              this.$notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
              this.openUserModal(this.userInfoById)
              this.editCancel()
            })
          }
        }
      })
    },
    editCancel() {
      this.editForm.resetFields()
      this.confirmLoading = false
      this.editJobTransferVisual = false
    },
    editJobTransferTime(record) {
      this.editJobTransferVisual = true
      this.editJobTransferInfo = record
      let that = this
      this.$nextTick(res => {
        that.editForm.setFieldsValue({ transferTime: '' })
      })
    },
    //角色授权
    updateOrgUserRole(record) {
      this.orgUserId = record.id
      this.spinning = true
      this.userRoleModal = true
      this.roleform.resetFields()

      listOrgRoleNew()
        .then(res => (this.roleList = res.data))
        .then(() => {
          this.roleform.setFieldsValue({
            orgRoleIds: record.userRoleList.map(item => item.roleId)
          })
        })
        .finally(() => {
          this.spinning = false
        })
    },
    userRoleSubmit() {
      this.roleform.validateFields().then(value => {
        const params = {
          orgUserId: this.orgUserId,
          orgRoleIds: value.orgRoleIds.join(',')
        }
        saveOrgUserRole(params).then(() => {
          this.userRoleModal = false
          this._refreshTable()
        })
      })
    },
    handleCheckboxleader(e) {
      this.$nextTick(() => {
        this.isLeader = e.target.checked
      })
    },
    verifyBankNo(event) {
      const {
        target: { value }
      } = event
      this.setBankNo(value)

      // (/\S{5}/).test(value) && value(value.replace(/\s/g, '').replace(/(.{4})/g, '$1 '))
    },
    setBankNo(value) {
      const {
        form: { setFieldsValue }
      } = this
      this.$nextTick(() => {
        value = value.replace(/\s/g, '')
        setFieldsValue({ ['bankNo']: value.replace(/(.{4})/g, '$1 ') })
        if (value.length > 9) {
          checkCardbin({ bankNo: value })
            .then(res => {
              if (res.code == 200) {
                let data = JSON.parse(res.data)
                setFieldsValue({ ['bank']: data.bank })
              }
            })
        }
      })
    },
    //查看是否为老员工
    verifyUserTel(rule, value, callback) {
      this.$verify.userPhone(rule, value, callback, this.usedPhone)
    },

    setDefKeys(res) {
      const userDefaultId = Vue.ls.get('userDefaultId')
      if (userDefaultId && userDefaultId !== null) {
        this.expandedKeys.push(userDefaultId)
        this.SelectedKey.push(userDefaultId)
        this.selectedId = userDefaultId
      } else {
        this.expandedKeys.push(res)
        this.SelectedKey.push(res)
        this.selectedId = res
      }
    },
    //密码
    resetPwd(record) {
      const _this = this
      this.$confirm({
        title: '系统提示',
        content: '确认重置该员工的密码吗?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          resetPwd({ userId: record.id }).then(res => {
            _this.$notification['success']({
              message: '系统通知',
              description: '操作成功'
            })
            _this._refreshTable()
          })
        },
        onCancel() {}
      })
    },
    //搜索功能
    searchSubmit(data) {
      this.queryParam = Object.assign({ orgDeptId: this.queryParam.orgDeptId }, data)
      this._refreshTable()
    },
    getDefList() {
      return new Promise((resolve, reject) => {
        getDeptTree().then(res => {
          this.rewriteDataTree(res.data)
            .then(this.setIcon)
            .then(result => {
              if (result && result.length != 0) {
                const userDefaultId = Vue.ls.get('userDefaultId')
                if (userDefaultId && userDefaultId !== null) {
                  this.expandedKeys.push(userDefaultId)
                  this.SelectedKey.push(userDefaultId)
                  this.selectedId = userDefaultId
                } else {
                  this.expandedKeys.push(result[0].id)
                  this.SelectedKey.push(result[0].id)
                  this.selectedId = result[0].id
                }
                this.deptTree = result

                this.queryParam.orgDeptId = result[0].id
                this._refreshTable()
                if (this.treeData[0].children.length > 0) {
                  this.treeData[0].children.length = 0
                }
                this.deptTree.forEach(item => {
                  this.treeData[0].children.push(item)
                })
                this.flag = true
                resolve(result[0].id)
              }
            })
        })
      })
    },
    setIcon(data, parent) {
      return new Promise((resolve, reject) => {
        data.forEach(item => {
          if (item.deptType == 'A') {
            item.slots = { icon: 'environment' }
          } else if (item.deptType == 'B') {
            item.slots = { icon: 'home' }
          } else {
            item.slots = { icon: 'cluster' }
          }
          if (item.children && item.children.length > 0) {
            this.setIcon(item.children)
          }
        })
        resolve(data)
      })
    },
    rewriteDataTree(data) {
      return new Promise((resolve, reject) => {
        data.forEach((item, index) => {
          if (item.title && item.key && item.value) {
            return false
          }
          item.title = item.name || item.deptName
          item.key = item.id
          item.value = item.id

          if (item.children && item.children.length > 0) {
            this.rewriteDataTree(item.children)
          }
        })
        resolve(data)
      })
    },
    onSelect(selectedKeys, info) {
      // if (selectedKeys.length != 0) {
      //   this.queryParam.orgDeptId = selectedKeys[0]
      //   this._refreshTable()
      // }
      this.queryParam.orgDeptId = selectedKeys[0]
      this._refreshTable()
    },
    add(data) {
      this.Modaltitle = '新增用户'
      this.userNo = '系统自动生成'
      this.form.resetFields()
      this.formValues = {}
      this.usedPhone = null
    },
    edit(data) {
      this.form.resetFields()
      this.Modaltitle = '编辑用户'
      this.spinning = true
      this.formValues.id = data.id
      const { bankNo } = data
      this.$nextTick(() => {
        bankNo ? this.form.setFieldsValue({ ['bankNo']: bankNo.replace(/\s/g, '').replace(/(.{4})/g, '$1 ') }) : ''
        // this.form.setFieldsValue({ ['bankNo']: bankNo })
      })

      getUserInfo(data.id).then(res => {
        //回显主管
        this.isLeader = res.data.isLeader
        const result = res.data
        const { user, depts } = result
        this.usedPhone = user.userTel || null
        this.userNo = user.userNo
        fieldNameList.forEach(item => {
          this.$nextTick(() => {
            this.form.setFieldsValue({ [item]: user[item] })
          })
        })
        this.userStateLeave = user.userState == 'Y' ? false : true
        if (depts && depts.length > 0) {
          const arr = []
          depts.forEach(item => {
            arr.push(item.deptId)
          })
          this.$nextTick(() => {
            this.form.setFieldsValue({ ['orgDeptIds']: arr })
          })
        } else {
          this.$nextTick(() => {
            this.form.setFieldsValue({ ['orgDeptIds']: '' })
          })
        }
        this.$nextTick(() => {
          result.position ? this.form.setFieldsValue({ ['orgPositionId']: result.position.id }) : ''
          user.userEntryTime ? this.form.setFieldsValue({ ['userEntryTime']: moment(user.userEntryTime, 'YYYY-MM-DD') }) : ''
          user.leaveDate ? this.form.setFieldsValue({ ['leaveDate']: user.leaveDate }) : ''
          user.userOfficialTime ? this.form.setFieldsValue({ ['userOfficialTime']: moment(user.userOfficialTime, 'YYYY-MM-DD') }) : ''
          user.userBirthday ? this.form.setFieldsValue({ ['userBirthday']: moment(user.userBirthday, 'YYYY-MM-DD') }) : ''
        })
        this.spinning = false
      })
    },
    remove(data) {
      const _this = this
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    changeLoginState(info) {},

    //查看用户
    openUserModal(data, type) {
      if (type) {
        this.tableMode = 'branch'
        this.userInfoModal = true
      }
      if (this.tableMode == 'branch') {
        getOrgUser(data.id).then(res => {
          this.userInfoById = res.data.user
          this.jobTransferLoadData = res.data.orgDeptList
          this.posInfoById = res.data.position
        })
      } else {
        listOrgPositionLog({ userId: data.id }).then(res => {
          this.jobTransferLoadData = res.data
        })
      }
    },

    //编辑用户
    openModal(data) {
      this.openUserInfo = true
      if (data) {
        this.openFor = 'edit'
        this.edit(data)
      } else {
        this.openFor = 'add'
        this.userStateLeave = false
        this.add()
      }
      listOrgPositionNew().then(res => {
        this.positionList = res.data
      })
      this.$nextTick(() => {
        this.userModal = true
        this.$refs.uploadBank && this.$refs.uploadBank.clearImage()
      })
    },
    saveOrgUser() {
      this.form.validateFields((err, values) => {
        // 验证表单没错误
        if (!err) {
          values.userEntryTime != undefined ? (values.userEntryTime = values.userEntryTime.format('YYYY-MM-DD')) : (values.userEntryTime = '')
          values.userOfficialTime != undefined ? (values.userOfficialTime = values.userOfficialTime.format('YYYY-MM-DD')) : (values.userOfficialTime = '')
          values.userBirthday != undefined ? (values.userBirthday = values.userBirthday.format('YYYY-MM-DD')) : (values.userBirthday = '')
          if (typeof values.orgDeptIds != 'string') {
            let deptIds = ''
            values.orgDeptIds.forEach(item => {
              deptIds = deptIds + item + ','
            })
            values.orgDeptIds = deptIds.slice(0, deptIds.length - 1)
          }
          this.formValues = Object.assign(this.formValues, values)
          //增加主管字段
          this.formValues.isLeader = this.isLeader
          this.formValues.bankNo ? (this.formValues.bankNo = this.formValues.bankNo.replace(/\s/g, '')) : ''
          this.isloading = true
          saveOrgUser(this.formValues)
            .then(res => {
              this.userModal = false
              this.userStateLeave = false
              this.$notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
              this._refreshTable()
            })
            .finally(() => {
              this.isloading = false
            })
        }
      })
    },
    handleLeaveOk() {
      this.leaveForm.validateFields((err, values) => {
        // 验证表单没错误
        if (!err) {
          this.sendChangeData({ date: values.leaveDate, on: this.leaveStatus }, this.leaveStatusInfo)
          this.leaveForm.resetFields()
          this.handleLeaveCancel()
        }
      })
    },
    handleLeaveCancel() {
      this.leaveVisible = false
    },
    //在职/离职
    changeUserState(checked, data) {
      this.leaveStatus = checked
      this.leaveStatusInfo = data
      this.leaveVisible = true
    },
    sendChangeData(status, data) {
      changeUserState(data.id, status).then(res => {
        this.$notification['success']({
          message: '系统通知',
          description: '操作成功'
        })
        this._refreshTable()
      })
    },

    //是否允许登录
    changeUserLoginState(checked, data) {
      const status = {
        on: checked
      }
      const _this = this

      if (!checked) {
        this.$confirm({
          title: '系统提示',
          content: '确认禁止登录?',
          okText: '确认',
          cancelText: '取消',
          onOk() {
            _this.sendUserLoginState(status, data)
          },
          onCancel() {}
        })
      } else {
        this.sendUserLoginState(status, data)
      }
    },
    sendUserLoginState(status, data) {
      changeUserLoginState(data.id, status).then(res => {
        this.$notification['success']({
          message: '系统通知',
          description: '操作成功'
        })
        this._refreshTable()
      })
    },

    //保存角色
    saveOrgUserRole() {
      this.form.validateFields((err, values) => {
        // 验证表单没错误
        if (!err) {
          if (typeof values.orgDeptIds != 'string') {
            let roleIds = ''
            values.orgDeptIds.forEach(item => {
              deptIds = deptIds + item + ','
            })
            values.orgDeptIds = deptIds.slice(0, deptIds.length - 1)
          }
          this.formValues = Object.assign(this.formValues, values)
          //增加主管字段
          this.formValues.isLeader = this.isLeader
          this.formValues.bankNo ? (this.formValues.bankNo = this.formValues.bankNo.replace(/\s/g, '')) : ''
          this.isloading = true
          saveOrgUser(this.formValues)
            .then(res => {
              this.userModal = false
              this.userStateLeave = false
              this.$notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
              this._refreshTable()
            })
            .finally(() => {
              this.isloading = false
            })
        }
      })
    },

    dataReload() {
      this.getDefList()
      this._refreshTable()
    },
    _refreshTable() {
      this.$refs.table.refresh()
    },
    uploadBankSuccess(info) {
      this.setBankNo(info.bankNo)
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/style/index';

.org-user {
  :global(.ant-tree li) {
    overflow: hidden;
    white-space: nowrap;
  }
}

.custom-tree {
  /deep/ .ant-menu-item-group-title {
    position: relative;

    &:hover {
      .btn {
        display: block;
      }
    }
  }

  /deep/ .ant-menu-item {
    &:hover {
      .btn {
        display: block;
      }
    }
  }

  /deep/ .btn {
    display: none;
    position: absolute;
    top: 0;
    right: 10px;
    width: 20px;
    height: 40px;
    line-height: 40px;
    z-index: 1050;

    &:hover {
      transform: scale(1.2);
      transition: 0.5s all;
    }
  }
}

.btnClass {
  margin-bottom: 20px;
}

.ant-form-item-label {
  label {
    text-align: left;
  }
}
</style>
