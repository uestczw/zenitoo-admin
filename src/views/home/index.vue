<template>
  <div
    style="
      background: #eeeeee;
      padding-top: 10px;
      min-height: 1000px;
      height: auto;
    "
  >
    <el-card class="box-card" style="min-height: 400px">
      <div slot="header">
        <span>Home</span>
        
      </div>
      <div>
        <el-card style="float:left;width: 300px; height: 160px">
          <div slot="header">
            <span>账户余额</span>
            <el-button @click="takeout" style="float: right; padding: 3px 3px" type="text"
              >提现申请</el-button
            >
            <router-link to='/center/takeout'>
            <el-button style="float: right; padding: 3px 3px" type="text"
              >提现记录</el-button
            >
            </router-link>
          </div>
          <div
            style="
              width: 100%;
              text-align: center;
              line-height: 60px;
              font-size: 24px;
            "
          >
            1000元
          </div>
        </el-card>

        <el-card style="float:left;margin-left:10px;width: 300px; height: 160px">
          <div slot="header">
            <span>总收入</span>
            <router-link to='/center/money'>
            <el-button style="float: right; padding: 3px 0" type="text"
              >查看明细</el-button
            >
            </router-link>
          </div>
          <div
            style="
              width: 100%;
              text-align: center;
              line-height: 60px;
              font-size: 24px;
            "
          >
            10000元
          </div>
        </el-card>
      </div>
    </el-card>

    <el-dialog title="提现申请" :visible.sync="showTakeOut" width="30%">
      <el-input
                    placeholder="请输入提现金额"
                    oninput="value=value.replace(/[^\d.]/g,'')"
                    v-model="money"
                  ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showTakeOut = false">取 消</el-button>
        <el-button type="primary" @click="takeoutSubmit">确 定</el-button>
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
      showTakeOut: false,
      money:''
    };
  },
  created() {
  },
  methods: {
    takeout() {
      this.showTakeOut = true;
    },
    takeoutSubmit() {

    },
  },
};
</script>
