<template>
  <div style="background:#eeeeee;padding-top:10px;min-height:1000px;height:auto;width:100%;">
    <div
      style="width:90%;margin-left:5%;margin-top:20px;background:#ffffff;min-height:450px;border-radius:3px;padding-bottom:10px;"
    >
      <div style="padding-bottom:10px;padding-top:10px;float:left;width:100%;">
        <el-row>
          <el-col :span="3">
            <div style="margin-top:3px;margin-left:0;font-size:18px;text-align:center;">车棚管理</div>
          </el-col>
          <el-col :span="9">
            <area-pane :params="searchAreaParams" :ret="searchAreaRet"></area-pane>
          </el-col>
          <el-col :span="3" align="center">
            <el-select v-model="searchStatus" placeholder="状态" style="width:120px;">
              <el-option label="全部状态" value></el-option>
              <el-option label="启用" value="1"></el-option>
              <el-option label="停用" value="2"></el-option>
            </el-select>
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
        <el-table-column prop="car_port_id" label="车棚id" width="180"></el-table-column>
        <el-table-column prop="car_port_name" label="车棚名称" width="180"></el-table-column>
        <el-table-column prop="deposit_money" label="进场押金(元)"></el-table-column>
        <el-table-column prop="interval_rate" label="临停汇率(元)"></el-table-column>
        <el-table-column prop="has_charge" label="是否支持充电">
          <template slot-scope="scope">{{hasCharges[scope.row.has_charge]}}</template>
        </el-table-column>
        <el-table-column prop="charge_mode" label="充电控制模式">
          <template slot-scope="scope">{{chargeModes[scope.row.charge_mode]}}</template>
        </el-table-column>
        <el-table-column label="操作" min-width="110">
          <template slot-scope="scope">
            <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button v-if="scope.row.status == 1" type="text" @click="changeStatus(scope.row)">禁用</el-button>
            <el-button v-if="scope.row.status == 2" type="text" @click="changeStatus(scope.row)">启用</el-button>
            <el-button type="text" @click="editDoor(scope.row)">门禁管理</el-button>
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

    <el-dialog title="添加车棚" :visible.sync="dialogFormVisible" width="75%">
      <el-form :model="form" ref="form" :rules="cellRules">
        <el-row>
          <el-col :span="8">
            <el-form-item label="关联合同" :label-width="formLabelWidth" prop="contract_id">
              <el-select
                ref="form.contract_id"
                v-model="form.contract_id"
                filterable
                remote
                label-in-value
                placeholder="请输入关键词"
                :remote-method="loadContract"
                style="float:left;width:70%;"
              >
                <el-option
                  v-for="cell in contracts"
                  :key="cell.contract_id"
                  :label="cell.contract_code"
                  :value="cell.contract_id"
                ></el-option>
              </el-select>
              <el-button style="float:left;" @click="showContract">查看</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属小区" :label-width="formLabelWidth" prop="cell_id">
              <el-select
                :disabled="cellEditStatus"
                ref="form.cell_id"
                v-model="form.cell_id"
                filterable
                remote
                label-in-value
                placeholder="请输入关键词"
                :remote-method="loadCell"
                :loading="loading"
                :label="form.cell_name"
                @change="cellchange"
              >
                <el-option
                  v-for="cell in cells"
                  :key="cell.cell_id"
                  :label="cell.cell_name"
                  :value="cell.cell_id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
<el-row>
          <el-col :span="8">
        <el-form-item label="车棚名称" :label-width="formLabelWidth" prop="car_port_name">
          <el-input
            ref="car_port_name"
            name="car_port_name"
            tabindex="1"
            v-model="form.car_port_name"
            auto-complete="off"
          ></el-input>
        </el-form-item>
 </el-col>
 <el-col :span="8">
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
          <el-col :span="8">
            <el-form-item label="是否支持充电" :label-width="formLabelWidth" prop="has_charge">
              <el-select v-model="form.has_charge" filterable placeholder="请选择">
                <el-option
                  v-for="(value, key) in hasCharges"
                  ref="form.has_charge"
                  :label="value"
                  :value="key"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="押金(元)" :label-width="formLabelWidth" prop="deposit_money">
              <el-input
                oninput="value=value.replace(/[^\d.]/g,'')"
                ref="deposit_money"
                name="deposit_money"
                tabindex="6"
                v-model="form.deposit_money"
                auto-complete="off"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="临停汇率(元)" :label-width="formLabelWidth" prop="interval_rate">
              <el-input
                oninput="value=value.replace(/[^\d.]/g,'')"
                ref="interval_rate"
                name="interval_rate"
                tabindex="7"
                v-model="form.interval_rate"
                auto-complete="off"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="一月折扣" :label-width="formLabelWidth" prop="discount_price_1">
              <el-input
                
                oninput="value=value.replace(/[^\d.]/g,'')"
                ref="discount_price_1"
                name="discount_price_1"
                tabindex="6"
                v-model="form.discount_price_1"
                auto-complete="off"
                :disabled="!form.edit_1_status"
              >
                <el-checkbox v-model="form.edit_1_status" slot="prepend"></el-checkbox>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="三月折扣" :label-width="formLabelWidth" prop="discount_price_3">
              <el-input
                oninput="value=value.replace(/[^\d.]/g,'')"
                ref="discount_price_3"
                name="discount_price_3"
                tabindex="6"
                v-model="form.discount_price_3"
                auto-complete="off"
                :disabled="!form.edit_3_status"
              >
                <el-checkbox v-model="form.edit_3_status" slot="prepend"></el-checkbox>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="半年折扣" :label-width="formLabelWidth" prop="discount_price_6">
              <el-input
                oninput="value=value.replace(/[^\d.]/g,'')"
                ref="form.discount_price_6"
                name="form.discount_price_6"
                tabindex="6"
                v-model="form.discount_price_6"
                auto-complete="off"
                :disabled="!form.edit_6_status"
              >
                <el-checkbox v-model="form.edit_6_status" slot="prepend"></el-checkbox>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="一年折扣" :label-width="formLabelWidth" prop="discount_price_12">
              <el-input
                oninput="value=value.replace(/[^\d.]/g,'')"
                ref="discount_price_12"
                name="discount_price_12"
                tabindex="6"
                v-model="form.discount_price_12"
                auto-complete="off"
                :disabled="!form.edit_12_status"
              >
                <el-checkbox v-model="form.edit_12_status" slot="prepend"></el-checkbox>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
            <el-col :span="17"><label style="float:left;width:120px;text-align:right;padding-right:12px;">包月停车费用</label></el-col>
        </el-row>
        <el-row>
        <el-col :span="24">
                <div style="width:100%;padding-left:120px;">
          <el-table
            :data="form.cartypes"
            :empty-text="emptytext"
            :row-style="{height:'40px'}"
            :cell-style="{padding:3+'px'}"
            style=";border:1px solid #eeeeee;min-height:40px;"
          >
            <el-table-column label width="80">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.isCheck"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column prop="car_type_name" label="车辆类型" width="100"></el-table-column>
            <el-table-column label="单月价格(元)" width="300">
              <template slot-scope="scope">
                <span v-if="scope.row.isCheck">
                  <el-form-item :prop="'cartypes.'+scope.$index+'.stop_price'" :rules="cellRules.stop_price">
                  <el-input
                    oninput="value=value.replace(/[^\d.]/g,'')"
                    size="mini"
                    v-model="scope.row.stop_price"
                  ></el-input>
                  </el-form-item>
                </span>
                <span v-else></span>
              </template>
            </el-table-column>
          </el-table>
                </div></el-col></el-row>
          <el-row>
            <el-col :span="8"><label style="float:left;width:120px;text-align:right;padding-right:12px;">包月充电费用</label></el-col>
            <el-col :span="4">
              <el-input
                :disabled="true"
                oninput="value=value.replace(/[^\d]/g,'')"
                ref="startV"
                name="startV"
                tabindex="7"
                v-model="startV"
                auto-complete="off"
              ></el-input>
            </el-col>
            <el-col :span="2" align="center"><span style="line-height:40px;">至</span></el-col>
            <el-col :span="4">
              <el-input
                placeholder="伏特"
                oninput="value=value.replace(/[^\d]/g,'')"
                ref="endV"
                name="endV"
                tabindex="7"
                v-model="endV"
                auto-complete="off"
              ></el-input>
            </el-col>
            <el-col :span="6">
              <el-button
                type="primary"
                @click.native="addpowver()"
                style="float:right;margin-right:10px;"
              >
                新增
                <i class="el-icon-plus el-icon--right"></i>
              </el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
                <div style="width:100%;padding-left:120px;">
          <el-table
            :data="form.powvers"
            :empty-text="emptytext"
            :row-style="{height:'40px'}"
            :cell-style="{padding:3+'px'}"
            style=";border:1px solid #eeeeee;min-height:40px;"
          >
            <el-table-column prop="start_power" label="最小伏数" width="80">
              <template slot-scope="scope">
                <span>{{scope.row.start_power}}v</span>
              </template>
            </el-table-column>
            <el-table-column prop="end_power" label="最大伏数" width="80">
              <template slot-scope="scope">
                <span>{{scope.row.end_power}}v</span>
              </template>
            </el-table-column>
            <el-table-column prop="step_start_time" label="起步时长" width="90">
              <template slot-scope="scope">
                <el-form-item :prop="'powvers.'+scope.$index+'.step_start_time'" :rules="cellRules.mustinput">
                  <el-input
                    placeholder="小时"
                    oninput="value=value.replace(/[^\d]/g,'')"
                    size="mini"
                    v-model="scope.row.step_start_time"
                  ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="step_start_price" label="起步价格" width="90">
              <template slot-scope="scope">
                <el-form-item :prop="'powvers.'+scope.$index+'.step_start_price'" :rules="cellRules.mustinput">
                  <el-input
                    placeholder="元"
                    oninput="value=value.replace(/[^\d.]/g,'')"
                    size="mini"
                    v-model="scope.row.step_start_price"
                  ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="step_second_time" label="后续步长" width="90">
              <template slot-scope="scope">
                <el-form-item :prop="'powvers.'+scope.$index+'.step_second_time'" :rules="cellRules.mustinput">
                  <el-input
                    placeholder="小时"
                    oninput="value=value.replace(/[^\d]/g,'')"
                    size="mini"
                    v-model="scope.row.step_second_time"
                  ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="step_second_price" label="后续价格" width="90">
              <template slot-scope="scope">
                <el-form-item :prop="'powvers.'+scope.$index+'.step_second_price'" :rules="cellRules.mustinput">
                  <el-input
                    placeholder="元"
                    oninput="value=value.replace(/[^\d.]/g,'')"
                    size="mini"
                    v-model="scope.row.step_second_price"
                  ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="charge_price" label="单月价格" width="90">
              <template slot-scope="scope">
                <el-form-item :prop="'powvers.'+scope.$index+'.charge_price'" :rules="cellRules.mustinput">
                  <el-input
                    placeholder="元"
                    oninput="value=value.replace(/[^\d.]/g,'')"
                    size="mini"
                    v-model="scope.row.charge_price"
                  ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="valid_month" label="单月时长" width="90">
              <template slot-scope="scope">
                <el-form-item :prop="'powvers.'+scope.$index+'.charge_time_len'" :rules="cellRules.mustinput">
                  <el-input
                    placeholder="小时"
                    oninput="value=value.replace(/[^\d.]/g,'')"
                    size="mini"
                    v-model="scope.row.charge_time_len"
                  ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="max_time_len" label="单次时长" width="90">
              <template slot-scope="scope">
                <el-form-item :prop="'powvers.'+scope.$index+'.max_time_len'" :rules="cellRules.mustinput">
                  <el-input
                    placeholder="小时"
                    oninput="value=value.replace(/[^\d.]/g,'')"
                    size="mini"
                    v-model="scope.row.max_time_len"
                  ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="power_threshold" label="最大电量" width="90">
              <template slot-scope="scope">
                <el-form-item :prop="'powvers.'+scope.$index+'.power_threshold'" :rules="cellRules.mustinput">
                  <el-input
                    placeholder="度"
                    oninput="value=value.replace(/[^\d.]/g,'')"
                    size="mini"
                    v-model="scope.row.power_threshold"
                  ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="60">
              <template slot-scope="scope">
                <el-button type="text" @click="powerdel(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
                </div></el-col></el-row>
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
    var valid_month = (rule, value, callback) => {
        //console.log(rule.month);
        var key = 'edit_'+rule.month+'_status';
        if (this.form[key]) {
          if (value === '') {
          callback(new Error('勾选必填'));
        } else {
          var patt = /^0$|^1$|^0\.\d+$/;
          var f = patt.test(value);
          if(!f){
            callback(new Error('请输入0-1之间的小数'));
          }else{
            callback();
          }
        }
        }else{
          callback();
        }
        
      };
    return {
      startV: 0,
      endV: "",
      loading: false,
      cellEditStatus: false,
      cells: [],
      contracts:[],
      timeout: null,
      searchAreaParams: { type: 2 },
      searchAreaRet: {},
      dialogFormVisible: false,
      dialogVisible: false,
      statusRow: {},
      statusText: "1",
      formLabelWidth: "120px",
      searchName: "",
      searchStatus: "",
      chargeModes: [],
      hasCharges: { "1": "支持", "2": "不支持" },
      cartypescache: [],
      form: {
        cell_id: "",
        cell_name: "",
        car_port_name: "",
        interval_rate: "",
        deposit_money: "",
        charge_mode: "",
        status: "",
        has_charge: "",
        discount_price_1: "",
        discount_price_3: "",
        discount_price_6: "",
        discount_price_12: "",
        edit_1_status: false,
        edit_3_status: false,
        edit_6_status: false,
        edit_12_status: false,
        cartypes: [],
        powvers: [],
        row: {},
      },
      cellRules: {
        interval_rate: [
          { required: true, trigger: "blur", message: "请输入临停费用" },
        ],
        deposit_money: [
          { required: true, trigger: "blur", message: "请输入进场押金" },
        ],
        discount_price_1: [
          { validator: valid_month, trigger: "blur",month:1 },
        ],
        discount_price_3: [
          { validator: valid_month, trigger: "blur",month:3 },
        ],
        discount_price_6: [
          { validator: valid_month, trigger: "blur",month:6 },
        ],
        discount_price_12: [
          { validator: valid_month, trigger: "blur",month:12 },
        ],
        stop_price: [
          { required: true, trigger: "blur", message: "请输入包月费用" },
        ],
        car_port_name: [
          { required: true, trigger: "blur", message: "请输入车棚名称" },
        ],
        charge_mode: [
          { required: true, trigger: "change", message: "请选择充电控制模式" },
        ],
        has_charge: [
          { required: true, trigger: "change", message: "请选择是否支持充电" },
        ],
        cell_id: [{ required: true, trigger: "change", message: "请选择小区" }],
        mustinput: [{ required: true, trigger: "blur", message: "必填" }],
        contract_id: [{ required: true, trigger: "change", message: "请选择合同" }],
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
    this.loadCartypes();
  },
  methods: {
    showContract() {
      var href = this.$router.resolve({
        path: '/sysdata/contract',
        query:{
          contract_id : this.form.contract_id
        }
      })
      window.open(href.href, '_blank');
      console.log(href);
    },
    getSysArea(pid, callback) {
      request({
        url: concans.schema+"://" + concans.host + "/car-port/sys/areaCode",
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
        url: concans.schema+"://" + concans.host + "/car-port/sys/sysConf",
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
    loadCartypes() {
      request({
        url: concans.schema+"://" + concans.host + "/car-port/cartype/getList",
        timeout: 5000,
        method: "post",
        params: { pageNo: 1, pageSize: 100 },
      })
        .then((res) => {
          console.log(res);
          this.form.cartypes = res.data.rows;
          this.cartypescache = res.data.rows;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    addpowver() {
      if (this.endV === "" || this.endV > 100 || this.endV < this.startV) {
        return false;
      }
      this.form.powvers.push({
        start_power: this.startV,
        end_power: this.endV,
        step_start_time:'',
        step_start_price:'',
        step_second_time:'',
        step_second_price:'',
        charge_price:'',
        valid_month:'',
        max_time_len:'',
        power_threshold:'',
      });
      this.startV = this.endV - 0;
      this.startV = this.startV + 1;
      this.endV = "";
    },
    powerdel(row) {
      var tmppowver = [];
      this.form.powvers.forEach((item) => {
        if (item.start_power < row.start_power) {
          tmppowver.push(item);
        }
      });
      this.form.powvers = tmppowver;
      var tmpStartV = 0;
      if (this.form.powvers.length > 0) {
        tmpStartV = this.form.powvers[this.form.powvers.length - 1].end_power - 0;
        tmpStartV = tmpStartV + 1;
      }
      this.startV = tmpStartV;
    },
    addcell(type) {
      console.log(type);
      this.cellEditStatus = false;
      this.cells = [];
      this.form.row = {};
      this.form.interval_rate = "";
      this.form.deposit_money = "";
      this.form.car_port_name = "";
      this.form.charge_mode = "";
      this.form.cell_id = "";
      this.form.status = 1;
      this.form.has_charge = "";
      this.form.discount_price_1 = "";
      this.form.discount_price_3 = "";
      this.form.discount_price_6 = "";
      this.form.discount_price_12 = "";
      this.form.edit_1_status = false;
      this.form.edit_3_status = false;
      this.form.edit_6_status = false;
      this.form.edit_12_status = false;
      this.dialogFormVisible = true;
      var tmpct = [];
      this.cartypescache.forEach((item) => {
        tmpct.push({
          car_type_id: item.car_type_id,
          car_type_name: item.car_type_name,
          isCheck: false,
        });
      });
      this.form.cartypes = tmpct;
      this.form.powvers = [];
      this.startV = 0;
      this.endV = "";
    },
    handleSubmit() {
      var stop_price_json = [];
      if (this.form.powvers.length <= 0) {
        this.$message.error('请配置包月充电费用');
        return false;
      }
      if (this.form.powvers[0].start_power !== 0) {
        this.$message.error('包月充电费用第一条最小伏数必须为1');
        return false;
      }
      if (
        this.form.powvers[this.form.powvers.length - 1].end_power !== "100" &&
        this.form.powvers[this.form.powvers.length - 1].end_power !== 100
      ) {
        this.$message.error('包月充电费用最后一条最大伏数必须为100');
        return false;
      }
      this.form.cartypes.forEach((item) => {
          if (item.isCheck) {
            stop_price_json.push(item);
          }
        });
      var discount_price = {};
      discount_price["1"] = this.form.discount_price_1;
      discount_price["3"] = this.form.discount_price_3;
      discount_price["6"] = this.form.discount_price_6;
      discount_price["12"] = this.form.discount_price_12;
      if (!this.form.edit_1_status&&!this.form.edit_3_status&&!this.form.edit_6_status&&!this.form.edit_12_status) {
        this.$message.error('请至少选择一种折扣');
        return false;
      }
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.row.car_port_id) {
            console.log(this.form);
            request({
              url: concans.schema+"://" + concans.host + "/car-port/carport/update",
              method: "post",
              data: {
                contract_id: this.form.interval_rate,
                interval_rate: this.form.interval_rate,
                deposit_money: this.form.deposit_money,
                car_port_name: this.form.car_port_name,
                charge_mode: this.form.charge_mode,
                cell_id: this.form.cell_id,
                status: this.form.row.status,
                car_port_id: this.form.row.car_port_id,
                has_charge: this.form.has_charge,
                stop_price_json: stop_price_json,
                charge_price_json: this.form.powvers,
                discount_price: discount_price,
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
              url: concans.schema+"://" + concans.host + "/car-port/carport/add",
              method: "post",
              data: {
                contract_id: this.form.interval_rate,
                interval_rate: this.form.interval_rate,
                deposit_money: this.form.deposit_money,
                car_port_name: this.form.car_port_name,
                charge_mode: this.form.charge_mode,
                has_charge: this.form.has_charge,
                cell_id: this.form.cell_id,
                status: 1,
                stop_price_json: stop_price_json,
                charge_price_json: this.form.powvers,
                discount_price: discount_price,
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
          concans.schema+"://" + concans.host + "/car-port/stoppackage/changeStatusSys",
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
    initContract(contract_id){
      this.contracts = [];
      request({
        url:
          concans.schema +
          "://" +
          concans.host +
          "/contract/adminContract/getOne",
        method: "post",
        data: {
          contract_id: contract_id,
        },
      })
        .then((res) => {
          res = res.data;
          this.contracts.push(res);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    handleEdit(row) {
      console.log(row);
      this.cellEditStatus = true;
      this.form.row = row;
      this.form.contract_id = row.contract_id;
      this.initContract(row.contract_id);
      this.form.interval_rate = row.interval_rate;
      this.form.deposit_money = row.deposit_money;
      this.form.car_port_name = row.car_port_name;
      this.form.charge_mode = row.charge_mode;
      this.form.has_charge = row.has_charge + "";
      this.form.status = row.status;
      this.cells = [row];
      this.form.cell_name = row.cell_name;
      this.form.cell_id = row.cell_id;
      this.dialogFormVisible = true;
      var spm = {};
      var cartypestmp = [];
      if (row.stop_price_json) {
        row.stop_price_json.forEach((item) => {
          spm[item.car_type_id] = item;
        });
      }
      this.form.cartypes.forEach((item) => {
        if (spm[item.car_type_id]) {
          item.isCheck = true;
          item.stop_price = spm[item.car_type_id].stop_price;
        } else {
          item.isCheck = false;
          item.stop_price = "";
        }
        cartypestmp.push(item);
      });
      var tmpct = [];
      this.cartypescache.forEach((item) => {
        if (spm[item.car_type_id]) {
          tmpct.push({
            car_type_id: item.car_type_id,
            car_type_name: item.car_type_name,
            stop_price: spm[item.car_type_id].stop_price,
            isCheck: true,
          });
        } else {
          tmpct.push({
            car_type_id: item.car_type_id,
            car_type_name: item.car_type_name,
            isCheck: false,
          });
        }
      });
      this.form.cartypes = tmpct;
      if (row.charge_price_json && row.charge_price_json.length > 0) {
        this.form.powvers = row.charge_price_json;
        this.startV = 101;
        this.endV = "";
      } else {
        this.form.powvers = [];
        this.startV = 0;
        this.endV = "";
      }
      if (row.discount_price && row.discount_price["1"]) {
        this.form.edit_1_status = true;
        this.form.discount_price_1 = row.discount_price["1"];
      } else {
        this.form.edit_1_status = false;
        this.form.discount_price_1 = "";
      }
      if (row.discount_price && row.discount_price["3"]) {
        this.form.edit_3_status = true;
        this.form.discount_price_3 = row.discount_price["3"];
      } else {
        this.form.edit_3_status = false;
        this.form.discount_price_3 = "";
      }
      if (row.discount_price && row.discount_price["6"]) {
        this.form.edit_6_status = true;
        this.form.discount_price_6 = row.discount_price["6"];
      } else {
        this.form.edit_6_status = false;
        this.form.discount_price_6 = "";
      }
      if (row.discount_price && row.discount_price["12"]) {
        this.form.edit_12_status = true;
        this.form.discount_price_12 = row.discount_price["12"];
      } else {
        this.form.edit_12_status = false;
        this.form.discount_price_12 = "";
      }
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
        url: concans.schema+"://" + concans.host + "/car-port/cell/getList",
        method: "get",
        params: { pageNo: 1, pageSize: 10, cell_name: value },
      })
        .then((res) => {
          this.cells = res.data.rows;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    loadContract(value) {
      console.log("loadCell" + value);
      request({
        url: concans.schema+"://" + concans.host + "/contract/adminContract/getList",
        method: "get",
        params: { pageNo: 1, pageSize: 100, cell_name: value },
      })
        .then((res) => {
          this.contracts = res.data.rows;
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
      this.form.car_port_name = obj.cell_name + "智能车棚";
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
        url: concans.schema+"://" + concans.host + "/car-port/carport/getList",
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
    editDoor(row){
      this.$router.push({path:'/sysdata/carportdoor',query: {car_port_id:row.car_port_id}})
    }
  },
};
</script>
