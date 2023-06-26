<template>
  <div>
    <a-card :bordered="false" style="padding-bottom: 100px">
      <template slot="title">
        课耗奖金设置
        <span class="tip ml20">规则：奖金金额=总上课节数*基础奖金金额</span>
      </template>
      <div class="mb20" v-for="(item, index) in bonusConfig" :key="index">
        上课节数
        <a-input-number v-if="item._isEdit" v-model="item.startSections" :min="0"/>
        <span v-if="!item._isEdit">{{item.startSections}}</span>
        节
        —
        <a-input-number v-if="item._isEdit" v-model="item.endSections" :min="0"/>
        <span v-if="!item._isEdit">{{item.endSections}}</span>
        节
        （不包含{{item.endSections || '*'}}节）
        基础奖金值
        <a-input-number v-if="item._isEdit" v-model="item.bonusPrice" :min="0"/>
        <span v-if="!item._isEdit">{{item.bonusPrice}}</span>
        元

        <!--<span class="ml30" v-if="item._isEdit">
          <a href="javascript:;" @click="saveBonusConfig(item, index)">保存</a>
        </span>
        <span class="ml20" v-if="item.id">
          <a href="javascript:;" @click="editBonusConfig(item, index)">{{item._isEdit ? '取消' : '编辑'}}</a>
        </span>
        <span class="ml20">
          <a href="javascript:;" @click="removeBonusConfig(item, index)">删除</a>
        </span>-->
        <perm-box perm="education:item:save" v-if="item._isEdit">
          <a href="javascript:;" @click="saveBonusConfig(item, index)">保存</a>
        </perm-box>
        <perm-box perm="education:item:save" v-if="item.id">
          <a href="javascript:;" @click="editBonusConfig(item, index)">{{item._isEdit ? '取消' : '编辑'}}</a>
        </perm-box>
        <perm-box perm="education:item:del">
          <a href="javascript:;" @click="removeBonusConfig(item, index)">删除</a>
        </perm-box>
      </div>
      <perm-box perm="education:item:save" class="mb20">
        <a href="javascript:;" @click="addBonusConfig">+添加</a>
      </perm-box>
    </a-card>

    <!--<div class="button-group">
      <perm-box perm="testperm">
        <a-button type="primary">保存</a-button>
      </perm-box>
      <span class="ml20" style="font-size: 16px">点击保存后再生成的绩效评分表均根据新的规则生成绩效奖金，请谨慎修改</span>
    </div>-->
  </div>
</template>

<script>
  import PermBox from '@/components/PermBox'
  import {listEduBonusItem, removeEduBonusItem, saveEduBonusItem} from '@/api/system'

  export default {
    props: {
      text: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        bonusConfig: [],
        appraisalMaxScore: undefined,
      }
    },
    components: {
      PermBox
    },
    created() {
      this.initData()
    },
    methods: {
      // 查询课耗奖金设置
      initData() {
        listEduBonusItem().then(res => {
          this.bonusConfig = res.data || []
          this.bonusConfig.sort((a, b) => a.startSections <= b.startSections ? -1 : 1)
          this.bonusConfig = this.bonusConfig.map(item => Object.assign({_isEdit: false}, item))
        })
      },
      // 添加课耗奖金设置
      addBonusConfig() {
        this.bonusConfig.push({ startSections: undefined, endSections: undefined, bonusPrice: undefined, _isEdit: true })
      },
      // 删除课耗奖金设置
      removeBonusConfig(item, index) {
        if (item.id) {
          this.$confirm({
            title: '系统提示',
            content: '确定要删除吗?',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
              removeEduBonusItem(item.id).then(res => {
                if (res.code === 200) {
                  this.$notification['success']({
                    message: '系统通知',
                    description: '操作成功'
                  })
                  this.bonusConfig.splice(index, 1)
                } else {
                  this.$notification['error']({
                    message: '系统通知',
                    description: res.msg
                  })
                }
              })
            }
          })
        } else {
          this.bonusConfig.splice(index, 1)
        }
      },
      // 保存课耗奖金设置
      saveBonusConfig(item, index) {
        if ((!item.startSections && item.startSections !== 0) || (!item.endSections && item.endSections !== 0)) {
          return this.$notification['error']({
            message: '系统通知',
            description: '请输入上课节数'
          })
        }
        if (!item.bonusPrice && item.bonusPrice !== 0) {
          return this.$notification['error']({
            message: '系统通知',
            description: '请输入基础奖金值'
          })
        }

        saveEduBonusItem(item).then(res => {
          if (res.code === 200) {
            this.$notification['success']({
              message: '系统通知',
              description: '操作成功'
            })
            this.$set(this.bonusConfig, index, Object.assign({_isEdit: false}, res.data))
          } else {
            this.$notification['error']({
              message: '系统通知',
              description: res.msg
            })
          }
        })
      },
      editBonusConfig(item, index) {
        item._isEdit = !item._isEdit
        if (!item.id) {
          this.bonusConfig.splice(index, 1)
        }
      }
    }
  }
</script>

<style lang="less" scoped type="text/less">
  @import '~@/assets/style/index';

  .tip {
    font-size: 12px;
    color: red;
  }

  .button-group {
    position: fixed;
    bottom: 40px;
    left: calc(265px + 20px);
    background: #fff;
    width: calc(100% - 265px - 40px);
    box-sizing: border-box;
    padding: 10px 18px;
    box-shadow: 0px -1px 6px #ddd;
    z-index: 9;
  }
</style>
