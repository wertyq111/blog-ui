<template>
  <div v-if="isAdmin">
    <el-upload
      class="upload-demo"
      ref="upload"
      multiple
      drag
      :action="uploadUrl"
      :data="qiniuParam"
      :on-change="handleChange"
      :before-upload="beforeUpload"
      :on-success="handleSuccess"
      :on-error="handleError"
      :list-type="listType"
      :accept="accept"
      :limit="maxNumber"
      :auto-upload="false">
      <div class="el-upload__text">
        <svg viewBox="0 0 1024 1024" width="40" height="40">
          <path
            d="M666.2656 629.4528l-113.7664-112.4864c-20.7872-20.5824-54.3232-20.5312-75.1104 0.1024l-113.3056 112.4864c-20.8896 20.736-21.0432 54.528-0.256 75.4688 20.736 20.8896 54.528 21.0432 75.4688 0.256l22.6304-22.4256v189.5936c0 29.44 23.9104 53.3504 53.3504 53.3504s53.3504-23.9104 53.3504-53.3504v-189.5424l22.6816 22.4256a53.1456 53.1456 0 0 0 37.5296 15.4112c13.7728 0 27.4944-5.2736 37.9392-15.8208 20.6336-20.9408 20.4288-54.7328-0.512-75.4688z"
            fill="#FFE37B"></path>
          <path
            d="M820.992 469.504h-5.376c-3.072-163.328-136.3456-294.8096-300.4416-294.8096S217.856 306.1248 214.784 469.504H209.408c-100.7104 0-182.3744 81.664-182.3744 182.3744s81.664 182.3744 182.3744 182.3744h209.7664V761.856c-30.208 5.5808-62.464-3.3792-85.6576-26.7264-37.3248-37.5808-37.0688-98.5088 0.512-135.7824l113.3056-112.4864c37.2224-36.9664 97.8432-37.0176 135.168-0.1536l113.7664 112.4864c18.2272 18.0224 28.3648 42.0864 28.5184 67.7376 0.1536 25.6512-9.728 49.8176-27.7504 68.0448a95.40096 95.40096 0 0 1-68.3008 28.5184c-5.9392 0-11.776-0.512-17.5104-1.5872v72.3456h209.7664c100.7104 0 182.3744-81.664 182.3744-182.3744S921.7024 469.504 820.992 469.504z"
            fill="#8C7BFD"></path>
        </svg>
        <div>拖拽上传 / 点击上传</div>
      </div>
      <template v-if="listType === 'picture'">
        <div slot="tip" class="el-upload__tip">
          一次最多上传{{maxNumber}}张图片，且每张图片不超过{{maxSize}}M！
        </div>
      </template>
      <template v-else>
        <div slot="tip" class="el-upload__tip">
          一次最多上传{{maxNumber}}个文件，且每个文件不超过{{maxSize}}M！
        </div>
      </template>
    </el-upload>
    <div style="text-align: center;margin-top: 20px">
      <el-button type="success" style="font-size: 12px" @click="submitUpload">
        上传
      </el-button>
    </div>
  </div>
  <div v-else class="finish_room">
    <el-upload
      v-model="imgUrl"
      ref="upload"
      class="avatar-uploader"
      multiple
      drag
      :show-file-list="false"
      :action="uploadUrl"
      :data="qiniuParam"
      :on-change="handleChange"
      :before-upload="beforeUpload"
      :on-success="handleSuccess"
      :on-error="handleError"
      :list-type="listType"
      :accept="accept"
      :limit="maxNumber"
      :auto-upload="false">
<!--      <img v-if="imgUrl" :src="imgUrl" class="avatar">-->
      <el-image v-if="imgUrl" style="width: 100%; height: 100%" fit="contain" :src="imgUrl" />
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>

<script>
  import setting from '@/config/setting';

  export default {
    props: {
      isAdmin: {
        type: Boolean,
        default: false
      },
      prefix: {
        type: String,
        default: ""
      },
      listType: {
        type: String,
        default: "picture"
      },
      accept: {
        type: String,
        default: "image/*"
      },
      maxSize: {
        type: Number,
        default: 5
      },
      maxNumber: {
        type: Number,
        default: 5
      },
      value: {
        type: String,
        default() {
          return "";
        },
      },
    },

    data() {
      return {
        qiniuParam: {
          token: "",
          key: ""
        },
        uploadUrl: setting.qiniuUploadUrl,
        imgUrl: this.value,
        loading: false,
      }
    },
    computed: {},
    watch: {
      // 通过这个来实现父组件与子组件的值绑定
      value(val) {
        this.imgUrl = val;
      },
    },
    mounted() {},
    methods: {
      getUpToken() {
        return new Promise((resolve, reject) => {
          this.$http.get("/qiniu/up-token").then(res => {
            if (res.data.code === 0) {
              resolve(res.data.data.upToken);
            }
          }).catch((error) => {
            this.$message({
              message: error.message,
              type: "error"
            });
            reject(error.message)
          });
        })
      },
      async submitUpload() {
        this.qiniuParam.token = await this.getUpToken();
        this.$refs.upload.submit();
      },
      // 文件上传成功时的钩子
      handleSuccess(response) {
        this.qiniuParam.key = "";
        let url = setting.qiniuDownloadnUrl + "/" + response.key;
        this.imgUrl = url
        this.$emit("addPicture", url);
      },
      handleError() {
        this.qiniuParam.key = "";
        this.$message({
          message: "上传出错！",
          type: "warning"
        });
      },
      // 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传
      beforeUpload(file) {
        if (!this.qiniuParam.token) {
          this.$message({
            message: "上传出错！缺少必要值",
            type: "warning"
          });
          return false;
        }

        let suffix = "";
        if (file.name.lastIndexOf('.') !== -1) {
          suffix = file.name.substring(file.name.lastIndexOf('.'));
        }

        this.qiniuParam.key = this.prefix + "/" + new Date().getTime() + Math.floor(Math.random() * 1000) + suffix;
      },
      // 添加文件、上传成功和上传失败时都会被调用
      handleChange(file, fileList) {
        let flag = false;
        // if (!/image\/\w+/.test(file.type)) {
        //   this.$message({
        //     message: "必须上传图片！",
        //     type: "warning"
        //   });
        //   flag = true;
        // }

        if (file.size > this.maxSize * 1024 * 1024) {
          this.$message({
            message: "图片最大为" + this.maxSize + "M！",
            type: "warning"
          });
          flag = true;
        }

        if (flag) {
          fileList.splice(fileList.size - 1, 1);
        }

        if(this.isAdmin === false) {
          this.submitUpload()
        }
      },

      deleteImg(index) {
        this.photo.splice(index, 1);
        if (this.limit === 1) {
          this.$emit("input", "");
        } else {
          this.$emit("input", this.photo);
        }
        this.$emit("update:value", null);
      },
      compress(img) {
        var url = null;
        var canvas = document.createElement("canvas");
        var scale = img.height / img.width;
        canvas.width = 720;
        canvas.height = 720 * scale;

        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        url = canvas.toDataURL("image/jpeg");
        return url;
      },
      dataURItoBlob(dataURI) {
        let byteString = window.atob(dataURI.split(",")[1]);
        let mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
        let ab = new ArrayBuffer(byteString.length);
        let ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        return new window.Blob([ab], {type: mimeString});
      },
    }
  }
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
