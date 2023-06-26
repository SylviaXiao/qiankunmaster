<template>
  <div class="operating-record-wrapper">
    <a-table :columns="columns" :dataSource="classRecod" :pagination="false" rowKey="logId">
    </a-table>
  </div>
</template>

<script>
import moment from 'moment'
import PermBox from '@/components/PermBox'
import DownloadList from '@/components/DownloadList/DownloadList.vue'
import { listChildClass } from '@/api/education'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'

const columns = [
  {
    title: '操作时间',
    dataIndex: 'updateDate'
  },
  {
    title: '原始等级',
    dataIndex: 'lastName'
  },
  {
    title: '当前等级',
    dataIndex: 'newName'
  },
  {
    title: '操作人 ',
    dataIndex: 'userName'
  }
]
export default {
  name: 'operatingRecord',
  props: {
    classId: {
      type: String,
      default: ''
    }
  },
  components: {
    DownloadList,
    PermBox
  },
  data() {
    return {
      columns,
      classRecod: []
    }
  },
  created() {

  },
  methods: {
    getTable() {
      listChildClass({eduClassId:this.classId}).then(res => {
        this.classRecod = res.data.pageList||[]
      })
    }
  }
}
</script>

<style scoped></style>
