<template>
  <div class="grading-wrapper">
    <a-card :bordered="false" :style="{ margin: '20px 0' }">
      <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"></search-com-pro>
    </a-card>
    <a-card :bordered="false">
      <div class="btn-wrapper">
        <perm-box perm="cer:site:save">
          <a-button type="primary" icon="plus-circle" @click.native="handleAddStu">新增</a-button>
        </perm-box>
      </div>
      <div class="table-wrapper">
        <perm-box perm="cer:site:view">
          <s-table ref="table" size="default" :columns="infoColumns" :data="loadData" rowKey="gradingId">
            <span slot="cerBirthday" slot-scope="text">
              {{ _handleData(text) }}
            </span>
            <span slot="action" slot-scope="text, record">
              <perm-box perm="cer:site:save">
                <a href="#" @click="handleEditStu(record)">修改</a>
              </perm-box>
              <a href="#" @click="handleInfo(record)">详情</a>
              <a href="#" style="padding:0 5px;" @click="handleLink(record)">生成链接</a>
              <perm-box perm="cer:site:del">
                <a href="#" @click="handleRemove(record)">删除</a>
              </perm-box>
            </span>
          </s-table>
        </perm-box>
      </div>
    </a-card>
    <CertAddEdit :title="addEditTitle" :record="recordStu" ref="CertAddEdit" @refresh="_refreshTable"></CertAddEdit>
    <CertLink :record="recordStu" ref="CertLink" @refresh="_refreshTable"></CertLink>
  </div>
</template>
<script>
import { STable, SearchComPro } from '@/components'
import PermBox from '@/components/PermBox'
import CertAddEdit from './modules/CertAddEdit'
import CertLink from './modules/CertLink'
import { infoColumns } from './certificate.js'
import { listCerOrganizer, removeCertSiteById, pageGrading, saveGrading, listSiteById, commonCerDanceList } from '@/api/certificate/certificate'
export default {
  components: {
    SearchComPro,
    PermBox,
    STable,
    CertAddEdit,
    CertLink
  },
  data() {
    return {
      //搜索相关
      searchParams: [
        {
          type: 'date',
          key: 'Date',
          label: '考级时间',
          placeholder: '请选择考级时间',
          format: 'YYYY-MM-DD',
          isDate: true
        },
        {
          type: 'select', //动态select框
          key: 'danceId',
          label: '舞种',
          placeholder: '请选择舞种',
          apiOption: {
            api: commonCerDanceList, // promise类型的接口
            string: 'name',
            value: 'id'
          }
        },
        {
          type: 'select', //动态select框
          key: 'deptId',
          label: '地区',
          placeholder: '请选择地区',
          apiOption: {
            api: listCerOrganizer, // promise类型的接口
            string: 'areaName',
            value: 'id'
          }
        },
        {
          type: 'text',
          key: 'gradeName',
          label: '考级名称',
          placeholder: '请输入考级名称'
        },
        {
          type: 'select', //动态select框
          key: 'organizerdId',
          label: '承办单位',
          placeholder: '请选择承办单位',
          apiOption: {
            api: listSiteById, // promise类型的接口
            string: 'organizerName',
            value: 'id'
          }
        }
      ],
      //table相关
      infoColumns,
      queryParam: {},
      loadData: parameter => {
        return pageGrading(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      },
      // CertAddEdit参数
      addEditTitle: '',
      recordStu: null
    }
  },
  methods: {
    handleInfo(record) {
      this.$router.push({ path: `/certificate/gradingInfo/${record.id}` })
    },
    handleLink(record) {
      this.recordStu = record
      this.$refs.CertLink.openModal()
    },
    handleAddEditOk() {
      console.log(1221)
    },
    handleAddEditCancel() {
      this.visibleAddEdit = false
    },
    handleAddStu() {
      this.addEditTitle = '新增'
      this.recordStu = {}
      this.$refs.CertAddEdit.openModal()
    },
    handleEditStu(record) {
      this.addEditTitle = '修改'
      this.recordStu = record
      // 打开modal,清空数据,init考点下拉框
      this.$refs.CertAddEdit.openModal()
      this.$refs.CertAddEdit.backindData(record)
    },
    handleRemove(record) {
      let _this = this
      let params = {
        siteId: record.id
      }
      this.$confirm({
        title: '系统提示',
        content: '确认要删除吗?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          _this._removeApi(params)
        }
      })
    },
    searchSubmit(data) {
      this.queryParam = data
      this._refreshTable()
    },
    _removeApi(params) {
      removeCertSiteById(params)
        .then(res => {
          if (res.code === 200) {
            this._refreshTable()
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    _handleData(date) {
      return date ? this.$tools.tailor.getStrDate(date) : ''
    },
    _refreshTable() {
      this.$refs.table.refresh()
    }
  }
}
</script>

<style scoped lang="less">
.grading-wrapper {
  .btn-wrapper {
    margin: 20px 0;
  }
}
</style>
