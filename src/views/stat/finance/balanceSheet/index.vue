<template>
  <div>
    <a-tabs defaultActiveKey="1">
      <a-tab-pane tab="地区/分馆负债表" key="1">
        <branch />
      </a-tab-pane>
      <a-tab-pane tab="舞种/班型负债表" key="2" forceRender>
        <danceType />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import branch from './components/branch.vue'
import danceType from './components/danceType.vue'
export default {
  name: 'balanceSheet',
  components: {
    branch,
    danceType
  },
  data() {
    return {}
  },
  computed: {},
  methods: {}
}
</script>

<style lang="less" scoped></style>
