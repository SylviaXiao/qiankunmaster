<template>
  <div class="selected">
    <div v-if="Msg.length > 1">
      <div class="border"></div>
      <div class="type" @click="chooseType('AND')" :class="{ active: type === 'AND' }">且</div>
      <div class="type" @click="chooseType('OR')" :class="{ active: type === 'OR' }">或</div>
      <div class="border"></div>
    </div>
    <div style="width:100%;">
      <div class="title">
        <div>选择属性</div>
        <div>设置条件</div>
      </div>
      <div v-for="(item, index) in Msg" :key="index" class="list">
        <div style="display:flex;align-items:center;">
          <a-select v-model="item.kind" style="width: 1rem" @change="changeKind(index, item.kind)" placeholder="请选择属性">
            <a-select-option v-for="todo in options" :key="todo.value"> {{ todo.name }} </a-select-option>
          </a-select>
          <a-select v-model="item.operate" style="width: 1rem" @change="handleChange(index)">
            <a-select-option v-for="todo in item.operates" :key="todo.value"> {{ todo.name }} </a-select-option>
          </a-select>
          <a-select
            v-if="item.type === 'select' ||item.type ==='whether'"
            mode="multiple"
            style="width: 4rem"
            placeholder="请选择具体场景"
            @focus="handleFocus(index)"
            v-model="item.scene"
            @change="handleChange(index, item.scene)"
          >
            <a-select-option v-for="todo in item.children" :key="todo.data">
              {{ todo.name }}
            </a-select-option>
          </a-select>
          <template v-if="item.type === 'number'">
          <a-input-number  v-model="item.scene" @blur="handleChange(index, item.scene)" />天
          </template>
        </div>
        <div class="action">
          <div style="display:flex;align-items:center;">
            <div class="add" v-if="Msg.length - 1 == index" @click="add()">
              <a-icon type="plus" class="icon"   />筛选
            </div>
            <div @click.stop="subtract(index)" v-if="Msg.length !== 1" class="add">删除</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { selectAllEduDance, selectAllEduType } from '@/api/echart/common'

export default {
  props: {
    options: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      Msg: [
        {
          kind: null,
          scene: [],
          sceneText: [],
          children: [],
          operate: null,
          operates: [],
          type: null
        }
      ],
      type: 'AND',
      operateDefault: [
        { name: '包含', value: 'IN', type: ['select'] },
        { name: '不包含', value: 'NOT_IN', type: ['select'] },
        { name: '等于', value: 'EQUAL', type: ['number','whether'] },
        { name: '不等于', value: 'NOT_EQUAL', type: ['number','whether'] },
        { name: '大于', value: 'GT', type: ['number'] },
        { name: '小于', value: 'LT', type: ['number'] },
        { name: '小于等于', value: 'LT_EQUAL', type: ['number'] },
        { name: '大于等于', value: 'GT_EQUAL', type: ['number'] },
        { name: '存在', value: 'EXIST', type: [] },
        { name: '介于', value: 'BETWEEN', type: [] }
      ]
    }
  },

  components: {},

  computed: {},

  mounted() {
    this.selectList = this.options
    this.getselectAllEduDance()
    this.getselectAllEduType()
  },

  methods: {
    //班型
    getselectAllEduType() {
      selectAllEduType({}).then(res => {
        this.options.forEach(item => {
          if (item.value === 'typeId') {
            item.children = res.data
          }
        })
      })
    },
    //舞种
    getselectAllEduDance() {
      selectAllEduDance({}).then(res => {
        this.options.forEach(item => {
          if (item.value === 'danceId') {
            item.children = res.data
          }
        })
      })
    },
    //选择对比关系
    chooseType(val) {
      if (this.type !== val) {
        this.type = val
        this.$emit('changeList', this.Msg.length > 1 ? this.type : '', this.Msg)
      }
    },
    add() {
      this.Msg.push({
        kind: null,
        scene: [],
        operate: null,
        children: [],
        sceneText: [],
        operates: [],
        type: null
      })
    },
    subtract(index) {
      this.Msg.splice(index, 1)
    },
    changeKind(index, val) {
      // if(this.kind!=='A' || this.kind!=='B') {
      this.Msg[index].children = this.options.find(item => item.value === val).children
      this.Msg[index].type = this.options.find(todo => todo.value === val).type
      this.Msg[index].operates = this.operateDefault.filter(item => item.type.includes(this.Msg[index].type))
      this.Msg[index].operate = this.Msg[index].operates[0].value
      this.Msg[index].scene = this.Msg[index].type === 'select'|| this.Msg[index].type === 'whether' ? [] : ''
      // }
    },
    handleFocus(index) {
      if (!this.Msg[index].kind) {
        this.$notification['error']({
          message: '系统通知',
          description: '请先选择属性'
        })
      }
    },
    handleChange(index, val) {
      if (val) {
        if (val instanceof Array) {
          this.Msg[index].sceneText = []
          let obj = this.options.find(item => item.value === this.Msg[index].kind)
          let arr = []
          val.forEach(todo => {
            arr.push(obj.children.find(item => item.data === todo).name)
          })
          this.Msg[index].sceneText = arr
        }
        // .children.find(item=>item.data === this.Msg[index].scene[this.Msg[index].scene.length-1]).name
      }
      console.log(this.Msg)
      if (this.Msg[index].kind) {
        this.$emit('changeList', this.Msg.length > 1 ? this.type : '', this.Msg)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.selected {
  margin: 10px 0;
  display: flex;
}
.icon {
  color: #1890ff;
  font-size: 13px;
  // display: none;
}
.list {
  background-color: fff;
  // g: 5px;
  display: flex;
  margin-bottom: 10px;
  padding: 5px;
}
.list:hover {
  background-color: #dddddd52;
  // .icon {
  //   display: block;
  // }
  .action {
    display: block;
  }
}
.action {
  display: none;
}
  .add {
    font-size:12px;
    display:flex;
    align-items: center;
    margin: 7px;
    color:#1890ff;
    cursor: pointer;
  // display: none;

  }
.border {
  margin-left: 7px;
  width: 1px;
  height: calc((100% - 42px) / 2);
  background-color: #1890ff;
}
.type {
  padding: 0 2px;
  cursor: pointer;
  &.active {
    color: #fff;
    background-color: #1890ff;
  }
}
.title {
  font-size: 12px;
  display: flex;
  color: #999;
  > div:first-of-type {
    margin-left: 10px;
  }
  > div:nth-of-type(2) {
    margin-left: 50px;
  }
}
</style>
