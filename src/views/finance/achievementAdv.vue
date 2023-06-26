<template>
  <div class="achiadv-wrapper">
    <a-card :bordered="false" :style="{margin:'20px 0'}">
      <search-com :style="{padding:'10px 0'}" @searchSubmit="searchSubmit" :showSearchTag="showSearchTag"></search-com>
    </a-card>
    <a-card :bordered="false">
      <div class="table-wrapper">
        <s-table
          ref="table"
          size="default"
          :columns="achiAdvColumns"
          :data="loadData"
          rowKey="id"
        >
        <div class="remark-wrapper" slot='remark' slot-scope="text, record">
          {{text}}
        </div>
        </s-table>
      </div>
    </a-card>
    <!-- 详细明细 -->
  </div>
</template>
<script>
import { achiAdvColumns } from './finance'
import { STable, SearchCom } from '@/components'
import {
  pageAchievement,
} from '@/api/finance/finance'
export default{
  data() {
    return {
      // table数据
      showSearchTag: {
        title: {
          userId: true,
          deptName: true
        }
      },
      achiAdvColumns: achiAdvColumns,
      queryParam: {},
      loadData: parameter => {
        return pageAchievement( Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      },

      // 跟进数据
      visibleDetail: false,
      confirmDetailLoading: false,
    }
  },
  components: {
    SearchCom,
    STable
  },
  methods: {
    //搜索功能
    searchSubmit(data) {
      this.queryParam = data
      this._refreshTable()
    },
    handleDetailOk() {
      this.visibleDetail = false
    },
    handleDetailCancel() {
      this.visibleDetail = false
    },
    _refreshTable() {
      this.$refs.table.refresh()
    }
  }
}
</script>

<style lang=less>
.achiadv-wrapper {
  .remark-wrapper {
    max-width: 400px;
  }
}
</style>
