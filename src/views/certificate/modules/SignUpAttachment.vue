<template>
  <a-modal :maskClosable="$store.state.modalMaskClickEnable" :width="800" title="下载附件" v-model="visible" @ok="visible = false" @cancel="visible = false">
    <div style="display:flex;justify-content:flex-end;">
      <a-space align="end">
        <a-button type="primary" icon="plus-circle" @click="handleDownload">下载</a-button>
        <a-button @click="visible = false">取消</a-button>
      </a-space>
    </div>
    <a-table
      style="margin-top: 12px;"
      ref="table"
      size="default"
      :columns="columns"
      :data-source="attachment"
      rowKey="id"
      :scroll="{ y: 1000 }"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: 'checkbox' }"
    >
      <span slot="image" slot-scope="text, record">
        <img :src="record.url" style="width: 140px;" />
      </span>
    </a-table>
    <template slot="footer">
      <div></div>
    </template>
  </a-modal>
</template>

<script>
import { STable } from '@/components'
import { UploadImg } from '@/components'
import { previewFile } from '@/api/file'
import JSZip from 'jszip'
import FileSaver from 'file-saver'
import { axios } from '@/utils/request'
const columns = [
  {
    title: '文件名',
    dataIndex: 'fileName'
  },

  {
    title: '图片缩略图',
    scopedSlots: { customRender: 'image' }
  }
]
export default {
  name: 'SignUpAttachment',
  components: {
    STable,
    UploadImg
  },
  props: {
    record: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      visible: false,
      columns,
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  computed: {
    attachment() {
      const { bookList = [], cerList = [], photoList = [] } = this.record || {}
      return [...photoList, ...bookList, ...cerList]
    }
  },
  methods: {
    openModal() {
      this.visible = true
      this.resetSelection()
      this.$nextTick(() => {
        this.previewImages()
      })
    },
    resetSelection() {
      this.selectedRowKeys = []
      this.selectedRows = []
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    previewImages() {
      this.attachment.forEach(async item => {
        let url = await this.loadImage(item.id)
        item.url = url
        this.$forceUpdate()
      })
    },
    loadImage(fileId) {
      return previewFile({ fileId }).then(res => {
        if (res.code == 200) {
          return Promise.resolve(res.data)
        }
      })
    },

    getFile(url) {
      return new Promise((resolve, reject) => {
        axios({
          method: 'get',
          url,
          responseType: 'arraybuffer'
        })
          .then(data => {
            resolve(data)
          })
          .catch(error => {
            reject(error.toString())
          })
      })
    },

    handleDownload() {
      // 待下载图片
      const pendingItems = [...this.selectedRows]
      if (pendingItems.length < 1) {
        this.$message.info('请选择先内容')
        return
      }
      const zip = new JSZip()
      const cache = {}
      const promises = []

      pendingItems.forEach(item => {
        const promise = this.getFile(item.url).then(data => {
          // 下载文件, 并存成ArrayBuffer对象
          const { fileName } = item
          zip.file(fileName, data, { binary: true }) // 逐个添加文件
          cache[fileName] = data
        })
        promises.push(promise)
      })

      Promise.all(promises).then(() => {
        zip.generateAsync({ type: 'blob' }).then(content => {
          // 生成二进制流
          const { cerName, pinYing, deptName, cerClass } = this.record
          const name = `${cerName}-${pinYing}-${deptName}-${cerClass}.zip`
          FileSaver.saveAs(content, name) // 利用file-saver保存文件
        })
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
