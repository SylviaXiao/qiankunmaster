<template>
  <div class="user-wrapper">
    <div class="content-box">
      <!--      <a href="https://pro.loacg.com/docs/getting-started" target="_blank">-->
      <!--        <span modules="action">-->
      <!--          <a-icon type="question-circle-o"></a-icon>-->
      <!--        </span>-->
      <!--      </a>-->
      <!--      <notice-icon modules="action"/>-->
      <span class="school" v-if="deptsList && deptsList.length > 0">
        <a-icon type="home" />
        <span style="margin: 0 15px;">
          <span v-if="deptsList.length > 1">
            <a-select :defaultValue="deptsDefault" @change="changeDept">
              <a-select-option :allowClear="true" :value="item.deptId" v-for="(item, index) in deptsList" :key="index">{{ item.deptName }}</a-select-option>
            </a-select>
          </span>
          <span v-else>
            <span>{{ deptsList[0].deptName }}</span>
          </span>
        </span>
      </span>

      <a-dropdown>
        <span class="action ant-dropdown-link user-dropdown-menu">
          <a-avatar modules="avatar" size="small" :src="avatar()" :icon="avatar() ? '' : 'user'" />
          <span style="margin-left: 10px;">{{ nickname() }}-{{ positionName() || 无职位 }}</span>
        </span>
        <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
          <a-menu-item key="0">
            <router-link :to="{ name: 'center' }">
              <a-icon type="user" />
              <span>个人中心</span>
            </router-link>
          </a-menu-item>
          <!--          <a-menu-item key="1">-->
          <!--            <router-link :to="{ name: 'settings' }">-->
          <!--              <a-icon type="setting"/>-->
          <!--              <span>账户设置</span>-->
          <!--            </router-link>-->
          <!--          </a-menu-item>-->
          <a-menu-divider />
          <a-menu-item key="3">
            <a href="javascript:;" @click="handleLogout">
              <a-icon type="logout" />
              <span>退出登录</span>
            </a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
  </div>
</template>

<script>
import NoticeIcon from '@/components/NoticeIcon'
import { mapActions, mapGetters } from 'vuex'
import Vue from 'vue'

export default {
  name: 'UserMenu',
  components: {
    NoticeIcon
  },
  data() {
    return {
      deptsList: [],
      deptsDefault: ''
    }
  },
  created() {
    this.getData()
  },
  methods: {
    ...mapActions(['Logout', 'SetDept']),
    ...mapGetters(['nickname', 'avatar', 'positionName']),
    handleLogout() {
      const that = this
      this.$confirm({
        title: '提示',
        content: '真的要注销登录吗 ?',
        onOk() {
          return that
            .Logout({})
            .then(() => {
              window.location.reload()
              // that.$router.push({ path: 'user/login' })
            })
            .catch(err => {
              that.$message.error({
                title: '错误',
                description: err.message
              })
            })
        },
        onCancel() {}
      })
    },
    getData() {
      const userSchoolId = JSON.parse(Vue.ls.get('userSchoolId'))
      const userDefaultId = Vue.ls.get('userDefaultId')

      this.deptsList = userSchoolId

      if (userDefaultId && userDefaultId !== null) {
        this.deptsDefault = userDefaultId
      } else {
        this.deptsDefault = userSchoolId && userSchoolId.length > 0 ? userSchoolId[0].deptId : ''
        Vue.ls.set('userDefaultId', this.deptsDefault)
      }
    },
    changeDept(data) {
      Vue.ls.set('userDefaultId', data)
      // return
      // window.location.reload()
      this.SetDept({}).then()
    }
  }
}
</script>

<style scoped lang="less">
.content-box {
  display: flex;
  .ant-select-selection {
    border: 0 !important;
  }

  .ant-select-selection--single {
    border: 0 !important;
  }
}
@media screen and (max-width: 360px) {
  .action {
    padding: 0 !important;
  }
}
</style>
