<template>
  <div>
    <Card>
      <tables
        ref="tables"
        editable
        searchable
        :border="false"
        size="small"
        search-place="top"
        v-model="stores.icon.data"
        :totalCount="stores.icon.query.totalCount"
        :columns="stores.icon.columns"
        @on-delete="handleDelete"
        @on-edit="handleEdit"
        @on-select="handleSelect"
        @on-selection-change="handleSelectionChange"
        @on-refresh="handleRefresh"
        :row-class-name="rowClsRender"
        @on-page-change="handlePageChanged"
        @on-page-size-change="handlePageSizeChanged"
      >
        <div slot="search">
          <section class="dnc-toolbar-wrap">
            <Row :gutter="16">
              <Col span="16">
                <Form inline @submit.native.prevent>
                  <FormItem>
                    <Input
                      type="text"
                      search
                      :clearable="true"
                      v-model="stores.icon.query.kw"
                      placeholder="輸入關鍵字搜索..."
                      @on-search="handleSearchIcon()"
                    >
                      <Select
                        slot="prepend"
                        v-model="stores.icon.query.isDeleted"
                        @on-change="handleSearchIcon"
                        placeholder="刪除狀態"
                        style="width: 60px"
                      >
                        <Option
                          v-for="item in stores.icon.sources.isDeletedSources"
                          :value="item.value"
                          :key="item.value"
                          >{{ item.text }}</Option
                        >
                      </Select>
                      <Select
                        slot="prepend"
                        v-model="stores.icon.query.status"
                        @on-change="handleSearchIcon"
                        placeholder="圖示狀態"
                        style="width: 60px"
                      >
                        <Option
                          v-for="item in stores.icon.sources.statusSources"
                          :value="item.value"
                          :key="item.value"
                          >{{ item.text }}</Option
                        >
                      </Select>
                    </Input>
                  </FormItem>
                </Form>
              </Col>
              <Col span="8" class="dnc-toolbar-btns">
                <ButtonGroup class="mr3">
                  <Button
                    class="txt-danger"
                    icon="md-trash"
                    title="刪除"
                    @click="handleBatchCommand('delete')"
                  ></Button>
                  <Button
                    class="txt-success"
                    icon="md-redo"
                    title="恢復"
                    @click="handleBatchCommand('recover')"
                  ></Button>
                  <Button
                    class="txt-danger"
                    icon="md-hand"
                    title="禁用"
                    @click="handleBatchCommand('forbidden')"
                  ></Button>
                  <Button
                    class="txt-success"
                    icon="md-checkmark"
                    title="啟用"
                    @click="handleBatchCommand('normal')"
                  ></Button>
                  <Button
                    icon="md-refresh"
                    title="重新整理"
                    @click="handleRefresh"
                  ></Button>
                </ButtonGroup>
                <Button
                  icon="md-create"
                  type="primary"
                  @click="handleShowCreateWindow"
                  title="新增圖示"
                  >新增圖示</Button
                >
              </Col>
            </Row>
          </section>
        </div>
      </tables>
    </Card>
    <Drawer
      :title="formTitle"
      v-model="formModel.opened"
      width="400"
      :mask-closable="false"
      :mask="false"
      :styles="styles"
    >
      <Form :model="formModel.fields" ref="formIcon" :rules="formModel.rules">
        <FormItem label="圖示名稱" prop="code" label-position="left">
          <Input v-model="formModel.fields.code" placeholder="請輸入圖示名稱" />
        </FormItem>
        <FormItem label="自定義圖示" label-position="top">
          <Input
            v-model="formModel.fields.custom"
            placeholder="請輸入自定義圖示"
          />
        </FormItem>
        <Row :gutter="8">
          <Col span="12">
            <FormItem label="圖示狀態" label-position="left">
              <i-switch
                size="large"
                v-model="formModel.fields.status"
                :true-value="1"
                :false-value="0"
              >
                <span slot="open">正常</span>
                <span slot="close">禁用</span>
              </i-switch>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="圖示大小" label-position="left">
              <InputNumber
                v-model="formModel.fields.size"
                placeholder="圖示大小"
              ></InputNumber>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="8">
          <Col span="12">
            <FormItem label="圖示顏色" label-position="top">
              <ColorPicker
                v-model="formModel.fields.color"
                placeholder="圖示顏色"
              />
            </FormItem>
          </Col>
        </Row>
        <FormItem label="備註" label-position="top">
          <Input
            type="textarea"
            v-model="formModel.fields.description"
            :rows="4"
            placeholder="圖示備註資訊"
          />
        </FormItem>
      </Form>
      <div class="demo-drawer-footer">
        <Button
          icon="md-checkmark-circle"
          type="primary"
          @click="handleSubmitIcon"
          >保 存</Button
        >
        <Button
          style="margin-left: 8px"
          icon="md-close"
          @click="formModel.opened = false"
          >取 消</Button
        >
        <Button
          style="margin-left: 8px"
          icon="md-arrow-up"
          @click="handleOpenBatchImportDrawer"
          >批量匯入</Button
        >
      </div>
    </Drawer>
    <Drawer
      title="批量匯入圖示"
      v-model="formModel.batchImport.opened"
      width="360"
      :mask-closable="false"
    >
      <Form>
        <FormItem label="批量圖示" label-position="top">
          <Input
            type="textarea"
            v-model="formModel.batchImport.icons"
            :rows="16"
            placeholder="以回車分隔,每行一個圖示名稱"
          />
        </FormItem>
      </Form>
      <div class="demo-drawer-footer">
        <Button
          icon="md-checkmark-circle"
          type="primary"
          @click="handleBatchSubmitIcon"
          >保 存</Button
        >
        <Button
          style="margin-left: 8px"
          icon="md-close"
          @click="formModel.batchImport.opened = false"
          >取 消</Button
        >
      </div>
    </Drawer>
  </div>
</template>

<script>
import Tables from "_c/tables";
import {
  getIconList,
  createIcon,
  loadIcon,
  editIcon,
  deleteIcon,
  batchCommand,
  batchImportIcon,
} from "@/api/rbac/icon";
export default {
  name: "rbac_icon_page",
  components: {
    Tables,
  },
  data() {
    return {
      commands: {
        delete: { name: "delete", title: "刪除" },
        recover: { name: "recover", title: "恢復" },
        forbidden: { name: "forbidden", title: "禁用" },
        normal: { name: "normal", title: "啟用" },
      },
      formModel: {
        opened: false,
        title: "建立圖示",
        mode: "create",
        selection: [],
        fields: {
          id: 0,
          code: "",
          size: 24,
          color: "",
          custom: "",
          isLocked: 0,
          status: 1,
          isDeleted: 0,
          description: "",
        },
        rules: {
          code: [
            {
              type: "string",
              required: true,
              message: "請輸入圖示名稱",
              min: 2,
            },
          ],
        },
        batchImport: {
          opened: false,
          icons: "",
        },
      },
      stores: {
        icon: {
          query: {
            totalCount: 0,
            pageSize: 20,
            currentPage: 1,
            kw: "",
            isDeleted: 0,
            status: -1,
            sort: [
              {
                direct: "DESC",
                field: "id",
              },
            ],
          },
          sources: {
            isDeletedSources: [
              { value: -1, text: "全部" },
              { value: 0, text: "正常" },
              { value: 1, text: "已刪" },
            ],
            statusSources: [
              { value: -1, text: "全部" },
              { value: 0, text: "禁用" },
              { value: 1, text: "正常" },
            ],
            statusFormSources: [
              { value: 0, text: "禁用" },
              { value: 1, text: "正常" },
            ],
          },
          columns: [
            { type: "selection", width: 30, key: "handle" },
            {
              title: "圖示",
              key: "code",
              width: 80,
              align: "center",
              render: (h, params) => {
                return h("Icon", {
                  props: {
                    type: params.row.code,
                    size: 24,
                    color: params.row.color,
                  },
                });
              },
            },
            { title: "圖示名稱", key: "code", width: 250, sortable: true },
            { title: "自定義", key: "custom", width: 150 },
            { title: "大小", key: "size", width: 60 },
            { title: "顏色", key: "color", width: 80 },
            {
              title: "狀態",
              key: "status",
              align: "center",
              width: 120,
              render: (h, params) => {
                let status = params.row.status;
                let statusColor = "success";
                let statusText = "正常";
                switch (status) {
                  case 0:
                    statusText = "禁用";
                    statusColor = "default";
                    break;
                }
                return h(
                  "Tooltip",
                  {
                    props: {
                      placement: "top",
                      transfer: true,
                      delay: 500,
                    },
                  },
                  [
                    //這個中括號表示是Tooltip標籤的子標籤
                    h(
                      "Tag",
                      {
                        props: {
                          //type: "dot",
                          color: statusColor,
                        },
                      },
                      statusText
                    ), //表格列顯示文字
                    h(
                      "p",
                      {
                        slot: "content",
                        style: {
                          whiteSpace: "normal",
                        },
                      },
                      statusText //整個的資訊即氣泡內文字
                    ),
                  ]
                );
              },
            },
            {
              title: "建立時間",
              width: 90,
              ellipsis: true,
              tooltip: true,
              key: "createdOn",
            },
            {
              title: "建立者",
              key: "createdByUserName",
              ellipsis: true,
              tooltip: true,
            },
            {
              title: "操作",
              align: "center",
              key: "handle",
              width: 150,
              className: "table-command-column",
              options: ["edit"],
              button: [
                (h, params, vm) => {
                  return h(
                    "Poptip",
                    {
                      props: {
                        confirm: true,
                        title: "你確定要刪除嗎?",
                      },
                      on: {
                        "on-ok": () => {
                          vm.$emit("on-delete", params);
                        },
                      },
                    },
                    [
                      h(
                        "Tooltip",
                        {
                          props: {
                            placement: "left",
                            transfer: true,
                            delay: 1000,
                          },
                        },
                        [
                          h("Button", {
                            props: {
                              shape: "circle",
                              size: "small",
                              icon: "md-trash",
                              type: "error",
                            },
                          }),
                          h(
                            "p",
                            {
                              slot: "content",
                              style: {
                                whiteSpace: "normal",
                              },
                            },
                            "刪除"
                          ),
                        ]
                      ),
                    ]
                  );
                },
                (h, params, vm) => {
                  return h(
                    "Tooltip",
                    {
                      props: {
                        placement: "left",
                        transfer: true,
                        delay: 1000,
                      },
                    },
                    [
                      h("Button", {
                        props: {
                          shape: "circle",
                          size: "small",
                          icon: "md-create",
                          type: "primary",
                        },
                        on: {
                          click: () => {
                            vm.$emit("on-edit", params);
                            vm.$emit("input", params.tableData);
                          },
                        },
                      }),
                      h(
                        "p",
                        {
                          slot: "content",
                          style: {
                            whiteSpace: "normal",
                          },
                        },
                        "編輯"
                      ),
                    ]
                  );
                },
              ],
            },
          ],
          data: [],
        },
      },
      styles: {
        height: "calc(100% - 55px)",
        overflow: "auto",
        paddingBottom: "53px",
        position: "static",
      },
    };
  },
  computed: {
    formTitle() {
      if (this.formModel.mode === "create") {
        return "建立圖示";
      }
      if (this.formModel.mode === "edit") {
        return "編輯圖示";
      }
      return "";
    },
    selectedRows() {
      return this.formModel.selection;
    },
    selectedRowsId() {
      return this.formModel.selection.map((x) => x.id);
    },
  },
  methods: {
    loadIconList() {
      getIconList(this.stores.icon.query).then((res) => {
        this.stores.icon.data = res.data.data;
        this.stores.icon.query.totalCount = res.data.totalCount;
      });
    },
    handleOpenFormWindow() {
      this.formModel.opened = true;
    },
    handleCloseFormWindow() {
      this.formModel.opened = false;
    },
    handleSwitchFormModeToCreate() {
      this.formModel.mode = "create";
    },
    handleSwitchFormModeToEdit() {
      this.formModel.mode = "edit";
      this.handleOpenFormWindow();
    },
    handleEdit(params) {
      this.handleSwitchFormModeToEdit();
      this.handleResetFormIcon();
      this.doLoadIcon(params.row.id);
    },
    handleSelect(selection, row) {},
    handleSelectionChange(selection) {
      this.formModel.selection = selection;
    },
    handleRefresh() {
      this.loadIconList();
    },
    handleShowCreateWindow() {
      this.handleSwitchFormModeToCreate();
      this.handleOpenFormWindow();
      this.handleResetFormIcon();
    },
    handleSubmitIcon() {
      this.$refs["formIcon"].validate((valid) => {
        if (!valid) {
          this.$Message.error("請完善表單資訊");
          _valid = false;
        } else {
          if (this.formModel.mode === "create") {
            this.doCreateIcon();
          }
          if (this.formModel.mode === "edit") {
            this.doEditIcon();
          }
        }
      });
    },
    handleResetFormIcon() {
      this.$refs["formIcon"].resetFields();
    },
    doCreateIcon() {
      createIcon(this.formModel.fields).then((res) => {
        if (res.data.code === 200) {
          this.$Message.success(res.data.message);
          this.loadIconList();
          this.handleCloseFormWindow();
        } else {
          this.$Message.warning(res.data.message);
        }
      });
    },
    doEditIcon() {
      editIcon(this.formModel.fields).then((res) => {
        if (res.data.code === 200) {
          this.$Message.success(res.data.message);
          this.loadIconList();
          this.handleCloseFormWindow();
        } else {
          this.$Message.warning(res.data.message);
        }
      });
    },
    doLoadIcon(id) {
      loadIcon({ id: id }).then((res) => {
        this.formModel.fields = res.data.data;
      });
    },
    handleDelete(params) {
      this.doDelete(params.row.id);
    },
    doDelete(ids) {
      if (!ids) {
        this.$Message.warning("請選擇至少一條數據");
        return;
      }
      deleteIcon(ids).then((res) => {
        if (res.data.code === 200) {
          this.$Message.success(res.data.message);
          this.loadIconList();
        } else {
          this.$Message.warning(res.data.message);
        }
      });
    },
    handleBatchCommand(command) {
      if (!this.selectedRowsId || this.selectedRowsId.length <= 0) {
        this.$Message.warning("請選擇至少一條數據");
        return;
      }
      this.$Modal.confirm({
        title: "操作提示",
        content:
          "<p>確定要執行當前 [" +
          this.commands[command].title +
          "] 操作嗎?</p>",
        loading: true,
        onOk: () => {
          this.doBatchCommand(command);
        },
      });
    },
    doBatchCommand(command) {
      batchCommand({
        command: command,
        ids: this.selectedRowsId.join(","),
      }).then((res) => {
        if (res.data.code === 200) {
          this.$Message.success(res.data.message);
          this.handleCloseFormWindow();
          this.formModel.batchImport.opened = false;
          this.loadIconList();
          this.formModel.selection = [];
        } else {
          this.$Message.warning(res.data.message);
        }
        this.$Modal.remove();
      });
    },
    handleSearchIcon() {
      this.loadIconList();
    },
    rowClsRender(row, index) {
      if (row.isDeleted) {
        return "table-row-disabled";
      }
      return "";
    },
    handleOpenBatchImportDrawer() {
      this.formModel.batchImport.opened = true;
    },
    handleBatchSubmitIcon() {
      var data = { icons: this.formModel.batchImport.icons };
      batchImportIcon(data).then((res) => {
        if (res.data.code === 200) {
          this.$Message.success(res.data.message);
          this.handleCloseFormWindow();
          this.formModel.batchImport.opened = false;
          this.loadIconList();
        } else {
          this.$Message.warning(res.data.message);
        }
      });
    },
    handlePageChanged(page) {
      this.stores.icon.query.currentPage = page;
      this.loadIconList();
    },
    handlePageSizeChanged(pageSize) {
      this.stores.icon.query.pageSize = pageSize;
      this.loadIconList();
    },
  },
  mounted() {
    this.loadIconList();
  },
};
</script>
