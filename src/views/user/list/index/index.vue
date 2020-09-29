<template>
  <div style="background:#eeeeee;padding-top:10px;min-height:1000px;height:auto;">
    <div
      style="width:90%;margin-left:5%;margin-top:20px;background:#ffffff;min-height:450px;border-radius:3px;padding-bottom:10px;"
    >
      <div style="padding-bottom:10px;padding-top:10px;float:left;width:100%;">
        <el-row>
          <el-col :span="3">
            <div style="margin-top:3px;margin-left:0;font-size:18px;text-align:center;">员工账户管理</div>
          </el-col>
          <el-col :span="4">
            <el-input placeholder="手机号" v-model="searchName" class="input-with-select">
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
        <el-table-column prop="employee_mobile" label="手机号" width="200"></el-table-column>
        <el-table-column prop="user_type" label="账户类型" width="200">
          <template slot-scope="scope">
              <span v-if="scope.row.user_type == 'employee'">员工</span>
              <span v-if="scope.row.user_type == 'admin'">管理员</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="110">
          <template slot-scope="scope">
            <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="text" @click="delEdit(scope.row)">删除</el-button>
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

    <el-dialog title="账户详情" :visible.sync="dialogFormVisible">
      <el-form :model="form" ref="form" :rules="cellRules">
        <el-col :span="12">
              <el-form-item label="手机号" :label-width="formLabelWidth" prop="employee_mobile">
          <el-input
            ref="employee_mobile"
            name="employee_mobile"
            tabindex="1"
            v-model="form.employee_mobile"
            auto-complete="off"
          ></el-input>
        </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="账户类型" :label-width="formLabelWidth" prop="user_type">
              <el-select v-model="form.user_type" filterable placeholder="请选择">
                <el-option
                  label="员工"
                  value="employee"
                ></el-option>
                <el-option
                  label="管理员"
                  value="admin"
                ></el-option>
              </el-select>
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
import request from "@/utils/request";
import concans from "@/utils/concans";
export default {
  name: "Tab",
  data() {
    var validatePass = (rule, value, callback) => {
        if (value === '') {
          if(this.form.row.employee_id){
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
          if(this.form.row.employee_id&&this.form.password === ''){
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
      dialogFormVisible: false,
      dialogVisible: false,
      statusRow: {},
      statusText: "1",
      formLabelWidth: "120px",
      searchName: "",
      searchStatus: "",
      hasCharges: { "1": "支持", "2": "不支持" },
      form: {
        password:'',
        checkPass:'',
        row: {},
      },
      cellRules: {
        password: [
          { validator: validatePass, trigger: "blur" },
        ],
        checkPass: [
          { validator: validatePass2, trigger: "blur"},
        ],
        employee_mobile: [
          { required: true, trigger: "blur",message:'必填项' },
        ],
        user_type: [
          { required: true, trigger: "blur",message:'必填项' },
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
    this.getData({});
  },
  methods: {
    addcell(type) {
      console.log(type);
      this.form.row = {};
      this.form.car_type_name = "";
      this.dialogFormVisible = true;
    },
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.row.employee_id) {
            console.log(this.form)
            request({
              url: "https://" + concans.host + "/contract/adminEmployee/update",
              method: "post",
              data: {
                employee_id: this.form.row.employee_id,
                employee_mobile: this.form.employee_mobile,
                password: this.form.password,
                user_type: this.form.user_type,
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
              url: "https://" + concans.host + "/contract/adminEmployee/add",
              method: "post",
              data: {
                employee_mobile: this.form.employee_mobile,
                password: this.form.password,
                user_type: this.form.user_type,
                status: 1,
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
    delEdit(row) {
      if(!window.confirm('删除后将不能使用，请确认')){
        return false;
      }  
      request({
              url: "https://" + concans.host + "/contract/adminEmployee/delete",
              method: "post",
              data: {
                employee_id: this.form.row.employee_id
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
    },
    handleEdit(row) {
      console.log(row);
      this.form.row = row;
      this.form.employee_mobile = row.employee_mobile;
      this.form.user_type = row.user_type;
      this.dialogFormVisible = true;
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
      data.employee_mobile = this.searchName;
      console.log(data);
      request({
        url: concans.schema+"://" + concans.host + "/contract/adminEmployee/getList",
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
