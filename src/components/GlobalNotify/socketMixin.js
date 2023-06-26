const baesUrl = process.env.VUE_APP_URL
export default {
  data() {
    return {
      webSocketInited: false,
      ws: null,
      hbInterval: null,
    }
  },
  computed: {
    token() {
      return this.$store.state.user.token || ''
    }
  },
  methods: {
    initWebSocket() {
      if (this.webSocketInited) return

      this.webSocketInited = true
      let socketUrl = baesUrl
      let protocol = window.location.protocol
      if (socketUrl.indexOf(protocol) === -1) {
        socketUrl = protocol + '//' + window.location.host + baesUrl
      }
      if (protocol === 'https:') {
        socketUrl = socketUrl.replace(protocol, 'wss:')
      } else {
        socketUrl = socketUrl.replace(protocol, 'ws:')
      }
      this.ws = new WebSocket(`${socketUrl}/common/ws/asset?X-Token=${this.token}`)
      // 接收数据
      this.ws.onmessage = this.websocketOnMessage
      // 发送数据
      this.ws.onopen = this.websocketOnOpen
      // 重连
      this.ws.onerror = this.websocketOnError
      // 关闭
      this.ws.onclose = this.websocketonClose
    },
    // 数据接收
    websocketOnMessage(e) {

      let data = JSON.parse(e.data)
      console.log('WebSocket接收数据成功', data)
      if (data) {
        if (!data.heartbeat) {
          this.getMessage(data)
        }
      }
    },
    websocketOnOpen(e) {
      console.log('连接成功', new Date().toLocaleString())
      this.sendHeartBeat()
      // 连接建立之后执行send方法发送数据
      // const obj = {
      //   head: { token: this.token }
      // }
      // this.websocketSend(JSON.stringify(obj))
      // 这里是第一次建立连接所发送的信息，应由前后端商量后决定
      // this.reset().start()
    },
    websocketOnError(data) {
      // 连接建立失败重连
      // console.log('连接失败', data)
    },
    websocketSend(data) {
      if (this.webSocketInited) {
        // 数据发送
        this.ws.send(data)
        console.log('WebSocket发送数据成功 data', data)
      }
    },
    websocketonClose(e) {
      this.webSocketInited = false
      // 关闭
      clearInterval(this.hbInterval)
      setTimeout(() => {
        // console.log('尝试重新连接')
        this.initWebSocket()
      }, 60000)
      // console.log('断开连接', e)
    },
    // 心跳开始
    sendHeartBeat() {
      const token = this.token
      clearInterval(this.hbInterval)
      this.hbInterval = setInterval(() => {
        if (this.webSocketInited) {
          const data = {
            head: { token }
          }
          this.ws.send(JSON.stringify(data))
        }
      }, 120000)
    }
  }
}
