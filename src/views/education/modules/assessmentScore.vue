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
      <td :colspan="4 + columns.length" align="left">
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
      <!--<tr>
        <th rowspan="2">学员姓名</th>
        <th rowspan="2">分馆</th>
        <th rowspan="2">本阶段教学目标<br/>（体态/体能/基本功/技术/成品舞等）</th>
        <th colspan="2">考核点评（对照教案阶段教学目标）</th>
        <th rowspan="2">考核课时数</th>
        <th rowspan="2">评分/学员</th>
      </tr>-->
      <tr>
        <th>学员姓名</th>
        <th>分馆</th>
        <th v-for="(item, index) in columns" :key="index">
          <span style="color:red;font-size: 16px;padding-right: 2px;" v-if="item.isRequired==='Y'">*</span>
          {{ item.item }}</th>
        <th>考核课时数</th>
        <th>评分/学员</th>
      </tr>
      <template v-if="checked">
        <tr class="row-hover" v-for="(record, recordIndex) in tableData" :key="recordIndex">
          <td>{{ record.studentName || '未知' }}</td>
          <td>{{ record.branchName || '无' }}</td>
          <td v-for="(item, itemIndex) in record.itemVOList" :key="itemIndex">
            <a-input size="small" v-model="item.itemInfo" />
          </td>
          <td>{{ record.courseNum || 0 }}</td>
          <td>
            <a-input-number size="small" v-model="record.assessmentScore" />
          </td>
        </tr>
      </template>
      <template v-else>
        <tr class="row-hover" v-for="(record, recordIndex) in tableData" :key="recordIndex">
          <td>{{ record.studentName || '未知' }}</td>
          <td>{{ record.branchName || '无' }}</td>
          <td v-for="(item, itemIndex) in record.itemVOList" :key="itemIndex">
            {{ item.itemInfo || '无' }}
          </td>
          <td>{{ record.courseNum || 0 }}</td>
          <td>
            {{ record.assessmentScore || '无' }}
          </td>
        </tr>
      </template>
    </table>
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
    checked: {
      type: Boolean,
      default: true
    },
    type: String
  },
  data() {
    return {
      eduAchieveScoreId: null,
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
    backData({ id }) {
      this.eduAchieveScoreId = id
      getAchieveScoreInfo(id).then(res => {
        this.info = res.data || {}
        this.tableData = res.data?.eduAchieveScoreInfoVOList || []
        this.columns = this.tableData[0] ? this.tableData[0].itemVOList : []
      })
    },
    initTotalScore() {
      listCommonEduConfig().then(res => {
        const [{ fullMarks }] = res.data || [{}]
        this.fullMarks = fullMarks
      })
    },
    reset() {
      this.info = {}
      this.columns = []
      this.tableData = []
    },

    validateFields() {
      return new Promise((resolve, reject) => {
        if (!this.eduAchieveScoreId) {
          return this.$notification['error']({
            message: '系统通知',
            description: '报表id不能为空'
          })
        }

        let formData = []
        for (let i = 0; i < this.tableData.length; i++) {
          let { eduAchieveScoreId, eduAchieveScoreInfoId, assessmentScore, itemVOList } = this.tableData[i]
          let eduAchieveItem = []
          for (let j = 0; j < itemVOList.length; j++) {
            if (itemVOList[j].isRequired==='Y'&&!itemVOList[j].itemInfo) {
              return this.$notification['error']({
                message: '系统通知',
                description: '请输入评分项'
              })
            }
            eduAchieveItem.push({ achieveItemId: itemVOList[j].itemId, item: itemVOList[j].itemInfo, reportScoreId: itemVOList[j].reportScoreId })
          }
          if (!assessmentScore && assessmentScore !== 0) {
            return this.$notification['error']({
              message: '系统通知',
              description: '请输入评分'
            })
          }
          if (assessmentScore > this.fullMarks) {
            return this.$notification['error']({
              message: '系统通知',
              description: `评分分数不能大于满分[${this.fullMarks}分]`
            })
          }

          formData.push({ eduAchieveScoreId, id: eduAchieveScoreInfoId, assessmentScore, eduAchieveItem })
        }

        resolve(formData)
      })
    }
  }
}
</script>

<style lang="less" scoped type="text/less">
@import '~@/assets/style/index';
.approveReport {
  overflow-x: auto;
}
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

  .ant-form-item {
    margin-bottom: 0 !important;
  }
}

.text-wrap {
  word-wrap: break-word;
  white-space: normal;
}
</style>
