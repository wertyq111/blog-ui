<!-- 详情弹窗 -->
<template>
  <app-dialog
    :destroy-on-close="true"
    :lock-scroll="false"
    :visible="visible"
    custom-class="ele-dialog-form develop-dialog"
    title="详情"
    width="640px"
    @update:visible="updateVisible">
    <el-form
      class="ele-form-detail develop-dialog-form develop-dialog-detail"
      label-width="82px"
      size="mini">
      <div class="field-desc">查看操作请求的来源、行为和上下文信息。</div>
      <el-row :gutter="15">
        <el-col :sm="12">
          <el-form-item label="操作模块:">
            <div class="develop-dialog-static develop-dialog-detail__block">
              {{ data.module }}
            </div>
          </el-form-item>
          <el-form-item label="IP地址:">
            <div class="develop-dialog-static develop-dialog-detail__block">
              {{ data.ip }}
            </div>
          </el-form-item>
          <el-form-item label="操作时间:">
            <div class="develop-dialog-static develop-dialog-detail__block">
              {{ data.createTime | toDateString }}
            </div>
          </el-form-item>
        </el-col>
        <el-col :sm="12">
          <el-form-item label="操作人:">
            <div class="develop-dialog-static develop-dialog-detail__block">
              {{ data.username }}
            </div>
          </el-form-item>
          <el-form-item label="IP区域:">
            <div class="develop-dialog-static develop-dialog-detail__block">
              {{ data.ip_city }}
            </div>
          </el-form-item>
          <el-form-item label="日志类型:">
            <el-tag
              :type="['success','danger','warning','info'][data.type-1]"
              size="mini">
              {{ ['登录系统', '注销系统', '操作日志'][data.type - 1] }}
            </el-tag>
          </el-form-item>
        </el-col>
      </el-row>
      <div style="margin: 12px 0;">
        <el-divider/>
      </div>
      <el-form-item label="请求地址:">
        <div class="develop-dialog-static develop-dialog-detail__block develop-dialog-detail__block--wide">
          {{ data.url }}
        </div>
      </el-form-item>
      <el-form-item label="调用方法:">
        <div class="develop-dialog-static develop-dialog-detail__block">
          {{ data.method }}
        </div>
      </el-form-item>
      <el-form-item label="用户代理:">
        <div class="develop-dialog-static develop-dialog-detail__block develop-dialog-detail__block--wide">
          {{ data.user_agent }}
        </div>
      </el-form-item>
      <el-form-item label="请求参数:">
        <div class="develop-dialog-static develop-dialog-detail__block develop-dialog-detail__block--wide">
          {{ data.param }}
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="develop-dialog-footer">
      <el-button @click="updateVisible(false)">关闭
      </el-button>
    </div>
  </app-dialog>
</template>

<script>
export default {
  name: 'OperRecordDetail',
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 数据
    data: Object
  },
  methods: {
    /* 更新visible */
    updateVisible(value) {
      this.$emit('update:visible', value);
    }
  }
}
</script>

<style scoped>
.develop-dialog-detail__block {
  min-height: 36px;
  padding: 8px 12px;
  border-radius: 12px;
  line-height: 1.6;
  word-break: break-word;
  white-space: pre-wrap;
}
</style>
