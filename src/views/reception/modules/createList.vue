<template>
  <div>
    <a-card :bordered="false">
      <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"></search-com-pro>
    </a-card>
    <a-card :bordered="false">
      <div class="btnClass"></div>
      <s-table ref="sTable" size="default" :columns="roleColumns" :data="loadData" :rowKey="(record, index) => index">
        <span slot="splitDeptName" slot-scope="text, record">
          <span v-for="(item, index) in record.split" :key="item.id"> {{ item.deptName }}<span v-if="index !== record.split.length - 1">,</span> </span>
        </span>
        <span slot="action" slot-scope="text, record">
          <perm-box perm="education:class-creationfee:del">
            <a href="javascript:;" @click="delect(record)">取消创编费</a>
          </perm-box>
        </span>
      </s-table>
    </a-card>
  </div>
</template>

<script>
import { STable, SearchComPro } from '@/components'
import PermBox from '@/components/PermBox'
import { removeEduClassCreationFee, pageClassCreationFee } from '@/api/reception/student'
import { salTypeListById } from '@/api/common'
import { getSchoolList } from '@/api/education/card'
const roleColumns = [
  {
    title: '上课时间',
    dataIndex: 'createDate',
    key: 'createDate',
    scopedSlots: { customRender: 'createDate' }
  },
  {
    title: '结算时间',
    dataIndex: 'date',
    key: 'date',
    scopedSlots: { customRender: 'date' }
  },
  {
    title: '卡种名称',
    dataIndex: 'cardName',
    key: 'cardName',
    scopedSlots: { customRender: 'cardName' }
  },
  {
    title: '卡号',
    dataIndex: 'stuCardNo',
    key: 'stuCardNo',
    scopedSlots: { customRender: 'stuCardNo' }
  },
  {
    title: '班级分馆',
    dataIndex: 'deptName',
    key: 'deptName',
    scopedSlots: { customRender: 'deptName' }
  },
  {
    title: '班级名称',
    dataIndex: 'className',
    key: 'className'
  },
  {
    title: '班型',
    dataIndex: 'classTypeName',
    key: 'classTypeName',
    scopedSlots: { customRender: 'classTypeName' }
  },

  {
    title: '薪酬类型',
    dataIndex: 'salTypeName',
    key: 'salTypeName',
    scopedSlots: { customRender: 'salTypeName' }
  },
  {
    title: '上课老师',
    dataIndex: 'teacherName',
    key: 'teacherName',
    customRender: (text, record) => {
      return record.teachers.map(item => item.teacherName).join(',')
    }
  },
  {
    title: '创编费',
    dataIndex: 'price',
    key: 'price',
    scopedSlots: { customRender: 'price' }
  },
  {
    title: '绩效分馆',
    dataIndex: 'splitDeptName',
    key: 'splitDeptName',
    scopedSlots: { customRender: 'splitDeptName' }
  },
  {
    title: '备注',
    dataIndex: 'classDesc',
    key: 'classDesc'
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  data() {
    return {
      roleColumns,
      queryParam: {},
      loadData: parameter => {
        return pageClassCreationFee(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      },
      searchParams: [
        {
          type: 'treeSelect',
          isShow: !this.$store.getters.school_id,
          key: 'schoolId',
          label: '选择分馆',
          placeholder: '请选择分馆',
          expandAll: true,
          selectFather: false,
          treeOps: {
            api: getSchoolList,
            label: 'deptName',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'text',
          key: 'className',
          label: '班级名称',
          placeholder: '请输入班级名称'
        },
        {
          type: 'chooseModal', // 点击弹框选择类型
          key: 'teacherId', // 根据key来筛选
          label: '导师',
          placeholder: '请选择导师'
        },
        {
          type: 'select',
          key: 'salTypeId',
          label: '薪酬类型',
          placeholder: '请选择薪酬类型',
          apiOption: {
            api: salTypeListById,
            string: 'name',
            value: 'id'
          }
        }
      ]
    }
  },

  components: {
    SearchComPro,
    STable,
    PermBox
  },

  computed: {},

  created() {},
  mounted() {},

  methods: {
    delect(record) {
      const { $confirm, $notification, _refreshTable } = this
      $confirm({
        title: '系统提示',
        content: '确认删除该条数据吗?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          removeEduClassCreationFee(record.classId).then(res => {
            $notification['success']({
              message: '系统通知',
              description: '操作成功'
            })
            _refreshTable()
          })
        }
      })
    },
    searchSubmit(data) {
      this.queryParam = data
      this._refreshTable()
    },
    _refreshTable() {
      this.$refs.sTable.refresh()
    }
  }
}
</script>
<style lang="less" scoped></style>
