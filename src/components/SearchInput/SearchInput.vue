<template>
  <div class="search-input-wrapper">
    <a-auto-complete class="search-input" :disabled="disabled" :allowClear="allowClear" v-model="value">
      <a-input :read-only="true" :addonBefore="addonBefore" :placeholder="placeholder" style="color: #000;">
        <a-icon slot="addonAfter" type="search" class="search-input-searchIcon" v-if="searchIcon" @click="openSelectModal" />
      </a-input>
      <template slot="dataSource">
        <a-select-option v-for="item in dataSource" :key="item.id || item.classId">{{ item.cardName || item.className }}</a-select-option>
      </template>
    </a-auto-complete>
    <GetCard ref="cardModal" :stuType="stuType" :multiple="true" @ok="cardModalOk" @close="cardModalClose" @getBackData="getCardValue"></GetCard>
    <!--    //选择班级-->
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" :destroyOnClose="true" v-model="classModal" title="选择班级" @ok="getClassValue" :width="800" :confirmLoading="classModalLoading" okText="提交">
      <choose-table ref="chooseClass" :is-open="classModal" :card-values="cardValues" />
    </a-modal>
    <!--    //选择导师-->
    <i-modal ref="teaModal" :multiple="false" :userType="userType" @ok="imodalOk" @close="imodalClose" @getBackData="getTeaValue"></i-modal>
  </div>
</template>

<script>
import { pageDeptCard, listClass } from '@/api/common'
import ChooseTable from '@/components/ChooseTable/ChooseTable.vue'
import GetCard from '@/components/GetCard/GetCard.vue'
import IModal from '@/components/InnerModal/modal.vue'

export default {
  name: 'SearchInput',
  components: {
    GetCard,
    ChooseTable,
    IModal
  },
  props: {
    data: {
      type: String,
      default: ''
    },
    searchIcon: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    allowClear: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String
    },
    type: String,
    index: Number || String,
    queryParam: {
      type: Object
    },
    cardValues: {
      type: Object
    },
    initInput: Boolean,
    addonBefore: String,
    userType: {
      type: String,
      default: 'all'
    },
    // 学员类型：A.成人 B.少儿
    stuType: {
      type: String,
      default: null
    }
  },

  data() {
    return {
      dataSource: [],
      id: null,
      value: null,
      timer: null,

      //
      classModal: false,
      classModalLoading: false
    }
  },
  watch: {
    id(nv, ov) {
      if (!nv) {
        this.dataSource = []
      }
    },
    initInput: {
      handler(nv, ov) {
        if (nv) {
          this.value = ''
          this.$emit('select', Object.assign({}, { key: this.index }))
        }
      },
      immediate: true
    },
    data: {
      handler(nv, ov) {
        this.value = nv
      },
      immediate: true
    }
  },
  created() {
    this.value = this.data
  },
  methods: {
    search(value) {
      const { type, searchCard, searchClass } = this
      this.$emit('search', true)
      if (this.timer) clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        !!!value ? (this.dataSource = []) : ''
        if (!!value && type) {
          type === 'card' ? searchCard(value) : ''
          type === 'class' ? searchClass(value) : ''
          type === 'teacher' ? searchTea(value) : ''
        }
      }, 400)
    },
    select(value, option) {
      const { dataSource, index } = this
      const data = dataSource.find(item => {
        return item.classId ? item.classId === value : item.id === value
        // return item.id || item.classId === value
      })
      this.$emit('select', Object.assign(data, { key: index }))
      this.id = value
    },
    blur() {
      const { id, index } = this
      if (!id) {
        this.value = ''
        this.$emit('select', Object.assign({}, { key: index }))
      }
    },
    change() {
      const { id, index } = this
      if (!id) {
        this.value = ''
        this.$emit('select', Object.assign({}, { key: index }))
      }
    },
    searchCard(value) {
      const { queryParam } = this
      let data = { page: 0, limit: 0, cardName: value }
      queryParam ? (data = Object.assign(queryParam, data)) : ''
      pageDeptCard(data)
        .then(res => {
          this.dataSource = res.data
        })
        .finally(() => {
          this.id = null
        })
    },
    searchClass(value) {
      const { queryParam } = this
      let data = { className: value }
      queryParam ? (data = Object.assign(queryParam, data)) : ''
      listClass(data)
        .then(res => {
          this.dataSource = res.data
        })
        .finally(() => {
          this.id = null
        })
    },
    searchTea() {},

    openSelectModal() {
      const { type } = this
      this.dataSource = []
      type === 'card' ? this.$refs.cardModal.open() : ''
      type === 'class' ? (this.classModal = true) : ''
      type === 'teacher' ? this.$refs.teaModal.open() : ''
      this.$emit('open', true)
    },
    cardModalOk() {},
    cardModalClose() {},
    imodalOk() {},
    imodalClose() {},
    getCardValue(value) {
      let data = []
      value.forEach((item, index) => {
        data.push(Object.assign(item, { key: Number(this.index) + index }))
      })
      this.$emit('select', data)

      // const { index } = this
      // const { cardName, id } = value
      // this.value = cardName
      // this.id = id
      // this.$emit('select', Object.assign(value, { key: index }))
    },
    getClassValue(value) {
      const { index } = this
      this.$refs.chooseClass
        .handleOk()
        .then(res => {
          const { id, name } = res
          this.value = name
          this.id = id
          this.$emit('select', Object.assign(res, { key: index }))
        })
        .finally(() => {
          this.classModal = false
        })
    },
    getTeaValue(value) {
      const { id, name } = value
      this.value = name
      this.id = id
      this.$emit('select', value)
    },
    init() {
      this.value = ''
    },
  }
}
</script>

<style scoped lang="less">
.search-input-wrapper {
  .search-input {
    .search-input-searchIcon {
      cursor: pointer;
    }
  }
}
</style>
