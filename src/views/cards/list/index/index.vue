<template>
  <div style="background:#eeeeee;padding-top:10px;min-height:1000px;height:auto;">
    <div
      style="width:90%;margin-left:5%;margin-top:20px;background:#ffffff;min-height:450px;border-radius:3px;padding-bottom:10px;"
    >
      <div style="padding-bottom:10px;padding-top:10px;float:left;width:100%;">
        <el-row>
          <el-col :span="3">
            <div style="margin-top:3px;margin-left:0;font-size:18px;text-align:center;">用户卡片管理</div>
          </el-col>
          <el-col :span="3" align="center">
            <el-select
                ref="user_id"
                v-model="user_id"
                filterable
                remote
                label-in-value
                placeholder="手机号查询用户"
                :remote-method="loadUser"
                :loading="loading"
                :label="user_id"
              >
                <el-option
                  v-for="user in users"
                  :key="user.id"
                  :label="user.tel"
                  :value="user.id"
                ></el-option>
              </el-select>
          </el-col>
          <el-col :span="4">
            <el-input placeholder="卡片编号" v-model="searchCardSn" class="input-with-select">
              <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
            </el-input>
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
        <el-table-column prop="user_id" label="用户id" width="180"></el-table-column>
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

    <el-dialog title="卡片详情" :visible.sync="dialogFormVisible">
      <el-form :model="form" ref="form" :rules="cellRules">
        <el-row>
          <el-col :span="24">
            <el-form-item label="用户Id" :label-width="formLabelWidth" prop="user_id">
              <span>{{form.user_id}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="卡片编号" :label-width="formLabelWidth" prop="card_sn">
              <el-select
                ref="form.card_sn"
                v-model="form.card_sn"
                filterable
                remote
                label-in-value
                placeholder="请输卡片编号"
                :remote-method="loadCard"
                :loading="loading"
                :label="form.card_sn"
              >
                <el-option
                  v-for="card in cards"
                  :key="card.card_sn"
                  :label="card.card_sn"
                  :value="card.card_sn"
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
      user_id:'',
      cards:[],
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
          if (this.form.row.card_id) {
            console.log(this.form)
            request({
              url: concans.schema+"://" + concans.host + "/car-port/adminuser/updateCard",
              method: "post",
              data: {
                card_sn: this.form.card_sn,
                query_user_id: this.form.user_id,
                card_id: this.form.row.card_id,
                status: this.form.row.status
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
    loadCard(value) {
      console.log('loadCard'+value)
      request({
        url: concans.schema+"://" + concans.host + "/car-port/user/sysCardList",
        method: "post",
        data: { pageNo: 1, pageSize: 10,is_bind:1, card_sn: value },
      })
        .then((res) => {
          this.cards = res.data.rows;
        })
        .catch((e) => {
          console.log(e);
        });
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
      data.card_sn = this.searchSn;
      data.query_user_id = this.user_id;
      console.log(data);
      request({
        url: concans.schema+"://" + concans.host + "/car-port/adminuser/cardList",
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
