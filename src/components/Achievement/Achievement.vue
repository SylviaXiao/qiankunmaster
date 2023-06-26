<template lang="html">
  <div class="achievement-wrapper">
    <a-form :form="form">
      <!-- 业绩归属  -->
      <a-row>
        <a-col :span="wrapperWidth">
          <a-form-item
            v-for="(k, index) in form.getFieldValue('keys')"
            :key="k"
            v-bind="index === 0 ? formItemLayout : formItemLayoutWithOutLabel"
            :label="index === 0 ? '业绩归属 : ' : ''"
            :required="false">
            <a-input-group style="width: 100%" compact>
              <a-input-search
                disabled
                v-decorator="[`achievementName[${k}]`]"
                placeholder="点右侧图标选择"
                style="width: 40%"
                @search="achievementNameClick(`achievementName[${k}]`,k)"
              />
              <a-input-number
                class="achievementValue"
                placeholder="权重"
                style="width: 25%"
                v-decorator="[
                   `achievementValue[${k}]`,
                   {rules: [{ type: 'number', message: '请输入正确的权重值(1~100)' }]}
                 ]"
                :min="1" :max="100"/>
              <span style="width: 15%" class="percent-sign">%</span>
              <span class="dynamic-delete-button-wrpper">
                <a-icon
                  v-if="form.getFieldValue('keys').length > 1"
                  class="dynamic-delete-button"
                  type="minus-circle-o"
                  :disabled="form.getFieldValue('keys').length === 1"
                  @click="() => remove(k,index)"/>
              </span>
            </a-input-group>
          </a-form-item>


          <!-- 归属说明 -->
          <a-form-item
            v-bind="formItemLayout"
            label="归属说明 : ">
            <a-textarea
              style="width: 100%;"
              placeholder="请输入归属说明"
              :rows="4"
              v-decorator="[
                'achievementRemark',
                {rules: [{ required: false, message: '请输入归属说明' }]}
              ]"/>
          </a-form-item>

        </a-col>
        <a-col :span="4">
          <a-button
            class="add-achievement"
            type="dashed"
            @click="add">
            <a-icon type="plus"/>
            分单
          </a-button>
        </a-col>
        <a-col :span="24">
          <!-- <a-divider orientation="right"><span :style="{color:'#e8e8e8'}">修改客服业绩</span></a-divider> -->
          <a-form-item
            v-if="showStu"
            v-bind="formItemLayout2"
            label="意向学员 : ">
            <a-input-search
              disabled
              v-decorator="[
                 `adviserStu`,
                 {rules: [{required: false, message: '请选择意向学员'}]}
               ]"
              placeholder="点右侧图标选择"
              style="width: 40%"
              @search="selectAdviserStu"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <i-modal
      ref="imodal"
      :multiple="false"
      userType="master"
      @getBackData="getBackData"
    ></i-modal>
    <chooseAdviser ref="chooseAdviser" @getChoose="getAdviser"></chooseAdviser>
  </div>
</template>

<script>
let id = 0
import IModal from '@/components/InnerModal/modal.vue'
import chooseAdviser from './chooseAdviser.vue'
export default {
  components: {
    chooseAdviser,
    IModal
  },
  props: {
    showStu: {
      type: Boolean,
      default: false
    },
    wrapperWidth: {
      type: String,
      default: '12'
    },
    achievementData: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  mounted() {
    this.backingUser()
  },
  watch: {
    achievementData(nv,ov) {
      if(ov){
        this.backingUser()
      }

    }
  },
  data() {
    return {
      achievementName: '',
      idIndex: 0,
      formResult: {},
      formItemLayout: {
        labelCol: {
          sm: { span: 6 }
        },
        wrapperCol: {
          sm: { span: 18 }
        }
      },
      formItemLayout2: {
        labelCol: {
          sm: { span: 5 }
        },
        wrapperCol: {
          sm: { span: 18 }
        }
      },
      formItemLayoutWithOutLabel: {
        wrapperCol: {
          sm: { span: 18, offset: 6 }
        }
      },
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
    this.form.getFieldDecorator('keys', { initialValue: [0], preserve: true })
    this.form.getFieldDecorator('achievementId', { initialValue: [], preserve: true })
  },
  methods: {
    getAdviser(selectedRows) {
      let record = selectedRows[0]
      this.form.setFieldsValue({'adviserStu':record.userName||record.userQQ||record.userPhone||record.userWechat})
      this.stuUserId = record.id
      this.formResult.stuUserId = record.id
    },
    //选择意向学员
    selectAdviserStu() {
      this.$refs.chooseAdviser.openModal()
    },
    //数据回填
    backingUser() {
      this.reset()
      //赋值业绩归属
      if(this.achievementData.length === 0) {
        return
      } else {
        const { form } = this
        let len = this.achievementData.length
        let achievementIdArr = []
        let achievementValueArr = []
        let achievementNameArr = []
        let achievementRemarkArr = []
        let keysArr = []
        //赋值
        this.achievementData.forEach((item, index) => {
          achievementIdArr.push(item.id)
          achievementValueArr.push(item.percent)
          achievementNameArr.push(item.name)
          achievementRemarkArr.push(item.remark)
          keysArr.push(index)
        })
        //回填
        form.setFieldsValue({
          keys: keysArr
        })
        this.$nextTick(()=> {
          form.setFieldsValue({
            achievementId: achievementIdArr,
            achievementValue: achievementValueArr,
            achievementName:achievementNameArr,
            achievementRemark:achievementRemarkArr[0],
          })
        })
      }
      //赋值意向学员
    },
    //点击选人按钮
    achievementNameClick(achievementName, index) {
      this.achievementName = achievementName
      this.idIndex = index
      this.$refs.imodal.open()
    },

    getBackData(data, type) {
      let key = this.achievementName
      let keyId = this.achievementId
      const achievementIdArr = this.form.getFieldValue('achievementId')
      let newAchievementIdArr = [...achievementIdArr]
      newAchievementIdArr[this.idIndex] = data.id
      this.form.setFieldsValue({ [key]: data.name, achievementId: newAchievementIdArr })
    },

    getFormData() {
      return this.form.validateFields().then(() => {
        if (this.validate()) {
          this.buildResult()
          return this.formResult
        } else {
          return Promise.reject('验证错误')
        }
      })
    },

    buildResult() {
      let formObj = this.form.getFieldsValue()
      if (formObj.achievementRemark) this.formResult.achievementRemark = formObj.achievementRemark
      if (formObj.achievementName.length>0) {
        this.formResult.achievements = []
        formObj.achievementName.forEach((item, index) => {
          let temObj = {}
          if (item && formObj.achievementValue[index]) {
            temObj.id = formObj.achievementId[index]
            temObj.percent = formObj.achievementValue[index]
            this.formResult.achievements.push(temObj)
          }
        })
      }
      this.formResult.achievements = JSON.stringify(this.formResult.achievements)
    },
    achievementNameClick(achievementName, index) {
      this.achievementName = achievementName
      this.idIndex = index
      this.$refs.imodal.open()
    },
    add() {
      const { form } = this
      const keys = form.getFieldValue('keys')
      const nextKeys = keys.concat(++id)
      form.setFieldsValue({
        keys: nextKeys
      })
    },
    remove(k, index) {
      const { form } = this
      //删除数组achievementId对应的index
      const achievementIdArr = form.getFieldValue('achievementId')
      let newAchievementIdArr = [...achievementIdArr]
      newAchievementIdArr[k] = undefined
      form.setFieldsValue({
        achievementId: newAchievementIdArr
      })

      const keys = form.getFieldValue('keys')
      if (keys.length === 1) {
        return
      }

      form.setFieldsValue({
        keys: keys.filter(key => key !== k)
      })
    },

    validate() {
      const achievementValue = this.form.getFieldValue('achievementValue')
      const achievementName = this.form.getFieldValue('achievementName')
      let flag = true
      //遍历name检查value
      achievementName.forEach((item, index) => {
        if (item) {
          if (!achievementValue[index]) {
            this._noticeText('业绩归属后请填入权重值')
            flag = false
          }
        }
      })
      //遍历value检查name
      achievementValue.forEach((item, index) => {
        if (item) {
          if (!achievementName[index]) {
            this._noticeText('权重值前未加业绩归属人员')
            flag = false
          }
        }
      })
      let totalPercent = 0
      achievementValue.forEach((item, index) => {
        if (item) {
          totalPercent += ~~item
        }
        if(totalPercent>100) {
          flag = false
        }
      })
      return flag
    },
    reset() {
      //id归零
      id=0
      //清空stuUserId
      this.formResult = {}
      //清空表单数据
      this.form.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/style/index';
.achievement-wrapper{
  .add-achievement {
    position: relative;
    top:3px;
  }
  .dynamic-delete-button-wrpper {
    margin-left: 5px;
    line-height: 30px;
  }
  .percent-sign {
    box-sizing: border-box;
    padding: 8.4px 11px;
    font-size: 14px;
    font-weight: normal;
    line-height: 1;
    color: rgba(0, 0, 0, 0.65);
    text-align: center;
    background-color: #fafafa;
    border: 1px solid #d9d9d9;
    position: relative;
    -webkit-transition: all 0.3s;
    transition: all 0.3s;
  }
}
</style>
