<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像 -->
      <div class="avatar">
        <img src="../assets/logo.png" alt="头像" />
      </div>
      <!-- 登录表单 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        label-width="0px"
        class="login_form"
        :rules="loginFormRules"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            prefix-icon="iconfont icon-icon"
            placeholder="请输入用户名"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            prefix-icon="iconfont icon-mima"
            placeholder="请输入密码"
            v-model="loginForm.password"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 登录重置按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="primary" plain @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 登录表单数据对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 登录表单验证规则
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置表单
    reset: function() {
      // 找到表单对象
      let loginForm = this.$refs.loginFormRef
      // 调用表单对象的重置方法
      loginForm.resetFields()
    },
    // 登录
    login: function() {
      // 找到表单对象
      let loginForm = this.$refs.loginFormRef
      // 预校验
      loginForm.validate(async valid => {
        if (!valid){
          return this.$message.error('登录失败')
        }
        // 发送post请求
        var res = await this.$http.post('/login', {
          username: this.loginForm.username,
          password: this.loginForm.password
        })
        if (res.data.meta.status !== 200){
          return this.$message.error(res.data.meta.msg)
        }
        // 将token信息保存在sessionStorage
        window.sessionStorage.setItem('token', res.data.data.token)
        // 编程式导航跳转到主页
        this.$router.push('/home')
        return this.$message.success('登录成功')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  width: 100%;
  height: 100%;
  background: #294c6a;
}
.login_box {
  width: 450px;
  height: 300px;
  background: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .avatar {
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    box-shadow: 0 0 10px #ddd;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: #eee;
    }
  }

  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
  }
  .btns {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
