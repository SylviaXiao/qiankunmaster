<template>
  <div class="intention-adviser-wrapper">
    <a-card :bordered="false" :style="{ margin: '20px 0' }">
      <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"></search-com-pro>
    </a-card>
    <a-card :bordered="false">
      <div class="btn-wrapper">
        <a-button @click="handleRecover">批量恢复</a-button>
      </div>

      <div class="table-wrapper">
        <s-table ref="table" :rowSelection="rowSelection" :columns="columns" :data="loadData" rowKey="id" :scroll="{ x: 1100 }">
          <span slot="userName" slot-scope="text, record">
            <!-- <router-link :to="{ path: `/intentionStu/resourceInfo/adviser/${record.userDeptId}` }">{{ text || '未知' }}</router-link> -->
            {{ text || '未知' }}
            <span v-if="record.studentId"><a-tag>正</a-tag></span>
          </span>
          <span slot="auditionType" slot-scope="text, record">
            <perm-box
              :text="record.auditionType === 'W' ? '未预约' : record.auditionType === 'N' ? '已预约' : record.auditionType === 'Y' ? '已体验' : ''"
              perm="student:audition:view"
            >
              <a href="#" @click="handleAudition(record)">{{
                record.auditionType === 'W' ? '未预约' : record.auditionType === 'N' ? '已预约' : record.auditionType === 'Y' ? '已体验' : ''
              }}</a>
            </perm-box>
          </span>

          <span slot="createDate" slot-scope="text, record">
            <perm-box :text="record.createDate" perm="student:userlog:view">
              <a @click="openLogTime(record)">{{ text }}</a>
            </perm-box>
          </span>
        </s-table>
      </div>
    </a-card>
  </div>
</template>
<script>
import { invalidColumns } from '@/utils/intentionStu/adviser'
import { STable, SearchComPro } from '@/components'
import PermBox from '@/components/PermBox'
import { pageVoidStuUser, operationStuUser } from '@/api/intentionStu/adviser'
export default {
  components: {
    SearchComPro,
    PermBox,
    STable
  },
  data() {
    return {
      //多选
      selectedRowKeys: [],
      selectedRows: [],
      // table数据
      searchParams: [
        {
          type: 'text', // 文本输入框,返回值为string
          key: 'stuUserInfo',
          label: '学员信息',
          show: true,
          placeholder: '请输入姓名/手机号/微信号'
        }
      ],
      columns: invalidColumns,
      queryParam: {},
      loadData: parameter => {
        return pageVoidStuUser(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      }
    }
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRowKeys = selectedRowKeys
          this.selectedRows = selectedRows
          console.log(selectedRowKeys, selectedRows)
        }
      }
    }
  },
  watch: {},
  methods: {
    handleRecover() {
      this.examine().then(() => {
        let params = {
          id: this.selectedRowKeys.join(','),
          userValid: 'Y'
        }
        let _this = this
        this.$confirm({
          title: '系统提示',
          content: '确实要批量操作吗?',
          okText: '确认',
          cancelText: '取消',
          onOk() {
            operationStuUser(params)
              .then(res => {
                if (res.code === 200) {
                  _this.$notification['success']({
                    message: '系统通知',
                    description: '已成功批量恢复选中学员'
                  })
                }
              })
              .then(() => {
                _this.selectedRowKeys = []
                _this._refreshTable()
              })
          },
          onCancel() {}
        })
      })
    },
    //校验是否有勾选
    examine() {
      return new Promise((resolve, reject) => {
        if (this.selectedRowKeys.length === 0) {
          this.$notification['error']({
            message: '系统通知',
            description: '请先进行勾选！'
          })
        } else {
          resolve()
        }
      })
    },
    //搜索功能
    searchSubmit(data) {
      this.queryParam = data
      this._refreshTable()
    },

    _refreshTable() {
      this.selectedRowKeys = []
      this.selectedRows = []
      this.$refs.table.refresh()
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/style/index';

:global {
  .data-tree {
    .ant-card {
      top: -17px;
    }

    .ant-timeline {
      margin-top: 10px;
    }
  }
}

.intention-adviser-wrapper {
  .search-wrapper {
  }

  .btn-wrapper {
    margin-top: 20px;
    margin-left: -5px;
  }

  .table-wrapper {
    margin-top: 20px;
  }
}
</style>
