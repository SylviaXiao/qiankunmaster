<template>
  <div>
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      title="新增/修改工资项"
      v-model="modal"
      width="900px"
      okText="保存"
      cancelText="取消"
      @ok="submit"
      :confirmLoading="isloading"
    >
      <a-form-model ref="ruleForm" :model="form" :rules="rules">
        <a-row>
          <a-col :span="24">
            <a-form-model-item v-bind="{ labelCol: { span: 4 }, wrapperCol: { span: 16 } }" label="职位：" required prop="job">
              <a-select v-model="form.job" style="width:50%;" showSearch option-filter-prop="children" @change="changeJob(form.job)" :disabled="editShow">
                <a-select-option v-for="(item, index) in position" :key="index" :value="item.id">{{ item.positionName }}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-model-item v-bind="{ labelCol: { span: 4 }, wrapperCol: { span: 16 } }" label="底薪：" required prop="basePay">
              <span v-for="(item, index) in form.basePay" :key="index" style="display:flex;align-items: center;">
                <a-input v-model="form.basePay[index].pay" style="width:50%" :min="0" :key="index">
                  <a-select slot="addonBefore" v-model="form.basePay[index].type" style="width: 70px" @change="changeType(form.basePay[index].type, index)">
                    <a-select-option v-for="(item, index) in form.basePay[index].types" :key="index" :value="item.id">{{ item.name }} </a-select-option>
                  </a-select>
                </a-input>
                <a-input-number placeholder="请输入保底工资" style="width: 50%;" :min="0" v-model="form.basePay[index].applicablSal" />
                <div style="width:80px;">
                  <a-icon
                    type="plus-circle"
                    class="icon"
                    style="margin: 7px;"
                    @click="add('pay')"
                    v-if="form.basePay.length - 1 == index && form.basePay.length < 2"
                  />
                  <a-icon type="minus-circle" class="icon" style="margin: 7px;" @click.stop="subtract('pay', index)" v-if="form.basePay.length !== 1" />
                </div>
              </span>
            </a-form-model-item>
          </a-col>
        </a-row>
        <!-- <a-row>
          <a-col :span="24">
            <a-form-model-item v-bind="{ labelCol: { span: 4 }, wrapperCol: { span: 16 } }" label="保底工资：">
              <a-input-number placeholder="请输入保底工资" style="width: 50%;" :min="0" v-model="form.payFloor" />
            </a-form-model-item>
          </a-col>
        </a-row> -->
        <a-row>
          <a-col :span="24">
            <a-form-model-item v-bind="{ labelCol: { span: 4 }, wrapperCol: { span: 16 } }" label="业绩类型：" prop="performanceType">
              <a-select v-model="form.performanceType" style="width:50%;" mode="multiple" placeholder="请选择业绩类型">
                <a-select-option v-for="item in performanceTypeList" :key="item.value" :value="item.value">{{ item.label }} </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-model-item
              v-bind="{ labelCol: { span: 4 }, wrapperCol: { span: 16 } }"
              label="提成类型："
              required
              style="display:flex;align-items: center;"
            >
              <a-radio-group v-model="form.subType" style="display:flex;">
                <a-radio value="A">分馆</a-radio>
                <a-radio value="B">个人</a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-model-item
              v-bind="{ labelCol: { span: 4 }, wrapperCol: { span: 20 } }"
              label="提成比例："
              required
              :prop="!this.jobs.includes(form.job) ? 'deducts' : 'deduct'"
            >
              <template v-if="!this.jobs.includes(form.job)">
                <span v-for="(item, index) in form.deducts" :key="index" style="display:flex;align-items: center;">
                  金额满&nbsp;
                  <a-input-number style="width: 80px;" :min="0" v-model="form.deducts[index].startSection" />
                  &nbsp;万———
                  <a-input-number style="width: 80px;" :min="0" v-model="form.deducts[index].endSection" @blur="changePrice(index)" />
                  &nbsp;万<template v-if="form.deducts[index].endSection"
                    >（不包含{{ form.deducts[index].endSection }}万）</template
                  >
                  &nbsp;&nbsp; &nbsp;提成&nbsp;
                  <a-input-number style="width: 80px;" :min="0" :max="form.subType === 'A' ? 1000 : 100" v-model="form.deducts[index].rate" />
                  &nbsp;{{ form.subType === 'A' ? '‰' : '%' }}
                  <div style="width:80px;">
                    <a-icon type="plus-circle" class="icon" style="margin: 7px;" @click="add('deduct')" v-if="form.deducts.length - 1 == index" />
                    <a-icon type="minus-circle" class="icon" style="margin: 7px;" @click.stop="subtract('deduct', index)" v-if="form.deducts.length !== 1" />
                  </div>
                </span>
              </template>
              <template v-else>
                提成
                <a-input-number style="width: 80px;" :min="0" :max="form.subType === 'A' ? 1000 : 100" v-model="form.deduct" />
                {{ form.subType === 'A' ? '‰' : '%' }}
              </template>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-model-item v-bind="{ labelCol: { span: 4 }, wrapperCol: { span: 16 } }" label="早班补贴：">
              <a-input-number style="width: 50%;" v-model="form.morAllowance" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-model-item v-bind="{ labelCol: { span: 4 }, wrapperCol: { span: 16 } }" label="适用分馆：" prop="deptIds">
              <a-tree-select v-model="form.deptIds" style="width: 73%" :tree-data="branchList" tree-checkable placeholder="请选择适用分馆" showSearch />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { listSalConfig, saveSalConfig } from '@/api/finance/finance'
import { getSchoolList } from '@/api/education/card'
const performanceTypeList = [{ label: '新报', value: 'A' }, { label: '续报', value: 'B' }]
export default {
  data() {
    let validatePay = (rule, value, callback) => {
      for (let i = 0; i < this.form.basePay.length; i++) {
        for (let key in this.form.basePay[i]) {
          if ((this.form.basePay[i][key] === '' || this.form.basePay[i][key] === null) && key != 'applicablSal') {
            return callback(new Error('请填写完整'))
          }
        }
      }
      callback()
    }
    let validateDeducts = (rule, value, callback) => {
      for (let i = 0; i < this.form.deducts.length; i++) {
        for (let key in this.form.deducts[i]) {
          if (this.form.deducts[i][key] === '' || this.form.deducts[i][key] === null) {
            return callback(new Error('请填写完整'))
          }
        }
      }
      callback()
    }
    return {
      branchList: [], //分馆列表
      performanceTypeList, //业绩类型列表
      rules: {
        performanceType: [{ required: true, message: '请选择业绩类型', trigger: 'change' }],
        deptIds: [{ required: true, message: '请选择适用分馆', trigger: 'change' }],
        job: [{ required: true, message: '请选择职位', trigger: 'change' }],
        basePay: [{ required: true, validator: validatePay, trigger: 'blur' }],
        deduct: [{ required: true, message: '请填写提成比例', trigger: 'change' }],
        deducts: [{ required: true, validator: validateDeducts, trigger: 'blur' }]
      },
      title: null,
      modal: false,
      isloading: false,
      form: {
        performanceType: undefined,
        deptIds: undefined,
        job: '',
        basePay: [{ type: '', applicablSal: '', pay: '', types: [{ id: 1, name: '试用' }, { id: 2, name: '正式' }] }],
        payFloor: '',
        morAllowance: '',
        subType: 'A',
        deducts: [
          {
            startSection: null,
            endSection: null,
            rate: ''
          }
        ]
      },
      id: null,

      position: [],
      jobs: ['7209b1d1-6a9b-45ef-bdec-047d3da38c90', 'desk_code'],
      editShow: false
    }
  },
  watch: {
    modal(n, o) {
      if (!n) {
        this.$refs.ruleForm.clearValidate()
        this.id = null
        this.editShow = false
        this.form = {
          performanceType: undefined,
          deptIds: undefined,
          job: '',
          basePay: [{ type: '', applicablSal: '', pay: '', types: [{ id: 1, name: '试用' }, { id: 2, name: '正式' }] }],
          payFloor: '',
          morAllowance: '',
          subType: 'B',
          deducts: [
            {
              startSection: null,
              endSection: null,
              rate: ''
            }
          ]
        }
      }
    }
  },

  methods: {
    //下拉选过以后不能再选
    changeType(val, index) {
      if (index === 0 && this.form.basePay.length == 2) {
        this.form.basePay[1].types = this.form.basePay[0].types.filter(item => item.id != val)
        this.form.basePay[1].type = ''
      }
    },
    //结束金额不得小于开始金额
    changePrice(index) {
      if (this.form.deducts[index].endSection * 1 < this.form.deducts[index].startSection * 1) {
        this.form.deducts[index].endSection = ''
        return this.$notification['error']({
          message: '系统通知',
          description: '结束金额不能小于开始金额'
        })
      }
    },
    //修改职位改变表单
    changeJob(val) {
      if (!this.jobs.includes(val) && !this.form.deducts) {
        let obj = {
          startSection: null,
          endSection: null,
          rate: ''
        }
        delete this.form.deduct
        this.$set(this.form, 'deducts', [obj])
      } else if (this.jobs.includes(val) && !this.form.deduct) {
        delete this.form.deducts
        this.$set(this.form, 'deduct', '')
      }
    },
    subtract(type, index) {
      if (type === 'pay') {
        this.form.basePay.splice(index, 1)
      } else {
        this.form.deducts.splice(index, 1)
      }
    },
    add(type) {
      if (type === 'pay') {
        if (!this.form.basePay[0].type) {
          return this.$notification['error']({
            message: '系统通知',
            description: '请先选择底薪类型'
          })
        }
        let obj = { type: '', applicablSal: '', pay: '', types: [] }
        obj.types = this.form.basePay[0].types.filter(item => item.id != this.form.basePay[0].type)
        this.form.basePay.push(obj)
      } else {
        let obj = {
          startSection: null,
          endSection: null,
          rate: ''
        }
        this.form.deducts.push(obj)
      }
    },
    submit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.isloading = true
          let params = {}
          params.formalSal = this.form.basePay.find(item => item.type === 2) ? this.form.basePay.find(item => item.type === 2).pay : ''
          params.probationSal = this.form.basePay.find(item => item.type === 1) ? this.form.basePay.find(item => item.type === 1).pay : ''
          params.leastSal = this.form.basePay.find(item => item.type === 2) ? this.form.basePay.find(item => item.type === 2).applicablSal : 0
          params.applicablSal = this.form.basePay.find(item => item.type === 1) ? this.form.basePay.find(item => item.type === 1).applicablSal : 0
          params.morAllowance = this.form.morAllowance
          params.positionId = this.form.job
          // params.leastSal = this.form.payFloor
          params.deptIds = this.form.deptIds.join(',')
          params.performanceType = this.form.performanceType.join(',')
          params.subType = this.form.subType
          params.id = this.id || ''
          params.salCommissionn = this.form.deduct
            ? JSON.stringify([{ startSection: '', endSection: '', rate: this.form.deduct }])
            : JSON.stringify(this.form.deducts)
          saveSalConfig(params)
            .then(res => {
              if (res.code === 200) {
                this.modal = false
                this.$emit('update')
              }
            })
            .finally((this.isloading = false))
        }
      })
    },
    async open(record) {
      let res1 = await getSchoolList()
      if (res1.code === 200) {
        this._handleTreeData(res1.data, 'deptName', 'id', 'deptName', 'id')
        this.branchList = res1.data
      }
      if (record) {
        this.editShow = true
        let data = JSON.parse(JSON.stringify(record))
        let { id, oid, salcommisions, leastSal, morAllowance, applicablSal, probationSal, formalSal, subType, mapQueryList, performanceType } = data
        this.id = id
        this.form.job = oid
        this.form.subType = subType
        // this.form.payFloor = leastSal
        this.form.deptIds = Array.isArray(mapQueryList) && mapQueryList.length > 0 ? Array.from(mapQueryList.map(item => item.deptId)) : new Array()
        this.form.performanceType = performanceType?.split(',') || undefined
        this.form.morAllowance = morAllowance
        if (salcommisions[0].startSection === null && salcommisions[0].endSection === null) {
          this.form.deduct = salcommisions[0].rate
        } else {
          this.form.deducts = salcommisions
        }
        this.form.basePay = []
        if (probationSal) {
          this.form.basePay.push({
            type: 1,
            applicablSal,
            pay: probationSal,
            types: [{ id: 1, name: '试用' }, { id: 2, name: '正式' }]
          })
        }
        if (formalSal) {
          this.form.basePay.push({
            type: 2,
            pay: formalSal,
            applicablSal: leastSal,
            types: !probationSal ? [{ id: 1, name: '试用' }, { id: 2, name: '正式' }] : [{ id: 2, name: '正式' }]
          })
        }
        // if(record.)
      }

      let res = await listSalConfig()
      if (res.code === 200) {
        this.position = res.data
        this.modal = true
      }
    },
    _handleTreeData(data, type1, type2, type3, type4) {
      data.forEach((item, index) => {
        item.title = item[type1] || ''
        item.value = item[type2]
        item.key = item[type2]
        if (item.children && item.children.length > 0) {
          this._handleTreeData(item.children, type3, type4, type3, type4)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.icon {
  color: #1890ff;
  font-size: 16px;
}
</style>
