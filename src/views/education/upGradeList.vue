<template>
  <div>
    <a-card :bordered="false" :style="{ margin: '20px 0' }">
      <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"></search-com-pro>
    </a-card>
    <a-card :bordered="false">
      <s-table ref="table" :columns="columns" :data="loadData" >
      </s-table>
    </a-card>
  </div>
</template>

<script>
import { STable, SearchComPro } from '@/components'
import {  pageChildClass } from '@/api/education'
import {  listEduDance } from '@/api/common'
import { getSchoolList } from '@/api/education/card'

const columns = [
  {
    title: '所属分馆',
    dataIndex: 'deptName',
    key: 'deptName',
  },
  {
    title: '班级名称',
    dataIndex: 'className'
  },
  {
    title: '舞种',
    dataIndex: 'eduDanceName'
  },
  {
    title: '原始绩点',
    dataIndex: 'lastName',
  },
  {
    title: '当前绩点',
    dataIndex: 'newName'
  },
  {
    title: '上课导师',
    dataIndex: 'teacherName',
    key: 'teacherName',
  },
  {
    title: '升班操作时间',
    dataIndex: 'updateDate'
  },
  {
    title: '升班操作人',
    dataIndex: 'userName'
  },
]
export default {
  name: 'class',
  components: {
    STable,
    SearchComPro
  },

  data() {
    return {
      columns,
      queryParam: {},
      loadData: parameter => {
        return pageChildClass(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      },
      searchParams: [
        {
          type: 'text',
          key: 'eduClassName',
          label: '班级名称',
          placeholder: '请输入班级名称',
          autoComplete: true
        },
        {
          type: 'treeSelect',
          isShow: !this.$store.getters.school_id,
          key: 'deptIds',
          label: '选择分馆',
          placeholder: '请选择分馆',
          expandAll: true,
          mutiple: true,
          selectFather: true,
          treeCheckable: true,
          treeOps: {
            api: getSchoolList,
            label: 'deptName',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'date',
          key: 'Date',
          label: '升班操作时间',
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD'
        },
        {
          type: 'select',
          key: 'danceIds',
          label: '舞种',
          placeholder: '请选择舞种',
          apiOption: {
            api: listEduDance,
            string: 'name',
            value: 'id'
          }
        },
      ],
    }
  },
  beforeCreate() {
  },
  created() {
  },
  methods: {
    searchSubmit(data) {
      this.queryParam = data
      if (this.queryParam.eduClassName) this.queryParam.eduClassName = encodeURI(this.queryParam.eduClassName)
      this._refreshTable()
    },
    _refreshTable() {
      this.$refs.table?.refresh()
    }
  }
}
</script>

<style scoped lang="less">
.classList {
  header {
    margin-bottom: 20px;

    .title {
      font-size: 18px;
      font-weight: 700;
    }
  }
}
</style>
