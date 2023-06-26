<template>
  <div class="fin-achievement-wrapper">
    <f-frame :searchParamsArray="searchParams" src="/report?name=edu_teacher_sign" perm="edu:stat:teacher:sign" date="month"></f-frame>
  </div>
</template>

<script>
import moment from 'moment'
import { getSchoolList } from '@/api/education/card'
import { listEduType, listEduDance } from '@/api/common'
const date = new Date()
const defaultStart = moment(date)
  .date(1)
  .format('YYYY-MM-DD')
const defaultEnd = moment()
  .add(1, 'months')
  .date(0)
  .format('YYYY-MM-DD')
export default {
  name: 'eduTeacherSign',
  data() {
    return {
      searchParams: [
        {
          type: 'date',
          key: 'Date',
          label: '时间',
          show: true,
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD',
          defaultVal: [moment(defaultStart, 'YYYY-MM-DD'), moment(defaultEnd, 'YYYY-MM-DD')],
          isDate: true
        },
        {
          type: 'cascader',
          key: 'areaSchoolId',
          isShow: !!!this.$store.getters.school_id,
          search: true,
          label: '地区/分馆',
          show: true,
          placeholder: '请选择地区/分馆',
          treeOps: {
            api: getSchoolList,
            label: 'deptName',
            value: 'id',
            children: 'children'
          }
        },

        {
          type: 'select', //动态select框
          key: 'eduTypeId',
          show: true,
          label: '班型',
          placeholder: '请选择班型',
          apiOption: {
            api: listEduType, // promise类型的接口
            string: 'name',
            value: 'id'
          }
        },
        {
          show: true,
          type: 'text', // 文本输入框,返回值为string
          key: 'teacherName',
          label: '导师名称',
          placeholder: '请输入导师名称'
        },
        {
          type: 'select', // 静态select框
          key: 'officialType',
          label: '在职类型',
          show: true,
          placeholder: '请选择在职类型',
          staticArr: [
            {
              string: '全职',
              value: 'A'
            },
            {
              string: '兼职',
              value: 'C'
            },
            {
              string: '储备全职',
              value: 'D'
            }
          ]
        },
        {
          type: 'select', //动态select框
          key: 'danceId',
          show: true,
          label: '舞种',
          placeholder: '请选择舞种',
          apiOption: {
            api: listEduDance, // promise类型的接口
            string: 'name',
            value: 'id'
          }
        },
        {
          type: 'select', // 静态select框
          key: 'crowdType',
          label: '人群',
          show: true,
          placeholder: '请选择学员人群',
          staticArr: [
            {
              string: '成人',
              value: 'A'
            },
            {
              string: '少儿',
              value: 'B'
            }
          ]
        },
        {
          type: 'select', // 静态select框
          key: 'privateType',
          label: '包含私教体验课',
          show: true,
          placeholder: '是否包含私教体验课',
          staticArr: [
            {
              string: '是',
              value: 'N'
            },
            {
              string: '否',
              value: 'Y'
            }
          ],
          initialValue: 'N'
        }
      ]
    }
  },
  methods: {}
}
</script>

<style lang="less" scoped></style>
