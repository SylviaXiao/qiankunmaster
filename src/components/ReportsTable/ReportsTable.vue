<template>
  <div class="reports-iframe-wrapper">
    <a-spin
      tip="正在加载中..."
      :spinning="true"
      style="width:100%; position: absolute; top: 0; display: flex; justify-content: center; background: rgba(255, 255, 255, 0.7); align-items: center;"
      :style="iFrameStyle"
      v-if="rpSpinning"
    >
    </a-spin>
    <div :style="iFrameStyle">
      <div ref="elementSearch" :style="{ padding: '20px 0 0' }" v-if="searchParams.length > 0 && !hideSearch">
        <a-card :bordered="false">
          <search-com-pro :hideReset="hideReset" :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" ref="elementSearch" :searchParams="searchParams">
          </search-com-pro>
        </a-card>
      </div>
      <div :style="`width:100%;width: 100%;overflow: scroll; height:calc(100% - ${height}px);padding:5px;background:#fff;margin-top:20px;`">
        <div class="mb10 mt5">
          <a-button v-if="exportUrl" type="primary" icon="download" @click.native="downloadStu">
            导出
          </a-button>
          <a-tooltip v-if="exportTips">
            <template slot="title">
              <div class="mb-10">
                <div v-for="(item, index) in exportTips" :key="index" class="pt-10">{{ item }}</div>
              </div>
            </template>
            <a-icon class="ml-10" type="question-circle" />
          </a-tooltip>
        </div>
        <!-- height:calc(100% - ${height}px); -->
        <table border="1" cellspacing="0" cellpadding="3" style="text-align:center;font-size: 10pt;min-width: 100%;">
          <tr v-for="(item, index) in headData" :key="index" :style="item.style">
            <th v-for="(col, colIndex) in item.data" :key="colIndex" :style="col.style" :rowspan="col.rowspan" :colspan="col.colspan" @click="toDetail(col)">
              <template v-if="col.hover && col.hoverName">
                <a-popover title="">
                  <template slot="content">
                    {{ col.hoverName }}
                  </template>
                  {{ col.label }}
                </a-popover>
              </template>
              <template v-else>
                {{ col.label }}</template
              >
            </th>
          </tr>
          <template v-if="!autoLoad&&loadData.length===0">
          </template>
          <template>
            <tr v-for="(item, index) in loadData" :key="index + headData.length">
              <td
                v-for="(col, colIndex) in item.data"
                :key="colIndex"
                :style="col.rowspan > 1 ? col.style : item.style + col.style"
                :rowspan="col.rowspan"
                :colspan="col.colspan"
                @click="toDetail(col)"
              >
                {{ col.label }}
              </td>
            </tr>
          </template>
        </table>
        <template v-if="!autoLoad&&loadData.length===0">
          <div style='font-size: 30px;padding: 100px 0;text-align:center;color:#bfbfbf;'>请选择相关筛选条件后，再查询学员信息哦</div>
        </template>
        <div v-if="showPagination && total" class="mt20 right" style="position:relative;">
          <a-pagination
            v-model="queryParam.page"
            show-size-changer
            :show-total="total => `总共 ${total} 条 当前 ${this.queryParam.page} / ${Math.ceil(total / this.queryParam.limit)} 页`"
            :page-size-options="pageSizeOptions"
            :page-size.sync="queryParam.limit"
            :total="total"
            @change="onChange"
            @showSizeChange="onShowSizeChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { SearchComPro } from '@/components'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { pageSizeOptions } from '@/utils/tableDetails/details'

import axios from 'axios'
export default {
  name: 'ReportsIframe',
  props: {
    autoLoad: {
      //是否隐藏查询组件
      type: Boolean,
      default: true
    },
    hideSearch: {
      //是否隐藏查询组件
      type: Boolean,
      default: false
    },
    hideReset: {
      //重置
      required: false,
      type: Boolean,
      default: true
    },
    showPagination: {
      //表格总条数
      required: false,
      type: Boolean,
      default: false
    },
    isMerge: {
      //查询数据是否合并
      required: false,
      type: Boolean,
      default: false
    },
    total: {
      //表格总条数
      required: false,
      type: Number,
      default: 0
    },
    exportUrl: {
      //表格是否加载
      required: false,
      type: String,
      default: ''
    },
    headData: {
      //表头
      required: true,
      type: Array,
      default: []
    },
    loadData: {
      //表内容
      required: true,
      type: Array,
      default: []
    },
    searchParamsArray: {
      //搜索项
      required: true,
      type: Array,
      default: []
    },
    rpSpinning: {
      //表格是否加载
      required: true,
      type: Boolean,
      default: false
    },
    isFinanceTable: {
      //表格是否清除lever
      type: Boolean,
      default: false
    },
    isInitLoad: {
      //是否初始加载
      type: Boolean,
      default: false
    },
    exportTips: {
      type: Array,
      required: false,
    }
  },
  components: {
    SearchComPro
  },
  data() {
    return {
      height: 0,
      queryParam: {},
      searchParams: [],
      pageSizeOptions: pageSizeOptions
    }
  },
  computed: {
    iFrameStyle() {
      if (this.fType === 'signinlog') {
        return { height: '512px' }
      }
      return { height: 'calc(100vh - 70px)' }
    }
  },
  created() {
    //
    if (this.showPagination) {
      this.queryParam.limit = 20
      this.queryParam.page = 1
    }
  },
  mounted() {
    let height = this.$refs.elementSearch?.offsetHeight || 0
    this.height = height
  },
  watch: {
    searchParamsArray: {
      deep: true,
      immediate: true,
      handler(n, o) {
        let flag = false
        let that = this
        if (n) {
          this.searchParams = n
          this.searchParams.forEach(item => {
            if (item.defaultVal || item.initialValue) {
              if (item.isDate) {
                this.queryParam[`start${item.key}`] = item.defaultVal[0].format('YYYY-MM-DD')
                this.queryParam[`end${item.key}`] = item.defaultVal[1].format('YYYY-MM-DD')
              } else {
                this.queryParam[item.key] = item.defaultVal || item.initialValue
              }
              flag = true
            }
          })
          if (flag || this.isInitLoad) {
            // if (this.isFinanceTable) this.queryParam.level = ''
            this.$nextTick(() => {
              that.searchSubmit()
            })
          }
        }
      }
    }
  },
  methods: {
    onChange(page, dada) {
      this.queryParam.page = page
      this.page = page
      this.$emit('onShowSizeChange', {
        page: page,
        limit: this.queryParam.limit
      })
    },
    onShowSizeChange(page, limit) {
      this.queryParam.limit = limit
      this.queryParam.page = page
      this.$emit('onShowSizeChange', {
        page: page,
        limit: limit
      })
    },
    //导出
    downloadStu() {
      let exportUrl = this.exportUrl
      const { queryParam } = this.$parent
      const token = Vue.ls.get(ACCESS_TOKEN)
      let fields = [{ name: 'auth_token', value: token }]
      for (let k in queryParam) {
        if (k !== 'page' && k != 'limit' && queryParam[k]) fields.push({ name: k, value: queryParam[k] })
      }
      fields.push({ name: 'page', value: 0 })
      fields.push({ name: 'limit', value: 0 })
      const form = document.createElement('form')
      form.action = `${process.env.VUE_APP_URL}${exportUrl}`
      form.method = 'POST'
      form.target = 'downloadFrame'
      for (let i = 0; i < fields.length; i++) {
        const field = fields[i]
        const f = document.createElement('input')
        f.type = 'hidden'
        f.name = field.name
        f.value = field.value
        form.appendChild(f)
      }
      document.body.appendChild(form)
      form.submit()
      this.$message.success('正在下载...')
      document.body.removeChild(form)
    },
    //搜索功能
    searchSubmit(data, isReset) {
      let limit = this.queryParam.limit || 20
      let page = this.queryParam.page || 1
      if (data) {
        if (this.isMerge) {
          this.queryParam = data
        } else {
          this.queryParam = Object.assign(this.queryParam, data)
        }
      }
      if (this.showPagination) {
        this.queryParam.limit = limit || 20
        this.queryParam.page = page || 1
      }
      if(isReset){
        this.queryParam=data
      }
      this.$emit('searchSubmit', this.queryParam, isReset)
    },
    toDetail(data) {
      this.$emit('toDetail', data)
    }
  }
}
</script>

<style lang="less" scoped>
.reports-iframe-wrapper {
  /deep/ .ant-spin-container {
    height: 100%;
  }
  /deep/.ant-pagination-total-text {
    left: 25px;
  }
}
</style>
