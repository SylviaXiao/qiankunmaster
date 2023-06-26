<template>
  <div class="stu-leave-addedit">
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :title="title"
      :visible="visibleAddEdit"
      :confirmLoading="confirmAddEditLoading"
      width="800px"
      @ok="onSubmit"
      @cancel="onAddEditCancel"
    >
      <div>
        <a-form :form="addClassForm">
          <a-row :gutter="8">
            <a-row >
              <a-col :lg="12" :md="12" :sm="12">
                <a-form-item v-bind="formLayout" label="舞种">
                  <a-select
                    allowClear
                    v-decorator="['danceId', { rules: [{ required: true, message: '请选择舞种' }] }]"
                    placeholder="请选择舞种"
                  >
                    <a-select-option
                      :allowClear="true"
                      :value="item.id"
                      v-for="(item, index) in danceList"
                      :key="index"
                    >
                      {{ item.name }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :lg="12" :md="12" :sm="12">
                <a-form-item v-bind="formLayout" label="期数">
                  <a-input
                    v-decorator="[`periods`, { rules: [{ required: false, message: '请输入期数' }] }]"
                    placeholder="输入期数"
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
              <a-col :lg="12" :md="12" :sm="12">
                <a-form-item v-bind="formLayout" label="上课分馆">
                  <a-tree-select
                    style="width:100%"
                    v-decorator="[`schoolId`, { rules: [{ required: true, message: '请选择上课分馆' }] }]"
                    :allowClear="true"
                    :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                    :treeData="schoolList"
                    placeholder="请选择上课分馆"
                    treeDefaultExpandAll
                    :multiple="false"
                  />
                </a-form-item>
              </a-col>
              <a-col :lg="12" :md="12" :sm="24">
                <a-form-item label="班型" v-bind="formLayout">
                  <a-cascader
                    :options="classTypeList"
                    :showSearch="{ typeFilter }"
                    placeholder="请选择班型"
                    :fieldNames="{ label: 'name', value: 'id', children: 'children' }"
                    changeOnSelect
                    v-decorator="['classTypeId', { rules: [{ required: true, message: '请选择班型' }] }]"
                  />
                </a-form-item>
              </a-col>
              <a-col :lg="12" :md="12" :sm="12">
                <a-form-item v-bind="formLayout" label="开课日期">
                  <a-range-picker
                    style="width: 100%;"
                    format="YYYY-MM-DD"
                    valueFormat="YYYY-MM-DD"
                    v-decorator="['ClassDate', { rules: [{ required: true, message: '请选择开课日期' }] }]"
                  />
                </a-form-item>
              </a-col>
              <a-col :lg="12" :md="12" :sm="12">
                <a-form-item v-bind="formLayout" label="结束日期">
                  <a-range-picker
                    style="width: 100%;"
                    format="YYYY-MM-DD"
                    valueFormat="YYYY-MM-DD"
                    v-decorator="['FinishDate', { rules: [{ required: true, message: '请选择结束日期' }] }]"
                  />
                </a-form-item>
              </a-col>
              <a-col :lg="12" :md="12" :sm="24">
                <a-form-item
                  label="上课时间段"
                  v-bind="formLayout">
                  <a-select :allowClear="true"
                            placeholder="请选择上课时间段"
                            v-decorator="[ 'classPeriod', { rules: [{ required: true, message: '请选择上课时间段' }] }]">
                    <a-select-option :allowClear="true" :value="time.id" v-for="(time,roomIndex) in timeList" :key="roomIndex">
                      {{time.name}}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row >
              <!-- 上课导师 顾问 -->
                <a-col :lg="12" :md="12" :sm="24">
                  <a-form-item label="上课导师" v-bind="formLayout">
                    <span>
                        <a-select
                          mode="multiple"
                          style="width: calc(100% - 37px);margin-right: 37px;z-index: 144;border-radius: 4px 0 0 4px;"
                          @deselect="deselect"
                          :open="false"
                          v-decorator="['teacher', { rules: [{ required: false, message: '请选择上课导师' }] }]"
                          placeholder="请选择上课导师"
                        >
                  <a-icon slot="suffixIcon" type="search" />
                  <a-select-option v-for="(item, idx) in teaSelectArr" :value="item.teacherId" :key="idx">{{ item.teacherName }} </a-select-option>
                </a-select>
                <a-input style="cursor: pointer; position: absolute;left: -2px;top: -6.5px;border: none;" class="no-border-input">
                  <a-icon slot="addonAfter" type="search" @click="openChooseTea('teacher')" />
                </a-input>
                    </span>
                  </a-form-item>
                </a-col>
              <a-col :lg="12" :md="12" :sm="12">
                <a-form-item v-bind="formLayout" label="已招人数">
                  <a-input-number
                    v-decorator="[`recruitedNum`, { rules: [{ required: true, message: '请输入已招人数' }] }]"
                    placeholder="请输入已招人数"
                    style="width: 100%"
                    :min='0'
                  />
                </a-form-item>
              </a-col>
              <a-col :lg="12" :md="12" :sm="12">
                <a-form-item v-bind="formLayout" label="收外馆人">
                  <a-input-number
                    v-decorator="[`otherDeptNum`, { rules: [{ required: true, message: '请输入收外馆人' }] }]"
                    placeholder="请输入收外馆人"
                    style="width: 100%"
                    :min='0'
                  />
                </a-form-item>
              </a-col>
              <a-col :lg="12" :md="12" :sm="12">
                <a-form-item v-bind="formLayout" label="计划招生">
                  <a-input-number
                    v-decorator="[`plansNum`, { rules: [{ required: true, message: '请输入计划招生' }] }]"
                    placeholder="请输入计划招生"
                    style="width: 100%"
                    :min='0'
                  />
                </a-form-item>
              </a-col>
              <a-col :lg="12" :md="12" :sm="24">
                <a-form-item
                  label="开班模式"
                  v-bind="formLayout">
                  <a-select :allowClear="true"
                            placeholder="请选择开班模式"
                            v-decorator="[ 'dlassModel', { rules: [{ required: true, message: '请选择开班模式' }] }]">
                    <a-select-option :allowClear="true" :value="time.id" v-for="(time,index) in classList" :key="index">
                      {{time.name}}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :lg="12" :md="12" :sm="24">
                <a-form-item label="班级负责人" v-bind="formLayout">
               <span>
                  <a-input disabled v-decorator="['master']">
                    <a-icon slot="addonAfter" type="search" @click="openTreeModal('master')"/>
                  </a-input>
               </span>
                </a-form-item>
              </a-col>
              <a-col :lg="24" :md="24" :sm="24">
                <a-form-item
                  v-bind="{
                  labelCol: {
                    sm: {
                      span: 3
                    }
                  },
                  wrapperCol: {
                    sm: {
                      span: 21
                    }
                  }
                }"
                  label="备注"
                >
                  <a-textarea
                    style="width: 100%;"
                    placeholder="请输入备注信息(100字以内)"
                    :rows="4"
                    v-decorator="['remark', { rules: [{ required: false, message: '请输入备注信息' }] }]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-row>
        </a-form>
      </div>
      <!-- 员工选择 -->
      <i-modal ref="modal"
               :multiple='false'
               :userType="userType"
               @ok="imodalOk"
               @close="imodalClose"
               @getBackData="getBackData">
      </i-modal>
      <choose-tea ref="choosetea" :checkType="true" :multiple='true' :teaFields="teaFields" @ok="chooseteaOk" @close="chooseteaClose" @getBackData="getTeaData"></choose-tea>
    </a-modal>
  </div>
</template>
<script>
import { listEduDance, treeEduClassType } from '@/api/common'
import { listOrgDeptByUser } from '@/api/education/card'
import {IModal } from '@/components'
import ChooseTea from '@/components/ChooseTea'
import moment from 'moment'
import { saveClassPlan ,classPlanDetail,classPlanUpdate} from '@/api/finance/finance'
const formLayout = {
  labelCol: {
    sm: {
      span: 6
    }
  },
  wrapperCol: {
    sm: {
      span: 16
    }
  }
}
export default {
  components: {
    IModal,ChooseTea
  },
  props: {
    title: {
      type: String,
      default: '开班计划录入'
    }
  },
  data() {
    return {
      userType: 'master',
      teaFields: null,
      classList:[
        {name:'5+2',id:'A'},
        {name:'6+1',id:'B'},
        {name:'待定',id:'C'},
      ],
      timeList:[
        {name:'上午',id:'A'},
        {name:'下午',id:'B'},
        {name:'晚上',id:'C'},
        {name:'全天',id:'D'},
        {name:'待定',id:'E'},
      ],
      id: '',
      formLayout,
      visibleAddEdit: false,
      confirmAddEditLoading: false,
      danceList: [],
      schoolList: [],
      classTypeList: [],
      teaIdsArr: [],
      teaNamesArr:[],
      teaSelectArr: [],
      formValues:{}
    }
  },
  beforeCreate() {
    this.addClassForm = this.$form.createForm(this)
  },
  methods: {
    deselect(value, option) {
      this.teaIdsArr.remove(value)
      this.teaNamesArr.splice(option.key, 1)
      this.formValues.teacherIds = this.teaIdsArr.join(',')
      this.formValues.teacherNames = this.teaNamesArr.join(',')
    },
    openChooseTea(type) {
      this.teaFields = type
      this.$refs.choosetea.open()
    },
    chooseteaOk() {},
    chooseteaClose() {},
    getTeaData(data, type) {
      if (type == 'teacher') {
        data.map(item => {
          if (this.teaIdsArr.indexOf(item.teacherId) < 0) {
            this.teaSelectArr.push({ teacherName: item.teacherName, teacherId: item.teacherId })
            this.teaIdsArr.push(item.teacherId)
            this.teaNamesArr.push(item.teacherName)
          }
        })
        this.$nextTick(() => {
          this.addClassForm.setFieldsValue({ teacher: this.teaIdsArr })
          this.formValues.teacherIds = this.teaIdsArr.join(',')
          this.formValues.teacherNames = this.teaNamesArr.join(',')
        })
        return
      }
      this.$nextTick(() => {
        this.addClassForm.setFieldsValue({ [type]: data.name })
        this.formValues[`${type}Id`] = data.id
      })
    },
    imodalOk() {
    },
    imodalClose() {
    },
    getBackData(data, type) {
      this.$nextTick(() => {
        this.addClassForm.setFieldsValue({ [type]: data.name })
        this.formValues[`${type}Id`] = data.id
      })
    },
    openTreeModal(type) {
      this.userType = type
      this.$refs.modal.open()
    },
    typeFilter(inputValue, path) {
      return path.some(option => option.value.indexOf(inputValue) > -1)
    },
    init() {
      listEduDance().then(res => (this.danceList = res.data))
      listOrgDeptByUser().then(res => {
        if (res.code === 200 && res.data) {
          this.schoolList = this._handleData(res.data)
        }
      })
      treeEduClassType({ type: 'D' }).then(res => {
        this.$tools.transNullToArr(res.data)
        this.classTypeList = res.data
      })
    },
    //处理分馆数据
    _handleData(data) {
      return data.map((item, index) => {
        let itemObj = {}
        itemObj.title = item.deptName
        itemObj.value = item.id
        itemObj.key = item.id
        if (item.children) {
          itemObj.children = this._handleData(item.children)
          itemObj.selectable = false
        }
        return itemObj
      })
    },
    onSubmit() {
      this.validateData().then(res => {
        let {
          ClassDate,
          FinishDate,
          classPeriod,
          classTypeId,
          danceId,
          dlassModel,
          master,
          otherDeptNum,
          periods,
          plansNum,
          recruitedNum,
          remark,
          schoolId,
          teacher }=res
        let params ={
          beginClassDate:ClassDate[0],
          endClassDate:ClassDate[1],
          beginFinishDate:FinishDate[0],
          endFinishDate:FinishDate[1],
          classPeriod,
          classTypeId:classTypeId.join(','),
          danceId,
          dlassModel,
          otherDeptNum,
          periods,
          plansNum,
          recruitedNum,
          remark,
          schoolId,
          masterId:this.formValues.masterId,
          teacherIds:this.formValues.teacherIds
        }
        this.confirmAddEditLoading=true
        let request=saveClassPlan
        if(this.id){
          request=classPlanUpdate
          params.classPlanId=this.id
        }
        request(params).then(res => {
          this.$notification['success']({
            message: '系统通知',
            description: '操作成功'
          })
          this.confirmAddEditLoading=false
          this.refreshTable()
          this.onAddEditCancel()
        }).finally((err)=>{
          this.confirmAddEditLoading=false
        })
      })
    },
    onAddEditCancel() {
      this.visibleAddEdit = false
    },
    open() {
      this.reset()
      this.init()
      this.visibleAddEdit = true
    },
    async backindData(record) {
      let data = await classPlanDetail(record.classPlanId)
      let res = data.data
      let teacherId = []
      let teacherName = []
      if(Array.isArray(res.teacherInfo)&&res.teacherInfo.length>0){
         teacherId =  res.teacherInfo.map(item=>item.teacherId)
         teacherName = res.teacherInfo.map(item=>item.teacherName)
      }
      let formData = Object.assign({
        ClassDate:[res.beginClassDate,res.endClassDate],
        FinishDate:[res.beginFinishDate,res.endFinishDate],
        classPeriod:res.classPeriod,
        classTypeId:[res.typeId,res.classtypeId],
        danceId:res.danceId,
        dlassModel:res.dlassModel,
        master:res.masterName,
        otherDeptNum:res.otherDeptNum,
        periods:res.periods,
        plansNum:res.plansNum,
        recruitedNum:res.recruitedNum,
        remark:res.remark,
        schoolId:res.schoolId,
        teacher:teacherId
      })
      this.formValues.teacherIds = teacherId.join(',')
      this.formValues.teacherNames = teacherName.join(',')
      this.teaIdsArr=teacherId
      this.teaNamesArr=teacherName
      this.teaSelectArr= res.teacherInfo||[]
      this.id = record.classPlanId
      this.addClassForm.setFieldsValue(formData)
    },
    validateData() {
      return this.addClassForm.validateFields()
    },
    reset() {
      this.id = ''
      this.formValues = {}
      this.teaIdsArr = []
      this.teaSelectArr=[]
      this.teaNamesArr = []
      this.addClassForm.resetFields()
    },
    refreshTable() {
      this.$emit('refresh', this.stuId)
    }
  }
}
</script>

<style scoped lang="less">
.stu-leave-addedit {
}
</style>
