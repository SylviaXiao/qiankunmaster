<template>
  <div class="performance-print-wrapper">
    <div ref="printHtml">
      <performanceScore ref="performanceScore" :record="{...record, pageType: 'detail'}"/>
    </div>
  </div>
</template>

<script>
  import html2canvas from 'html2canvas'
  import printJs from 'print-js'
  import performanceScore from './performanceScore'

  export default {
    name: 'performancePrint',
    components: {
      performanceScore
    },
    data() {
      return {
        record: null,
      }
    },
    created() {
    },
    methods: {
      print(record) {
        this.$nextTick(() => {
          this.handlePrint()
        })
      },
      handlePrint() {
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

<style type="text/less" lang="less" scoped>
  .performance-print-wrapper {
    overflow: hidden;
    height: 0;
  }
</style>
