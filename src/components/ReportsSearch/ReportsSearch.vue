<template>
  <div class="reports-search-wrapper">
    <a-row>
      <a-col :span="24">
        <a-form :form="form">
          <div class="form-wrapper">
            <div class="search-header">
              <a-row>
                <a-col :span="18">
                  <a-row>
                    <a-col :lg='8' :md='12' :sm='24'
                           v-for="(item,index) in option"
                           :key="index"
                           v-if="index<3&&hasSchool(item.type)">
                      <a-form-item :label="item.label" v-bind="formItemLayout"
                      >
                        <a-month-picker v-if="item.type==='date'"
                                        format="YYYY-MM"
                                        placeholder="请选择月份"
                                        v-decorator="[`${item.fields}`,{initialValue:moment(item.defaultVal||defaultMonth, 'YYYY-MM')}]"
                                        style="width: 100%;"/>
                        <a-select v-if="item.type==='select'"
                                  allowClear
                                  v-decorator="[`${item.fields}`]"
                                  :placeholder="`请选择${item.label}`"
                                  :options="item.data"></a-select>
                        <a-range-picker v-if="item.type==='range'"
                                        :allowClear='false'
                                        v-decorator="[`${item.fields}`,{initialValue:item.defaultVal}]"
                                        style="width: 100%;"/>
                        <a-tree-select
                          v-if="item.type==='school'"
                          v-decorator="[`${item.fields}`]"
                          placeholder="全部"
                          :allowClear="true"
                          :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                          :treeData="schoolList"
                          @select="selectSchool"
                          treeDefaultExpandAll/>
                      </a-form-item>
                    </a-col>
                  </a-row>
                </a-col>
                <a-col class="submit-btn" :lg='6' :md='12' :sm='24'>
                  <a-button type="primary" @click="sensorData">查询</a-button>
                  <a-button :style="{marginLeft: '10px'}" @click="initSearch">重置</a-button>
                  <span class="arrow-wrapper" v-if="option.length>3" @click="isShow=!isShow">
                    <a-icon class="rotateIcon" :class="{rotate:isShow}" type="left"/> 折叠
                  </span>
                  <span else="showSearchTag.body" class="arrow-wrapper">
                  </span>
                </a-col>
              </a-row>
            </div>
            <transition name="slide21-down">
              <div class="search-body" v-if="isShow">
                <a-row>
                  <a-col :span="18">
                    <a-row>
                      <a-col :lg='8' :md='12' :sm='24' v-for="(item,index) in option" :key="index"
                             v-if="index>=3&&index<=5&&hasSchool(item.type)">
                        <a-form-item :label="item.label" v-bind="formItemLayout"
                                     v-if="item.type==='school'&&!hasSchool">
                          <a-date-picker v-if="item.type==='date'"
                                         format="YYYY-MM-DD"
                                         v-decorator="[`${item.fields}`,{initialValue:moment(item.defaultVal||defaultMonth, 'YYYY-MM')}]"
                                         style="width: 100%;"/>
                          <a-select v-if="item.type==='select'"
                                    allowClear
                                    v-decorator="[`${item.fields}`]"
                                    :placeholder="`请选择${item.label}`"
                                    :options="item.data"></a-select>
                          <a-range-picker v-if="item.type==='range'"
                                          :allowClear='false'
                                          v-decorator="[`${item.fields}`,{initialValue:item.defaultVal}]"
                                          style="width: 100%;"/>
                          <a-tree-select
                            v-if="item.type==='school'"
                            v-decorator="[`${item.fields}`]"
                            placeholder="全部"
                            :allowClear="true"
                            :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                            :treeData="schoolList"
                            treeDefaultExpandAll/>
                        </a-form-item>
                      </a-col>

                    </a-row>
                  </a-col>
                </a-row>
              </div>
            </transition>
          </div>
        </a-form>
      </a-col>
    </a-row>
  </div>
</template>

<script>
  import moment from 'moment'
  import { getSchoolList } from '@/api/education/card'

  const formItemLayout = {
    labelCol: {
      sm: {
        span: 7
      }
    },
    wrapperCol: {
      sm: {
        span: 16
      }
    }
  }
  export default {
    name: 'ReportsSearch',
    props: {
      option: {
        type: Array,
        default: null
      }
    },
    data() {
      return {
        moment,
        formItemLayout,
        isShow: false,
        defaultMonth: moment().subtract(1, 'days').format('YYYY-MM'),
        schoolList: []

      }
    },
    beforeCreate() {
      this.form = this.$form.createForm(this)
    },
    created() {
      this.renderSearch()
    },
    methods: {
      renderSearch() {
        const { option, $message, form: { setFieldsValue, validateFields }, loadSchoolId, hasSchool } = this
        if (!option || option.length == 0) {
          $message.error('搜索条件为空', 2)
          return false
        }
        option.map(item => {
          item.type == 'school' ? hasSchool(item.type) ? loadSchoolId() : '' : ''
        })

      },
      loadSchoolId() {
        const { rewriteData } = this
        getSchoolList().then(res => {
          const result = res.data
          rewriteData(result)
          this.schoolList = result
        })
      },
      hasSchool(type) {
        return type !== 'school' || !(!!this.$store.getters.userInfo.schools && this.$store.getters.userInfo.schools.length != 0)
      },
      //处理分馆数据
      rewriteData(data) {
        data.forEach(item => {
          if (item.title && item.key && item.value) {
            return false
          }
          item.title = item.name || item.deptName
          item.key = item.id
          item.value = `${item.id}:${item.deptType}`
          if (item.children && item.children.length > 0) {
            // item.disabled = true
            this.rewriteData(item.children)
          }
        })
      },
      selectSchool(value, node, extra) {
      },
      sensorData() {
        const { form: { getFieldsValue, validateFields }, getRangeFields, option } = this
        validateFields(null, { force: true }, (err, values) => {
          for (let item in values) {
            if (item.indexOf('month') != -1 && values[item]) {
              values[item] = this.$tools.tailor.getMonth(values[item])
            }
            if (item.indexOf(',') != -1 && values[item]) {
              item.split(',').map((fields, index) => {
                values[fields] = this.$tools.tailor.getDate(values[item][index])
              })
              delete values[item]
            }
            if (item == 'school_id' && values[item]) {
              const dataArr = values[item].split(':')
              values[item] = dataArr[0]
              values.deptType = dataArr[1]
            }
          }
          this.$emit('sensorData', values)
        })

      },
      getRangeFields(name) {
        return new Promise(resolve => {
          resolve(name.split(','))
        })
      },
      initSearch() {
        const { form: { resetFields } } = this
        resetFields()
        this.$emit('sensorData', {})
      }
    }
  }
</script>

<style scoped lang=less>
  @import '~@/assets/style/index';

  .reports-search-wrapper {
    :global {
      .ant-form-item {
        /*padding: 2px 0;*/
        margin-bottom: 0;
      }

      .ant-input-disabled {
        background-color: #f5f5f5;
        opacity: 1;
        cursor: pointer;
        color: rgba(0, 0, 0, 0.25);
      }
    }

    .form-wrapper {
      position: relative;
      box-sizing: border-box;
      border-radius: 3px;
      transition: all 0.3s linear;

      .search-header {
        position: relative;
        z-index: 100;
        background: #fff;

        .arrow-wrapper {
          position: relative;
          cursor: pointer;
          left: 5px;
          height: 49px;
          line-height: 49px;
        }
      }

      .search-body {
        position: relative;
        background: #fff;
        z-index: 50;
      }

      .rotateIcon {
        transition: all 0.3s linear;
        transform: rotate(0deg);

        &.rotate {
          transform: rotate(-90deg);
        }
      }

      .submit-btn {
        position: relative;
        top: -2px;
      }

      .empty {
        width: 100%;
        .center()
      }
    }

  }

</style>
