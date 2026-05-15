import * as echarts from "echarts/core";
import { LineChart, HeatmapChart, BarChart, PieChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  VisualMapComponent,
  LegendComponent,
  PolarComponent,
  GraphicComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([
  LineChart,
  HeatmapChart,
  BarChart,
  PieChart,
  GridComponent,
  TooltipComponent,
  VisualMapComponent,
  LegendComponent,
  PolarComponent,
  GraphicComponent,
  CanvasRenderer,
]);

export default echarts;
