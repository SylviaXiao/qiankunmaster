<template>
  <div>
    <a-card>
      <a-tabs v-model="activeKey">
        <a-tab-pane :key="0" tab="少儿班级绩点配置">
          <childrenGradePoint />
        </a-tab-pane>
        <a-tab-pane :key="1" tab="私教参考值配置">
          <perm-box perm="education:children:prireference:view">
            <childrenReference />
          </perm-box>
        </a-tab-pane>
        <a-tab-pane :key="2" tab="少儿绩效成果评估评分项">
          <perm-box perm="education:children:score:view">
            <childrenScore />
          </perm-box>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script>
import PermBox from '@/components/PermBox'
import childrenGradePoint from './modules/childrenGradePoint.vue'
import childrenReference from './modules/childrenReference.vue'
import childrenScore from './modules/childrenScore.vue'
export default {
  components: {
    PermBox,
    childrenGradePoint,
    childrenReference,
    childrenScore
  },
  data() {
    return {
      activeKey: 0
    }
  },
  methods: {

  }
}
</script>

<style lang="less"></style>
