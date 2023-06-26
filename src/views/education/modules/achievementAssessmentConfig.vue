<template>
  <div>
    <a-card :bordered="false" class="mb20">
      <template slot="title">
        成果考核内容设置
      </template>
      <span slot="extra">
        <perm-box perm="education:achieveitem:save">
          <a-button type="primary" @click="openModal()">新增</a-button>
        </perm-box>
      </span>
      <a-table
        :columns="columns"
        :dataSource='dataSource'
        :loading='loading'
        :pagination='false'
        :rowClassName="rowClassName"
        rowKey="id"
      >
        <span slot="action" slot-scope="text, record">
          <perm-box perm="education:achieveitem:save">
            <a href="javascript:;" @click="openModal(record)">编辑</a>
          </perm-box>
          <perm-box perm="education:achieveitem:del">
            <a href="javascript:;" @click="handleRemove(record)">删除</a>
          </perm-box>
        </span>
      </a-table>
    </a-card>

    <a-card :bordered="false" style="padding-bottom: 100px">
      <template slot="title">
        评分总分配置
      </template>
      <span slot="extra">
        <perm-box perm="education:achieveitem:save">
          <a-button type="primary" @click="saveTotalScore">保存</a-button>
        </perm-box>
      </span>
      <div>
        <a-form layout="inline" :form="totalScoreForm">
          <a-form-item label="总分">
            <a-input-number v-decorator="['fullMarks', {rules: [{ required: true, message: '请输入总分' }]}]"/>
            分
          </a-form-item>
        </a-form>
      </div>
    </a-card>

    <!-- 新增评分项 -->
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :width="600"
      title="新增评分项"
      :visible="visible"
      :confirmLoading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form :form="scoreItemForm">
        <a-form-item label="评分项" :labelCol="{span:4}" :wrapperCol="{span:18}">
          <a-input placeholder='请输入评分项名称'
                   v-decorator="['item', {rules: [{ required: true, message: '请输入评分项名称' }]}]"/>
        </a-form-item>
        <a-form-item label="是否必填" :labelCol="{span:4}" :wrapperCol="{span:18}">
          <a-select
            v-decorator="[
          'isRequired',
          { rules: [{ required: true, message: '请输入是否必填' }] },
        ]"
            placeholder="请输入是否必填"
          >
            <a-select-option value="Y">
              必填
            </a-select-option>
            <a-select-option value="N">
              非必填
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
  import PermBox from '@/components/PermBox'
  import { listEduAchieveItem, saveEduAchieveItem, removeEduAchieveItem, listEduConfig, saveEduConfig } from '@/api/system'

  const columns = [
    {
      title: '评分项',
      key: 'item',
      dataIndex: 'item',
      scopedSlots: { customRender: 'item' }
    },
    {
      title: '是否必填',
      key: 'isRequired',
      dataIndex: 'isRequired',
      customRender: (text, record, index) => {
       return text==='Y'?'必填':text==='N'?'非必填':''
      },
    },
    {
      title: '操作',
      key: 'action',
      dataIndex: 'action',
      width: '150px',
      scopedSlots: { customRender: 'action' }
    }
  ]

  export default {
    data() {
      return {
        /* 成果考核内容设置 */
        columns,
        loading: false,
        dataSource: [],
        visible: false,
        confirmLoading: false,
        curRecord: null,

        /* 评分总分配置 */
        totalScoreId: null
      }
    },
    components: {
      PermBox
    },
    beforeCreate() {
      this.scoreItemForm = this.$form.createForm(this)
      this.totalScoreForm = this.$form.createForm(this)
    },
    created() {
      this.initScoreItem()
      this.initTotalScore()
    },
    methods: {
      rowClassName(record, index) {
        if (index % 2 === 1) return 'ant-table-even'
      },

      /* 成果考核内容设置 */
      initScoreItem() {
        this.loading = true
        listEduAchieveItem().then(res => {
          this.loading = false
          this.dataSource = res.data || []
        })
      },
      openModal(record) {
        this.visible = true
        if (record) {
          this.curRecord = record
          this.$nextTick(() => {
            const { item ,isRequired} = record
            this.scoreItemForm.setFieldsValue({ item,isRequired })
          })
        }else{
          this.$nextTick(() => {
            this.scoreItemForm.setFieldsValue({ isRequired:'Y' })
          })

        }
      },
      handleCancel() {
        this.visible = false
      },
      handleOk() {
        this.scoreItemForm.validateFields((validate, values) => {
          if (!validate) {
            const data = this.scoreItemForm.getFieldsValue()
            const { id } = this.curRecord
            this.confirmLoading = true
            saveEduAchieveItem(Object.assign({ id }, data)).then(res => {
              if (res.code === 200) {
                this.initScoreItem()
                this.handleCancel()
                this.$notification['success']({
                  message: '系统通知',
                  description: '操作成功'
                })
              } else {
                this.$notification['error']({
                  message: '系统通知',
                  description: res.msg
                })
              }
            }).finally(this.confirmLoading = false)
          }
        })
      },
      handleRemove(record) {
        this.$confirm({
          title: '系统提示',
          content: '确认删除该条数据吗?',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            removeEduAchieveItem(record.id)
              .then(res => {
                if (res.code === 200) {
                  this.initScoreItem()
                  this.$notification['success']({
                    message: '系统通知',
                    description: '删除成功'
                  })
                } else {
                  this.$notification['error']({
                    message: '系统通知',
                    description: res.msg
                  })
                }
              })
          }
        })
      },

      /* 评分总分配置 */
      initTotalScore() {
        listEduConfig().then(res => {
          const [{ id, fullMarks }] = res.data || [{}]
          this.totalScoreId = id
          this.totalScoreForm.setFieldsValue({ fullMarks })
        })
      },
      saveTotalScore() {
        this.totalScoreForm.validateFields((validate, values) => {
          if (!validate) {
            const data = this.totalScoreForm.getFieldsValue()
            saveEduConfig(Object.assign({ id: this.totalScoreId }, data)).then(res => {
              if (res.code === 200) {
                this.initTotalScore()
                this.$notification['success']({
                  message: '系统通知',
                  description: '保存成功'
                })
              } else {
                this.$notification['error']({
                  message: '系统通知',
                  description: res.msg
                })
              }
            })
          }
        })
      }

    }
  }
</script>

<style lang="less" scoped type="text/less">
  @import '~@/assets/style/index';
</style>
