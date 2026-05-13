<template>
  <component :is="activeComponent" />
</template>

<script>
import DashboardWorkplaceLegacy from "./workplace-legacy.vue";
import DashboardWorkplaceV2 from "./workplace-v2.vue";

function isEnabled() {
  const value = String(process.env.VUE_APP_WP_DASHBOARD_V2 || "").toLowerCase();
  return value === "1" || value === "true" || value === "yes" || value === "on";
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
