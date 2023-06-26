<template>
  <div>
    <div id="custable_html">
      <div v-html="cusHtml"></div>
      <div v-html="'<style>' + cusCss + '</style>'"></div>
    </div>
    <div style="overflow:hidden;height:0;">
      <span ref="printHtml">
        <div class="title">{{ this.title }}</div>
        <div id="printHtml" v-html="cusHtmlPrint"></div>
      </span>
    </div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas'
import printJs from 'print-js'
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    cusHtml: {
      type: String,
      default: ''
    },
    cusHtmlPrint: {
      type: String,
      default: ''
    },
    cusCss: {
      default: ''
    }
  },
  methods: {
    print() {
      html2canvas(this.$refs.printHtml, {
        useCORS: true,
        scale: 2,
        dpi: 150
      })
        .then(canvas => {
          const printable = canvas.toDataURL()
          printJs({ printable, type: 'image' })
        })
        .catch(err => console.log(err))
    }
  }
}
</script>

<style lang="less">
#printHtml {
  .title {
    font-size: 28px;
    font-weight: bold;
    text-align: center;
    margin-top: 20px;
    margin-bottom: 40px;
  }
  .no-print {
    display: none;
  }
  .row {
    line-height: 40px;
  }
}
</style>
