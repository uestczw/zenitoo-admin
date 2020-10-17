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
          float: left;
          width: 100%;
        "
      >
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
              结算审核
            </div>
          </el-col>
          <el-col :span="5">
            <el-date-picker
              v-model="start_time"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              align="right"
              type="date"
              placeholder="开始日期"
            >
            </el-date-picker>
          </el-col>
          <el-col :span="5">
            <el-date-picker
              v-model="end_time"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              align="right"
              type="date"
              placeholder="结束日期"
            >
            </el-date-picker>
          </el-col>
          <el-col :span="2">
            <el-select placeholder="状态" v-model="settle_type">
              <el-option value="" label="全部"></el-option>
              <el-option value="waiting" label="待审批"></el-option>
              <el-option value="payed" label="已付款"></el-option>
              <el-option value="reject" label="已驳回"></el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-input
              placeholder="手机号"
              v-model="searchTel"
              class="input-with-select"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="search"
              ></el-button>
            </el-input>
          </el-col>
        </el-row>
      </div>
      <el-table
        :data="tableData"
        :empty-text="emptytext"
        :row-style="{ height: '30px' }"
        :cell-style="{ padding: 0 + 'px' }"
        style="
          width: 94%;
          margin-left: 3%;
          border: 1px solid #eeeeee;
          min-height: 40px;
        "
      >
        <el-table-column label="操作" min-width="120">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.statement_status == 'waiting'"
              type="text"
              @click="checkStatus(scope.row)"
              >通过</el-button
            >
            <el-button
              v-if="scope.row.statement_status == 'waiting'"
              type="text"
              @click="checkStatus(scope.row)"
              >驳回</el-button
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="settle_sn"
          label="settle_sn"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="money"
          label="money"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="statement_status"
          label="statement_status"
          width="180"
        ></el-table-column>
        <el-table-column prop="create_time" label="create_time" width="160">
        </el-table-column>
        <el-table-column prop="start_date" label="start_date" width="120">
        </el-table-column>
        <el-table-column prop="end_date" label="end_date" width="120">
        </el-table-column>
        <el-table-column prop="settle_type" label="settle_type" width="120">
        </el-table-column>
        <el-table-column prop="alliance_name" label="alliance_name" width="120">
        </el-table-column>
        <el-table-column
          prop="alliance_mobile"
          label="alliance_mobile"
          width="120"
        >
        </el-table-column>
      </el-table>
      <div class="pagination" style="width: 94%; margin-left: 3%">
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

    <el-dialog title="结算申请" :visible.sync="dialogVisible" width="35%">
      <el-form :model="form" ref="form" :rules="cellRules">
        <el-row>
          <el-col :span="24">
            <el-form-item
              label="结算周期日期"
              :label-width="formLabelWidth"
              prop="contract_id"
            >
              <el-date-picker
                v-model="form.start_time"
                type="daterange"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                start-placeholder="开始日期"
                @change="countMoney"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </el-form-item> </el-col
        ></el-row>

        <el-row v-if="form.settle_money != ''">
          <el-col :span="24">
            <el-form-item
              label="结算金额"
              :label-width="formLabelWidth"
              prop="contract_id"
            >
              {{ form.settle_money }}元
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item
              label="提现方式"
              :label-width="formLabelWidth"
              prop="contract_id"
            >
              <el-select @change="checkType" v-model="form.settle_type">
                <el-option value="wechat" label="微信"></el-option>
                <el-option value="bank" label="银行卡"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="settleSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="dialogCheckVisible" width="30%">
      <el-input type="textarea" :rows="2" placeholder="备注" v-model="mark">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogCheckVisible = false">取 消</el-button>
        <el-button type="primary" @click="checkStatusSubmit('payed')"
          >通 过</el-button
        >
        <el-button type="primary" @click="checkStatusSubmit('reject')"
          >驳 回</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUser } from "@/utils/auth";
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
      mark: "",
      dialogCheckVisible: false,
      settle_type: "",
      start_time: "",
      end_time: "",
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
      wechatStatus: "",
      form: {
        start_time: [],
        end_time: "",
        settle_type: "",
        settle_money: "",
      },
      cellRules: {
        car_type_name: [
          { required: true, trigger: "blur", message: "请输入名称" },
        ],
        has_charge: [
          { required: true, trigger: "change", message: "请选择是否支持充电" },
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
    checkStatusSubmit(check_status) {
        if(!this.mark||this.mark == ''){
          this.$message.error('请输入备注信息');
          return false;
        }
      console.log(check_status);
      request({
        url:
          concans.schema +
          "://" +
          concans.host +
          "/contract/adminAccount/checkSettle",
        method: "post",
        data: {
          settle_sn: this.row.settle_sn,
          statement_status: check_status,
          mark: "" + this.mark,
        },
      })
        .then((res) => {
          this.dialogCheckVisible = false;
          this.getData({});
          console.log(res);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    checkStatus(row) {
      this.dialogCheckVisible = true;
      this.row = row;
    },
    checkType(value) {
      if (value == "bank") {
        return false;
      }
      if (this.wechatStatus != "") {
        if (this.wechatStatus == "FAIL") {
          this.form.settle_type = "";
          this.$message.error("请先在智能车棚小程序绑定您的手机号注册");
          return false;
        } else {
          return false;
        }
      }
      var u = getUser();
      var user = JSON.parse(u);
      request({
        url:
          concans.schema +
          "://" +
          concans.host +
          "/zenitoo-user/user/checkWechatSmall",
        method: "post",
        data: {
          userId: user.id,
        },
      })
        .then((res) => {
          this.wechatStatus = res.data;
          if (res.data == "FAIL") {
            this.form.settle_type = "";
            this.$message.error("请先在智能车棚小程序绑定您的手机号注册");
          }
          console.log(res);
        })
        .catch((e) => {
          this.form.settle_type = "";
          this.$message.error("查询您的小程序注册信息失败");
          console.log(e);
        });
    },
    countMoney() {
      console.log(this.form.start_time);
      if (this.form.start_time.length == 2) {
        request({
          url:
            concans.schema +
            "://" +
            concans.host +
            "/contract/adminAccount/getSettleMoney",
          method: "post",
          data: {
            start_time: this.form.start_time[0],
            end_time: this.form.start_time[1],
          },
        })
          .then((res) => {
            this.form.settle_money = "" + res.data.money;
            console.log(res);
          })
          .catch((e) => {
            console.log(e);
            this.$message.error("计算费用失败");
          });
      }
    },
    settleSubmit() {
      request({
        url:
          concans.schema +
          "://" +
          concans.host +
          "/contract/adminAccount/userApplySettle",
        method: "post",
        data: {
          start_time: this.form.start_time[0],
          end_time: this.form.start_time[1],
          settle_type: this.form.settle_type,
        },
      })
        .then((res) => {
          console.log(res);
          this.dialogVisible = false;
          this.getData({});
        })
        .catch((e) => {
          console.log(e);
        });
    },
    addSettle() {
      this.dialogVisible = true;
    },
    retryBack(row) {
      request({
        url:
          concans.schema +
          "://" +
          concans.host +
          "/zenitoo-trans/payOrder/retryBack",
        method: "post",
        data: {
          id: row.id,
        },
      })
        .then((res) => {
          console.log(res);
          alert("补单完成");
        })
        .catch((e) => {
          console.log(e);
        });
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
      data.alliance_name = this.searchTel;
      data.start_time = this.start_time;
      data.end_time = this.end_time;
      console.log(data);
      request({
        url:
          concans.schema +
          "://" +
          concans.host +
          "/contract/adminAccount/getSettleList",
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
