<template>
  <div class="login-container">
    <el-card class="box-card">
      <h2>用户登录</h2>
      <el-form :model="form" :rules="rules" ref="formRef">
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>

        <el-form-item label="验证码" prop="code">
          <el-row :gutter="10" style="width: 100%">
            <el-col :span="14">
              <el-input v-model="form.code" placeholder="请输入验证码" />
            </el-col>
            <el-col :span="10">
              <el-button @click="getCode" type="primary" plain style="width: 100%;" :disabled="loading">
                {{ countdown > 0 ? `${countdown}秒后重试` : '获取验证码' }}
              </el-button>
            </el-col>
          </el-row>
          <span v-if="mockCode" class="mock-code">Mock验证码：{{ mockCode }}</span>
        </el-form-item>

        <el-form-item>
          <div class="remember-forgot">
            <el-checkbox v-model="form.remember">记住账号</el-checkbox>
            <el-link type="primary" @click="forgotPassword" :underline="false">忘记密码？</el-link>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onLogin" :loading="loading">登录</el-button>
        </el-form-item>
      </el-form>
      
      <div class="register-link">
        还没有账号？<el-link type="primary" @click="goToRegister" :underline="false">立即注册</el-link>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../store/userStore'
import api from '../utils/axios'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

const formRef = ref()
const form = ref({
  phone: '',
  code: '',
  remember: false
})

const rules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' }
  ]
}

const mockCode = ref('')
const loading = ref(false)
const countdown = ref(0)

// 页面加载时检查本地存储中是否有保存的手机号
onMounted(() => {
  const savedPhone = localStorage.getItem('rememberedPhone')
  if (savedPhone) {
    form.value.phone = savedPhone
    form.value.remember = true
  }
})

function startCountdown() {
  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

async function getCode() {
  if (!form.value.phone.match(/^1[3-9]\d{9}$/)) {
    return ElMessage.warning('请输入正确的手机号')
  }

  if (countdown.value > 0) return

  loading.value = true
  try {
    const res = await api.get('/api/sendCode', { params: { phone: form.value.phone } })
    if (res.code === 200) {
      mockCode.value = res.data.verifyCode
      ElMessage.success('验证码已发送')
      form.value.code = res.data.verifyCode // 自动填充（方便测试）
      startCountdown()
    }
  } catch (e) {
    ElMessage.error('获取验证码失败')
  } finally {
    loading.value = false
  }
}

async function onLogin() {
  try {
    // 等待表单验证结果
    await formRef.value.validate((valid, fields) => {
      if (!valid) {
        console.log('验证失败:', fields);
        return false;
      }
      console.log('验证结果:', valid);
      return true;
    });
    
    loading.value = true
    const res = await api.post('/api/login', {
      phone: form.value.phone,
      code: form.value.code
    })

    if (res.code === 200 && res.data?.role) {
      // 如果用户勾选了"记住账号"，则保存手机号到本地存储
      if (form.value.remember) {
        localStorage.setItem('rememberedPhone', form.value.phone)
      } else {
        localStorage.removeItem('rememberedPhone')
      }

      // 记录用户信息到 Pinia
      userStore.login({
        phone: res.data.phone,
        role: res.data.role
      })

      ElMessage.success('登录成功')
      router.push('/admin') // 登录成功跳转
    } else {
      ElMessage.error(res.msg || '登录失败')
    }
  } catch (e) {
    console.error(e)
    ElMessage.error('请求异常，请稍后重试')
  } finally {
    loading.value = false
  }
}

function forgotPassword() {
  ElMessage.info('忘记密码功能正在开发中')
  // 实际项目中可以跳转到重置密码页面
  // router.push('/reset-password')
}

function goToRegister() {
  router.push('/register')
}
</script>

<style scoped>
body {
  margin: 0;
  padding: 0;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  background-color: #f0f2f5;
}
.login-container {
  height: 98vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.box-card {
  width: 380px;
  border-radius: 12px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
}

.box-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

h2 {
  text-align: center;
  margin-bottom: 25px;
  color: #303133;
  font-weight: 600;
  font-size: 24px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-input__inner) {
  border-radius: 8px;
  padding: 12px 15px;
  height: 44px;
}

:deep(.el-button) {
  border-radius: 8px;
  padding: 12px 20px;
  height: 44px;
  font-weight: 500;
  transition: all 0.3s;
}

:deep(.el-button--primary) {
  /* background: #409EFF; */
  border-color: #409EFF;
}

:deep(.el-button--primary:hover) {
  background: #66b1ff;
  border-color: #66b1ff;
  box-shadow: 0 5px 15px rgba(64, 158, 255, 0.3);
}

:deep(.el-button--primary.is-plain) {
  color: #409EFF;
}

:deep(.el-button--primary.is-plain:hover) {
  background: #ecf5ff;
  color: #409EFF;
}

.el-form-item:last-child {
  margin-top: 10px;
  margin-bottom: 0;
}

.el-form-item:last-child :deep(.el-button) {
  width: 100%;
  font-size: 16px;
}

.mock-code {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
  display: block;
}

.remember-forgot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.register-link {
  text-align: center;
  margin-top: 20px;
  color: #606266;
  font-size: 14px;
}

:deep(.el-link) {
  font-weight: 500;
}

:deep(.el-link:hover) {
  text-decoration: none;
}

:deep(.el-checkbox__label) {
  font-size: 14px;
  color: #606266;
}
</style>