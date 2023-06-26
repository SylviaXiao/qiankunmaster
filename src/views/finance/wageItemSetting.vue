<template>
  <div>
    <perm-box perm="finance:config:view">
      <!-- <a-card :bordered="false" :style="{ margin: '20px 0' }">
        <search-com-pro
          :style="{ padding: '10px 0' }"
          @searchSubmit="searchSubmit"
          :searchParams="searchParams"
        ></search-com-pro>
      </a-card> -->
      <a-card :bordered="false">
        <div class="btn-wrapper">
          <perm-box perm="finance:config:save">
            <a-button icon="plus-circle" type="primary" @click="add()">新增</a-button>
          </perm-box>
        </div>
        <s-table ref="table" size="default" :columns="wageColunm" :data="loadData" rowKey="id">
          <span slot="formalSal" slot-scope="text, record">
            <div v-if="record.probationSal">试用/{{ record.probationSal }}</div>
            <div v-if="record.formalSal">正式/{{ record.formalSal }}</div>
          </span>
          <span slot="leastSal" slot-scope="text, record">
            <div v-if="record.applicablSal">试用/{{ record.applicablSal }}</div>
            <div v-if="record.leastSal">正式/{{ record.leastSal }}</div>
          </span>

          <span slot="mapQueryList" slot-scope="text, record">
            <div v-for="(item, index) in text" :key="index">
              <div v-if="index < 2">{{ item.deptName }}</div>
            </div>
            <a-popover title="">
              <template slot="content">
                <div v-for="(item, index) in text" :key="index">
                  {{ item.deptName }}
                </div>
              </template>
              <div style="color: #1ba97b;">(共{{ text.length }}个)</div>
            </a-popover>
          </span>
          <span slot="salcommisions" slot-scope="text, record">
            <div v-for="(item, index) in text" :key="index">
              <span v-if="item.endSection !== null && item.startSection !== null">{{ item.startSection }}-{{ item.endSection }}万/</span>{{ item.rate
              }}{{ record.subType === 'A' ? '‰' : '%' }}
            </div>
          </span>
          <span slot="action" slot-scope="text, record">
            <perm-box perm="finance:config:save">
              <a href="#" @click="edit(record)">修改</a>
            </perm-box>
            <perm-box perm="finance:config:del">
              <a href="#" @click="remove(record)">删除</a>
            </perm-box>
          </span>
        </s-table>
      </a-card>
    </perm-box>
    <wageConfig ref="wageConfig" @update="_refreshTable" />
  </div>
</template>
<script>
import { pageSalConfig, removeSalConfig } from '@/api/finance/finance'
import { listArea, listEduDance } from '@/api/common'
import { wageColunm } from './finance'
import PermBox from '@/components/PermBox'
import STable from '@/components/Table'
import SearchComPro from '@/components/SearchComPro'
import wageConfig from './modules/wageConfig'
export default {
  components: {
    SearchComPro,
    STable,
    PermBox,
    wageConfig
  },
  data() {
    return {
      searchParams: [
        {
          type: 'date',
          key: 'Date',
          label: '录入时间',
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD'
        },
        {
          type: 'text',
          key: 'name',
          label: '搜索收入项',
          placeholder: '请输入收入项'
        }
      ],
      wageColunm,
      queryParam: {},
      loadData: parameter => {
        return pageSalConfig(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      }
    }
  },

  methods: {
    add() {
      this.$refs.wageConfig.open()
    },
    edit(record) {
      this.$refs.wageConfig.open(record)
      // this.$nextTick(() => {
      //   this.$refs.wageConfig.backindData(record)
      // })
    },
    remove(record) {
      let _this = this
      let params = record.id
      this.$confirm({
        title: '系统提示',
        content: '确认要删除吗?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          removeSalConfig({ salConfigId: params }).then(() => {
            _this._refreshTable()
          })
        }
      })
    },
    searchSubmit(data) {
      this.queryParam = data
      this._refreshTable()
    },
    _refreshTable() {
      this.$refs.table.refresh()
    }
  }
}
</script>
<style scoped lang="less">
.btn-wrapper {
  margin-bottom: 10px;
}
</style>
