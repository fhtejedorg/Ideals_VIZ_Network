<script>
  import { network, hovering } from "$lib/stores.js";

  export let nodeType;
  export let radius;

  $: arcNodes = $network.nodes.filter((n) => n.type == nodeType);

  const arcThickness = 60;

  function getArcPathForNode(node) {
    const innerRadius = radius - arcThickness / 2;
    const outerRadius = innerRadius + arcThickness;
    const x1 = outerRadius * Math.cos(node.startAngle);
    const y1 = outerRadius * Math.sin(node.startAngle);
    const x2 = outerRadius * Math.cos(node.endAngle);
    const y2 = outerRadius * Math.sin(node.endAngle);
    const x3 = innerRadius * Math.cos(node.endAngle);
    const y3 = innerRadius * Math.sin(node.endAngle);
    const x4 = innerRadius * Math.cos(node.startAngle);
    const y4 = innerRadius * Math.sin(node.startAngle);
    return (
      `M ${x1} ${y1}` +
      `A ${outerRadius} ${outerRadius} 0 0 1 ${x2} ${y2}` +
      `L ${x3} ${y3}` +
      `A ${innerRadius} ${innerRadius} 0 0 0 ${x4} ${y4} Z`
    );
  }

function wrapNodeLabel(node) {
    // Simple example: split a node's name into multiple parts if too long
    const maxLength = 10; // Max characters per line
    let parts = [];
    for (let i = 0; i < node.name.length; i += maxLength) {
      parts.push(node.name.substring(i, i + maxLength));
    }
    return parts;
  }

function calcDy(node, i) {
  // Calculate vertical offset for each line of text
  const lineHeight = 12; // Adjust as needed
  return `${i * lineHeight}px`;
}


function getTextPathForArc(node) {
  const midAngle = (node.startAngle + node.endAngle) / 2;
  const isRightHalf = midAngle < Math.PI; // Determine if the text should be oriented from start to end or reverse
  const startAngle = isRightHalf ? node.startAngle : node.endAngle;
  const endAngle = isRightHalf ? node.endAngle : node.startAngle;

  const textPathRadius = radius + 0.5 * arcThickness; // Adjusted for better visibility
  const x1 = textPathRadius * Math.cos(startAngle);
  const y1 = textPathRadius * Math.sin(startAngle);
  const x2 = textPathRadius * Math.cos(endAngle);
  const y2 = textPathRadius * Math.sin(endAngle);

  const largeArc = (endAngle - startAngle) > Math.PI ? 1 : 0;
  const sweep = isRightHalf ? 1 : 0;

  return `M ${x1} ${y1} A ${textPathRadius} ${textPathRadius} 0 ${largeArc} ${sweep} ${x2} ${y2}`;
  }

</script>

<g id="arc-labels">
  {#each arcNodes as node}
    <path
      d={getTextPathForArc(node)}
      fill="none"
      id={"label-path-" + node.id}
    />
    <text>
      <textPath
        class="arcLabel"
        href={"#label-path-" + node.id}
        startOffset="50%"
        style="font-size: 18px;" 
      >
        {node.name}  // Example to show node name directly; replace with wrapped text handling if needed
      </textPath>
    </text>
  {/each}
</g>


<style>
  .arc {
    outline-width: 0px;
  }
  .arcLabel {
    text-transform: lowercase;
    fill: white;
    text-anchor: middle;
    dominant-baseline: middle;
  }
  .arc-overlay {
    user-select: none;
    pointer-events: none;
  }

  text {
    user-select: none;
    pointer-events: none;
  }
</style>


