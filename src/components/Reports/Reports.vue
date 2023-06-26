<template>
  <div class="reports-container">
    <div class="btn-group" v-if="reportsType !== 'chart'">
      <div class="btn-group-item" v-for="(item, index) in BtnOptions" :key="index" @click="iconFunction(item.type)">
        <a-icon :type="item.type" :theme="item.theme ? 'twoTone' : ''" :twoToneColor="item.color ? item.color : ''" style="font-size: 24px;" />
      </div>
    </div>
    <a-spin :spinning="spinning">
      <a-slider id="slider" @change="changeSlider" v-model="sliderValues" />
      <div class="reports-content" :style="cusStyle" id="reports">
        <div :style="reportAlignStyle">
          <h3 style="text-align: center;" v-if="reportsTitle">{{ reportsOptions.title }}</h3>
          <span v-html="reportsOptions.content"></span>
          <span v-html="reportsOptions.style"></span>
          <!--        <table border='0' style='margin:auto;border-collapse:collapse;width:320pt'><tr style="height:18pt"><td rowspan="3" colspan="4" class='_A1'  ><div style="position: relative;width:318pt;height:342pt"><canvas id="A1" style="width:318px !important;height:342px !important"></canvas></div></td></tr><tr style="height:18pt"></tr><tr style="height:308pt"></tr></table>-->
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script>
const baesUrl = process.env.VUE_APP_URL
import { Chart } from 'chart.js'
import { excelReport } from '@/api/reports'
import { axios } from '@/utils/request'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'

const BtnOptions = [
  { type: 'printer', theme: true, color: false },
  // { type: 'file-word', theme: true, color: '#2B569A' },
  { type: 'file-excel', theme: true, color: '#1F7244' }
  // { type: 'file-pdf', theme: true, color: '#AE2228' }
]
export default {
  name: 'Reports',
  props: {
    cusStyle: {
      type: String,
      default: ''
    },
    reportsType: {
      type: String,
      default: 'reports'
    },
    reportsTable: {
      type: Function,
      default: () => {}
    },
    reportsTitle: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    reportAlign(nv, ov) {
      if (nv === 'center') {
        this.reportAlignStyle = {
          display: 'inline-block',
          margin: 'auto'
        }
      } else {
        this.reportAlignStyle = {
          display: 'block',
          float: nv
        }
      }
    }
  },
  data() {
    return {
      baesUrl,
      BtnOptions,
      spinning: false,
      reportsOptions: {
        content: '正在加载中...',
        style: '',
        align: 'center',
        alignStyle: 'center',
        jsonParam: '',
        title: '统计报表'
      },
      reportAlign: 'center',
      reportAlignStyle: {},
      sliderValues: 0
    }
  },
  created() {
    this.creatReports()
  },
  mounted() {
    const dom = document.getElementById('reports')
    dom.addEventListener('scroll', e => {
      this.sliderValues = (Math.ceil(dom.scrollLeft) / (dom.scrollWidth - dom.clientWidth)) * 100
    })
  },
  methods: {
    refresh() {
      this.getReports()
    },
    changeSlider(value) {
      const dom = document.getElementById('reports')
      const step = ((dom.scrollWidth - dom.clientWidth) * value) / 100
      dom.scrollLeft = step
    },
    creatReports() {
      const { getReports, setChart, reportsType } = this
      getReports()
        .then(res => {
          reportsType === 'chart' ? setChart(res) : ''
        })
        .catch(() => {
          this.reportsOptions['content'] = '暂无信息，请重新请求'
        })
    },
    getReports() {
      const _this = this
      _this.spinning = true
      return new Promise((resolve, reject) => {
        _this
          .reportsTable()
          .then(res => {
            if (!res) return false
            const result = res.data
            _this.reportsOptions = {
              content: result.content,
              style: `<style type="text/css">${result.style}</style>`,
              jsonParam: result.jsonParam,
              title: result.title || this.$route.meta.title
            }
            _this.reportAlign = result.reportAlign
            if (result.chartDatas && result.chartDatas.length > 0) {
              resolve(result.chartDatas)
            }
          })
          .finally(() => {
            _this.spinning = false
          })
      })
    },
    iconFunction(type) {
      const { printer, fileDownload } = this
      switch (type) {
        case 'printer':
          printer('reports')
          break
        case 'file-word':
          fileDownload('word')
          break
        case 'file-excel':
          fileDownload('excel')
          break
        case 'file-pdf':
          fileDownload('pdf')
          break
      }
    },
    printer(myDiv) {
      var printHtml = document.getElementById(myDiv).innerHTML
      var wind = window.open(
        '',
        'newwindow',
        'height=600, width=1200, top=100, left=100, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no'
      )
      wind.document.body.innerHTML = printHtml
      // const canvas = document.getElementById('A1')
      // wind.document.write('<br><img src=\'' + canvas.toDataURL() + '\'/>')
      wind.print()
      return false
    },
    fileDownload(api) {
      const {
        reportsOptions: { jsonParam, title },
        download
      } = this
      const token = Vue.ls.get(ACCESS_TOKEN)
      const school_id = Vue.ls.get('userDefaultId')
      let fields = [
        { name: 'auth_token', value: token },
        { name: 'school_id', value: school_id },
        { name: 'jsonParam', value: jsonParam }
      ]
      const form = document.createElement('form')
      form.action = `${process.env.VUE_APP_URL}/framework/report/excel`
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
      // excelReport({ jsonParam }).then(blob => download(blob, title))
    },
    download(blob, fileName) {
      const reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onload = e => {
        const a = document.createElement('a')
        a.download = `${fileName}.xlsx`
        a.href = e.target.result
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      }
    },
    setChart(options) {
      options.map(item => {
        const { id, json } = item
        let option = JSON.parse(json)
        var ctx = document.getElementById(id)
        var chart = new Chart(ctx, option)
      })
    }
  }
}
</script>

<style scoped lang="less">
.reports-container {
  .btn-group {
    display: flex;
    margin-bottom: 10px;

    .btn-group-item {
      padding-right: 10px;
      cursor: pointer;
    }
  }

  .reports-content {
    max-height: 700px;
    overflow-y: auto;
  }
}
</style>
