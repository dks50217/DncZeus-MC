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
        v-model="stores.permission.data"
        :totalCount="stores.permission.query.totalCount"
        :columns="stores.permission.columns"
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
                      v-model="stores.permission.query.kw"
                      placeholder="輸入關鍵字搜索..."
                      @on-search="handleSearchPermission()"
                    >
                      <Select
                        slot="prepend"
                        v-model="stores.permission.query.isDeleted"
                        @on-change="handleSearchPermission"
                        placeholder="刪除狀態"
                        style="width: 60px"
                      >
                        <Option
                          v-for="item in sources.searchSource.isDeletedSources"
                          :value="item.value"
                          :key="item.value"
                          >{{ item.text }}</Option
                        >
                      </Select>
                      <Select
                        slot="prepend"
                        v-model="stores.permission.query.status"
                        @on-change="handleSearchPermission"
                        placeholder="許可權狀態"
                        style="width: 60px"
                      >
                        <Option
                          v-for="item in sources.searchSource.statusSources"
                          :value="item.value"
                          :key="item.value"
                          >{{ item.text }}</Option
                        >
                      </Select>
                      <Dropdown
                        slot="prepend"
                        trigger="click"
                        :transfer="true"
                        placement="bottom-start"
                        style="min-width: 80px"
                        @on-visible-change="handleSearchMenuTreeVisibleChange"
                      >
                        <Button type="primary">
                          <span
                            v-text="stores.permission.query.menuName"
                          ></span>
                          <Icon type="ios-arrow-down"></Icon>
                        </Button>
                        <div
                          class="text-left pad10"
                          slot="list"
                          style="min-width: 360px"
                        >
                          <div>
                            <Button
                              type="primary"
                              size="small"
                              icon="ios-search"
                              @click="handleRefreshSearchMenuTreeData"
                              >重新整理菜單</Button
                            >
                            <Button
                              class="ml3"
                              type="primary"
                              size="small"
                              icon="md-close"
                              @click="handleClearSearchMenuTreeSelection"
                              >清空</Button
                            >
                          </div>
                          <Tree
                            class="text-left dropdown-tree"
                            :data="sources.searchSource.menuTree.data"
                            @on-select-change="handleSearchMenuTreeSelectChange"
                          ></Tree>
                        </div>
                      </Dropdown>
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
                  title="新增許可權"
                  >新增許可權</Button
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
      width="500"
      :mask-closable="false"
      :mask="true"
      :styles="styles"
    >
      <Form
        :model="formModel.fields"
        ref="formPermission"
        :rules="formModel.rules"
        label-position="top"
      >
        <Row :gutter="32">
          <Col span="12">
            <FormItem label="許可權名稱" prop="name">
              <Input
                v-model="formModel.fields.name"
                placeholder="請輸入許可權名稱"
              />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="操作碼" prop="actionCode">
              <Input
                v-model="formModel.fields.actionCode"
                placeholder="請輸入許可權操作碼"
              />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label-position="left" prop="menuName">
              <Input
                v-model="formModel.fields.menuName"
                placeholder="請選擇菜單"
                :readonly="true"
              >
                <Dropdown
                  slot="append"
                  trigger="click"
                  :transfer="true"
                  placement="bottom-end"
                >
                  <Button type="primary"
                    >選擇...
                    <Icon type="ios-arrow-down"></Icon>
                  </Button>
                  <div
                    class="text-left pad10"
                    slot="list"
                    style="min-width: 360px"
                  >
                    <div>
                      <Button
                        type="primary"
                        size="small"
                        icon="ios-search"
                        @click="handleRefreshMenuTreeData"
                        >重新整理菜單</Button
                      >
                    </div>
                    <Tree
                      class="text-left dropdown-tree"
                      :data="sources.formSource.menuTree.data"
                      @on-select-change="handleMenuTreeSelectChange"
                    ></Tree>
                  </div>
                </Dropdown>
              </Input>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="32">
          <Col span="12">
            <FormItem label="型別" prop="type">
              <Select v-model="formModel.fields.type" placeholder="許可權型別">
                <Option
                  v-for="item in sources.formSource.permissionTypeSources"
                  :value="item.value"
                  :disabled="item.disabled"
                  :key="item.value"
                  >{{ item.text }}</Option
                >
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="狀態" prop="status">
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
        </Row>
        <FormItem label="備註" label-position="top">
          <Input
            type="textarea"
            v-model="formModel.fields.description"
            :rows="4"
            placeholder="許可權備註資訊"
          />
        </FormItem>
      </Form>
      <div class="demo-drawer-footer">
        <Button
          icon="md-checkmark-circle"
          type="primary"
          @click="handleSubmitPermission"
          >保 存</Button
        >
        <Button
          style="margin-left: 8px"
          icon="md-close"
          @click="formModel.opened = false"
          >取 消</Button
        >
      </div>
    </Drawer>
  </div>
</template>

<script>
import Tables from "_c/tables";
import {
  getPermissionList,
  createPermission,
  loadPermission,
  editPermission,
  deletePermission,
  batchCommand,
} from "@/api/rbac/permission";
import { loadMenuTree } from "@/api/rbac/menu";
export default {
  name: "rbac_permission_page",
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
        title: "建立許可權",
        mode: "create",
        selection: [],
        fields: {
          code: "",
          name: "",
          actionCode: "",
          avatar: "",
          isLocked: 0,
          status: 1,
          isDeleted: 0,
          type: 1,
          menuGuid: "",
          menuName: "",
          description: "",
        },
        rules: {
          name: [
            {
              type: "string",
              required: true,
              message: "請輸入許可權名稱",
              min: 2,
            },
          ],
          actionCode: [
            {
              type: "string",
              required: true,
              message: "請輸入許可權操作碼",
              min: 2,
            },
          ],
          menuName: [
            {
              type: "string",
              required: true,
              message: "請選擇菜單",
              min: 2,
            },
          ],
          type: [
            {
              type: "number",
              required: true,
              message: "請輸入許可權操作碼",
            },
          ],
        },
      },
      stores: {
        permission: {
          query: {
            totalCount: 0,
            pageSize: 20,
            currentPage: 1,
            kw: "",
            isDeleted: 0,
            status: -1,
            menuGuid: "",
            menuName: "請選擇...",
            sort: [
              {
                direct: "DESC",
                field: "CreatedOn",
              },
            ],
          },
          columns: [
            { type: "selection", width: 50, key: "handle" },
            { title: "許可權名稱", key: "name", width: 250, sortable: true },
            { title: "關聯菜單", key: "menuName", width: 250 },
            { title: "操作碼", key: "actionCode", minWidth: 200 },
            {
              title: "狀態",
              key: "status",
              align: "center",
              width: 100,
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
              title: "型別",
              key: "permissionTypeText",
              align: "center",
              width: 100,
              render: (h, params) => {
                let permissionTypeText = params.row.permissionTypeText;
                let statusColor = "success";
                let statusText = "未知";
                switch (permissionTypeText) {
                  case "Action":
                    statusText = "按鈕";
                    break;
                  case "Menu":
                    statusText = "菜單";
                    statusColor = "primary";
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
              width: 120,
              ellipsis: true,
              tooltip: true,
              key: "createdOn",
            },
            {
              title: "建立者",
              key: "createdByUserName",
              width: 80,
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
      sources: {
        formSource: {
          permissionTypeSources: [
            { value: 0, text: "菜單", disabled: false },
            { value: 1, text: "按鈕", disabled: false },
          ],
          menuTree: {
            data: [],
          },
        },
        searchSource: {
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
          menuTree: {
            inited: false,
            data: [],
          },
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
        return "建立許可權";
      }
      if (this.formModel.mode === "edit") {
        return "編輯許可權";
      }
      return "";
    },
    selectedRows() {
      return this.formModel.selection;
    },
    selectedRowsId() {
      return this.formModel.selection.map((x) => x.code);
    },
  },
  methods: {
    loadPermissionList() {
      getPermissionList(this.stores.permission.query).then((res) => {
        this.stores.permission.data = res.data.data;
        this.stores.permission.query.totalCount = res.data.totalCount;
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
      this.handleResetFormPermission();
      this.doLoadPermission(params.row.code);
    },
    handleSelect(selection, row) {},
    handleSelectionChange(selection) {
      this.formModel.selection = selection;
    },
    handleRefresh() {
      this.loadPermissionList();
    },
    handleShowCreateWindow() {
      this.handleSwitchFormModeToCreate();
      this.handleOpenFormWindow();
      this.handleResetFormPermission();
      this.handleRefreshMenuTreeData();
    },
    handleSubmitPermission() {
      this.$refs["formPermission"].validate((valid) => {
        if (!valid) {
          this.$Message.error("請完善表單資訊");
          _valid = false;
        } else {
          if (this.formModel.mode === "create") {
            this.doCreatePermission();
          }
          if (this.formModel.mode === "edit") {
            this.doEditPermission();
          }
        }
      });
    },
    handleResetFormPermission() {
      this.$refs["formPermission"].resetFields();
      this.formModel.fields.menuGuid = "";
      this.formModel.fields.menuName = "";
    },
    doCreatePermission() {
      createPermission(this.formModel.fields).then((res) => {
        if (res.data.code == 200) {
          this.$Message.success("操作成功");
          this.handleCloseFormWindow();
          this.loadPermissionList();
        } else {
          this.$Message.warning(res.data.message);
        }
      });
    },
    doEditPermission() {
      editPermission(this.formModel.fields).then((res) => {
        if (res.data.code == 200) {
          this.$Message.success("操作成功");
          this.handleCloseFormWindow();
          this.loadPermissionList();
        } else {
          this.$Message.warning(res.data.message);
        }
      });
    },
    doLoadPermission(code) {
      loadPermission({ code: code }).then((res) => {
        this.formModel.fields = res.data.data;
        this.handleRefreshMenuTreeData(this.formModel.fields.menuGuid);
      });
    },
    handleDelete(params) {
      this.doDelete(params.row.code);
    },
    doDelete(ids) {
      if (!ids) {
        this.$Message.warning("請選擇至少一條數據");
        return;
      }
      deletePermission(ids).then((res) => {
        if (res.data.code == 200) {
          this.$Message.success(res.data.message);
          this.loadPermissionList();
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
          this.loadPermissionList();
          this.formModel.selection = [];
        } else {
          this.$Message.warning(res.data.message);
        }
        this.$Modal.remove();
      });
    },
    handleSearchPermission() {
      this.loadPermissionList();
    },
    rowClsRender(row, index) {
      if (row.isDeleted) {
        return "table-row-disabled";
      }
      return "";
    },
    handlePageChanged(page) {
      this.stores.permission.query.currentPage = page;
      this.loadPermissionList();
    },
    handlePageSizeChanged(pageSize) {
      this.stores.permission.query.pageSize = pageSize;
      this.loadPermissionList();
    },
    doLoadMenuTree(selectedGuid) {
      loadMenuTree(selectedGuid).then((res) => {
        this.sources.formSource.menuTree.data = res.data.data;
      });
    },
    handleMenuTreeSelectChange(nodes) {
      var node = nodes[0];
      if (node) {
        this.formModel.fields.menuGuid = node.guid;
        this.formModel.fields.menuName = node.title;
      }
    },
    handleRefreshMenuTreeData(selectedGuid) {
      this.doLoadMenuTree(selectedGuid || null);
    },
    doLoadSearchMenuTree() {
      loadMenuTree(null).then((res) => {
        this.sources.searchSource.menuTree.data = res.data.data;
      });
    },
    handleSearchMenuTreeSelectChange(nodes) {
      var node = nodes[0];
      if (node) {
        this.stores.permission.query.menuGuid = node.guid;
        this.stores.permission.query.menuName = node.title;
      }
      this.loadPermissionList();
    },
    handleRefreshSearchMenuTreeData() {
      this.doLoadSearchMenuTree();
    },
    handleSearchMenuTreeVisibleChange(visible) {
      if (visible && !this.sources.searchSource.menuTree.inited) {
        this.sources.searchSource.menuTree.inited = true;
        this.handleRefreshSearchMenuTreeData();
      }
    },
    handleClearSearchMenuTreeSelection() {
      this.stores.permission.query.menuGuid = "";
      this.stores.permission.query.menuName = "請選擇...";
      this.loadPermissionList();
    },
  },
  mounted() {
    this.loadPermissionList();
    this.handleRefreshMenuTreeData();
  },
};
</script>
