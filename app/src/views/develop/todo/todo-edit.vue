<template>
  <app-dialog
    :destroy-on-close="true"
    :lock-scroll="false"
    :title="isUpdate ? '修改待办' : '添加待办'"
    :visible="visible"
    custom-class="ele-dialog-form develop-dialog"
    width="900px"
    @update:visible="updateVisible">
    <el-form
      ref="form"
      class="develop-dialog-form"
      :model="form"
      :rules="rules"
      label-width="100px">
      <div class="develop-dialog-card">
        <div class="develop-dialog-card__title">待办信息</div>
        <div class="develop-dialog-card__body">
          <el-row :gutter="15">
            <el-col :sm="24">
              <el-form-item label="标题:" prop="title">
                <el-input v-model="form.title" placeholder="请输入待办标题" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="15">
            <el-col :sm="8">
              <el-form-item label="状态:" prop="status">
                <el-select v-model="form.status" style="width: 100%">
                  <el-option label="待办" :value="0" />
                  <el-option label="进行中" :value="1" />
                  <el-option label="已完成" :value="2" />
                  <el-option label="已取消" :value="3" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="8">
              <el-form-item label="优先级:" prop="priority">
                <el-select v-model="form.priority" style="width: 100%">
                  <el-option label="低" :value="0" />
                  <el-option label="中" :value="1" />
                  <el-option label="高" :value="2" />
                  <el-option label="紧急" :value="3" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="8">
              <el-form-item label="截止日期:" prop="dueDate">
                <el-date-picker
                  v-model="form.dueDate"
                  type="date"
                  placeholder="选择截止日期"
                  value-format="yyyy-MM-dd"
                  style="width: 100%" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="15">
            <el-col :sm="12">
              <el-form-item label="平台:" prop="platformId">
                <el-select v-model="form.platformId" clearable filterable placeholder="请选择工作平台" style="width: 100%">
                  <el-option
                    v-for="item in platforms"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="12">
              <el-form-item label="标签:" prop="tagsText">
                <el-input v-model="form.tagsText" placeholder="使用英文逗号分隔，例如：前端,Bug,紧急" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="develop-dialog-card develop-dialog-card--content">
        <div class="develop-dialog-card__title">详细描述</div>
        <div class="develop-dialog-card__body">
          <el-row :gutter="15">
            <el-col :sm="24">
              <el-form-item label="内容:" prop="content">
                <mavon-editor v-model="form.content" :externalLink="mavonExternalLink" :toolbarsFlag="true" :subfield="true" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-form>
    <div slot="footer" class="develop-dialog-footer">
      <el-button @click="updateVisible(false)">取消</el-button>
      <el-button :loading="loading" type="primary" @click="save">保存</el-button>
    </div>
  </app-dialog>
</template>

<script>
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
import mavonLocalAssets from "@/utils/mavon-local-assets";

export default {
  name: "TodoEdit",
  components: { mavonEditor },
  props: {
    visible: Boolean,
    data: Object,
    platforms: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      mavonExternalLink: mavonLocalAssets,
      form: {
        id: null,
        title: "",
        content: "",
        status: 0,
        priority: 1,
        dueDate: null,
        platformId: null,
        tagsText: "",
      },
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
      },
      loading: false,
      isUpdate: false,
    };
  },
  watch: {
    data() {
      if (this.data) {
        const init = Object.assign({}, this.data);
        this.form = {
          id: init.id,
          title: init.title || "",
          content: init.content || "",
          status: init.status ?? 0,
          priority: init.priority ?? 1,
          dueDate: init.due_date || init.dueDate || null,
          platformId: init.platform_id || init.platformId || null,
          tagsText: Array.isArray(init.tags) ? init.tags.join(",") : (init.tags || ""),
        };
        this.isUpdate = true;
      } else {
        this.resetForm();
        this.isUpdate = false;
      }
    },
  },
  methods: {
    resetForm() {
      this.form = {
        id: null,
        title: "",
        content: "",
        status: 0,
        priority: 1,
        dueDate: null,
        platformId: null,
        tagsText: "",
      };
    },
    save() {
      this.$refs["form"].validate((valid) => {
        if (!valid) return;
        this.loading = true;
        const url = this.isUpdate ? `/todo/${this.form.id}` : "/todo/add";
        const tags = this.form.tagsText
          ? this.form.tagsText.split(",").map((t) => t.trim()).filter(Boolean)
          : [];
        const payload = {
          title: this.form.title,
          content: this.form.content,
          status: this.form.status,
          priority: this.form.priority,
          due_date: this.form.dueDate,
          platform_id: this.form.platformId,
          tags: tags,
        };

        this.$http
          .post(url, payload)
          .then((res) => {
            this.loading = false;
            if (res.data.code === 0) {
              this.$message.success(res.data.msg || "保存成功");
              this.updateVisible(false);
              this.$emit("done");
            } else {
              this.$message.error(res.data.msg || "保存失败");
            }
          })
          .catch((e) => {
            this.loading = false;
            this.$message.error(e.message);
          });
      });
    },
    updateVisible(value) {
      this.$emit("update:visible", value);
    },
  },
};
</script>

<style scoped>
.develop-dialog-card {
  padding: 16px;
  border: 1px solid var(--develop-dialog-card-border, rgba(215, 228, 205, 0.86));
  border-radius: 18px;
  background: var(--develop-dialog-card-bg,
    radial-gradient(circle at top right, rgba(173, 236, 109, 0.12), transparent 22%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.84) 0%, rgba(247, 251, 243, 0.76) 100%));
  box-shadow: var(--develop-dialog-card-shadow,
    inset 0 1px 0 rgba(255, 255, 255, 0.88),
    0 14px 28px rgba(160, 186, 145, 0.12));
}

.develop-dialog-card + .develop-dialog-card {
  margin-top: 14px;
}

.develop-dialog-card__title {
  margin-bottom: 14px;
  color: var(--develop-dialog-card-title, #2d392d);
  font-size: 14px;
  font-weight: 700;
}

.develop-dialog-card__body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.develop-dialog-card ::v-deep .v-note-wrapper {
  min-height: 300px;
  border: 1px solid var(--develop-dialog-markdown-border, rgba(215, 228, 205, 0.86));
  border-radius: 16px;
  background: var(--develop-dialog-markdown-bg, rgba(255, 255, 255, 0.96));
  box-shadow: var(--develop-dialog-markdown-shadow,
    inset 0 1px 0 rgba(255, 255, 255, 0.82),
    0 14px 28px rgba(160, 186, 145, 0.12));
  overflow: hidden;
}

.develop-dialog-card ::v-deep .v-note-op {
  background: var(--develop-dialog-markdown-toolbar-bg, rgba(247, 251, 243, 0.92)) !important;
  border-bottom: 1px solid var(--develop-dialog-markdown-border, rgba(215, 228, 205, 0.86)) !important;
}

.develop-dialog-card ::v-deep .v-note-op .op-icon,
.develop-dialog-card ::v-deep .v-note-op .v-left-item,
.develop-dialog-card ::v-deep .v-note-op .v-right-item,
.develop-dialog-card ::v-deep .v-note-op .op-icon-divider {
  color: var(--develop-dialog-markdown-text, #2d392d) !important;
}

.develop-dialog-card ::v-deep .v-note-op .op-icon.selected {
  background: rgba(93, 153, 214, 0.18) !important;
  color: var(--develop-dialog-text-primary, #eef6ff) !important;
}

.develop-dialog-card ::v-deep .op-header,
.develop-dialog-card ::v-deep .op-image,
.develop-dialog-card ::v-deep .v-note-navigation-wrapper {
  background: var(--develop-dialog-markdown-toolbar-bg, rgba(247, 251, 243, 0.92)) !important;
  border-color: var(--develop-dialog-markdown-border, rgba(215, 228, 205, 0.86)) !important;
}

.develop-dialog-card ::v-deep .dropdown-item,
.develop-dialog-card ::v-deep .dropdown-item span,
.develop-dialog-card ::v-deep .v-note-navigation-title,
.develop-dialog-card ::v-deep .v-note-navigation-close {
  color: var(--develop-dialog-markdown-text, #2d392d) !important;
}

.develop-dialog-card ::v-deep .v-note-panel,
.develop-dialog-card ::v-deep .v-show-content,
.develop-dialog-card ::v-deep .content-input-wrapper,
.develop-dialog-card ::v-deep .auto-textarea-wrapper.content-input,
.develop-dialog-card ::v-deep .auto-textarea-block,
.develop-dialog-card ::v-deep .v-show-content-html,
.develop-dialog-card ::v-deep .v-note-read-model {
  background: var(--develop-dialog-markdown-panel-bg, rgba(255, 255, 255, 0.96)) !important;
  color: var(--develop-dialog-markdown-text, #2d392d) !important;
}

.develop-dialog-card ::v-deep .content-input-wrapper,
.develop-dialog-card ::v-deep .auto-textarea-wrapper.content-input,
.develop-dialog-card ::v-deep .v-show-content,
.develop-dialog-card ::v-deep .v-show-content-html,
.develop-dialog-card ::v-deep .v-note-read-model,
.develop-dialog-card ::v-deep .v-note-navigation-wrapper {
  border-color: var(--develop-dialog-markdown-border, rgba(215, 228, 205, 0.86)) !important;
}

.develop-dialog-card ::v-deep .content-input-wrapper textarea,
.develop-dialog-card ::v-deep .auto-textarea-wrapper.content-input textarea,
.develop-dialog-card ::v-deep .v-show-content,
.develop-dialog-card ::v-deep .v-show-content p,
.develop-dialog-card ::v-deep .v-show-content li,
.develop-dialog-card ::v-deep .v-show-content span,
.develop-dialog-card ::v-deep .v-show-content-html,
.develop-dialog-card ::v-deep .v-show-content-html p,
.develop-dialog-card ::v-deep .v-show-content-html li,
.develop-dialog-card ::v-deep .v-show-content-html span,
.develop-dialog-card ::v-deep .v-note-read-content,
.develop-dialog-card ::v-deep .v-note-read-content p,
.develop-dialog-card ::v-deep .v-note-read-content li,
.develop-dialog-card ::v-deep .v-note-read-content span {
  color: var(--develop-dialog-markdown-text, #2d392d) !important;
}
</style>
