<template>
  <div class="ava-box">
    <div class="ava">
      <a-avatar shape="square" style="width: 88.7px; height: 114px;font-size: 32px;line-height: 114px;" icon="user" :src="changeSrc || userSrc || localSrc" />
    </div>
    <div class="changeAva">
      <!--            <a href="javascript:;" @click="openAvaModal()" >修改头像</a>-->
      <a-upload :fileList="fileList" :beforeUpload="beforeUpload" :showUploadList="false" @change="handleChange">
        <a-button :loading="uploading">
          <a-icon type="upload" />
          上传
        </a-button>
      </a-upload>
      <a-button v-if="isTakePhoto" style="margin-left: 10px;" @click="openPhotoModal">
        <a-icon type="camera" />
        拍照
      </a-button>
    </div>
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      width="400px"
      title="拍照上传"
      v-model="photoModalVisible"
      okText="上传"
      cancelText="取消"
      @ok="sendPhoto"
    >
      <div class="video-wrapper" style="margin: 0 auto; ">
        <div class="video-box">
          <video ref="video" width="200px" height="257px" autoplay="autoplay"></video>
        </div>
        <div class="canvas-box">
          <canvas ref="canvas" width="200px" height="257px" v-show="!onPhoto"></canvas>
        </div>
      </div>
      <div class="btn-box">
        <div style="width: 80px; margin: 0 auto;">
          <a-button class="photo-btn" style="width: 80px;" v-if="onPhoto" @click="takePhoto">确定</a-button>
          <a-button class="photo-btn" style="width: 80px;" v-if="!onPhoto" @click="onPhoto = true">重拍</a-button>
        </div>
      </div>
    </a-modal>

    <cropper ref="avaModal" @crooperFile="getCropperFile"></cropper>
  </div>
</template>

<script>
import { changeAva } from '@/api/file'
import { autoUpload } from '@/tools/oss'
import { Cropper } from '@/components'
import { mapActions } from 'vuex'

const constraints = {
  video: { width: 200, height: 257 },
  audio: false
}
export default {
  name: 'UploadAvator',
  components: {
    Cropper
  },
  props: {
    size: {
      type: Number,
      default: 114
    },
    userSrc: {
      type: String,
      default: null
    },
    avaType: {
      type: String,
      default: null
    },
    isTakePhoto: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fileList: [],
      uploading: false,
      localSrc: '',
      changeSrc: null,
      //拍照上传
      photoModalVisible: false,
      onPhoto: false,
    }
  },
  created() {},
  methods: {
    ...mapActions(['GetInfo']),

    initLocalSrc() {
      this.localSrc = null
      this.changeSrc = null
    },
    openPhotoModal() {
      const { hasNavMedia, getMedia } = this
      hasNavMedia()
        .then(getMedia)
        .catch(err => console.log(err))
    },
    hasNavMedia() {
      this.photoModalVisible = true
      const { $notification, getMedia } = this
      return new Promise((resolve, reject) => {
        const hasNavMedia = navigator && navigator.mediaDevices && navigator.mediaDevices.getUserMedia
        console.log(!!hasNavMedia)
        hasNavMedia
          ? this.$nextTick(() => {
              this.$message.success('正在开启摄像头,请等待...', 1)
              const photoPromise = navigator.mediaDevices.getUserMedia({
                video: { width: 200, height: 257 },
                audio: false
              })
              photoPromise
                .then(() => {
                  this.onPhoto = true
                  this.photoModalVisible = true
                  $notification['success']({
                    message: '系统通知',
                    description: '摄像头启动成功'
                  })
                  resolve()
                })
                .catch(err => {
                  setTimeout(() => {
                    $notification['error']({
                      message: '系统通知',
                      description: '摄像头启动失败'
                    })
                  }, 1500)
                  reject(err)
                })
            })
          : this.$nextTick(() => {
              $notification['error']({
                message: '系统通知',
                description: '该浏览器不支持打开摄像头'
              })
              reject()
            })
      })
    },
    getMedia() {
      let promise = navigator.mediaDevices.getUserMedia(constraints)
      promise
        .then(MediaStream => {
          this.$refs.video.srcObject = MediaStream
          this.$refs.video.play()
        })
        .catch(err => console.log(err))
    },
    takePhoto() {
      const canvas = this.$refs.canvas
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      ctx.drawImage(this.$refs.video, 0, 0, 200, 257)
      this.$message.success('拍照成功!')
      this.onPhoto = false
    },
    sendPhoto() {
      const canvas = this.$refs.canvas
      canvas.toBlob(blob => {
        let fileBlob = new File([blob], `${new Date().getTime()}.png`)
        this.getCropperFile(fileBlob)
      })
    },
    beforeUpload(file) {
      this.fileName = file.name
      const _this = this
      return false
      //
      // this.getLocalSrc(file).then(url => {
      //   loadFiles(file, this.avaType)
      //     .then(uploadFile)
      //     .then(setAcl)
      //     .then(res => {
      //       _this.userSrc ? _this.changeSrc = url : _this.localSrc = url
      //       this.$emit('getFilesId', res)
      //     }).finally(() => {
      //     this.uploading = false
      //   })
      // })
      // return false
    },
    handleChange(info) {
      const { file } = info
      this.getLocalSrc(file).then(url => {
        this.$refs.avaModal.open(url)
      })
    },
    getLocalSrc(file) {
      return new Promise((resolve, reject) => {
        let url = null
        if (window.createObjectURL != undefined) {
          // basic
          url = window.createObjectURL(file)
        } else if (window.URL != undefined) {
          // mozilla(firefox)
          url = window.URL.createObjectURL(file)
        } else if (window.webkitURL != undefined) {
          // webkit or chrome
          url = window.webkitURL.createObjectURL(file)
        }
        if (url) {
          resolve(url)
        } else {
          reject()
        }
      })
    },
    getCropperFile(file) {
      const _this = this
      this.getLocalSrc(file).then(url => {
        const params = new window.File([file], this.fileName || file.name, {type: file.type || 'image/jpeg'} )
        console.log('phoock', params)
        autoUpload(params, this.avaType)
          .then(res => {
            _this.userSrc ? (_this.changeSrc = url) : (_this.localSrc = url)
            this.$emit('getFilesId', res)
            // this.GetInfo()
          })
          .finally(() => {
            this.uploading = false
            this.photoModalVisible = false
          })
        // autoUploadTest(file, this.avaType).then(res => {
        //   console.log(res)
        // })
      })
    },
    initAva() {
      this.changeSrc = null
      this.localSrc = null
    }
  }
}
</script>

<style scoped lang="less">
.ava-box {
  .changeAva {
    text-align: center;
    margin-top: 15px;
  }

  .ava {
    /*width: 200px;*/
    /*margin: 0 auto;*/
    /*margin-top: 30px;*/
    margin: 0 auto;

    span {
      display: block;
      margin: 0 auto;
    }
  }
}

.video-wrapper {
  width: 200px;
  height: 257px;
  position: relative;

  .video-box,
  .canvas-box {
    position: absolute;
    width: 200px;
    height: 257px;
    border: 1px dashed #000c17;
  }
}

.btn-box {
  margin-top: 15px;
}
</style>
