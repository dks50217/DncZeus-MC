<template>
  <div>
    <Card shadow>
      <Row>
        <i-col span="4">
          <Button @click="createTagParams">新增一個標籤</Button>
        </i-col>
        <i-col span="20">
          <p>動態路由，新增params</p>
        </i-col>
      </Row>
    </Card>
    <Card shadow style="margin-top: 10px;">
      <Row>
        <i-col span="4">
          <Button @click="createTagQuery">新增一個標籤</Button>
        </i-col>
        <i-col span="20">
          <p>動態路由，新增query</p>
        </i-col>
      </Row>
    </Card>
    <Card shadow style="margin-top: 10px;">
      <Row>
        <i-col span="4">
          <Button @click="handleCloseTag">關閉工具方法頁</Button>
        </i-col>
        <i-col span="20">
          <p>手動關閉頁面</p>
        </i-col>
      </Row>
    </Card>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  name: "tools_methods_page",
  methods: {
    ...mapMutations(["closeTag"]),
    createTagParams() {
      const id = parseInt(Math.random() * 100000);
      const route = {
        name: "params",
        params: {
          id
        },
        meta: {
          title: "動態路由"
        }
      };
      this.$router.push(route);
    },
    createTagQuery() {
      const id = parseInt(Math.random() * 100000);
      const route = {
        name: "query",
        query: {
          id
        },
        meta: {
          title: "動態參數"
        }
      };
      this.$router.push(route);
    },
    handleCloseTag() {
      this.closeTag({
        name: "tools_methods_page"
      });
    }
  }
};
</script>

<style>
</style>
