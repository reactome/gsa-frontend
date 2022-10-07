import {ToolParameter} from "./tool-parameter.model";

export interface Tool {
  description: string
  name: string
  parameter: ToolParameter
}
