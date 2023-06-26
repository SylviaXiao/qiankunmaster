<template>
  <div class="todayPlan-wrapper">
    <a-tabs defaultActiveKey="1" @change="tabsChange">
      <a-tab-pane key="1">
        <span slot="tab"><a-icon type="camera" />拍照签到</span>
        <div class="photo-signin">
          <perm-box perm="student:signinlog:view" style="position: relative;">
            <div>
              <a-row class="student-sign-in">
                <a-col v-for="item in finallyStuArr" :key="item.stuCardId" :lg="24" :md="24" :sm="24">
                  <div class="student-box-wrapper">
                    <div
                      class="student-box"
                      :class="{
                        selected: isSelected(item.stuCardId),
                        isOverdue: isOverdue(item.endValidDate) || isOverTimes(item) || !item.payoff
                      }"
                    >
                      <div class="student-content">
                        <div class="student-avatar" @click="showStuInfo(item)">
                          <img v-if="item.avatar" class="avatar-img" :src="item.avatar" alt="" />
                          <img v-else class="avatar-img" :src="item.avatar ? item.avatar : require(`@/assets/small_logo.png`)" alt="" />
                        </div>
                        <div class="student-info" @click="handleClickBox(item)">
                          <div class="student-name" :class="{ selected: isSelected(item.stuCardId) }">
                            {{ item.stuName }}
                            <span class="student-phone" :class="{ selected: isSelected(item.stuCardId) }" style="margin-left: 5px;">{{ item.stuPhone }}</span>
                          </div>
                          <div class="student-phone" :class="{ selected: isSelected(item.stuCardId) }">
                            <span>有效期:{{ $tools.tailor.getDate(item.endValidDate) || '无' }}</span>
                          </div>
                          <div class="student-phone" :class="{ selected: isSelected(item.stuCardId) }">
                            <span>次数:{{ `${item.usedCount}次/${item.totalCount || '不限次数'}` }}</span>
                          </div>
                        </div>
                      </div>
                      <div v-if="item.signed === 'Y'" class="student-sign">
                        <!-- {{item.signed==='Y'?'已签到':'未签到'}} -->
                        <!-- <a-icon type="check" />签 -->
                        <span class="student-sign-text">签</span>
                      </div>
                      <div v-if="item.status == 'C'" class="student-sign">
                        <span class="student-sign-text"><span style="color: #FF3300;">停</span></span>
                      </div>
                      <div v-if="!item.payoff" class="student-sign">
                        <span class="student-sign-text"><span style="color: #FF3300;">欠</span></span>
                      </div>
                      <div v-if="isOverdue(item.endValidDate) || isOverTimes(item)" class="student-sign">
                        <span class="student-sign-text"><span style="color: #FF3300;">过</span></span>
                      </div>
                    </div>
                  </div>
                </a-col>
              </a-row>
            </div>
            <div class="signin-stu" ref="image">
              <div class="check-group">
                <a-checkbox-group v-model="defCheckList" @change="changeMask" style="width: 100%;">
                  <span style="margin-right: 15px" v-for="(item, index) in typeOptions" :key="index">
                    <a-checkbox :value="item.value" :style="{ color: item.color }">{{ `${item.label} (${item.length}人)` }}</a-checkbox>
                  </span>
                </a-checkbox-group>
              </div>
              <div class="upload-stu" style="padding-top: 22px;">
                <a-spin :spinning="spinning" tip="正在识别中..." style="height: 500px;">
                  <div class="imgUpload" ref="imgbox">
                    <a-upload
                      class="avatar-uploader"
                      :showUploadList="false"
                      :beforeUpload="beforeUpload"
                      style="width: 100%;height: 500px;position: relative;"
                    >
                      <div v-if="imageUrl" style="position:absolute;left: 0;top: 0;width: 100%;">
                        <div style="position: relative;width: 100%">
                          <img :src="imageUrl" alt="avatar" :style="imageStyle" style="height: 500px;" />
                          <a-tooltip placement="rightTop" v-for="(item, index) in maskList" :key="index">
                            <template slot="title">
                              <div v-if="item.stuInfo">
                                <p>姓名:{{ item.stuInfo.stuName ? item.stuInfo.stuName : '暂无信息' }}</p>
                                <p v-if="!item.stuInfo.stuCardNo">学号:{{ item.stuInfo.stuNo ? item.stuInfo.stuNo : '暂无信息' }}</p>
                                <p v-else>卡号:{{ item.stuInfo.stuCardNo ? item.stuInfo.stuCardNo : '暂无信息' }}</p>
                                <p>手机:{{ item.stuInfo.stuPhone ? item.stuInfo.stuPhone : '暂无信息' }}</p>
                              </div>
                              <div v-else>
                                非法学员
                              </div>
                            </template>
                            <div
                              class="img-mask"
                              style="position: absolute; border: 2px solid red"
                              @mouseover="getStuInfoByMask"
                              :style="{
                                width: item.width,
                                height: item.height,
                                left: item.left,
                                top: item.top,
                                borderColor: item.color
                              }"
                            ></div>
                          </a-tooltip>
                        </div>
                      </div>
                      <div v-else>
                        <a-icon :type="uploadLoading ? 'loading' : 'cloud-upload'" style="font-size: 120px;" />
                        <div class="ant-upload-text">上传图片</div>
                      </div>
                    </a-upload>
                  </div>
                </a-spin>
              </div>
            </div>
          </perm-box>
        </div>
      </a-tab-pane>
      <a-tab-pane key="2">
        <span slot="tab"><a-icon type="table" />表格签到</span>
        <div class="table-signin">
          <a-table
            :columns="stuColumns"
            :dataSource="finallyStuArr"
            :pagination="false"
            :scroll="{ y: 470 }"
            :rowClassName="changeTableStyle"
            :rowSelection="{
              selectedRowKeys: finallySelectArr,
              onSelect: handleClickBox,
              onSelectAll: selectAll,
              getCheckboxProps: setDisabled
            }"
            rowKey="stuCardId"
          >
            <span slot-scope="text, record" slot="avatar">
              <a-avatar shape="square" :style="{ verticalAlign: 'middle' }" size="small" icon="user" :src="text" v-if="text" />
            </span>
            <span slot-scope="text, record" slot="stuName">
              <span style="margin-right: 5px;">{{ text }}</span>
              <a-tag v-if="!record.payoff">欠</a-tag>
              <a-tag v-if="isOverdue(record.endValidDate) || isOverTimes(record)">过</a-tag>
              <a-tag v-if="record.status == 'C'">停</a-tag>
            </span>
          </a-table>
        </div>
      </a-tab-pane>
      <a-tab-pane v-if="handlePermBox('student:signinlog:view')" key="3">
        <span slot="tab"><a-icon type="environment" />签到记录</span>
        <SignInReport :isModal="false" :danceplanId="danceplanId" :classId="classId" :type="type" ref="signInReport"> </SignInReport>
      </a-tab-pane>
      <a-tab-pane key="4">
        <span slot="tab"><a-icon type="camera" />补课</span>
        <replenishes-plan :danceplanId="danceplanId"></replenishes-plan>
      </a-tab-pane>
      <a-tab-pane key="5">
        <span slot="tab"><a-icon type="camera" />试听</span>
        <audition-log :danceplanId="danceplanId"></audition-log>
      </a-tab-pane>
    </a-tabs>
    <perm-box perm="student:signinlog:sign" class="signin-btn">
      <a-divider style="margin: 10px 0;"></a-divider>
      <a-row type="flex" justify="space-between" align="bottom">
        <div class="btn-wrapper">
          <div v-if="isChangGuiCls" class="add-form">
            <a-form :form="form">
              <a-form-item :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }" label="卡号/手机号: ">
                <a-input placeholder="请输入学号/手机号" v-decorator="['numbers', { rules: [{ required: false }] }]" />
              </a-form-item>
            </a-form>
          </div>
          <a-button v-if="isChangGuiCls" :style="{ marginRight: '10px' }" @click="addStudent">确定</a-button>

          <a-divider :style="{ marginRight: '10px' }" type="vertical" />
          <!-- </perm-box> -->
          <a-checkbox :checked="selectAllCheckbox" @change="selectAll">全选</a-checkbox>
          <a-popover title="注意">
            <template slot="content">
              <p>签到成功后,右上角将会有签到标记!</p>
            </template>
            <a-icon class="exclamationIcon" type="exclamation" />
          </a-popover>
          <perm-box perm="student:signinlog:sign">
            <a-button :style="{ marginLeft: '10px' }" type="primary" :loading="loadingSign" @click="submitStudentSignIn">
              提交签到
            </a-button>
          </perm-box>
        </div>
      </a-row>
    </perm-box>
    <!-- 沟通时间轴 -->
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      title="学员详情"
      :visible="stuInfoModal"
      @cancel="handleStuInfoCancel"
      width="80%"
      class="stuinfo-modal"
      :footer="null"
    >
      <student-info :getStuId="getStuId"></student-info>
    </a-modal>
  </div>
</template>
<script>
const delay = 500 //节流函数的间隔时间,单位毫秒
import { getStuSignInList, SignInStuList } from '@/api/reception/todayplan'
import { recognizeFace } from '@/api/file'
import { getClassInfo } from '@/api/education'
import { saveStuSignInLog, dancePlanAuditionLog, saveAuditionLog, removeAuditionLog } from '@/api/student'
import PermBox from '@/components/PermBox'
import { autoUpload } from '@/tools/oss'
import { getStudentInfo } from '@/api/reception/student'
import StudentInfo from '@/views/reception/studentInfo'
import SignInReport from '@/views/education/modules/signInReport'
import EditTable from '@/components/EditTable'
import ReplenishesPlan from './modules/ReplenishesPlan'
import AuditionLog from './modules/AuditionLog'

const typeOptions = [
  { label: '未识别人员', value: 'unknown', color: '#f5222d', length: '1' },
  // { label: '非本班会员', value: 'schoolStudents', color: '#1890ff', length: '1' },
  // { label: '非本校会员', value: 'notSchoolStudents', color: '#9999FF', length: '1' },
  // { label: '过期会员', value: 'notDateStudents', color: '#fc6', length: '1' },
  { label: '非法会员', value: 'errors', color: '#fc6', length: '1' },
  { label: '正确会员', value: 'correct', color: '#52c41a', length: '1' }
]

const audioColumns = [
  {
    title: '姓名',
    width: 200,
    dataIndex: 'name',
    input: 'input',
    scopedSlots: { customRender: 'name' }
  },
  {
    title: '手机号码',
    width: 200,
    dataIndex: 'phone',
    input: 'input',
    scopedSlots: { customRender: 'phone' }
  },
  {
    title: '备注',
    dataIndex: 'logRemark',
    input: 'input',
    scopedSlots: { customRender: 'logRemark' }
  }
]
export default {
  components: {
    SignInReport,
    PermBox,
    StudentInfo,
    EditTable,
    ReplenishesPlan,
    AuditionLog
  },
  data() {
    return {
      //
      stuColumns: [
        {
          title: '头像',
          dataIndex: 'avatar',
          width: '100px',
          scopedSlots: { customRender: 'avatar' }
        },
        {
          title: '学号',
          width: '100px',
          dataIndex: 'stuNo'
        },
        {
          title: '姓名',
          width: '120px',
          dataIndex: 'stuName',
          scopedSlots: { customRender: 'stuName' }
        },
        {
          title: '手机号码',
          width: '200px',
          dataIndex: 'stuPhone'
        },
        {
          title: '有效期至',
          dataIndex: 'endValidDate',
          customRender: (text, record) => {
            return `${this.$tools.tailor.getDate(text) || '无'}`
          }
        },

        {
          title: '次数/总数',
          dataIndex: 'stuCount',
          width: '300px',
          customRender: (text, record) => {
            return `${record.usedCount}次/${record.totalCount || '不限次数'}`
          }
        }
      ],
      audioColumns,
      audioList: [],
      eidtParams: {
        name: null,
        phone: null,
        logRemark: null
      },
      //
      typeOptions: [],
      defCheckList: ['unknown', 'errors'],
      spinning: false,
      imageUrl: null,
      imageWidth: null,
      imageHeight: null,
      ratio: null,
      imageStyle: {},
      maskList: [],
      uploadLoading: false,
      userSrc: null,
      //节流函数标记位
      loadingSign: false,
      //表单布局数据
      selectAllCheckbox: false,

      //学生提交数据
      studentSelectedArr: [],
      selectedRowKeys: [],
      formValues: {},
      localStuList: [],
      localSelectArr: [],
      //学生签到回填数据
      classStuListdata: [],
      //附件
      fileId: '',
      //stuInfo
      stuInfoModal: false,
      getStuId: null
    }
  },
  props: {
    classId: String,
    danceplanId: String,
    type: String,

    classStuListProps: Array,
    planId: String,
    record: Object
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  computed: {
    isChangGuiCls() {
      return this.record && this.record.eduTypeId === 'E'
    },
    box() {
      return this.$refs.image
    },
    finallyStuArr: {
      get() {
        const { classStuListdata, localStuList } = this
        return classStuListdata.concat(localStuList).unique()
      }
    },
    finallySelectArr: {
      get() {
        const { studentSelectedArr, localSelectArr } = this
        return studentSelectedArr.concat(localSelectArr).unique()
      },
      set(val) {}
    }
  },
  watch: {
    record(nv) {},
    classStuListProps(nv) {
      //将props传入的值赋值给classStuListdata
      this.classStuListdata = this.classStuListProps
      //检查全选按钮是否为全选状态
      this._verifyCheckBox()
    },
    //第一次进来回填学生列表,以及改了classStuListdata后的数据回填
    classStuListdata(nv) {
      this.classStuListdata.forEach(item => {
        if (item.signed === 'Y' && this.studentSelectedArr.indexOf(item.stuCardId) == -1) {
          this.studentSelectedArr.push(item.stuCardId)
        }
      })
    }
  },
  created() {
    this.classStuListdata = this.classStuListProps
    this.classStuListProps.forEach(item => {
      if (item.signed === 'Y' && this.studentSelectedArr.indexOf(item.stuCardId) == -1) {
        this.studentSelectedArr.push(item.stuCardId)
      }
    })
  },
  methods: {
    //补课函数开始
    tabsChange(activeKey) {
      const { getAuditionLog } = this
      if (activeKey == '4') {
        console.log(activeKey)
      }
      if (activeKey == '5') {
        getAuditionLog()
      }
    },
    getAuditionLog() {
      const { danceplanId } = this
      dancePlanAuditionLog({ dancePlanId: danceplanId }).then(res => {
        this.audioList = res.data
      })
    },
    addAuditionLog() {
      const {
        audioList,
        audioList: { length }
      } = this
      const defaultInfo = {
        name: '',
        phone: '',
        logRemark: '',
        id: length,
        isEditing: true
      }
      this.audioList = [defaultInfo, ...audioList]
    },
    saveAuditionLog(item) {
      const { danceplanId } = this
      saveAuditionLog(Object.assign({ dancePlanId: danceplanId }, item)).then(res => {
        this.$notification['success']({
          message: '系统通知',
          description: '操作成功'
        })
        this.getAuditionLog()
        this.$refs.editTable.cancelTableItem()
      })
    },
    deleteAuditionLog(item) {
      const { id } = item
      const _this = this
      this.$confirm({
        title: '系统提示',
        content: '确认删除该条数据吗?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          removeAuditionLog({ auditionLogId: id }).then(res => {
            _this.getAuditionLog()
            _this.$refs.editTable.cancelTableItem()
          })
        }
      })
    },

    //补课函数结束

    changeTableStyle(record) {
      let className = ''
      if (this.isOverdue(record.endValidDate) || this.isOverTimes(record) || !record.payoff) {
        className = 'overdue-table'
      }
      return className
    },

    getStuInfoByMask(e) {},
    initModal() {
      this.typeOptions = []
      this.localSelectArr = []
      this.localStuList = []
      this.imageUrl = null
    },
    //
    changeMask(arr) {
      const { renderImgMask, ratio } = this
      renderImgMask(arr, ratio)
    },
    //上传图片及获取信息
    uploadImage(file) {
      const {
        filePath,
        record: { planId }
      } = this
      // console.log('image', this.$refs.image.clientWidth)
      return new Promise((resolve, reject) => {
        autoUpload(file, 'check-in')
          .then(id => {
            let params = {
              dancePlanId: planId,
              fileId: id
            }
            return params
          })
          .then(recognizeFace)
          .then(res => {
            resolve(res.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    //获取图片本地
    getLocalSrc(file) {
      return new Promise((resolve, reject) => {
        let url = null
        if (window.createObjectURL != undefined) {
          // basic
          url = window.createObjectURL(file)
        } else if (window.URL != undefined) {
          // mozilla(firefox)
          url = window.URL.createObjectURL(file)
        } else if (window.webkitURL != undefined) {
          // webkit or chrome
          url = window.webkitURL.createObjectURL(file)
        }
        if (url) {
          resolve(url)
        } else {
          reject()
        }
      })
    },
    getImgWidth(url) {
      return new Promise((resolve, reject) => {
        const img_url = url
        const img = new Image()
        img.src = img_url
        img.onload = function() {
          const ratio = ~~img.width / ~~img.height
          // resolve(img.height)
          this.imageWidth = img.width
          this.imageHeight = img.height
          const imgObj = {
            width: img.width,
            height: img.height,
            ratio: ratio
          }
          resolve(imgObj)
          // let imgData = {}
          // if (img.height > 500) {
          //   imgData = { height: img.height, width: 'aotu' }
          // }
        }
      })
    },
    setLocalSrc(file) {
      const { getLocalSrc, getImgWidth } = this
      return getLocalSrc(file)
        .then(url => {
          this.imageUrl = url
          return url
        })
        .then(getImgWidth)
    },
    //
    initImgMask() {
      this.maskList = []
    },
    renderImgMask(coordinateArr) {
      const {
        renderImgMask,
        imgData,
        imgObj: { width, height, ratio },
        imageHeight
      } = this
      const { correct, incorrect, errors, unknown } = imgData
      this.initImgMask()
      const colorType = {
        correct: '#52c41a',
        errors: '#fc6',
        unknown: '#f5222d'
      }
      this.imageStyle.height = `500px`

      if (!coordinateArr && coordinateArr.length == 0) {
        return
      }
      coordinateArr.map(str => {
        let data = imgData[str]
        if (str == 'schoolStudents') {
          // data = schoolStudents
        } else if (str == 'notSchoolStudents') {
          // data = notSchoolStudents
        } else if (str == 'errors') {
          data = errors
        }
        data.map(arr => {
          let stuInfo = null
          if (str !== 'unknown') {
            stuInfo = arr[0]
            arr = arr[1]
          }
          let w, h, l, t, s
          l = arr[0] * (500 / height)
          t = arr[1] * (500 / height)
          w = arr[2] * (500 / height)
          h = arr[3] * (500 / height)
          s = {
            width: w + 'px',
            height: h + 'px',
            left: l + (780 - ratio * 500) / 2 + 'px',
            // left: l + 'px',
            top: t + 'px',
            color: `${colorType[str]}`,
            stuInfo: stuInfo
          }
          this.maskList.push(s)
        })
      })
    },
    //常规班添加学员
    //
    beforeUpload(file) {
      const { uploadImage, setLocalSrc, renderImgMask, recognizeSignIn, refreshStuList, isChangGuiCls } = this
      this.spinning = true
      this.typeOptions = []
      refreshStuList()
      Promise.all([uploadImage(file), setLocalSrc(file)])
        .then(res => {
          if (res && res.length == 2) {
            const [result, width] = res
            if (result.code) {
              return false
            }
            this.imgData = result
            this.imgObj = width
            // this.imgWidth = width
            const { correct, errors, unknown } = result
            this.typeOptions = []
            let coordinateArr = []
            if (unknown && unknown.length > 0) {
              this.typeOptions.push({ label: '未识别人员', value: 'unknown', color: '#f5222d', length: unknown.length })
              coordinateArr.push('unknown')
            }
            if (errors && errors.length > 0) {
              this.typeOptions.push({
                label: '非法会员',
                value: 'errors',
                color: '#fc6',
                length: errors.length
              })
              coordinateArr.push('errors')
            }

            if (correct && correct.length > 0) {
              correct.map(item => {
                this._filterPush(item[0])
              })
              this.typeOptions.push({ label: '正确会员', value: 'correct', color: '#52c41a', length: correct.length })
              recognizeSignIn(correct)
            }
            renderImgMask(coordinateArr, width)
          }
        })
        .catch(err => {
          this.imageUrl = null
        })
        .finally(() => {
          this.spinning = false
        })

      return false
    },
    //添加学生
    addStudent() {
      this.form
        .validateFields()
        .then(data => {
          let params = {
            dancePlanId: this.planId,
            stuNo: data.numbers
          }
          return params
        })
        .then(params => {
          return saveStuSignInLog(params)
        })
        .then(res => {
          if (res.code === 200 && res.data && Object.keys(res.data).length !== 0) {
            this._filterPush(res.data)
            this.form.resetFields()
          } else {
            this.$notification['error']({
              message: '错误提示',
              description: '该学员没有符合该班级的卡'
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    //过滤并添加成员(相同id的则不添加)
    _filterPush(data) {
      let hasId = this.finallyStuArr.find(value => {
        return data.stuCardId === value.stuCardId
      })
      if (!hasId) {
        this.localStuList.push(data)
        this.classStuListdata.push(data)
      }
    },
    //识别选择学员是否签到
    isSignin() {
      const { classStuListdata, finallySelectArr, $confirm, submitStudentSignIn } = this
      const _this = this
      return new Promise((resolve, reject) => {
        const signedNo = classStuListdata.filter(item => {
          return item.signed === 'Y'
        }).length
        const selected = finallySelectArr.length
        if (signedNo == selected) {
          resolve()
        } else {
          $confirm({
            title: '系统提示',
            content: '您还有未提交签到的学员是否关闭?',
            okText: '提交签到',
            cancelText: '仍要关闭',
            onOk() {
              submitStudentSignIn()
            },
            onCancel() {
              resolve()
            }
          })
        }
      })
    },

    recognizeSignIn(dataArr) {
      dataArr.map(item => {
        //判断studentSelectedArr有没有item.id,有则不变,没有则添
        if (item && item.length > 0 && this.finallyStuArr.indexOf(item[0].stuCardId) == -1) {
          this.localSelectArr.push(item[0].stuCardId)
        } else {
        }
      })
      // console.log(this.studentSelectedArr)
      //检查全选按钮是否为全选状态
      this._verifyCheckBox()
      // //提交签到
      // // this.submitStudentSignIn('recognize')
    },
    onSelectChange(value) {},
    isOverTimes(item) {
      //<span>次数:{{`${item.usedCount}次/${item.totalCount||'不限次数'}`}}</span>
      if (!item.totalCount || item.totalCount == 0 || item.signed == 'Y') {
        return false
      }
      return ~~item.usedCount === ~~item.totalCount
    },
    isOverdue(item) {
      return !!item ? new Date(item).isOverdue() : false
    },
    setDisabled(record) {
      return {
        props: {
          disabled: this.isOverdue(record.endValidDate) || this.isOverTimes(record) || !record.payoff // Column configuration not to be checked
        }
      }
    },
    // 页面事件处理类
    handleClickBox(item) {
      const isOverdue = this.isOverdue(item.endValidDate)
      if (isOverdue || this.isOverTimes(item) || !item.payoff) {
        return
      }
      if (item.stuCardId) {
        //判断studentSelectedArr有没有item.id,有则删,没有则添
        if (this.finallySelectArr.indexOf(item.stuCardId) === -1) {
          this.studentSelectedArr.push(item.stuCardId)
          this.localSelectArr.push(item.stuCardId)
        } else {
          this.localSelectArr = this.finallySelectArr.filter(i => i !== item.stuCardId)
          this.studentSelectedArr = this.finallySelectArr.filter(i => i !== item.stuCardId)
        }
      } else {
        this.localSelectArr = item
        this.studentSelectedArr = item
      }

      //检查全选按钮是否为全选状态
      this._verifyCheckBox()
    },
    selectAll(e, selectedRows, changeRows) {
      // 如果是勾选状态
      if ((typeof e === 'object' && e.target.checked) || (typeof e === 'boolean' && e)) {
        //先清空,再加满
        this.selectAllCheckbox = true
        this.studentSelectedArr = []
        this.localSelectArr = []
        this.finallyStuArr.forEach(item => {
          if (!this.isOverdue(item.endValidDate) && !this.isOverTimes(item) && item.payoff) {
            this.localSelectArr.push(item.stuCardId)
          }
        })
      } else {
        this.selectAllCheckbox = false
        this.studentSelectedArr = []
        this.localSelectArr = []
      }
    },

    //提交
    submitStudentSignIn(type) {
      let params = {
        studentCardIds: this.finallySelectArr.join()
      }
      this.loadingSign = true
      SignInStuList(params, this.planId)
        .then(res => {
          if (res.code === 200) {
            this.localStuList = []
            this.resetStuForm()
            this.refreshStuList()
            // if (type !== 'recognize') {
            //   this.$notification['success']({
            //     message: '系统通知',
            //     description: '恭喜,操作成功'
            //   })
            // }
            this.$emit('signInStu')
          }
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          setTimeout(() => {
            this.loadingSign = false
          }, 300)
        })
    },

    //重置
    resetStuForm() {
      this.form.resetFields()
      this.studentSelectedArr = []
      this.classStuListdata = []
      this.imageUrl = null
      this.typeOptions = []
    },

    //刷新学生列表fn
    refreshStuList() {
      let params = {
        dancePlanId: this.planId
      }
      this.resetStuForm()
      getStuSignInList(params)
        .then(res => {
          if (res.code === 200 && res.data) {
            this.classStuListdata = res.data
          }
        })
        .catch(() => {
          console.log('出错, SignIn.vue-----refreshStuList')
        })
    },
    //查看学员详情
    showStuInfo(record) {
      if (this.handlePermBox('student:info:view')) {
        const { stuId } = record
        this.getStuId = stuId
        this.stuInfoModal = true
      }
    },
    handleStuInfoCancel() {
      this.stuInfoModal = false
    },

    // 内部工具类
    isSelected(stuCardId) {
      return this.finallySelectArr.indexOf(stuCardId) !== -1
    },
    handlePermBox(str) {
      return this.$tools.checkPerm(str)
    },
    _verifyCheckBox() {
      if (this.finallyStuArr.length === this.finallySelectArr.length) {
        this.selectAllCheckbox = true
      } else {
        this.selectAllCheckbox = false
      }
    }
  }
}
</script>

<style lang="less">
@import '~@/assets/style/index';
.todayPlan-wrapper {
  // padding-top: 10px;
  position: relative;
  height: 640px;

  .signin-btn {
    position: absolute;
    width: 100%;
    bottom: 0;
  }

  .ant-tabs .ant-tabs-left-content {
    padding: 0;
    border: 0;
  }

  .stu-num {
    padding-left: 10px;

    .red {
      color: #f5222d;
    }
  }

  .stu-list {
    width: 300px;
    height: 100%;
    overflow-y: auto;
    float: left;
  }

  .signin-stu {
    margin-left: 300px;
    position: relative;

    .check-group {
      position: absolute;
      width: 100%;
      left: 0;
      z-index: 14;
    }

    .upload-stu {
    }
  }

  .resetBtn {
    color: #108ee9;
    border: 1px solid #108ee9;
  }

  .btn-wrapper {
    .add-form {
      display: inline-block;
      margin-bottom: -38px;
      margin-right: -15px;
    }
  }

  .imgUpload {
    width: 100%;
    height: 100%;
    background-color: #dddddd;

    .avatar-uploader {
      width: 100%;
      height: 100%;
      text-align: center;
      display: block;
      cursor: pointer;

      .img-mask {
        position: relative;

        &::after {
        }
      }

      .ant-upload-btn {
        padding-top: 144px;

        width: 100% !important;
        height: 100% !important;
        display: block;
      }
    }
  }

  .ant-spin-nested-loading > div > .ant-spin {
    background-color: #ddd;
  }

  .exclamationIcon {
    border: 1px solid rgba(0, 0, 0, 0.65);
    border-radius: 50%;
  }

  .student-sign-in {
    height: 500px;
    overflow-y: auto;
    z-index: 999;

    .student-box-wrapper {
      width: 100%;
      height: 70px;
      cursor: pointer;
      position: relative;

      .student-box {
        transition: all @animationTime linear;
        // box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, .2) inset;
        position: absolute;
        top: 5px;
        right: 5px;
        bottom: 0;
        left: 5px;
        border: 1px solid rgb(230, 230, 230);
        box-sizing: border-box;
        background: #fff;
        display: flex;
        flex-direction: column;

        &.selected {
          background: #1ba97b;
          border: 1px solid rgba(0, 0, 0, 0);
          //  box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, .2);
        }

        &.isOverdue {
          background: #fc6;
          border: 1px solid rgba(0, 0, 0, 0);
          cursor: no-drop;

          .student-info {
            > div {
              color: #ffffff;
            }
          }
        }

        .student-content {
          flex: 0 0 80px;
          width: 100%;
          height: 70px;
          display: flex;

          .student-avatar {
            flex: 0 0 60px;
            height: 60px;
            padding: 5px;
            box-sizing: border-box;
            .center();

            .avatar-img {
              padding: 2px;
              box-sizing: border-box;
              border: 1px solid rgb(230, 230, 230);
              border-radius: 50%;
              width: 100%;
              height: 100%;
            }
          }

          .student-info {
            // padding-top: 20px;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            overflow: hidden;

            .student-name {
              transition: all @animationTime linear;
              margin: 0 5px;
              margin-top: -20px;
              color: #333;
              font-size: 14px;
              .ellipsis();

              > span {
              }

              &.selected {
                color: #fff;
              }
            }

            .student-phone {
              transition: all @animationTime linear;
              margin: 0 5px;
              color: #999;
              font-size: 12px;
              .ellipsis();

              &.selected {
                color: #fff;
              }
            }

            .student-state {
              transition: all @animationTime linear;
              margin: 0 5px;
              color: #999;
              font-size: 12px;
              .ellipsis;

              &.selected {
                color: #fff;
              }
            }
          }
        }
      }

      .student-sign {
        z-index: 100;
        position: absolute;
        right: -1px;
        top: -1px;
        /* background: rgba(1,1,1,0); */
        width: 0px;
        height: 0px;
        border-width: 23px;
        border-style: solid;
        border-color: #f1f1f1 #f1f1f1 transparent transparent;

        .student-sign-text {
          position: relative;
          z-index: 105;
          top: -20px;
          left: 2px;
          font-weight: bold;
        }
      }
    }
  }

  /*.table-signin {*/
  /*  height: 550px;*/
  /*  max-height: 550px;*/
  /*  overflow-y: auto;*/
  /*}*/
}
</style>
