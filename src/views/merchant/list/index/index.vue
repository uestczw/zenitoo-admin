<template>
  <div style="background:#eeeeee;padding-top:10px;min-height:1000px;height:auto;">
    <div
      style="width:90%;margin-left:5%;margin-top:20px;background:#ffffff;min-height:450px;border-radius:3px;padding-bottom:10px;"
    >
      <div style="padding-bottom:10px;padding-top:10px;float:left;width:100%;">
        <el-row>
          <el-col :span="3">
            <div style="margin-top:3px;margin-left:0;font-size:18px;text-align:center;">商户管理</div>
          </el-col>
          <el-col :span="3" align="center">
            <el-input placeholder="商户手机号" v-model="searchTel" class="input-with-select">   
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-input placeholder="商户编号" v-model="searchName" class="input-with-select">
              <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
            </el-input>
          </el-col>
          <el-col :span="3">
            <el-button
              type="primary"
              @click.native="addcell(1)"
              style="float:right;margin-right:10px;"
            >
              新增
              <i class="el-icon-plus el-icon--right"></i>
            </el-button>
          </el-col>
        </el-row>
      </div>
      <el-table
        :data="tableData"
        :empty-text="emptytext"
        :row-style="{height:'30px'}"
        :cell-style="{padding:0+'px'}"
        style="width: 94%;margin-left:3%;border:1px solid #eeeeee;min-height:40px;"
      >
        <el-table-column prop="alliance_sn" label="商户编号" width="180"></el-table-column>
        <el-table-column prop="alliance_name" label="商户名称" width="180"></el-table-column>
        <el-table-column prop="alliance_mobile" label="商户手机号">
        </el-table-column>
        <el-table-column label="操作" min-width="110">
          <template slot-scope="scope">
            <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination" style="width: 94%;margin-left:3%;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          layout="sizes,prev, pager, next,jumper,total"
          :total="pageInfo.total_items"
          :page-size="pageInfo.pageSize"
          :page-sizes="pageInfo.pageSizes"
          :current-page="pageInfo.current_page"
        ></el-pagination>
      </div>
    </div>

    <el-dialog title="商户详情" :visible.sync="dialogFormVisible">
      <el-form :model="form" ref="form" :rules="cellRules">
        <span>基础信息</span>
        <el-divider></el-divider>
        <el-row>
            <el-col :span="24">
              <el-form-item label="商户名称" :label-width="formLabelWidth" prop="alliance_name">
          <el-input
            ref="alliance_name"
            name="alliance_name"
            tabindex="1"
            v-model="form.alliance_name"
            auto-complete="off"
          ></el-input>
        </el-form-item>
            </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
              <el-form-item label="商户类型" :label-width="formLabelWidth" prop="alliance_type">
          <el-select
            ref="alliance_type"
            name="alliance_type"
            tabindex="1"
            v-model="form.alliance_type"
            auto-complete="off"
          >
            <el-option value="person" label="个人商户"/>
            <el-option value="business" label="企业商户"/>
          </el-select>
        </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="商户手机号" :label-width="formLabelWidth" prop="alliance_mobile">
          <el-input
            ref="alliance_mobile"
            name="alliance_mobile"
            tabindex="1"
            v-model="form.alliance_mobile"
            auto-complete="off"
          ></el-input>
        </el-form-item>
            </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
              <el-form-item label="证件名称" :label-width="formLabelWidth" prop="certificate_name">
          <el-input
            v-if="form.alliance_type == 'person'"
            placeholder="请输入身份证名称"
            ref="certificate_name"
            name="certificate_name"
            tabindex="1"
            v-model="form.certificate_name"
            auto-complete="off"
          ></el-input>
          <el-input
            v-if="form.alliance_type == 'business'"
            placeholder="请输入公司名称"
            ref="certificate_name"
            name="certificate_name"
            tabindex="1"
            v-model="form.certificate_name"
            auto-complete="off"
          ></el-input>
        </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="证件号码" :label-width="formLabelWidth" prop="car_type_name">
          <el-input
            v-if="form.alliance_type == 'person'"
            placeholder="请输入身份证号码"
            ref="certificate_code"
            name="certificate_code"
            tabindex="1"
            v-model="form.certificate_code"
            auto-complete="off"
          ></el-input>
          <el-input
            v-if="form.alliance_type == 'business'"
            placeholder="请输入营业执照号码"
            ref="certificate_code"
            name="certificate_code"
            tabindex="1"
            v-model="form.certificate_code"
            auto-complete="off"
          ></el-input>
        </el-form-item>
            </el-col>
        </el-row>
        <el-row>
        </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="登录密码" :label-width="formLabelWidth" prop="password">
          <el-input
            type="password"
            ref="password"
            name="password"
            tabindex="1"
            v-model="form.password"
            auto-complete="off"
          ></el-input>
        </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="确认密码" :label-width="formLabelWidth" prop="checkPass">
          <el-input
            type="password"
            ref="checkPass"
            name="checkPass"
            tabindex="1"
            v-model="form.checkPass"
            auto-complete="off"
          ></el-input>
        </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
              <el-form-item
          label="证件附件"
          :label-width="formLabelWidth"
          prop="car_type_name"
        >
          <el-upload
        :headers="headers"
        accept=".jpg,.png,.gif"
        class="upload-demo"
        :on-success="upsuccess"
        :file-list="fileList"
        :on-preview="onPreview"
        list-type="picture"
        action="https://gate.zenitoo.com/zenitoo-user/upload/file"
        multiple
      >
        <el-button type="primary">选择图片</el-button>
      </el-upload>
        </el-form-item>
            </el-col>
        </el-row>
        <span>结算账户信息</span>
        <el-divider></el-divider>
        <el-row>
            <el-col :span="12">
              <el-form-item label="户名" :label-width="formLabelWidth" prop="bank_account_name">
          <el-input
            ref="bank_account_name"
            name="bank_account_name"
            tabindex="1"
            v-model="form.bank_account_name"
            auto-complete="off"
          ></el-input>
        </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="账号" :label-width="formLabelWidth" prop="bank_card_number">
          <el-input
            ref="bank_card_number"
            name="bank_card_number"
            tabindex="1"
            v-model="form.bank_card_number"
            auto-complete="off"
          ></el-input>
        </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
              <el-form-item label="开户银行" :label-width="formLabelWidth" prop="bank_code">
          <el-select
                ref="bank_code"
                v-model="form.bank_code"
                filterable
                remote
                label-in-value
                placeholder="搜索银行"
                :remote-method="loadBanks"
              >
                <el-option
                  v-for="bank in banks"
                  :key="bank.cell_id"
                  :label="bank.cell_name"
                  :value="bank.cell_id"
                ></el-option>
              </el-select>
        </el-form-item>
            </el-col>
        </el-row>
      </el-form>
      
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span v-if="statusText == 1">确认是否禁用!</span>
      <span v-if="statusText == 2">确认是否启用!</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="statusSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth';
import request from "@/utils/request";
import concans from "@/utils/concans";
export default {
  name: "Tab",
  data() {
    //   request({
    //   url: 'http://127.0.0.1/zenitoo-user/user/test?time=1',
    //   method: 'get'
    // }).then((res) => {
    //   console.log(res)
    // }).catch((e) => {
    //   console.log(e)
    // })
    var validatePass = (rule, value, callback) => {
        if (value === '') {
          if(this.form.row.alliance_sn){
            callback();
          }else{
            callback(new Error('请输入密码'));
          }
        } else {
          if (this.form.checkPass !== '') {
            this.$refs.form.validateField('checkPass');
          }
          callback();
        }
      };
    var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          if(this.form.row.alliance_sn&&this.form.password === ''){
            callback();
          }else{
            callback(new Error('请再次输入密码'));
          }
        } else if (value !== this.form.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
    return {
      banks:[],
      searchTel:'',
      fileList:[],
      dialogFormVisible: false,
      dialogVisible: false,
      statusRow: {},
      statusText: "1",
      formLabelWidth: "120px",
      searchName: "",
      searchStatus: "",
      headers:{},
      hasCharges: { "1": "支持", "2": "不支持" },
      form: {
        alliance_type:'business',
        password:'',
        checkPass:'',
        row: {},
        alliance_sn: '',
        alliance_name: '',
        alliance_mobile: '',
        certificate_code: '',
        certificate_name: '',
        bank_code: '',
        bank_card_number: '',
        bank_account_name: '',
        status: 1,
      },
      cellRules: {
        password: [
          { validator: validatePass, trigger: "blur" },
        ],
        checkPass: [
          { validator: validatePass2, trigger: "blur"},
        ],
        alliance_type: [
          { required: true, trigger: "blur",message:'必填项' },
        ],
        alliance_name: [
          { required: true, trigger: "blur",message:'必填项' },
        ],
        alliance_mobile: [
          { required: true, trigger: "blur",message:'必填项' },
        ],
        certificate_code: [
          { required: true, trigger: "blur",message:'必填项' },
        ],
        certificate_name: [
          { required: true, trigger: "blur" ,message:'必填项'},
        ],
        bank_code: [
          { required: true, trigger: "blur" ,message:'必填项'},
        ],
        bank_card_number: [
          { required: true, trigger: "blur",message:'必填项' },
        ],
        bank_account_name: [
          { required: true, trigger: "blur",message:'必填项' },
        ],
        bank_name: [
          { required: true, trigger: "blur" ,message:'必填项'},
        ],
      },
      emptytext: "暂无数据",
      pageInfo: {
        total_items: 0,
        current_page: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100, 300, 400],
      },
      tableData: [],
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
        token:hasToken,
        "X-Requested-With": "XMLHttpRequest",
    };
    this.getData({});
  },
  methods: {
    loadBanks(value) {
      console.log("loadCell" + value);
      request({
        url: concans.schema+"://" + concans.host + "/contract/banck/getList",
        method: "get",
        params: { pageNo: 1, pageSize: 10, bank_name: value },
      })
        .then((res) => {
          this.banks = res.data.rows;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    upsuccess(response, file, fileList){
      file.serverUrl = response.data.path;
      console.log(response);
      console.log(file);
      console.log(fileList);
      this.fileList = fileList;
    },
    onPreview(file){

    },
    addcell(type) {
      console.log(type);
      this.form = {
        alliance_type:'business',
        password:'',
        checkPass:'',
        row: {},
        alliance_sn: '',
        alliance_name: '',
        alliance_mobile: '',
        certificate_code: '',
        certificate_name: '',
        bank_code: '',
        bank_card_number: '',
        bank_account_name: '',
        status: 1
      },
      this.dialogFormVisible = true;
    },
    handleSubmit() {
      if(!this.fileList.length||this.fileList.length == 0){
        this.$message.error('请上传证件图片!');
        return false;
      }
      var images = [];
      this.fileList.forEach((item)=>{
        images.push({
          url: item.serverUrl
        });
      });
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.row.alliance_sn) {
            console.log(this.form)
            request({
              url: "https://" + concans.host + "/contract/adminAlliance/update",
              method: "post",
              data: {
                alliance_sn: this.form.row.alliance_id,
                password: this.form.password,
                alliance_type: this.form.alliance_type,
                alliance_name: this.form.alliance_name,
                alliance_mobile: this.form.alliance_mobile,
                certificate_code: this.form.alliance_type =='person'?this.form.certificate_code:'',
                certificate_name: this.form.alliance_type =='person'?this.form.certificate_name:'',
                bank_code: this.form.bank_code,
                bank_card_number: this.form.bank_card_number,
                bank_account_name: this.form.bank_account_name,
                images: images,
                business_name: this.form.alliance_type =='business'?this.form.certificate_name:'',
                business_code: this.form.alliance_type =='business'?this.form.certificate_code:'',
                status: this.form.row.status,
              },
            })
              .then((res) => {
                console.log(res);
                this.dialogFormVisible = false;
                this.getData({});
              })
              .catch((e) => {
                console.log(e);
              });
          } else {
            request({
              url: "https://" + concans.host + "/contract/adminAlliance/add",
              method: "post",
              data: {
                password: this.form.password,
                alliance_type: this.form.alliance_type,
                alliance_name: this.form.alliance_name,
                alliance_mobile: this.form.alliance_mobile,
                certificate_code: this.form.alliance_type =='person'?this.form.certificate_code:'',
                certificate_name: this.form.alliance_type =='person'?this.form.certificate_name:'',
                bank_code: this.form.bank_code,
                bank_card_number: this.form.bank_card_number,
                bank_account_name: this.form.bank_account_name,
                images: images,
                business_name: this.form.alliance_type =='business'?this.form.certificate_name:'',
                business_code: this.form.alliance_type =='business'?this.form.certificate_code:'',
                status:1
              },
            })
              .then((res) => {
                console.log(res);
                this.dialogFormVisible = false;
                this.getData({});
              })
              .catch((e) => {
                console.log(e);
              });
          }
        } else {
          return false;
        }
      });
    },
    changeStatus(row) {
      this.statusRow = row;
      console.log(row.status);
      this.statusText = row.status;
      this.dialogVisible = true;
    },
    statusSubmit() {
      const row = this.statusRow;
      var status = 1;
      this.statusText = row.status;
      if (row.status === 1) {
        status = 2;
      } else {
        status = 1;
      }
      this.dialogVisible = false;
      console.log(status);
      request({
        url: concans.schema+"://" + concans.host + "/car-port/cartype/chargeStatus",
        method: "post",
        data: {
          car_type_id: row.car_type_id,
          status: status
        },
      })
        .then((res) => {
          console.log(res);
          this.statusRow = {};
          this.getData({});
        })
        .catch((e) => {
          console.log(e);
        });
    },
    handleEdit(row) {
      console.log(row);
      request({
        url: concans.schema+"://" + concans.host + "/contract/adminAlliance/getOne",
        method: "post",
        data: {
          alliance_sn: row.alliance_sn
        },
      })
        .then((res) => {
          console.log(res);
          res = res.data;
          this.form.row = row;
          this.form.alliance_type = res.alliance_type;
          this.form.alliance_name= res.alliance_name;
          this.form.alliance_mobile= res.alliance_mobile;
          this.form.certificate_code= res.alliance_type =='person'?res.certificate_code:res.business_code;
          this.form.certificate_name= res.alliance_type =='person'?res.certificate_name:res.business_name;
          this.form.bank_code= res.bank_code;
          this.form.bank_card_number= res.bank_card_number;
          this.form.bank_account_name= res.bank_account_name;
          if(res.images){
            var fileList = [];
          res.images.forEach((item)=>{
            //item.url = '/upfile/20200929153205/location.jpg';
            var index = item.url.lastIndexOf('/');
            var name = item.url.substring(index+1,item.url.length);
            fileList.push({
              name: name,
              url: 'https://gate.zenitoo.com/zenitoo-user/upload/show?path='+item.url,
              serverUrl: item.url
            });
          });
          //console.log(fileList);
          this.fileList = fileList;
          }
          this.dialogFormVisible = true;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    showCreatedTimes() {
      this.createdTimes = this.createdTimes + 1;
    },
    // 分页导航
    handleCurrentChange(val) {
      this.pageInfo.current_page = val;
      this.getData({});
    },
    handleSizeChange(val) {
      this.pageInfo.pageSize = val;
      this.getData({});
    },
    search() {
      this.getData({});
    },
    // 获取 表格数据
    getData(data) {
      data.pageSize = this.pageInfo.pageSize;
      data.pageNo = this.pageInfo.current_page;
      data.alliance_sn = this.searchName;
      data.alliance_mobile = this.searchTel;
      console.log(data);
      request({
        url: concans.schema+"://" + concans.host + "/contract/adminAlliance/getList",
        method: "get",
        params: data,
      })
        .then((res) => {
          console.log(this.pageInfo.current_page);
          this.tableData = res.data.rows;
          console.log(res.data.rows);
          this.pageInfo.total_items = res.data.total;
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
};
</script>
