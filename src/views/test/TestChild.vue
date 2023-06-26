<template>
<div>
    <a-button class="editable-add-btn" @click="handleAdd">Add</a-button>
    <a-form :form="formTable">
      <a-table bordered :dataSource="dataSource" :columns="columns">
        <template slot="name" slot-scope="text, record">
          <a-form-item label="">
            <a-input v-decorator="[ `professional${record.key}`]" style="width: 70%;"/>
          </a-form-item>
        </template>
        <template slot="age" slot-scope="text, record">
          <a-input style="min-width: 100px;display: inline-block;" v-model="record.age" @change="test(record)"></a-input>
        </template>
        <template slot="operation" slot-scope="text, record">
          <a href="#" @click="onDelete(record.key)">删除</a>
          </template>
      </a-table>
    </a-form>
    <a-button type="primary" @click="getTableData">获取数据</a-button>
</div>
</template>
<script>
const columnsCer = [
  {
    title: '姓名',
    dataIndex: 'name',
    scopedSlots: {
      customRender: 'name'
    },
  },
  {
    title: '身份证号码',
    dataIndex: 'age',
    scopedSlots: {
      customRender: 'age'
    },
  },
  {
    title: '性别',
    dataIndex: 'address',
    scopedSlots: {
      customRender: 'address'
    },
  },
  {
    title: '生日',
    dataIndex: 'birth',
    scopedSlots: {
      customRender: 'birth'
    },
  },
  {
    title: '成绩',
    dataIndex: 'grade',
    scopedSlots: {
      customRender: 'grade'
    },
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: {
      customRender: 'operation'
    },
  },
]
export default {
  data() {
    return {
      dataSource: [],
      // dataSource: [{
      //   key: '0',
      //   name: 'Edward King 0',
      //   age: '32',
      //   address: 'London, Park Lane no. 0',
      // }, {
      //   key: '1',
      //   name: 'Edward King 1',
      //   age: '32',
      //   address: 'London, Park Lane no. 1',
      // }, {
      //   key: '2',
      //   name: 'Edward King 1',
      //   age: '32',
      //   address: 'London, Park Lane no. 1',
      // }],
      count: 3,
      columns: columnsCer,
    }
  },
  beforeCreate() {
    this.formTable = this.$form.createForm(this)
  },
  methods: {
    // 输入框
    test(record) {
    },
    onDelete(key) {
      const dataSource = [...this.dataSource]
      this.dataSource = dataSource.filter(item => item.key !== key)
    },
    handleAdd() {
      const {
        count,
        dataSource
      } = this
      const newData = {
        key: count,
        name: `Edward King ${count}`,
        age: 32,
        address: `London, Park Lane no. ${count}`,
      }
      this.dataSource = [...dataSource, newData]
      this.count = count + 1
    },
    getTableData() {
    }
  },
}
</script>

<style scoped lang=less>
.search-wrapper {}
</style>
