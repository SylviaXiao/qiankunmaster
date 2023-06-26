<template>
  <div class="salary-type-wrapper">
    <div class="edu-type" ref="eduType" @dragstart="onDragStart" @dragover="onDragOver" @dragend="onDragEnd">
      <a-menu :defaultSelectedKeys="['0']" @select="changeEduType" style="width: 180px" mode="inline">
        <a-menu-item :draggable="false" v-for="(item, idx) in eduTypeList" :key="idx">
          <span>{{ item.name }}</span>
        </a-menu-item>
      </a-menu>
    </div>
    <div class="salary-type">
      <a-table :dataSource="salaryTypeList" :columns="salaryTypeColumns" :rowKey="(record, index) => index" :pagination="false">
        <div slot="name" slot-scope="text, record">
          <template v-if="record.input">
            <a-input class="add-ipt" v-model="newSalaryName" />
          </template>
          <template v-else>{{ record.name }}</template>
        </div>
        <div slot="duration" slot-scope="text, record">
          <template v-if="record.input">
            <a-input-number :min="0" :max="999999999" class="add-ipt" v-model="duration" />
          </template>
          <template v-else>{{ record.duration }}</template>
        </div>
        <div slot="classTypeId" slot-scope="text, record">
          <template v-if="record.input">
            <a-select
              class="add-ipt"
              v-model="classTypeId"
              :allowClear="true"
              :dropdownMatchSelectWidth="false"
              @change="changeClassTypeName"
              style="min-width: 100px;"
            >
              <a-select-option v-for="(item, index) in classTypeList" :value="item.id" :key="index">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </template>
          <template v-else>{{ record.classTypeName }}</template>
        </div>
        <div slot="timesCount" slot-scope="text, record">
          <template v-if="record.input">
            <a-input-number :min="0" :max="999999999" class="add-ipt" v-model="timesCount" />
          </template>
          <template v-else>{{ record.timesCount }}</template>
        </div>
        <div slot="amountSection" slot-scope="text, record">
          <div v-if="record.input" class="flex-column">
            <div class="flex-column-item" v-for="(item, index) in amountSection" :key="index">
              <a-input-number :min="0" :max="999999999" style="width: 40%" v-model="item.amountStart" />
              -
              <a-input-number :min="0" :max="999999999" style="width: 40%" v-model="item.amountEnd" />
              <a-icon type="minus-circle" style="padding: 0 5px;" v-if="amountSection.length > 1" @click="removeAmountSection(index)" />
            </div>
            <a-button icon="plus-circle" class="add-btn" @click="addAmountSection">添加</a-button>
          </div>
          <div v-else class="flex-column">
            <div class="flex-column-item" v-for="(item, index) in record._salTypeAmountRange" :key="index">
              {{ item.amountSection }}
            </div>
          </div>
        </div>
        <div slot="area" slot-scope="text, record">
          <div v-if="record.input" class="flex-column">
            <div class="flex-column-item" v-for="(item, index) in amountSection" :key="index">
              <a-select
                class="add-ipt"
                v-model="item.area"
                mode="multiple"
                :allowClear="true"
                :dropdownMatchSelectWidth="false"
                @change="changeArea"
                style="width: calc(100% - 24px);"
              >
                <a-select-option v-for="(option, optionIndex) in areaList" :value="option.id" :key="optionIndex" :disabled="optionDisabled(index, option.id)">
                  {{ option.deptName }}
                </a-select-option>
              </a-select>
              <a-icon type="minus-circle" style="padding: 0 5px;" v-if="amountSection.length > 1" @click="removeAmountSection(index)" />
            </div>
            <a-button icon="plus-circle" class="add-btn" @click="addAmountSection">添加</a-button>
          </div>
          <div v-else class="flex-column">
            <div class="flex-column-item ellipsis" v-for="(item, index) in record._salTypeAmountRange" :key="index">
              {{ item.areaName ? item.areaName.join(',') : '' }}
            </div>
          </div>
        </div>
        <div slot="isDisable" slot-scope="text, record">
          <template v-if="record.input">
            <a-switch :checked="!record.isDisable" @change="changeDisable($event, record)">
              <span slot="checkedChildren">开启</span>
              <span slot="unCheckedChildren">禁用</span>
            </a-switch>
          </template>
          <template v-else>{{ record.isDisable ? '禁用' : '开启' }}</template>
        </div>
        <div slot="order" slot-scope="text, record">
          <template v-if="record.input">
            <a-input-number :min="0" :max="999999999" class="add-ipt" v-model="newSalaryOrder" />
          </template>
          <template v-else>{{ record.order }}</template>
        </div>
        <div slot="action" slot-scope="text, record, index">
          <template v-if="record.input">
            <a-icon type="check" style="padding: 0 5px;" @click="checkSalaryName" v-if="showSave" />
            <a-icon type="close" style="padding: 0 5px;" @click="cancelSalaryName" />
          </template>
          <template v-else>
            <perm-box perm="salary:template:save">
              <a-icon type="edit" style="padding: 0 5px;" @click="editSalaryName(record, index)" />
            </perm-box>
            <perm-box perm="salary:template:del">
              <a-icon type="delete" style="padding: 0 5px;" @click="removeSalaryName(record)" />
            </perm-box>
          </template>
        </div>
      </a-table>
      <perm-box perm="salary:template:save">
        <a-button icon="plus-circle" class="add-btn" @click="addSalaryType" :disabled="isAddType">添加</a-button>
      </perm-box>
    </div>
  </div>
</template>

<script>
import { isEmpty } from '@/utils/util'
import { treeEduClassType, scopeListArea } from '@/api/common'
import { listSalEduType, listSalType, saveSalType, removeSalType } from '@/api/education'
import PermBox from '@/components/PermBox'

const salaryTypeColumns = [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    scopedSlots: { customRender: 'name' }
  },
  {
    title: '时长',
    dataIndex: 'duration',
    key: 'duration',
    scopedSlots: { customRender: 'duration' },
    width: 80
  },
  {
    title: '班型',
    dataIndex: 'classTypeId',
    key: 'classTypeId',
    scopedSlots: { customRender: 'classTypeId' }
  },
  {
    title: '计次',
    dataIndex: 'timesCount',
    key: 'timesCount',
    scopedSlots: { customRender: 'timesCount' },
    width: 80
  },
  {
    title: '金额区间',
    dataIndex: '_salTypeAmountRange',
    key: 'amountSection',
    scopedSlots: { customRender: 'amountSection' }
  },
  {
    title: '地区',
    dataIndex: '_salTypeAmountRange',
    key: 'area',
    scopedSlots: { customRender: 'area' },
    ellipsis: true
  },
  {
    title: '状态',
    dataIndex: 'isDisable',
    key: 'isDisable',
    scopedSlots: { customRender: 'isDisable' },
    width: 80
  },
  {
    title: '排序',
    dataIndex: 'order',
    key: 'order',
    scopedSlots: { customRender: 'order' },
    width: 80
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    scopedSlots: { customRender: 'action' },
    width: 80
  }
]

export default {
  name: 'SalaryType',
  components: {
    PermBox
  },
  data() {
    return {
      salaryTypeColumns,
      classTypeTree: [],
      eduTypeList: [],
      salaryTypeList: [],
      areaList: [],
      isAddType: false,

      newSalaryName: null,
      newSalaryOrder: null,
      duration: null,
      classTypeId: undefined,
      classTypeName: undefined,
      timesCount: null,
      amountSection: [{
        amountStart: undefined,
        amountEnd: undefined,
        area: undefined,
      }],
      isDisable: false,

      selectedId: null,
      editSalaryId: null,
      childrenHeight: 'auto',
      //
      draging: null,
      target: null
    }
  },
  computed: {
    classTypeList() {
      return this.classTypeTree.find(item => item.id === this.selectedId)?.children || []
    },
    showSave() {
      return !isEmpty(this.newSalaryName) && !isEmpty(this.duration) && !isEmpty(this.timesCount) && this.amountSection.length > 0
    }
  },
  watch: {
    isAddType(nv, ov) {
      nv ? '' : this.initAdd()
    }
  },
  created() {
    // this.getEduTypeList()
    this.getClassTypeTree()
  },
  mounted() {
    this.initList()
    document.body.ondrop = function(event) {
      event.preventDefault()
      event.stopPropagation()
    }
  },
  methods: {
    initList() {
      this.getEduTypeList().then(() => {
        const CLIENT_HEIGHT = this.$refs.eduType.clientHeight
        const height = CLIENT_HEIGHT == 0 || !CLIENT_HEIGHT ? 'auto' : ~~CLIENT_HEIGHT + 10
        this.childrenHeight = `${height}px`
        this.getSalTypeList()
        this.getAreaList()
      })
    },
    getEduTypeList() {
      return listSalEduType().then(res => {
        this.eduTypeList = res.data
        this.selectedId = res.data[0].id
        this.childrenHeight = this.$refs.eduType.clientHeight
      })
    },
    getSalTypeList() {
      listSalType({ eduTypeId: this.selectedId, showDisable: true }).then(res => {
        if (res.code == 200 && res.data) {
          this.salaryTypeList = res.data.map(data => {
            let _salTypeAmountRange = []
            data.salTypeAmountRange.forEach(item => {
              const { amountSection, deptId, deptName } = item
              let index = _salTypeAmountRange.findIndex(d => d.amountSection === amountSection)
              if (index > -1) {
                _salTypeAmountRange[index].area.push(deptId)
                _salTypeAmountRange[index].areaName.push(deptName)
              } else {
                _salTypeAmountRange.push({
                  amountSection,
                  amountStart: Number(amountSection.split('-')[0]),
                  amountEnd: Number(amountSection.split('-')[1]),
                  area: [deptId],
                  areaName: [deptName],
                })
              }
            })
            return Object.assign({ _salTypeAmountRange, input: false }, data)
          })
        } else {
          this.salaryTypeList = []
        }
        console.log(this.salaryTypeList)
      })
    },
    getClassTypeTree() {
      treeEduClassType().then(res => {
        this.classTypeTree = res.data || []
      })
    },
    getAreaList() {
      scopeListArea().then(res => {
        this.areaList = res.data || []
      })
    },
    changeClassTypeName(value, option) {
      this.classTypeName = value ? this.classTypeList[option.key]?.name : undefined
    },
    changeArea(value, option) {
      // this.classTypeName = value ? this.classTypeList[option.key]?.name : undefined
    },
    changeEduType({ item, key, selectedKeys }) {
      this.selectedId = this.eduTypeList[key].id
      this.getSalTypeList()
      this.initAdd()
    },
    initAdd() {
      this.newSalaryName = ''
      this.newSalaryOrder = 0
      this.duration = null
      this.classTypeId = undefined
      this.timesCount = null
      this.amountSection = [{
        amountStart: undefined,
        amountEnd: undefined,
        area: undefined,
      }]
      this.isDisable = false
      this.editSalaryId = null
      this.isAddType = false
      this.getSalTypeList()
    },
    addSalaryType() {
      this.isAddType = true
      this.salaryTypeList = [...this.salaryTypeList, { input: true }]
    },
    editSalaryName(data, idx) {
      this.clearInput()
      data.input = true
      this.newSalaryName = data.name
      this.newSalaryOrder = data.order
      this.duration = data.duration
      this.classTypeId = data.classTypeId
      this.classTypeName = data.classTypeName
      this.timesCount = data.timesCount
      this.amountSection = data._salTypeAmountRange && data._salTypeAmountRange.length > 0 ? data._salTypeAmountRange : [{ amountStart: undefined, amountEnd: undefined, area: undefined }]
      this.isDisable = data.isDisable
      this.editSalaryId = data.id
      this.isAddType = true
      this.salaryTypeList = [...this.salaryTypeList]
    },
    clearInput() {
      this.salaryTypeList.map((item, idx) => {
        !item.id ? this.salaryTypeList.splice(idx, 1) : item.input ? (item.input = false) : ''
      })
    },
    cancelSalaryName() {
      this.clearInput()
      this.isAddType = false
    },
    checkSalaryName() {
      const {
        newSalaryOrder,
        newSalaryName,
        duration,
        classTypeId,
        classTypeName,
        timesCount,
        amountSection,
        isDisable,
        selectedId,
        initAdd,
        editSalaryId,
        $notification
      } = this

      for (let i = 0; i < amountSection.length; i++) {
        let data = amountSection[i]
        if (isEmpty(data.amountStart) || isEmpty(data.amountEnd) || !data.area) {
          return $notification['error']({
            message: '系统通知',
            description: '请输入金额区间和地区'
          })
        }
        if (data.amountStart > data.amountEnd) {
          return $notification['error']({
            message: '系统通知',
            description: '金额区间最小值不能大于最大值'
          })
        }
      }
      let json = amountSection.map(data => ({
        amountSection: `${data.amountStart}-${data.amountEnd}`,
        orgDeptId: data.area.join(',')
      }))

      let data = {
        name: newSalaryName,
        id: editSalaryId,
        eduTypeId: selectedId,
        order: newSalaryOrder,
        duration,
        classTypeId,
        classTypeName,
        timesCount,
        json: JSON.stringify(json),
        isDisable
      }
      saveSalType(data).then(res => {
        if (res.code == 200) {
          $notification['success']({
            message: '系统通知',
            description: '操作成功'
          })
          initAdd()
          this.$emit('saved')
        }
      })
    },
    removeSalaryName(data) {
      const { id } = data
      const _this = this
      this.$confirm({
        title: '系统提示',
        content: '确认删除该条数据吗?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          removeSalType(id).then(res => {
            _this.$notification['success']({
              message: '系统通知',
              description: '操作成功'
            })
            _this.getSalTypeList()
            _this.$emit('saved')
          })
        }
      })
    },
    onDragStart(event) {
      // console.log(event.target)
      this.draging = event.target
    },
    onDragOver(event) {
      this.target = event.target
      let targetTop = event.target.getBoundingClientRect().top
      let dragingTop = this.draging.getBoundingClientRect().top
      // console.log(targetTop)
      if (this.target.nodeName === 'LI' && this.target !== this.draging) {
        if (this.target) {
          if (this.target.animated) {
            return
          }
        }
        if (this._index(this.draging) - this._index(this.target) < 0) {
          this.target.parentNode.insertBefore(this.draging, this.target.nextSibling)
        } else {
          this.target.parentNode.insertBefore(this.draging, this.target)
        }
        this._anim(targetTop, this.target)
        this._anim(dragingTop, this.draging)
      }
    },
    addAmountSection() {
      this.amountSection.push({
        amountStart: undefined,
        amountEnd: undefined,
        area: undefined,
      })
    },
    removeAmountSection(index) {
      this.amountSection.splice(index, 1)
    },
    optionDisabled(index, optionId) {
      return this.amountSection.findIndex((d, i) => index != i && d.area ? d.area.includes(optionId) : false) > -1
    },

    onDragEnd(event) {},
    _anim(startPos, dom) {
      let offset = startPos - dom.getBoundingClientRect().top
      dom.style.transition = 'none'
      dom.style.transform = `translateY(${offset}px)`

      //触发重绘
      dom.offsetWidth
      dom.style.transition = 'transform .3s'
      dom.style.transform = ``
      clearTimeout(dom.animated)

      dom.animated = setTimeout(() => {
        dom.style.transition = ''
        dom.style.transform = ``
        dom.animated = false
      }, 300)
    },
    _index(el) {
      let domData = Array.from(this.$refs.eduType.childNodes)
      return domData.findIndex(i => i.innerText == el.innerText)
    },
    changeDisable(checked, data) {
      data.isDisable = !data.isDisable
      this.isDisable = data.isDisable
    }
  }
}
</script>

<style scoped type="text/less" lang="less">
  @import '~@/assets/style/index';
  .salary-type-wrapper {
    display: flex;
    flex-flow: row nowrap;

    .salary-type {
      width: calc(100% - 180px);
      margin-left: 15px;
      padding-bottom: 10px;

      .add-ipt {
        width: 100%;
      }

      .add-btn {
        width: 100%;
        border: 1px dashed #dddddd;
        margin-top: 5px;
        margin-bottom: 15px;
      }
    }

    .salary-type-menu-item {
      height: 40px;
      line-height: 40px;
      padding: 0 16px;
      padding-left: 24px;
      margin-bottom: 8px;
      margin-top: 4px;

      .icon-item {
        float: right;

        > i {
          margin: 0 5px;
          cursor: pointer;

          &:hover {
            color: #1890ff;
          }
        }
      }

      .add-ipt {
        width: 200px;
      }
    }

    .flex-column {
      display: flex;
      flex-direction: column;
      margin: -6px 0;

      .flex-column-item {
        margin: 6px 0;
      }

      .add-btn {
        width: calc(100% - 24px);
        margin: 6px 0;
      }
    }
  }
</style>
