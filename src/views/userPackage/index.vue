<template>
  <div style="background:#eeeeee;padding-top:10px;min-height:1000px;height:auto;">
    <div
      style="width:90%;margin-left:5%;margin-top:20px;background:#ffffff;min-height:450px;border-radius:3px;padding-bottom:10px;"
    >
      <div style="padding-bottom:10px;padding-top:10px;float:left;width:100%;">
        <el-row>
          <el-col :span="3">
            <div style="margin-top:3px;margin-left:0;font-size:18px;text-align:center;">用户停车包</div>
          </el-col>
          <el-col :span="3" align="center">
            <el-select v-model="searchStatus" placeholder="状态" style="width:120px;">
              <el-option label="全部状态" value></el-option>
              <el-option label="生效" value="1"></el-option>
              <el-option label="失效" value="2"></el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-input placeholder="用户手机号" v-model="searchTel" class="input-with-select">
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
        <el-table-column label="操作" min-width="110">
          <template slot-scope="scope">
            <el-button type="text" @click="handleEdit(scope.row)">修改时间</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="car_port_name" label="车棚名称" width="180"></el-table-column>
        <el-table-column prop="car_type_name" label="车辆类型" width="120">
        </el-table-column>
        <el-table-column prop="is_charging" label="是否可以充电" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.is_charging == 1">可以</span>
            <span v-if="scope.row.is_charging == 2">不可以</span>
          </template>
        </el-table-column>
        <el-table-column prop="user_stop_package_id" label="停车包id" width="80"></el-table-column>
        <el-table-column prop="user_charge_package_id" label="充电包id"" width="80"></el-table-column>
        <el-table-column prop="start_time" label="开始时间" width="160"></el-table-column>
        <el-table-column prop="end_time" label="结束时间" width="160"></el-table-column>
        <el-table-column prop="pay_money" label="pay_money" width="100"></el-table-column>
        <el-table-column prop="charge_pay_money" label="charge_pay_money" width="100"></el-table-column>
        <el-table-column prop="refund_money" label="refund_money" width="100"></el-table-column>
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

    <el-dialog title="修改时间" :visible.sync="dialogTimeVisible">
      <label>开始时间</label>
      <el-date-picker
                v-model="start_time"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                align="right"
                type="date"
                placeholder="选择日期"
              ></el-date-picker>
      <label>   结束时间</label>
      <el-date-picker
                v-model="end_time"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                align="right"
                type="date"
                placeholder="选择日期"
              ></el-date-picker>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTimeVisible = false">取 消</el-button>
        <el-button type="primary" @click="timeSubmit">确 定</el-button>
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
      start_time:'',
      end_time:'',
      dialogTimeVisible:false,
      searchTel: '',
      searchCode: '',
      dialogFormVisible: false,
      dialogVisible: false,
      statusRow: {},
      statusText: "1",
      formLabelWidth: "120px",
      searchName: "",
      searchStatus: "",
      hasCharges: { "1": "支持", "2": "不支持" },
      form: {
        car_type_name: "",
        has_charge: '',
        row: {},
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
    retryBack(row){
      request({
        url: concans.schema+"://" + concans.host + "/zenitoo-trans/payOrder/retryBack",
        method: "post",
        data: {
          id: row.id,
        },
      })
        .then((res) => {
          console.log(res);
          alert('补单完成');
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
    handleEdit(row){
      this.row = row;
      this.start_time = row.start_time;
      this.end_time = row.end_time;
      this.dialogTimeVisible = true;
    },
    timeSubmit(){
      request({
        url: concans.schema+"://" + concans.host + "/contract/adminOrder/updatePackageStartTime",
        method: "post",
        data: {
          user_stop_package_id: this.row.user_stop_package_id,
          start_time: this.start_time
        },
      })
        .then((res) => {
          console.log(res);
          this.dialogTimeVisible = false;
          this.getData({});
          this.$message.success('修改完成');
        })
        .catch((e) => {
          console.log(e);
        });
    },
    search() {
      this.getData({});
    },
    // 获取 表格数据
    getData(data) {
      data.pageSize = this.pageInfo.pageSize;
      data.pageNo = this.pageInfo.current_page;
      data.mobile = this.searchTel;
      data.is_active = this.searchStatus;
      console.log(data);
      request({
        url: concans.schema+"://" + concans.host + "/contract/adminOrder/getStopPackageList",
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
