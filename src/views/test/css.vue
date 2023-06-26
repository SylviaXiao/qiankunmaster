<template>
  <div class="collapse-wrapper">
    11
  </div>
</template>

<script>
import TodayCourseTable from '@/components/TodayCourseTable'
import GeneralChoiceIpt from '@/components/GeneralChoiceIpt'
import GeneralChoiceModal from '@/components/GeneralChoiceModal'
import { pageReplenishesPlan } from '@/api/education'
import { getSchoolList } from '@/api/education/card'
import { listEduDance, treeEduClassType } from '@/api/common'
import DrawbackForm from '@/views/education/modules/ThreeInOneForDrawback'

const addStudentColumns = [
  {
    title: '学员名称',
    dataIndex: 'stuName',
    key: 'stuName'
  },
  {
    title: '卡号',
    dataIndex: 'stuCardNo',
    key: 'stuCardNo'
  },
  {
    title: '卡种名称',
    dataIndex: 'cardName',
    key: 'cardName'
  },
  {
    title: '联系电话',
    dataIndex: 'stuPhone',
    key: 'stuPhone'
  }
]
const baesUrl = process.env.VUE_APP_URL

const WORK = [
  { label: '周一', isSelect: false, bgColor: '#fff' },
  { label: '周二', isSelect: false, bgColor: '#fff' },
  { label: '周三', isSelect: false, bgColor: '#fff' },
  { label: '周四', isSelect: false, bgColor: '#fff' },
  { label: '周五', isSelect: false, bgColor: '#fff' }
]
const WEEKEND = [{ label: '周六', isSelect: false, bgColor: '#fff' }, { label: '周日', isSelect: false, bgColor: '#fff' }]
const ALL_WEEK = WORK.concat(WEEKEND)
export default {
  name: 'css',
  props: {
    weekType: {
      type: String,
      default: 'work'
    }
  },
  components: {
    'todaycourse-table': TodayCourseTable,
    GeneralChoiceIpt,
    GeneralChoiceModal,
    DrawbackForm
  },
  data() {
    return {
      baesUrl,
      WORK,
      WEEKEND,
      ALL_WEEK,
      showArr: [],
      collapse: {
        type: 'all'
      },
      studentName: '',
      addStudentColumns,
      searchParams: [
        {
          type: 'treeSelect',
          key: 'school_id',
          label: '选择分馆',
          placeholder: '请选择分馆',
          expandAll: true,
          selectFather: true,
          treeOps: {
            api: getSchoolList,
            label: 'deptName',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'select',
          key: 'danceId',
          label: '舞种',
          placeholder: '请选择舞种',
          apiOption: {
            api: listEduDance,
            string: 'name',
            value: 'id'
          }
        }
      ]
    }
  },
  computed: {
    methods() {
      return pageReplenishesPlan
    }
  },
  mounted() {
    // const colItems = document.getElementsByClassName('collapse-item')
    // for (let i = 0; i < colItems.length; i++) {
    //   const item = colItems[i]
    //   item.addEventListener('click', (event) => {
    //     const className = event.target.className
    //     console.log(className)
    //   }, false)
    // }
    // this.init()
  },
  created() {},
  methods: {
    handleOk(params) {
      console.log('ok =>', params)
      const { stuName } = params
      this.studentName = stuName
    },
    openModal() {
      console.log('点击search')
      this.$refs.modal.openModal()
    },
    resetValue(value) {
      console.log('点击close =>', value)
    },
    init() {
      const {
        weekType,
        collapse: { type }
      } = this
      let showArr = []
      switch (type) {
        case 'all':
          showArr = ALL_WEEK
          break
        case 'work':
          showArr = WORK
          break
        case 'weekend':
          showArr = WEEKEND
          break
      }
      this.showArr = showArr
      let showStr = 1
      if (new Date().getDay() == 0) {
        showStr = 7
      } else {
        showStr = new Date().getDay()
      }

      this.select(showArr[showStr - 1])
    },
    initArr() {
      const { showArr } = this
      return new Promise((resolve, reject) => {
        showArr.map(item => {
          item.isSelect = false
        })
        resolve()
      })
    },
    select(item) {
      if (item.isSelect) return
      const { initArr } = this
      initArr().then(() => {
        item.isSelect = true
      })
    },
    changeType(type) {
      this.collapse.type = type
      this.init()
    }
  }
}
</script>

<style lang="less">
.collapse-wrapper {
  width: 100%;
  height: calc(100vh - 180px);
  /*border: 1px solid #000c17;*/
  display: flex;
  flex-flow: row nowrap;

  .collapse-item {
    width: 100px;
    /*border-right: 1px solid #000c17;*/
    transition: all ease 0.35s;
    box-shadow: inset -5px 0px 4px rgba(0, 0, 0, 0.3);
    overflow-y: auto;

    &:last-child {
      border: 0;
      box-shadow: none;
    }
  }

  .collapse-select {
    width: 100%;
    /*background-color: #000c17;*/
    color: #1ba97b;
    height: 100%;
    // box-shadow: -2px 0px 4px rgba(0, 0, 0, 0.7);
  }
}
</style>
