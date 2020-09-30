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
              合同管理
            </div>
          </el-col>
          <el-col :span="4">
            <el-input
              placeholder="合作商名称"
              v-model="searchName"
              class="input-with-select"
            >
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-input
              placeholder="小区名称"
              v-model="searchName"
              class="input-with-select"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="search"
              ></el-button>
            </el-input>
          </el-col>
          <el-col :span="3">
            <el-button
              type="primary"
              @click.native="addcell(1)"
              style="float: right; margin-right: 10px"
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
        :row-style="{ height: '30px' }"
        :cell-style="{ padding: 0 + 'px' }"
        style="
          width: 94%;
          margin-left: 3%;
          border: 1px solid #eeeeee;
          min-height: 40px;
        "
      >
        <el-table-column
          prop="contract_code"
          label="合同编号"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="create_time"
          label="创建时间"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="start_time"
          label="开始时间"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="end_time"
          label="结束时间"
          width="180"
        ></el-table-column>
        <el-table-column label="操作" min-width="110">
          <template slot-scope="scope">
            <el-button type="text" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
          </template>
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

    <el-dialog title="提示" :visible.sync="dialogFile">
      <pdf
        v-if="showFileType == 1"
        style="width: 100%; padding-top: 6px"
        :src="showFileUrl"
      ></pdf>
      <img
        v-if="showFileType == 2"
        style="width: 100%; padding-top: 6px"
        :src="showFileUrl"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFile = false">关 闭</el-button>
      </span>
    </el-dialog>

    <el-dialog title="合同详情" :visible.sync="dialogUpload" width="70%">
      <el-form :model="form" ref="form" :rules="cellRules">
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="合同编号"
              :label-width="formLabelWidth"
              prop="contract_code"
            >
              <el-input
                ref="contract_code"
                name="contract_code"
                tabindex="1"
                v-model="form.contract_code"
                auto-complete="off"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="开始时间"
              :label-width="formLabelWidth"
              prop="start_time"
            >
              <el-date-picker
                v-model="form.start_time"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                align="right"
                type="date"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="结束时间"
              :label-width="formLabelWidth"
              prop="end_time"
            >
              <el-date-picker
                v-model="form.end_time"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                align="right"
                type="date"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="17"
            ><label
              style="
                float: left;
                width: 80px;
                text-align: right;
                padding-right: 12px;
              "
              >合作方</label
            ></el-col
          >
          <el-col :span="6"
            ><el-select
              ref="serFri"
              v-model="serFri"
              filterable
              remote
              label-in-value
              placeholder="搜索合作方"
              :remote-method="loadMers"
              :label="serFriName"
              @change="serFriChange"
              size="mini"
            >
              <el-option
                v-for="cell in serMers"
                :key="cell.alliance_id"
                :label="cell.alliance_name+'('+cell.alliance_mobile+')'"
                :value="cell.alliance_id"
              ></el-option> </el-select
          ></el-col>
          <el-col :span="1">
            <el-button
              type="primary"
              @click.native="addMer()"
              size="mini"
              style="float: right"
            >
              新增
              <i class="el-icon-plus el-icon--right"></i>
            </el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div style="width: 100%; padding-left: 80px">
              <el-table
                :data="form.mers"
                :empty-text="emptytext"
                :row-style="{ height: '40px' }"
                :cell-style="{ padding: 3 + 'px' }"
                style="border: 1px solid #eeeeee; min-height: 40px"
              >
                <el-table-column prop="alliance_name" label="名称" width="200">
                </el-table-column>
                <el-table-column
                  prop="alliance_mobile"
                  label="手机号"
                  width="160"
                >
                </el-table-column>
                <el-table-column
                  prop="profit_percent"
                  label="分润比例"
                  width="100"
                >
                  <template slot-scope="scope">
                    <el-form-item
                      :prop="'mers.' + scope.$index + '.profit_percent'"
                      :rules="cellRules.lrfp"
                    >
                      <el-input
                        oninput="value=value.replace(/[^\d.]/g,'')"
                        size="mini"
                        v-model="scope.row.profit_percent"
                      ></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="car_type_name"
                  label="结算周期(天)"
                  width="100"
                >
                  <template slot-scope="scope">
                    <el-form-item
                      :prop="'mers.' + scope.$index + '.settle_day'"
                      :rules="cellRules.lrfp"
                    >
                      <el-input
                        oninput="value=value.replace(/[^\d.]/g,'')"
                        size="mini"
                        v-model="scope.row.settle_day"
                      ></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="safe_day"
                  label="风险预存期(天)"
                  width="120"
                >
                  <template slot-scope="scope">
                    <el-form-item
                      :prop="'mers.' + scope.$index + '.safe_day'"
                      :rules="cellRules.lrfp"
                    >
                      <el-input
                        oninput="value=value.replace(/[^\d.]/g,'')"
                        size="mini"
                        v-model="scope.row.safe_day"
                      ></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="mark" label="备注" width="120">
                  <template slot-scope="scope">
                    <el-form-item
                      :prop="'mers.' + scope.$index + '.mark'"
                      :rules="cellRules.lrfp"
                    >
                      <el-input
                        size="mini"
                        v-model="scope.row.mark"
                      ></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="操作" min-width="60">
                  <template slot-scope="scope">
                    <el-button type="text" @click="delMer(scope.row)"
                      >删除</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="设备拥有"
              :label-width="formLabelWidth"
              prop="device_alliance_id"
            >
              <el-select
                placeholder="设备拥有方"
                filterable
                v-model="form.device_alliance_id"
              >
                <el-option
                  v-for="item in form.mers"
                  :label="item.alliance_name+'('+item.alliance_mobile+')'"
                  :value="item.alliance_id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="销售数量"
              :label-width="formLabelWidth"
              prop="device_sell_number"
            >
              <el-input
                ref="device_sell_number"
                name="device_sell_number"
                tabindex="1"
                v-model="form.device_sell_number"
                auto-complete="off"
                ><span slot="append">台</span></el-input
              >
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="设备上限"
              :label-width="formLabelWidth"
              prop="device_limit_number"
            >
              <el-input
                ref="device_limit_number"
                name="device_limit_number"
                tabindex="1"
                v-model="form.device_limit_number"
                auto-complete="off"
                ><span slot="append">台</span></el-input
              >
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="电费承担"
              :label-width="formLabelWidth"
              prop="electric_alliance_id"
            >
              <el-select
                placeholder="电费承担"
                filterable
                v-model="form.electric_alliance_id"
              >
                <el-option
                  v-for="item in form.mers"
                  :label="item.alliance_name+'('+item.alliance_mobile+')'"
                  :value="item.alliance_id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item
              label="电价"
              :label-width="formLabelWidth"
              prop="electric_money"
            >
              <el-input
                ref="electric_money"
                name="electric_money"
                tabindex="1"
                v-model="form.electric_money"
                auto-complete="off"
                ><span slot="append">元/度</span></el-input
              >
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item
              label="电费周期"
              :label-width="formLabelWidth"
              prop="settle_month"
            >
              <el-input
                ref="settle_month"
                name="settle_month"
                tabindex="1"
                v-model="form.settle_month"
                auto-complete="off"
              >
                <span slot="append">月</span>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="场地租金"
              :label-width="formLabelWidth"
              prop="ground_rent_money"
            >
              <el-input
                ref="ground_rent_money"
                name="ground_rent_money"
                tabindex="1"
                v-model="form.ground_rent_money"
                auto-complete="off"
              >
                <span slot="append">元</span>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="签订人"
              :label-width="formLabelWidth"
              prop="sign_user_id"
            >
              <el-select
                ref="sign_user_id"
                v-model="form.sign_user_id"
                filterable
                remote
                label-in-value
                placeholder="请输入关键词"
                :remote-method="loadContractUser"
                :label="form.saleUserName"
              >
                <el-option
                  v-for="sale in contractUsers"
                  :key="sale.employee_id"
                  :label="sale.employee_name+'('+sale.employee_mobile+')'"
                  :value="sale.employee_id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="销售负责"
              :label-width="formLabelWidth"
              prop="ground_alliance_id"
            >
              <el-select
                ref="ground_alliance_id"
                v-model="form.ground_alliance_id"
                filterable
                remote
                label-in-value
                placeholder="请输入关键词"
                :remote-method="loadSaleUser"
                :label="form.saleUserName"
              >
                <el-option
                  v-for="sale in saleUsers"
                  :key="sale.employee_id"
                  :label="sale.employee_name+'('+sale.employee_mobile+')'"
                  :value="sale.employee_id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="运营负责"
              :label-service_user_id="formLabelWidth"
              prop="manageUserId"
            >
              <el-select
                ref="service_user_id"
                v-model="form.service_user_id"
                filterable
                remote
                label-in-value
                placeholder="请输入关键词"
                :remote-method="loadManageUser"
                :label="form.manageUserName"
              >
                <el-option
                  v-for="sale in manageUsers"
                  :key="sale.employee_id"
                  :label="sale.employee_name+'('+sale.employee_mobile+')'"
                  :value="sale.employee_id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item
              label="合同附件"
              :label-width="formLabelWidth"
              prop="car_type_name"
            >
              <el-upload
                :headers="headers"
                accept=".jpg,.png,.gif,.pdf,.xls,.xlsx,doc,docx"
                class="upload-demo"
                :on-success="upsuccess"
                :file-list="fileList"
                :on-preview="onPreview"
                list-type="text"
                action="https://gate.zenitoo.com/zenitoo-user/upload/file"
                multiple
              >
                <el-button type="primary">选择文件</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogUpload = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import pdf from "vue-pdf";
import { getToken } from "@/utils/auth";
import request from "@/utils/request";
import concans from "@/utils/concans";
import FileUpload from "@/components/upload";
export default {
  name: "Tab",
  components: { FileUpload, pdf },
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
      serFri: "",
      serSn: "",
      serFriName: "",
      serFriTel: "",
      saleUsers: [],
      manageUsers: [],
      contractUsers: [],
      serMers: [],
      deviceOwner: "",
      chargePayUser: "",
      merSeq: 0,
      showFileType: "",
      showFileUrl: "",
      headers: {},
      fileList: [],
      dialogFile: false,
      dialogUpload: false,
      formLabelWidth: "80px",
      searchName: "",
      searchStatus: "",
      form: {
        mers: [],
        images: [],
        car_type_name: "",
        contract_code: "",
        start_time: "",
        end_time: "",
        sign_user_id: "",
        device_alliance_id: "",
        device_sell_number: "",
        device_limit_number: "",
        electric_alliance_id: "",
        electric_money: "",
        ground_rent_money: "",
        round_alliance_id: "",
        settle_month: "",
        service_user_id: "",
        row: {},
      },
      cellRules: {
        lrfp: [{ required: true, trigger: "blur", message: "必填项" }],
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
    if(this.$route.query.contract_id){
      this.handleEdit({
        contract_id:this.$route.query.contract_id
      });
      this.dialogUpload = true;
    }
    this.getData({});
    const hasToken = getToken();
    this.headers = {
      token: hasToken,
      "X-Requested-With": "XMLHttpRequest",
    };
  },
  methods: {
    serFriChange(value) {
      let obj = {};
      obj = this.serMers.find((item) => {
        return item.alliance_id === value;
      });
      this.serFriName = obj.alliance_name;
      this.serFriTel = obj.alliance_mobile;
      this.serFriSn = obj.alliance_sn;
      //this.serFri = value;
      console.log(this.serFri);
      console.log(this.serFriName);
    },
    loadSaleUser(value) {
      this.loadUsers("saleUsers", value);
    },
    loadManageUser(value) {
      this.loadUsers("manageUsers", value);
    },
    loadContractUser(value) {
      this.loadUsers("contractUsers", value);
    },
    loadUsers(key, value) {
      console.log(key + "," + value);
      request({
        url:
          concans.schema +
          "://" +
          concans.host +
          "/contract/adminEmployee/getList",
        method: "get",
        params: { pageNo: 1, pageSize: 10, employee_mobile: value },
      })
        .then((res) => {
          this[key] = res.data.rows;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    loadMers(value) {
      console.log("loadMers" + value);
      request({
        url:
          concans.schema +
          "://" +
          concans.host +
          "/contract/adminAlliance/getList",
        method: "get",
        params: { pageNo: 1, pageSize: 10, mobile: value },
      })
        .then((res) => {
          this.serMers = res.data.rows;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    addMer() {
      if (!this.serFri || this.serFri == "") {
        return false;
      }
      this.form.mers.push({
        seq: this.merSeq,
        alliance_id: this.serFri,
        alliance_sn: this.serSn,
        alliance_name: this.serFriName,
        alliance_mobile: this.serFriTel,
        profit_percent: "",
        settle_day: "",
        safe_day: "",
        mark: "",
      });
      this.merSeq++;
      this.serFri = "";
      this.serFriName = "";
    },
    delMer(row) {
      var tmpmers = [];
      this.form.mers.forEach((item) => {
        if (row.seq != item.seq) {
          tmpmers.push(item);
        }
      });
      this.form.mers = tmpmers;
    },
    upsuccess(response, file, fileList) {
      file.serverUrl = response.data.path;
      console.log(response);
      console.log(file);
      console.log(fileList);
      this.fileList = fileList;
    },
    onPreview(file) {
      this.showFile(file);
    },
    addcell(type) {
      this.fileList = [];
      this.form = {
        mers: [],
        images: [],
        car_type_name: "",
        contract_code: "",
        start_time: "",
        end_time: "",
        sign_user_id: "",
        device_alliance_id: "",
        device_sell_number: "",
        device_limit_number: "",
        electric_alliance_id: "",
        electric_money: "",
        ground_rent_money: "",
        round_alliance_id: "",
        settle_month: "",
        service_user_id: "",
        row: {},
      };
      this.dialogUpload = true;
    },
    showFile(file) {
      this.dialogFile = true;
      this.showFileType = 2;
      this.showFileUrl = file.url;
    },
    handleSubmit() {
      if (!this.fileList.length || this.fileList.length == 0) {
        this.$message.error("请上传合同附件!");
        return false;
      }
      var images = [];
      this.fileList.forEach((item) => {
        images.push({
          url: item.serverUrl,
        });
      });
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.row.contract_id) {
            console.log(this.form);
            request({
              url: "https://" + concans.host + "/contract/adminContract/update",
              method: "post",
              data: {
                contract_id: this.form.row.contract_id,
                contract_code: this.form.contract_code,
                start_time: this.form.start_time,
                end_time: this.form.end_time,
                sign_user_id: this.form.sign_user_id,
                device_alliance_id: this.form.device_alliance_id,
                device_sell_number: this.form.device_sell_number,
                device_limit_number: this.form.device_limit_number,
                electric_alliance_id: this.form.electric_alliance_id,
                electric_money: this.form.electric_money,
                ground_rent_money: this.form.ground_rent_money,
                ground_alliance_id: this.form.ground_alliance_id,
                settle_month: this.form.settle_month,
                service_user_id: this.form.service_user_id,
                images: images,
                alliances: this.form.mers,
                status: this.form.row.status,
              },
            })
              .then((res) => {
                console.log(res);
                this.dialogUpload = false;
                this.getData({});
              })
              .catch((e) => {
                console.log(e);
              });
          } else {
            request({
              url: "https://" + concans.host + "/contract/adminContract/add",
              method: "post",
              data: {
                contract_code: this.form.contract_code,
                start_time: this.form.start_time,
                end_time: this.form.end_time,
                sign_user_id: this.form.sign_user_id,
                device_alliance_id: this.form.device_alliance_id,
                device_sell_number: this.form.device_sell_number,
                device_limit_number: this.form.device_limit_number,
                electric_alliance_id: this.form.electric_alliance_id,
                electric_money: this.form.electric_money,
                ground_rent_money: this.form.ground_rent_money,
                ground_alliance_id: this.form.ground_alliance_id,
                settle_month: this.form.settle_month,
                service_user_id: this.form.service_user_id,
                images: images,
                alliances: this.form.mers,
                status: 1,
              },
            })
              .then((res) => {
                console.log(res);
                this.dialogUpload = false;
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
          "/car-port/cartype/chargeStatus",
        method: "post",
        data: {
          car_type_id: row.car_type_id,
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
      request({
        url:
          concans.schema +
          "://" +
          concans.host +
          "/contract/adminContract/getOne",
        method: "post",
        data: {
          contract_id: row.contract_id,
        },
      })
        .then((res) => {
          console.log(res);
          res = res.data;
          this.form.row = row;
          this.form.contract_code = res.contract_code;
          this.form.start_time = res.start_time;
          this.form.end_time = res.end_time;
          this.form.sign_user_id = res.sign_user_id;
          this.form.device_alliance_id = res.device_alliance_id;
          this.form.device_sell_number = res.device_sell_number;
          this.form.device_limit_number = res.device_limit_number;
          this.form.electric_alliance_id = res.electric_alliance_id;
          this.form.electric_money = res.electric_money;
          this.form.ground_rent_money = res.ground_rent_money;
          this.form.ground_alliance_id = res.ground_alliance_id;
          this.form.settle_month = res.settle_month;
          this.form.service_user_id = res.service_user_id;
          this.saleUsers = [];
          this.saleUsers.push({
            employee_id: res.ground_alliance_id,
            employee_name: res.ground_alliance_name,
            employee_mobile: res.ground_alliance_mobile,
          });
          this.contractUsers = [];
          this.contractUsers.push({
            employee_id: res.sign_user_id,
            employee_name: res.sign_user_name,
            employee_mobile: res.sign_user_mobile,
          });
          this.manageUsers = [];
          this.manageUsers.push({
            employee_id: res.service_user_id,
            employee_name: res.service_user_name,
            employee_mobile: res.service_user_mobile,
          });
          if (res.images) {
            var fileList = [];
            res.images.forEach((item) => {
              //item.url = '/upfile/20200929153205/location.jpg';
              var index = item.url.lastIndexOf("/");
              var name = item.url.substring(index + 1, item.url.length);
              fileList.push({
                name: name,
                url:
                  "https://gate.zenitoo.com/zenitoo-user/upload/show?path=" +
                  item.url,
                serverUrl: item.url,
              });
            });
            //console.log(fileList);
            this.fileList = fileList;
            this.form.mers = res.alliances;
          }
          this.dialogUpload = true;
        })
        .catch((e) => {
          console.log(e);
        });
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
      data.pageSize = this.pageInfo.pageSize;
      data.pageNo = this.pageInfo.current_page;
      data.car_type_name = this.searchName;
      data.status = this.searchStatus;
      console.log(data);
      request({
        url:
          concans.schema +
          "://" +
          concans.host +
          "/contract/adminContract/getList",
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
