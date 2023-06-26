<template>
  <div class="studentinfo-wrapper">
    <!-- 修改 -->
    <a-modal :confirmLoading="loading" :maskClosable="$store.state.modalMaskClickEnable" :destroyOnClose="true"
      :width="600" :title="type == 'edit' ? '修改续卡信息' : '续卡确认'" @ok="editSubmit" @cancel="editCancel"
      v-model="editVisible">
      <a-spin :spinning="spinning">
        <a-form-model ref="ruleForm" :model="form" :rules="rules">
          <a-form-model-item v-bind="defaultLayout" label="往期卡种" prop="toIssueCard">
            <a-select :allowClear="true" v-model="form.toIssueCard" show-search :filter-option="filterOption"
              @change="toIssueCardChange">
              <a-select-option v-for="item in issueCards" :value="item.cardId" :key="item.cardId">
                {{ item.cardMsg }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item v-bind="defaultLayout" label="续卡卡种">
            {{ cardName }}
          </a-form-model-item>
          <a-form-model-item v-bind="defaultLayout" label="续卡分类" prop="sysValConfId">
            <a-select :allowClear="true" v-model="form.sysValConfId" show-search :filter-option="filterOption"
              @change="sysValConfIdChange">
              <a-select-option v-for="item in cardNextList" :value="item.id" :key="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item v-if="sysValConfName != '教练班绩效'" v-bind="defaultLayout" label="续卡班级" prop="sysValConfId">
            <a-input style="cursor: pointer; color: #000;" disabled placeholder="请选择续卡班级" v-model="form.lastClassName">
              <a-icon slot="addonAfter" type="search" @click="openClassPicker" />
            </a-input>
            <classPicker ref="classPicker" @change="onClassChange" />
          </a-form-model-item>
          <a-form-model-item v-bind="defaultLayout" label="续卡老师" prop="cardTea">
            <a-popover v-if="form.cardTea.length > 15">
              <template slot="content">
                {{ form.cardTea }}
              </template>
              <a-input style="cursor: pointer; color: #000;" disabled placeholder="请选择续卡老师" v-model="form.cardTea">
                <a-icon slot="addonAfter" type="search" @click="openChooseTea" />
              </a-input>
            </a-popover>
            <a-input v-else style="cursor: pointer; color: #000;" disabled placeholder="请选择续卡老师" v-model="form.cardTea">
              <a-icon slot="addonAfter" type="search" @click="openChooseTea" />
            </a-input>
          </a-form-model-item>
          <a-form-model-item v-if="sysValConfName == '少儿绩效'" v-bind="defaultLayout" label="续卡类型" prop="cardType">
            <a-select :allowClear="true" v-model="form.cardType">
              <a-select-option v-for="item in cardsTypeChild" :value="item.id" :key="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item v-else-if="sysValConfName == '导师工资提成'" v-bind="defaultLayout" label="续卡类型" prop="cardType">
            <a-select :allowClear="true" v-model="form.cardType">
              <a-select-option v-for="item in cardsTypeTeacher" :value="item.id" :key="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item v-else-if="sysValConfName === '教练班绩效'" v-bind="defaultLayout" label="续卡类型" prop="cardType">
            <a-select :allowClear="true" v-model="form.cardType">
              <a-select-option v-for="item in cardsType" :value="item.id" :key="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <!-- 少儿绩效-私教 少儿绩效-199私教 -->
          <a-form-model-item v-else v-bind="defaultLayout" label="续卡类型" prop="cardType">
            <a-select :allowClear="true" v-model="form.cardType">
              <a-select-option v-for="item in cardsTypeChildPrivateList" :value="item.id" :key="item.id">
                {{ item.cardNextTypeName }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item v-if="sysValConfName == '少儿绩效'" v-bind="defaultLayout" label="绩点" prop="gradePointId">
            <a-select v-model="form.gradePointId">
              <a-select-option v-for="item in gradePointList" :value="item.id" :key="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
            <span v-if="!form.gradePointId">先选择班级</span>
          </a-form-model-item>

          <a-form-model-item v-if="sysValConfName != '导师工资提成'" v-bind="defaultLayout" label="续卡金额" prop="price">
            <a-input-number v-model="form.price" @blur="onPriceChange" />
          </a-form-model-item>
          <a-form-model-item v-if="sysValConfName != '导师工资提成'" v-bind="defaultLayout" label="续卡个数" prop="num">
            <a-input-number v-model="form.num" />
            <span class="ml-10">
              <span v-if="referenceValue">参考值：{{ referenceValue }}</span>
              <span v-else>应收金额：{{ totalPrice }}</span>
            </span>
            <div v-if="sysValConfName == '少儿绩效'">续卡分类 = 少儿绩效，续卡个数 = 续卡金额/应收金额</div>
            <div v-else-if="sysValConfName == '少儿绩效-私教'">续卡分类 = 少儿绩效-私教，续卡个数 = 续卡金额/参考值</div>
            <div v-else-if="sysValConfName == '少儿绩效-199私教'">续卡分类 = 少儿绩效-199私教，续卡个数 = 续卡金额/应收金额</div>
            <div v-else-if="sysValConfName == '教练班绩效'">续卡分类 = 教练班绩效，续卡个数 = 续卡金额/参考值</div>
          </a-form-model-item>
          <!-- 老师选择组件 -->
          <choose-tea ref="choosetea" :multiple="true" :checkType="true" :params="teaParams" teaFields="teacher"
            @getBackData="getTeaData"> </choose-tea>
        </a-form-model>
      </a-spin>
    </a-modal>
  </div>
</template>
<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { PermBox, ChooseTea } from '@/components'
import { cardColumns } from '@/utils/reception/student'
import ClassPicker from './classPicker.vue'
import { listStudentCard, listStuCardNextLog, confirmStuCardNextLog, saveStuCardNextLog } from '@/api/reception/student'
import { removeStudentCard, getStuCardInfo } from '@/api/recep'
import { refundClassStatus, getCardLogPrice, cardNextType, getConfig, getStuCardNextLogTeacher, getCardValue, getNextCardTypeList, getChildReferenceValue, cardNext } from '@/api/education'
import { insertRemark, allCardRemark, deleteRemark, updateRemark, getClassGradePoint } from '@/api/student'
import { mixin } from '@/utils/mixin'
import { listSysValConf } from '@/api/common'
import { refreshAnaSource } from '@/api/intentionStu/adviser'

const defaultLayout = {
  labelCol: {
    sm: {
      span: 4
    }
  },
  wrapperCol: {
    sm: {
      span: 18
    }
  }
}

export default {
  name: 'editContinuedCard',
  components: {
    PermBox,
    ChooseTea,
    ClassPicker,
  },
  props: {
    stuId: String
  },
  mixins: [mixin],
  data() {
    return {
      record: null,
      isContinue: false,
      totalPrice: 0,
      type: '',
      cardName: null,
      cardTypeName: null,
      cardNextLogId: null,
      issueCards: [], //往期卡种下拉
      //续卡分类名称
      sysValConfName: '',
      cardNextList: [], //续卡分类
      defaultLayout,
      spinning: false,
      loading: false,
      rules: {
        toIssueCard: [{ required: true, message: '请选择往期卡种', trigger: 'change' }],
        cardType: [{ required: true, message: '请选择续卡类型', trigger: 'change' }],
        cardTea: [{ required: true, message: '请选择续卡老师', trigger: 'change' }],
        sysValConfId: [{ required: true, message: '请选择续卡分类', trigger: 'change' }],
        price: [{ required: true, message: '请输入金额', trigger: 'blur' }],
        num: [{ required: true, message: '请输入个数', trigger: 'blur' }],
        gradePointId: [{ required: true, message: '请先选择续卡班级，然后获取绩点', trigger: 'blur' }],
      },
      editVisible: false, //修改弹窗
      form: {
        toIssueCard: '',
        cardType: '',
        cardTea: '',
        teacherIds: [],
        cardId: null,
        sysValConfId: '',
        price: '',
        num: '',
        classId: '',
        lastClassName: '',
        gradePointId: '',
      },
      cardsType: [{ id: 'A', name: '本期续卡' }, { id: 'B', name: '往期续卡' }], //续卡类型下拉
      cardsTypeChild: [{ id: 'C', name: '到期续卡' }, { id: 'D', name: '未到期续卡' }, { id: 'E', name: '延期续卡' }], // 少儿绩效续卡类型下拉 固定
      cardsTypeChildConfigList: [], // 少儿绩效叙拉类型下拉 配置
      cardsTypeChildPrivateList: [],
      cardsTypeTeacher: [], //续卡类型下拉
      teaParams: {},
      gradePointList: [],
      referenceValue: null,
    }
  },
  computed: {
    apiCardId() {
      return this.isContinue ? this.record?.cardId : this.record?.id
    },
    isPrivateChildType() {
      return this.sysValConfName == '少儿绩效-私教' || this.sysValConfName == '少儿绩效-199私教'
    }
  },

  watch: {
    // visibleClass(nv) {
    //   if (nv) {
    //     this.$nextTick(() => {
    //       this.form.resetFields()
    //       this.classIdArr = []
    //       this.$refs.uploadSth.reset()
    //       this.banlance = 'init'
    //     })
    //   } else {
    //   }
    // }
  },
  mounted() {
    // if (this.stuId) {
    //   this.loadListData(this.stuId)
    // }
  },

  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  methods: {
    // 往期卡种切换
    toIssueCardChange(e, flag) {
      let issueCards = this.issueCards.filter(item => item.cardId == e)[0]
      getConfig({
        lastCardType: issueCards.cardTypeName,
        newCardType: this.cardTypeName
      }).then(res => {
        if (res.data) {
          if (res.data.sysValConfId) {
            this.form.sysValConfId = res.data.sysValConfId
            this.sysValConfIdChange(this.form.sysValConfId)
          }

          if (res.data.sysValTypeConfId) {
            this.form.cardType = res.data.sysValTypeConfId
            // 少儿绩效需要合并 之前本地写死的的和动态配置的
          }
        }
        this.$forceUpdate()
      })
      getStuCardNextLogTeacher({
        cardId: issueCards.cardId,
        openCardDate: issueCards.openCardDate.slice(0, 10)
      }).then(res => {
        if (res.data) {
          if (res.data.name) this.form.cardTea = res.data.name
          if (res.data.id) this.form.teacherIds = [res.data.id]
        }
        this.$forceUpdate()
      })
    },
    onPriceChange(e) {
      this.referenceValue = null
      if (this.sysValConfName == '教练班绩效') {
        getCardValue({ cardId: this.apiCardId })
          .then(res => {
            this.form.num = res.data ? (this.form.price / res.data).toFixed(2) : ''
            this.referenceValue = res.data
          })
      } else if (this.sysValConfName == '少儿绩效-私教') {
        getChildReferenceValue({ deptId: this.record.stuCardSchoolId }).then(res => {
            let value = res.data.value
            this.form.num = value ? (this.form.price / value).toFixed(2) : ''
            this.referenceValue = value
        })
      }
      // 少儿绩效，少儿绩效-199私教
      else {
        this.form.num = (this.form.price / this.totalPrice).toFixed(2)
      }
    },
    openClassPicker() {
      this.$refs.classPicker.open(this.form.toIssueCard, this.record.createDate)
    },
    onClassChange(record) {
      const { classId, className, teacherInfo, classGradePoint } = record
      let teacherIds = []
      let teacherNames = []
      teacherInfo.forEach(element => {
        teacherIds.push(element.teacherId)
        teacherNames.push(element.teacherName)
      })

      this.form.classId = classId
      this.form.lastClassName = className
      this.form.teacherIds = teacherIds
      this.form.cardTea = teacherNames.join(',')
      if (classGradePoint) {
        this.queryGradePoint()
        this.form.gradePointId = classGradePoint.id 
      }
    },
    // 查询绩点
    queryGradePoint() {
      getClassGradePoint({ classId: this.form.classId }).then(res => {
        this.gradePointList = res.data
      })
    },
    openChooseTea() {
      if (this.form.toIssueCard) {
        this.teaParams = {
          lastCarId: this.form.toIssueCard
        }
        this.$refs.choosetea.open()
      } else {
        this.$notification['error']({
          message: '系统通知',
          description: '请选择往期卡种！'
        })
      }
    },
    sysValConfIdChange(e, flag) {
      this.sysValConfName = this.cardNextList.filter(item => item.id == e)[0]?.name
      this.form.cardType = ''
      // else {
      //   if (this.sysValConfName === '少儿绩效' && (this.form.cardType === 'A' || this.form.cardType === 'B')) this.form.cardType = ''
      // }

      if (this.isPrivateChildType) {
        getNextCardTypeList({ cardTypeId: e }).then(res => {
          this.cardsTypeChildPrivateList = res.data
        })
      }

      // if (this.sysValConfName === '教练班绩效') {
      this.onPriceChange()
      // }
      this.$forceUpdate()
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    getTeaData(data) {
      this.form.cardTea = data
        .map(item => {
          return item.teacherName
        })
        .join('、')
      this.form.teacherIds = data.map(item => {
        return item.teacherId
      })
    },
    editCancel() {
      this.editVisible = false
    },
    editSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let params = {
            cardNextLogId: this.cardNextLogId,
            cardLastId: this.form.toIssueCard,
            cardType: this.form.cardType,
            teacherIds: this.form.teacherIds.join(','),
            sysValConfId: this.form.sysValConfId,
            classId: this.form.classId
          }
          if (this.sysValConfName != '导师工资提成') {
            params.price = this.form.price
            params.num = this.form.num
            if (this.sysValConfName === '少儿绩效') {
              params.gradePointId = this.form.gradePointId
            }
          }
          this.loading = true
          if (this.type == 'edit') {
            params.finId = this.finId
            saveStuCardNextLog(params)
              .then(res => {
                this.editCancel()
                this.$emit('editSubmit')
                this.$notification['success']({
                  message: '系统通知',
                  description: '操作成功'
                })
              })
              .finally((this.loading = false))
          } else {
            confirmStuCardNextLog(params)
              .then(res => {
                this.editCancel()
                this.$emit('editSubmit')
                this.$notification['success']({
                  message: '系统通知',
                  description: '操作成功'
                })
              })
              .finally((this.loading = false))
          }
        }
      })
    },
    open(data, isContinue, type) {
      this.editVisible = true
      this.type = type
      this.edit(data, isContinue)
    },
    async edit(record, isContinue) {
      console.log('续卡 -> ', record)
      this.record = record
      this.isContinue = isContinue
      const res2 = await getCardLogPrice({ cardId: isContinue ? record.cardId : record.id, studentId: record.stuId })
      if (res2.code == 200) {
        // this.form.price = record.cardLogPrice || 0
        this.form.price = res2.data || 0
        let num = Number(record.num)
        // this.form.num = num ? record.num : (this.form.price / record.totalPrice).toFixed(2)
        if (num) {
          this.form.num = record.num
        } else {
          // if (this.sysValConfName == '教练班绩效') {
          //   const cardRes = await getCardValue({ cardId: record.cardId })
          //   this.form.num = cardRes.data ? (this.form.price / cardRes.data).toFixed(2) : 1
          // } else {
          this.form.num = (this.form.price / record.totalPrice).toFixed(2)
          // }
        }
        this.totalPrice = record.totalPrice
      }
      this.finId = record.finId
      this.cardNextLogId = isContinue ? record.id : record.cardNextLogId
      this.cardName = record.cardName
      this.cardTypeName = record.cardTypeName
      this.form.cardType = record.cardType
      this.form.toIssueCard = isContinue ? record.stuCardId : record.lastCardId
      this.form.sysValConfId = record.sysValConfId || ''
      this.form.cardId = record.cardId
      this.form.classId = record.classId
      this.form.lastClassName = record.lastClassName
      this.form.gradePointId = record.gradePointId

      this.form.cardTea = record.teacher
        .map(item => {
          return item.teacherName
        })
        .join(',')
      this.form.teacherIds = record.teacher.map(item => {
        return item.teacherId
      })
      this.editVisible = true
      this.spinning = true
      const res = await listStuCardNextLog({ cardId: isContinue ? record.cardId : record.id, stuId: record.stuId })
      if (res.code == 200) {
        this.issueCards = res.data.map(item => {
          if (item.endDate) {
            let date = item.endDate.split(' ')[0]
            item.cardMsg = `${item.stuCardNo}${item.cardName}(${date})`
          } else {
            item.cardMsg = `${item.stuCardNo}${item.cardName}`
          }
          return item
        })
      }
      const res3 = await cardNextType()
      if (res3.code == 200) {
        this.cardNextList = res3.data || []
      }
      const res1 = await listSysValConf('cardNext')
      if (res1.code == 200) {
        this.cardsTypeTeacher = res1.data || []
        this.cardsTypeChildConfigList = res1.data || []
        // this.cardsTypeChild = [...this.cardsTypeChild, ...res1.data]
        if (this.form.sysValConfId) {
          this.sysValConfIdChange(this.form.sysValConfId)
        } else {
          this.sysValConfName = ''
        }
      }
      // cardNext().then(res => {
      //     this.cardsTypeChildConfigList = res.data
      // })

      this.form.cardType = record.cardType
      if (this.sysValConfName == '教练班绩效') {
        this.onPriceChange()
      } else if (this.sysValConfName === '少儿绩效') {
        this.queryGradePoint()
      }

      this.spinning = false
    }
  }
}
</script>

<style scoped lang="less">
td {
  border: 1px solid #ddd;
  line-height: 30px;
  width: 300px;
  text-align: center;
}
</style>
