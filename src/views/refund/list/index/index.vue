<template>
  <div style="background:#eeeeee;padding-top:10px;min-height:1000px;height:auto;">
    <div
      style="width:90%;margin-left:5%;margin-top:20px;background:#ffffff;min-height:450px;border-radius:3px;padding-bottom:10px;"
    >
      <div style="padding-bottom:10px;padding-top:10px;float:left;width:100%;">
        <el-row>
          <el-col :span="3">
            <div style="margin-top:3px;margin-left:0;font-size:18px;text-align:center;">用户退款管理</div>
          </el-col>
          <el-col :span="4">
            <el-input placeholder="订单号"" v-model="searchCode" class="input-with-select">
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-select v-model="searchStatus" placeholder="状态"">
              <el-option label="全部状态" value></el-option>
              <el-option label="未审核" value="create"></el-option>
              <el-option label="已退款" value="refund"></el-option>
              <el-option label="已审核" value="checked"></el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-input placeholder="用户电话" v-model="searchTel" class="input-with-select">
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
        <el-table-column prop="refund_money" label="退款金额(元)" width="120"></el-table-column>
        <el-table-column prop="create_time" label="创建时间" width="180"></el-table-column>
        <el-table-column prop="refund_sn" label="退款单编号" width="160"></el-table-column>
        <el-table-column prop="order_sn" label="订单编号" width="160"></el-table-column>
        <el-table-column prop="user_id" label="用户id" width="120"></el-table-column>
        <el-table-column prop="has_charge" label="审核状态">
          <template slot-scope="scope">
              <label v-if="scope.row.status == 'create'">未审核</label>
              <label v-if="scope.row.status == 'checked'">已审核</label>
              <label v-if="scope.row.status == 'refund'">已退款</label>
        </template>
        </el-table-column>
        <el-table-column label="操作" min-width="200">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status == 'create'" type="text" @click="refund(scope.row,1)">审核通过</el-button>
            <el-button v-if="scope.row.status == 'create'" type="text" @click="refund(scope.row,2)">审核不通过</el-button>
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
    refund(row,type){
      if(type == 1){
        if(!window.confirm('审核通过将直接企业付款到零钱，请确认!')){
          return false;
        }
      }else{
        this.$message({
          message: '暂不支持审核不通过',
          type: 'error'
        });
        return false;
      }
      request({
        url: concans.schema+"://" + concans.host + "/123",
        method: "post",
        data: {
          id: row.id,
        },
      })
        .then((res) => {
          console.log(res);
          alert('审核完成');
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
      data.busOrderId = this.searchCode;
      console.log(data);
      request({
        url: concans.schema+"://" + concans.host + "/contract/adminRefund/getList ",
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
