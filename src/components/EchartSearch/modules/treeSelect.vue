<template>
  <div>
    <a-col :span="8">
      <a-form-model-item :label="item.label" v-bind="{ labelCol: { span: 6 }, wrapperCol: { span: 16 } }">
        <a-tree-select
          :show-search="item.search"
          treeNodeFilterProp="title"
          v-model="item[item.key]"
          :placeholder="item.placeholder"
          :allowClear="true"
          :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
          :treeData="selectArr"
          :treeDefaultExpandAll="item.expandAll"
          :disabled="item.disabled"
        />
      </a-form-model-item>
    </a-col>
  </div>
</template>
<script>
import { getSchoolList } from '@/api/education/card'
export default {
  name: 'treeSelect',
  data() {
    return {
      selectArr: []
    }
  },
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    item: {
      immediate: true,
      handler(newVal) {
        if(!this.item[this.item.key]) {
          this.$set(this.item,this.item.key,'')
        }
        this.getSelectArr()
      }
    }
  },
  components: {},

  computed: {},

  created() {},

  methods: {
    getSelectArr() {
      let { api } = this.item.treeOps
      let data = []
      api().then(res => {
        if (res.code === 200) {
          console.log(this._handleTreeData(res.data, this.item))
          this.selectArr = this._handleTreeData(res.data, this.item)
        }
      })
    },
    _handleTreeData(data, itemObj) {
      let { label, value, children } = itemObj.treeOps
      let selectFather = itemObj.selectFather
      return data.map((item, index) => {
        let temObj = {}
        temObj.title = item[label]
        temObj.value = itemObj.selectFather ? `${item[value]}:${item.deptType}` : `${item[value]}`
        temObj.key = item[value]
        if (item[children]) {
          temObj.children = this._handleTreeData(item.children, itemObj)
          temObj.disabled = !selectFather
        }
        return temObj
      })
    }
  }
}
</script>
<style lang="less" scoped></style>
