<template>
  <div>
    <a-modal
      title="修改头像"
      :visible="visible"
      :maskClosable="false"
      :confirmLoading="confirmLoading"
      :width="800"
      @cancel="cancelHandel">
      <a-row>
        <a-col :xs="24" :md="24" :style="{height: '350px'}">
          <vue-cropper
            ref="cropper"
            :img="option.img"
            :outputSize="option.size"
            :outputType="option.outputType"
            :autoCropWidth="option.autoCropWidth"
            :autoCropHeight="option.autoCropHeight"
            :info="true"
            :full="option.full"
            :canMove="option.canMove"
            :canMoveBox="option.canMoveBox"
            :original="option.original"
            :autoCrop="option.autoCrop"
            :fixed="option.fixed"
            :fixedNumber="option.fixedNumber"
            :centerBox="option.centerBox"
            :infoTrue="option.infoTrue"
            :fixedBox="option.fixedBox"
            @realTime="realTime"
          >
          </vue-cropper>
        </a-col>
<!--        <a-col :xs="24" :md="12" :style="{height: '350px'}">-->
<!--          &lt;!&ndash;          <div class="avatar-upload-preview">&ndash;&gt;-->
<!--          &lt;!&ndash;            <img :src="previews.url" :style="previews.img"/>&ndash;&gt;-->
<!--          &lt;!&ndash;          </div>&ndash;&gt;-->
<!--          <div class="show-preview"-->
<!--               :style="{'width': '150px', 'height':'155px',  'overflow': 'hidden', 'margin': '5px'}">-->
<!--            <div :style="previews.div" class="preview">-->
<!--              <img :src="previews.url" :style="previews.img">-->
<!--            </div>-->
<!--          </div>-->
<!--        </a-col>-->
      </a-row>

      <template slot="footer">
        <a-button key="back" @click="cancelHandel">取消</a-button>
        <a-button key="submit" type="primary" :loading="confirmLoading" @click="okHandel">保存</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
  import { VueCropper } from 'vue-cropper'


  export default {
    name: 'cropper',
    components: {
      VueCropper
    },
    data() {
      return {
        visible: false,
        id: null,
        confirmLoading: false,
        option: {
          img: '', // 裁剪图片的地址
          info: true, // 裁剪框的大小信息
          outputSize: 1, // 裁剪生成图片的质量
          outputType: 'jpeg', // 裁剪生成图片的格式
          canScale: true, // 图片是否允许滚轮缩放
          autoCrop: true, // 是否默认生成截图框
          autoCropWidth: 200, // 默认生成截图框宽度
          autoCropHeight: 257, // 默认生成截图框高度
          fixedBox: false, // 固定截图框大小 不允许改变
          fixed: true, // 是否开启截图框宽高固定比例
          fixedNumber: [1, 1.285], // 截图框的宽高比例
          full: true, // 是否输出原图比例的截图
          canMove: true, // 图片能否拖动
          canMoveBox: true, // 截图框能否拖动
          original: false, // 上传图片按照原始比例渲染
          centerBox: true, // 截图框是否被限制在图片里面
          infoTrue: true // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
        },
        previews: {}

      }
    },
    created() {

    },
    methods: {
      open(data) {
        this.option.img = data
        this.visible = true
      },
      close() {
        this.visible = false
      },
      cancelHandel() {
        this.close()
      },
      realTime(data) {
        this.previews = data
      },
      okHandel() {
        this.$refs.cropper.getCropBlob(data => {
          this.$emit('crooperFile', data)
          this.visible = false
        })
      }
    }

  }
</script>

<style scoped lang=less>
  .avatar-upload-preview,preview{
    position: absolute;
    top: 50%;
    transform: translate(50%, -50%);
    width: 180px;
    height: 180px;
    border-radius: 50%;
    box-shadow: 0 0 4px #ccc;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
    }
  }
</style>
