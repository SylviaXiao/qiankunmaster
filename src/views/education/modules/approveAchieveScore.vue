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
        <td :colspan="9 + columns.length" align="left">
          <div class="ml10">1） 成果考核奖金=考核学员课时总数*10*成果考核系数（成果考核系数=总分/满分，满分为{{ fullMarks }}分）</div>
          <div class="ml10">
            2） 成果考核评分规则：
          </div>
          <div class="ml10 text-wrap">
            学员累计上课达到30节做一次成果考核，以学员展示的视频、对比照片作为评判依据 优秀：按照学员专属教案要求超出预期成果，学员满意度非常高（24~30分）
            良好：按照学员专属教案要求达到预期成果，学员满意度良好（18~24分不含24分） 不合格：未达到预期成果，学员满意度一般（0分）
          </div>
          <div class="ml10 text-wrap">
            注：① 报名课时数不足30节，结课即做一次成果考核（10节以下可不做成果考核）； ② 成果考核系数低于0.6，即考核分低于18分，该学员对应的成果考核奖金为0； ③
            所有学员成果考核奖金累加为该季度成果考核奖金。
          </div>
        </td>
      </tr>
      <!--<tr>
        <th rowspan="2">学员姓名</th>
        <th rowspan="2">分馆</th>
        <th rowspan="2">本阶段教学目标<br/>（体态/体能/基本功/技术/成品舞等）</th>
        <th colspan="2">考核点评（对照教案阶段教学目标）</th>
        <th rowspan="2">考核课时数</th>
        <th rowspan="2">评分/学员</th>
        <th rowspan="2">考核教研</th>
        <th rowspan="2">奖金</th>
      </tr>-->
      <tr>
        <th>学员姓名</th>
        <th>分馆</th>
        <th v-for="(item, index) in columns" :key="index">{{ item.item }}</th>
        <th>考核课时数</th>
        <th>评分/学员</th>
        <th>考核教研</th>
        <th>奖金</th>
      </tr>
      <tr class="row-hover" v-for="(record, recordIndex) in tableData" :key="recordIndex">
        <td>{{ record.studentName || '未知' }}</td>
        <td>{{ record.branchName || '无' }}</td>
        <td v-for="(item, itemIndex) in record.itemVOList" :key="itemIndex">
          <div class="text-wrap">{{ item.itemInfo || '无' }}</div>
        </td>
        <td>{{ record.courseNum || 0 }}</td>
        <td>{{ record.assessmentScore || 0 }}</td>
        <td>{{ record.assessmentName || '无' }}</td>
        <td>{{ record.assessmentPrice || 0 }}</td>
      </tr>
    </table>

    <div class="right mb20" v-if="type !== 'print'">
      <div style="transform: scale(2, 2); margin-right: 50px;">
        <a-checkbox class="mr10" :checked="reportStatus === 'Y'" @change="reportStatusChange" />
        审核
      </div>
    </div>
  </div>
</template>

<script>
import { PermBox } from '@/components'
import { getAchieveScoreInfo } from '@/api/education'
import { listCommonEduConfig } from '@/api/system'

export default {
  components: {
    PermBox
  },
  props: {
    type: String
  },
  data() {
    return {
      reportStatus: 'W', // 是否提交审核
      info: {},
      columns: [],
      tableData: [],
      fullMarks: 0
    }
  },
  created() {
    this.initTotalScore()
  },
  methods: {
    backData({ id, reportStatus }) {
      this.reportStatus = reportStatus

      getAchieveScoreInfo(id).then(res => {
        this.info = res.data || {}
        this.tableData = res.data?.eduAchieveScoreInfoVOList || []
        this.columns = this.tableData[0] ? this.tableData[0].itemVOList : []

        if (this.type === 'print') {
          this.$nextTick(() => {
            this.$emit('print')
          })
        }
      })
    },
    initTotalScore() {
      listCommonEduConfig().then(res => {
        const [{ fullMarks }] = res.data || [{}]
        this.fullMarks = fullMarks
      })
    },
    reportStatusChange(e) {
      if (e.target.checked) this.reportStatus = 'Y'
      else this.reportStatus = 'W'
    },
    reset() {
      this.reportStatus = 'W'
      this.info = {}
      this.columns = []
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

.text-wrap {
  word-wrap: break-word;
  white-space: normal;
}
</style>
