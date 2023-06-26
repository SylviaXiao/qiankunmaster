<template>
  <div class="homecard-wrapper">
    <a-card :loading="cardLoading" :bordered="false" :body-style="{ padding: '20px 24px 8px' }" class="homecard-container">
      <div class="meta">
        <span class="chart-card-title">
          <slot name="title">
            {{ title }}
            <template v-if="tips">
              <a-tooltip>
                <template slot="title">
                  {{ tips }}
                </template>
                <a-icon type="exclamation-circle" style="margin-left: 5px;" />
              </a-tooltip>
            </template>
          </slot>
        </span>
      </div>
      <template v-if="type === 'number'">
        <div class="total">
          <slot name="total">
            <span>{{ cardValue }}</span>
          </slot>
        </div>
      </template>
      <template v-if="type === 'link'">
        <div class="link">
          <slot name="link">
            <router-link :to="{ name: routerName, query: params }">
              <span class="link-entry">{{ `快捷进入` }}</span>
              <a-icon type="arrow-right" />
            </router-link>
          </slot>
        </div>
      </template>
      <template v-if="type === 'bar' || type === 'line'">
        <f-charts :type="type" :data="chartsValue" :format="format" :tooltip="tooltip"></f-charts>
      </template>
    </a-card>
  </div>
</template>

<script>
import FCharts from '@/components/FCharts/FCharts'
export default {
  name: 'Homecard.vue',
  components: {
    FCharts
  },
  props: {
    title: { type: String, default: 'ERP系统' },
    tips: { type: String, default: null },
    type: { type: String, default: 'number' },
    tooltip: { type: String, default: null },
    methods: { type: Function, default: () => {} },
    params: { type: Object, default: () => {} },
    format: { type: Object, default: () => {} },
    routerName: { type: String, default: 'index' }
  },
  data() {
    return {
      // card的loading
      cardLoading: false,
      //number 展示的 数字
      cardValue: 0,
      chartsValue: []
    }
  },
  mounted() {
    this.initHomecard()
  },
  methods: {
    initHomecard() {
      const { type } = this
      if (type === 'number') {
        this.getCardValue()
      }
      if (type === 'bar' || type === 'line') {
        this.getChartsValue()
      }
    },
    getCardValue() {
      const { methods, params } = this
      this.cardLoading = true
      methods(params)
        .then(res => {
          this.cardValue = res.data
        })
        .finally(() => (this.cardLoading = false))
    },
    getChartsValue() {
      const { methods, params } = this
      this.cardLoading = true
      methods(params)
        .then(res => {
          this.chartsValue = res.data
        })
        .finally(() => (this.cardLoading = false))
    }
  }
}
</script>

<style lang="less" scoped>
.homecard-wrapper {
  margin-top: 15px;
  .chart-card-header {
    position: relative;
    overflow: hidden;
    width: 100%;
    padding: 10px 0;

    .meta {
      position: relative;
      overflow: hidden;
      width: 100%;
      color: rgba(0, 0, 0, 0.45);
      font-size: 14px;
      line-height: 22px;
    }
  }
  .total {
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    white-space: nowrap;
    color: #000;
    margin-top: 4px;
    margin-bottom: 0;
    font-size: 30px;
    line-height: 38px;
    height: 38px;
  }
  .link {
    height: 38px;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    .link-entry {
      margin: 0 5px;
    }
  }
}
</style>
