<template>
  <div class="photo-signin-wrapper">
    <div class="photo-signin-content">
      <perm-box perm="student:signinlog:view">
        <div style="overflow-y:scroll;">
          <a-row style="min-width:600px;">
            <a-col :xs="12" :sm="14" :md="7" :lg="7" :xl="7">
              <div class="student-list">
                <div class="student-items-wrapper">
                  <div class="student-items" v-for="(student, stuIdx) in finallyStudentArr" :key="stuIdx">
                    <div
                      class="student-item"
                      :class="{
                        selected: isSelected(student.stuCardId),
                        isOverdue: isOverdue(student.endValidDate) || isOverTimes(student) || !student.payoff
                      }"
                    >
                      <div class="student-content">
                        <div class="student-avatar">
                          <img v-if="student.avatar" class="avatar-img" :src="student.avatar" />
                          <img v-else class="avatar-img" :src="require(`@/assets/small_logo.png`)" />
                        </div>
                        <div class="student-info" @click="studentCheck(student)">
                          <div class="student-name" :class="{ selected: isSelected(student.stuCardId) }">
                            <span>{{ student.stuName }}</span>
                            <span class="student-small-text" :class="{ selected: isSelected(student.stuCardId) }">{{ student.stuPhone }}</span>
                          </div>
                          <div class="student-small-text" :class="{ selected: isSelected(student.stuCardId) }">
                            <span>有效期:{{ $tools.tailor.getDate(student.endValidDate) || '无' }}</span>
                          </div>
                          <div class="student-small-text" :class="{ selected: isSelected(student.stuCardId) }">
                            <span>次数:{{ `${student.usedCount}次/${student.totalCount || '不限次数'}` }}</span>
                          </div>
                        </div>
                      </div>
                      <div class="stu-remark" :class="{ selected: isSelected(student.stuCardId) }" @click.stop="openRemark(student)">
                        备注
                      </div>
                      <div v-if="student.signed === 'Y'" class="stu-sign-tag">
                        <span class="student-sign-tag-text">签</span>
                      </div>
                      <div v-if="student.status == 'C'" class="stu-sign-tag">
                        <span class="student-sign-tag-text red-text">停</span>
                      </div>
                      <div v-if="!student.payoff" class="stu-sign-tag">
                        <span class="student-sign-tag-text red-text">欠</span>
                      </div>
                      <div v-if="isOverdue(student.endValidDate) || isOverTimes(student)" class="stu-sign-tag">
                        <span class="student-sign-tag-text red-text">过</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </a-col>
            <a-col :xs="12" :sm="10" :md="17" :lg="17" :xl="17">
              <div class="stu-signin" ref="photoSignin">
                <div class="checkbox-group">
                  <a-checkbox-group v-model="defaultCheckedList" @change="changePhotoMask" style="width: 100%;">
                    <span v-for="(item, index) in studentSignedOptions" :key="index">
                      <a-checkbox :value="item.value" :style="{ color: item.color }">
                        {{ `${item.label} (${item.length}人)` }}
                      </a-checkbox>
                    </span>
                  </a-checkbox-group>
                </div>
                <div class="signlog">
                  <a href="javascript:;" @click="getRecognizeFile">签到照片记录</a>
                </div>
                <div class="upload-stu">
                  <a-spin :spinning="uploadLoading" tip="正在识别中..." style="height: 500px;">
                    <div class="image-upload" ref="imgbox">
                      <a-upload class="image-uploader" :showUploadList="false" :beforeUpload="beforeUpload">
                        <div class="upload-success" v-if="localImageSrc">
                          <div class="image-parent">
                            <img :src="localImageSrc" alt="studentUpload" :style="imgstyle" />
                            <a-tooltip placement="rightTop" v-for="(item, index) in imageMaskList" :key="index">
                              <template slot="title">
                                <div v-if="item.stuInfo">
                                  <p>姓名:{{ item.stuInfo.stuName ? item.stuInfo.stuName : '暂无信息' }}</p>
                                  <p v-if="!item.stuInfo.stuCardNo">学号:{{ item.stuInfo.stuNo ? item.stuInfo.stuNo : '暂无信息' }}</p>
                                  <p v-else>卡号:{{ item.stuInfo.stuCardNo ? item.stuInfo.stuCardNo : '暂无信息' }}</p>
                                  <p>手机:{{ item.stuInfo.stuPhone ? item.stuInfo.stuPhone : '暂无信息' }}</p>
                                </div>
                                <div v-else>非法学员</div>
                              </template>
                              <div
                                class="img-mask"
                                style="position: absolute; border: 2px solid red"
                                :style="{
                                  width: item.width,
                                  height: item.height,
                                  left: item.left,
                                  top: item.top,
                                  borderColor: item.color
                                }"
                              ></div>
                            </a-tooltip>
                          </div>
                        </div>
                        <div class="uploading" v-else>
                          <a-icon :type="uploadLoading ? 'loading' : 'cloud-upload'" style="font-size: 120px;" />
                          <div class="ant-upload-text">上传图片</div>
                          <div class="ant-upload-text" style="color:red">可上传多张照片，每张照片人数≤10人，照片识别成功后请提交签到再上传下一张照片</div>
                        </div>
                      </a-upload>
                    </div>
                  </a-spin>
                </div>
              </div>
            </a-col>
          </a-row>
        </div>
      </perm-box>
      <download-list :file-list="signlogList" ref="downloadList" :has-list="true"></download-list>
    </div>

    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      title="备注"
      :width="600"
      :destroyOnClose="true"
      :confirmLoading="confirmLoading"
      :visible="remarkModal"
      @ok="okRemark"
      @cancel="cancelRemark"
    >
      <a-form-model-item label="备注">
        <a-input v-model="curStudent.signRemark" type="textarea" />
      </a-form-model-item>
    </a-modal>
  </div>
</template>

<script>
import PermBox from '@/components/PermBox'
import DownloadList from '@/components/DownloadList'
import { autoUpload } from '@/tools/oss'
import { recognizeFace } from '@/api/file'
import { recognizeFile, stuSignUpdateRemark } from '@/api/student'

import tools from './tools'

const { isOverTimes, isOverdue } = tools

const defaultStudentSignedOptions = [
  { label: '本班会员', value: 'correct', color: '#52c41a', length: '1' },
  { label: '异常会员', value: 'errors', color: '#fc6', length: '1' },
  { label: '非会员', value: 'unknown', color: '#f5222d', length: '1' }
]
const defaultCheckedList = ['unknown', 'errors']
export default {
  name: 'PhotoSignin',
  props: {
    signsedStuCount: {
      type: Number,
      default: 0
    },
    finallyStudentArr: {
      type: Array,
      default: () => []
    },
    finallySelectStudentArr: {
      type: Array,
      default: () => []
    },
    dancePlanId: { type: String, default: null }
  },
  components: {
    PermBox,
    DownloadList
  },
  data() {
    return {
      studentSignedOptions: [],
      defaultCheckedList,
      isOverdue,
      isOverTimes,
      uploadLoading: false, //上传图片的loading
      localImageSrc: null, //上传图片时本地图片路径
      imageMaskList: [], //签到学生的遮罩
      imageValues: {}, //图片数据
      imageInfo: {}, //图片信息
      imgstyle: {},
      signlogList: [],
      confirmLoading: false,
      // 备注
      remarkModal: false,
      curStudent: {},
    }
  },
  watch: {
    actualMembersProp: {
      handler(nv, ov) {
        this.actualMembers = nv
        this.$emit('actualMembersChange', this.actualMembers)
      },
      immediate: true
    }
  },
  computed: {},
  created() {
    console.log('photo', this.finallyStudentArr)
  },
  methods: {
    /*
     * 方法说明
     * @methods  changePhotoMask 改变不同类型的签到学生
     * @params {Array}  arr  选择的checkbox数据的Arr
     * @params {Function}  renderImgMask  生成mask的函数
     * @params {Number}  ratio  根据图片的不同生成宽高比
     * */
    changePhotoMask(arr) {
      const { renderImgMask, ratio } = this
      renderImgMask(arr, ratio)
    },
    /*
     * 方法说明
     * @methods  beforeUpload 上传图片的操作函数
     * @params {File}  file  选择上传的图片
     * @params {Function}  uploadImage  上传图片的promise函数
     * @params {Function}  setLocalSrc  获取上传图片的本地Src的promise函数
     * @params {Function}  renderImgMask  生成mask的函数
     * @params {Function}  recognizeSignIn  识别函数，判断添加逻辑
     * @params {Function}  refreshStuList  刷新stuList函数
     * */
    beforeUpload(file) {
      const { uploadImage, setLocalSrc, renderImgMask, recognizeSignIn, refreshStuList } = this
      this.uploadLoading = true
      Promise.all([uploadImage(file), setLocalSrc(file)])
        .then(resArr => {
          if (!resArr || resArr.length !== 2) return false
          const [result, info] = resArr
          const { correct, errors, unknown } = result
          const [correctOptions, errorsOptions, unknownOptions] = defaultStudentSignedOptions
          this.studentSignedOptions = []
          let coordinateArr = []
          if (result.code) return false
          this.imageValues = result
          this.imageInfo = info
          if (unknown && unknown.length > 0) {
            unknownOptions.length = unknown.length
            this.studentSignedOptions.push(unknownOptions)
            coordinateArr.push('unknown')
          }
          if (errors && errors.length > 0) {
            errorsOptions.length = errors.length
            this.studentSignedOptions.push(errorsOptions)
            coordinateArr.push('errors')
          }
          if (correct && correct.length > 0) {
            const newStuList = []
            correct.map(item => {
              this.$emit('check', item[0])
            })
            correctOptions.length = correct.length
            this.studentSignedOptions.push(correctOptions)
          }
          renderImgMask(coordinateArr)
        })
        .catch(err => {
          this.localImageSrc = null
        })
        .finally(() => (this.uploadLoading = false))
    },
    //上传图片及获取信息
    uploadImage(file) {
      const { dancePlanId } = this
      return autoUpload(file, 'check-in')
        .then(fileId => {
          return { fileId, dancePlanId }
        })
        .then(recognizeFace)
        .then(res => {
          return res.data
        })
        .catch(err => {
          return err
        })
    },
    //获取图片本地
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
        url ? resolve(url) : reject()
      })
    },
    //获取上传图片的info
    getImgInfo(url) {
      return new Promise((resolve, reject) => {
        const img_url = url
        const img = new Image()
        img.src = img_url
        img.onload = function() {
          const { width, height } = img
          const ratio = ~~width / ~~height
          const imgInfo = { width, height, ratio }
          resolve(imgInfo)
        }
      })
    },
    //set 本地上传图片
    setLocalSrc(file) {
      const { getLocalSrc, getImgInfo } = this
      return getLocalSrc(file)
        .then(url => {
          this.localImageSrc = url
          return url
        })
        .then(getImgInfo)
    },
    //清空图片的mask
    initImgMask() {
      this.imageMaskList = []
    },
    /*
     * 方法说明
     * @methods  renderImgMask 生成人脸识别的mask
     * @params {Array}  coordinateArr  传递进来的人脸数据
     * */
    renderImgMask(coordinateArr) {
      const {
        imageValues,
        imageInfo: { width, height, ratio },
        initImgMask
      } = this
      const isOverWidth = width / (height / 500) > 752
      console.log('isOverWidth', isOverWidth)
      this.imgstyle = isOverWidth ? { width: '752px' } : { height: '500px' }
      initImgMask()
      const colorType = { correct: '#52c41a', errors: '#fc6', unknown: '#f5222d' }
      if (!coordinateArr && coordinateArr.length == 0) return false
      coordinateArr.map(str => {
        // let data = str == 'error' ? imageValues[str] : imageValues['error']
        let data = imageValues[str]
        data.map(arr => {
          let stuInfo = null
          if (str !== 'unknown') {
            stuInfo = arr[0]
            arr = arr[1]
          }
          let w, h, l, t, s
          if (isOverWidth) {
            l = arr[0] * (752 / width)
            t = arr[1] * (752 / width)
            w = arr[2] * (752 / width)
            h = arr[3] * (752 / width)
          } else {
            l = arr[0] * (500 / height)
            t = arr[1] * (500 / height)
            w = arr[2] * (500 / height)
            h = arr[3] * (500 / height)
          }

          s = {
            width: w + 'px',
            height: h + 'px',
            left: l + 'px',
            top: t + 'px',
            color: `${colorType[str]}`,
            stuInfo: stuInfo
          }
          this.imageMaskList.push(s)
        })
      })
    },
    //签到照片记录
    getRecognizeFile() {
      const { dancePlanId } = this
      recognizeFile({ dancePlanId }).then(res => {
        this.signlogList = res.data
        this.$refs.downloadList.openModal()
      })
    },
    //暴露出去的check
    studentCheck(student) {
      if (student.status !== 'C') {
        this.$emit('check', student)
      }
    },
    //判断是否签到
    isSelected(stuCardId) {
      return this.finallySelectStudentArr.indexOf(stuCardId) !== -1
    },
    resetValues() {
      this.localImageSrc = null
      this.imageMaskList = []
      this.studentSignedOptions = []
    },
    openRemark(student) {
      this.curStudent = student
      this.remarkModal = true
    },
    okRemark() {
      const { dancePlanId } = this
      const { stuCardId, signRemark } = this.curStudent

      this.confirmLoading = true
      stuSignUpdateRemark({ dancePlanId, studentCardId: stuCardId, remark: signRemark })
        .then(res => {
          if (res.code === 200) {
            this.$notification['success']({
              message: '系统通知',
              description: '操作成功'
            })
            this.cancelRemark()
          }
        })
        .finally(() => (this.confirmLoading = false))
    },
    cancelRemark() {
      this.curStudent = {}
      this.remarkModal = false
    },
  }
}
</script>

<style scoped lang="less" type="text/less">
@import '~@/assets/style/index';

.photo-signin-wrapper {
  height: 100%;
  .upload-success {
    display: flex;
  }
  .red-text {
    color: #ff4000;
  }

  .photo-signin-content {
    position: relative;
    height: 100%;

    .student-list {
      width: 300px;
      height: 100%;
      float: left;

      .title {
        margin-left: 5px;
      }

      .student-items-wrapper {
        overflow-y: auto;
        height: 526px;

        .student-items {
          width: 100%;
          height: 90px;
          cursor: pointer;
          position: relative;

          .student-item {
            transition: all @animationTime linear;
            position: absolute;
            top: 5px;
            right: 5px;
            bottom: 0;
            left: 5px;
            border: 1px solid rgb(230, 230, 230);
            box-sizing: border-box;
            background: #fff;
            display: flex;
            flex-direction: column;
            padding-top: 12px;

            &.selected {
              background: #1ba97b;
              border: 1px solid rgba(0, 0, 0, 0);
            }

            &.isOverdue {
              background: #fc6;
              border: 1px solid rgba(0, 0, 0, 0);
              cursor: no-drop;

              .student-info {
                > div {
                  color: #ffffff;
                }
              }
            }

            .student-content {
              flex: 0 0 80px;
              width: 100%;
              height: 70px;
              display: flex;

              .student-avatar {
                flex: 0 0 60px;
                height: 60px;
                padding: 5px;
                box-sizing: border-box;
                .center();

                .avatar-img {
                  padding: 2px;
                  box-sizing: border-box;
                  border: 1px solid rgb(230, 230, 230);
                  border-radius: 50%;
                  width: 100%;
                  height: 100%;
                }
              }

              .student-info {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
                overflow: hidden;

                .student-name {
                  transition: all @animationTime linear;
                  margin: 0 5px;
                  margin-top: -20px;
                  color: #333;
                  font-size: 14px;
                  .ellipsis();

                  &.selected {
                    color: #fff;
                  }
                }

                .student-small-text {
                  transition: all @animationTime linear;
                  margin: 0 5px;
                  color: #999;
                  font-size: 12px;
                  .ellipsis();

                  &.selected {
                    color: #fff;
                  }
                }
              }
            }

            .stu-sign-tag {
              z-index: 100;
              position: absolute;
              right: -1px;
              top: -1px;
              width: 0px;
              height: 0px;
              border-width: 23px;
              border-style: solid;
              border-color: #f1f1f1 #f1f1f1 transparent transparent;

              .student-sign-tag-text {
                position: relative;
                z-index: 105;
                top: -20px;
                left: 2px;
                font-weight: bold;
              }
            }

            .stu-remark {
              z-index: 100;
              position: absolute;
              right: 10px;
              bottom: 10px;

              &.selected {
                color: #fff;
              }
            }
          }
        }
      }
    }

    .stu-signin {
      // margin-left: 300px;
      position: relative;

      .checkbox-group {
        position: absolute;
        width: 100%;
        left: 0;
        z-index: 14;
      }
      .signlog {
        position: absolute;
        right: 0;
        z-index: 14;
      }

      .upload-stu {
        padding-top: 26px;
      }

      .image-upload {
        width: 100%;
        height: 500px;
        background-color: #e8e8e8;
        border: 1px dashed #cccccc;

        .image-uploader {
          width: 100%;
          height: 100%;
          text-align: center;
          display: block;
          cursor: pointer;

          /deep/ .ant-upload-btn {
            width: 100%;
            height: 100%;
            padding-top: 170px;
          }

          /deep/ .ant-upload {
            width: 100%;
            height: 100%;
          }

          .upload-success {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;

            .image-parent {
              img {
              }
            }
          }

          .uploading {
            // margin-top: 170px;
          }

          .img-mask {
            position: relative;
          }

          .ant-upload-btn {
            padding-top: 144px;
            width: 100% !important;
            height: 100% !important;
            display: block;
          }
        }
      }
    }

    /deep/ .ant-spin-nested-loading > div > .ant-spin {
      background-color: #ddd;
    }
  }
}
</style>
