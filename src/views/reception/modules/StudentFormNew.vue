<template>
  <div class="student-form">
    <div class="studentInfo">
      <template>
        <a-select
          :open="isOpen"
          v-model.trim="queryParam.keyWord"
          mode="multiple"
          label-in-value
          :placeholder="searchPlaceHolder"
          :dropdownMatchSelectWidth="false"
          style="width: 400px;"
          :filter-option="false"
          @change="handleChange"
          @search="handleSearchInput"
          :not-found-content="fetching ? undefined : null"
        >
          <a-spin :spinning="fetching" slot="notFoundContent" size="small" />
          <a-select-option v-for="(d, index) in stuList" :key="d.id ? d.id : 'ziyuan' + index">
            {{ d.memberMsg }}
          </a-select-option>
        </a-select>
        <span style="cursor:pointer;" @click="handleSearch">搜索</span>
        <a-button v-if="showAdd" type="primary" class="ml20" @click.native="addStudent()"> 新增学员 </a-button>
      </template>
    </div>
    <div class="StuInformation mt20 pd20">
      <!-- <div class="between"> -->
      <!-- <a-spin :spinning="stuCardTableLoading" /> -->
      <template v-if="studentData && JSON.stringify(studentData) != '{}'">
        <div :class="showMore ? 'overflow wrap' : 'wrap'">
          <div class="flex item-height">
            姓名
            <div class="importText ml20">{{ studentData.stuName }}</div>
          </div>
          <div class="flex item-height">
            手机号
            <div class="importText ml20">{{ studentData.stuPhone }}</div>
          </div>
          <div class="flex item-height">
            顾问
            <div class="importText ml20 mr10">{{ studentData.adviserName || '无' }}</div>
          </div>
          <div v-show="showMore" class="flex item-height">
            人群分类
            <div class="importText ml20 mr10">{{ studentData.stuType === 'A' ? '成人' : studentData.stuType === 'B' ? '少儿' : '未知' }}</div>
          </div>
          <div class="flex item-height" v-show="showMore">
            资源来源
            <div class="importText ml20 mr10">
              {{ studentData.sourceName || '无' }}
            </div>
          </div>
          <div class="flex item-height">
            分馆
            <div class="importText ml20 mr10">{{ studentData.branchName || '无' }}</div>
          </div>
          <div v-show="showMore" class="flex item-height">
            微信
            <div class="importText ml20 mr10">{{ studentData.stuWechat || '无' }}</div>
          </div>
          <div v-show="showMore" class="flex item-height">
            QQ号
            <div class="importText ml20 mr10">{{ studentData.stuQQ || '无' }}</div>
          </div>
          <div v-show="showMore" class="flex item-height">
            性别
            <div class="importText ml20 mr10">{{ studentData.stuSex === 'A' ? '男' : '女' || '无' }}</div>
          </div>
          <div v-show="showMore" class="flex item-height">
            省市
            <div class="importText ml20 mr10">{{ studentData.stuArea || '无' }}</div>
          </div>
          <div v-show="showMore" class="flex item-height">
            备注
            <div class="importText ml20 mr10">{{ studentData.stuRemark || '无' }}</div>
          </div>
        </div>
        <div class="flex">
          <!-- 其他编辑（修改不限制） -->
          <perm-box perm="student:info-nolimit:save">
            <div class="aButton" v-if="showAdd" @click="editStuMsg('A')">修改</div>
          </perm-box>
          <!-- 前台编辑（只允许修改一次人群） -->
          <perm-box perm="student:info:save">
            <div class="aButton ml20" v-if="showAdd" @click="editStuMsg('B')">修改(前台)</div>
          </perm-box>
          <div class="aButton ml20" @click="handleShowMore">{{ showMore ? '收起' : '查看更多' }}</div>
        </div>
      </template>
      <template v-if="!stuCardTableLoading && (!studentData || JSON.stringify(studentData) == '{}')">
        <a-row>
          <a-col :span="24" class="importText">
            <div class="flex">暂无信息</div>
          </a-col>
        </a-row>
      </template>
    </div>
    <div class="mt10" v-if="courseType == 0 && studentData && JSON.stringify(studentData) != '{}'">
      <div class="flex item-height">
        <div class="required">是否试课</div>
        <div class="importText ml20 mr10">
          <a-radio-group v-model="studentData.stuAudition">
            <a-radio value="A">是</a-radio>
            <a-radio value="B">否</a-radio>
          </a-radio-group>
        </div>
      </div>
    </div>
    <!-- 添加学生,修改学生modal层 -->
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :width="1100"
      :title="title"
      :visible="visible"
      @ok="handleOkNew"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
    >
      <StudentForm ref="studentForm" :studentLimit="studentLimit" :studentData="studentDatas" :isApply="false"></StudentForm>
    </a-modal>
  </div>
</template>
<script>
import StudentForm from './StudentForm.vue'
import { verifyStudent, getStuOrStuUser } from '@/api/recep'
import { saveStudentLimit, saveStudentNoLimit } from '@/api/reception/student'
import { filterEmptyObject } from '@/utils/util'
import { isArray } from 'lodash'
import { PermBox } from '@/components'
export default {
  props: {
    quickApplayShow: {
      type: Boolean,
      default: false
    },
    studentData: Object,
    routerId: {
      type: String,
      default: null
    },
    isApply: {
      type: Boolean,
      default: false
    },
    showAdd: {
      type: Boolean,
      default: true
    },
    courseType: {
      type: Number,
      required: false
    }
  },
  components: {
    StudentForm,
    PermBox
  },
  data() {
    return {
      studentLimit: 'B',
      showMore: false, //查看更多学员信息
      //新增学员
      studentDatas: {},
      visible: false,
      title: '新增学员',
      confirmLoading: false,
      //选择学员
      fetching: false,
      searchPlaceHolder: '请输入学员手机号、QQ号、微信号',
      isOpen: false, //是否展开搜索学员下拉框
      searchPramas: '',
      stuCardTableLoading: false,
      queryParam: {
        keyWord: []
      },
      stuList: [],
      parentId: null
    }
  },
  watch: {
    routerId(nv, ov) {
      nv ? this.getstudentData(this.routerId) : ''
    },
    studentData(nv, ov) {}
  },
  beforeCreate() {},
  mounted() {
    // this.dataBacking(this.studentData)
  },
  created() {
    this.routerId ? this.getstudentData(this.routerId) : ''
    // 添加亲属号
    this.addParentingCard()
  },
  methods: {
    handleShowMore() {
      this.showMore = !this.showMore
    },
    editStuMsg(limit) {
      this.studentLimit = limit
      this.title = '编辑学员'
      this.studentDatas = JSON.parse(JSON.stringify(this.studentData))
      this.visible = true
    },
    handleOk() {
      let result = this.studentData
      //处理生日日期信息
      if (result.stuBirthday) {
        result.stuBirthday = this.$tools.tailor.getDate(result.stuBirthday)
      }
      result.avatar = this.userAvaId || null
      result.stuArea = !!result.stuArea ? (isArray(result.stuArea) ? result.stuArea.join(',') : result.stuArea) : null
      //处理顾问信息
      result.adviserId = this.queryParam.masterId || this.studentData.adviserId || null
      result.id = this.stuId
      result.stuUserId = this.stuUserId

      return result
    },
    handleOkNew(e) {
      let msg = '操作成功'
      let editData = this.$refs.studentForm.handleOk()
      // editData.id = editData.id ? editData.id : this.studentId
      if (this.parentId) editData.parentId = this.parentId
      let filterData = filterEmptyObject(editData)
      // filterData.modifyUserType = this.studentLimit
      console.log(7777, this.studentLimit)
      let request = this.studentLimit == 'A' ? saveStudentNoLimit : saveStudentLimit
      this.$refs.studentForm
        .validateData()
        .then(() => {
          this.confirmLoading = true
          return request(filterData)
        })
        .then(res => {
          if (res.code === 200) {
            if (this.title == '编辑学员') {
              this.getstudentData(this.studentData.id)
            } else {
              this.getstudentData(res.data.id)
            }
            this.$notification.success({
              message: '系统通知',
              description: msg
            })
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
    addStudent(studentDatas = {}) {
      //要调用清空data的方法
      this.title = '新增学员'
      this.studentDatas = studentDatas
      this.visible = true
    },
    addStudent2() {
      //要调用清空data的方法
      this.title = '新增学员'
      let studentInfo = this.stuList.filter(item => {
        return !item.id
      })[0]
      this.studentDatas = studentInfo
      this.visible = true
    },
    //搜索学员
    handleChange(value) {
      if (value.length > 0) {
        if (value[0].label.indexOf('(资源)') != -1 && value[0].key.indexOf('ziyuan') != -1) {
          this.isOpen = false
          this.addStudent2(value[0])
          return
        }
      }
      if (value.length > 1) {
        this.queryParam.keyWord = [value[value.length - 1]]
      }
      if (this.queryParam.keyWord.length) {
        this.getstudentData(value[value.length - 1].key)
      } else {
        this.$emit('hasCards', { student: {}, studentCards: [] })
      }
      this.isOpen = false
      this.searchPlaceHolder = '请输入学员手机号、QQ号、微信号'
    },
    getstudentData(targetId) {
      let params = { targetId }
      if (this.isApply) params.isAll = true
      verifyStudent(params).then(res => {
        const { student } = res.data
        if (student.id) {
          this.stuId = student.id
          res.data.type = 'stuId'
          this.$emit('hasCards', res.data)
        } else {
          this.title = '新增学员'
          this.studentLimit = 'B'
          let studentInfo = student
          this.studentDatas = studentInfo
          this.visible = true
        }
      })
    },
    handleSearchInput(value) {
      this.searchPramas = value
      this.searchPlaceHolder = value
    },
    //学生卡
    handleSearch() {
      let value = this.searchPramas
      //去除两头空格
      value = value.replace(/^\s*|\s*$/g, '')
      if (value) {
        if (this.fetching) return
        this.fetching = true
        getStuOrStuUser({ keyWord: value })
          .then(res => {
            if (res.code === 200) {
              this.stuList = res.data.student.map(item =>
                Object.assign(item, {
                  memberMsg:
                    (item.stuName || '未知') +
                    (item.stuPhone ? '/' + item.stuPhone : '') +
                    (item.stuQQ ? '/' + item.stuQQ : '') +
                    (item.stuWechat ? '/' + item.stuWechat : '') +
                    '(' +
                    (item.id ? '学员' : '资源') +
                    ')'
                })
              )
              if(this.stuList.length===0){
                this.addStudent({stuPhone:value})
              }else{
                this.isOpen = true
              }
            }
          })
          .finally(() => (this.fetching = false))
      }
    },
    addParentingCard() {
      let { parentId, stuPhone } = this.$route.query
      if (parentId && stuPhone && this.$route.path.indexOf('stuApply') !== -1) {
        this.parentId = parentId
        this.addStudent({ stuPhone })
      }
    }
  }
}
</script>

<style scoped lang="less" type="text/less">
@import '~@/assets/style/index';
.studentInfo {
  overflow-x: auto;
  /deep/.ant-select-selection {
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
  }
  > span {
    cursor: pointer;
    display: inline-block;
    background: #19a97b;
    padding: 6px 10px 5px;
    color: #fff;
    border-bottom-right-radius: 4px;
    border-top-right-radius: 4px;
  }
}
/* 滚动条样式 */

.studentInfo::-webkit-scrollbar {
  height: 1px;
  background-color: #fff;
}

.studentInfo::-webkit-scrollbar-track {
  background-color: #fff;
}

.studentInfo::-webkit-scrollbar-thumb {
  background-color: #fff;
}
.StuInformation {
  background-color: @theme-bottom-color;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .importText {
    font-weight: bold;
  }
}
.wrap {
  // width: calc(100% - 120px);
  flex-wrap: wrap;
  display: flex;
  overflow: hidden;
  > div {
    padding-right: 25px;
  }
}
.overflow {
  height: auto;
}
/deep/.ant-select-selection--multiple {
  max-height: 32px;
}
.required:before {
  display: inline-block;
  margin-right: 0.04rem;
  color: #f5222d;
  font-size: 0.14rem;
  font-family: SimSun, sans-serif;
  line-height: 1;
  content: '*';
}
</style>
