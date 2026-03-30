<!-- 页面引导 -->
<template>
  <el-link v-if="show" type="primary" @click.prevent.stop="guide"><i class="el-icon-guide" />引导</el-link>
</template>

<script>
import {driver} from 'driver.js' // import driver.js
import 'driver.js/dist/driver.css' // import driver.js css
import steps from './guide/steps'
export default {
  name: 'Guide',
  props: {
    show: Boolean
  },
  data() {
    return {
      // 导出请求 url
      targetUrl: '/' + this.target + '/export',
      // 加载图标
      downLoading: null,
      // 按钮禁用
      buttonDisable: false
    };
  },
  mounted() {
    this.driver = driver()
  },
  methods: {
    /* 引导 */
    guide() {
      let currentColumn = this.$route.name.replace(/^\//, '').replace(/\//, '_')
      let currentSteps = steps[currentColumn] ? steps[currentColumn] : steps.header_right
      this.driver.setConfig({
        steps: currentSteps,
        nextBtnText: "下一步",
        prevBtnText: "上一步",
        doneBtnText: "完成"
      })
      //this.driver.refresh() // 刷新
      this.driver.drive()
    },
  }
}
</script>

<style scoped>
</style>
