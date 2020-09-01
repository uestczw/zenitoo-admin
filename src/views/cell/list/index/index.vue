<template>
  <div style="background:#eeeeee;padding-top:10px;min-height:1000px;height:auto;">
  <el-tabs  v-if="1==2" v-model="activeName" style="margin-top:15px;" type="border-card">
      <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key">
        <keep-alive>
          <tab-pane v-if="activeName==item.key" :type="item.key" @create="showCreatedTimes" />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
    <div style="width:90%;margin-left:5%;margin-top:20px;background:#ffffff;min-height:450px;border-radius:3px;padding-bottom:10px;">
      <div style="padding-bottom:10px;padding-top:10px;float:left;width:100%;">
      <div style="float:left;margin-top:3px;margin-left:3%;font-size:16px;">小区管理</div>
      <el-button type="primary"  @click.native="addcell(1)" style="float:right;margin-right:10px;" size="mini">
    新增<i class="el-icon-plus el-icon--right"></i>
  </el-button>
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
    :data="tableData" :empty-text="emptytext"
    :row-style="{height:'30px'}"
    :cell-style="{padding:0+'px'}"
    style="width: 94%;margin-left:3%;border:1px solid #eeeeee;min-height:330px;">
    <el-table-column
      prop="date"
      label="日期"
      width="180">
    </el-table-column>
    <el-table-column
      prop="name"
      label="姓名"
      width="180">
    </el-table-column>
    <el-table-column
      prop="address"
      label="地址">
    </el-table-column>
    <el-table-column label="操作" min-width="110">
                    <template slot-scope="scope">
                        <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
  </el-table>
  <div class="pagination" style="width: 94%;margin-left:3%;">
                <el-pagination @current-change="handleCurrentChange" layout="sizes,prev, pager, next,jumper,total"
                    :total="pageInfo.total_items" :page-size ="10" :page-sizes ="[3, 10, 20, 100]" :current-page ="pageInfo.current_page" ></el-pagination>
            </div>
  </div>

  <el-dialog title="添加小区" :visible.sync="dialogFormVisible">
  <el-form :model="form">
    <el-form-item label="小区名称" :label-width="formLabelWidth">
      <el-input v-model="form.name" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="省" :label-width="formLabelWidth">
      <el-select @change="proChange" v-model="form.pro" placeholder="请选择省份" style="width:120px;">
        <el-option v-for="item in pros" :label="item.name" :value="item.value"></el-option>
      </el-select>
      <label style="margin-left:10px;margin-right:5px;">市</label>
      <el-select @change="cityChange" v-model="form.city" placeholder="请选择城市" style="width:120px;">
        <el-option v-for="item in citys" :label="item.name" :value="item.value"></el-option>
      </el-select>
      <label style="margin-left:10px;margin-right:5px;">区</label>
      <el-select v-model="form.region" placeholder="请选择区域" style="width:120px;">
        <el-option v-for="item in regions" :label="item.name" :value="item.value"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="详细地址" :label-width="formLabelWidth">
      <el-input v-model="form.name" auto-complete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
  </div>
</el-dialog>
  </div>
</template>

<script>
  import request from '@/utils/request'
  import TabPane from '../components/TabPane'
  export default {
    name: 'Tab',
    components: { TabPane },
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
        dialogFormVisible: false,
        formLabelWidth: '120px',
        form:{
            name: '',
            city: '',
            region: ''
        },
        pros:[{name:'四川',value:0},{name:'云南',value:1},{name:'贵州',value:2}],
        citys:[],
        regions:[],
        tabMapOptions: [
        { label: 'China', key: 'CN' },
        { label: 'USA', key: 'US' },
        { label: 'Japan', key: 'JP' },
        { label: 'Eurozone', key: 'EU' }
      ],
      activeName: 'CN',
      createdTimes: 0,
      emptytext: "暂无数据",
      pageInfo: {
                    total_items: 100,
                    page_size: 3,
                    current_page: 1
                },
        tableData: []
      }
    },
    watch: {
    activeName(val) {
      //this.$router.push(`${this.$route.path}?tab=${val}`)
    },
    $route(to, from) {
                //监听路由是否变化
                this.getData({});
            }
  },
  created() {
    // init the default selected tab
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
    }
    this.getData({})
  },
  methods: {
    proChange(value){
      this.citys = []
      this.citys.push({name:'成都',value:0});
      this.form.city = ''
      this.form.region = ''
      this.regions = []
    },
    cityChange(value){
      this.regions.push({name:'成华区',value:0})
      this.regions.push({name:'金牛区',value:1})
    },
    addcell(type){
      console.log(type)
      this.dialogFormVisible = true
    },
    showCreatedTimes() {
      this.createdTimes = this.createdTimes + 1
    },
    // 分页导航
            handleCurrentChange(val) {
                this.pageInfo.current_page = val
                this.getData({});
            },
    // 获取 表格数据
            getData(data) {
                request({
    url: 'https://gate.zenitoo.com/zenitoo-user/user/queryById?userId=101',
    method: 'get'
  }).then((res) => {
    console.log(this.pageInfo.current_page)
    this.tableData= [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }]
    var pageInfo = { 
                            total_items: 100
                        }
                        this.pageInfo = pageInfo
  }).catch((e) => {
    console.log(4444)
    console.log(e)
  })
                
            }
  }
  }
</script>
