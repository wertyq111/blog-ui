<template>
  <component :is="activeComponent" />
</template>

<script>
import DashboardWorkplaceLegacy from "./workplace-legacy.vue";
import DashboardWorkplaceV2 from "./workplace-v2.vue";

function isEnabled() {
  // 默认开启 V2；显式设置 0/false/no/off 时回退到 legacy（便于线上一键回退）。
  const raw = process.env.VUE_APP_WP_DASHBOARD_V2;
  if (raw === undefined || raw === null || raw === "") {
    return true;
  }
  const value = String(raw).toLowerCase();
  return !(value === "0" || value === "false" || value === "no" || value === "off");
}

export default {
  name: "DashboardWorkplace",
  components: {
    DashboardWorkplaceLegacy,
    DashboardWorkplaceV2,
  },
  computed: {
    activeComponent() {
      return isEnabled() ? "DashboardWorkplaceV2" : "DashboardWorkplaceLegacy";
    },
  },
};
</script>
