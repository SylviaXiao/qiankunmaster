import T from 'ant-design-vue/es/table/Table'
import get from 'lodash.get'
import Vue from 'vue'
import './index.less'

export default {
  data() {
    return {
      sliderVisual: true,
      slideValue: 0,
      needTotalList: [],
      selectedRows: [],
      selectedRowKeys: [],
      localLoading: false,
      localDataSource: [],
      localPagination: Object.assign({}, this.pagination),
      defaultPageSize: Vue.ls.get('defaultPageSize'),
      defaulKeys: [],
      totalPrice: '', //总金额，
      timer: null
    }
  },
  props: Object.assign({}, T.props, {
    sliderIndex: {
      type: [Number],
      default: 0
    },
    showSlider: {
      type: [Boolean],
      default: false
    },
    slideWidth: {
      type: [String],
      default: ''
    },
    totalMoney: {
      type: [String, Boolean],
      default: false
    },
    rowKey: {
      type: [String, Function],
      default: 'key'
    },
    data: {
      type: Function,
      required: true
    },
    expand: {
      type: Function,
      default: () => {}
    },
    expandedRowsChange: {
      type: Function,
      default: () => {}
    },
    pageSizeOptions: {
      type: Array,
      default: () => ['5', '10', '20', '30', '50']
    },
    pageNum: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    showSizeChanger: {
      type: Boolean,
      default: true
    },
    autoLoad: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: 'default'
    },
    /**
     * alert: {
     *   show: true,
     *   clear: Function
     * }
     */
    alert: {
      type: [Object, Boolean],
      default: null
    },
    rowSelection: {
      type: Object,
      default: null
    },
    /** @Deprecated */
    showAlertInfo: {
      type: Boolean,
      default: false
    },
    defaultRowKeys: {
      type: Boolean,
      default: false
    },
    //去掉分页总条数
    showPagination: {
      type: [String, Boolean],
      default: 'auto'
    },
    //去掉分页
    defaultPagination: {
      type: Boolean,
      default: false
    },
    /**
     * enable page URI mode
     *
     * e.g:
     * /users/1
     * /users/2
     * /users/3?queryParam=test
     * ...
     */
    pageURI: {
      type: Boolean,
      default: false
    }
  }),
  watch: {
    'localPagination.current'(val) {
      this.pageURI &&
        this.$router.push({
          ...this.$route,
          name: this.$route.name,
          params: Object.assign({}, this.$route.params, {
            pageNo: val
          })
        })
    },
    pageNum(val) {
      Object.assign(this.localPagination, {
        current: val
      })
    },
    pageSize(val) {
      Object.assign(this.localPagination, {
        pageSize: val
      })
    },
    showSizeChanger(val) {
      Object.assign(this.localPagination, {
        showSizeChanger: val
      })
    }
  },
  created() {
    const { pageNo } = this.$route.params
    const localPageNum = (this.pageURI && pageNo && parseInt(pageNo)) || this.pageNum
    this.localPagination =
      ['auto', true].includes(this.showPagination) &&
      Object.assign({}, this.localPagination, {
        current: localPageNum,
        pageSize: this.defaultPageSize || this.pageSize,
        showSizeChanger: this.showSizeChanger,
        showTotal: (total, range) => {
          if (this.totalMoney) {
            return `总共 ${total} 条 当前 ${this.localPagination.current} / ${Math.ceil(total / this.localPagination.pageSize)} 页 总金额：${
              this.totalPrice
            } 元`
          } else {
            return `总共 ${total} 条 当前 ${this.localPagination.current} / ${Math.ceil(total / this.localPagination.pageSize)} 页`
          }
        },
        hideOnSinglePage: false,
        showQuickJumper: true,
        pageSizeOptions: this.pageSizeOptions || [('5', '10', '20', '30', '50')]
      })
    this.needTotalList = this.initTotalList(this.columns)
    if(this.autoLoad) this.loadData()
  },
  mounted() {
    if (this.showSlider) {
      let element = document.getElementsByClassName('ant-layout-content')[0]
      element.addEventListener('scroll', this.scrollMain)
    }
  },
  methods: {
    /**
     * 表格添加额外滚动条
     * @param
     */
    scrollMain() {
      let that = this
      // if (this.timer) {
      //   clearInterval(this.timer)
      //   this.timer = null
      // } else {
      // that.timer = setTimeout(function() {
      let element = document.getElementsByClassName('ant-layout-content')[0]
      let height = element.scrollHeight - element.offsetHeight
      if (height - element.scrollTop < 10) {
        that.sliderVisual = false
      } else {
        that.sliderVisual = true
      }
      // }, 200)
      // }
    },
    /**
     * 表格添加额外滚动条
     * @param
     */
    sliderChange(value) {
      this.slideValue = value
      let length = document.getElementsByClassName('ant-table-body').length - 1
      let sliderIndex = this.sliderIndex > length ? length : this.sliderIndex
      let element = document.getElementsByClassName('ant-table-body')[sliderIndex]
      let width = element.scrollWidth - element.offsetWidth
      document.getElementsByClassName('ant-table-body')[sliderIndex].scrollLeft = (width * value) / 100
      // this.getTable(this)
    },
    getTable(data) {
      let table = data.$children[0]

      if (table.$el.className && table.$el.className.indexOf('table.$el.className') != -1) {

      } else {
        this.getTable(table)
      }
      // className
    },
    /**
     * 表格重新加载方法
     * 如果参数为 true, 则强制刷新到第一页
     * @param Boolean bool
     */
    refresh(bool = false) {
      bool &&
        (this.localPagination = Object.assign(
          {},
          {
            current: 1,
            pageSize: this.pageSize
          }
        ))
      this.slideValue = 0
      this.loadData()
    },
    /**
     * 加载数据方法
     * @param {Object} pagination 分页选项器
     * @param {Object} filters 过滤条件
     * @param {Object} sorter 排序条件
     */
    loadData(pagination, filters, sorter) {
      // Vue.ls.set('defaultPageSize', pagination ? pagination.pageSize : 10)
      if (pagination) {
        this.localPagination.pageSize != pagination.pageSize ? Vue.ls.set('defaultPageSize', pagination.pageSize) : ''
      }
      this.localLoading = true
      const parameter = Object.assign(
        {
          page: (pagination && pagination.current) || this.localPagination.current || this.pageNum,
          limit: (pagination && pagination.pageSize) || this.localPagination.pageSize || this.pageSize
        },
        (sorter &&
          sorter.field && {
            sortField: sorter.field
          }) ||
          {},
        (sorter &&
          sorter.order && {
            sortOrder: sorter.order
          }) ||
          {},
        {
          ...filters
        }
      )
      const result = this.data(parameter)
      // 对接自己的通用数据接口需要修改下方代码中的 r.pageNo, r.totalCount, r.data
      // eslint-disable-next-line
      if ((typeof result === 'object' || typeof result === 'function') && typeof result.then === 'function') {
        result.then(r => {
          r = r || { data: [], count: 0 }
          this.$emit('result', r)
          if (this.totalMoney) {
            let price = r.data.map(item => item[this.totalMoney])
            this.totalPrice = price
              .reduce((a, b) => this.$number(a).plus(b), this.$number(0))
              .toNumber()
              .toFixed(2)
          }
          //展开所有二级
          if (this.defaultRowKeys) {
            let arr = []
            //单独设置--展开所有功能
            let data = r.data instanceof Array ? r.data : r.data.tableData
            data.length &&
              data.forEach(item => {
                if (item.children && item.children.length) {
                  arr.push(item.id || item.key)
                  item.children.forEach(item => {
                    arr.push(item.id || item.key)
                    if (item.children && item.children.length) {
                      arr.push(item.id || item.key)
                      item.children.forEach(item => {
                        arr.push(item.id || item.key)
                      })
                    }
                  })
                }
              })
            this.defaulKeys = arr
          }
          this.localPagination = Object.assign({}, this.localPagination, {
            // current: r.pageNo, // 返回结果中的当前分页数
            current: parameter.page, // 返回结果中的当前分页数
            // total: r.count ? r.count : r.data.total, // 返回结果中的总记录数
            total: r.count || r.data.total || r.data.length || 0, // 返回结果中的总记录数
            showSizeChanger: this.showSizeChanger,
            pageSize: (pagination && pagination.pageSize) || this.localPagination.pageSize
          })
          // console.log('localPagination', this.localPagination)
          // 为防止删除数据后导致页面当前页面数据长度为 0 ,自动翻页到上一页
          if (r.data.length === 0 && this.localPagination.current > 1) {
            // this.localPagination.current--
            this.localPagination.current = Math.ceil(r.count / this.localPagination.pageSize) || 1
            this.loadData()
            return
          }
          // 这里用于判断接口是否有返回 r.totalCount 或 this.showPagination = false
          // 当情况满足时，表示数据不满足分页大小，关闭 table 分页功能
          // (!this.showPagination || !r.count && this.showPagination === 'auto') && (this.localPagination.hideOnSinglePage = true)
          !this.showPagination && (this.localPagination.hideOnSinglePage = true)
          // 修复showPagination为false时，a-table报错问题
          !this.showPagination && (this.localPagination = false)
          this.localDataSource = r.data instanceof Array ? r.data : r.data.tableData // 返回结果中的数组数据
          this.localLoading = false
        })
      }
    },

    initTotalList(columns) {
      const totalList = []
      columns &&
        columns instanceof Array &&
        columns.forEach(column => {
          if (column.needTotal) {
            totalList.push({
              ...column,
              total: 0
            })
          }
        })
      return totalList
    },
    /**
     * 用于更新已选中的列表数据 total 统计
     * @param selectedRowKeys
     * @param selectedRows
     */
    updateSelect(selectedRowKeys, selectedRows) {
      this.selectedRows = selectedRows
      this.selectedRowKeys = selectedRowKeys
      const list = this.needTotalList
      this.needTotalList = list.map(item => {
        return {
          ...item,
          total: selectedRows.reduce((sum, val) => {
            const total = sum + parseInt(get(val, item.dataIndex))
            return isNaN(total) ? 0 : total
          }, 0)
        }
      })
    },
    /**
     * 清空 table 已选中项
     */
    clearSelected() {
      if (this.rowSelection) {
        this.rowSelection.onChange([], [])
        this.updateSelect([], [])
      }
    },
    /**
     * 处理交给 table 使用者去处理 clear 事件时，内部选中统计同时调用
     * @param callback
     * @returns {*}
     */
    renderClear(callback) {
      if (this.selectedRowKeys.length <= 0) return null
      return (
        <a
          style="margin-left: 24px"
          onClick={() => {
            callback()
            this.clearSelected()
          }}
        >
          清空
        </a>
      )
    },
    renderAlert() {
      // 绘制统计列数据
      const needTotalItems = this.needTotalList.map(item => {
        return (
          <span style="margin-right: 12px">
            {item.title}总计 <a style="font-weight: 600">{!item.customRender ? item.total : item.customRender(item.total)}</a>
          </span>
        )
      })

      // 绘制 清空 按钮
      const clearItem =
        typeof this.alert.clear === 'boolean' && this.alert.clear
          ? this.renderClear(this.clearSelected)
          : this.alert !== null && typeof this.alert.clear === 'function'
          ? this.renderClear(this.alert.clear)
          : null

      // 绘制 alert 组件
      return (
        <a-alert showIcon={true} style="margin-bottom: 16px">
          <template slot="message">
            <span style="margin-right: 12px">
              已选择: <a style="font-weight: 600">{this.selectedRows.length}</a>
            </span>
            {needTotalItems}
            {clearItem}
          </template>
        </a-alert>
      )
    }
  },

  render() {
    const props = {}
    const localKeys = Object.keys(this.$data)
    const showAlert =
      (typeof this.alert === 'object' && this.alert !== null && this.alert.show && typeof this.rowSelection.selectedRowKeys !== 'undefined') || this.alert

    Object.keys(T.props).forEach(k => {
      const localKey = `local${k.substring(0, 1).toUpperCase()}${k.substring(1)}`
      if (localKeys.includes(localKey)) {
        props[k] = this[localKey]
        return props[k]
      }
      // if (k === 'defaultExpandedRowKeys') {
      //     if (this.defaultRowKeys) {
      //       props[k] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
      //     }
      // }
      if (k === 'expandedRowKeys') {
        if (this.defaultRowKeys) {
          props[k] = this.defaulKeys
        }
      }
      //如果不要分页新增分页属性
      if (this.defaultPagination) {
        this.$set(props, 'pagination', false)
      }
      if (k === 'rowSelection') {
        if (showAlert && this.rowSelection) {
          // 如果需要使用alert，则重新绑定 rowSelection 事件
          props[k] = {
            selectedRows: this.selectedRows,
            selectedRowKeys: this.selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
              this.updateSelect(selectedRowKeys, selectedRows)
              typeof this[k].onChange !== 'undefined' && this[k].onChange(selectedRowKeys, selectedRows)
            }
          }
          return props[k]
        } else if (!this.rowSelection) {
          // 如果没打算开启 rowSelection 则清空默认的选择项
          props[k] = null
          return props[k]
        }
      }

      this[k] && (props[k] = this[k])
      return props[k]
    })
    // let tableProps = { props, scopedSlots: { ...this.$scopedSlots } }
    // console.log('tableProps', tableProps)
    // debugger
    const table = (
      <div>
        <a-table
          {...{ props, scopedSlots: { ...this.$scopedSlots } }}
          onChange={this.loadData}
          onExpandedRowsChange={this.expandedRowsChange}
          onExpand={this.expand}
          rowClassName={(record, idx) => {
            if (idx % 2 === 1) return 'ant-table-even'
          }}
        >
          {Object.keys(this.$slots).map(name => (
            <template slot={name}>{this.$slots[name]}</template>
          ))}
        </a-table>
        {this.showSlider && this.sliderVisual ? (
            this.slideWidth?(
                <div style="position: fixed;top: 58px;z-index: 1000;width:calc(100% - 100px);right: 40px;">
                  <a-slider value={this.slideValue} id="test" style="padding:4px 0 ;background: rgb(0 0 0 / 20%);" onChange={this.sliderChange} />
                </div>
              ):(
                <div style="position: fixed;top: 58px;z-index: 1000;width:calc(100% - 321px);right: 40px;">
                  <a-slider value={this.slideValue} id="test" style="padding:4px 0 ;background: rgb(0 0 0 / 20%);" onChange={this.sliderChange} />
                </div>
              )
        ) : (
          ''
        )}
      </div>
    )

    return (
      <div class="table-wrapper">
        {showAlert ? this.renderAlert() : null}
        {table}
      </div>
    )
  }
}
