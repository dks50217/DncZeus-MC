<template>
  <div>
    <Card>
      <dz-table
        :totalCount="stores.user.query.totalCount"
        :pageSize="stores.user.query.pageSize"
        @on-page-change="handlePageChanged"
        @on-page-size-change="handlePageSizeChanged"
      >
        <div slot="searcher">
          <section class="dnc-toolbar-wrap">
            <Row :gutter="16">
              <Col span="16">
                <Form inline @submit.native.prevent>
                  <FormItem>
                    <Input
                      type="text"
                      search
                      :clearable="true"
                      v-model="stores.user.query.kw"
                      placeholder="輸入關鍵字搜索..."
                      @on-search="handleSearchUser()"
                    >
                      <Select
                        slot="prepend"
                        v-model="stores.user.query.isDeleted"
                        @on-change="handleSearchUser"
                        placeholder="刪除狀態"
                        style="width: 60px"
                      >
                        <Option
                          v-for="item in stores.user.sources.isDeletedSources"
                          :value="item.value"
                          :key="item.value"
                          >{{ item.text }}</Option
                        >
                      </Select>
                      <Select
                        slot="prepend"
                        v-model="stores.user.query.status"
                        @on-change="handleSearchUser"
                        placeholder="使用者狀態"
                        style="width: 60px"
                      >
                        <Option
                          v-for="item in stores.user.sources.statusSources"
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
                  v-can="'create'"
                  icon="md-create"
                  type="primary"
                  @click="handleShowCreateWindow"
                  title="新增使用者"
                  >新增使用者</Button
                >
              </Col>
            </Row>
          </section>
        </div>
        <Table
          slot="table"
          ref="tables"
          :border="false"
          size="small"
          :highlight-row="true"
          :data="stores.user.data"
          :columns="stores.user.columns"
          @on-select="handleSelect"
          @on-selection-change="handleSelectionChange"
          @on-refresh="handleRefresh"
          :row-class-name="rowClsRender"
          @on-page-change="handlePageChanged"
          @on-page-size-change="handlePageSizeChanged"
          @on-sort-change="handleSortChange"
        >
          <template slot-scope="{ row, index }" slot="userType">
            <span>{{ renderUserType(row.userType) }}</span>
          </template>
          <template slot-scope="{ row, index }" slot="status">
            <Tag :color="renderStatus(row.status).color">{{
              renderStatus(row.status).text
            }}</Tag>
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <Poptip
              confirm
              :transfer="true"
              title="確定要刪除嗎?"
              @on-ok="handleDelete(row)"
            >
              <Tooltip
                placement="top"
                content="刪除"
                :delay="1000"
                :transfer="true"
              >
                <Button
                  type="error"
                  size="small"
                  shape="circle"
                  icon="md-trash"
                ></Button>
              </Tooltip>
            </Poptip>
            <Tooltip
              placement="top"
              content="編輯"
              :delay="1000"
              :transfer="true"
            >
              <Button
                v-can="'edit'"
                type="primary"
                size="small"
                shape="circle"
                icon="md-create"
                @click="handleEdit(row)"
              ></Button>
            </Tooltip>
            <Tooltip
              placement="top"
              content="分配角色"
              :delay="1000"
              :transfer="true"
            >
              <Button
                type="success"
                size="small"
                shape="circle"
                icon="md-contacts"
                @click="handleAssignRole(row)"
              ></Button>
            </Tooltip>
          </template>
        </Table>
      </dz-table>
    </Card>
    <Drawer
      :title="formTitle"
      v-model="formModel.opened"
      width="600"
      :mask-closable="false"
      :mask="true"
      :styles="styles"
    >
      <Form
        :model="formModel.fields"
        ref="formUser"
        :rules="formModel.rules"
        label-position="top"
      >
        <Row :gutter="16">
          <Col span="12">
            <FormItem label="登錄名" prop="loginName">
              <Input
                v-model="formModel.fields.loginName"
                placeholder="請輸入登錄名"
              />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="顯示名" prop="displayName">
              <Input
                v-model="formModel.fields.displayName"
                placeholder="請輸入顯示名"
              />
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="16">
          <Col span="12">
            <FormItem label="密碼" prop="password">
              <Input
                type="password"
                v-model="formModel.fields.password"
                placeholder="請輸入登錄密碼"
              />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="使用者型別">
              <Select v-model="formModel.fields.userType">
                <Option
                  v-for="item in stores.user.sources.userTypes"
                  :value="item.value"
                  :key="item.value"
                  >{{ item.text }}</Option
                >
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="16">
          <Col span="12">
            <FormItem label="使用者狀態" label-position="left">
              <!-- <RadioGroup v-model="formModel.fields.status" type="button">
                              <Radio v-for="item in stores.user.sources.statusFormSources" :label="item.text" :key="item.value"></Radio>
              </RadioGroup>-->
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
            v-model="formModel.fields.desc"
            :rows="4"
            placeholder="使用者備註資訊"
          />
        </FormItem>
      </Form>
      <div class="demo-drawer-footer">
        <Button
          icon="md-checkmark-circle"
          type="primary"
          @click="handleSubmitUser"
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
    <Drawer
      title="使用者角色分配"
      v-model="formAssignRole.opened"
      width="500"
      :mask-closable="true"
      :mask="true"
    >
      <Form>
        <FormItem>
          <Transfer
            :data="formAssignRole.roles"
            :target-keys="formAssignRole.ownedRoles"
            :render-format="renderOwnedRoles"
            :titles="['未獲得的角色', '已獲得的角色']"
            @on-change="handleChangeOwnedRolesChanged"
          ></Transfer>
        </FormItem>
      </Form>
      <div class="demo-drawer-footer" style="margin-top: 15px">
        <Button
          icon="md-checkmark-circle"
          type="primary"
          @click="handleSaveUserRoles"
          >保 存</Button
        >
        <Button
          style="margin-left: 8px"
          icon="md-close"
          @click="formAssignRole.opened = false"
          >取 消</Button
        >
      </div>
    </Drawer>
  </div>
</template>

<script>
import DzTable from "_c/tables/dz-table.vue";
import {
  getUserList,
  createUser,
  loadUser,
  editUser,
  deleteUser,
  batchCommand,
  saveUserRoles,
} from "@/api/rbac/user";
import { loadRoleListByUserGuid } from "@/api/rbac/role";
export default {
  name: "rbac_user_page",
  components: {
    DzTable,
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
        title: "建立使用者",
        mode: "create",
        selection: [],
        fields: {
          guid: "",
          loginName: "",
          displayName: "",
          password: "",
          avatar: "",
          userType: 0,
          isLocked: 0,
          status: 1,
          isDeleted: 0,
          createdOn: null,
          createdByUserGuid: "",
          createdByUserName: "",
          modifiedOn: null,
          modifiedByUserGuid: "",
          modifiedByUserName: "",
        },
        rules: {
          loginName: [
            { type: "string", required: true, message: "請輸入登錄名", min: 3 },
          ],
          displayName: [],
          password: [],
        },
      },
      formAssignRole: {
        userGuid: "",
        opened: false,
        ownedRoles: [],
        inited: false,
        roles: [],
      },
      stores: {
        user: {
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
                field: "Guid",
              },
            ],
          },
          sources: {
            userTypes: [
              { value: 0, text: "超級管理員" },
              { value: 1, text: "管理員" },
              { value: 2, text: "普通使用者" },
            ],
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
            { type: "selection", width: 50, key: "handle" },
            { title: "登錄名", key: "loginName", width: 250, sortable: true },
            { title: "顯示名", key: "displayName", width: 250 },
            { title: "使用者型別", key: "userType", slot: "userType" },
            {
              title: "狀態",
              key: "status",
              align: "center",
              width: 120,
              slot: "status",
            },
            {
              title: "建立時間",
              width: 120,
              ellipsis: true,
              tooltip: true,
              key: "createdOn",
            },
            { title: "建立者", key: "createdByUserName" },
            {
              title: "操作",
              align: "center",
              width: 150,
              className: "table-command-column",
              slot: "action",
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
        return "建立使用者";
      }
      if (this.formModel.mode === "edit") {
        return "編輯使用者";
      }
      return "";
    },
    selectedRows() {
      return this.formModel.selection;
    },
    selectedRowsId() {
      return this.formModel.selection.map((x) => x.guid);
    },
  },
  methods: {
    loadUserList() {
      getUserList(this.stores.user.query).then((res) => {
        this.stores.user.data = res.data.data;
        this.stores.user.query.totalCount = res.data.totalCount;
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
    handleEdit(row) {
      this.handleSwitchFormModeToEdit();
      this.handleResetFormUser();
      this.doLoadUser(row.guid);
    },
    handleSelect(selection, row) {},
    handleSelectionChange(selection) {
      this.formModel.selection = selection;
    },
    handleRefresh() {
      this.loadUserList();
    },
    handleShowCreateWindow() {
      this.handleSwitchFormModeToCreate();
      this.handleOpenFormWindow();
      this.handleResetFormUser();
    },
    handleSubmitUser() {
      this.$refs["formUser"].validate((valid) => {
        if (!valid) {
          this.$Message.error("請完善表單資訊");
        } else {
          if (this.formModel.mode === "create") {
            this.doCreateUser();
          }
          if (this.formModel.mode === "edit") {
            this.doEditUser();
          }
        }
      });
    },
    handleResetFormUser() {
      this.$refs["formUser"].resetFields();
    },
    doCreateUser() {
      createUser(this.formModel.fields).then((res) => {
        if (res.data.code === 200) {
          this.$Message.success(res.data.message);
          this.handleCloseFormWindow();
          this.loadUserList();
        } else {
          this.$Message.warning(res.data.message);
        }
      });
    },
    doEditUser() {
      editUser(this.formModel.fields).then((res) => {
        if (res.data.code === 200) {
          this.$Message.success(res.data.message);
          this.handleCloseFormWindow();
          this.loadUserList();
        } else {
          this.$Message.warning(res.data.message);
        }
      });
    },
    doLoadUser(guid) {
      loadUser({ guid: guid }).then((res) => {
        this.formModel.fields = res.data.data;
      });
    },
    handleDelete(row) {
      this.doDelete(row.guid);
    },
    doDelete(ids) {
      if (!ids) {
        this.$Message.warning("請選擇至少一條數據");
        return;
      }
      deleteUser(ids).then((res) => {
        if (res.data.code === 200) {
          this.$Message.success(res.data.message);
          this.loadUserList();
          this.formModel.selection = [];
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
          this.loadUserList();
          this.formModel.selection = [];
        } else {
          this.$Message.warning(res.data.message);
        }
        this.$Modal.remove();
      });
    },
    handleSearchUser() {
      this.loadUserList();
    },
    rowClsRender(row, index) {
      if (row.isDeleted) {
        return "table-row-disabled";
      }
      return "";
    },
    handleSortChange(column) {
      this.stores.user.query.sort.direction = column.order;
      this.stores.user.query.sort.field = column.key;
      this.loadPostList();
    },
    handlePageChanged(page) {
      this.stores.user.query.currentPage = page;
      this.loadUserList();
    },
    handlePageSizeChanged(pageSize) {
      this.stores.user.query.pageSize = pageSize;
      this.loadUserList();
    },
    renderOwnedRoles(item) {
      return item.label;
    },
    handleChangeOwnedRolesChanged(newTargetKeys, direction, moveKeys) {
      this.formAssignRole.ownedRoles = newTargetKeys;
    },
    loadUserRoleList(guid) {
      this.formAssignRole.roles = [];
      this.formAssignRole.ownedRoles = [];
      loadRoleListByUserGuid(guid).then((res) => {
        var result = res.data.data;
        this.formAssignRole.roles = result.roles;
        this.formAssignRole.ownedRoles = result.assignedRoles;
      });
    },
    handleAssignRole(row) {
      this.formAssignRole.opened = true;
      this.formAssignRole.userGuid = row.guid;
      this.loadUserRoleList(row.guid);
    },
    handleSaveUserRoles() {
      var data = {
        userGuid: this.formAssignRole.userGuid,
        assignedRoles: this.formAssignRole.ownedRoles,
      };
      saveUserRoles(data).then((res) => {
        this.formAssignRole.opened = false;
        if (res.data.code === 200) {
          this.$Message.success(res.data.message);
        } else {
          this.$Message.warning(res.data.message);
        }
      });
    },
    renderUserType(userType) {
      var userTypeText = "未知";
      switch (userType) {
        case 0:
          userTypeText = "超級管理員";
          break;
        case 1:
          userTypeText = "管理員";
          break;
        case 2:
          userTypeText = "普通使用者";
          break;
      }
      return userTypeText;
    },
    renderStatus(status) {
      let _status = {
        color: "success",
        text: "正常",
      };
      switch (status) {
        case 0:
          _status.text = "禁用";
          _status.color = "error";
          break;
      }
      return _status;
    },
  },
  mounted() {
    this.loadUserList();
  },
};
</script>

<style></style>
