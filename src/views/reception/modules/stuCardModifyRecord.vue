<template>
  <div class="stu-leave-addStaff">
    <a-modal :destroyOnClose="true" :width="1120" title="学员卡相关日期修改储存日志" :footer="null" v-model="stuCardModifyRecordVisual">
      <div>
        <table>
          <tr>
            <td>修改类型</td>
            <td>修改前办卡日期</td>
            <td>修改后办卡日期</td>
            <td>修改前激活日期</td>
            <td>修改后激活日期</td>
            <td>修改前截止日期</td>
            <td>修改后截止日期</td>
            <td>备注</td>
            <td>操作人</td>
            <td>操作时间</td>
          </tr>
          <template v-if="stuCardModifyRecord.length">
            <tr v-for="(item, index) in stuCardModifyRecord" :key="index">
              <td>{{ item.updateType === 'B' ? '办卡修改' : '管理员修改' }}</td>
              <td>
                {{ item.beforeStartDate ? item.beforeStartDate.slice(0, 10) : '' }}
              </td>
              <td>
                {{ item.afterStartDate ? item.afterStartDate.slice(0, 10) : '' }}
              </td>
              <td>
                {{ item.beforeActivationDate ? item.beforeActivationDate.slice(0, 10) : '' }}
              </td>
              <td>
                {{ item.afterActivationDate ? item.afterActivationDate.slice(0, 10) : '' }}
              </td>
              <td>
                {{ item.beforeClosingDate ? item.beforeClosingDate.slice(0, 10) : '' }}
              </td>
              <td>
                {{ item.afterClosingDate ? item.afterClosingDate.slice(0, 10) : '' }}
              </td>
              <td>{{ item.remark }}</td>
              <td>{{ item.userName }}</td>
              <td>{{ item.updateDate }}</td>
            </tr>
          </template>
        </table>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { studentCardLogById } from '@/api/student'
export default {
  props: {
    cardId: {
      type: String,
      default: ''
    }
  },
  components: {},
  data() {
    return {
      //学员卡相关日期修改存储日志
      stuCardModifyRecordVisual: false,
      stuCardModifyRecord: []
    }
  },
  created() {},
  methods: {
    async open(id) {
      let res = await studentCardLogById(this.cardId)
      if (Array.isArray(res.data) && res.data.length > 0) {
        this.stuCardModifyRecord = res.data
      } else {
        this.stuCardModifyRecord = []
      }
      this.stuCardModifyRecordVisual = true
    }
  }
}
</script>

<style scoped lang="less">
td {
  border: 1px solid #ddd;
  line-height: 30px;
  width: 300px;
  text-align: center;
}
</style>
