<template>
  <div style="background:#eeeeee;padding-top:10px;min-height:1000px;height:auto;">
    <div
      style="width:90%;margin-left:5%;margin-top:20px;background:#ffffff;min-height:450px;border-radius:3px;padding-bottom:10px;"
    >
      <div style="padding-bottom:10px;padding-top:10px;float:left;width:100%;">
        <el-row>
          <el-col :span="3">
            <div style="margin-top:3px;margin-left:0;font-size:18px;text-align:center;">充电中订单</div>
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
        <el-table-column prop="charge_sn" label="订单编号" width="180"></el-table-column>
        <el-table-column prop="car_port_name" label="车棚名称" width="180"></el-table-column>
        <el-table-column prop="user_mobile" label="用户" width="120">
        </el-table-column>
        <el-table-column prop="start_time" label="开始时间" width="160">
        </el-table-column>
        <el-table-column prop="power" label="电瓶伏数" width="180">
            <template slot-scope="scope">
              {{scope.row.start_power}}-{{scope.row.end_power}}
            </template>
        </el-table-column>
        <el-table-column prop="user_charge_minute" label="预充时间" width="180"></el-table-column>
        <el-table-column prop="prepare_money" label="预付金额" width="180"></el-table-column>
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
    search() {
      this.getData({});
    },
    // 获取 表格数据
    getData(data) {
      data.pageSize = this.pageInfo.pageSize;
      data.pageNo = this.pageInfo.current_page;
      data.tel = this.searchTel;
      data.app_key = 'ZENITOO_PRO';
      console.log(data);
      request({
        url: concans.schema+"://" + concans.host + "/contract/adminOrder/runChargeList",
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
