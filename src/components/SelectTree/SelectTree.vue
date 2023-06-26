<template>
  <div>
    <a-tree-select
      :st-type='stType'
      :placeholder="placeholder"
      :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
      treeDefaultExpandAll
      multiple
      allowClear
      :treeData="defaultData"
    >
    </a-tree-select>
  </div>
</template>

<script>
  import { getUserTree } from '@/api/education'

  export default {
    name: 'SelectTree',
    props: {
      stType: {
        type: String,
        default: 'dept'
      },
      placeholder: {
        type: String,
        default: ''
      },
      treeData: {
        type: Object,
        default: null
      }
    },
    data() {
      return {
        defaultData: []
      }
    },
    created() {
      this.getTreeData()
    },
    methods: {
      getTreeData() {
        getUserTree().then(res => {
          console.log(res)
          this.rewriteDataTree(res.data)
          this.defaultData = res.data
        })
      },
      rewriteDataTree(data) {
        data.forEach((item, index) => {
          if (item.title && item.key && item.value) {
            return false
          }
          item.title = item.deptName
          item.key = item.id
          item.value = item.id
          if (item.children && item.children.length > 0) {
            this.rewriteDataTree(item.children)
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>