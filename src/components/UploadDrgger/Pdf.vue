<template>
  <div class="pdfPreview">
    <iframe :src="url" frameborder="0" style="width: 100%; height: 50vh;">
      您的浏览器不支持预览PDF文件，请下载查看！
    </iframe>
  </div>
</template>
<script>

export default {
  props: {
    url: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
    }
  },
}
</script>
