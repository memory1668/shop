<template>
  <el-container>
    <el-header>
      <!-- 左上角logo和标题 -->
      <div>
        <!-- logo -->
        <img src="../assets/logo.png" width="45px" height="45px" alt="头部Logo" />
        <!-- 标题 -->
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapsed?'64px':'200px'">
        <!-- 折叠按钮 -->
        <div class="toggle" @click="toggleCollapse">|||</div>
        <!-- 导航菜单 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#36a2fc"
          unique-opened
          :collapse="isCollapsed"
          :collapse-transition="false"
          router
          :default-active="activeIndex"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconObj[item.id]"></i>
              <!-- 文字 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/'+subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveActiveState('/'+subItem.path)"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文字 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 菜单数据
      menuList: [],
      // 一级菜单图标
      iconObj: {
        '125': 'iconfont icon-users',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpingouwudai2',
        '102': 'iconfont icon-dingdanguanli',
        '145': 'iconfont icon-icon-test'
      },
      // 是否折叠菜单
      isCollapsed: false,
      // 当前激活菜单的 index
      activeIndex: ''
    }
  },
  methods: {
    // 退出登录
    logout: function() {
      // 清除token
      window.sessionStorage.clear()
      // 通过编程式导航跳转到登录页
      this.$router.push('login')
    },
    // 折叠菜单
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed
    },
    // 保存当前激活菜单的index到sessionStorage
    saveActiveState(index) {
      this.activeIndex = index
      window.sessionStorage.activeIndex = index
    }
  },
  // 获取左侧菜单数据
  created: async function() {
    const { data: res } = await this.$http.get('menus')
    // 获取数据失败
    if (res.meta.status !== 200) {
      return this.$meeeage.error(res.meta.msg)
    }
    // 将获取的数据保存在本组件
    this.menuList = res.data
    // console.log(this.menuList)
    // 更新当前激活菜单的index
    this.activeIndex = window.sessionStorage.getItem('activeIndex')
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}
// 头部
.el-header {
  background: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 5px;
  > div {
    color: #fff;
    font-size: 20px;
    display: flex;
    align-items: center;
    span {
      margin-left: 10px;
    }
  }
}

// 左侧导航栏
.el-aside {
  background: #333744;
}
.el-menu {
  // 去掉1px右侧边框
  border-right: 0;
}
// 主要显示区
.el-main {
  background: #eaedf1;
}
// 字体图标
.iconfont {
  // 图标和文字设置10px的距离
  margin-right: 10px;
}
// 折叠菜单
.toggle {
  background: #4a5163;
  text-align: center;
  color: #fff;
  line-height: 26px;
  cursor: pointer;
  letter-spacing: 0.2em;
}
</style>
