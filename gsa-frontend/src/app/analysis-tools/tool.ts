import {ToolParameter} from "./toolParameter";

export interface Tool {
  description: string
  name: string
  parameter: ToolParameter
}
