<template>
  <div class="student-wrapper">
    <a-card :bordered="false" :style="{ margin: '20px 0' }">
      <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"></search-com-pro>
    </a-card>
    <a-card :bordered="false">
      <a-space :size="15">
        <perm-box perm="student:info:save">
          <a-button type="primary" icon="plus-circle" @click.native="addStudent()">添加学员</a-button>
        </perm-box>
        <perm-box perm="student:info:update">
          <a-button @click.native="openMasterModal()">批量修改顾问</a-button>
        </perm-box>
      </a-space>

      <div class="table-wrapper" v-if="loadData">
        <s-table
          ref="table"
          size="default"
          :columns="columns"
          :data="loadData"
          rowKey="id"
          :indentSize="10"
          :rowSelection="rowSelection"
          :expandedRowKeys="expandedRowKeys"
          :expandedRowsChange="expandedRowsChange"
          :expand="expand"
          :autoLoad='false'
          :locale="locale"
        >
          <span slot="avatar" slot-scope="text, record">
            <a-avatar shape="square" :style="{ verticalAlign: 'middle' }" size="small" icon="user" :src="text" v-if="text" />
          </span>
          <span slot="stuNo" slot-scope="text, record">
            <a-icon type="qrcode" @click="qrcodeHandle(record)" style="color:#1BA97B;margin-right: 2px;" />
            {{text}}
          </span>
          <span slot="stuName" slot-scope="text, record">
            <perm-box :text="record.stuName" perm="student:info:view">
              <router-link :to="{ path: `/reception/studentInfo/${record.id}` }">{{ record.stuName }}</router-link>
            </perm-box>
          </span>
          <span slot="createDate" slot-scope="text, record">
            <perm-box :text="record.createDate" perm="student:log:view">
              <a href="javascript:;" @click="openLogTime(record)">{{ record.createDate }}</a>
            </perm-box>
          </span>
          <span slot="action" slot-scope="text, record">
            <perm-box perm="student:wx:update">
              <a href="javascript:;" @click="handleUnBindWx(record)">解绑微信</a>
            </perm-box>
            <perm-box perm="student:info:save">
              <a href="javascript:;" @click="handleShare(record)">共享</a>
            </perm-box>
            <perm-box perm="student:log:view||student:log:save">
              <a href="javascript:;" @click="handleFollowUp(record)">跟进</a>
            </perm-box>
            <!-- 其他编辑（修改不限制） -->
            <perm-box perm="student:info-nolimit:save"><a href="javascript:;" @click="handleEdit(record, 'A')">编辑</a></perm-box>
            <!-- 前台编辑（只允许修改一次人群） -->
            <perm-box perm="student:info:save"><a href="javascript:;" @click="handleEdit(record, 'B')">编辑(前台)</a></perm-box>
            <perm-box perm="student:info:del"><a href="javascript:;" @click="handleDelete(record)">删除</a></perm-box>
          </span>
        </s-table>
      </div>
    </a-card>
    <!-- 添加学生,修改学生modal层 -->
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :width="1100"
      :title="title"
      :visible="visible"
      @ok="handleOk"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
    >
      <StudentForm ref="studentForm" :studentLimit="studentLimit" :studentData="studentData" :isApply="false"></StudentForm>
    </a-modal>
    <!-- 跟进弹出框 -->
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      title="新增跟进"
      :visible="visibleFollowUp"
      :width="750"
      :footer="null"
      @cancel="handleFollowUpCancel"
    >
      <perm-box perm="student:log:save">
        <FollowUp ref="followUp" :stuId="userId"></FollowUp>
        <a-row>
          <a-col :offset="6">
            <a-button @click="handleFollowUpOk" type="primary">提交</a-button>
          </a-col>
        </a-row>
        <a-divider />
      </perm-box>
      <perm-box perm="student:log:view">
        <div class="data-tree">
          <a-table :columns="userLogColumns" :dataSource="logTreeData" size="small" :pagination="false" rowKey="id" class="small-table" />
        </div>
      </perm-box>
    </a-modal>
    <!-- 沟通时间轴 -->
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" title="沟通记录" :visible="visibleTree" @cancel="handleTreeCancel" :footer="null">
      <div class="data-tree">
        <a-timeline v-if="logTreeData.length > 0">
          <a-timeline-item v-for="(item, index) in logTreeData" :key="item.id">
            <a-card :bordered="false" :style="{ marginTop: '10px' }" :title="joinTitle(item)">
              <a-col :span="24">{{ item.logRemark ? item.logRemark : '(暂无)' }}</a-col>
            </a-card>
          </a-timeline-item>
        </a-timeline>
      </div>
    </a-modal>
    <!-- 共享 -->
    <StudentShare ref="StudentShare" :studentId="studentId" :showShare="showShare" @handleShareCancel="handleShareCancel"></StudentShare>

    <SignInRecord ref="signInRecord"></SignInRecord>

    <!--批量修改顾问-->
    <i-modal ref="masterModal" :multiple="false" userType="all" @getBackData="getMasterBack" />

    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :destroyOnClose="true"
      :width="400"
      title="学生二维码"
      :footer="null"
      @cancel="qrcodeCancel"
      v-model="qrcodeVisible"
    >
      <div class="qrTabs">
        <div :class="{active: qrType === 'A'}" @click="changeQR('A')">单色</div>
        <div :class="{active: qrType === 'B'}" @click="changeQR('B')">优鸽</div>
      </div>
      <div class="image_wrapper">
        <img :src="qrcodeUrl" style="width: 350px" />
      </div>
    </a-modal>

    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      title="系统提示"
      :visible="unBindVisible"
      :width="420"
      @cancel="unBindCancel"
    >
      确定要解绑此学员的微信吗?
      <template slot="footer">
        <a-button @click="unBindCancel">取消</a-button>
        <a-button @click="unBindOk('A')" type="primary">解绑单色</a-button>
        <a-button @click="unBindOk('B')" type="primary">解绑优鸽</a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
import { roleColumns } from '@/utils/reception/student'
import { STable, SignInRecord, SearchComPro, PermBox, IModal } from '@/components'
import StudentForm from './modules/StudentForm.vue'
import StudentShare from './modules/StudentShare.vue'
import { getPageList, deleteStudent, saveStudentLimit, updateListAdvise, saveStudentNoLimit } from '@/api/reception/student'
import { filterEmptyObject } from '@/utils/util'
import FollowUp from '../intentionStu/modules/adviserFollowUp'
import { saveStuLog, listStuLog } from '@/api/student'
import { listStudentCard } from '@/api/reception/student'
import { getSchoolList } from '@/api/education/card'
import { checkStuOpenId } from '@/api/common'

const userLogColumns = [
  {
    title: '跟进时间',
    dataIndex: 'createDate',
    key: 'createDate',
    width: 150
  },
  {
    title: '跟进人',
    dataIndex: 'userName',
    key: 'userName'
  },
  {
    title: '下次跟进时间',
    dataIndex: 'logDate',
    key: 'logDate'
  },
  {
    title: '备注',
    dataIndex: 'logRemark',
    key: 'logRemark'
  }
]
export default {
  name: 'student',
  components: {
    StudentShare,
    SearchComPro,
    StudentForm,
    PermBox,
    STable,
    FollowUp,
    SignInRecord,
    IModal
  },
  mounted() {
    this.initData()
  },
  data() {
    return {
      isReset:false,
      studentLimit: 'B',
      selectedRowKeys: [],
      selectedRows: [],
      userLogColumns,
      expandedRowKeys: [],
      recordInfo: {},
      studentId: '',
      studentData: null,
      title: '',
      visible: false,
      confirmLoading: false,
      columns: roleColumns,
      visibleTree: false,
      logTreeData: [],
      //table与搜索
      searchParams: [
        {
          type: 'treeSelect',
          isShow: !!!this.$store.getters.school_id,
          show: true,
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
          key: 'stuNo',
          show: true,
          label: '学号',
          placeholder: '请输入学号/身份证号'
        },
        {
          type: 'text',
          key: 'stuInfo',
          show: true,
          label: '学员信息',
          placeholder: '学员名称/联系电话'
        },
        {
          type: 'select',
          key: 'avatar',
          show: true,
          label: '学员头像',
          placeholder: '头像是否上传',
          staticArr: [
            {
              string: '已上传',
              value: 'Y'
            },
            {
              string: '未上传',
              value: 'N'
            }
          ]
        },
        {
          type: 'text',
          key: 'adviserName',
          show: true,
          label: '顾问',
          placeholder: '顾问名称'
        },
        {
          type: 'select',
          key: 'stuType',
          show: true,
          label: '人群分类',
          placeholder: '成人/少儿',
          staticArr: [
            {
              string: '成人',
              value: 'A'
            },
            {
              string: '少儿',
              value: 'B'
            }
          ]
        }
      ],
      showSearchTag: {
        title: {
          name: true,
          stuPhone: true,
          stuNo: true
        },
        body: {
          date: true
        }
      },
      userId: '',
      visibleFollowUp: false,
      confirmFollowUpLoading: false,
      queryParam: {},
      initTable:false,
      locale: { emptyText: <div style='font-size: 30px;padding: 100px 0;'>请选择相关筛选条件后，再查询学员信息哦</div> },
      loadData: parameter => {
          return getPageList(Object.assign(parameter, this.queryParam)).then(res => {
            if(!this.autoLoad&&this.isReset)return {data:[]}
            return res
          })
      },
      showShare: false,
      qrcodeVisible: false,
      qrcodeInfo: {},
      qrcodeUrl: null,
      qrType: 'A',
      unBindVisible: false
    }
  },
  watch: {
    visible(nv) {
      //每次隐藏清空studentData
      if (nv === false) {
        this.initData()
        this.$refs.studentForm.initAllValues()
      }
    },

    visibleFollowUp(nv) {
      if (nv) {
      } else {
        // 关闭窗口,reset数据
        this.followUpTitle = ''
        this.stuId = ''
        this.$refs.followUp.resetForm()
      }
    }
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRowKeys = selectedRowKeys
          this.selectedRows = selectedRows
        }
      }
    }
  },
  methods: {
    //搜索功能
    searchSubmit(data,isReset) {
      this.isReset=''
      if(isReset==='isReset')this.isReset=true
      this.queryParam = data
      this.initTable=true
      this._refreshTable()
    },
    initData() {
      this.studentData = {
        stuName: '',
        stuPhone: '',
        stuSex: '',
        stuSource: '',
        stuBirthday: null,
        stuIdcard: '',
        avatar: null,
        stuArea: null,
        stuWechat: '',
        stuQQ: '',
        stuEmergency: '',
        stuRemark: '',
        usedNum: null
      }
    },
    confirm() {
      let studentId = this.studentId
      let self = this
      this.$confirm({
        title: '系统提示',
        content: '确认删除该条数据吗?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          return deleteStudent(studentId)
            .then(res => {
              if (res.code === 200) {
                self._refreshTable()
              }
            })
            .catch(() => {})
        },
        onCancel() {}
      })
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
            this._refreshTable()
            this.visible = false
          }
          this.confirmLoading = false
        })
        .catch(err => {
          this.confirmLoading = false
        })
        .finally(() => {
          this.confirmLoading = false
        })
    },
    handleCancel(e) {
      this.visible = false
    },
    _refreshTable() {
      this.selectedRowKeys = []
      this.selectedRows = []
      this.$refs.table.refresh()
    },
    handleInfo(record) {
      let url = `/user/studentinfo/${record.id}`
      this.$router.push(url)
    },
    handleEdit(record, limit) {
      //点击编辑将数据传入studentData
      this.studentId = record.id
      this.studentLimit = limit
      this.studentData = record
      this.studentData.usedNum = record.stuPhone
      this.title = '编辑学员'
      this.visible = true
      // this.getSelectData()
    },
    addStudent(record) {
      //要调用清空data的方法
      this.studentId = ''
      this.title = '新增学员'
      this.visible = true
    },
    // getSelectData() {
    //   getSelectStuSourceData().then(res => {
    //     if (res.code === 200 && res.data) {
    //       return res.data
    //     }
    //   }).then(res => {
    //     if (res instanceof Array) {
    //       let selectList = []
    //       res.forEach(item => {
    //         selectList.push(item.sourceName)
    //       })

    //       this.studentData.sourceSelectData = selectList
    //       this.$refs.studentForm.setSelectData(selectList)
    //     }
    //   }).catch(err => {
    //   })
    // },
    handleDelete(record) {
      this.studentId = record.id
      this.confirm(record)
    },
    handleShareCancel() {
      this.showShare = false
    },
    handleShare(record) {
      this.studentId = record.id
      this.$refs.StudentShare.initTreeData()
      this.showShare = true
    },
    getStuUsserLog(record) {
      const { id } = record
      return new Promise((resolve, reject) => {
        this.logTreeData = []
        listStuLog({ stuId: id })
          .then(res => {
            if (res.code === 200 && res.data) {
              this.logTreeData = res.data
              resolve()
            }
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    //展开的行
    expand(expanded, record) {
      expanded ? this.backStuCard(record.id) : ''
    },
    expandedRowsChange(rows) {
      if (rows.length > 1) {
        rows.shift()
      }
      this.expandedRowKeys = rows
    },
    backStuCard(data) {
      this.innerData = []
      this.innerLoading = true
      listStudentCard({ studentId: data })
        .then(res => {
          this.innerData = res.data
        })
        .finally(() => {
          this.innerLoading = false
        })
    },
    //删除按钮

    _refreshInnerTable() {
      this.backStuCard(this.expandedRowKeys[0])
    },
    //
    handleFollowUp(record) {
      this.visibleFollowUp = true
      //没有view权限,不请求接口
      if (this.$tools.checkPerm('student:log:view')) {
        this.getStuUsserLog(record).then(() => {
          this.userId = record.id
        })
      }
    },
    handleFollowUpOk() {
      this.$refs.followUp
        .getFollowUpData()
        .then(res => {
          this.confirmFollowUpLoading = true
          return saveStuLog(res)
        })
        .then(res => {
          if (res.code === 200) {
            this.$notification['success']({
              message: '系统通知',
              description: '已添加新的沟通记录'
            })
            this._refreshTable()
            //this.confirmFollowUpLoading = false
            //this.visibleFollowUp = false
          }
        })
        .catch(err => {})
        .finally(() => {
          this.confirmFollowUpLoading = false
          this.visibleFollowUp = false
        })
    },
    handleFollowUpCancel() {
      this.visibleFollowUp = false
    },

    openLogTime(record) {
      this.visibleTree = true
      this.logTreeData = []
      listStuLog({ stuId: record.id }).then(res => {
        this.logTreeData = res.data
      })
    },
    handleTreeCancel() {
      this.visibleTree = false
    },
    joinTitle(item) {
      return `${item.createDate}  ${item.userName}`
    },

    // 校验是否有勾选
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
    // 批量修改顾问
    openMasterModal() {
      this.examine().then(() => {
        this.$refs.masterModal.open()
      })
    },
    getMasterBack(data, type) {
      updateListAdvise({ adviseId: data.id, studentIds: this.selectedRowKeys.join(',') }).then(res => {
        if (res.code === 200) {
          this.$notification['success']({
            message: '系统通知',
            description: '操作成功'
          })
          this._refreshTable()
        } else {
          this.$notification['error']({
            message: '系统通知',
            description: res.msg
          })
        }
      })
    },
    // 解绑微信
    handleUnBindWx(record) {
      this.recordInfo = record
      this.unBindVisible = true
    },
    unBindOk(state) {
      checkStuOpenId({
        phone: this.recordInfo.stuPhone,
        type: 'B',
        state
      }).then(res => {
        if (res.code === 200) {
          this.$notification['success']({
            message: '系统通知',
            description: '操作成功'
          })
          this.unBindCancel()
          this._refreshTable()
        } else {
          this.$notification['error']({
            message: '系统通知',
            description: res.msg
          })
        }
      })
    },
    unBindCancel() {
      this.recordInfo = {}
      this.unBindVisible = false
    },
    //学员二维码
    qrcodeHandle(record) {
      this.qrcodeVisible = true
      this.qrcodeInfo = record
      this.changeQR('A')
    },
    qrcodeCancel() {
      this.qrcodeVisible = false
    },
    changeQR(type) {
      this.qrType = type
      this.qrcodeUrl = process.env.VUE_APP_URL + '/common/qrcode/student/' + this.qrcodeInfo.id + '?state=' + type
    }
  }
}
</script>

<style scoped lang="less" type="text/less">
@import '~@/assets/style/index';

.student-wrapper {
  .search-wrapper {
  }

  .btn-wrapper {
    margin-top: 20px;
    margin-left: -5px;
  }

  .table-wrapper {
    margin-top: 20px;
  }
}

:global {
  .data-tree {
    .ant-card {
      top: -17px;
    }

    .ant-timeline {
      margin-top: 10px;
    }
  }

  .inner-table {
    background-color: #f1f1f1;
  }
}

.intention-service-wrapper {
  .btn-wrapper {
    margin-top: 20px;
    margin-left: -5px;
  }

  .table-wrapper {
    margin-top: 20px;
  }
}

.qrTabs {
  display: flex;
  align-items: center;
  width: 100%;
  height: 40px;
  border: 1px solid #d9d9d9;
  border-radius: 5px;

  > div {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    height: 100%;
    cursor: pointer;
  }

  .active {
    color: #FFF;
    background: #1BA97B;
  }
}
</style>
