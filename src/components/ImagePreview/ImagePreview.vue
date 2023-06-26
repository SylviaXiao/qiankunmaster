<template>
  <div>
    <a-modal
      ref="previewModal"
      :width="800"
      title="预览照片"
      :visible="visible"
      @cancel="close"
    >
      <div>
        <img :src="previewSrc" :style="`transform:rotate(${rotateValue}deg)`" style="width: 100%"/>
      </div>
      <template slot="footer">
        <template>
          <a-button @click="rotatePic">旋转</a-button>
        </template>
      </template>
    </a-modal>
  </div>
</template>

<script>
  import { previewFile } from '@/api/file'

  export default {
    data() {
      return {
        visible: false,
        previewSrc: null,
        rotateValue: 0,
      }
    },
    created() {
    },
    methods: {
      open(id) {
        this.visible = true
        this.previewFile(id)
      },
      close() {
        this.visible = false
        this.previewSrc = null
        this.rotateValue = 0
      },
      previewFile(fileId) {
        previewFile({ fileId })
          .then(res => {
            this.previewSrc = res.data
          })
      },
      rotatePic() {
        this.rotateValue += 90
      },
    }
  }
</script>

<style scoped lang="less">
</style>
