import { danceList, cardTypeList, classList, roomList, getSchoolList } from '@/api/education/card'
import { treeEduClassType, listEduType } from '@/api/common'

export default {
  data() {
    return {
      searchParams:[
        {
          type:'text',  // 文本输入框,返回值为string
          key: 'phone',
          label:'手机号码',
          placeholder: '请输入手机号码',
        },
        {
          type:'select',  // 静态select框
          key:'sex',
          label:'选择性别',
          placeholder: '请选择性别',
          allowClear: false,  // 不允许有清除按钮
          initialValue: 'B',  // 单选 'B' 多选 ['A', 'B']
          initialIndex: 1, // a-select更新，支持重复数据，故需要Index拼接，
          staticArr:[
            {
              string:"男",
              value:"A"
            },
            {
              string:"女",
              value:"B"
            },
          ],
        },
        {
          type:'select',  //动态select框
          key:'test',
          label:'异步测试',
          placeholder: '请选择',
          allowClear: false,  // 不允许有清除按钮
          initialValue: 'dsidja311213ddfdsfsdfsadf', // 默认值,多用于静态select,用接口先查出id,再来赋值
          apiOption:{
            api:listEduType,  // promise类型的接口
            string:"name",
            value:"id"
          }
        },
        {
          type:'chooseModal',  // 点击弹框选择类型
          key:'master',  // 根据key来筛选
          label:'选择顾问',
          placeholder: '请选择'
        },
        {
          type:'chooseModal',
          key:'cardName',  // 当chooseModal类型下 key为cardName时将调用另外的弹出组件
          label:'选择卡名',
          placeholder: '请选择'
        },
        {
          type:'date',
          key:'date',  //包含date字段返回值不包含hh:mm:ss   包含time字段返回值包含hh:mm:ss
          label:'选择时间',
          placeholder: '请选择时间',
          format:"YY-MM-DD", //YY-MM-DD  ||  YY-MM-DD hh:mm:ss  请与key对应
          disabledType: 'disableLastMonthAfter3' // 禁用类型，具体在commonConfig里面定义
        },
        {
          type:'cascader',  //树形选择框
          key:'classType',
          label:'选择班级',
          placeholder: '请选择班型',
          treeOps:{
            api:treeEduClassType,
            type:'B',
            label:'name',
            value:'id',
            children:'children'
          }
        },
        {
          type:'treeSelect',
          key:'school_id',
          label:'选择分馆',
          placeholder: '请选择分馆',
          expandAll:true,   //是否默认展开
          selectFather:false,    //父元素能否被点击
          treeOps:{
            api:getSchoolList,
            label:'deptName',
            value:'id',
            children:'children'
          }
        }
      ]
    }
  }
}
