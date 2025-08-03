export interface ChartConfig {
  id: string;
  title: string;
  type:
    | "bar"
    | "line"
    | "pie"
    | "area"
    | "scatter"
    | "bubble"
    | "streamgraph"
    | "spiral"
    | "heatmap"
    | "treemap";
  xKey: string;
  yKey: string;
  zKey?: string;
}
