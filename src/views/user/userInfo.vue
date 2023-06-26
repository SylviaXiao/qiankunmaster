<template>
  <div>
    <a-card :bordered="false" title="用户信息">
      <detail-list>
        <detail-list-item term="工号">{{userInfoById.userNo}}</detail-list-item>
        <detail-list-item term="用户姓名">{{userInfoById.userName}}</detail-list-item>
        <detail-list-item term="昵称">{{userInfoById.userNickName}}</detail-list-item>
        <detail-list-item term="性别">{{userInfoById.userSex!=='M'?'女':'男'}}</detail-list-item>
        <detail-list-item term="身份证">{{userInfoById.userIdcard}}</detail-list-item>
        <detail-list-item term="联系方式">{{userInfoById.userTel}}</detail-list-item>
        <detail-list-item term="人员类型">{{userInfoById.userOfficial}}</detail-list-item>
        <detail-list-item term="入职时间">{{userInfoById.userEntryTime}}</detail-list-item>
        <detail-list-item term="转正时间">{{userInfoById.userOfficialTime}}</detail-list-item>
        <detail-list-item term="在职类型">{{userInfoById.userState =='Y'?'在职':'离职'}}</detail-list-item>
      </detail-list>
      <detail-list title="权限组">
        <detail-list-item term="职位名称">{{userInfoById.orgPosition.positionName}}</detail-list-item>
        <detail-list-item term="职位状态">{{userInfoById.orgPosition.positionStatus=='Y'?'启用':'禁用'}}</detail-list-item>
        <detail-list-item></detail-list-item>
<!--        <detail-list-item term="某某数据">725</detail-list-item>-->
<!--        <detail-list-item term="该数据更新时间">2018-08-08</detail-list-item>-->
<!--        <detail-list-item></detail-list-item>-->
      </detail-list>
    </a-card>
  </div>
</template>

<script>
  import { getOrgUser } from '@/api/login'
  import DetailList from '@/components/tools/DetailList'

  const DetailListItem = DetailList.Item
  const userTerm = ['用户姓名', '用户生日']
  export default {
    name: 'userInfo',
    components: {
      DetailList,
      DetailListItem
    },
    data() {
      return {
        id: this.$route.query.userId,
        userInfoById: []
      }
    },
    watch:{

      id(nV,oV){
      }
    },
    mounted() {
    },
    created() {
      this.$route.query.userId ? this.$store.commit('SET_USERID', this.$route.query.userId) : ''
      getOrgUser(this.id).then(res => {
        this.userInfoById = res.data.user
        if (this.userInfoById.userOfficial == 'Y') {
          this.userInfoById.userOfficial = '正式'
        } else if (this.userInfoById.userOfficial == 'T') {
          this.userInfoById.userOfficial = '试用'
        } else {
          this.userInfoById.userOfficial = '兼职'
        }
      })
    }
  }
</script>

<style scoped lang=less>

</style>
