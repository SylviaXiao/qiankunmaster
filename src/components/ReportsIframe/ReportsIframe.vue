<template>
  <div class="reports-iframe-wrapper">
    <div :style="iFrameStyle">
      <div ref="elementSearch" :style="{ padding: '20px 0' }">
        <a-card :bordered="false"  v-if='showSearch'>
          <search-com-pro
            :hideReset="false"
            :style="{ padding: '10px 0' }"
            @searchSubmit="searchSubmit"
            ref="search"
            :searchParams="searchParams"
            :otherBtn="otherBtn"
          >
          </search-com-pro>
        </a-card>
      </div>
      <div :style="`position:relative;height:calc(100% - ${height}px);min-height:400px;`" class="scroll-wrapper">
        <a-spin
          tip="正在加载中..."
          :spinning="true"
          style="width:100%; position: absolute; top: 0; display: flex; justify-content: center; background: rgba(255, 255, 255, 0.7); align-items: center;"
          :style="iFrameStyle"
          v-if="rpSpinning"
        >
        </a-spin>
        <div v-if="showTips" style='font-size: 30px;padding: 100px 0;text-align:center;'>请选择相关筛选条件后，再查询信息哦</div>
        <iframe  :src="iframeSrc" @load="postMsg" frameborder="0" ref="rpIframe" id="rpIframe" width="100%" height="96%" scrolling="yes"></iframe>
<!--        v-if="autoLoad||!showTips"-->
      </div>

    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { mixin } from '@/utils/mixin'
import { SearchComPro } from '@/components'
export default {
  name: 'ReportsIframe',
  mixins: [mixin],
  props: {
    limit:{
      type: String,
      default: ''
    },
    autoLoad:{
      type: Boolean,
      default: true
    },
    fType: {
      type: String,
      default: 'report'
    },
    params: {
      type: Object,
      default: null
    },
    searchParamsArray: {
      type: Array,
      default: () => []
    },
    showSearch: {
      type: Boolean,
      default: true
    },
    otherBtn: {
      type: Array,
      default: () => []
    },
    src: {
      required: true,
      type: String,
      default: null
    },
    perm: {
      type: String,
      default: ''
    },
    date: {
      // month day [1, 5]
      type: [String, Array],
      default: null
    },
    // 除开搜索框的参数
    extParams: {
      type: Object,
      required: false
    }
  },
  components: {
    SearchComPro
  },
  data() {
    return {
      showTips:false,
      rpSpinning: false,
      height: 0,
      queryParam: {},
      searchParams: [],
      iframeSrc: '',
      schoolId: this.getSchoolId()
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
  mounted() {
    let height = this.$refs.elementSearch.offsetHeight
    this.height = height
    if(this.autoLoad){
      this.initIfram()
    }else{
      this.showTips=true
    }
  },
  created() {
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
              } else if (item.isMonth) {
                this.queryParam[`start${item.key}`] = item.defaultVal[0].format('YYYY-MM')
                this.queryParam[`end${item.key}`] = item.defaultVal[1].format('YYYY-MM')
              } else {
                this.queryParam[item.key] = item.defaultVal || item.initialValue
              }
              flag = true
            }
          })
          if (flag) {
            this.$nextTick(() => {
              if(that.autoLoad)that.searchSubmit()
            })
          }
        }
      }
    }
  },
  methods: {
    initIfram() {
      const { src, date, getToken, setDate, getSchoolId, queryParam, params } = this
      let submitParams = ''
      this.rpSpinning = true
      if (queryParam) {
        for (let k in queryParam) {
          if (k == 'deptKey') {
            let val1 = queryParam[k].split(',')
            submitParams += `&${k}=${val1[val1.length - 1]}`
          } else {
            submitParams += `&${k}=${queryParam[k]}`
          }
        }
      }
      if (params) {
        for (let k in params) {
          submitParams += `&${k}=${params[k]}`
        }
      }
      let url = process.env.VUE_APP_URL + src + `${getSchoolId() ? `&schoolId=${getSchoolId()}` : ''}` + `&auth_token=${getToken()}` + submitParams
      console.log('submitParams', submitParams)

      if (document.getElementById('rpIframe')) {
        if (this.iframeSrc && url === document.getElementById('rpIframe').src) {
          this.rpSpinning = false
          this.showTips=false
        }
        document.getElementById('rpIframe').onload = function() {
          this.showTips=false
          this.rpSpinning = false
        }.bind(this)
      }
      let that = this
      setTimeout(function() {
        that.iframeSrc = url
      }, 500)
      // return (
      //   // process.env.VUE_APP_URL + src + `${getSchoolId() ? `&schoolId=${getSchoolId()}` : ''}` + `&auth_token=${getToken()}` + params + `${setDate(date)}`
      //   url
      // )
    },

    setDate() {
      let date = new Date()
      let startDate = '',
        endDate = ''
      startDate = moment()
        .startOf(date)
        .format('YYYY-MM-DD')
      endDate = moment()
        .endOf(date)
        .format('YYYY-MM-DD')
      this.queryParam.startDate = startDate
      this.queryParam.endDate = endDate
      let that = this
      this.$nextTick(() => {
        that.searchSubmit()
      })
    },
    initData() {
      this.searchParams.forEach(item => {
        if (item.defaultVal || item.initialValue) {
          if (item.isDate) {
            this.queryParam[`start${item.key}`] = item.defaultVal[0].format('YYYY-MM-DD')
            this.queryParam[`end${item.key}`] = item.defaultVal[1].format('YYYY-MM-DD')
          } else if (item.isMonth) {
            this.queryParam[`start${item.key}`] = item.defaultVal[0].format('YYYY-MM')
            this.queryParam[`end${item.key}`] = item.defaultVal[1].format('YYYY-MM')
          } else {
            this.queryParam[item.key] = item.defaultVal || item.initialValue
          }
        }
      })
    },
    //搜索功能
    searchSubmit(data, isReset) {
      if (data) this.queryParam = data
      if (this.extParams) {
        this.queryParam = { ...this.queryParam, ...this.extParams }
      }
      if (isReset === 'isReset') {
        if(!this.autoLoad){
          this.rpSpinning = false
          // this.showTips=true
        }
        this.initData()
      }
      if(this.limit){
        if(this.limit==='eduTeacherPrivateEducation'){
          if(!this.queryParam.areaId){
            this.$notification['error']({
              message: '系统通知',
              description: '必须选择地区'
            })
            return
          }
        }
      }
      if(!this.autoLoad)this.showTips=false
      this.initIfram()
    }
  }
}
</script>

<style lang="less" scoped>
.reports-iframe-wrapper {

  background-color: white;
  /deep/ .ant-spin-container {
    height: 100%;

    // iframe {
    //   height: 100%;
    // }
    /**
iOS兼容iFrame滚动条样式
 */
    .scroll-wrapper {
      min-height: 300px;
      // position: relative;
      overflow: scroll;
      // z-index: 1000000;
      -webkit-overflow-scrolling: touch;
      background: white;
    }
    .scroll-wrapper iframe {
      height: 100%;
      overflow: scroll;
    }
  }
}
</style>
