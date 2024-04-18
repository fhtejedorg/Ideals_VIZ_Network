import { c as create_ssr_component, v as validate_component, a as subscribe, b as add_attribute, e as escape, d as each } from './index2-48f00034.js';
import { d as derived, r as readable, w as writable } from './index-53f99f5c.js';
import 'html2canvas';

const data = readable([], function start(set) {
});
const hovering = writable(false);
const radiusPerNodeType = {
  "indicator": 5,
  "theme": 15,
  "dimension": 20,
  "pillar": 20,
  "ideal": 30,
  "impactType": 10
};
const colorsPerPillar = {
  "Economic": "#e0001b",
  //red
  "Environmental": "#8e9e09",
  //light green
  "Social": "#ffcb00"
  //yellow
};
const network = derived(data, ($data) => {
  let nodes = [];
  let links = [];
  $data.forEach((d) => {
    const indicator = getNode(nodes, d["indicator"], "indicator");
    const theme = getNode(nodes, d["theme"], "theme");
    const ideal = getNode(nodes, d["Ideal"], "ideal");
    indicator["color"] = colorsPerPillar[d["Pillar"]];
    indicator["impactTypes"] = d["Type_Impact"].split(",").map((name) => name.trim());
    ideal["color"] = "#818386";
    theme["color"] = "#818386";
    const indicatorThemeLink = addLinkIfNotPresent(links, indicator, theme);
    const indicatorIdealLink = addLinkIfNotPresent(links, indicator, ideal);
    indicatorThemeLink["color"] = "#dddddd";
    indicatorIdealLink["color"] = "#dddddd";
  });
  nodes.forEach((n) => {
    n.links = [];
    n.highlight = false;
  });
  links.forEach((l) => {
    l.source.links.push(l);
    l.target.links.push(l);
    l.highlight = false;
  });
  return { nodes, links };
});
function getNode(nodes, name, type) {
  let node = nodes.find((n) => n["name"].toLowerCase() == name.toLowerCase() && n["type"] == type);
  if (!node) {
    node = {
      id: nodes.length,
      name,
      type,
      radius: radiusPerNodeType[type]
    };
    nodes.push(node);
  }
  return node;
}
function addLinkIfNotPresent(links, sourceNode, targetNode) {
  let link = links.find((l) => l.source == sourceNode && l.target == targetNode);
  if (!link) {
    link = {
      source: sourceNode,
      target: targetNode
    };
    links.push(link);
  }
  return link;
}
let networkWidth = 1800;
let networkHeight = 1600;
const impactTypeCircleRadius = 150;
const Network = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $hovering, $$unsubscribe_hovering;
  let $network, $$unsubscribe_network;
  $$unsubscribe_hovering = subscribe(hovering, (value) => $hovering = value);
  $$unsubscribe_network = subscribe(network, (value) => $network = value);
  let svg;
  let nodesInNetwork = [];
  let linksInNetwork = [];
  let textElements = [];
  const impactTypeNodesOrder = ["Here and Now", "Later", "Elsewhere"];
  function restartNetwork(network2) {
    nodesInNetwork = [...network2.nodes];
    linksInNetwork = [...network2.links];
    fixNodePositions();
  }
  function fixNodePositions() {
    nodesInNetwork.filter((n) => n.type == "impactType").forEach((n) => {
      const angleStep = 2 * Math.PI / impactTypeNodesOrder.length;
      const angle = impactTypeNodesOrder.indexOf(n.name) * angleStep;
      n.fx = impactTypeCircleRadius * Math.cos(angle);
      n.fy = impactTypeCircleRadius * Math.sin(angle);
      n.startAngle = angle - angleStep / 2;
      n.endAngle = angle + angleStep / 2;
    });
  }
  {
    console.log("network", $network);
  }
  {
    {
      restartNetwork($network);
    }
  }
  $$unsubscribe_hovering();
  $$unsubscribe_network();
  return `<div class="main-container"><div class="network-container">
        <svg${add_attribute("width", networkWidth, 0)}${add_attribute("height", networkHeight, 0)}${add_attribute("this", svg, 0)}><g transform="${"translate(" + escape(networkWidth / 2, true) + ", " + escape(networkHeight / 2, true) + ")"}"><g id="links">${each(linksInNetwork, (link) => {
    return `${!$hovering || link.highlight ? `<line${add_attribute("x1", link.source.x, 0)}${add_attribute("y1", link.source.y, 0)}${add_attribute("x2", link.target.x, 0)}${add_attribute("y2", link.target.y, 0)}${add_attribute("stroke", link.color, 0)}${add_attribute("stroke-width", 1, 0)}${add_attribute("opacity", 0.5, 0)}></line>` : ``}`;
  })}</g><g id="nodes">${each(nodesInNetwork.filter((n) => n.type == "ideal"), (node) => {
    return `<g transform="${"translate(" + escape(node.x - 40, true) + "," + escape(node.y - 40, true) + ")"}"><image href="${"icons/" + escape(node.name, true) + ".png"}" height="80" width="80"></image></g>`;
  })}${each(nodesInNetwork.filter((n) => n.type == "theme"), (node) => {
    return `<circle${add_attribute("cx", node.x, 0)}${add_attribute("cy", node.y, 0)}${add_attribute("r", node.radius, 0)}${add_attribute("fill", node.color, 0)}${add_attribute("stroke", "#ffffff", 0)} stroke-width="1"${add_attribute("opacity", $hovering ? node.highlight ? 1 : 0.1 : 1, 0)}></circle>`;
  })}${each(nodesInNetwork.filter((n) => n.type == "indicator"), (node) => {
    return `<g transform="${"translate(" + escape(node.x, true) + "," + escape(node.y, true) + ")"}">${node.impactTypes.length > 1 ? `<circle${add_attribute("r", node.radius, 0)}${add_attribute("fill", node.color, 0)}${add_attribute("stroke", "#ffffff", 0)} stroke-width="1"></circle>` : `${node.impactTypes[0] == "Here and now" ? `<polygon points="-8,-4 8,-4 0,10"${add_attribute("fill", node.color, 0)}${add_attribute("stroke", "#ffffff", 0)} stroke-width="1"></polygon>` : `${node.impactTypes[0] == "Elsewhere" ? `<polygon points="0,-8 8,0 0,8 -8,0"${add_attribute("fill", node.color, 0)}${add_attribute("stroke", "#ffffff", 0)} stroke-width="1"></polygon>` : `
                                <rect${add_attribute("dx", -5, 0)}${add_attribute("dy", -5, 0)}${add_attribute("width", 10, 0)}${add_attribute("height", 10, 0)}${add_attribute("fill", node.color, 0)}${add_attribute("stroke", "#ffffff", 0)} stroke-width="1"></rect>`}`}`}</g>`;
  })}</g>${each(nodesInNetwork.filter((n) => ["theme", "dimension", "impactType"].includes(n.type)), (node, i) => {
    return `${!$hovering || node.highlight ? `<g id="label"><rect${add_attribute(
      "x",
      node.x - (textElements[i] ? textElements[i].getBBox().width / 2 : 0),
      0
    )}${add_attribute("y", node.y - 12, 0)}${add_attribute("width", textElements[i] ? textElements[i].getBBox().width : 0, 0)}${add_attribute("height", 24, 0)} fill="#000000"></rect><text font-family="Fago Office Serif"${add_attribute("x", node.x, 0)}${add_attribute("y", node.y, 0)} dy="8" text-anchor="middle"${add_attribute("fill", "#ffffff", 0)} pointer-events="none"${add_attribute("this", textElements[i], 0)}>${escape(node.name)}</text></g>` : ``}`;
  })}</g></svg></div></div>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div>${validate_component(Network, "Network").$$render($$result, {}, {}, {})}</div>`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-823c8c50.js.map
