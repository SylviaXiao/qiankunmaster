<template>
  <div v-if="classInfo" class="master-class-info-base">
    <a-row type="flex" justify="start" align="top">
      <a-col :span="16">
        <a-row>
          <a-col :lg="12" :md="12" :sm="24">
            <div class="class-info">
              <span class="info-item-label">班级名称 :</span>
              <span class="info-item-content">{{classInfo.className}}</span>
            </div>
          </a-col>
        </a-row>
        <a-row>
          <a-col :lg="12" :md="12" :sm="24">
            <div class="class-info">
              <span class="info-item-label">上课时间 :</span>
              <span class="info-item-content">
                <span>{{classInfo.startDate}}</span>

                <span v-if="classInfo.endDate"> 至 </span>
                <span v-if="classInfo.endDate">{{classInfo.endDate}}</span>
              </span>
            </div>
          </a-col>
          <a-col :lg="12" :md="12" :sm="24">
            <div class="class-info">
              <span class="info-item-label">上课地点 :</span>
              <span class="info-item-content">{{classInfo.address}}</span>
            </div>
          </a-col>
        </a-row>
        <a-row>
          <a-col :lg="12" :md="12" :sm="24">
            <div class="class-info">
              <span class="info-item-label">导师姓名 :</span>
              <span class="info-item-content">{{classInfo.bigMasterName}}</span>
            </div>
          </a-col>
          <a-col :lg="12" :md="12" :sm="24">
            <div class="class-info">
              <span class="info-item-label">舞种 :</span>
              <span class="info-item-content">{{classInfo.name}}</span>
            </div>
          </a-col>
        </a-row>
        <a-row>
          <a-col :lg="12" :md="12" :sm="24">
            <div class="class-info">
              <span class="info-item-label">联系人姓名 :</span>
              <span class="info-item-content">{{classInfo.contact}}</span>
            </div>
          </a-col>
          <a-col :lg="12" :md="12" :sm="24">
            <div class="class-info">
              <span class="info-item-label">联系人电话 :</span>
              <span class="info-item-content">{{classInfo.contactPhone}}</span>
            </div>
          </a-col>
        </a-row>
        <a-row>
          <a-col :lg="24" :md="24" :sm="24">
            <div class="class-info">
              <span class="info-item-label">备注 :</span>
              <span class="info-item-content">{{classInfo.remark}}</span>
            </div>
          </a-col>
        </a-row>
      </a-col>
      <a-col :span="8"></a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  props: {
    classInfo: {
      type: Object,
      default: null
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/style/index';
.master-class-info-base {
  .class-info {
    margin: 10px 0;
    .info-item-label {
      text-align: right;
    }
    .info-item-content {
      padding-left: 5px;
      box-sizing: border-box;
      .ellipsis();
    }
  }
}
</style>
