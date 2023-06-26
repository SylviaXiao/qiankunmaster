<template>
  <div>
    <a-modal title="反馈" :maskClosable="$store.state.modalMaskClickEnable" width="90%" :visible="visible" :footer="null" @cancel="close">
      <h1 class="text-align-center">{{ title }}</h1>

      <a-space :size="15">
        <a-button type="primary" icon="download" @click="handleExport">导出</a-button>
      </a-space>

      <a-table
        class="mt-10"
        ref="table"
        bordered
        :columns="columns"
        :dataSource="list"
        :loading="tableLoading"
        :rowKey="(record, index) => index"
        :scroll="{ x: 400 }"
        :pagination="false"
      >
      </a-table>
    </a-modal>
  </div>
</template>

<script>
import { STable, SearchComPro, PermBox, ChooseStu } from '@/components'
import { listAchClassStudent, listAchClassStudentSpecial, getAchClassFeedback, exportAchClassFeedback } from '@/api/education'

const columns = [
  {
    title: '学员姓名',
    align: 'center',
    dataIndex: 'studentName',
    width: 160,
    fixed: 'left'
  },
  {
    title: '联系方式',
    align: 'center',
    dataIndex: 'studentPhone',
    width: 160,
    fixed: 'left'
  },
  {
    title: '提交时间',
    align: 'center',
    dataIndex: 'createDate',
    width: 140
  },
  {
    title: '老师姓名',
    align: 'center',
    dataIndex: 'teacherName',
    width: 140
  },
  {
    title: '班级辅导员',
    align: 'center',
    dataIndex: 'instructor',
    width: 140
  },
  {
    title: '教研组负责人',
    align: 'center',
    dataIndex: 'principal',
    width: 140
  },
  {
    title: '上课分馆',
    align: 'center',
    dataIndex: 'deptName',
    width: 140
  },
  {
    title: '所学课程',
    align: 'center',
    dataIndex: 'danceName',
    width: 140
  },
  {
    title: '教练班期数',
    align: 'center',
    dataIndex: 'periods',
    width: 140
  },
  {
    title: '开班日期',
    align: 'center',
    dataIndex: 'startDate',
    width: 140
  },
  {
    title: '结业日期',
    align: 'center',
    dataIndex: 'endDate',
    width: 140
  },
  {
    title: '1.老师的教学内容是否与教案一致？（20分）',
    align: 'center',
    dataIndex: 'score1',
    width: 200
  },
  {
    title: '2.老师的教学方法是否能够让你有效吸收所有教学内容？（10分）',
    align: 'center',
    dataIndex: 'score2',
    width: 200
  },
  {
    title: '3.课后学员手册是否认真批改、回馈及时？（10分）',
    align: 'center',
    dataIndex: 'score3',
    width: 200
  },
  {
    title: '4.老师在课前、课中、课后的教学态度、沟通方式是否让你满意？（10分）',
    align: 'center',
    dataIndex: 'score4',
    width: 200
  },
  {
    title: '5.你对自己的学习成果是否满意？（20分）',
    align: 'center',
    dataIndex: 'score5',
    width: 200
  },
  {
    title:
      '6.老师在教学过程中是否存在迟到、早退、旷工、怠工（比如频繁看手机、接听电话、课上用餐、课上教学偷懒）现象？(满分10分，分值最大则代表无此现象）？（10分）',
    align: 'center',
    dataIndex: 'score6',
    width: 300
  },
  {
    title: '7.老师的服装、妆容是否符合舞种需求？（10分）',
    align: 'center',
    dataIndex: 'score7',
    width: 140
  },
  {
    title: '8.老师是否对你的“舞”业生涯做合理规划及建议？（10分）',
    align: 'center',
    dataIndex: 'score8',
    width: 140
  },
  {
    title: '9.请列出以上打分项扣分的具体原因？',
    align: 'center',
    dataIndex: 'deductMarksCause',
    width: 140
  },
  {
    title: '10.学习教练班的目的是？（可多选）',
    align: 'center',
    dataIndex: 'learningGoals',
    width: 140
  },
  {
    title: '11.您选择单色之前还考虑过哪些其他的机构？',
    align: 'center',
    dataIndex: 'otherInstitutions',
    width: 140
  },
  {
    title: '12.为什么对比之后还是选择来单色学习？',
    align: 'center',
    dataIndex: 'chooseDanseCause',
    width: 140
  },
  {
    title: '13.您有多大可能性推荐您的朋友来学习？',
    align: 'center',
    dataIndex: 'possibility',
    width: 140
  },
  {
    title: '14.您是否愿意推广单色给您的朋友，理由是什么？',
    align: 'center',
    dataIndex: 'isWilling',
    width: 140,
    customRender: (value, record) => {
      return (value ? '是' : '否') + '，' + record.reason
    }
  },
  {
    title: '15.店面服务模块，你想说的话？',
    align: 'center',
    dataIndex: 'serviceModule',
    width: 140
  },
  {
    title: '16.教学体验模块，你想说的话？',
    align: 'center',
    dataIndex: 'experienceModule',
    width: 140
  },
  {
    title: '17.你对单色有什么样的期待？',
    align: 'center',
    dataIndex: 'expectation',
    width: 140
  }
]

export default {
  name: 'performanceEdit',
  components: {
    SearchComPro,
    STable,
    PermBox,
    ChooseStu
  },
  data() {
    return {
      ecId: null,
      title: '',
      visible: false,
      tableLoading: false,
      list: [],
      columns
      // loadData: parameters => {

      //   return getAchClassFeedback(params).then(res => {
      //     const { data } = res
      //     return {
      //       data,
      //       total: data.length
      //     }
      //   })
      // }
    }
  },
  created() {},
  methods: {
    open(record) {
      this.list = []
      this.visible = true
      const { ecId, className } = record
      this.ecId = ecId
      this.title = className + ' - 表单反馈'
      setTimeout(() => {
        this.refreshTable()
      }, 200)
    },
    refreshTable() {
      const params = { classId: this.ecId }
      getAchClassFeedback(params).then(res => {
          this.list = res.data
      })
    },
    close() {
      this.visible = false
    },
    handleExport() {
      const params = { classId: this.ecId }
      exportAchClassFeedback(params).then(res => {
        const reader = new FileReader()
        reader.readAsDataURL(res)
        reader.onload = e => {
          const a = document.createElement('a')
          a.download = `${this.title}.xlsx`
          a.href = e.target.result
          document.body.appendChild(a)
          a.click()
          window.URL.revokeObjectURL(a.href)
          document.body.removeChild(a)
        }
      })
    }
  }
}
</script>

<style type="text/less" lang="less" scoped>
@import '~@/assets/style/index';

.title {
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  width: 100%;

  &:before {
    display: block;
    content: '';
    width: 4px;
    height: 22px;
    background: red;
    margin-right: 5px;
  }
}

.head {
  display: flex;
  align-items: center;
  height: 45px;
  padding: 0 5px;
  margin-left: -1px;
  border-left: 1px solid #e8e8e8;
}

.row {
  display: flex;
}

.cell {
  display: flex;
  align-items: center;
  padding: 12px 5px;
  margin: 0 0 -1px -1px;
  border-left: 1px solid #e8e8e8;
  border-bottom: 1px solid #e8e8e8;
}

.ellipsis {
  .ellipsis();
}
</style>
