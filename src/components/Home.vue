<template>
  <div>
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    // 退出登录
    logout: function() {
      // 清除token
      window.sessionStorage.clear()
      // 通过编程式导航跳转到登录页
      this.$router.push('login')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
