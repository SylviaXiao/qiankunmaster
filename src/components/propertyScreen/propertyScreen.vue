<template>
  <div>
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      title="公用属性筛选"
      width="40%"
      :visible="visible"
      :confirmLoading="confirmLoading"
      @ok="submit"
      @cancel="cancel"
    >
      <div style="display:flex;width:100%;align-items:center;">
        <div style="width:0.9rem;">公用属性：</div>
        <div style="margin-right:0.2rem;">
          按
          <a-select v-model="globalFilter" style="width: 1rem" @change="changeCheckList(globalFilter)">
            <a-select-option v-for="todo in filterSelect" :key="todo.id"> {{ todo.name }} </a-select-option>
          </a-select>
          查看
        </div>
        <div class="openPop">
          <template v-if="checkBoxFilter.length !== 0">
            <a-button @click="checkBoxShow = !checkBoxShow">{{ filterType }}</a-button>
            <checkBoxList
              :style="{ display: checkBoxShow && checkBoxFilter && checkBoxFilter.length !== 0 ? 'block' : 'none' }"
              class="checkPop"
              :list="checkBoxFilter"
              @getcheckIds="getcheckIds"
            />
          </template>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { selectAllEduDance, selectAllEduType, selectSchoolTree } from '@/api/echart/common'
import checkBoxList from '@/components/checkBoxList/checkBoxList.vue'

export default {
  data() {
    return {
      visible: false,
      confirmLoading: false,
      globalFilter: null,
      filterSelect: [{ id: '', name: '总体' }, { id: 'type', name: '班型' }, { id: 'school', name: '分馆' }, { id: 'dance', name: '舞种' }],
      checkBoxFilter: [],
      checkBoxShow: false, //控制多选弹窗展示
      checkIds: []
    }
  },

  components: {
    checkBoxList
  },

  computed: {
    filterType() {
      switch (this.globalFilter) {
        case 'type':
          return '班型'
        case 'dance':
          return '舞种'
        case 'school':
          return '分馆'
      }
    }
  },

  created() {},

  methods: {
    //全局筛选
    getcheckIds(data) {
      this.checkBoxShow = false
      this.checkIds = data
      // this.changeCondition()
      console.log(data)
    },
    //分馆
    getselectSchoolTree() {
      selectSchoolTree({}).then(res => {
        this.checkBoxFilter = []
        res.data.forEach(item => {
          item.children.forEach(todo => {
            todo.data = todo.deptNo
            this.checkBoxFilter.push(todo)
          })
        })
      })
    },
    //班型
    getselectAllEduType() {
      selectAllEduType({}).then(res => {
        this.checkBoxFilter = res.data
      })
    },
    //舞种
    getselectAllEduDance() {
      selectAllEduDance({}).then(res => {
        this.checkBoxFilter = res.data
      })
    },
    //更改筛选列表
    changeCheckList(val) {
      this.checkBoxShow = false
      if (val === 'type') {
        this.getselectAllEduType()
      } else if (val === 'school') {
        this.getselectSchoolTree()
      } else if (val === 'dance') {
        this.getselectAllEduDance()
      } else {
        this.checkBoxFilter = []
      }
    },
    cancel() {
      this.visible = false
    },
    submit() {},
    open() {
      this.visible = true
    }
  }
}
</script>
<style lang="less" scoped>
.openPop {
  position: relative;
  .button {
    cursor: pointer;
    display: flex;
    align-items: center;
  }
  .checkPop {
    position: absolute;
    top: 40px;
    z-index: 9999;
    background-color: #fff;
  }
}
</style>
