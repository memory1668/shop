<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片组件 -->
    <el-card>
      <!-- 对搜索框和添加按钮栅格布局 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 搜索框 -->
          <el-input
            class="input-with-select"
            width="180px"
            v-model="queryInfo.query"
            clearable
            @clear="clearSearch"
          >
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <!-- 添加用户按钮 -->
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="userList" style="width: 100%" stripe border>
        <!-- 索引列 -->
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <!-- 状态开关 -->
          <template v-slot="slotProps">
            <el-switch v-model="slotProps.row.mg_state" @change="userStateChanged(slotProps.row)"></el-switch>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作" width="180px">
          <template v-slot="slotProps">
            <!-- 修改用户 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editUserInfo(slotProps.row)"
            ></el-button>
            <!-- 删除用户 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUser(slotProps.row.id)"
            ></el-button>
            <!-- 分配权限 -->
            <el-tooltip effect="dark" content="分配权限" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加用户dialog -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!--添加用户表单-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户dialog -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <!--添加用户表单-->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created: function() {
    this.getUserList()
  },
  data() {
    // 邮箱自定义校验规则
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/
      if (!regEmail.test(value)) {
        return callback(new Error('请输入合法的邮箱'))
      }
      callback()
    }
    // 手机自定义校验规则
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^1[34578]\d{9}$/
      if (!regMobile.test(value)) {
        return callback(new Error('请输入合法的手机'))
      }
      callback()
    }
    return {
      // 用户数据列表请求参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      // 用户数据列表
      userList: [],
      // 用户数据总数
      total: 0,
      // 是否显示"添加用户"dialog
      addDialogVisible: false,
      // "添加用户"表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // "添加用户"表单校验规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 是否显示"修改用户"Dialog
      editDialogVisible: false,
      // "修改用户"表单数据
      editForm: {
        username: '',
        email: '',
        mobile: ''
      },
      // "修改用户"表单校验规则
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 获取用户列表数据
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      console.log('用户列表')
      console.log(res)
      // 获取用户数据失败
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户数据失败, ' + res.meta.msg)
      }
      // 用户列表
      this.userList = res.data.users
      // 总数
      this.total = res.data.total
    },
    // 用户状态更新
    async userStateChanged(row) {
      const { data: res } = await this.$http.put(
        `users/${row.id}/state/${row.mg_state}`
      )
      if (res.meta.status !== 200) {
        // 重置用户状态
        setTimeout(() => {
          row.mg_state = !row.mg_state
        }, 200)
        return this.$message.error('设置状态失败')
      }
      return this.$message.success(res.meta.msg)
    },
    // 分页大小改变
    handleSizeChange(newSize) {
      // 修改请求参数
      this.queryInfo.pagesize = newSize
      // 重新获取用户列表数据
      this.getUserList()
    },
    // 当前页改变
    handleCurrentChange(current) {
      // 修改请求参数
      this.queryInfo.pagenum = current
      // 重新获取用户列表数据
      this.getUserList()
    },
    // 搜索用户
    search() {
      // 重新获取用户列表数据
      this.getUserList()
    },
    // 清除输入框内容
    clearSearch() {
      // 重新获取用户列表数据
      this.getUserList()
    },
    // "添加用户"Dialog关闭
    addDialogClosed() {
      // 重置表单
      this.$refs.addFormRef.resetFields()
    },
    // 添加用户
    addUser() {
      // 预校验
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.addDialogVisible = false
        return this.$message.success(res.meta.msg)
      })
    },
    // "修改用户"Dialog关闭
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 打开”修改用户"Dialog
    async editUserInfo(row) {
      // 打开Dialog
      this.editDialogVisible = true
      // 根据id查询用户信息
      const { data: res } = await this.$http.get('users/' + row.id)
      this.editForm = res.data
    },
    // 修改用户，将数据提交到数据库
    editUser() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.put(
          'users/' + this.editForm.id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('更新失败')
        }
        //  关闭Dialog
        this.editDialogVisible = false
        // 重新获取用户列表数据
        this.getUserList()
        //  提示修改成功
        return this.$message.success(res.meta.msg)
      })
    },
    // 删除用户
    async deleteUser(id) {
      const deleteResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      // 取消删除
      if (deleteResult === 'cancel') {
        return
      }
      // 确认删除
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 重新获取用户列表数据
      this.getUserList()
      return this.$message.success(res.meta.msg)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
