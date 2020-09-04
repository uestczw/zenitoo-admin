<template>
  <div style="background:#eeeeee;padding-top:10px;min-height:1000px;height:auto;">
    <el-tabs v-if="1==2" v-model="activeName" style="margin-top:15px;" type="border-card">
      <el-tab-pane
        v-for="item in tabMapOptions"
        :key="item.key"
        :label="item.label"
        :name="item.key"
      >
        <keep-alive>
          <tab-pane v-if="activeName==item.key" :type="item.key" @create="showCreatedTimes" />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
    <div
      style="width:90%;margin-left:5%;margin-top:20px;background:#ffffff;min-height:450px;border-radius:3px;padding-bottom:10px;"
    >
      <div style="padding-bottom:10px;padding-top:10px;float:left;width:100%;">
        <el-row>
          <el-col :span="3">
            <div style="margin-top:3px;margin-left:0;font-size:18px;text-align:center;">小区管理</div>
          </el-col>
          <el-col :span="9">
            <area-pane :params="searchAreaParams" :ret="searchAreaRet"></area-pane>
          </el-col>
          <el-col :span="2">
            <el-input placeholder="小区编号" v-model="searchSn" class="input-with-select"></el-input>
          </el-col>
          <el-col :span="3" align="center">
            <el-select v-model="searchStatus" placeholder="状态" style="width:120px;">
              <el-option label="全部" value></el-option>
              <el-option label="启用" value="1"></el-option>
              <el-option label="停用" value="2"></el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-input placeholder="小区名称" v-model="searchName" class="input-with-select">
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
        <!--<el-dropdown style="float:right;margin-right:10px;">
  <el-button type="primary"  @click.native="addcell(1)">
    新增<i class="el-icon-arrow-down el-icon--right"></i>
  </el-button>
  <el-dropdown-menu slot="dropdown">
    <el-dropdown-item @click.native="addcell(1)">小区</el-dropdown-item>
  </el-dropdown-menu>
        </el-dropdown>-->
      </div>
      <el-table
        :data="tableData"
        :empty-text="emptytext"
        :row-style="{height:'30px'}"
        :cell-style="{padding:0+'px'}"
        style="width: 94%;margin-left:3%;border:1px solid #eeeeee;min-height:40px;"
      >
        <el-table-column prop="create_time" label="创建时间" width="180"></el-table-column>
        <el-table-column prop="cell_name" label="小区名称" width="180"></el-table-column>
        <el-table-column prop="detail_address" label="地址"></el-table-column>
        <el-table-column label="操作" min-width="110">
          <template slot-scope="scope">
            <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button v-if="scope.row.status == 1" type="text" @click="changeStatus(scope.row)">禁用</el-button>
            <el-button v-if="scope.row.status == 2" type="text" @click="changeStatus(scope.row)">启用</el-button>
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

    <el-dialog title="添加小区" :visible.sync="dialogFormVisible">
      <el-form :model="form" ref="form" :rules="cellRules">
        <el-form-item label="小区名称" :label-width="formLabelWidth" prop="cell_name">
          <el-input
            ref="cell_name"
            name="cell_name"
            tabindex="1"
            v-model="form.cell_name"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item label="省" :label-width="formLabelWidth" prop="pro">
              <el-select
                @change="proChange"
                v-model="form.pro"
                ref="pro"
                name="pro"
                tabindex="2"
                placeholder="请选择省份"
                style="width:120px;"
              >
                <el-option v-for="item in pros" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="市" :label-width="formLabelWidth" prop="city">
              <el-select
                @change="cityChange"
                v-model="form.city"
                ref="city"
                name="city"
                tabindex="3"
                placeholder="请选择城市"
                style="width:120px;"
              >
                <el-option v-for="item in citys" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="区" :label-width="formLabelWidth" prop="district_code">
              <el-select
                ref="district_code"
                name="district_code"
                tabindex="4"
                v-model="form.district_code"
                placeholder="请选择区域"
                style="width:120px;"
              >
                <el-option v-for="item in regions" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="详细地址" :label-width="formLabelWidth" prop="detail_address">
          <el-input
            ref="detail_address"
            name="detail_address"
            tabindex="5"
            v-model="form.detail_address"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="精度" :label-width="formLabelWidth" prop="latitude">
              <el-input
                ref="latitude"
                name="latitude"
                tabindex="6"
                v-model="form.latitude"
                auto-complete="off"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="维度" :label-width="formLabelWidth" prop="longitude">
              <el-input
                ref="longitude"
                name="longitude"
                tabindex="7"
                v-model="form.longitude"
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
import TabPane from "../components/TabPane";
import AreaPane from "../components/AreaPane";
import concans from "@/utils/concans";
export default {
  name: "Tab",
  components: { TabPane, AreaPane },
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
      searchAreaParams: { type: 2 },
      searchAreaRet: {},
      dialogFormVisible: false,
      dialogVisible: false,
      statusRow: {},
      statusText: "1",
      formLabelWidth: "120px",
      searchName: "",
      searchSn: "",
      searchStatus: "",
      form: {
        cell_name: "",
        pro: "",
        city: "",
        district_code: "",
        longitude: 0,
        latitude: 0,
        detail_address: "",
        row: {},
      },
      cellRules: {
        cell_name: [
          { required: true, trigger: "blur", message: "请输入小区名称" },
        ],
        pro: [{ required: true, trigger: "change", message: "请选择省份" }],
        city: [{ required: true, trigger: "change", message: "请选择成熟" }],
        district_code: [
          { required: true, trigger: "change", message: "请选择区县" },
        ],
        longitude: [{ required: true, trigger: "blur", message: "请输入维度" }],
        latitude: [{ required: true, trigger: "blur", message: "请输入精度" }],
        detail_address: [
          { required: true, trigger: "blur", message: "请输入详细地址" },
        ],
      },
      pros: [],
      citys: [],
      regions: [],
      tabMapOptions: [
        { label: "China", key: "CN" },
        { label: "USA", key: "US" },
        { label: "Japan", key: "JP" },
        { label: "Eurozone", key: "EU" },
      ],
      activeName: "CN",
      createdTimes: 0,
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
    // init the default selected tab
    const tab = this.$route.query.tab;
    if (tab) {
      this.activeName = tab;
    }
    this.getSysArea("0", (data) => {
      this.pros = [];
      data.forEach((item) => {
        this.pros.push({
          name: item.district_name,
          value: item.district_code,
        });
      });
    });
    this.getData({});
  },
  methods: {
    getSysArea(pid, callback) {
      request({
        url: "https://" + concans.host + "/car-port/sys/areaCode",
        timeout: 5000,
        method: "post",
        data: { pid: pid },
      })
        .then((res) => {
          console.log(res);
          callback(res.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    proChange(value, cityTmp, district_code_tmp) {
      this.citys = [];
      this.form.city = "";
      this.form.district_code = "";
      this.regions = [];
      this.getSysArea(value, (data) => {
        data.forEach((item) => {
          this.citys.push({
            name: item.district_name,
            value: item.district_code,
          });
        });
        if (cityTmp) {
          this.form.pro = value;
          this.form.city = cityTmp;
          this.cityChange(cityTmp, district_code_tmp);
        }
      });
    },
    cityChange(value, district_code_tmp) {
      this.form.district_code = "";
      this.regions = [];
      this.getSysArea(value, (data) => {
        data.forEach((item) => {
          this.regions.push({
            name: item.district_name,
            value: item.district_code,
          });
        });
        if (district_code_tmp) {
          this.form.district_code = district_code_tmp;
        }
      });
    },
    addcell(type) {
      console.log(type);
      this.form.row = {};
      this.form.cell_name = "";
      this.form.latitude = 0;
      this.form.longitude = 0;
      this.form.district_code = "";
      this.form.detail_address = "";
      this.form.status = 1;
      this.dialogFormVisible = true;
    },
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.row.cell_id) {
            request({
              url: "https://" + concans.host + "/car-port/cell/update",
              method: "post",
              data: {
                cell_name: this.form.cell_name,
                latitude: this.form.latitude,
                longitude: this.form.longitude,
                district_code: this.form.district_code,
                detail_address: this.form.detail_address,
                cell_id: this.form.row.cell_id,
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
              url: "https://" + concans.host + "/car-port/cell/add",
              method: "post",
              data: {
                cell_name: this.form.cell_name,
                latitude: this.form.latitude,
                longitude: this.form.longitude,
                district_code: this.form.district_code,
                detail_address: this.form.detail_address,
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
        url: "https://" + concans.host + "/car-port/cell/update",
        method: "post",
        data: {
          cell_name: row.cell_name,
          latitude: row.latitude,
          longitude: row.longitude,
          district_code: row.district_code,
          detail_address: row.detail_address,
          cell_id: row.cell_id,
          status: status,
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
      this.form.cell_name = row.cell_name;
      this.form.latitude = row.latitude;
      this.form.longitude = row.longitude;
      this.form.district_code = row.district_code;
      this.form.detail_address = row.detail_address;
      this.form.status = 1;
      this.dialogFormVisible = true;
      const protmp = row.district_code.substring(0, 2) + "0000";
      const citytmp = row.district_code.substring(0, 4) + "00";
      console.log(protmp);
      this.proChange(protmp, citytmp, row.district_code);
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
      var district_code = "";
      data.pageSize = this.pageInfo.pageSize;
      data.pageNo = this.pageInfo.current_page;
      data.cell_name = this.searchName;
      data.cell_sn = this.searchSn;
      data.status = this.searchStatus;
      if (this.searchAreaRet.region && this.searchAreaRet.region !== "") {
        district_code = this.searchAreaRet.region;
      } else if (this.searchAreaRet.city && this.searchAreaRet.city !== "") {
        district_code = this.searchAreaRet.city.substring(0, 4);
      } else if (this.searchAreaRet.pro && this.searchAreaRet.pro !== "") {
        district_code = this.searchAreaRet.pro.substring(0, 2);
      }
      data.district_code = district_code;
      console.log(data);
      request({
        url: "https://" + concans.host + "/car-port/cell/getList",
        method: "get",
        params: data,
      })
        .then((res) => {
          console.log(this.pageInfo.current_page);
          this.tableData = res.data.rows;
          /*
          res.data.rows.forEach((item) => {
            this.tableData.push({
              create_time: item.create_time,
              cell_name: item.cell_name,
              detail_address: item.detail_address,
              cell_id: item.cell_id,
              cell_sn: item.cell_sn,
              district_code: item.district_code,
              status: item.status
            });
          });*/
          this.pageInfo.total_items = res.data.total;
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
};
</script>
