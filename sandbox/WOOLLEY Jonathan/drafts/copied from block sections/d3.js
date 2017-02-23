import {drag} from "d3-drag";
import {format} from "d3-format";
import {scaleOrdinal, schemeCategory20} from "d3-scale";
import {select} from "d3-selection";
import {sankey} from "d3-sankey";
import {json} from "d3-request";
import {rgb} from "d3-color";

export default {
  format: format,
  scaleOrdinal: scaleOrdinal,
  schemeCategory20: schemeCategory20,
  drag: drag,
  select: select,
  sankey: sankey,
  json: json,
  rgb: rgb
}