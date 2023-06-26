<template>
  <div>
    <div class="mb20">
      <a-space :size="10">
        <a-select v-model="queryParams.school_id" placeholder="请选择分馆" :dropdownMatchSelectWidth="false" style="width: 150px;">
          <a-select-option allowClear v-for="school in deptList" :key="school.id" :value="school.id">
            {{ school.deptName }}
          </a-select-option>
        </a-select>
        <a-date-picker
          v-model="todayStr"
          placeholder="选择日期"
          format="YYYY-MM-DD"
          valueFormat="YYYY-MM-DD"
          :allowClear="false"
          style="width: 150px;"
        />
        <a-input v-model="queryParams.className" placeholder="请输入班级名称" allowClear style="width: 150px;"/>
        <a-cascader
          v-model="queryParams.classTypeId"
          :options="classTypeList"
          :showSearch="{ dataFilter }"
          notFoundContent="暂无数据"
          placeholder="请选择班型"
          :fieldNames="{ label: 'name', value: 'id', children: 'children' }"
          changeOnSelect
          style="width: 150px;"
        />
        <a-select v-model="queryParams.danceId" placeholder="请选择舞种" allowClear style="width: 150px;">
          <a-select-option v-for="i in danceList" :key="i.id" :value="i.id">{{ i.name }}</a-select-option>
        </a-select>
        <a-button type="primary" @click="search">查询</a-button>
        <a-button @click="reset">重置</a-button>
      </a-space>
    </div>
    <s-table
      ref="table"
      :rowSelection="rowSelection"
      :columns="columns"
      :data="loadData"
      :rowKey="(record, index) => index"
    >
      <span slot="startDate" slot-scope="text, record">
        {{ $tools.tailor.getDate(record.startDate) }}
      </span>
      <span slot="duration" slot-scope="text, record">
        <a-tooltip>
          <template slot="title">
            <div  style="font-size:12px;">学员签到计次:{{ record.signCount || '' }}</div>
            <div  style="font-size:12px;">老师签到计次:{{record.teaSignCount || ''}} </div>
            </template>
          <a-icon type="question-circle" />
        </a-tooltip>
        {{ `${$tools.tailor.getTime(record.startDate)} ~ ${$tools.tailor.getTime(record.endDate)}` }}
        <a-tag v-if="(record.signTeachers && record.signTeachers.length > 0)|| record.substituteTeacher">签</a-tag>
      </span>
    </s-table>
  </div>
</template>

<script>
  import Vue from 'vue'
  import moment from 'moment'
  import STable from '@/components/Table'
  import { pageDayPlan } from '@/api/recep'
  import { treeEduClassType, listEduDance } from '@/api/common'
  import { getALLDeptSchools } from '@/api/organize'

  const columns = [
    {
      title: '上课日期',
      key: 'startDate',
      dataIndex: 'startDate',
      scopedSlots: { customRender: 'startDate' }
    },
    {
      title: '上课时段',
      key: 'duration',
      dataIndex: 'duration',
      scopedSlots: { customRender: 'duration' }
    },
    {
      title: '班级名称',
      key: 'className',
      dataIndex: 'className',
      scopedSlots: { customRender: 'className' }
    },
    {
      title: '班级类型',
      key: 'classTypeName',
      dataIndex: 'classTypeName',
      scopedSlots: { customRender: 'classTypeName' }
    },
    {
      title: '上课教室',
      key: 'roomName',
      dataIndex: 'roomName',
      scopedSlots: { customRender: 'roomName' }
    },
    {
      title: '上课老师',
      key: 'teachers',
      dataIndex: 'teachers',
      scopedSlots: { customRender: 'teachers' },
      customRender: (text, record) => {
        return text?.map(item => item.teacherName)?.join(' ， ')
      }
    },
    {
      title: '班主任',
      key: 'masterName',
      dataIndex: 'masterName',
      scopedSlots: { customRender: 'masterName' }
    },
  ]

  export default {
    name: 'ChooseCourse',
    components: {
      STable
    },
    data() {
      return {
        schoolId: Vue.ls.get('userDefaultId') || undefined,
        todayStr: moment().format('YYYY-MM-DD'),
        queryParams: {
          school_id: ''
        },
        deptList: [],
        classTypeList: [],
        danceList: [],
        selectedRows: [],
        selectedRowKeys: [],
        columns,
        loadData: parameter => {
          let queryParams = JSON.parse(JSON.stringify(this.queryParams))
          if (Array.isArray(queryParams.classTypeId) && queryParams.classTypeId.length > 0) {
            queryParams.classTypeId = queryParams.classTypeId[queryParams.classTypeId.length - 1]
          }
          return pageDayPlan(this.todayStr, Object.assign(parameter, queryParams)).then(res => {
            return res
          })
        },
      }
    },
    computed: {
      rowSelection() {
        return {
          type: 'radio',
          selectedRowKeys: this.selectedRowKeys,
          onChange: (selectedRowKeys, selectedRows) => {
            this.selectedRowKeys = selectedRowKeys
            this.selectedRows = selectedRows
          }
        }
      }
    },
    created() {
      this.initData()
    },
    methods: {
      async initData() {
        this.queryParams = {
          school_id: this.schoolId
        }

        let res = await treeEduClassType()
        this.classTypeList = res.data || []

        let res2 = await listEduDance()
        this.danceList = res2.data || []

        let res3 = await getALLDeptSchools()
        this.deptList = res3.data || []
      },
      dataFilter(inputValue, path) {
        return path.some(option => option.value.indexOf(inputValue) > -1)
      },
      search() {
        this.$refs.table && this.$refs.table.refresh()
      },
      reset() {
        this.queryParams = {
          school_id: this.schoolId
        }
        this.search()
      },
    }
  }
</script>

<style scoped lang="less" type="text/less">
  @import '~@/assets/style/index';
</style>
