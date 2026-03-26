<!-- 编辑弹窗 -->
<template>
  <app-dialog
    :destroy-on-close="true"
    :lock-scroll="false"
    :title="isUpdate?'修改项目编码':'添加项目编码'"
    :visible="visible"
    custom-class="ele-dialog-form develop-dialog"
    width="680px"
    @update:visible="updateVisible">
    <el-form
      ref="form"
      class="develop-dialog-form"
      :model="form"
      :rules="rules"
      label-width="100px">
      <el-row :gutter="15">
        <el-col :sm="12">
          <el-form-item label="项目编码:" prop="code">
            <el-input
              v-model="form.code"
              :maxlength="20"
              clearable
              placeholder="请输入项目编码"/>
          </el-form-item>
        </el-col>
        <el-col :sm="12">
          <el-form-item label="项目名称:" prop="name">
            <el-input
              v-model="form.name"
              :maxlength="20"
              clearable
              placeholder="请输入项目名称"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :sm="24">
          <el-form-item label="服务器地址:" prop="target">
            <el-input
              v-model="form.target"
              :maxlength="200"
              clearable
              placeholder="请输入服务器地址"/>
          </el-form-item>
        </el-col>
      </el-row>
        <el-row v-for="(item, index) in form.sources" :key="index" :gutter="15">
          <el-col :sm="21">
            <el-form-item :label=sourceNum(index) prop="sources">
              <el-input
                v-model="form.sources[index]"
                :maxlength="200"
                clearable
                placeholder="请输入来源地址"/>
            </el-form-item>
          </el-col>
          <!-- 若表单中没有值则不可以新增sources -->
          <span v-if="index === 0"
                :class="form.sources[form.sources.length - 1] === '' ? 'change-icon-add': 'change-icon'">
          <i :style="{pointerEvents:form.sources[form.sources.length - 1] === '' ? 'none' : 'auto'}"
             class="el-icon-plus"
             @click="addSource()"
          ></i>
        </span>
          <span v-else class="change-icon" @click="deleteSource(index)">
            <i class="el-icon-minus"></i>
          </span>
        </el-row>
    </el-form>
    <div slot="footer" class="develop-dialog-footer">
      <el-button
        @click="updateVisible(false)">取消
      </el-button>
      <el-button
        :loading="loading"
        type="primary"
        @click="save">保存
      </el-button>
    </div>
  </app-dialog>
</template>

<script>
export default {
  name: 'ConvertPathEdit',
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object
  },
  data() {
    return {
      // 表单数据
      form: this.initFormData(this.data),
      // 表单验证规则
      rules: {
        code: [
          {required: true, message: '请输入项目编码', trigger: 'blur'}
        ],
        name: [
          {required: true, message: '请输入项目名称', trigger: 'blur'}
        ],
        target: [
          {required: true, message: '请输入服务器地址', trigger: 'blur'}
        ]
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
    };
  },
  computed: {
    sourceNum() {
      return function (index) {
        return "来源地址" + (index + 1);
      }
    }
  },
  watch: {
    data() {
      this.isUpdate = !!(this.data && this.data.id);
      this.form = this.initFormData(this.data);
    },
  },
  methods: {
    // 新增来源地址
    addSource() {
      this.form.sources.push("")
    },
    // 删除来源地址
    deleteSource(i) {
      this.form.sources.splice(i, 1)
    },

    /* 保存编辑 */
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true;
          // 区别添加还是编辑
          let url = "/server-path/add";
          if (this.isUpdate === true) {
            url = `/server-path/${this.form.id}`
          }
          this.$http.post(url, this.form).then(res => {
            this.loading = false;
            if (res.data.code === 0) {
              this.$message({type: 'success', message: res.data.msg});
              if (!this.isUpdate) {
                this.form = this.initFormData();
              }
              this.updateVisible(false);
              this.$emit('done');
            } else {
              this.$message.error(res.data.msg);
            }
          }).catch(e => {
            this.loading = false;
            this.$message.error(e.message);
          });
        } else {
          return false;
        }
      });
    },
    /* 初始化form数据 */
    initFormData(data) {
      const form = {
        status: 1,
        sources: [""]
      };

      if (data) {
        const tempData = Object.assign({}, data);
        let sources = [];

        if (Array.isArray(tempData.sources)) {
          sources = tempData.sources;
        } else if (typeof tempData.sources === 'string' && tempData.sources.trim()) {
          try {
            const parsedSources = JSON.parse(tempData.sources);
            if (Array.isArray(parsedSources)) {
              sources = parsedSources;
            }
          } catch (e) {
            sources = [tempData.sources];
          }
        }

        tempData.sources = sources.length ? sources : [""];
        Object.assign(form, tempData);
      }

      return form;
    },
    /* 更新visible */
    updateVisible(value) {
      this.$emit('update:visible', value);
    }
  }
}
</script>

<style scoped>
span {
  margin: 0 8px;
}

.change-icon {
  align-items: center;
  color: #7aa126;
  display: inline-flex;
  font-size: 22px;
  cursor: pointer;
  height: 42px;
}

.change-icon-add {
  align-items: center;
  color: #c3cbbf;
  display: inline-flex;
  font-size: 22px;
  cursor: no-drop;
  height: 42px;
}
</style>
