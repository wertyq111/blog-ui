<template>
  <app-dialog
    :destroy-on-close="true"
    :lock-scroll="false"
    :title="isUpdate ? '修改分类' : '添加分类'"
    :visible="visible"
    custom-class="ele-dialog-form"
    width="520px"
    @update:visible="updateVisible">
    <el-form ref="form" :model="form" :rules="rules" label-width="90px">
      <el-form-item label="分类名称:" prop="name">
        <el-input v-model="form.name" placeholder="请输入分类名称" />
        <div class="field-desc">支持多级分类，建议短小清晰。</div>
      </el-form-item>
      <el-form-item label="分类图标:" prop="icon">
        <div class="icon-picker">
          <div
            v-for="item in iconOptions"
            :key="item"
            class="icon-picker__item"
            :class="{'is-active': form.icon === item}"
            @click="selectIcon(item)">
            <i :class="item" />
          </div>
        </div>
        <div class="icon-picker__footer">
          <div class="icon-picker__preview">
            <i :class="form.icon || defaultIcon" />
            <span>{{ form.icon || '未选择时默认使用文件夹图标' }}</span>
          </div>
          <el-button type="text" @click="selectIcon('')">清空图标</el-button>
        </div>
      </el-form-item>
      <el-form-item label="上级分类:" prop="parentId">
        <el-select v-model="form.parentId" placeholder="顶级分类" style="width: 100%">
          <el-option
            v-for="item in parentOptions"
            :key="item.id"
            :label="item.label"
            :value="item.id"
            :disabled="item.disabled" />
        </el-select>
        <div class="field-desc">用于左侧多级菜单结构。</div>
      </el-form-item>
      <el-form-item label="排序:" prop="sort">
        <el-input-number v-model="form.sort" :min="0" :max="999" style="width: 100%" />
        <div class="field-desc">数字越小越靠前。</div>
      </el-form-item>
      <el-form-item label="状态:" prop="status">
        <el-select v-model="form.status" style="width: 100%">
          <el-option label="启用" :value="1" />
          <el-option label="停用" :value="0" />
        </el-select>
        <div class="field-desc">停用后不会出现在左侧菜单。</div>
      </el-form-item>
      <el-form-item label="说明:" prop="description">
        <el-input type="textarea" v-model="form.description" placeholder="可选说明" />
        <div class="field-desc">描述该分类的用途或范围。</div>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="updateVisible(false)">取消</el-button>
      <el-button :loading="loading" type="primary" @click="save">保存</el-button>
    </div>
  </app-dialog>
</template>

<script>
export default {
  name: 'WorkDocCategoryEdit',
  props: {
    visible: Boolean,
    data: Object,
    categories: {
      type: Array,
      default: () => []
    },
    categoryTree: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      form: {
        id: null,
        name: '',
        icon: '',
        parentId: 0,
        sort: 0,
        status: 1,
        description: ''
      },
      rules: {
        name: [{required: true, message: '请输入分类名称', trigger: 'blur'}]
      },
      iconOptions: [
        'el-icon-house',
        'el-icon-folder',
        'el-icon-folder-opened',
        'el-icon-document',
        'el-icon-notebook-1',
        'el-icon-notebook-2',
        'el-icon-collection-tag',
        'el-icon-tickets',
        'el-icon-files',
        'el-icon-copy-document',
        'el-icon-s-order',
        'el-icon-date',
        'el-icon-time',
        'el-icon-monitor',
        'el-icon-s-grid',
        'el-icon-office-building',
        'el-icon-coin',
        'el-icon-data-analysis',
        'el-icon-setting',
        'el-icon-link',
        'el-icon-postcard',
        'el-icon-camera'
      ],
      defaultIcon: 'el-icon-folder',
      loading: false,
      isUpdate: false
    };
  },
  computed: {
    parentOptions() {
      const tree = this.categoryTree && this.categoryTree.length
        ? this.normalizeCategoryList(this.categoryTree)
        : this.buildCategoryTree(this.normalizeCategoryList(this.categories));
      const options = [{
        id: 0,
        label: '顶级分类',
        disabled: false
      }];
      return options.concat(this.flattenCategoryOptions(tree));
    }
  },
  watch: {
    data() {
      if (this.data) {
        const init = Object.assign({}, this.data);
        this.form = {
          id: init.id,
          name: init.name || '',
          icon: init.icon || '',
          parentId: init.parent_id ?? init.parentId ?? 0,
          sort: init.sort ?? 0,
          status: init.status ?? 1,
          description: init.description || ''
        };
        this.isUpdate = true;
      } else {
        this.resetForm();
        this.isUpdate = false;
      }
    }
    },
  methods: {
    resetForm() {
      this.form = {id: null, name: '', icon: '', parentId: 0, sort: 0, status: 1, description: ''};
    },
    selectIcon(icon) {
      this.form.icon = icon;
    },
    normalizeCategory(item) {
      return {
        id: item.id,
        name: item.name || '',
        parent_id: Number(item.parent_id !== undefined ? item.parent_id : (item.parentId || 0)),
        children: Array.isArray(item.children) ? this.normalizeCategoryList(item.children) : []
      };
    },
    normalizeCategoryList(list) {
      return (list || []).map(item => this.normalizeCategory(item));
    },
    buildCategoryTree(list, parentId) {
      const currentParentId = parentId || 0;
      return (list || [])
        .filter(item => item.parent_id === currentParentId)
        .map(item => Object.assign({}, item, {
          children: this.buildCategoryTree(list, item.id)
        }));
    },
    flattenCategoryOptions(nodes, level) {
      const currentLevel = level || 0;
      let result = [];
      const disabledIds = this.collectDescendantIds(this.form.id);
      (nodes || []).forEach(item => {
        const prefix = currentLevel ? `${new Array(currentLevel + 1).join('　')}└ ` : '';
        result.push({
          id: item.id,
          label: `${prefix}${item.name}`,
          disabled: item.id === this.form.id || disabledIds.indexOf(item.id) !== -1
        });
        if (item.children && item.children.length) {
          result = result.concat(this.flattenCategoryOptions(item.children, currentLevel + 1));
        }
      });
      return result;
    },
    collectDescendantIds(parentId) {
      if (!parentId) {
        return [];
      }
      const ids = [];
      const visit = (id) => {
        (this.categories || []).forEach(item => {
          const currentParentId = Number(item.parent_id !== undefined ? item.parent_id : (item.parentId || 0));
          if (currentParentId === id) {
            ids.push(item.id);
            visit(item.id);
          }
        });
      };
      visit(parentId);
      return ids;
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if (!valid) return;
        if (this.form.id && this.collectDescendantIds(this.form.id).indexOf(this.form.parentId) !== -1) {
          this.$message.error('上级分类不能选择当前分类的下级目录');
          return;
        }
        this.loading = true;
        const url = this.isUpdate ? `/work-doc-category/${this.form.id}` : '/work-doc-category/add';
        const payload = {
          name: this.form.name,
          icon: this.form.icon,
          parent_id: this.form.parentId,
          sort: this.form.sort,
          status: this.form.status,
          description: this.form.description
        };
        this.$http.post(url, payload).then(res => {
          this.loading = false;
          if (res.data.code === 0) {
            this.$message.success(res.data.msg || '保存成功');
            this.updateVisible(false);
            this.$emit('done');
          } else {
            this.$message.error(res.data.msg || '保存失败');
          }
        }).catch(e => {
          this.loading = false;
          this.$message.error(e.message);
        });
      });
    },
    updateVisible(value) {
      this.$emit('update:visible', value);
    }
  }
}
</script>

<style scoped>
.field-desc {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.icon-picker {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
}

.icon-picker__item {
  align-items: center;
  border: 1px solid #e6e8eb;
  border-radius: 10px;
  color: #5f6b7a;
  cursor: pointer;
  display: flex;
  font-size: 18px;
  height: 42px;
  justify-content: center;
  transition: all 0.18s ease;
}

.icon-picker__item:hover {
  border-color: #89b4ff;
  color: #2f6bff;
  transform: translateY(-1px);
}

.icon-picker__item.is-active {
  background: #edf4ff;
  border-color: #2f6bff;
  box-shadow: inset 0 0 0 1px rgba(47, 107, 255, 0.08);
  color: #2f6bff;
}

.icon-picker__footer {
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.icon-picker__preview {
  align-items: center;
  color: #5f6b7a;
  display: flex;
  font-size: 12px;
  gap: 8px;
}

.icon-picker__preview i {
  color: #2f6bff;
  font-size: 16px;
}
</style>
