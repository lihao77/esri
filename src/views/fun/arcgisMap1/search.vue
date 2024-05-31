<template> 
<el-input
      v-model="input4"
      style="width: 240px"
      placeholder="Type something"
    >
      <template #prefix>
        <el-icon class="el-input__icon"><search /></el-icon>
      </template>
    </el-input>
</template>

<script name="Search" setup lang="ts">
import { ref } from 'vue'
import { Calendar, Search } from '@element-plus/icons-vue'

const input4 = ref('')
</script>