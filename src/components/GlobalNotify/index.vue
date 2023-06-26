<template>
  <div class="mr-20">
    <a @click="openNotification">
      <a-icon type="message" /><span class="ml-8">{{ title }}</span>
    </a>
    <a-modal :visible="visible" :mask="false" :maskClosable="false" :width="400" :dialog-style="{ top: '20px', right: '-30%' }" @cancel="visible = false">
      <div style="position:relative;">
        <a-tabs default-active-key="1">
          <a-tab-pane key="1" tab="未读消息">
            <div :style="{ position: 'relative' }">
              <div class="message-box-height">
                <message-cell v-for="(item, index) in unreadList" :key="`read-${index}`" :item="item" @change="handleCheck([item])" />
              </div>
              <div
                v-if="unreadList && unreadList.length > 0"
                class="flex pt-10"
                :style="{ background: 'white', position: 'absolute', bottom: 0, left: 0, right: 0 }"
              >
                <div class="mr-8">全部已读</div>
                <a-checkbox @change="handleCheck(unreadList)" />
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2" tab="已读消息">
            <div class="message-box-height">
              <message-cell v-for="(item, index) in readList" :key="`unread-${index}`" :item="item" />
            </div>
          </a-tab-pane>
        </a-tabs>
        <div style="position:absolute;top:10px;right:10px">
          <a-select v-model="type" style="width: 120px" @change="handleChange">
            <a-select-option value="">
              全部
            </a-select-option>
            <a-select-option value="A">
              私教考核
            </a-select-option>
            <a-select-option value="B">
              退费提交
            </a-select-option>
          </a-select>
        </div>
      </div>
      <template slot="footer">
        <a-button @click="visible = false">关闭</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import socketMixin from './socketMixin'
import { getNotificationList, checkNotification } from '@/api/home'
import messageCell from './components/messageCell.vue'
export default {
  name: 'GlobalNotify',
  components: {
    messageCell
  },
  mixins: [socketMixin],
  data() {
    return {
      type:'',
      unreadList: [],
      readList: [],
      visible: false
    }
  },
  computed: {
    title() {
      let count = this.unreadList?.length
      if (count) {
        return `消息(${count})`
      }
      return '无新消息'
    }
  },
  mounted() {
    const interval = 3600 * 1000
    this.queryUnReadList()
    this.queryReadList()
    setInterval(() => {
      this.queryUnReadList()
      this.queryReadList()
    }, interval)
    // this.initWebSocket()
  },
  methods: {
    handleChange(){
      this.reloadList()
    },
    // 接收webSocket消息
    getMessage(data) {
      const { title, content, order } = data
      this.$notification.open({
        message: this.getContentJSX(content),
        duration: null,
        style: {
          width: '400px',
          marginLeft: `${-40}px`
        }
      })
      this.reloadList()
    },
    getContentJSX(originData) {
      const { date, teacherName, text, order } = originData
      const item = {
        content: text,
        createDate: date,
        teacherName,
        order,
      }
      return (
        <div>
          <messageCell item={item} />
        </div>
      )
    },
    reloadList() {
      this.queryUnReadList()
      this.queryReadList()
    },
    async queryUnReadList() {
      let res = await getNotificationList({ status: 'A',type:this.type })
      this.unreadList = res.data
    },
    async queryReadList() {
      let res = await getNotificationList({ status: 'B',type:this.type })
      this.readList = res.data
    },
    openNotification() {
      this.visible = true
      // this.$notification.open({
      //   message: this.getContentJSX,
      //   duration: null,
      //   style: {
      //     width: '400px',
      //     marginLeft: `${335 - 400}px`
      //   }
      // })
    },

    async handleCheck(dataList) {
      let ids = []
      dataList.forEach(element => {
        ids.push(element.id)
      })
      ids = ids.join(',')
      setTimeout(() => {
        checkNotification({ ids }).then(res => {
          this.reloadList()
        })
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
.message-box-height {
  position: relative;
  max-height: 450px;
  overflow: auto;
}

::-webkit-scrollbar {
  width: 2px; /* 竖向滚动条宽度 */
  // height: 4px; /* 横向滚动条高度 */
  background-color: #f5f5f5;
}
</style>
