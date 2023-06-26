<template>
  <div class="fin-achievement-wrapper">
    <f-frame :searchParamsArray="searchParams" src="/report?name=edu_teacher_private_education" perm="edu:stat:area:private" :autoLoad="false" :limit="'eduTeacherPrivateEducation'"></f-frame>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { listEduDance, listEduType, scopeListArea } from '@/api/common'

  export default {
    name: 'eduTeacherPrivateEducation',
    data() {
      // const userSchoolList = JSON.parse(Vue.ls.get('userSchoolId'))
      // let areaId = userSchoolList && userSchoolList.length > 0 && userSchoolList[0].parentId ? userSchoolList[0].parentId : '97efcfa2-61d0-4c98-9cda-1c3ae563a22d'
      return {
        searchParams: [
          {
            type: 'select',
            key: 'areaId',
            label: '地区',
            placeholder: '请选择地区',
            // initialValue: areaId,
            apiOption: {
              api: scopeListArea,
              string: 'deptName',
              value: 'id'
            }
          },
          {
            type: 'select', //动态select框
            key: 'edudanceId',
            label: '舞种',
            placeholder: '请选择舞种',
            // initialValue: 'A',
            apiOption: {
              api: listEduDance, // promise类型的接口
              string: 'name',
              value: 'id'
            }
          },
          {
            type: 'select', // 静态select框
            key: 'official',
            label: '合同类型',
            placeholder: '请选择合同类型',
            staticArr: [
              {
                string: '正式',
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
            type: 'text',
            key: 'teacherName',
            label: '导师',
            placeholder: '请选择上课导师'
          },
          {
            type: 'select', // 静态select框
            key: 'teacherCrowd',
            label: '导师人群',
            placeholder: '请选择人群',
            staticArr: [
              {
                string: '成人',
                value: '1'
              },
              {
                string: '少儿',
                value: '2'
              },
              {
                string: '通用',
                value: '3'
              }
            ]
          },
          {
            type: 'select', // 静态select框
            key: 'isExperience',
            label: '是否包含体验课',
            placeholder: '请选择',
            defaultVal: '包含',
            initialValue: 'Y',
            staticArr: [
              {
                string: '包含',
                value: 'Y'
              },
              {
                string: '不包含',
                value: 'N'
              },
            ]
          },
          {
            type: 'select', // 静态select框
            key: 'userState',
            label: '在职状态',
            placeholder: '请选择在职状态',
            staticArr: [
              {
                string: '在职',
                value: 'Y'
              },
              {
                string: '离职',
                value: 'N'
              }
            ]
          },
        ]
      }
    },
    methods: {}
  }
</script>

<style lang="less" scoped></style>
