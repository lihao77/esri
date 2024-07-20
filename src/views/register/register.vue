<template>
    <!-- 注册表单，使用 Element UI 的 el-form 组件，提供表单验证规则 -->
    <el-form size="large" class="register-content-form" :rules="rules" :model="state.ruleForm" ref="registerForm"
        autocomplete="off">
        <!-- 用户名输入框 -->
        <el-form-item class="register-animation1" prop="userName">
            <el-input :placeholder="$t('message.register.placeholder1')" v-model="state.ruleForm.userName" clearable
                autocomplete="off">
                <template #prefix>
                    <el-icon class="el-input__icon"><ele-User /></el-icon>
                </template>
            </el-input>
        </el-form-item>

        <!-- 邮箱输入框 -->
        <el-form-item class="register-animation2" prop="email">
            <el-input :placeholder="$t('message.register.placeholderEmail')" v-model="state.ruleForm.email" clearable
                autocomplete="off">
                <template #prefix>
                    <el-icon class="el-input__icon"><ele-Message /></el-icon>
                </template>
            </el-input>
        </el-form-item>

        <!-- 验证码输入框和发送按钮 -->
        <el-form-item class="register-animation3">
            <el-col :span="15">
                <el-input maxlength="4" :placeholder="$t('message.account.accountPlaceholder3')"
                    v-model="state.ruleForm.code" clearable autocomplete="off">
                    <template #prefix>
                        <el-icon class="el-input__icon"><ele-Position /></el-icon>
                    </template>
                </el-input>
            </el-col>
            <el-col :span="1"></el-col>
            <el-col :span="8">
                <el-button class="register-content-code" v-waves>发送验证码</el-button>
            </el-col>
        </el-form-item>

        <!-- 密码输入框 -->
        <el-form-item class="register-animation5" prop="password">
            <el-input type="password" :placeholder="$t('message.register.placeholderPassword')"
                v-model="state.ruleForm.password" clearable autocomplete="new-password">
                <template #prefix>
                    <el-icon class="el-input__icon"><ele-Unlock /></el-icon>
                </template>
            </el-input>
        </el-form-item>

        <!-- 确认密码输入框 -->
        <el-form-item class="register-animation6" prop="confirmPassword">
            <el-input type="password" :placeholder="$t('message.register.placeholderConfirmPassword')"
                v-model="state.ruleForm.confirmPassword" clearable autocomplete="new-password">
                <template #prefix>
                    <el-icon class="el-input__icon"><ele-Unlock /></el-icon>
                </template>
            </el-input>
        </el-form-item>

        <!-- 提交按钮 -->
        <el-form-item class="register-animation7">
            <el-col :span="15">
                <el-button round type="primary" v-waves class="register-content-submit" @click="handleSubmit">
                    <span>{{ $t('message.register.btnText1') }}</span>
                </el-button>
            </el-col>
            <el-col :span="1"></el-col>
            <el-col :span="8">
                <el-button round type="primary" v-waves class="register-content-submit" @click="navigateToLogin">
                    <span>{{ $t('message.register.btnText2') }}</span>

                </el-button>
            </el-col>

        </el-form-item>

        <!-- 注册提示信息 -->
        <div class="font12 mt30 register-animation7 register-msg">
            {{ $t('message.register.msgText') }}
        </div>
    </el-form>

</template>

<script setup lang="ts" name="registerMobile">
import { useRoute, useRouter } from 'vue-router';
import { reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useRegisterApi } from '/@/api/register';

const router = useRouter();
const registerApi = useRegisterApi();
// Define reactive state
const state = reactive({
    ruleForm: {
        userName: '',
        email: '',
        code: '',
        password: '',
        confirmPassword: '',
    }
});
const navigateToLogin = () => {
    router.push({ name: 'login' });
};

// Form reference
const registerForm = ref(null);

// Define validation rules
const validateConfirmPassword = (rule, value, callback) => {
    if (value !== state.ruleForm.password) {
        callback(new Error('两次输入密码不一致'));
    } else {
        callback();
    }
};

const rules = {
    userName: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
    ],
    email: [
        { required: true, type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' },
    ],
    code: [
        { required: true, message: '请输入验证码', trigger: 'blur' },
        { min: 4, max: 4, message: '验证码为四位数字', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
    ],
    confirmPassword: [
        { required: true, message: '请确认您的密码', trigger: 'blur' },
        { validator: validateConfirmPassword, trigger: 'blur' }
    ],
};

// Send email code
const sendEmailCode = () => {
    // 发送邮件验证码逻辑
    ElMessage.success('验证码已发送到邮箱');
};

// Submit form
const handleSubmit = () => {
    registerForm.value.validate((valid: boolean) => {
        if (valid) {
            // 处理注册逻辑
            registerApi.register(state.ruleForm).then(() => {
                // 注册成功逻辑
                ElMessage.success('注册成功');
                // 重置表单
                registerForm.value.resetFields();
                navigateToLogin()
            })

        } else {
            ElMessage.error('请填写完整的注册信息');
            return false;
        }
    });
};
</script>

<style scoped lang="scss">
.register-content-form {
    margin-top: 20px;

    @for $i from 1 through 7 {
        .register-animation#{$i} {
            opacity: 0;
            animation-name: slide-in;
            animation-duration: 0.5s;
            animation-fill-mode: forwards;
            animation-delay: calc($i * 0.1s);
        }
    }

    .register-content-email-code,
    .register-content-code,
    .register-content-submit {
        width: 100%;
        padding: 0;
    }

    .register-content-submit {
        letter-spacing: 2px;
        font-weight: 300;
        margin-top: 15px;
    }

    .register-msg {
        color: var(--el-text-color-placeholder);
    }
}

@keyframes slide-in {
    from {
        transform: translateY(20px);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.register-content-code {
    width: 100%;
    padding: 0;
    // font-weight: bold;
    letter-spacing: 5px;
}
</style>
