<template>
  <div class="approveReport">
    <a-row class="mb20">
      <a-col :span="8">
        <h3>导师姓名：{{ info.asTeacherName || '无' }}</h3>
      </a-col>
      <a-col :span="8">
        <h3>舞种：{{ info.danceName || '无' }}</h3>
      </a-col>
      <a-col :span="8">
        <h3>教研负责人：{{ info.educationUserName || '无' }}</h3>
      </a-col>
    </a-row>

    <table ref="table" class="approveReportTable mb40">
      <tr>
        <th>考评项</th>
        <th colspan="8">评估标准</th>
        <th>奖金</th>
        <th v-if="type === 'print'">备注</th>
      </tr>
      <tr>
        <td :rowspan="tableData.length + 4">课程消耗</td>
        <td align="left" colspan="8">
          <div class="ml10">课耗奖金为该季度不同学员课程消耗奖金的累加，不同消耗标准对应的奖金如下：</div>
          <div v-for="(item, index) in config" :key="index" class="ml10">
            {{ index | indexToEn }}. {{ item.startSections }}≤平均每周上课节数<{{ item.endSections }}节，课耗奖金=本季度消耗课时数*{{ item.bonusPrice }}
          </div>
          <div class="ml10" style="word-wrap: break-word; white-space: normal;">
            注：① 平均每周上课节数＜{{ minStartSections }}节，课耗奖金为0； ②本季度上课周数：
            报名后开卡开始计时，本季度初以前开卡且在本季度未结卡，周数为季度总天数/7（如在本季度内开卡，则以开卡当天开始算起的天数；如学员在该季度停卡，则为季度第一天至结业当天天数）；
            ③ 所有学员对应的课耗奖金累加为该季度的课耗奖金。
          </div>
        </td>
        <td :rowspan="tableData.length + 4">{{ consumeBonusSum }}</td>
        <td :rowspan="tableData.length + 4" align="left" v-if="type === 'print'">店面签字：</td>
      </tr>
      <tr>
        <td>学员姓名</td>
        <td>分馆</td>
        <td>剩余课时</td>
        <td>本季度消耗课时数</td>
        <td>本季度上课周数</td>
        <td>本季度上课节数/周</td>
        <td>对应奖金/课时</td>
        <td>奖金</td>
      </tr>
      <tr class="row-hover" v-for="(record, index) in tableData" :key="index">
        <td>{{ record.studentName || '未知' }}</td>
        <td>{{ record.branchName || '无' }}</td>
        <td>{{ record.remainCount || 0 }}</td>
        <td>{{ record.consumeCount || 0 }}</td>
        <td>{{ record.weekCount || 0 }}</td>
        <td>{{ record.proportion || 0 }}</td>
        <td>{{ record.bonusPrice || 0 }}</td>
        <td>{{ record.consumeBonus || 0 }}</td>
      </tr>
      <tr>
        <td colspan="3">季度总课耗</td>
        <td>{{ consumeCountSum }}</td>
        <td colspan="4" class="gray"></td>
      </tr>
      <tr>
        <td colspan="7">课程消耗奖金总计</td>
        <td>{{ consumeBonusSum }}</td>
      </tr>
    </table>

    <div class="right mb20" v-if="type !== 'print' && checked">
      <div style="transform: scale(2, 2); margin-right: 50px;">
        <a-checkbox class="mr10" :checked="reportStatus === 'Y'" @change="reportStatusChange" />
        审核
      </div>
    </div>
  </div>
</template>

<script>
import { PermBox } from '@/components'
import { getReportInfo } from '@/api/education'

export default {
  components: {
    PermBox
  },
  props: {
    checked: {
      type: Boolean,
      default: true
    },
    type: String
  },
  data() {
    return {
      reportStatus: 'W', // 是否提交审核
      info: {},
      config: [],
      tableData: []
    }
  },
  computed: {
    minStartSections() {
      return Math.min(...this.config.map(item => item.startSections))
    },
    consumeCountSum() {
      return this.tableData.map(item => item.consumeCount).reduce((a, b) => a + b, 0).toFixed(2)
    },
    consumeBonusSum() {
      return this.tableData.map(item => item.consumeBonus).reduce((a, b) => a + b, 0)
    }
  },
  filters: {
    indexToEn(val) {
      const abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
      let remainder = val % 26
      let value = abc[remainder]
      let count = parseInt(val / 26 + 2)
      return new Array(count).join(value)
    }
  },
  created() {},
  methods: {
    backData({ id, reportStatus }) {
      this.reportStatus = reportStatus

      getReportInfo(id).then(res => {
        this.info = res.data || {}
        this.config = res.data?.eduBonusItemList || []
        this.config.sort((a, b) => (a.startSections <= b.startSections ? -1 : 1))
        this.tableData = res.data?.eduReportInfoList || []

        if (this.type === 'print') {
          this.$nextTick(() => {
            this.$emit('print')
          })
        }
      })
    },
    reportStatusChange(e) {
      if (e.target.checked) this.reportStatus = 'Y'
      else this.reportStatus = 'W'
    },
    reset() {
      this.reportStatus = 'W'
      this.info = {}
      this.config = []
      this.tableData = []
    }
  }
}
</script>

<style lang="less" scoped type="text/less">
@import '~@/assets/style/index';

.approveReportTable {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  background: #fff;
  border: 1px solid #999;

  tr {
    text-align: center;

    &.row-hover {
      transition: background 0.3s;

      &:hover {
        background: #c4f7dd;
      }
    }
  }

  th,
  td {
    color: rgba(0, 0, 0, 0.85);
    font-weight: 400;
    padding: 12px 5px !important;
    white-space: nowrap;
    border: 1px solid #999;

    &.gray {
      background: #d9d9d9;
    }
  }

  th {
    color: #fff;
    background: #379c68;
  }
}
</style>
