<template>
  <div style="background:#eeeeee;padding-top:10px;min-height:1000px;height:auto;">
    <div
      style="width:90%;margin-left:5%;margin-top:20px;background:#ffffff;min-height:450px;border-radius:3px;padding-bottom:10px;"
    >
      <div style="padding-bottom:10px;padding-top:10px;float:left;width:100%;">
        <el-row>
          <el-col :span="3">
            <div style="margin-top:3px;margin-left:0;font-size:18px;text-align:center;">系统卡片管理</div>
          </el-col>
          <el-col :span="3" align="center">
            <el-select v-model="searchStatus" placeholder="状态" style="width:120px;">
              <el-option label="全部状态" value></el-option>
              <el-option label="未绑定" value="1"></el-option>
              <el-option label="已绑定" value="2"></el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-input placeholder="卡片编号" v-model="searchCardSn" class="input-with-select">
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
        <el-table-column prop="card_sn" label="卡片编号" width="180"></el-table-column>
        <el-table-column prop="is_bind" label="是否绑定用户" width="180">
          <template slot-scope="scope">
            <span v-if="scope.row.is_bind == 1" type="text">未绑定</span>
            <span v-if="scope.row.is_bind == 2" type="text">已绑定</span>
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

    <el-dialog title="卡片详情" :visible.sync="dialogFormVisible">
      <el-form :model="form" ref="form" :rules="cellRules">
        <el-row>
          <el-col v-if="form.row.sys_card_id" :span="24">
            <el-form-item label="绑定用户" :label-width="formLabelWidth" prop="user_id">
              <el-select
                ref="form.user_id"
                v-model="form.user_id"
                filterable
                remote
                label-in-value
                placeholder="请输入手机号"
                :remote-method="loadUser"
                :loading="loading"
                :label="form.user_id"
              >
                <el-option
                  v-for="user in users"
                  :key="user.id"
                  :label="user.name+'('+user.tel+')'"
                  :value="user.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="卡片编号" :label-width="formLabelWidth" prop="post_sn">
          <el-input
            ref="card_sn"
            name="card_sn"
            tabindex="1"
            v-model="form.card_sn"
            auto-complete="off"
          ></el-input>
        </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="批量添加卡片" :visible.sync="dialogPlVisible">
      <label>新增数量</label>
      <el-input
                ref="addnumbers"
                name="addnumbers"
                tabindex="7"
                v-model="addnumbers"
                auto-complete="off"
              ></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPlVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAll">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
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
    return {
      users:[],
      searchCardSn:'',
      dialogPlVisible: false,
      addnumbers: 10,
      loading: false,
      cellEditStatus: false,
      carports: [],
      timeout: null,
      searchPortSn: '',
      searchAreaParams: { type: 2 },
      searchAreaRet: {},
      dialogFormVisible: false,
      dialogVisible: false,
      statusRow: {},
      statusText: "1",
      formLabelWidth: "120px",
      searchName: "",
      searchStatus: "",
      chargeModes:{},
      factorys:{},
      form: {
        user_id: "",
        card_sn: '',
        row: {},
      },
      cellRules: {
        card_sn: [
          { required: true, trigger: "blur", message: "请输入卡片编号" },
        ]
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
      this.form.card_sn = '';
      this.form.user_id = '';
      this.dialogFormVisible = true
    },
    addAll() {
      request({
              url: concans.schema+"://" + concans.host + "/car-port/user/buildCardSN",
              method: "post",
              data: {
                numbers: this.addnumbers
              },
            })
              .then((res) => {
                console.log(res);
                this.dialogPlVisible = false;
                this.getData({});
              })
              .catch((e) => {
                console.log(e);
              });
    },
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.row.sys_card_id) {
            console.log(this.form)
            request({
              url: concans.schema+"://" + concans.host + "/car-port/adminuser/updateCard",
              method: "post",
              data: {
                card_sn: this.form.card_sn,
                query_user_id: this.form.user_id,
                card_id: this.form.row.sys_card_id,
                status: 0
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
              url: concans.schema+"://" + concans.host + "/car-port/user/addSysCard",
              method: "post",
              data: {
                card_sn: this.form.card_sn
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
        url: concans.schema+"://" + concans.host + "/car-port/chargepost/updatePostStatus",
        method: "post",
        data: {
          car_port_id: row.car_port_id,
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
      this.form.row = row;
      this.form.card_sn = row.card_sn;
      this.form.user_id = row.user_id;
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
    loadUser(value) {
      console.log('loadUser'+value)
      request({
        url: concans.schema+"://" + concans.host + "/zenitoo-user/user/queryListByTel",
        method: "post",
        data: { pageNo: 1, pageSize: 10, tel: value },
      })
        .then((res) => {
          this.users = res.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    // 获取 表格数据
    getData(data) {
      data.pageSize = this.pageInfo.pageSize;
      data.pageNo = this.pageInfo.current_page;
      data.card_sn = this.searchCardSn;
      data.is_bind = this.searchStatus;
      console.log(data);
      request({
        url: concans.schema+"://" + concans.host + "/car-port/user/sysCardList",
        method: "post",
        data: data,
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
