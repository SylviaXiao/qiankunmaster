<template>
  <a-card :bordered="false">
  </a-card>
</template>

<script>
  import { getPermissionTree } from '@/api/organize'

  export default {
    name: 'organizePermission',
    components: {
    },
    data() {
      return {
        options: {
          columns: [
            {
              title: '菜单名称',
              dataIndex: 'menuName'
            },
            {
              title: '请求地址',
              dataIndex: 'path'
            },
            {
              title: '权限',
              dataIndex: 'pers',
            },
            {
              title: '类型',
              dataIndex: 'menuType',
              customRender: text => {
                let showText = ''
                if (text == 1) {
                  showText = '目录'
                } else if (text == 2) {
                  showText = '菜单'
                } else if (text == 3) {
                  showText = '按钮'
                }
                return showText
              }
            },

            {
              title: '状态',
              dataIndex: 'status',
              customRender: text => {
                let showText = ''
                text === 'Y' ? showText = '启用' : showText = '禁用'
                return showText
              }
            },
            {
              title: '操作',
              key:'action',
              scopedSlots: { customRender: 'action' },
            }
          ],
          dataSource: [],
          pagination: false,
          rowSelection: {
            onChange: (selectedRowKeys, selectedRows) => {
            },
            onSelect: (record, selected, selectedRows) => {
            },
            onSelectAll: (selected, selectedRows, changeRows) => {
            }
          }
        }
      }
    },
    mounted() {

    },
    created() {
      this.getTreeList()
    },
    methods: {
      hasChilren(values) {
        values.forEach(item => {
          if (item.children && item.children.length === 0) {
            delete item.children
            return false
          }
          this.hasChilren(item.children)
        })
      },
      getTreeList() {
        getPermissionTree().then(res => {
          this.hasChilren(res.data)
          this.options.dataSource = res.data
        })
      }
    }
  }
</script>

<style scoped>

</style>
