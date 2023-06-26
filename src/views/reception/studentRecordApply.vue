<template>
  <div class="test-address-wrapper">
    <div class="cert_info">
      <img src="~@/assets/record/record.png" class="icon" style="padding:0;" />
    </div>
    <div class="record">
      <div class="record_info">
        <a-form :form="form">
          <a-form-item
            label="学员姓名"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input placeholder="请输入姓名"  disabled
                     v-decorator="['stuName',{ rules: [{ required: true, message: '请输入姓名' }] },]"/>
          </a-form-item>
          <a-form-item
            label="联系方式"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input placeholder="请输入联系方式"  disabled
                     v-decorator="['stuPhone',{ rules: [{ required: true, message: '请输入联系方式' }] },]"/>
          </a-form-item>
          <a-form-item
            label="报名年龄"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input-number placeholder="请输入报名年龄" :min="0" :max="100" :step="1" :precision="0"
                            v-decorator="['stuAge',{ rules: [{ required: true, message: '请输入报名年龄' }] },]"/>
          </a-form-item>

          <a-form-item label="报名班型" >
            <a-select
              mode="multiple"
              v-decorator="['typeName',{ rules: [{ required: true, message: '请选择报名班型' }] },]"
              placeholder="请选择报名班型"
            >
              <a-select-option  v-for="(item,index) in classTypeList" :key="index" :value="item.name" >
                {{item.name}}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="报名舞种" >
            <a-select
              mode="multiple"
              v-decorator="['danceName',{ rules: [{ required: true, message: '请选择报名舞种' }] },]"
              placeholder="请选择报名舞种"
            >
              <a-select-option  v-for="(item,index) in danceList" :key="index" :value="item.name" >
                {{item.name}}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
            label="学舞目的"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input placeholder="请输入学舞目的"
                     v-decorator="['dancePurpose',{ rules: [{ required: true, message: '请输入学舞目的' }] }]"/>
          </a-form-item>
          <a-form-item label="性别">
            <a-radio-group v-decorator="['stuSex',{ rules: [{ required: true, message: '请选择性别' }] }]">
              <a-radio value="A">
                男
              </a-radio>
              <a-radio value="B" style="margin-left:120px;">
                女
              </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="请选择报名时您的职业（单选）">
            <a-radio-group v-decorator="['oneJob',{ rules: [{ required: true, message: '请选择报名时您的职业' }] }]" @change="careerChange">
              <a-radio :style="radioStyle" v-for="item in careerList" :key="item.id" :value="item.id">
                {{item.name}}
              </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            v-if="careerType==='A'"
            label="请输入行业"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input placeholder="请输入行业"
                     v-decorator="['twoJob',{ rules: [{ required: true, message: '请输入行业' }] },]"/>
          </a-form-item>
          <a-form-item label="请备注就读类型" v-if="careerType==='B'">
            <a-select
              v-decorator="['twoJob',{ rules: [{ required: true, message: '请备注就读类型' }] }]"
              placeholder="请备注就读类型"
            >
              <a-select-option  v-for="(item,index) in studentTypeList" :key="index" :value="item.name" >
                {{item.name}}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="请备注教学类型" v-if="careerType==='C'">
            <a-select
              v-decorator="['twoJob',{ rules: [{ required: true, message: '请备注教学类型' }] }]"
              placeholder="请备注教学类型"
            >
              <a-select-option  v-for="(item,index) in teacherLypeList" :key="index" :value="item.name" >
                {{item.name}}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
            v-if="careerType==='D'" label="请简短描述行业"
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input placeholder="请简短描述行业"
                     v-decorator="['twoJob',{ rules: [{ required: true, message: '请简短描述行业' }] },]"/>
          </a-form-item>
          <a-form-item
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            label="请问在什么情景下，您有了强烈的想法想要去报班学舞蹈？"
          >
            <div class='textareaTips'>
              <a-textarea placeholder="请输入(100字以内)" @input="onstuRemarkChange('guestion3',0)"  v-decorator="['question3', { rules: [{ required: true,message: '请输入在什么情景下，您有了强烈的想法想要去报班学舞蹈'}] }]"  auto-size :maxLength='100'
                          :auto-size="{ minRows: 5, maxRows: 10 }"/>
              <span class='tips'>{{stuRemarkTips[0]}}</span>
            </div>
          </a-form-item>
          <a-form-item label="请问您期望通过学舞蹈改变自己目前的什么现状？">
            <a-radio-group v-decorator="['question4',{ rules: [{ required: true, message: '请输入您期望通过学舞蹈改变自己目前的什么现状' }] }]">
              <a-radio :style="radioStyle" v-for="item in currentStatusList" :key="item.id" :value="item.id">
                {{item.name}}
              </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            label="请问您选择舞蹈培训机构的时候，最关注哪些方面？"
          >
            <div class='textareaTips'>
              <a-textarea placeholder="请输入(100字以内)" @input="onstuRemarkChange('question5',1)"  v-decorator="['question5', { rules: [{ required: true, message: '请输入您选择舞蹈培训机构的时候，最关注哪些方面'}] }]"  auto-size :maxLength='100'
                          :auto-size="{ minRows: 5, maxRows: 10 }"/>
              <span class='tips'>{{stuRemarkTips[1]}}</span>
            </div>
          </a-form-item>
          <a-form-item
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            label="请问您报班前最大的顾虑是什么？什么原因打消了您的顾虑？"
          >
            <div class='textareaTips'>
              <a-textarea placeholder="请输入(100字以内)"  @input="onstuRemarkChange('question6',2)" v-decorator="['question6', { rules: [{ required: true, message: '请输入您报班前最大的顾虑是什么？什么原因打消了您的顾虑'}] }]"  auto-size :maxLength='100'
                          :auto-size="{ minRows: 5, maxRows: 10 }"/>
              <span class='tips'>{{stuRemarkTips[2]}}</span>
            </div>
          </a-form-item>
          <a-form-item
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            label="请问您最后选择单色的核心原因是什么？"
          >
            <div class='textareaTips'>
              <a-textarea placeholder="请输入(100字以内)"  @input="onstuRemarkChange('question7',3)"  v-decorator="['question7', { rules: [{ required: true, message: '请输入您最后选择单色的核心原因是什么' }] }]"  auto-size :maxLength='100'
                          :auto-size="{ minRows: 5, maxRows: 10 }"/>
              <span class='tips'>{{stuRemarkTips[3]}}</span>
            </div>
          </a-form-item>
          <a-form-item :wrapper-col="buttonItemLayout.wrapperCol" >
              <div style="display: flex;justify-content: center;" @click="check()">
                <a-button type="primary" size="large" style="width: 180px;">
                  提交
                </a-button>
              </div>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>
<script>
import {
  commonListEduDance,
  commonListEduType, getStudentInfoByIdCommon,
  questionnaireInfo,
  questionnaireInfoSave
} from "@/api/common"
const formItemLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const buttonItemLayout = {
  labelCol: { span: 0 },
  wrapperCol: { span: 24 },
};
const careerList = [
  {
    name:'全职宝妈',
    id:'全职宝妈',
    type:''
  },
  {
    name:'家庭主妇',
    id:'家庭主妇',
    type:''
  },
  {
    name:'自由职业',
    id:'自由职业',
    type:''
  },
  {
    name:'待业',
    id:'待业',
    type:''
  },
  {
    name:'上班族',
    id:'上班族',
    type:'A'
  },
  {
    name:'幼师',
    id:'幼师',
    type:''
  },
  {
    name:'主播',
    id:'主播',
    type:''
  },
  {
    name:'初中生',
    id:'初中生',
    type:'B'
  },
  {
    name:'高中生',
    id:'高中生',
    type:'B'
  },
  {
    name:'大学生',
    id:'大学生',
    type:'B'
  },
  {
    name:'老师',
    id:'老师',
    type:'C'
  },
  {
    name:'其他',
    id:'其他',
    type:'D'
  }
]
const studentTypeList = [
  {
    name:'在读',
    id:'在读'
  },
  {
    name:'休学',
    id:'休学'
  },
  {
    name:'毕业',
    id:'毕业'
  }
]
const teacherLypeList = [
  {
    name:'小学',
    id:'小学'
  },
  {
    name:'初中',
      id:'初中'
  },
  {
    name:'高中',
    id:'高中'
  },
  {
    name:'大学',
    id:'大学'
  },
  {
    name:'培训机构',
    id:'培训机构'
  },
]
const currentStatusList = [
  {
    name:'工作',
    id:'工作'
  },
  {
    name:'生活',
    id:'生活'
  },
  {
    name:'个人',
    id:'个人'
  }
]
export default {
  components: {  },
  props: {
  },
  data() {
    return {
      formItemLayout,
      buttonItemLayout,
      classTypeList:[],
      danceList:[],
      radioStyle: {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
      },
      careerList,
      studentTypeList,
      teacherLypeList,
      currentStatusList,
      stuRemarkTips:['','','',''],
      careerType:'',
      loading:false
    }
  },
  computed: {
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  created() {
    this.init()
    this.initList()
  },
  mounted() {},
  methods: {
    init(){
      getStudentInfoByIdCommon(this.$route.params.id).then(res=>{
        if(res.data){
          this.$notification['error']({
            message: '系统通知',
            description: '您已填写过该表单，无需再次填写！'
          })
        }
      })
      questionnaireInfo({studentId:this.$route.params.id}).then(res=>{
        if(res.code===200){
          let studentInfo = res.data
          this.form.setFieldsValue({
            'stuName':studentInfo.stuName,
            'stuPhone':studentInfo.stuPhone,
            'stuAge':studentInfo.birthday?Number(studentInfo.birthday):null,
            'typeName':studentInfo.typeName?.split(',')||null,
            'danceName':studentInfo.danceName?.split(',')||null,
            'dancePurpose':studentInfo.dancePurpose,
            'stuSex':studentInfo.stuSex
          })
        }
      })
    },
    async initList(){
      let classTypeList = await commonListEduType()
      let danceList = await commonListEduDance()
      this.classTypeList=classTypeList.data
      this.danceList=danceList.data
    },
    careerChange(){
      let that = this
      this.$nextTick(()=>{
        const {
          form: { getFieldsValue },
        } = that
        const {oneJob,twoJob} = getFieldsValue()
        if(twoJob){
          that.$nextTick(()=>{
            that.form.setFieldsValue({
              'twoJob':'',
            })
          })
        }
        that.$nextTick(()=>{
          let careerType = that.careerList.filter(item=>item.name===oneJob)[0].type
          that.careerType=careerType
          that.$forceUpdate()
        })
      })
    },
    onstuRemarkChange(type,index){
      const {
        form: { getFieldsValue },
      } = this
      const stuRemark = getFieldsValue()[type]
      if(stuRemark.length>=95){
        this.stuRemarkTips[index]=`还剩${100-stuRemark.length}字`
      }else{ this.stuRemarkTips[index]=''}
    },
    check() {
      this.form.validateFields(err => {
        if (!err) {
          const {
            form: { getFieldsValue },
          } = this
          const value = getFieldsValue()
          this.loading=true
          console.log(222)
          let params = Object.assign(value,{
            typeName:value.typeName.join(','),
            danceName:value.danceName.join(','),
            dancePurpose:'@_'+value.dancePurpose,
            studentId:this.$route.params.id
          })
          questionnaireInfoSave(params).then(res=>{
            if(res.code===200){
              // this.form.resetFields()
              // this.init()
              this.$notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
            }
            this.loading=false
            this.careerType=''
            this.$router.push({
              name:'studentRecordApplyResult'
            })
          }).catch(err=>{
            this.loading=false
          })
        }else{
          for(let key in err){
            this.$message.error(err[key].errors[0].message);
            break
          }
        }
      });
    },
  }
}
</script>

<style scoped lang="less">
.test-address-wrapper {
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  overflow-y: scroll;
  background-color: #fff;
  .cert_info {
    img {
      width: 100vw;
    }
  }
  .record{
    background-color: #cb4f4f;
    padding: 10px;
    .record_info{
      background-color: #fff;
      padding: 10px;
      border-radius: 10px;
      /deep/.ant-form-item label {
        font-weight: 700;
        font-size: 20px;
      }
      /deep/.ant-input {
        border-radius: 10px;
        height: 42px;
      }
      /deep/.ant-select-selection--multiple ,
      /deep/.ant-select-selection--single .ant-select-selection__rendered{
        min-height: 42px;
      }
      /deep/.ant-select-selection__placeholder, .ant-select-search__field__placeholder {
        height: 45px;
        line-height: 30px;
      }
      /deep/.ant-select-selection--multiple > ul > li ,/deep/.ant-select-selection--multiple .ant-select-selection__rendered > ul > li{
        height: 42px;
        line-height: 42px;
      }
      /deep/.ant-select-selection--single {
        height: 42px;
        line-height: 42px;
      }
      /deep/.ant-select-selection--single  .ant-select-selection__placeholder{
        height: 20px;
        line-height: 18px;
      }
      /deep/.ant-select-selection {
        border-radius: 10px;
      }
      /deep/.ant-radio-wrapper {
        font-size: 14px!important;
      }
      /deep/.ant-input-number {
        height: 42px;
        line-height: 42px;
        width: 100%;
      }
    }
  }
}
.textareaTips{
  position:relative;
  .tips {
    position: absolute;
    bottom: -5px;
    right: 10px;
    font-size: 12px;
  }
}
@media screen and (max-width: 364px) {
  .test-address-wrapper .cert_info .cert_info_2 p {
    padding: 0 0 0 20px !important;
  }
  .test-address-wrapper .cert_info .cert_info_1 {
    font-size: 18px;
    min-height: auto;
  }
}
</style>
