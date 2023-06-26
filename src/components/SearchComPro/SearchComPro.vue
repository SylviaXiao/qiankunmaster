<!--
同文件夹下有传值说明文件

搜索类型: input类型,select类型,date类型,modalSelect类型,cascader类型,treeSelect类型

date类型请注意:
将根据传值带有'Time'字符串和'Date'字符串区分格式化函数
time:将用YY-MM-DD hh:mm:ss进行格式化
date:将用YY-MM-DD 进行格式化

特殊类型: 当类型为chooseModal,key值为cardName时将有特殊处理
特殊类型: 当类型为chooseModal,key值为cardNameEdu时将有特殊处理
-->

<script>
const today = moment()
  .subtract(0, 'days')
  .format('YYYY-MM-DD')
const formItemLayout = {
  labelCol: {
    sm: {
      span: 8
    }
  },
  wrapperCol: {
    sm: {
      span: 16
    }
  }
}
const formItemLayoutZero = {
  labelCol: {
    sm: {
      span: 0
    }
  },
  wrapperCol: {
    sm: {
      span: 22
    }
  }
}
import Vue from 'vue'
import moment from 'moment'
import IModal from '@/components/InnerModal/modal.vue'
import GetCard from '@/components/GetCard/GetCard.vue'
import GetEduCard from '@/components/GetEduCard/GetEduCard.vue'
import ChooseTea from '@/components/ChooseTea'
import { dateConfig } from './commonConfig'

export default {
  name: 'SearchComPro',
  components: {
    IModal,
    GetCard,
    GetEduCard,
    ChooseTea
  },
  props: {
    hideReset: {
      type: Boolean,
      default: false
    },
    searchParams: {
      type: Array,
      default: []
    },
    cardNameEduType: {
      type: String,
      default: ''
    },
    otherBtn: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      formItemLayoutZero,
      isShowAll: false,
      isShowAll1: false,
      formItemLayout,
      selectArr: {},
      userType: 'all',
      teaFields: null,
      defaultMonth: moment()
        .subtract(1, 'days')
        .format('YYYY-MM'),
      defaultToday: [moment().subtract(0, 'days'), moment().subtract(0, 'days')],
      chooseModalValue: {},
      selectFormData:{}
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  mounted() {
    this._initSelectData()
  },
  methods: {
    onPanelChange(key, itemObj, value) {
      if (itemObj.mode == 'year') {
        this.form.setFieldsValue({ [key]: value.format('YYYY') })
        console.log(this.form.getFieldValue(key), value.format('YYYY'))
      }
    },
    checkAdult(item) {
      return !!item
    },
    checkAdult1(item) {
      return !item
    },
    showAll() {
      this.isShowAll = !this.isShowAll
    },
    disabledDate(current, itemObj) {
      let type = itemObj.disabledType
      if (type) {
        return dateConfig[type](current)
      }
      // Can not select days before today and
      return current && current < moment().startOf('year')
    },
    handlePanelChange2(key, itemObj, value) {
      const {
        form: { getFieldValue, resetFields }
      } = this
      if(key==="Month"){
        this.form.setFieldsValue({ Month: value })
      }else{
        this.form.setFieldsValue({ PayMonth: value })
      }
      // this.form.setFieldsValue({ ['cardName']: value.cardName })
      // this.value = value;
      // this.mode2 = [mode[0] === 'date' ? 'month' : mode[0], mode[1] === 'date' ? 'month' : mode[1]];
    },
    // $refs.x.getResult 获取参数
    getResult() {
      return this.submit({}, true)
    },
    //dom操作函数
    submit(e, onlyData = false) {
      // e.preventDefault();
      return this.form.validateFields().then(data => {
        let originData = { ...data }
        // this.searchParams.forEach(searchItem => {
        //   const { type, key } = searchItem
        //   // 下拉框可能存在的重复，处理数据的时候a-select-option拼接为 xxx~mmmnnn 格式
        //   if (type === 'select') {
        //     let selectVal = originData[key]
        //     if (!(selectVal?.length > 0)) {
        //       return
        //     }
        //     // 去除拼接的部分
        //     let originValue = ''
        //     if (Array.isArray(selectVal)) {
        //       originValue = []
        //       selectVal.forEach(item => {
        //         let value = item.split('~')[1]
        //         originValue.push(value)
        //       })
        //     } else {
        //       originValue = selectVal.split('~')[1]
        //     }
        //     originData[key] = originValue
        //   }
        // })

        let result = Object.assign({}, originData, this.chooseModalValue)
        result = this._normalizeDate(this.$tools.delUndefined(result))
        result = this._delSpace(result)
        const autoCompleteKeys = this.searchParams.filter(d => d.type === 'text' && d.autoComplete).map(d => d.key)
        autoCompleteKeys.forEach(key => {
          if (result[key]) {
            let autoComplete = Vue.ls.get('autoComplete_' + key) || []
            let index = autoComplete.indexOf(result[key])
            if (index >= 0) autoComplete.splice(index, 1)
            autoComplete.push(result[key])
            autoComplete = [...new Set(autoComplete)]
            Vue.ls.set('autoComplete_' + key, autoComplete.length > 6 ? autoComplete.slice(autoComplete.length - 6) : autoComplete)
          }
        })

        if (onlyData) {
          return Promise.resolve(result)
        }

        this.$emit('searchSubmit', result)
        this.$forceUpdate()
      })
    },
    onKeyupSubmit(e) {
      if (e.keyCode === 13) {
        this.submit()
      }
    },
    reset() {
      this.chooseModalValue = {}
      this.form.resetFields()
      this.$emit('searchSubmit', {}, 'isReset')
      this.$emit('reset', 'isReset')
      this.$nextTick(()=>{
        this.selectFormData=this.form.getFieldsValue()
      })
    },
    //扁平化数组
    platFn(list) {
      let res = []
      res = list.concat(
        ...list
          .map(item => {
            if (item.children instanceof Array && item.children.length > 0) {
              return this.platFn(item.children)
            }
            return null
          })
          .filter(o => o instanceof Array && o.length > 0)
      )
      return res
    },
    onTreeSelectChange(Fieldkey, itemObj, selectVal) {
      // 向外暴露select框的change事件
      if (itemObj.financeTable) {
        let arr = this.platFn(JSON.parse(JSON.stringify(this.selectArr[`${itemObj.key}Arr`])))
        let newArr = JSON.parse(JSON.stringify(this.selectArr[`${itemObj.key}Arr`]))
        let level = 0
        let renderArr = []
        if (selectVal.length == 1) {
          let item = arr.filter(item => item.value == selectVal[0])
          level = item[0].level
        }
        if (selectVal.length == 0 || selectVal.length == 1) {
          renderArr = this.formateFinanceTableData(newArr, itemObj, level)
          this.$set(this.selectArr, `${itemObj.key}Arr`, renderArr)
        }
      }
      this.$emit('searchSelectChange', Fieldkey, selectVal)
    },
    onSelectChange(Fieldkey, itemObj, selectVal) {
      // 向外暴露select框的change事件
      if (itemObj.singleMode) {
        //判断select 在mode=='tags状态下是否单选，单选则进入判断
        this.$nextTick(() => {
          let value = selectVal.length > 0 ? [selectVal[selectVal.length - 1]] : []

          this.form.setFieldsValue({ [Fieldkey]: value })
        })
      }
      this.$emit('searchSelectChange', Fieldkey, selectVal)
      this.$nextTick(()=>{
        this.selectFormData=this.form.getFieldsValue()
      })
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    //弹出选择类型
    getModalFn(itemObj) {
      if (itemObj.key === 'cardName') {
        return this.getCard()
      } else if (itemObj.key === 'cardNameEdu') {
        return this.getEduCard()
      } else if (itemObj.key == 'teacher' || itemObj.key == 'assistant') {
        return this.getTea.call(this, itemObj.key)
      } else {
        return this.getUser.call(this, itemObj.key, itemObj.mutiple)
      }
    },
    getUser(type, multiple) {
      this.userType = type
      this.multiple = false
      this.multiple = multiple
      this.value = null
      let name = this.form.getFieldsValue()[type]
      if (name) {
        if (type === 'all') {
          this.value = {
            id: this.chooseModalValue.userId,
            data: name,
            deptId: this.chooseModalValue.userDeptId
          }
        } else {
          let id = this.chooseModalValue[`${type}Id`].split(',')
          let deptId = this.chooseModalValue[`${type}DeptId`].split(',')
          let data = []
          id.forEach((item, index) => {
            data.push({
              id: item,
              userName: name.split(',')[index],
              deptid: deptId[index]
            })
          })
          this.value = {
            id,
            data,
            deptId
          }
        }
      }
      this.$refs.modal.open(this.value)
    },
    getTea(type) {
      this.teaFields = type
      this.$refs.choosetea.open()
    },
    getCard() {
      this.$refs.cardModal.open()
    },
    getEduCard() {
      this.$refs.cardEduModal.open()
    },
    getUserBack(data, type, mutiple) {
      let { name, id, deptId } = data
      if (mutiple == 'mutiple') {
        if (data instanceof Array) {
          name = data
            .map(item => {
              return item.userName
            })
            .join(',')
          id = data
            .map(item => {
              return item.id
            })
            .join(',')
          deptId = data
            .map(item => {
              return item.deptid
            })
            .join(',')
        }
      }
      if (type === 'all') {
        this.$nextTick(() => {
          this.form.setFieldsValue({ user: name })
          this.form.setFieldsValue({ all: name })
          this.chooseModalValue.userId = id
          this.chooseModalValue.userDeptId = deptId
        })
      } else {
        this.$nextTick(() => {
          this.form.setFieldsValue({ [type]: name })
          this.chooseModalValue[`${type}Id`] = id
          this.chooseModalValue[`${type}DeptId`] = deptId
        })
      }
    },
    getTeaData(data, type) {
      this.$nextTick(() => {
        this.form.setFieldsValue({ [type]: data.name })
        this.chooseModalValue[`${type}Id`] = data.id
      })
    },
    dataFilter(inputValue, path) {
      return path.some(option => option.value.indexOf(inputValue) > -1)
    },
    getCardBack(value) {
      this.$nextTick(() => {
        if (Array.isArray(value)) {
          this.chooseModalValue.deptCardId = value.map(d => d.id).join(',')
          this.form.setFieldsValue({ ['cardName']: value.map(d => d.cardName).join(',') })
        } else {
          this.chooseModalValue.deptCardId = value.id
          this.form.setFieldsValue({ ['cardName']: value.cardName })
        }
      })
    },
    getCardBackEdu(value) {
      this.$nextTick(() => {
        this.chooseModalValue.eduCardId = value.id
        this.form.setFieldsValue({ ['cardNameEdu']: value.cardName })
      })
    },
    // text输入框自动补全的点击方法
    autoCompleteClick(itemObj, value) {
      return () => {
        this.form.setFieldsValue({ [itemObj.key]: value })
        this.$refs[itemObj.key] && this.$refs[itemObj.key].focus()
      }
    },
    // 构造a-select初始值
    // 为了兼容下拉框存在重复数据
    // 逻辑判断顺序
    // 1.如果是数组，则直接赋值，数组修改为 [0~A,1-B,2-C,3~D] 
    // 2. 数据拼接 下拉index + 源数据，例  0~A  2~C 
    // 当默认下拉index不为0的时候，需要传initialIndex
    // 例 initialValue: 'B' , initialIndex: 1
    transferSelectInitialValue(itemObj) {
      // const { initialValue, initialIndex } = itemObj 
      // if (Array.isArray(initialValue)) {
      //   let result = initialValue.map((item, index) => {
      //     return initialIndex[index] + '~' + item
      //   })
      //   return result
      // }
      // if (initialValue != null || initialValue != undefined) {
      //   return (initialIndex >= 0 ? initialIndex : 0) + '~' + initialValue
      // }
      return itemObj.initialValue
    },
    //dom构造器
    emptyCreator(itemObj) {
      return (
        <a-col lg={8} md={12} sm={24} style={this.isShowAll || this.isShowAll1 || itemObj.show ? '' : 'display:none;'}>
          <a-form-item labelCol={this.formItemLayout.labelCol} wrapperCol={this.formItemLayout.wrapperCol}>
            <a-input style="visibility: hidden" />
          </a-form-item>
        </a-col>
      )
    },
    sectionCreator(itemObj) {
      return (
        <a-col lg={8} md={12} sm={24} style={this.isShowAll || this.isShowAll1 || itemObj.show ? '' : 'display:none;'}>
          <a-form-item labelCol={this.formItemLayout.labelCol} wrapperCol={this.formItemLayout.wrapperCol} label={itemObj.label}>
            <a-input-number min={itemObj.minNum} v-decorator={[`start${itemObj.key}`, { initialValue: itemObj.initialValue }]} style="width:48%;" />
            <div style="width:4%;display:inline-block;text-align:center;">~</div>
            <a-input-number min={itemObj.minNum} style="width:48%;" v-decorator={[`end${itemObj.key}`, { initialValue: itemObj.initialValue }]} />
          </a-form-item>
        </a-col>
      )
    },
    numberCreator(itemObj) {
      return (
        <a-col lg={8} md={12} sm={24} style={this.isShowAll || this.isShowAll1 || itemObj.show ? '' : 'display:none;'}>
          <a-form-item labelCol={this.formItemLayout.labelCol} wrapperCol={this.formItemLayout.wrapperCol} label={itemObj.label}>
            <a-input-number
              style="width:100%;"
              addonBefore={itemObj.addonBefore}
              addonAfter={itemObj.addonAfter}
              placeholder={itemObj.placeholder}
              v-decorator={[itemObj.key, { initialValue: itemObj.initialValue }]}
            />
          </a-form-item>
        </a-col>
      )
    },
    textCreator(itemObj) {
      const html = itemObj => {
        return (
          <a-input
            ref={itemObj.key}
            addonBefore={itemObj.addonBefore}
            addonAfter={itemObj.addonAfter}
            placeholder={itemObj.placeholder}
            name={itemObj.key}
            autocomplete="off"
            v-decorator={[itemObj.key, { initialValue: itemObj.initialValue }]}
          />
        )
      }
      const autoComplete = Vue.ls.get('autoComplete_' + itemObj.key) || []
      return (
        <a-col lg={8} md={12} sm={24} style={this.isShowAll || this.isShowAll1 || itemObj.show ? '' : 'display:none;'}>
          <a-form-item labelCol={this.formItemLayout.labelCol} wrapperCol={this.formItemLayout.wrapperCol} label={itemObj.label}>
            {itemObj.autoComplete && autoComplete.length > 0 ? (
              <a-popover placement="bottom" trigger="click">
                <template slot="content">
                  <div class="auto-complete-group">
                    {autoComplete.reverse().map(text => {
                      return (
                        <div class="auto-complete-item" onClick={this.autoCompleteClick(itemObj, text)}>
                          {text}
                        </div>
                      )
                    })}
                  </div>
                </template>
                {html(itemObj)}
              </a-popover>
            ) : (
              html(itemObj)
            )}
          </a-form-item>
        </a-col>
      )
    },
    arrTextCreator(itemObj) {
      return (
        <a-col lg={8} md={12} sm={24} style={this.isShowAll || this.isShowAll1 || itemObj.show ? '' : 'display:none;'}>
          <a-form-item labelCol={this.formItemLayout.labelCol} wrapperCol={this.formItemLayout.wrapperCol} label={itemObj.label}>
            <div style="display: flex;">
              <a-form-item style="width: 70px;">
                <a-select
                  onChange={this.onSelectChange.bind(this, itemObj.key, itemObj)}
                  allowClear={itemObj.allowClear === undefined ? true : itemObj.allowClear}
                  mode={itemObj.mode || 'default'}
                  class="smallSelect"
                  v-decorator={[
                    itemObj.selectKey,
                    {
                      initialValue: itemObj.arrInitialValue
                    }
                  ]}
                  placeholder={itemObj.arrPlaceholder}
                >
                  {itemObj.staticArr.map(itemSelect => {
                    return (
                      <a-select-option allowClear={true} value={itemSelect.value}>
                        {itemSelect.string}
                      </a-select-option>
                    )
                  })}
                </a-select>
              </a-form-item>
              <a-form-item style="width: calc(100% - 70px);">
                <a-input
                  name={itemObj.key}
                  autocomplete="on"
                  addonBefore={itemObj.addonBefore}
                  addonAfter={itemObj.addonAfter}
                  placeholder={itemObj.placeholder}
                  v-decorator={[itemObj.key, { initialValue: itemObj.initialValue }]}
                />
              </a-form-item>
            </div>
          </a-form-item>
        </a-col>
      )
    },
    arrSectionCreator(itemObj) {
      return (
        <a-col lg={8} md={12} sm={24} style={this.isShowAll || this.isShowAll1 || itemObj.show ? '' : 'display:none;'}>
          <a-form-item labelCol={this.formItemLayoutZero.labelCol} wrapperCol={this.formItemLayoutZero.wrapperCol} label={itemObj.label}>
            <div style="display: flex;">
              <a-form-item style="width: 93px;">
                <a-select
                  onChange={this.onSelectChange.bind(this, itemObj.key, itemObj)}
                  allowClear={itemObj.allowClear === undefined ? true : itemObj.allowClear}
                  mode={itemObj.mode || 'default'}
                  class="smallSelect"
                  v-decorator={[
                    itemObj.selectKey,
                    {
                      initialValue: itemObj.arrInitialValue
                    }
                  ]}
                  placeholder={itemObj.arrPlaceholder}
                >
                  {itemObj.staticArr.map(itemSelect => {
                    return (
                      <a-select-option allowClear={true} value={itemSelect.value}>
                        {itemSelect.string}
                      </a-select-option>
                    )
                  })}
                </a-select>
              </a-form-item>

              {this.selectFormData[itemObj.selectKey]==='B' ? (
                ''
              ):(
                <a-form-item style='width: 93px;'>
                  <a-select
                    onChange={this.onSelectChange.bind(this, itemObj.selectKeyTwo, itemObj)}
                    allowClear={itemObj.allowClear === undefined ? true : itemObj.allowClear}
                    mode={itemObj.mode || 'default'}
                    className='smallSelect'
                    v-decorator={[
                      itemObj.selectKeyTwo,
                      {
                        initialValue: itemObj.arrInitialValueTwo
                      }
                    ]}
                    placeholder={itemObj.arrPlaceholder}
                  >
                    {itemObj.staticArrTwo.map(itemSelect => {
                      return (
                        <a-select-option allowClear={true} value={itemSelect.value}>
                          {itemSelect.string}
                        </a-select-option>
                      )
                    })}
                  </a-select>
                </a-form-item>
              )}
              {this.selectFormData[itemObj.selectKey]!=='B'&&this.selectFormData[itemObj.selectKeyTwo]==='B' ? (
                <a-form-item  >
                  <div style="display:flex;align-items: center;height:40px;">
                    <a-select
                      style="width:100px;"
                      onChange={this.onSelectChange.bind(this, itemObj.selectKeyThree, itemObj)}
                      allowClear={itemObj.allowClear === undefined ? true : itemObj.allowClear}
                      mode={itemObj.mode || 'default'}
                      className='smallSelect'
                      v-decorator={[
                        itemObj.selectKeyThree,
                        {
                          initialValue: itemObj.arrInitialValueThree
                        }
                      ]}
                      placeholder={itemObj.arrPlaceholder}
                    >
                      {itemObj.staticArrThree.map(itemSelect => {
                        return (
                          <a-select-option allowClear={true} value={itemSelect.value}>
                            {itemSelect.string}
                          </a-select-option>
                        )
                      })}
                    </a-select>
                    <a-input-number
                      v-decorator={[`${itemObj.numKey}`, { initialValue: itemObj.initialValueStart }]}
                      style="width:calc(100%);"
                    />
                    <div style="text-align:center;width:30px;height:32px;line-height:32px;flex:1;background-color: #fafafa;border: 1px solid #d9d9d9;border-top-right-radius: 4px;border-bottom-right-radius: 4px;border-left:0;">
                      {itemObj.addonAfterTwo}
                    </div>
                  </div>
                </a-form-item>
              ):(
                <a-form-item style="width: calc( 100% - 185px );">
                  <div style="display:flex;align-items: center;">
                    <a-input-number
                      min={itemObj.minNum}
                      v-decorator={[`start${itemObj.key}`, { initialValue: itemObj.initialValueStart }]}
                      style="width:calc(50% - 25px);"
                    />
                    <div style="width:20px;display:inline-block;text-align:center;">至</div>
                    <a-input-number
                      min={itemObj.minNum}
                      style="width:calc(50% - 25px);border-top-right-radius: 0px;border-bottom-right-radius: 0px;"
                      v-decorator={[`end${itemObj.key}`, { initialValue: itemObj.initialValueEnd }]}
                    />
                    <div style="text-align:center;width:30px;height:32px;line-height:32px;flex:1;background-color: #fafafa;border: 1px solid #d9d9d9;border-top-right-radius: 4px;border-bottom-right-radius: 4px;border-left:0;">
                      {itemObj.addonAfter}
                    </div>
                  </div>
                </a-form-item>
              )}
            </div>
          </a-form-item>
        </a-col>
      )
      // return (
      //   <a-col lg={8} md={12} sm={24} style={this.isShowAll || this.isShowAll1 || itemObj.show ? '' : 'display:none;'}>
      //     <a-form-item labelCol={this.formItemLayout.labelCol} wrapperCol={this.formItemLayout.wrapperCol} label={itemObj.label}>
      //       <a-input-number min={itemObj.minNum} v-decorator={[`start${itemObj.key}`, { initialValue: itemObj.initialValue }]} style="width:48%;" />
      //       <div style="width:4%;display:inline-block;text-align:center;">~</div>
      //       <a-input-number min={itemObj.minNum} style="width:48%;" v-decorator={[`end${itemObj.key}`, { initialValue: itemObj.initialValue }]} />
      //     </a-form-item>
      //   </a-col>
      // )
    },
    selectCreator(itemObj) {
      return (
        <a-col lg={8} md={12} sm={24} style={this.isShowAll || this.isShowAll1 || itemObj.show ? '' : 'display:none;'}>
          <a-form-item
            label={itemObj.label}
            labelCol={itemObj.setCol ? { span: itemObj.setCol[0] } : this.formItemLayout.labelCol}
            wrapperCol={itemObj.setCol ? { span: itemObj.setCol[1] } : this.formItemLayout.wrapperCol}
          >
            {this.selectArr[`${itemObj.key}Arr`] ? (
              <a-select
                showSearch={itemObj.search}
                option-filter-prop="children"
                filter-option={this.filterOption.bind()}
                onChange={this.onSelectChange.bind(this, itemObj.key, itemObj)}
                allowClear={itemObj.allowClear === undefined ? true : itemObj.allowClear}
                mode={itemObj.mode || 'default'}
                maxTagCount={1}
                v-decorator={[
                  itemObj.key,
                  {
                    initialValue: this.transferSelectInitialValue(itemObj)
                  }
                ]}
                placeholder={itemObj.placeholder}
              >
                {this.selectArr[`${itemObj.key}Arr`].map((itemSelect, index) => {
                  return (
                    <a-select-option allowClear={true} value={itemSelect.value} key={index}>
                      {itemSelect.string}
                    </a-select-option>
                  )
                })}
              </a-select>
            ) : (
              <a-select placeholder={itemObj.placeholder} />
            )}
          </a-form-item>
        </a-col>
      )
    },
    chooseModalCreator(itemObj) {
      const { key, initialValue, multiple } = itemObj
      let value = null
      if (key === 'all') {
        if (initialValue && initialValue.id) {
          if (!this.chooseModalValue.userId) {
            this.chooseModalValue.userId = initialValue.id
            this.chooseModalValue.userDeptId = initialValue.deptId
          }
          value = initialValue.user
        }
      } else {
        if (initialValue && initialValue[`${key}Id`]) {
          if (!this.chooseModalValue[`${key}Id`]) {
            this.chooseModalValue[`${key}Id`] = initialValue[`${key}Id`]
            this.chooseModalValue[`${key}DeptId`] = initialValue[`${key}DeptId`]
          }
          value = initialValue[key]
        }
      }
      this.multiple = multiple
      return (
        <a-col lg={8} md={12} sm={24} style={this.isShowAll || this.isShowAll1 || itemObj.show ? '' : 'display:none;'}>
          <a-form-item label={itemObj.label} labelCol={this.formItemLayout.labelCol} wrapperCol={this.formItemLayout.wrapperCol}>
            <span onClick={this.getModalFn.bind(this, itemObj)}>
              <a-input
                name={itemObj.key}
                autocomplete="on"
                ref={`ref${itemObj.key}`}
                style={{ cursor: 'pointer', color: '#000' }}
                disabled
                placeholder={itemObj.placeholder}
                v-decorator={[
                  itemObj.key,
                  {
                    initialValue: value
                  }
                ]}
              >
                <a-icon slot="addonAfter" type="search" />
              </a-input>
            </span>
          </a-form-item>
        </a-col>
      )
    },
    dateCreator(itemObj) {
      let showTime = itemObj.showTime || false
      if ((showTime === undefined || showTime === null || showTime === '') && itemObj.format) {
        showTime = itemObj.format.includes('hh') || itemObj.format.includes('mm') || itemObj.format.includes('ss') || itemObj.format === 'YYYY-MM'
      }
      //
      return (
        <a-col lg={8} md={12} sm={24} style={this.isShowAll || this.isShowAll1 || itemObj.show ? '' : 'display:none;'}>
          <a-form-item labelCol={this.formItemLayout.labelCol} wrapperCol={this.formItemLayout.wrapperCol} label={itemObj.label}>
            <a-range-picker
              disabled-date={itemObj.disabledType ? $event => this.disabledDate($event, itemObj) : itemObj.oldYear ? this.disabledDate.bind() : null}
              style="width:100%"
              onPanelChange={this.handlePanelChange2.bind(this, itemObj.key, itemObj)}
              mode={itemObj.mode}
              format={itemObj.format}
              showTime={showTime}
              allowClear={itemObj.allowClear}
              v-decorator={[itemObj.key, { initialValue: itemObj.istoday ? this.defaultToday : itemObj.defaultVal }]}
            />
          </a-form-item>
        </a-col>
      )
    },
    dateSlotCreator(itemObj) {
      return (
        <a-col lg={8} md={12} sm={24} style={this.isShowAll || this.isShowAll1 || itemObj.show ? '' : 'display:none;'}>
          <a-form-item labelCol={this.formItemLayout.labelCol} label={itemObj.label}>
            <div style="display: flex;">
              <a-form-item style="width: 70px;">
                <a-select
                  onChange={this.onSelectChange.bind(this, itemObj.key, itemObj)}
                  allowClear={itemObj.allowClear === undefined ? true : itemObj.allowClear}
                  mode={itemObj.mode || 'default'}
                  class="smallSelect"
                  v-decorator={[
                    itemObj.selectKey,
                    {
                      initialValue: itemObj.initialValue
                    }
                  ]}
                  placeholder={itemObj.placeholder}
                >
                  {itemObj.staticArr.map(itemSelect => {
                    return (
                      <a-select-option allowClear={true} value={itemSelect.value}>
                        {itemSelect.string}
                      </a-select-option>
                    )
                  })}
                </a-select>
              </a-form-item>
              <a-form-item style="width: calc(88.9% - 70px);">
                <a-range-picker
                  class="smallPicker"
                  format={itemObj.format}
                  showTime={itemObj.format === 'YY-MM-DD hh:mm:ss'}
                  v-decorator={[itemObj.key, { initialValue: itemObj.istoday ? this.defaultToday : itemObj.defaultVal }]}
                />
              </a-form-item>
            </div>
          </a-form-item>
        </a-col>
      )
    },
    selectSlotCreator(itemObj) {
      return (
        <a-col lg={8} md={12} sm={24} style={this.isShowAll || this.isShowAll1 || itemObj.show ? '' : 'display:none;'}>
          <a-form-item labelCol={this.formItemLayout.labelCol} label={itemObj.label}>
            <div style="display: flex;">
              <div class="smallSelect" style="width: 70px;">
                {this.selectArr[`${itemObj.before.key}Arr`] ? (
                  <a-select
                    allowClear={itemObj.before.allowClear === undefined ? true : itemObj.before.allowClear}
                    mode={itemObj.before.mode || 'default'}
                    v-decorator={[
                      itemObj.before.key,
                      {
                        initialValue: itemObj.before.initialValue
                      }
                    ]}
                    placeholder={itemObj.before.placeholder}
                  >
                    {this.selectArr[`${itemObj.before.key}Arr`].map(itemSelect => {
                      return (
                        <a-select-option allowClear={true} value={itemSelect.value}>
                          {itemSelect.string}
                        </a-select-option>
                      )
                    })}
                  </a-select>
                ) : (
                  <a-select placeholder={itemObj.before.placeholder} />
                )}
              </div>
              <div class="smallSelectRight" style="width: calc(88.9% - 70px);">
                {this.selectArr[`${itemObj.key}Arr`] ? (
                  <a-select
                    showSearch={itemObj.search}
                    option-filter-prop="children"
                    filter-option={this.filterOption.bind()}
                    onChange={this.onSelectChange.bind(this, itemObj.key, itemObj)}
                    allowClear={itemObj.allowClear === undefined ? true : itemObj.allowClear}
                    mode={itemObj.mode || 'default'}
                    v-decorator={[
                      itemObj.key,
                      {
                        initialValue: itemObj.initialValue
                      }
                    ]}
                    placeholder={itemObj.placeholder}
                  >
                    {this.selectArr[`${itemObj.key}Arr`].map(itemSelect => {
                      return (
                        <a-select-option allowClear={true} value={itemSelect.value}>
                          {itemSelect.string}
                        </a-select-option>
                      )
                    })}
                  </a-select>
                ) : (
                  <a-select placeholder={itemObj.placeholder} />
                )}
              </div>
            </div>
          </a-form-item>
        </a-col>
      )
    },
    singledateCreator(itemObj) {
      return (
        <a-col lg={8} md={12} sm={24} style={this.isShowAll || this.isShowAll1 || itemObj.show ? '' : 'display:none;'}>
          <a-form-item label={itemObj.label} labelCol={this.formItemLayout.labelCol} wrapperCol={this.formItemLayout.wrapperCol}>
            <a-date-picker
              mode={itemObj.mode || 'date'}
              format={itemObj.format}
              v-decorator={[itemObj.key, { initialValue: itemObj.defaultVal }]}
              onPanelChange={this.onPanelChange.bind(this, itemObj.key, itemObj)}
              style={{ width: '100%' }}
            />
          </a-form-item>
        </a-col>
      )
    },
    monthCreator(itemObj) {
      return (
        <a-col lg={8} md={12} sm={24} style={this.isShowAll || this.isShowAll1 || itemObj.show ? '' : 'display:none;'}>
          <a-form-item label={itemObj.label} labelCol={this.formItemLayout.labelCol} wrapperCol={this.formItemLayout.wrapperCol}>
            <a-month-picker
              format={itemObj.format}
              v-decorator={[itemObj.key, { initialValue: moment(this.defaultMonth, 'YYYY-MM') }]}
              style={{ width: '100%' }}
            />
          </a-form-item>
        </a-col>
      )
    },
    cascaderCreator(itemObj) {
      return (
        <a-col lg={8} md={12} sm={24} style={this.isShowAll || this.isShowAll1 || itemObj.show ? '' : 'display:none;'}>
          <a-form-item label={itemObj.label} labelCol={this.formItemLayout.labelCol} wrapperCol={this.formItemLayout.wrapperCol}>
            {this.selectArr[`${itemObj.key}Arr`] ? (
              <a-cascader
                show-search={itemObj.search}
                options={this.selectArr[`${itemObj.key}Arr`]}
                placeholder={itemObj.placeholder}
                fieldNames={{
                  label: itemObj.treeOps.label,
                  value: itemObj.treeOps.value,
                  children: itemObj.treeOps.children
                }}
                changeOnSelect={itemObj.changeOnSelect == 'A' ? false : true}
                v-decorator={[itemObj.key, { initialValue: itemObj.initialValue }]}
              />
            ) : (
              <a-cascader
                show-search={itemObj.search}
                options={[]}
                placeholder={itemObj.placeholder}
                fieldNames={{
                  label: itemObj.treeOps.label,
                  value: itemObj.treeOps.value,
                  children: itemObj.treeOps.children
                }}
                changeOnSelect
                v-decorator={[itemObj.key, { initialValue: itemObj.initialValue }]}
              />
            )}
          </a-form-item>
        </a-col>
      )
    },
    treeSelectCreator(itemObj) {
      return (
        <a-col lg={8} md={12} sm={24} style={this.isShowAll || this.isShowAll1 || itemObj.show ? '' : 'display:none;'}>
          <a-form-item label={itemObj.label} labelCol={this.formItemLayout.labelCol} wrapperCol={this.formItemLayout.wrapperCol}>
            {this.selectArr[`${itemObj.key}Arr`] ? (
              <a-tree-select
                onChange={this.onTreeSelectChange.bind(this, itemObj.key, itemObj)}
                tree-checkable={itemObj.treeCheckable}
                show-search={itemObj.search}
                treeNodeFilterProp="title"
                maxTagCount={1}
                placeholder={itemObj.placeholder}
                allowClear={true}
                multiple={itemObj.mutiple}
                dropdownStyle={{ maxHeight: '400px', overflow: 'auto' }}
                treeData={this.selectArr[`${itemObj.key}Arr`]}
                treeDefaultExpandAll={itemObj.expandAll}
                v-decorator={[itemObj.key, { initialValue: itemObj.defaultVal }]}
              />
            ) : (
              <a-tree-select
                show-search={itemObj.search}
                treeNodeFilterProp="title"
                v-decorator={[itemObj.key, { initialValue: itemObj.defaultVal }]}
                multiple={itemObj.mutiple}
                placeholder={itemObj.placeholder}
                dropdownStyle={{ maxHeight: '400px', overflow: 'auto' }}
                treeData={[]}
              />
            )}
          </a-form-item>
        </a-col>
      )
    },
    // treedateS(itemObj) {
    //   return (
    //     <a-col lg={8} md={12} sm={24}>
    //       <a-form-item label={itemObj.label} labelCol={this.formItemLayout.labelCol} wrapperCol={this.formItemLayout.wrapperCol}>
    //         {itemObj.obj ? this.selectCreator(itemObj.obj) : ''}
    //         <a-range-picker format={itemObj.format} showTime={itemObj.format === 'YY-MM-DD hh:mm:ss'} v-decorator={[itemObj.key, { initialValue: itemObj.istoday ? this.defaultToday : itemObj.defaultVal }]} style={{ width: '100%' }} />
    //       </a-form-item>
    //     </a-col>
    //   )
    // },

    //数据处理函数
    _initSelectData() {
      this._props.searchParams.forEach(item => {
        if (item.isShow === false) {
          return
        }
        if (item.type === 'select') {
          this._selectNormalizeObj(item)
        }
        if (item.type === 'selectSlot') {
          this._selectBeforeNormalizeObj(item)
        }
        if (item.type === 'cascader') {
          this._cascaderNormalizeObj(item)
        }
        if (item.type === 'treeSelect' && item.isShow) {
          this._treeSelectNormalizeObj(item)
        }
        if (item.type === 'treeSelect' && item.isShowThird) {
          this._treeSelectNormalizeObjThird(item)
        }
        // if (item.istoday) {
        //   this.submit()
        // }
      })
    },
    _cascaderNormalizeObj(itemObj) {
      let { api, label, value, children, params, options } = itemObj.treeOps
      if (options) {
        this.$set(this.selectArr, `${itemObj.key}Arr`, options)
      } else {
        let data = params
          ? params
          : {
              type: itemObj.treeOps.type
            }
        api(data).then(res => {
          if (res.code === 200) {
            this.$set(this.selectArr, `${itemObj.key}Arr`, res.data)
          }
        })
      }
    },

    _selectNormalizeObj(itemObj) {
      if (itemObj.staticArr && itemObj.staticArr.length > 0) {
        this.$set(this.selectArr, `${itemObj.key}Arr`, itemObj.staticArr)
      }
      if (itemObj.apiOption) {
        let { api, string, value, params } = itemObj.apiOption
        api(params).then(res => {
          if (res.code === 200) {
            const renderArr = res.data.map(item => {
              const str = typeof string === 'function' ? string(item) : item[string]
              const val = typeof value === 'function' ? value(item) : item[value]
              return { string: str, value: val }
            })
            // 去重，解决银行卡重复的问题
            // let filterdArray = this._filterData(renderArr)
            this.$set(this.selectArr, `${itemObj.key}Arr`, renderArr)
          }
        })
      }
    },
    // 过滤重复数据
    // _filterData(renderArr) {
    //   let filterdValueArray = []
    //   let filterdArray = []
    //   for (const item of renderArr) {
    //     const { value } = item
    //     if (filterdValueArray.indexOf(value) === -1) {
    //       filterdValueArray.push(value)
    //       filterdArray.push(item)
    //     }
    //   }
    //   debugger
    //   return filterdArray
    // },
    _selectBeforeNormalizeObj(itemObj) {
      this._selectNormalizeObj(itemObj)

      if (itemObj.before.staticArr && itemObj.before.staticArr.length > 0) {
        this.$set(this.selectArr, `${itemObj.before.key}Arr`, itemObj.before.staticArr)
      }
      if (itemObj.before.apiOption) {
        let { api, string, value, params } = itemObj.before.apiOption
        api(params).then(res => {
          if (res.code === 200) {
            const renderArr = res.data.map(item => {
              return { string: item[string], value: item[value] }
            })
            this.$set(this.selectArr, `${itemObj.before.key}Arr`, renderArr)
          }
        })
      }
    },
    //处理三级分馆数据
    _treeSelectNormalizeObjThird(itemObj) {
      let { api } = itemObj.treeOps
      let selectFather = itemObj.selectFather
      api().then(res => {
        if (res.code === 200) {
          let data = this._handleTreeData(res.data, itemObj)
          const renderArr = this.formateThirdChildren(data)
          this.$set(this.selectArr, `${itemObj.key}Arr`, renderArr)
        }
      })
    },
    formateFinanceTableData(data, itemObj, level) {
      let { label, value, children } = itemObj.treeOps
      return data.map((item, index) => {
        let temObj = {}
        temObj.title = item.title
        temObj.value = item.value
        temObj.key = item.key
        temObj.deptType = item.deptType
        temObj.level = item.level
        temObj.disabled = level ? item.level != level : false
        if (item[children]) {
          temObj.children = this.formateFinanceTableData(item.children, itemObj, level)
        }
        return temObj
      })
    },
    formateThirdChildren(data) {
      data.forEach(item => {
        let key = item.children
          .filter(col => {
            return col.deptType == 'B'
          })
          .map(row => row.key)
          .join(',')
        item.children = item.children.filter(col => {
          return col.deptType == 'C'
        })
        item.children.push({
          key: key,
          title: '培训学校',
          value: key
        })
      })
      return data
    },
    //处理分馆数据
    _treeSelectNormalizeObj(itemObj) {
      let { api, staticOptions } = itemObj.treeOps
      let selectFather = itemObj.selectFather
      if (api) {
        api().then(res => {
          if (res.code === 200) {
            const renderArr = this._handleTreeData(res.data, itemObj)
            this.$set(this.selectArr, `${itemObj.key}Arr`, renderArr)
          }
        })
        // 本地
      } else if (staticOptions) {
        const renderArr = this._handleTreeData(staticOptions, itemObj)
        this.$set(this.selectArr, `${itemObj.key}Arr`, renderArr)
      }
    },
    _handleTreeData(data, itemObj) {
      let { label, value, children } = itemObj.treeOps
      let selectFather = itemObj.selectFather
      return data.map((item, index) => {
        let temObj = {}
        temObj.title = item[label]
        if (itemObj.financeTable) {
          temObj.value = `${item[value]}@${item.level}`
        } else {
          temObj.value = itemObj.selectFather && !itemObj.treeCheckable && !itemObj.noBranch ? `${item[value]}:${item.deptType}` : `${item[value]}`
        }
        temObj.key = item[value]
        temObj.deptType = item.deptType
        temObj.level = item.level
        if (item[children]) {
          temObj.children = this._handleTreeData(item[children], itemObj)
          temObj.disabled = !selectFather
        }
        return temObj
      })
    },
    _normalizeDate(obj) {
      for (let k in obj) {
        //处理时间函数
        if ((obj[k] instanceof moment && k == 'signDate') || k == 'day' || k == 'singleDate' || k == 'startClassDate' || k == 'endClassDate') {
          obj[k] = this.$tools.tailor.getDate(obj[k])
        }
        if (obj[k] instanceof moment) {
          obj[k] = this.$tools.tailor.getMonth(obj[k])
        }
        //处理时间范围函数
        if (obj[k] instanceof Array && obj[k][0] instanceof moment) {
          if (/Time/.test(k)) {
            obj[`start${k}`] = this.$tools.tailor.getDateTime(obj[k][0])
            obj[`end${k}`] = this.$tools.tailor.getDateTime(obj[k][1])
          }
          if (/Month/.test(k)) {
            obj[`start${k}`] = this.$tools.tailor.getMonth(obj[k][0])
            obj[`end${k}`] = this.$tools.tailor.getMonth(obj[k][1])
          }
          if (/Date/.test(k)) {
            obj[`start${k}`] = this.$tools.tailor.getDate(obj[k][0])
            obj[`end${k}`] = this.$tools.tailor.getDate(obj[k][1])
          }
          if (/Interview/.test(k)) {
            obj[`start${k}`] = this.$tools.tailor.getDate(obj[k][0])
            obj[`end${k}`] = this.$tools.tailor.getDate(obj[k][1])
          }
          if (/edu/.test(k)) {
            obj[`${k}StartDate`] = this.$tools.tailor.getDate(obj[k][0])
            obj[`${k}EndDate`] = this.$tools.tailor.getDate(obj[k][1])
          }
          if (/UpDate/.test(k)) {
            obj[`start${k}`] = this.$tools.tailor.getDateTimes(obj[k][0]) + ':00'
            obj[`end${k}`] = this.$tools.tailor.getDateTimes(obj[k][1]) + ':59'
          }
          delete obj[k]
        }
        //处理tree类型和复数select类型
        if (obj[k] instanceof Array && !(obj[k][0] instanceof moment)) {
          obj[k] = obj[k].join(',')
        }
        //财务报表分馆特殊处理
        if (/@/.test(obj[k])) {
          let typeList = ['A', 'B', 'C', 'D']
          let list = obj[k].split(',')
          let schoolId = list.map(item => item.split('@')[0]).join(',')
          // let level = parseInt(list[0].split('@')[1])
          obj[k] = schoolId
          obj.level = list[0].split('@')[1]
        }
        //报表分馆特殊处理
        if (/:/.test(obj[k])) {
          let schoolId = obj[k].split(':')[0]
          let deptTypeId = obj[k].split(':')[1]
          obj[k] = schoolId
          obj.deptType = deptTypeId
        }
      }
      return obj
    },
    _delSpace(Obj) {
      if (Object.keys(Obj) > 0) {
        for (const key in Obj) {
          Obj[key] = Obj[key].trim()
        }
      }
      return Obj
    },
    otherClick(btnClick) {
      let fun = () => {}
      if (typeof btnClick === 'function') {
        fun = () => {
          this.form.validateFields().then(data => {
            let result = Object.assign({}, data, this.chooseModalValue)
            result = this._normalizeDate(this.$tools.delUndefined(result))
            result = this._delSpace(result)
            btnClick(result)
          })
        }
      }
      return fun
    }
  },

  render() {
    let isShowMore = false
    const typeCreator = renderArray => {
      isShowMore = renderArray
        .map(item => {
          return item.show
        })
        .every(this.checkAdult)
      this.isShowAll1 = renderArray
        .map(item => {
          return item.show
        })
        .every(this.checkAdult1)

      let show = renderArray
        .map(item => {
          return !item.show
        })
        .every(this.checkAdult)
      if (show) {
        isShowMore = true
      }
      return renderArray.map(itemObj => {
        if (itemObj.isShow === false) {
          return ''
        }
        switch (itemObj.type) {
          case 'empty':
            return this.emptyCreator(itemObj)
          case 'number':
            return this.numberCreator(itemObj)
          case 'text':
            return this.textCreator(itemObj)
          case 'arrText':
            return this.arrTextCreator(itemObj)
          case 'arrSection':
            return this.arrSectionCreator(itemObj)
          case 'select':
            return this.selectCreator(itemObj)
          case 'chooseModal':
            return this.chooseModalCreator(itemObj)
          case 'cardName':
            return this.chooseModalCreator(itemObj)
          case 'date':
            return this.dateCreator(itemObj)
          case 'dateSlot':
            return this.dateSlotCreator(itemObj)
          case 'selectSlot':
            return this.selectSlotCreator(itemObj)
          case 'singledate':
            return this.singledateCreator(itemObj)
          case 'month':
            return this.monthCreator(itemObj)
          case 'cascader':
            return this.cascaderCreator(itemObj)
          case 'treeSelect':
            return this.treeSelectCreator(itemObj)
          case 'section':
            return this.sectionCreator(itemObj)
          default:
        }
      })
    }
    return (
      <div class="search-com-wrapper" onKeydown={this.onKeyupSubmit} tabindex="1">
        <a-row>
          <a-form form={this.form} autocomplete="on">
            <a-col span="21">
              {typeCreator(this.searchParams)}

              {this.isShowAll || this.isShowAll1 ? this.$slots.custom : ''}
            </a-col>
            <a-col span="3">
              <a-button class="btn btn-submit" type="primary" onclick={this.submit}>
                查询
              </a-button>
              {this.hideReset ? (
                ''
              ) : (
                <a-button class="btn" onClick={this.reset}>
                  重置
                </a-button>
              )}
              {this.otherBtn && this.otherBtn.length > 0
                ? this.otherBtn.map(btn => {
                    return (
                      <a-button class="btn" onClick={this.otherClick(btn.click)}>
                        {btn.name}
                      </a-button>
                    )
                  })
                : ''}
            </a-col>
          </a-form>
        </a-row>
        {!isShowMore ? (
          <div class="searchMore" onclick={this.showAll}>
            {this.isShowAll ? <a-icon type="caret-up" /> : <a-icon type="caret-down" />}
            高级查询
          </div>
        ) : (
          ''
        )}

        <i-modal ref="modal" checkBox={this.multiple} value={this.value} userType={this.userType} ongetBackData={this.getUserBack} />
        <GetCard ref="cardModal" multiple={this.multiple} classType="classType" ongetBackData={this.getCardBack} />
        <GetEduCard ref="cardEduModal" classType={this.cardNameEduType} ongetBackData={this.getCardBackEdu} />
        <choose-tea ref="choosetea" teaFields={this.teaFields} ongetBackData={this.getTeaData} />
      </div>
    )
  }
}
</script>

<style lang="less" type="text/less" scoped>
.auto-complete-group {
  margin: -12px -16px;
  padding: 4px 0;

  .auto-complete-item {
    cursor: pointer;
    padding: 5px 12px;
    font-weight: normal;
    font-size: 14px;
    line-height: 22px;
    max-width: 180px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    &:hover {
      background-color: #dae8e1;
    }
  }
}
.search-com-wrapper {
  position: relative;
  outline: none;
  .btn {
    position: relative;
    top: 6px;
  }

  .btn-submit {
    margin-right: 10px;
  }
  .searchMore {
    position: absolute;
    bottom: -28px;
    left: 50%;
    transform: translateX(-50%);
    padding: 0 20px !important;
    border-radius: 8px !important;
    background: #fff;
    height: 30px;
    line-height: 32px;
    cursor: pointer;
  }
}
.smallSelect {
  /deep/ .ant-select-selection {
    border-right: none;
    border-radius: 4px 0 0 4px;
  }
}
.smallSelectRight {
  /deep/ .ant-select-selection {
    border-radius: 0 4px 4px 0;
  }
}
.smallPicker {
  /deep/ .ant-calendar-picker-input {
    border-radius: 0 4px 4px 0;
  }
}
</style>
