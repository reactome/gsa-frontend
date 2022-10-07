import {ToolParameter} from "./tool-parameter";

export interface Tool {
  description: string
  name: string
  parameter: ToolParameter
}
