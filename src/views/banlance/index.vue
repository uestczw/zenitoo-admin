<template>
  <div style="background:#eeeeee;padding-top:10px;min-height:1000px;height:auto;">
    <div
      style="width:90%;margin-left:5%;margin-top:20px;background:#ffffff;min-height:450px;border-radius:3px;padding-bottom:10px;"
    >
      <div style="padding-bottom:10px;padding-top:10px;float:left;width:100%;">
        <el-row>
          <el-col :span="3">
            <div style="margin-top:3px;margin-left:0;font-size:18px;text-align:center;">日统计列表</div>
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
          <el-col :span="4">
            <el-button icon="el-icon-search" @click="search" value="查询">查询</el-button>
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
        <el-table-column label="操作" min-width="80">
          <template slot-scope="scope">
            <el-button type="text" @click="info(scope.row)">详情</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="account_day_id" label="account_day_id" width="180"></el-table-column>
        <el-table-column prop="alliance_id" label="alliance_id" width="180">
        </el-table-column>
        <el-table-column prop="date_time" label="date_time" width="180"></el-table-column>
        <el-table-column prop="money" label="money" width="180"></el-table-column>
        <el-table-column prop="statement_status" label="statement_status" width="180"></el-table-column>
        <el-table-column prop="admin_user_id" label="admin_user_id" width="180"></el-table-column>
        <el-table-column prop="create_time" label="create_time" width="180"></el-table-column>
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

    <el-dialog title="详情" :visible.sync="dialogVisible" width="60%">
      <el-table
        :data="tableData"
        :empty-text="emptytext"
        :row-style="{height:'40px'}"
        :cell-style="{padding:0+'px'}"
        style="width: 94%;margin-left:3%;border:1px solid #eeeeee;min-height:40px;"
      >
        <el-table-column prop="account_day_id" label="account_day_id" width="180"></el-table-column>
        <el-table-column prop="alliance_id" label="alliance_id" width="180">
        </el-table-column>
        <el-table-column prop="date_time" label="date_time" width="180"></el-table-column>
        <el-table-column prop="money" label="money" width="180"></el-table-column>
        <el-table-column prop="statement_status" label="statement_status" width="180"></el-table-column>
        <el-table-column prop="admin_user_id" label="admin_user_id" width="180"></el-table-column>
        <el-table-column prop="create_time" label="create_time" width="180"></el-table-column>
        <el-table-column prop="alliance_name" label="alliance_name" width="180"></el-table-column>
        <el-table-column prop="alliance_mobile" label="alliance_mobile" width="180"></el-table-column>
      </el-table>
      <div class="pagination" style="width: 94%;margin-left:3%;">
        <el-pagination
          @size-change="handleDetailSizeChange"
          @current-change="handleDetailCurrentChange"
          layout="sizes,prev, pager, next,jumper,total"
          :total="pageDetail.total_items"
          :page-size="pageDetail.pageSize"
          :page-sizes="pageDetail.pageSizes"
          :current-page="pageDetail.current_page"
        ></el-pagination>
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
      tableDetail:[],
      pageDetail: {
        total_items: 0,
        current_page: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100, 300, 400],
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
    this.getData({});
  },
  methods: {
    info(row){
      this.dialogVisible = true;
      this.getDetailData(row.date_time);
    },
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
    handleDetailCurrentChange(val) {
      this.pageDetail.current_page = val;
      this.getDetailData({});
    },
    handleDetailSizeChange(val) {
      this.pageDetail.pageSize = val;
      this.getDetailData({});
    },
    search() {
      this.getData({});
    },
    // 获取 表格数据
    getData(data) {
      data.pageSize = this.pageInfo.pageSize;
      data.pageNo = this.pageInfo.current_page;
      data.tel = this.searchTel;
      data.start_time = this.start_time;
      data.end_time = this.end_time;
      console.log(data);
      request({
        url: concans.schema+"://" + concans.host + "/contract/adminAccount/getDayList",
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
    // 获取 表格数据
    getDetailData(date_time) {
      var data = {};
      data.pageSize = this.pageDetail.pageSize;
      data.pageNo = this.pageDetail.current_page;
      data.date_time = date_time;
      console.log(data);
      request({
        url: concans.schema+"://" + concans.host + "/contract/adminAccount/getList",
        method: "post",
        data: data,
      })
        .then((res) => {
          console.log(this.pageDetail.current_page);
          this.tableDetail = res.data.rows;
          console.log(res.data.rows);
          this.pageDetail.total_items = res.data.total;
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
};
</script>
