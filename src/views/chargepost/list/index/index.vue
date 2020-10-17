<template>
  <div style="background:#eeeeee;padding-top:10px;min-height:1000px;height:auto;">
    <div
      style="width:90%;margin-left:5%;margin-top:20px;background:#ffffff;min-height:450px;border-radius:3px;padding-bottom:10px;"
    >
      <div style="padding-bottom:10px;padding-top:10px;float:left;width:100%;">
        <el-row>
          <el-col :span="3">
            <div style="margin-top:3px;margin-left:0;font-size:18px;text-align:center;">充电桩管理</div>
          </el-col>
          <el-col :span="3" align="center">
            <el-select v-model="searchStatus" placeholder="状态" style="width:120px;">
              <el-option label="全部状态" value></el-option>
              <el-option label="启用" value="1"></el-option>
              <el-option label="停用" value="2"></el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-input placeholder="充电桩编号" v-model="searchPortSn" class="input-with-select"></el-input>
          </el-col>
          <el-col :span="4">
            <el-input placeholder="车棚名称" v-model="searchName" class="input-with-select">
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
        <el-table-column prop="post_sn" label="充电桩编号" width="120"></el-table-column>
        <el-table-column prop="car_port_name" label="车棚名称" width="180"></el-table-column>
        <el-table-column prop="port_numbers" label="端口数量" width="60"></el-table-column>
        <el-table-column prop="max_charge_time" label="最大充电时长"></el-table-column>
        <el-table-column prop="hardware_version" label="硬件版本" width="60"></el-table-column>
        <el-table-column prop="firmware_version" label="软件版本"  width="60"></el-table-column>
        <el-table-column prop="heart_time" label="心跳间隔时间"></el-table-column>
        <el-table-column prop="max_charge_power" label="最大充电功率"></el-table-column>
        <el-table-column prop="factory_name" label="厂家ID"></el-table-column>
        <el-table-column prop="charge_mode" label="充电控制模式">
          <template slot-scope="scope">{{chargeModes[scope.row.charge_mode]}}</template>
        </el-table-column>
        <el-table-column label="操作" min-width="200">
          <template slot-scope="scope">
            <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="text" @click="showewm(scope.row)">二维码</el-button>
            <el-button type="text" @click="resetPower(scope.row)">重启</el-button>
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

    <el-dialog title="添加充电桩" :visible.sync="dialogFormVisible">
      <el-form :model="form" ref="form" :rules="cellRules">
        <el-row>
          <el-col :span="12">
            <el-form-item label="所属车棚" :label-width="formLabelWidth" prop="car_port_id">
              <el-select
                :disabled="cellEditStatus"
                ref="form.car_port_id"
                v-model="form.car_port_id"
                filterable
                remote
                label-in-value
                placeholder="请输入关键词"
                :remote-method="loadCell"
                :loading="loading"
                :label="form.car_port_name"
              >
                <el-option
                  v-for="carport in carports"
                  :key="carport.car_port_id"
                  :label="carport.car_port_name"
                  :value="carport.car_port_id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="充电桩编号" :label-width="formLabelWidth" prop="post_sn">
              <el-input
                ref="post_sn"
                name="post_sn"
                tabindex="1"
                v-model="form.post_sn"
                auto-complete="off"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="端口数量" :label-width="formLabelWidth" prop="port_numbers">
              <el-input
                ref="port_numbers"
                name="port_numbers"
                tabindex="1"
                v-model="form.port_numbers"
                auto-complete="off"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最大充电时长" :label-width="formLabelWidth" prop="max_charge_time">
              <el-input
                ref="max_charge_time"
                name="max_charge_time"
                tabindex="1"
                v-model="form.max_charge_time"
                auto-complete="off"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="充电控制模式" :label-width="formLabelWidth" prop="charge_mode">
              <el-select v-model="form.charge_mode" filterable placeholder="请选择">
                <el-option
                  v-for="(value, key) in chargeModes"
                  ref="form.charge_mode"
                  :label="value"
                  :value="key"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="硬件版本" :label-width="formLabelWidth" prop="hardware_version">
              <el-input
                ref="hardware_version"
                name="hardware_version"
                tabindex="1"
                v-model="form.hardware_version"
                auto-complete="off"
                value="v1.0"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="软件版本" :label-width="formLabelWidth" prop="firmware_version">
              <el-input
                ref="firmware_version"
                name="firmware_version"
                tabindex="6"
                v-model="form.firmware_version"
                auto-complete="off"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="心跳间隔时间" :label-width="formLabelWidth" prop="heart_time">
              <el-input
                ref="heart_time"
                name="heart_time"
                tabindex="7"
                v-model="form.heart_time"
                auto-complete="off"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="厂家" :label-width="formLabelWidth" prop="factory_id">
              <el-select v-model="form.factory_id" filterable placeholder="请选择">
                <el-option
                  v-for="item in factorys"
                  ref="form.factory_id"
                  :label="item.factory_name"
                  :value="item.factory_id+''"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最大充电功率" :label-width="formLabelWidth" prop="max_charge_power">
              <el-input
                ref="max_charge_power"
                name="max_charge_power"
                tabindex="1"
                v-model="form.max_charge_power"
                auto-complete="off"
                value="v1.0"
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

    <el-dialog title="批量添加充电桩" :visible.sync="dialogPlVisible">
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

    <el-dialog title="二维码" :visible.sync="dialogEwm" width="340px">
      <img :src="ewmurl" width="300px" height="300px" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogEwm = false">取 消</el-button>
        <el-button type="primary" @click="loadewm">下载二维码</el-button>
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
    //   request({
    //   url: 'http://127.0.0.1/zenitoo-user/user/test?time=1',
    //   method: 'get'
    // }).then((res) => {
    //   console.log(res)
    // }).catch((e) => {
    //   console.log(e)
    // })
    return {
      dialogPlVisible: false,
      dialogEwm: false,
      ewmurl: "",
      addnumbers: 10,
      loading: false,
      cellEditStatus: false,
      carports: [],
      timeout: null,
      searchPortSn: "",
      searchAreaParams: { type: 2 },
      searchAreaRet: {},
      dialogFormVisible: false,
      dialogVisible: false,
      statusRow: {},
      statusText: "1",
      formLabelWidth: "120px",
      searchName: "",
      searchStatus: "",
      chargeModes: {},
      factorys: {},
      form: {
        car_port_id: "",
        car_port_name: "",
        post_sn: "",
        port_numbers: "2",
        charge_mode: "",
        status: "",
        max_charge_time: "10",
        hardware_version: "v1.0",
        firmware_version: "v1.0",
        heart_time: "10",
        factory_id: "",
        max_charge_power: "5000",
        row: {},
      },
      cellRules: {
        post_sn: [
          { required: true, trigger: "blur", message: "请输入充电桩编号" },
        ],
        port_numbers: [
          { required: true, trigger: "blur", message: "请输入端口数量" },
        ],
        max_charge_time: [
          { required: true, trigger: "blur", message: "请输入最大充电时长" },
        ],
        charge_mode: [
          { required: true, trigger: "change", message: "请选择充电控制模式" },
        ],
        hardware_version: [
          { required: true, trigger: "blur", message: "请输入固件版本号" },
        ],
        car_port_id: [
          { required: true, trigger: "change", message: "请选择车棚" },
        ],
        firmware_version: [
          { required: true, trigger: "blur", message: "请输入软件版本号" },
        ],
        factory_id: [
          { required: true, trigger: "change", message: "请选择厂家" },
        ],
        max_charge_power: [
          { required: true, trigger: "blur", message: "请输入最大充电功率" },
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
    this.loadChargeMode();
    this.loadFactory();
  },
  methods: {
    resetPower(row) {
      request({
        url: concans.schema + "://" + concans.host + "/car-port/admin/post/reStart",
        timeout: 5000,
        method: "post",
        data: { post_sn: row.post_sn },
      })
        .then((res) => {
          console.log(res);
          this.$message.success("重启成功!");
        })
        .catch((e) => {
          console.log(e);
        });
    },
    showewm(row) {
      var url =
        concans.schema +
        "://" +
        concans.host +
        "/zenitoo-user/qrcode/load?code_sn=" +
        row.post_sn;
      this.dialogEwm = true;
      this.ewmurl = url;
    },
    loadewm(code_sn) {
      window.open(this.ewmurl, "target=_blank");
      this.dialogEwm = false;
    },
    getSysArea(pid, callback) {
      request({
        url: concans.schema + "://" + concans.host + "/car-port/sys/areaCode",
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
    loadChargeMode() {
      request({
        url: concans.schema + "://" + concans.host + "/car-port/sys/sysConf",
        timeout: 5000,
        method: "post",
        params: { key_type: "charge_mode" },
      })
        .then((res) => {
          console.log(res);
          this.chargeModes = res.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    loadFactory() {
      request({
        url:
          concans.schema + "://" + concans.host + "/car-port/sys/factoryList",
        timeout: 5000,
        method: "post",
        params: { factory_type: "charge_post" },
      })
        .then((res) => {
          console.log(res);
          this.factorys = res.data;
          this.form.factory_id = "1";
        })
        .catch((e) => {
          console.log(e);
        });
    },
    addcell(type) {
      this.dialogPlVisible = true;
    },
    addAll() {
      request({
        url:
          concans.schema +
          "://" +
          concans.host +
          "/car-port/admin/chargepost/buildSN",
        method: "get",
        params: {
          numbers: this.addnumbers,
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
          if (this.form.row.charge_post_id) {
            console.log(this.form);
            request({
              url:
                concans.schema +
                "://" +
                concans.host +
                "/car-port/admin/chargepost/update",
              method: "post",
              data: {
                car_port_id: this.form.car_port_id,
                post_sn: this.form.post_sn,
                port_numbers: this.form.port_numbers,
                charge_mode: this.form.charge_mode,
                status: this.form.row.status,
                max_charge_time: this.form.max_charge_time,
                hardware_version: this.form.hardware_version,
                firmware_version: this.form.firmware_version,
                heart_time: this.form.heart_time,
                factory_id: this.form.factory_id,
                max_charge_power: this.form.max_charge_power,
                charge_post_id: this.form.row.charge_post_id,
                port_numbers_array: "",
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
              url:
                concans.schema +
                "://" +
                concans.host +
                "/car-port/admin/chargepost/add",
              method: "post",
              data: {
                interval_rate: this.form.interval_rate,
                deposit_money: this.form.deposit_money,
                car_port_name: this.form.car_port_name,
                charge_mode: this.form.charge_mode,
                has_charge: this.form.has_charge,
                cell_id: this.form.cell_id,
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
        url:
          concans.schema +
          "://" +
          concans.host +
          "/car-port/admin/chargepost/updatePostStatus",
        method: "post",
        data: {
          car_port_id: row.car_port_id,
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
      if (row.car_port_id && row.car_port_id !== 0) {
        this.cellEditStatus = true;
      } else {
        this.cellEditStatus = false;
      }
      this.form.row = row;
      if (row.car_port_id && row.car_port_id !== 0) {
        this.carports = [row];
        this.form.car_port_id = row.car_port_id;
        this.form.car_port_name = row.car_port_name;
      } else {
        this.form.car_port_id = "";
        this.form.car_port_name = "";
      }

      this.form.post_sn = row.post_sn;
      if (row.port_numbers && row.port_numbers !== 0) {
        this.form.port_numbers = row.port_numbers;
      } else {
        this.form.port_numbers = 2;
      }

      if (row.max_charge_time && row.max_charge_time !== 0) {
        this.form.max_charge_time = row.max_charge_time;
      } else {
        this.form.max_charge_time = 10;
      }

      if (row.hardware_version && row.hardware_version !== "") {
        this.form.hardware_version = row.hardware_version;
      } else {
        this.form.hardware_version = "v1.0";
      }

      if (row.firmware_version && row.firmware_version !== "") {
        this.form.firmware_version = row.firmware_version;
      } else {
        this.form.firmware_version = "v1.0";
      }

      if (row.heart_time && row.heart_time !== 0) {
        this.form.heart_time = row.heart_time;
      } else {
        this.form.heart_time = 10;
      }

      if (row.max_charge_power && row.max_charge_power !== 0) {
        this.form.max_charge_power = row.max_charge_power;
      } else {
        this.form.max_charge_power = 5000;
      }

      if (row.factory_id && row.factory_id !== 0) {
        this.form.factory_id = row.factory_id;
      } else {
        this.form.factory_id = "1";
      }

      if (row.charge_mode && row.charge_mode !== 0) {
        this.form.charge_mode = row.charge_mode;
      } else {
        this.form.charge_mode = "owner";
      }

      this.form.status = row.status + "";
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
    loadCell(value) {
      console.log("loadCell" + value);
      request({
        url:
          concans.schema + "://" + concans.host + "/car-port/admin/carport/getList",
        method: "get",
        params: { pageNo: 1, pageSize: 10, car_port_name: value },
      })
        .then((res) => {
          this.carports = res.data.rows;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    cellchange(value) {
      let obj = {};
      obj = this.cells.find((item) => {
        return item.cell_id === value;
      });
      this.form.carport_name = obj.cell_name + "智能车棚";
      console.log(obj.cell_name);
    },
    // 获取 表格数据
    getData(data) {
      var district_code = "";
      data.pageSize = this.pageInfo.pageSize;
      data.pageNo = this.pageInfo.current_page;
      data.car_port_name = this.searchName;
      data.cell_sn = this.searchSn;
      data.status = this.searchStatus;
      data.port_sn = this.searchPortSn;
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
        url:
          concans.schema +
          "://" +
          concans.host +
          "/car-port/admin/chargepost/getList",
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
