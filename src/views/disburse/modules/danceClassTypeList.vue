<template>
  <div ref="elementAll" style="height:calc(100vh - 84px)">
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      title="分摊情况"
      width="1350px"
      v-model="apportionModal"
      okText="保存"
      cancelText="取消"
      @ok="ApportionPlansClose()"
      @cancel="ApportionPlansClose()"
    >
    <div ref="elementSearch">
      <a-card :bordered="false" :style="{ margin: '20px 0' }">
        <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"></search-com-pro>
      </a-card>
    </div>
    <a-card :bordered="false">
      <div class="btnGroup" style="margin-bottom: 15px;" ref="elementBtn">
        <perm-box style="margin-left:20px;" perm="finance:splitproject:down">
          <a-button type="primary" icon="download" @click.native="downloadStu">
            导出
          </a-button>
        </perm-box>
      </div>
        <s-table
          :showSlider="true"
          :scroll="{ x: 1500 }"
          ref="table"
          size="default"
          :columns="two_solumns"
          :data="loadData"
          :alert="false"
          :rowKey="(record, index) => index"
        >
          <div slot="splitTitle" style="display:flex;">
            <div style="width:100px;">分摊月份</div>
            <div style="width:200px;">分摊分馆</div>
            <div style="width:150px;">分摊金额（分摊分馆）</div>
            <div style="width:100px;">舞种</div>
            <div style="width:100px;">大班型</div>
            <div style="width:200px;">小班型</div>
            <div style="width:150px;">分摊金额（舞种、班型）</div>
          </div>
          <span slot="split" slot-scope="text, record">
            <div v-if='Array.isArray(record.spendingsplitList)'>
                 <div v-for="(item, index) in record.spendingsplitList" :key="index" style="display:flex;">
                    <div style="width:100px;">{{ item.splDate.slice(0, 10) }}</div>
                    <div style="width:200px;">{{ item.splDeptName}}</div>
                    <div style="width:150px;">{{ item.splPrice }}</div>
                    <div v-if='Array.isArray(item.projectList)'>
                        <div v-for="(col, colIndex) in item.projectList" :key="colIndex" style="display:flex;">
<!--                              <div style="width:400px;">{{ col.price }}</div>-->
                              <div style="width:100px;">{{ col.danceName }}</div>
                              <div style="width:100px;">{{ col.eduName }}</div>
                              <div style="width:200px;">{{ col.eduClassName }}</div>
                              <div style="width:150px;">{{ col.price }}</div>
                        </div>
                    </div>
                  </div>
            </div>
          </span>
        </s-table>
    </a-card>
    </a-modal>
  </div>
</template>

<script>
import { STable, SearchComPro } from '@/components'
import PermBox from '@/components/PermBox'
import {  getAllSysFeeItem, getFinspendingSplitProjectsList } from '@/api/education/card'
import {  listEduDance, treeEduClassType } from '@/api/common'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'

const two_solumns = [
  {
    title: '费用报销单-单号',
    dataIndex: 'procinstNo',
    width: 120,
  },
  {
    title: '提交日期',
    dataIndex: 'createDate',
    width: 100,
    customRender: (text, record) => {
      return text.split(' ')[0]
    }
  },
  {
    title: '提交分馆/部门',
    dataIndex: 'deptName',
    width: 120,
  },
  {
    title: '项目名称',
    dataIndex: 'feeName',
    width: 200,
    ellipsis: true
  },
  {
    title: '费用归类',
    dataIndex: 'feeitemName',
    width: 200,
    ellipsis: true
  },
  {
    title: '分摊金额（费用分摊）',
    dataIndex: 'splitprice',
    width: 100
  },
  {
    dataIndex: 'splDate',
    width: 1000,
    scopedSlots: { title: 'splitTitle', customRender: 'split' }
  },
  // {
  //   title: '分摊分馆',
  //   dataIndex: 'splDeptName',
  //   width: 100
  // },
  // {
  //   title: '分摊金额（分摊分馆）',
  //   dataIndex: 'splPrice',
  //   width: 100,
  //   ellipsis: true
  // },
  // {
  //   title: '舞种',
  //   dataIndex: 'danceName',
  //   width: 100
  // },
  //
  // {
  //   title: '大班型',
  //   dataIndex: 'eduName',
  //   width: 100
  // },
  // {
  //   title: '小班型',
  //   dataIndex: 'eduClassName',
  //   width: 200
  // },
  // {
  //   title: '分摊金额（舞种、班型）',
  //   dataIndex: 'price',
  //   width: 100
  // },
  {
    title: '财务归类',
    dataIndex: 'financeName',
    width: 100,
    ellipsis: true
  },
  {
    title: '经营归类',
    dataIndex: 'operateName',
    width: 100
  }
]
export default {
  data() {
    return {
      apportionModal:false,
      two_solumns,
      searchParams: [
        {
          type: 'select',
          key: 'danecId',
          label: '舞种',
          placeholder: '请选择舞种',
          apiOption: {
            api: listEduDance,
            string: 'name',
            value: 'id'
          },
          show: true
        },
        {
          type: 'cascader',
          key: 'eduTypeId',
          label: '班型',
          placeholder: '请选择班型',
          treeOps: {
            api: treeEduClassType,
            label: 'name',
            value: 'id',
            children: 'children'
          },
          show: true
        },
        {
          type: 'cascader',
          key: 'feeItemName',
          label: '费用归类',
          placeholder: '请输入费用归类',
          search: true,
          treeOps: {
            api: getAllSysFeeItem,
            label: 'feeItemName',
            value: 'feeItemName',
            children: 'children',
            params: {
              type: 'A'
            }
          },
          show: true
        },
      ],
      queryParam: {},
      loadData: parameter => {
        return getFinspendingSplitProjectsList(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      }
    }
  },

  components: {
    SearchComPro,
    STable,
    PermBox
  },
  computed: {},

  created() {},
  methods: {
    //导出
    downloadStu() {
      let exportUrl = '/finance/spending/downFinSpendingSplitProject'
      const { queryParam } = this
      const token = Vue.ls.get(ACCESS_TOKEN)
      let fields = [{ name: 'auth_token', value: token }]
      for (let k in queryParam) {
        if (k !== 'page' && k != 'limit' && queryParam[k]) fields.push({ name: k, value: queryParam[k] })
      }
      fields.push({ name: 'page', value: 0 })
      fields.push({ name: 'limit', value: 0 })
      const form = document.createElement('form')
      form.action = `${process.env.VUE_APP_URL}${exportUrl}`
      form.method = 'POST'
      form.target = 'downloadFrame'
      for (let i = 0; i < fields.length; i++) {
        const field = fields[i]
        const f = document.createElement('input')
        f.type = 'hidden'
        f.name = field.name
        f.value = field.value
        form.appendChild(f)
      }
      document.body.appendChild(form)
      form.submit()
      this.$message.success('正在下载...')
      document.body.removeChild(form)
    },
    open(){
      this.apportionModal=true
      this._refreshTable()
    },
    ApportionPlansClose(){this.apportionModal=false},
    searchSubmit(data) {
      if(data.eduTypeId){
        let str = data.eduTypeId.split(',')
        data.eduTypeClassId=str[1]
        data.eduTypeId=str[0]
      }
      this.queryParam =data
      console.log(777,this.queryParam )
      this._refreshTable()
    },
    _refreshTable() {
      this.$refs.table?.refresh()
    }
  }
}
</script>
<style lang="less" scoped></style>
