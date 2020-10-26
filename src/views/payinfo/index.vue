<template>
  <div
    style="
      background: #eeeeee;
      padding-top: 10px;
      min-height: 1000px;
      height: auto;
    "
  >
    <div
      style="
        width: 90%;
        margin-left: 5%;
        margin-top: 20px;
        background: #ffffff;
        min-height: 450px;
        border-radius: 3px;
        padding-bottom: 10px;
      "
    >
      <div
        style="
          padding-bottom: 10px;
          padding-top: 10px;
          padding-right: 10px;
          float: left;
          width: 100%;
        "
      >
        <el-form :model="form" ref="form" :rules="cellRules">
          <el-row>
            <el-col :span="3">
              <div
                style="
                  margin-top: 3px;
                  margin-left: 0;
                  font-size: 18px;
                  text-align: center;
                "
              >
                支付信息配置
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item
                label="商户"
                :label-width="formLabelWidth"
                prop="alliance_id"
              >
                <el-select
                  ref="form.alliance_id"
                  v-model="form.alliance_id"
                  filterable
                  remote
                  label-in-value
                  placeholder="手机号搜索"
                  :remote-method="loadMers"
                  @change="serFriChange"
                >
                  <el-option
                    v-for="cell in serMers"
                    :key="cell.alliance_id"
                    :label="
                      cell.alliance_name + '(' + cell.alliance_mobile + ')'
                    "
                    :value="cell.alliance_id"
                  ></el-option> </el-select
              ></el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="收款方"
                :label-width="formLabelWidth"
                prop="is_mer_appid"
              >
                <el-select v-model="form.is_mer_appid" placeholder="请选择" @change="merc">
                  <el-option label="平台微信商户" value="N"></el-option>
                  <el-option
                    label="自有微信商户"
                    value="Y"
                  ></el-option> </el-select
              ></el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.is_mer_appid == 'Y'">
            <el-col :span="12">
              <el-form-item
                label="appid"
                :label-width="formLabelWidth"
                prop="appid"
              >
                <el-input
                  ref="form.appid"
                  name="appid"
                  tabindex="1"
                  v-model="form.appid"
                  auto-complete="off"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="商户号"
                :label-width="formLabelWidth"
                prop="mchid"
              >
                <el-input
                  ref="mchid"
                  name="mchid"
                  tabindex="1"
                  v-model="form.mchid"
                  auto-complete="off"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="支付密钥"
                :label-width="formLabelWidth"
                prop="pay_key"
              >
                <el-input
                  ref="pay_key"
                  name="pay_key"
                  tabindex="1"
                  v-model="form.pay_key"
                  auto-complete="off"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.is_mer_appid == 'Y'">
            <el-col :span="24">
              <el-form-item
                label="支付证书文件"
                :label-width="formLabelWidth"
                prop="car_type_name"
              >
                <el-upload
                  :headers="headers"
                  class="upload-demo"
                  :on-success="upsuccess"
                  :file-list="fileList"
                  :on-preview="onPreview"
                  list-type="picture"
                  :limit="1"
                  action="https://gate.zenitoo.com/zenitoo-trans/upload/certFile"
                  multiple
                >
                  <el-button type="primary">选择证书文件</el-button>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-row>
          <el-col :span="24" style="text-align: center">
            <el-button type="primary" @click="formSubmit" style="width: 300px"
              >确 定 修 改</el-button
            >
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import request from "@/utils/request";
import concans from "@/utils/concans";
export default {
  name: "Tab",
  data() {
    return {
      pay_type: "1",
      fileList: [],
      headers: {},
      serMers: [],
      serFriName: "",
      serFri: "",
      searchTel: "",
      searchCode: "",
      dialogFormVisible: false,
      dialogVisible: false,
      statusRow: {},
      statusText: "1",
      formLabelWidth: "120px",
      searchName: "",
      searchStatus: "",
      hasCharges: { 1: "支持", 2: "不支持" },
      form: {
        alliance_id: "",
        is_mer_appid: "",
        appid: "",
        mchid: "",
        pay_key: "",
      },
      cellRules: {
        alliance_id: [{ required: true, trigger: "change", message: "必填项" }],
        is_mer_appid: [{ required: true, trigger: "change", message: "必填项" }],
        appid: [{ required: true, trigger: "blur", message: "必填项" }],
        mchid: [{ required: true, trigger: "blur", message: "必填项" }],
        pay_key: [{ required: true, trigger: "blur", message: "必填项" }],
      },
    };
  },
  watch: {
    activeName(val) {
      //this.$router.push(`${this.$route.path}?tab=${val}`)
    },
    $route(to, from) {
      //监听路由是否变化
      //this.getData({});
    },
  },
  created() {
    const hasToken = getToken();
    this.headers = {
      token: hasToken,
      "X-Requested-With": "XMLHttpRequest",
    };

    this.getOne();
  },
  methods: {
    merc(value){
      if(value == 'Y'){
        this.form.appid= "";
        this.form.mchid= "";
        this.form.pay_key= "";
        this.fileList = [];
      }
    },
    upsuccess(response, file, fileList) {
      //file.serverUrl = response.data.path;
      if (response.head.code != 200) {
        this.$message.error(response.head.msg);
        this.fileList = [];
      } else {
        file.name = response.data.key;
        console.log(response);
        console.log(file);
        console.log(fileList);
        this.fileList = fileList;
      }
      console.log(response);
    },
    onPreview(file) {},
    serFriChange(value) {
      this.getOne(value);
    },
    loadMers(value) {
      console.log("loadMers" + value);
      request({
        url:
          concans.schema +
          "://" +
          concans.host +
          "/contract/adminAlliance/getList",
        method: "get",
        params: { pageNo: 1, pageSize: 10, alliance_mobile: value, alliance_sys_type:'admin'},
      })
        .then((res) => {
          this.serMers = res.data.rows;
        })
        .catch((e) => {
          //this.serMers = [{"alliance_id":23,"alliance_sn":"202010150957521885","alliance_name":"测试商户","user_id":114,"alliance_type":"business","alliance_mobile":"15114036655","status":1}];
          console.log(e);
        });
    },
    getOne(alliance_id) {
      var param = {alliance_sys_type:'admin'};
      if (alliance_id && alliance_id != "") {
        param.alliance_id = alliance_id;
      }
      request({
        url:
          concans.schema +
          "://" +
          concans.host +
          "/contract/adminAlliance/getPayConf",
        method: "get",
        params: param,
      })
        .then((res) => {
          this.serMers = [];
          if (res.data.alliance) {
            this.form.alliance_id = res.data.alliance.alliance_id;
            this.serMers.push(res.data.alliance);
          }
          if (res.data.payinfo) {
            this.form.is_mer_appid = res.data.payinfo.is_mer_appid;
            this.form.appid = res.data.payinfo.appid;
            this.form.mchid = res.data.payinfo.mchid;
            this.form.pay_key = res.data.payinfo.pay_key;
            this.fileList = [{ name: res.data.payinfo.pay_cert }];
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    formSubmit() {
      if(this.form.is_mer_appid=='Y'&&(!this.fileList||this.fileList.length==0)){
        this.$message.error('请上传证书文件');
        return false;
      }
      this.$refs.form.validate((valid) => {
        if (valid) {
          request({
              url: concans.schema+"://" + concans.host + "/contract/adminAlliance/setPayConf",
              method: "post",
              data: {
                alliance_id: this.form.alliance_id,
                is_mer_appid: this.form.is_mer_appid,
                appid: this.form.appid,
                mchid: this.form.mchid,
                pay_key: this.form.pay_key,
                pay_cert: this.fileList[0].name
              },
            })
              .then((res) => {
                console.log(res);
                this.dialogFormVisible = false;
                this.$message.success('保存完成');
              })
              .catch((e) => {
                console.log(e);
              });
        }
      });
    },
  },
};
</script>
