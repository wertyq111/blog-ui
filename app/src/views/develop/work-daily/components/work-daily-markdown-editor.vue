<template>
  <mavon-editor
    ref="editor"
    :boxShadow="boxShadow"
    :editable="editable"
    :externalLink="externalLink"
    :navigation="navigation"
    :subfield="subfield"
    :toolbarsFlag="toolbarsFlag"
    :value="value"
    :defaultOpen="defaultOpen"
    @imgAdd="uploadImage"
    @input="$emit('input', $event)" />
</template>

<script>
import {mavonEditor} from 'mavon-editor';
import 'mavon-editor/dist/css/index.css';
import mavonLocalAssets from '@/utils/mavon-local-assets';

export default {
  name: 'WorkDailyMarkdownEditor',
  components: {mavonEditor},
  props: {
    value: {
      type: String,
      default: ''
    },
    externalLink: {
      type: Object,
      default: () => mavonLocalAssets
    },
    toolbarsFlag: {
      type: Boolean,
      default: true
    },
    subfield: {
      type: Boolean,
      default: true
    },
    defaultOpen: {
      type: String,
      default: ''
    },
    editable: {
      type: Boolean,
      default: true
    },
    navigation: {
      type: Boolean,
      default: true
    },
    boxShadow: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    uploadImage(pos, file) {
      const formData = new FormData();
      formData.append('file', file);

      this.$http.post('/work-daily/image', formData).then(res => {
        if (res.data.code === 0 && res.data.data && res.data.data.url) {
          this.$refs.editor.$img2Url(pos, res.data.data.url);
          return;
        }

        this.$message.error(res.data.msg || '图片上传失败');
      }).catch(e => {
        this.$message.error(e.message);
      });
    }
  }
}
</script>
