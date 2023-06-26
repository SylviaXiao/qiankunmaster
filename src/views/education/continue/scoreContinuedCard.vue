<template>
  <div class="studentinfo-wrapper">
    <!-- 修改 -->
    <a-modal
      :confirmLoading="loading"
      :maskClosable="$store.state.modalMaskClickEnable"
      :destroyOnClose="true"
      :width="800"
      title="续卡确认"
      v-model="editVisible"
      @ok="handleConfirm"
      @cancel="editVisible = false"
    >
      <a-spin :spinning="spinning">
        <a-form-model ref="ruleForm" :model="form" :rules="rules">
          <a-form-model-item v-bind="defaultLayout" label="往期卡种">
            <div>{{ form.signCardNo + form.signCardName }}</div>
          </a-form-model-item>
          <a-form-model-item v-bind="defaultLayout" label="续卡卡种">
            <div>{{ form.renewalCardNo + form.renewalCardName }}</div>
          </a-form-model-item>
          <a-form-model-item v-bind="defaultLayout" label="续卡分类" prop="sysValConfId">
            <a-select v-model="form.sysValConfId" disabled allowClear show-search>
              <a-select-option v-for="item in cardNextList" :value="item.id" :key="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item v-bind="defaultLayout" label="续卡类型" prop="cardType">
            <a-select v-model="form.cardType" allowClear>
              <a-select-option v-for="item in cardsType" :value="item.value" :key="item.value" :disabled="item.disabled">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item v-bind="defaultLayout" label="续卡老师" prop="teachers">
            <a-input class="teacher-input" v-model="form.teachers" disabled placeholder="请选择续卡老师">
              <a-icon slot="addonAfter" type="search" @click="openChooseTeacher" />
            </a-input>
            <div>{{ form.teachers }}</div>
          </a-form-model-item>

          <a-form-model-item v-bind="defaultLayout" label="续卡金额" prop="price">
            <a-input-number :min="0" v-model="form.price" @blur="handlePriceChange" />
          </a-form-model-item>
          <a-form-model-item v-bind="defaultLayout" label="续卡个数" prop="num">
            <a-input-number  v-model="form.num" />
          </a-form-model-item>
          <!-- 老师选择组件 -->
          <choose-tea ref="choosetea" :multiple="true" :checkType="true" :params="teaParams" teaFields="teacher" @getBackData="getTeachersData"> </choose-tea>
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
import { listStudentCard, listStuCardNextLog, confirmStuCardNextLog, saveStuCardNextLog } from '@/api/reception/student'
import { removeStudentCard, getStuCardInfo } from '@/api/recep'
import { refundClassStatus, getCardLogPrice, cardNextType, getConfig, getStuCardNextLogTeacher, getCardValue } from '@/api/education'
import { insertRemark, allCardRemark, deleteRemark, updateRemark } from '@/api/student'
import { mixin } from '@/utils/mixin'
import { listSysValConf } from '@/api/common'

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

export default {
  name: 'editContinuedCard',
  components: {
    PermBox,
    ChooseTea
  },
  mixins: [mixin],
  props: {
    stuId: String
  },
  data() {
    return {
      scoreData: {},
      form: { },
      rules: {
        // cardTea: [{ required: true, message: '请选择续卡老师', trigger: 'change' }],
        sysValConfId: [{ required: true, message: '请关闭弹窗重新进入', trigger: 'change' }],
        cardType: [{ required: true, message: '请选择', trigger: 'change' }],
        teachers: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
        price: [{ required: true, message: '请输入金额', trigger: 'blur' }],
        num: [{ required: true, message: '请输入个数', trigger: 'blur' }]
      },

      totalPrice: 0,
      type: '',
      cardName: null,
      cardTypeName: null,
      cardNextLogId: null,
      issueCards: [], //往期卡种下拉
      sysValConfName: '教练班绩效',
      cardNextList: [], //续卡分类
      defaultLayout,
      spinning: false,
      loading: false,

      editVisible: false, //修改弹窗

      cardsType: [
        { name: '本期续卡', value: 'A' },
        { name: '往期续卡', value: 'B' }
        // { name: '到期续卡', value: 'C', disabled: true },
        // { name: '未到期续卡', value: 'D', disabled: true },
        // { name: '延期续卡', value: 'E', disabled: true }
      ], //续卡类型下拉
      cardsTypeChild: [{ id: 'C', name: '到期续卡' }, { id: 'D', name: '未到期续卡' }, { id: 'E', name: '延期续卡' }], //续卡类型下拉
      cardsTypeTeacher: [], //续卡类型下拉
      teaParams: {}
    }
  },

  mounted() {
    // if (this.stuId) {
    //   this.loadListData(this.stuId)
    // }
  },

  methods: {
    resetForm() {
      this.form = {}
    },
    open(data) {
      this.editVisible = true
      this.resetForm()
      this.scoreData = data
      const {
        studentInfoId,
        card = {},
        renewalCard
      } = data
      let { cardId, renewalCardNo, cardNextLogId, cardLastId, renewalCardName,cardName ,cardStatus, cardType, price, num, finId } = renewalCard
      this.form = {
        studentInfoId,
        cardId,
        cardNextLogId,
        cardLastId,
        finId,
        signCardNo : card?.signCardNo || '',
        signCardName: card?.signCardName || '',
        sysValConfId: null,
        cardType: cardType === 'A' || cardType === 'B' ? cardType : null,
        renewalCardNo,
        renewalCardName: renewalCardName || cardName,
        teachers: null,
        teacherIds: [],
        price,
        num
      }
      this.getdCardNext()
      //   this.getCardLog()
      //   this.getSysValCof()
    },
    async getdCardNext() {
      const res = await cardNextType()
      this.cardNextList = res.data || []
      this.cardNextList.forEach(option => {
        const { id, name } = option
        if (name == '教练班绩效') {
          this.form.sysValConfId = id
        }
      })
    },
    // async getCardLog() {
    //     const {cardId,studentInfoId} = this.form
    //     const res = await getCardLogPrice({ cardId, studentId: studentInfoId })
    // },
    // async getSysValCof() {
    //   const res = await listSysValConf('cardNext')
    //   this.cardsTypeTeacher = res.data || []
    // },

    handlePriceChange(e) {
      getCardValue({ cardId: this.form.cardId }).then(res => {
        const { data } = res
        if (data != null && data != 0) {
          this.form.num = data ? (this.form.price / data).toFixed(2) : 1
        } else {
          this.form.num = null 
        }
      })
    },
    openChooseTeacher() {
      if (this.form.cardLastId) {
        this.teaParams = {
          lastCarId: this.form.cardLastId
        }
        this.$refs.choosetea.open()
      } else {
        this.$notification['error']({
          message: '系统通知',
          description: '请选择往期卡种！'
        })
      }
    },
    getTeachersData(data) {
      this.form.teachers = data
        .map(item => {
          return item.teacherName
        })
        .join('、')
      this.form.teacherIds = data.map(item => {
        return item.teacherId
      })
    },
    async handleConfirm() {
      this.$refs.ruleForm.validate(valid => {
        if (!valid) return false
        const {cardNextLogId,cardLastId, finId, cardType, sysValConfId, teacherIds, price, num} = this.form
        let params = {
          cardNextLogId,
          cardLastId,
          finId,
          cardType,
          teacherIds: teacherIds.join(','),
          sysValConfId,
          price,
          num
        }
        // console.log('确认续卡提交参数', params)
        this.loading = true
        confirmStuCardNextLog(params)
          .then(res => {
            this.editVisible = false
            this.$emit('change')
            this.$message.success('操作成功')
          })
          .finally((this.loading = false))

        // if (this.type == 'edit') {
        //   params.finId = this.finId
        //   saveStuCardNextLog(params)
        //     .then(res => {
        //       this.editCancel()
        //       this.$emit('editSubmit')
        //       this.$notification['success']({
        //         message: '系统通知',
        //         description: '操作成功'
        //       })
        //     })
        //     .finally((this.loading = false))
        // } else {
        //   confirmStuCardNextLog(params)
        //     .then(res => {
        //       this.editCancel()
        //       this.$emit('editSubmit')
        //       this.$notification['success']({
        //         message: '系统通知',
        //         description: '操作成功'
        //       })
        //     })
        //     .finally((this.loading = false))
        // }
      })
    },

    async edit(record, isContinue) {
      this.finId = record.finId
      this.cardNextLogId = isContinue ? record.id : record.cardNextLogId
      this.cardName = record.cardName
      this.cardTypeName = record.cardTypeName
      this.form.cardType = record.cardType
      this.form.toIssueCard = isContinue ? record.stuCardId : record.lastCardId
      this.form.sysValConfId = record.sysValConfId || ''
      this.form.cardId = record.cardId

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

      this.spinning = false
    }
  }
}
</script>

<style scoped lang="less">
.teacher-input {
  cursor: pointer;
  color: '#000';
}

td {
  border: 1px solid #ddd;
  line-height: 30px;
  width: 300px;
  text-align: center;
}
</style>
