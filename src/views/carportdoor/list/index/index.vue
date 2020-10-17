<template>
  <div style="background:#eeeeee;padding-top:10px;min-height:1000px;height:auto;">
    <div
      style="width:90%;margin-left:5%;margin-top:20px;background:#ffffff;min-height:450px;border-radius:3px;padding-bottom:10px;"
    >
      <div style="padding-bottom:10px;padding-top:10px;float:left;width:100%;">
        <el-row>
          <el-col :span="3">
            <div style="margin-top:3px;margin-left:0;font-size:18px;text-align:center;">门禁管理</div>
          </el-col>
          <el-col :span="4">
            <el-input placeholder="门禁名称" v-model="searchName" class="input-with-select">
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
        <el-table-column prop="door_id" label="门禁编号" width="180"></el-table-column>
        <el-table-column prop="door_name" label="门禁名称" width="180"></el-table-column>
        <el-table-column label="操作" min-width="110">
          <template slot-scope="scope">
            <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="text" @click="partEdit(scope.row)">部件管理</el-button>
            <el-button type="text" @click="changeStatus(scope.row)">删除</el-button>
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

    <el-dialog title="添加门禁" :visible.sync="dialogFormVisible">
      <el-form :model="form" ref="form" :rules="cellRules">
        <el-row>
          <el-col :span="24">
            <el-form-item label="门禁名称" :label-width="formLabelWidth" prop="door_name">
          <el-input
            ref="door_name"
            name="door_name"
            tabindex="1"
            v-model="form.door_name"
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

    <el-dialog title="部件管理" :visible.sync="dialogFormPartVisible">
      <el-form :model="form" ref="form" :rules="cellRules">
          <el-row>
            <el-col :span="24">
              <el-button
                type="primary"
                @click.native="addPart()"
                style="float:right;margin-right:10px;"
              >
                新增
                <i class="el-icon-plus el-icon--right"></i>
              </el-button>
            </el-col>
          </el-row>
          <label>部件管理</label>
          <el-table
            :data="form.parts"
            :empty-text="emptytext"
            :row-style="{height:'40px'}"
            :cell-style="{padding:3+'px'}"
            style=";border:1px solid #eeeeee;min-height:40px;"
          >
            <el-table-column prop="part_device_sn" label="部件编码" width="160">
              <template slot-scope="scope">
                <el-form-item :prop="'parts.'+scope.$index+'.part_device_sn'" :rules="cellRules.mustinput">
                  <el-input
                    size="mini"
                    v-model="scope.row.part_device_sn"
                  ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="door_part_type" label="部件类型" width="160">
              <template slot-scope="scope">
                <el-form-item :prop="'parts.'+scope.$index+'.door_part_type'" :rules="cellRules.mustinput">
                <el-select size="mini" v-model="scope.row.door_part_type" filterable placeholder="请选择">
                <el-option
                  v-for="(value, key) in partTypes"
                  ref="scope.row.door_part_type"
                  :label="value"
                  :value="key"
                ></el-option>
              </el-select>
              </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="part_name" label="部件名称" width="160">
              <template slot-scope="scope">
                <el-form-item :prop="'parts.'+scope.$index+'.part_name'" :rules="cellRules.mustinput">
                  <el-input
                    size="mini"
                    v-model="scope.row.part_name"
                  ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="160">
              <template slot-scope="scope">
                <el-button type="text" @click="partdel(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <br>
          <el-col :span="24">
              <el-button
                type="primary"
                @click.native="addCode()"
                style="float:right;margin-right:10px;"
              >
                新增
                <i class="el-icon-plus el-icon--right"></i>
              </el-button>
            </el-col>
          </el-row>
          <label>二维码管理</label>
          <el-table
            :data="form.qr_codes"
            :empty-text="emptytext"
            :row-style="{height:'40px'}"
            :cell-style="{padding:3+'px'}"
            style=";border:1px solid #eeeeee;min-height:40px;"
          >
            <el-table-column prop="code_sn" label="二维码编码" width="160">
              <template slot-scope="scope">
                <el-form-item :prop="'qr_codes.'+scope.$index+'.code_sn'" :rules="cellRules.mustinput">
                  <el-input
                    size="mini"
                    v-model="scope.row.code_sn"
                  ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="trace_type" label="二维码类型" width="160">
              <template slot-scope="scope">
                <el-form-item :prop="'qr_codes.'+scope.$index+'.trace_type'" :rules="cellRules.mustinput">
                <el-select size="mini" v-model="scope.row.trace_type" filterable placeholder="请选择">
                <el-option
                  ref="scope.row.trace_type"
                  label="进门"
                  :value="1"
                ></el-option>
                <el-option
                  ref="scope.row.trace_type"
                  label="出门"
                  :value="2"
                ></el-option>
              </el-select>
              </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="160">
              <template slot-scope="scope">
                <el-button type="text" @click="codedel(scope.row)">删除</el-button>
                <el-button type="text" @click="showewm(scope.row)">二维码</el-button>
              </template>
            </el-table-column>
          </el-table>
          </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormPartVisible = false">取 消</el-button>
        <el-button type="primary" @click="partSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span v-if="statusText == 1">确认是否删除!</span>
      <span v-if="statusText == 2">确认是否删除!</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="statusSubmit">确 定</el-button>
      </span>
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
      dialogFormPartVisible: false,
      dialogEwm: false,
      ewmurl: "",
      loading: false,
      carports: [],
      timeout: null,
      dialogFormVisible: false,
      dialogVisible: false,
      statusRow: {},
      statusText: "1",
      formLabelWidth: "120px",
      searchName: "",
      partTypes: [],
      door_part_seq:0,
      qr_code_seq: 0,
      form: {
        parts:[],
        qr_codes:[],
        car_port_id: "",
        door_name: '',
        status: "",
        row: {},
      },
      cellRules: {
        door_name: [
          { required: true, trigger: "blur", message: "请输入名称" },
        ],
        mustinput: [
          { required: true, trigger: "blur", message: "必填" },
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
    this.form.car_port_id = this.$route.query.car_port_id;
    this.loadPartTypes();
    this.getData({});
  },
  methods: {
    showewm(row) {
      var url = concans.schema+"://" + concans.host+'/zenitoo-user/qrcode/load?code_sn=' + row.code_sn;
      this.dialogEwm = true;
      this.ewmurl = url;
    },
    loadewm(code_sn) {
      window.open(this.ewmurl, 'target=_blank');
      this.dialogEwm = false;
    },
    partEdit(row){
      request({
        url: concans.schema+"://" + concans.host + "/car-port/admin/carportdoor/getDoorPartList",
        timeout: 5000,
        method: "post",
        params: { door_id: row.door_id },
      })
        .then((res) => {
          this.qr_code_seq = 0;
          this.door_part_seq = 0;
          console.log(res);
          this.form.parts = res.data.part;
          this.form.parts.forEach((item)=>{
              item.door_part_seq = this.door_part_seq;
              this.door_part_seq++;
          });
          this.form.qr_codes = res.data.qr_code;
          this.form.qr_codes.forEach((item)=>{
              item.qr_code_seq = this.qr_code_seq;
              this.qr_code_seq++;
          });
          this.door_id_tmp = row.door_id;
          this.dialogFormPartVisible = true;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    addPart(){
      this.form.parts.push({
        //door_id: this.door_id_tmp,
        door_part_seq: this.door_part_seq
      });
      this.door_part_seq++;
    },
    partdel(row){
      var tmps = [];
      this.form.parts.forEach((item)=>{
        if(row.door_part_seq !== item.door_part_seq){
          tmps.push(item)
        }
      })
      this.form.parts = tmps;
    },
    addCode(){
      this.form.qr_codes.push({
        //door_id: this.door_id_tmp,
        qr_code_seq: this.qr_code_seq
      });
      this.qr_code_seq++;
    },
    codedel(row){
      var tmps = [];
      this.form.qr_codes.forEach((item)=>{
        if(row.qr_code_seq !== item.qr_code_seq){
          tmps.push(item)
        }
      })
      this.form.qr_codes = tmps;
    },
    partSubmit() {
      // var error = false;
      // try {
        // this.form.parts.forEach((item)=>{
        //   if(!item.part_device_sn || item.part_device_sn === ""){
        //     this.$message.error('请填写部件编码');
        //     error = true;
        //     throw Error();
        //   }
        //   if(!item.part_name || item.part_name === ""){
        //     this.$message.error('请填写部件名称');
        //     error = true;
        //     throw Error();
        //   }
        //   if(!item.door_part_type || item.door_part_type === ""){
        //     this.$message.error('请选择部件类型');
        //     error = true;
        //     throw Error();
        //   }
        // })
      //   this.form.qr_codes.forEach((item)=>{
      //     if(!item.code_sn || item.code_sn === ""){
      //       this.$message.error('请填写二维码编码');
      //       error = true;
      //       throw Error();
      //     }
      //     if(!item.trace_type || item.trace_type === ""){
      //       this.$message.error('请选择二维码类型');
      //       error = true;
      //       throw Error();
      //     }
      //   })
      // } catch (e) {}
      // if (error) {
      //   return false;
      // }
      // if(this.form.qr_codes.length!==0&&this.form.qr_codes.length!=2){
      //   this.$message.error('请同时填写进门和出门二维码');
      //   return false;
      // }
      // if(this.form.qr_codes.length!==0&&this.form.qr_codes[0].trace_type === this.form.qr_codes[1].trace_type){
      //   this.$message.error('二维码不能同时为进门或出门');
      //   return false;
      // }
      // if(this.form.qr_codes.length!==0&&this.form.qr_codes[0].code_sn === this.form.qr_codes[1].code_sn){
      //   this.$message.error('进门和出门二维码编号不能相同');
      //   return false;
      // }
      this.$refs.form.validate((valid) => {
        if (valid) {
      request({
        url: concans.schema+"://" + concans.host + "/car-port/admin/carportdoor/addDoorPart",
        timeout: 5000,
        method: "post",
        data: {part:this.form.parts,qr_code:this.form.qr_codes,door_id:this.door_id_tmp},
      })
        .then((res) => {
          console.log(res);
          this.dialogFormPartVisible = false;
        })
        .catch((e) => {
          console.log(e);
        });} else {
          return false;
        }
      });
    },
    loadPartTypes(){
        request({
        url: concans.schema+"://" + concans.host + "/car-port/sys/sysConf",
        timeout: 5000,
        method: "post",
        params: { key_type: "door_part_type" },
      })
        .then((res) => {
          console.log(res);
          this.partTypes = res.data;
        })
        .catch((e) => {
          console.log(e);
        });
        
    },
    addcell(type) {
      this.form.door_name = '';
      this.form.row = {};
      this.dialogFormVisible = true
    },
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.row.car_port_id) {
            console.log(this.form)
            request({
              url: concans.schema+"://" + concans.host + "/car-port/admin/carportdoor/update",
              method: "post",
              data: {
                car_port_id: this.form.car_port_id,
                door_name: this.form.door_name,
                status: this.form.row.status,
                door_id: this.form.row.door_id,
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
              url: concans.schema+"://" + concans.host + "/car-port/admin/carportdoor/add",
              method: "post",
              data: {
                car_port_id: this.form.car_port_id,
                door_name: this.form.door_name,
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
        url: concans.schema+"://" + concans.host + "/car-port/admin/carportdoor/delete",
        method: "post",
        data: {
          door_id: row.door_id
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
      this.form.door_name = row.door_name+'';
      this.form.status = row.status+'';
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
    // 获取 表格数据
    getData(data) {
      data.pageSize = this.pageInfo.pageSize;
      data.pageNo = this.pageInfo.current_page;
      data.car_port_name = this.searchName;
      data.car_port_id = this.form.car_port_id;
      console.log(data);
      request({
        url: concans.schema+"://" + concans.host + "/car-port/admin/carportdoor/getList",
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
