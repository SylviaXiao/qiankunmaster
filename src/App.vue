<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <router-view v-if="isReload" />
      <!--      <a href="#" @click="reload()">shuaxin</a>-->
    </div>
  </a-config-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import { AppDeviceEnquire } from '@/utils/mixin'

export default {
  mixins: [AppDeviceEnquire],
  data() {
    return {
      locale: zhCN,
      isReload: true
    }
  },
  watch: {
    school_id(nv, ov) {
      this.comReload()
    }
  },
  computed: {
    school_id() {
      return this.$store.getters.school_id
    }
  },
  created() {},
  methods: {
    comReload() {
      this.isReload = false
      this.$nextTick(() => (this.isReload = true))
    }
  },
  mounted() {}
}
</script>
<style lang="less">
#app {
  height: 100%;
}

.sign-modal {
  .ant-modal-body {
    padding: 10px;
  }
}

.todayPlan-wrapper {
  .ant-tabs .ant-tabs-left-bar {
    /// border-right: 1px solid #1890ff;
    border: 0;
  }

  .ant-tabs-nav .ant-tabs-tab-active {
    /*background-color: #dddddd;*/
    // border-bottom: 1.5px solid #1890ff;
    // border-radius: 5px;
  }

  .ant-tabs .ant-tabs-left-content {
    padding-left: 10px;
    padding-bottom: 10px;
    border: 0;
    // border: 1px solid #1890ff;
  }
}

.upload-stu {
  .ant-spin-nested-loading > div > .ant-spin {
    background-color: #dddddd;
    max-height: 500px;
  }
}

.avatar-uploader {
  .ant-upload.ant-upload-select {
    width: 100%;
    height: 100%;
    display: block;

    .ant-upload-btn {
      height: 500px;
      padding-top: 160px;
      border: 1px dashed #222222;
    }
  }
}

.page {
  margin-top: 20px !important;
  float: right;
}

.ant-pagination-total-text {
  position: absolute;
  left: 10px;
}
@media screen and (max-width: 1200px) {
  .ant-pagination-total-text {
    position: static;
  }
}
.ant-card-body {
  padding: 10px 18px !important;
}

.ant-fullcalendar-fullscreen .ant-fullcalendar-month,
.ant-fullcalendar-fullscreen .ant-fullcalendar-date {
  height: 180px !important;
}

.ant-fullcalendar-fullscreen .ant-fullcalendar-content {
  height: 150px !important;
}

.ant-table-row .ant-table-row-level-0 .conflict-table {
  color: red !important;
}

.layout.ant-layout.mobile .ant-table-wrapper .ant-table-body,
.layout.ant-layout.tablet .ant-table-wrapper .ant-table-body {
  min-width: 0 !important;
}

.ant-table-body {
  overflow-y: auto !important;
}

.ant-table-tbody > tr.conflict-table {
  color: red !important;
}

.ant-table-tbody > tr.overdue-table {
  color: #fc6 !important;
}

.ant-select-disabled .ant-select-selection {
  color: #000;
}

.show-disabled input[disabled] {
  color: #888;
}

.ant-select-auto-complete.ant-select .ant-input[disabled] {
  color: #000 !important;
  cursor: pointer !important;
}

.stuApplyTable {
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td {
    /* &:nth-of-type(1) {
        min-width: 200px;
      }

      &:nth-of-type(2) {
        min-width: 200px;
      }

      &:nth-of-type(3) {
        min-width: 80px;
      }

      &:nth-of-type(4) {
        min-width: 80px;
      }

      &:nth-of-type(5) {
        min-width: 120px;
      }

      &:nth-of-type(6) {
        min-width: 120px;
      }

      &:nth-of-type(7) {
        min-width: 120px;
      }

      &:nth-of-type(8) {
        min-width: 120px;
      }

      &:nth-of-type(9) {
        min-width: 80px;
      } */
  }
}

.disabled-select {
  .ant-select-selection {
    border-radius: 4px 0 0 4px;
  }
}

.no-border-input {
  input {
    border: 0 !important;
  }
}

.search-input-wrapper {
  .ant-select-auto-complete.ant-select .ant-input[disabled] {
    color: #000;
  }
}

.show-disabled .ant-input-group-addon {
  cursor: pointer;
}

.ant-cascader-menu {
  height: auto !important;
  max-height: 180px;
}

.table-signin {
  .ant-table-fixed-header .ant-table-scroll .ant-table-header {
    overflow: auto;
    min-height: 70px;
  }
}

.ant-menu-sub.ant-menu-inline > .ant-menu-item,
.ant-menu-sub.ant-menu-inline > .ant-menu-submenu > .ant-menu-submenu-title {
  height: 36px;
  line-height: 36px;
}

.ant-pro-multi-tab {
  margin-bottom: 20px;
}

.ant-table-tbody > tr.is-give {
  background-color: #f2f2f2 !important;
}

.has-title .ant-card-head-title {
  padding: 0;
  line-height: 50px;
}

.saslary-table {
  th {
    min-width: 200px !important;
    width: 200px !important;
    max-width: 200px !important;
  }
}

.ant-table td {
  white-space: nowrap;
}

.stuinfo-modal {
  .ant-modal-body {
    background-color: #e8e8e8;
  }
}

.ant-table-tbody > tr > td,
.ant-table-thead > tr > th {
  padding: 12px 5px !important;
  /*border: 1px solid #e8e8e8;*/
}

.general-choice-input {
  .ant-input-disabled {
    cursor: default;
  }
}
</style>
