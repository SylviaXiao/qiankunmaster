<template>
  <div id="print_html" class="print_html">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'PrintBox',
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  methods: {
    print() {
      var el = document.getElementById('print_html')

      var iframe = document.createElement('IFRAME')
      iframe.setAttribute('style', 'position:absolute;width:0px;height:0px;left:-500px;top:-500px;')
      document.body.appendChild(iframe)

      var doc = iframe.contentWindow.document

      let contentHtml = el.innerHTML
        .replace(/\"cus_row\"/g, '"cus_row" style="min-height:45px;display: flex;border-bottom: 1px solid #9d9d9d"')
        .replace(/class\=\"item-text/g, 'style="line-height:40px;padding:5px;text-align:center;color: #333;" class\="item-text')
        .replace(/no-print/g, '" style="display:none;"')
      // .replace(/\<style/g, '\<style media="print"')
      //.replace(/\:\:after/g, ' ')

      let headerHtml = this.title
        ? `<div style="font-size: 28px;font-weight:bold;text-align:center;margin-top:20px; margin-bottom:40px">${this.title}</div>`
        : ''

      // 提取样式
      let styles = el.querySelectorAll('style')
      let docStyle = ''
      for (var i = 0; i < styles.length; i++) {
        docStyle += '\r\n' + styles[i].innerHTML
      }
      docStyle = `<style media="print"> 
        @page {
          size: auto; 
          margin: 0mm; 
        }
        .no-print {
          display: none;
        } 
        ${docStyle} 
      </style>`

      doc.write('<div style="margin:16mm">' + headerHtml + contentHtml + '</div>' + docStyle)
      doc.close()

      iframe.contentWindow.focus()
      iframe.contentWindow.print()
      if (navigator.userAgent.indexOf('MSIE') > 0) {
        document.body.removeChild(iframe)
      }
    }
  }
}
</script>

<style></style>
