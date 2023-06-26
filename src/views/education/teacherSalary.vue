<template>
  <div class="teacher-salary-wrapper" ref="elementAll" style="height:calc(100vh - 84px)">
    <div ref="elementSearch">
      <a-card :border="false" class="teacher-salary-seach-card">
        <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams" />
      </a-card>
    </div>
    <a-card :border="false" class="teacher-salary-table-card">
      <div class="btn-group" ref="elementBtn">
        <perm-box perm="salary:type:view">
          <a-button type="primary" @click="openSalaryModal('type')">薪酬类型管理</a-button>
        </perm-box>
        <perm-box perm="education:class-creationfee:view" style="margin-left:10px;">
          <a-button type="primary" @click="openCreatModal('type')">创编费管理</a-button>
        </perm-box>
      </div>
      <!-- `${childrenNo}px`-->
      <s-table
        ref="table"
        :showSlider="true"
        class="salary-table"
        :columns="columns"
        :data="loadData"
        :rowKey="record => `${record.teacherId}-${record.danceId}`"
        :scroll="{ x: childrenNo > 2000 ? `${childrenNo}px` : false }"
        bordered
      >
        <span slot="teacherName" slot-scope="text, record">
          {{ text }}
          <a-tag>{{ record.official === 'A' ? '全职' : record.official === 'B' ? '试用' : '兼职' }}</a-tag>
          <a-popover v-if="record.status == 'N'">
            <template slot="content">
              <div>{{ record.leaveDate }}</div>
            </template>
            <a-tag color="red">离</a-tag>
          </a-popover>
        </span>
        <span slot="action" slot-scope="text, record">
          <perm-box perm="salary:template:save-admin">
            <a href="javascript:;" @click="editTeacherSalary(record, true)">超级编辑</a>
          </perm-box>
          <perm-box perm="salary:template:save">
            <a href="javascript:;" @click="editTeacherSalary(record, false)">编辑</a>
          </perm-box>
          <a href="javascript:;" @click="modifyLog(record)">历史</a>
          <perm-box perm="salary:template:delbatch">
            <a href="javascript:;" @click="deleteTeacherSalary(record)">删除薪酬</a>
          </perm-box>
          <!-- <perm-box perm='salary:template:del'>
            <a href="javascript:;" @click="removeTeacherSalary(record)" style="margin-left: 15px;">删除</a>
          </perm-box> -->
        </span>
      </s-table>
    </a-card>
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" v-model="salaryTypeModal" title="薪酬类型管理" width="1400px" :footer="null" okText="提交">
      <salary-type ref="salarytype" @saved="savedSalaryType"></salary-type>
    </a-modal>
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      v-model="addTeacherSalaryModal"
      title="薪酬管理"
      width="1200px"
      :footer="null"
      @ok="sendTeacherSalaryMsg()"
      okText="提交"
    >
      <teacher-salary-form ref="teaSalary" :teacherSalaryList="columnModal" :teacher-value="teaValue" @saved="savedSalary"></teacher-salary-form>
    </a-modal>
    <CreatModal ref="CreatModal" />
    <TeacherSalaryModifyLog ref="modifyLog" />
    <deleteTeacherSalary ref="deleteTeacherSalary" @refresh="_refreshTable"></deleteTeacherSalary>
  </div>
</template>

<script>
import { STable, SearchComPro, ChooseTea } from '@/components'
import PermBox from '@/components/PermBox'
import deleteTeacherSalary from './modules/salary/deleteTeacherSalary'
import SalaryType from './modules/salary/SalaryType'
import TeacherSalaryForm from './modules/salary/TeacherSalaryForm'
import CreatModal from './modules/salary/CreatModal'
import TeacherSalaryModifyLog from './modules/salary/TeacherSalaryModifyLog'
import { salTypeList, salaryPage, removeSalaryList } from '@/api/education'
import { scopeDanceList, listEduType, scopeListArea } from '@/api/common'

const defaultColumns = [
  {
    title: '舞种',
    dataIndex: 'danceName',
    key: 'danceName',
    width: 100,
    fixed: 'left'
  },
  {
    title: '姓名',
    dataIndex: 'teacherName',
    key: 'teacherName',
    scopedSlots: { customRender: 'teacherName' },
    width: 150,
    fixed: 'left'
  },
  {
    title: '手机号码',
    dataIndex: 'teacherMobile',
    key: 'teacherMobile',
    width: 150,
    fixed: 'left'
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
    width: 80,
    fixed: 'right'
  }
]
export default {
  name: 'teacherSalary',
  components: {
    STable,
    PermBox,
    SalaryType,
    TeacherSalaryForm,
    SearchComPro,
    ChooseTea,
    CreatModal,
    TeacherSalaryModifyLog,
    deleteTeacherSalary
  },
  data() {
    return {
      height: 0, //滚动条高度
      defaultColumns,
      searchParams: [
        {
          type: 'select', //动态select框
          key: 'areaId',
          isShow: !!!this.$store.getters.school_id,
          label: '地区',
          placeholder: '请选择地区',
          apiOption: {
            api: scopeListArea, // promise类型的接口
            string: 'deptName',
            value: 'id'
          }
        },
        {
          type: 'select', //动态select框
          key: 'danceId',
          label: '舞种',
          placeholder: '请选择舞种',
          apiOption: {
            api: scopeDanceList, // promise类型的接口
            string: 'name',
            value: 'id'
          }
        },
        {
          type: 'text', // 点击弹框选择类型
          key: 'name', // 根据key来筛选
          label: '关键字',
          placeholder: '请输入姓名或手机号码'
        },
        {
          type: 'select', //动态select框
          key: 'eduTypeId',
          label: '类型',
          placeholder: '请选择班级类型',
          apiOption: {
            api: listEduType, // promise类型的接口
            string: 'name',
            value: 'id'
          }
        },
        {
          type: 'select',
          key: 'official',
          label: '是否全职',
          placeholder: '请选择是否全职员工',
          allowClear: true,
          staticArr: [{ string: '全职', value: 'A' }, { string: '试用', value: 'B' }, { string: '兼职', value: 'C' }]
        },
        {
          type: 'select',
          key: 'status',
          label: '在职状态',
          placeholder: '请选择在职状态',
          allowClear: true,
          staticArr: [{ string: '在职', value: 'Y' }, { string: '离职', value: 'N' }]
        }
      ],
      columns: [],
      columnModal: [],
      teaValue: {},
      queryParam: {},
      loadData: parameter => {
        const { getColumnAndData } = this
        return getColumnAndData(parameter).then(res => {
          return res
        })
      },
      salaryTypeModal: false,
      addTeacherSalaryModal: false,
      childrenNo: 0
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        if (route.name == 'teacherSalary') {
          let { name, eduTypeId } = this.$route.query
          if (name) this.queryParam.name = name
          if (eduTypeId) this.queryParam.eduTypeId = eduTypeId
          this.$forceUpdate()
          if (this.$refs.table) this.$refs.table.refresh()
        }
      },
      immediate: true,
      deep: true
    },
    addTeacherSalaryModal(nv, ov) {
      !nv ? setTimeout(() => this.$refs.teaSalary.initTeacherSalary(), 100) : ''
    }
  },
  created() {
    // this.getTeaColumn()
  },

  methods: {
    deleteTeacherSalary(record) {
      this.$refs.deleteTeacherSalary.open(record)
    },
    openCreatModal() {
      this.$refs.CreatModal.open()
    },
    openTea() {
      this.$refs.chooseTea.open()
    },
    getColumnAndData(parameter) {
      const { queryParam, resetTeaColumn } = this
      return salaryPage(Object.assign(parameter, queryParam)).then(resetTeaColumn)
    },
    resetTeaColumn(res) {
      let {
        data: {
          data,
          headers: { length },
          headers
        }
      } = res
      const {
        defaultColumns: [dance, name, mobile, action],
        rewriteColumn
      } = this
      this.childrenNo = 0
      length && length > 0 ? rewriteColumn(headers) : headers.push({ title: '无', dataIndex: '-' })
      this.columnModal = headers
      this.columns = [dance, name, mobile, ...headers, action]
      this.childrenNo += 450
      this.setSalaryWidth()
      if (!data || !data.pageList) {
        return new Promise((resolve, reject) => {
          resolve({ data: [], count: 0 })
        })
      }
      return new Promise((resolve, reject) => {
        data.count = data.totalSize
        data.data = data.pageList
        resolve(data)
      })
    },
    rewriteColumn(data, parent) {
      data.map(item => {
        item.title = !parent ? item.typeName : item.salTypeName
        item.dataIndex = !parent ? item.typeId : item.salTypeId
        // parent ? item.width = '200px' : ''
        delete item.typeName
        delete item.typeId
        const { salList } = item
        if (!!salList) {
          this.childrenNo += salList.length * 200
          item.children = salList
          delete item.salList
          this.rewriteColumn(item.children, 'parent')
        }
      })
    },
    openSalaryModal(type) {
      type == 'add' ? this.addTeacherSalary() : (this.salaryTypeModal = true)
    },
    sendTeacherSalaryMsg() {
      this.$refs.teaSalary.getAllIptVal()
    },
    addTeacherSalary() {
      this.addTeacherSalaryModal = true
      this.teaValue = {}
    },
    editTeacherSalary(data, superEdit) {
      this.addTeacherSalaryModal = true
      this.teaValue = JSON.parse(JSON.stringify(data))
      this.teaValue.isEdit = true
      this.teaValue.superEdit = superEdit
      // this.$refs.teaSalary ? this.$refs.teaSalary.dataBacking(data) : ''
    },
    removeTeacherSalary(data) {
      const { danceId, teacherId } = data
      const { $confirm, $notification, refresh } = this
      const params = { danceId: danceId, teacherId: teacherId }
      $confirm({
        title: '系统提示',
        content: '确认删除该条数据吗?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          removeSalaryList(params).then(res => {
            $notification['success']({
              message: '系统通知',
              description: '操作成功'
            })
            refresh()
          })
        },
        onCancel() {}
      })
    },
    setSalaryWidth() {
      const {
        childrenNo,
        columns: [dance, name, ...headers]
      } = this
      if (childrenNo > 2000) {
        headers.pop()
        headers.map(item => {
          if (item.children && item.children.length > 0) {
            item.children.map(child => {
              child.width = '200px'
            })
          }
        })
      }
    },
    modifyLog(record) {
      const { teacherId, teacherName } = record
      this.$refs.modifyLog.backData(teacherId, teacherName)
      this.$refs.modifyLog.open()
    },
    searchSubmit(data) {
      this.queryParam = data
      this.refresh()
    },
    savedSalaryType() {
      this.refresh()
    },
    refresh() {
      this.childrenNo = 0
      this.$refs.table.refresh()
    },
    savedSalary() {
      setTimeout(() => {
        this.$refs.table.refresh()
        this.addTeacherSalaryModal = false
      }, 400)
    },
    _refreshTable() {
      if (this.$refs.table) this.$refs.table.refresh()
    }
  }
}
</script>

<style scoped lang="less">
.teacher-salary-wrapper {
  .teacher-salary-seach-card {
    margin: 20px 0;
  }

  .teacher-salary-table-card {
    .btn-group {
      margin-bottom: 20px;
    }
  }
}
</style>
