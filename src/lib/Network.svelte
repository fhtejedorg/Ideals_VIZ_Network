<script>
    import { network, hovering } from "$lib/stores.js";
    import { onMount } from "svelte";
    import {
        forceX,
        forceY,
        forceManyBody,
        forceLink,
        forceSimulation,
        forceCollide,
    } from "d3-force";
    import Arcs from "$lib/Arcs.svelte";

    $: console.log("network", $network);

    onMount(() => {
        // initZoom();
        initNetwork();
    });

    let svg; //ref to svg element

    let networkWidth = 1800;
    let networkHeight = 1600;

    let simulation;

    let nodesInNetwork = [];
    let linksInNetwork = [];

    let textElements = [];

    const highlightColor = "#ded51f";

    const idealsXPos = {
        Growth: -300,
        "Equal opp": -200,
        Sustainability: -100,
        "Better admin": 0,
        Safety: 100,
        Together: 200,
        Freedom: 300,
    };

    const idealNodesOrder = [
        "Together",
        "Freedom",
        "Safety",
        "Better admin",
        "Equal opp",
        "Growth",
        "Sustainability",
    ];

    const themeNodesOrder = [
        "Social Connections",
        "Air Quality",
        "Work Life Balance",
        "Safety",
        "Health",
        "Institutional",
        "Subjective Well-Being",
        "Financial Capital",
        "Consumption and Income",
        "Labour",
        "Housing",
        "Education",
        "Knowledge Capital",
        "Monetary Aggregates",
        "Demography ",
        "Physical Capital",
        "Non-Energy Resources",
        "Energy Resources",
        "Transport",
        "Climate",
        "Water",
        "Land and Ecosystems ",
    ];

    const pillarNodesOrder = ["Economic", "Environmental", "Social"];

    const impactTypeNodesOrder = ["Here and Now", "Later", "Elsewhere"];

    const idealsCircleRadius = 500;
    const themesCircleRadius = 350;
    const dimensionCircleRadius = 600;
    const impactTypeCircleRadius = 150;

    const yPosPerNodeType = {
        ideal: 0,
        sub_theme: 100,
        theme: 200,
    };

    //anytime nodes or links change, restart simulation with new nodes and links
    $: {
        restartNetwork($network);
    }

    function initNetwork() {
        console.log("initializing network");
        //resize();
        //gravitate towards center
        const fX = forceX(0).strength(0.1);
        const fY = forceY(0).strength(0.1);
        simulation = forceSimulation(nodesInNetwork)
            .force("x", fX)
            .force("y", fY)
            .force("charge", forceManyBody().strength(-100))
            .force("link", forceLink(linksInNetwork).distance(10))
            .force(
                "collide",
                forceCollide()
                    .radius((n) => n.radius + 5)
                    .iterations(2)
            )
            .on("tick", () => ticked()) //anonymous, otherwise 'this' refers to simulation
            .on("end", () => printPositions())
            .alphaDecay(0.0228); //0.0228
    }

    function ticked(alpha) {
        // forceNodesToCircle(
        //     nodesInNetwork.filter((n) => n.type == "ideal"),
        //     idealsCircleRadius,
        //     simulation.alpha()
        // );
        // forceNodesToCircle(
        //     nodesInNetwork.filter((n) => n.type == "theme"),
        //     themesCircleRadius,
        //     simulation.alpha()
        // );
        // forceNodesToCircle(
        //     nodesInNetwork.filter((n) => n.type == "dimension"),
        //     dimensionCircleRadius,
        //     simulation.alpha()
        // );
        // forceNodesToCircle(
        //     nodesInNetwork.filter((n) => n.type == "impactType"),
        //     impactTypeCircleRadius,
        //     simulation.alpha()
        // );
        nodesInNetwork = [...nodesInNetwork];
        linksInNetwork = [...linksInNetwork];
    }

    function restartNetwork(network) {
        nodesInNetwork = [...network.nodes];
        linksInNetwork = [...network.links];
        fixNodePositions();
        if (simulation) {
            simulation.stop();
            simulation.nodes(nodesInNetwork);
            simulation.force("link").links(linksInNetwork);
            //simulation.force("charge", forceManyBody().strength(-100));
            simulation.alpha(1).restart();
        }
    }

    function forceNodesToCircle(nodes, radius, alpha) {
        nodes.forEach((n) => {
            n.angle = Math.atan2(n.y, n.x);
            if (n.angle < 0) {
                n.angle += 2 * Math.PI;
            }
        });
        //sort nodes according to angle from low to hight
        //nodes.sort((n1, n2) => n1.angle - n2.angle);
        nodes.forEach((n, i) => {
            const targetAngle = i * ((2 * Math.PI) / nodes.length);
            const angle = n.angle; // + (1 - alpha) * (targetAngle - n.angle);
            const target = {
                x: radius * Math.cos(angle),
                y: radius * Math.sin(angle),
            };
            const delta = {
                x: target.x - n.x,
                y: target.y - n.y,
            };
            n.x = n.x + (1 - alpha) * delta.x;
            n.y = n.y + (1 - alpha) * delta.y;
        });
    }

    function fixNodePositions() {
        // nodesInNetwork
        //     .filter((n) => n.type == "ideal")
        //     .forEach((n) => {
        //         const angleStep = (2 * Math.PI) / idealNodesOrder.length;
        //         const angle = idealNodesOrder.indexOf(n.name) * angleStep;
        //         n.fx = idealsCircleRadius * Math.cos(angle);
        //         n.fy = idealsCircleRadius * Math.sin(angle);
        //         n.startAngle = angle - angleStep / 2;
        //         n.endAngle = angle + angleStep / 2;
        //     });
        // nodesInNetwork
        //     .filter((n) => n.type == "theme")
        //     .forEach((n) => {
        //         const angle =
        //             (themeNodesOrder.indexOf(n.name) * 2 * Math.PI) /
        //             themeNodesOrder.length;
        //         n.fx = themesCircleRadius * Math.cos(angle);
        //         n.fy = themesCircleRadius * Math.sin(angle);
        //     });
        nodesInNetwork
            .filter((n) => n.type == "impactType")
            .forEach((n) => {
                const angleStep = (2 * Math.PI) / impactTypeNodesOrder.length;
                const angle = impactTypeNodesOrder.indexOf(n.name) * angleStep;
                n.fx = impactTypeCircleRadius * Math.cos(angle);
                n.fy = impactTypeCircleRadius * Math.sin(angle);
                n.startAngle = angle - angleStep / 2;
                n.endAngle = angle + angleStep / 2;
            });
    }

    function printPositions() {
        console.log("ideals");
        let idealNodes = [...nodesInNetwork.filter((n) => n.type == "ideal")];
        idealNodes.sort((n1, n2) => n1.angle - n2.angle);
        console.log(idealNodes.map((n) => n.name));

        console.log("themes");
        let themeNodes = [...nodesInNetwork.filter((n) => n.type == "theme")];
        themeNodes.sort((n1, n2) => n1.angle - n2.angle);
        console.log(themeNodes.map((n) => n.name));
    }

    function showHighlights(node) {
        $hovering = true;
        setHighlight(node, true);
        node.links.forEach((l) => {
            if (l.source.type == "indicator") {
                setHighlight(l.source, true);
            }
            if (l.target.type == "indicator") {
                setHighlight(l.target, true);
            }
        });
        nodesInNetwork = [...nodesInNetwork];
        linksInNetwork = [...linksInNetwork];
    }

    function hideHighlights(node) {
        $hovering = false;
        setHighlight(node, false);
        node.links.forEach((l) => {
            setHighlight(l.source, false);
            setHighlight(l.target, false);
        });
        nodesInNetwork = [...nodesInNetwork];
        linksInNetwork = [...linksInNetwork];
    }

    //sets highlight of a node and its links
    function setHighlight(node, highlighted) {
        node.highlight = highlighted;
        node.links.forEach((l) => {
            l.highlight = highlighted;
            l.source.highlight = highlighted;
            l.target.highlight = highlighted;
        });
    }
</script>

<div class="main-container">
    <div class="network-container">
        <!-- svelte-ignore a11y-mouse-events-have-key-events -->
        <svg width={networkWidth} height={networkHeight} bind:this={svg}>
            <g transform="translate({networkWidth / 2}, {networkHeight / 2})">
                <!-- <Arcs nodeType="impactType" radius={impactTypeCircleRadius} /> -->
                <!-- <Arcs nodeType="ideal" radius={idealsCircleRadius} /> -->
                <g id="links">
                    {#each linksInNetwork as link}
                        {#if !$hovering || link.highlight}
                            <line
                                x1={link.source.x}
                                y1={link.source.y}
                                x2={link.target.x}
                                y2={link.target.y}
                                stroke={link.color}
                                stroke-width={1}
                                opacity={0.5}
                            />
                        {/if}
                    {/each}
                </g>
                <g id="nodes">
                    {#each nodesInNetwork.filter((n) => n.type == "ideal") as node}
                        <g transform="translate({node.x - 40},{node.y - 40})">
                            <image
                                href="icons/{node.name}.png"
                                height="80"
                                width="80"
                            />
                        </g>
                    {/each}
                    {#each nodesInNetwork.filter((n) => n.type == "theme") as node}
                        <circle
                            cx={node.x}
                            cy={node.y}
                            r={node.radius}
                            fill={node.color}
                            stroke={"#ffffff"}
                            stroke-width="1"
                            opacity={$hovering ? (node.highlight ? 1 : 0.1) : 1}
                            on:mouseover={() => {
                                showHighlights(node);
                            }}
                            on:mouseout={() => {
                                hideHighlights(node);
                            }}
                        />
                    {/each}
                    {#each nodesInNetwork.filter((n) => n.type == "indicator") as node}
                        <g transform="translate({node.x},{node.y})">
                            {#if node.impactTypes.length > 1}
                                <circle
                                    r={node.radius}
                                    fill={node.color}
                                    stroke={"#ffffff"}
                                    stroke-width="1"
                                />
                            {:else if node.impactTypes[0] == "Here and now"}
                                <polygon
                                    points="-8,-4 8,-4 0,10"
                                    fill={node.color}
                                    stroke={"#ffffff"}
                                    stroke-width="1"
                                />
                            {:else if node.impactTypes[0] == "Elsewhere"}
                                <polygon
                                    points="0,-8 8,0 0,8 -8,0"
                                    fill={node.color}
                                    stroke={"#ffffff"}
                                    stroke-width="1"
                                />
                            {:else}
                                <!--Later-->
                                <rect
                                    dx={-5}
                                    dy={-5}
                                    width={10}
                                    height={10}
                                    fill={node.color}
                                    stroke={"#ffffff"}
                                    stroke-width="1"
                                />
                            {/if}
                        </g>
                    {/each}
                </g>
                {#each nodesInNetwork.filter( (n) => ["theme", "dimension", "impactType"].includes(n.type) ) as node, i}
                    {#if !$hovering || node.highlight}
                        <g id="label">
                            <rect
                                x={node.x -
                                    (textElements[i]
                                        ? textElements[i].getBBox().width / 2
                                        : 0)}
                                y={node.y - 12}
                                width={textElements[i]
                                    ? textElements[i].getBBox().width
                                    : 0}
                                height={24}
                                fill="#000000"
                                on:mouseover={() => {
                                    showHighlights(node);
                                }}
                                on:mouseout={() => {
                                    hideHighlights(node);
                                }}
                            />

                            <text
                                font-family="Fago Office Serif"
                                x={node.x}
                                y={node.y}
                                dy="8"
                                text-anchor="middle"
                                fill={"#ffffff"}
                                pointer-events="none"
                                bind:this={textElements[i]}
                            >
                                {node.name}
                            </text>
                        </g>
                    {/if}
                {/each}
            </g>
        </svg>
    </div>
</div>
