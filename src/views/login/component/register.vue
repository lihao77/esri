<template>
    <el-scrollbar height="244px">
        <el-form size="large" class="register-content-form" :rules="rules" :model="state.ruleForm" ref="registerForm">
            <el-form-item class="register-animation1" prop="userName">
                <el-input :placeholder="$t('message.register.placeholder1')" v-model="state.ruleForm.userName" clearable
                    autocomplete="off">
                    <template #prefix>
                        <i class="iconfont icon-user el-input__icon"></i>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item class="register-animation2" prop="email">
                <el-input :placeholder="$t('message.register.placeholderEmail')" v-model="state.ruleForm.email"
                    clearable autocomplete="off">
                    <template #prefix>
                        <i class="iconfont icon-email el-input__icon"></i>
                    </template>
                </el-input>


            </el-form-item>

            <el-form-item class="register-animation3">
                <el-col :span="15">
                    <el-input text maxlength="4" :placeholder="$t('message.account.accountPlaceholder3')"
                        v-model="state.ruleForm.code" clearable autocomplete="off">
                        <template #prefix>
                            <el-icon class="el-input__icon"><ele-Position /></el-icon>
                        </template>
                    </el-input>
                </el-col>
                <el-col :span="1"></el-col>
                <el-col :span="8">
                    <el-button class="login-content-code" v-waves>发送验证码</el-button>
                </el-col>
            </el-form-item>
            <!-- <el-form-item :span="24" class="register-animation2">
           
        </el-form-item> -->
            <el-form-item class="register-animation4" prop="code">
                <el-input text maxlength="4" :placeholder="$t('message.register.placeholder2')"
                    v-model="state.ruleForm.code" clearable autocomplete="off">
                    <template #prefix>
                        <el-icon class="el-input__icon"><ele-Position /></el-icon>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item class="register-animation5" prop="password">
                <el-input type="password" :placeholder="$t('message.register.placeholderPassword')"
                    v-model="state.ruleForm.password" clearable autocomplete="off">
                    <template #prefix>
                        <i class="iconfont icon-lock el-input__icon"></i>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item class="register-animation6" prop="confirmPassword">
                <el-input type="password" :placeholder="$t('message.register.placeholderConfirmPassword')"
                    v-model="state.ruleForm.confirmPassword" clearable autocomplete="off">
                    <template #prefix>
                        <i class="iconfont icon-lock el-input__icon"></i>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item class="register-animation7">
                <el-button round type="primary" v-waves class="register-content-submit" @click="handleSubmit">
                    <span>{{ $t('message.register.btnText') }}</span>
                </el-button>
            </el-form-item>
            <div class="font12 mt30 register-animation7 register-msg">
                {{ $t('message.register.msgText') }}
            </div>
        </el-form>
    </el-scrollbar>

</template>

<script setup lang="ts" name="registerMobile">
import { reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';

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
            ElMessage.success('注册成功');
            // 重置表单
            registerForm.value.resetFields();
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

.login-content-code {
    width: 100%;
    padding: 0;
    // font-weight: bold;
    letter-spacing: 5px;
}
</style>
