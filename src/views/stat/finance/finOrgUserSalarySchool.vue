<template>
  <div class="fin-achievement-wrapper">
    <f-frame
      :params="params"
      :searchParamsArray="searchParams"
      :otherBtn="otherBtn"
      :src="`/report?name=fin_orguser_salary_school`"
      perm="finance:stat:salary:school"
      date="month"
    ></f-frame>
    <!-- :src="`/report?name=fin_orguser_salary_school&month=${getMonth()}&num=12`" -->
  </div>
</template>

<script>
import moment from 'moment'
import { getSchoolList } from '@/api/education/card'
import { generateUserSalary } from '@/api/reports'
const date = new Date()
const defaultStart = moment(date)
  .date(1)
  .format('YYYY-MM-DD')
const defaultEnd = moment()
  .add(1, 'months')
  .date(0)
  .format('YYYY-MM-DD')
export default {
  name: 'finOrgUserSalarySchool',
  data() {
    return {
      params: { num: '12' },
      searchParams: [
        {
          show: true,
          isShow: true,
          type: 'month',
          key: 'month',
          label: '月份',
          placeholder: '月份',
          format: 'YYYY-MM',
          defaultVal: this.getMonth()
        },
        {
          type: 'cascader',
          key: 'areaSchoolId',
          isShow: !!!this.$store.getters.school_id,
          search: true,
          label: '选择分馆',
          show: true,
          placeholder: '请选择分馆',
          treeOps: {
            api: getSchoolList,
            label: 'deptName',
            value: 'id',
            children: 'children'
          }
        },
        {
          show: true,
          type: 'text', // 文本输入框,返回值为string
          key: 'teacherName',
          label: '员工姓名',
          placeholder: '请输入员工姓名'
        }
        // {
        //   type: 'treeSelect',
        //   isShow: !!!this.$store.getters.school_id,
        //   key: 'schoolId',
        //   label: '分馆',
        //   placeholder: '请选择分馆',
        //   expandAll: true,
        //   mutiple: false,
        //   show: true,
        //   treeCheckable: false,
        //   selectFather: false,
        //   treeOps: {
        //     api: getSchoolList,
        //     label: 'deptName',
        //     value: 'id',
        //     children: 'children'
        //   }
        // }
      ],
      otherBtn: [{
        name: '手动生成',
        click: data => {
          const { month, areaSchoolId: deptId } = data
          generateUserSalary({ month, deptId }).then(res => {
            this.$notification['success']({
              message: '系统通知',
              description: res.msg
            })
          })
        }
      }]
    }
  },
  methods: {
    getMonth() {
      let date = new Date()
      var myyear = date.getFullYear()
      var mymonth = date.getMonth() + 1
      if (mymonth < 10) {
        mymonth = '0' + mymonth
      }
      return myyear + '-' + mymonth
    }
  }
}
</script>

<style lang="less" scoped></style>
