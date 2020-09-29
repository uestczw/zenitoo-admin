<template>
  <el-row>
    <el-col :span="8">
      <el-select
        @change="proChange"
        v-model="pro"
        ref="pro"
        name="pro"
        tabindex="2"
        placeholder="省份搜索"
        style="width:120px;"
      >
        <el-option label="全部省份" value></el-option>
        <el-option v-for="item in pros" :label="item.name" :value="item.value"></el-option>
      </el-select>
    </el-col>
    <el-col :span="8">
      <el-select
        @change="cityChange"
        v-model="city"
        ref="city"
        name="city"
        tabindex="2"
        placeholder="市搜索"
        style="width:120px;"
      >
        <el-option label="全部市" value></el-option>
        <el-option v-for="item in citys" :label="item.name" :value="item.value"></el-option>
      </el-select>
    </el-col>
    <el-col :span="8">
      <el-select
        @change="regionChange"
        v-model="region"
        ref="region"
        name="region"
        tabindex="2"
        placeholder="区县搜索"
        style="width:120px;"
      >
        <el-option label="全部区县" value></el-option>
        <el-option v-for="item in regions" :label="item.name" :value="item.value"></el-option>
      </el-select>
    </el-col>
  </el-row>
</template>

<script>
import request from "@/utils/request";
import concans from "@/utils/concans";
export default {
  props: {
    params: {
      type: Object,
    },
    ret: {
      type: Object,
    },
  },
  data() {
    return {
      formLabelWidth: "120px",
      pros: [],
      citys: [],
      regions: [],
      pro: "",
      city: "",
      region: "",
    };
  },
  created() {
    this.ret.pro = "";
    this.ret.city = "";
    this.ret.region = "";
    this.getSysArea("0", (data) => {
      this.pros = [];
      data.forEach((item) => {
        this.pros.push({
          name: item.district_name,
          value: item.district_code,
        });
      });
    });
  },

  methods: {
    getList(a) {
      console.log(7777);
      return this.test;
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
    proChange(value) {
      this.ret.pro = value;
      this.citys = [];
      this.city = "";
      this.region = "";
      this.regions = [];
      if (value && value !== "") {
        this.getSysArea(value, (data) => {
          data.forEach((item) => {
            this.citys.push({
              name: item.district_name,
              value: item.district_code,
            });
          });
        });
      }
    },
    cityChange(value) {
      this.ret.city = value;
      this.region = "";
      this.regions = [];
      if (value && value !== "") {
        this.getSysArea(value, (data) => {
          data.forEach((item) => {
            this.regions.push({
              name: item.district_name,
              value: item.district_code,
            });
          });
        });
      }
    },
    regionChange(value) {
      this.ret.region = value;
    },
  },
};
</script>

