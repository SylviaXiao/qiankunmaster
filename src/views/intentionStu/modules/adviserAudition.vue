<template>
  <div class="studentinfo-wrapper">
    <div v-if="backData.length > 0" class="data-tree">
      <a-timeline v-if="backData.length>0">
        <a-timeline-item v-for="(item, index) in backData" :key="item.id">
          <a-card :bordered="false" :style="{marginTop:'10px'}" :title="cardTypeFn(item)">
            <div slot="extra">
              <a-row>
                <perm-box perm="student:audition:status" :text="item.auditionType=='Y'?'已体验':'已预约'">
                  <a-select :allowClear="true" :value="item.auditionType" style="width: 120px" @change="handleChange($event,item)">
                    <a-select-option :allowClear="true" value="N">已预约</a-select-option>
                    <a-select-option :allowClear="true" value="Y">已体验</a-select-option>
                  </a-select>
                </perm-box>
              </a-row>
            </div>
            <a-col :span="24">
              <a-row>{{item.auditionRemark?item.auditionRemark:'(无备注)'}}</a-row>
            </a-col>
          </a-card>
        </a-timeline-item>
      </a-timeline>
    </div>
    <div class="nodata" v-else>
      (尚未预约)
    </div>
  </div>
</template>
<script>
  import { listStuAudition, enableStuAudition } from '@/api/intentionStu/adviser'
  import PermBox from '@/components/PermBox'

  export default {
    data() {
      return {
        backData: [],
        record: null
      }
    },
    components: {
      PermBox
    },
    props: {
      stuObj: Object
    },
    watch: {
      stuObj(nv) {
        if (nv) {
          this.refreshData()
        }
      }
    },
    created() {
      this.refreshData()
    },
    methods: {
      cardTypeFn(item) {
        let time = item.auditionDate
        let duration = item.auditionDuration === 'Y' ? '上午' : '下午'
        let person = item.orgUserName
        return `${time}${duration}-${person}`
      },
      handleChange(val, record) {
        let params = {
          auditionType: val
        }
        enableStuAudition(record.auditionId, params).then(res => {
          if (res.code === 200) {
            this.$emit('refresh')
            this.refreshData()
            this.$notification['success']({
              message: '系统通知',
              description: '已成功修改状态'
            })
          }
        })
      },

      // loadData
      refreshData() {
        listStuAudition(this.stuObj.id).then(res => {
          if (res.code === 200 && res.data.length > 0) {
            this.backData = res.data
          }
        })
      },

      // 向父级暴露form表单的数据
      getAuditionData() {
        return {
          auditionType: this.auditionType,
          id: this.stuObj.id
        }
      },

      // 重置form
      reset() {
        this.backData = []
      }
    }
  }
</script>

<style scoped lang=less>
  @import '~@/assets/style/index';

  :global {
    .data-tree {
      .ant-card {
        top: -20px;
      }

      .ant-timeline {
        margin-top: 10px;
      }
    }
  }

  .studentinfo-wrapper {
    width: 100%;
    min-height: 150px;

    .state-label {
      position: relative;
      top: 5px;
    }
  }

  .nodata {
    width: 100%;
    height: 150px;
    .center();
  }
</style>
