<template>
  <div>
    <a-card :bordered="false" :style="{margin:'20px 0'}">
      <search-com-pro :style="{padding:'10px 0'}" @searchSubmit="searchSubmit" :searchParams="searchParams"></search-com-pro>
    </a-card>
    <a-card :bordered='false'>
      <s-table :columns='columns' ref='table' :data="loadData" rowKey="key">
      </s-table>
    </a-card>
  </div>

</template>

<script>
  import { STable, SearchComPro } from '@/components'
  import PermBox from '@/components/PermBox'
  import { getAllUserLog, getUserLog } from '@/api/organize'

  const columns = [
    {
      title: '操作用户',
      dataIndex: 'userName',
      // scopedSlots: { customRender: 'userName' }
    },
    {
      title: 'IP地址',
      dataIndex: 'ip'

    },
    {
      title: '登陆方式',
      dataIndex: 'logAgent',
      customRender: text => {
        let show = '识别失败'
        let obj = {
          trident: text.indexOf('Trident') > -1, //IE内核
          presto: text.indexOf('Presto') > -1, //opera内核
          webKit: text.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
          gecko: text.indexOf('Gecko') > -1 && text.indexOf('KHTML') == -1, //火狐内核
          mobile: !!text.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
          ios: !!text.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
          android: text.indexOf('Android') > -1 || text.indexOf('Adr') > -1, //android终端
          iPhone: text.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
          iPad: text.indexOf('iPad') > -1, //是否iPad
          webApp: text.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
          weixin: text.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
          qq: text.match(/\sQQ/i) == ' qq' //是否QQ
        }
        if (obj.trident) {
          show = 'IE浏览器'
        } else if (obj.presto) {
          show = 'opera浏览器'
        } else if (obj.webKit) {
          show = '谷歌浏览器'
        } else if (obj.gecko) {
          show = '火狐浏览器'
        } else if (obj.ios) {
          show = 'Safari浏览器'
        } else if (obj.android) {
          show = 'android'
        } else if (obj.iPhone) {
          show = 'iPhone'
        } else if (obj.iPad) {
          show = 'iPad'
        } else if (obj.weixin) {
          show = '微信浏览器'
        } else if (obj.qq) {
          show = 'QQ浏览器'
        }
        return show
      }

    },
    {
      title: '登录时间',
      dataIndex: 'createDate'

    }

  ]
  export default {
    name: 'log',
    components: {
      SearchComPro,
      STable,
      PermBox
    },
    data() {
      return {
        searchParams: [
          {
            type:'text',
            key: 'userName',
            label:'操作用户',
            placeholder: '请输入操作用户',
          },
          {
            type:'text',
            key: 'ip',
            label:'IP地址',
            placeholder: '请输入IP地址',
          },
          {
            type:'date',
            key:'Date',
            label:'登录时间',
            placeholder: '请选择登录时间',
            format:"YYYY-MM-DD"
          }
        ],
        showSearchTag: {
          title: {
            userName: true,
            ip: true,
            logTime: true
          },
        },
        columns,
        queryParam: {},
        loadData: parameter => {
          return getAllUserLog(Object.assign(parameter, this.queryParam))
            .then(res => {
              res.data.forEach((item, index) => {
                item.key = index
              })
              return res
            })
        },
        logAgent: '识别失败'
      }
    },
    beforeCreate() {
      this.searchForm = this.$form.createForm(this)
    },
    methods: {
      //搜索功能
      searchSubmit(data) {
        this.queryParam = data
        this._refreshTable()
      },
      showAgent() {
      },
      _refreshTable() {
        this.$refs.table.refresh()
      }
    }
  }
</script>

<style scoped lang=less>

</style>
