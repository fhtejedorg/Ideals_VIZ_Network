import { readable, writable, derived } from "svelte/store";
import { dsv } from 'd3-fetch'
import { browser } from '$app/environment'
import html2canvas from 'html2canvas';



const data = readable([], function start(set) {
    if (browser) {
        dsv(";", "Inventory_Indicators_Dimensions_Ideals.csv").then(data => {
            console.log("data", data)
            set(data)
        })
    }
})

const hovering = writable(false);

const radiusPerNodeType = {
    'indicator': 5,
    'theme': 15,
    'dimension': 20,
    'pillar': 20,
    'ideal': 30,
    'impactType': 10
}

const colorsPerIdeal = {
    "Growth": "#e0001b", //red
    "Equal opp": "#8e9e09", //light green
    "Sustainability": "#357629", //dark green
    "Better admin": "#6a93cc", //middle blue
    "Safety": "#6c5faa", //dark purple
    "Together": "#70a7bf", //light blue
    "Freedom": "#ffcb00" //yellow
}

const colorsPerImpactType = {
    "Here and Now": "#4C789E", //dark blue
    "Later": "#724194", //light purple
    "Elsewhere": "#70a7bf", //light blue
}

const colorsPerPillar = {
    'Economic': "#e0001b", //red
    'Environmental': "#8e9e09", //light green
    'Social': "#ffcb00" //yellow
}

const network = derived(data, $data => {
    let nodes = []
    let links = []
    //construct network
    $data.forEach(d => {
        //get nodes
        const indicator = getNode(nodes, d['indicator'], 'indicator')
        const theme = getNode(nodes, d['theme'], 'theme')
        //const dimension = getNode(nodes, d['dimension'], 'dimension')
        //const pillar = getNode(nodes, d['Pillar'], 'pillar')
        const ideal = getNode(nodes, d['Ideal'], 'ideal')

        indicator['color'] = colorsPerPillar[d['Pillar']]
        indicator['impactTypes'] = d['Type_Impact']
            .split(',')
            .map(name => name.trim())
        ideal['color'] = '#818386'
        //dimension['color'] = "#818386" //light blue
        theme['color'] = "#818386" //light blue
        //pillar['color'] = "#818386" //light green


        // const impactTypeNodes = d['Type_Impact']
        //     .split(',')
        //     .map(name => name.trim())
        //     .filter(name => name.length > 0) //filter out empty nodes, i.e. unknown impact types
        //     .map(name => getNode(nodes, name, 'impactType'))

        // impactTypeNodes.forEach(n => {
        //     n['color'] = colorsPerImpactType[n.name]
        // })
        //add links
        const indicatorThemeLink = addLinkIfNotPresent(links, indicator, theme)
        //const themeDimensionLink = addLinkIfNotPresent(links, theme, dimension)
        //const themePillarLink = addLinkIfNotPresent(links, theme, pillar)
        const indicatorIdealLink = addLinkIfNotPresent(links, indicator, ideal)

        // impactTypeNodes.forEach(impactType => {
        //     const indicatorImpactTypeLink = addLinkIfNotPresent(links, indicator, impactType)
        //     indicatorImpactTypeLink['color'] = colorsPerImpactType[impactType.name]
        // })
        indicatorThemeLink['color'] = "#dddddd"
        //themeDimensionLink['color'] = "#818386"
        //themePillarLink['color'] = "#818386"
        indicatorIdealLink['color'] = "#dddddd" //#dddddd
    })
    //for highlighting: set all links of a node as an attribute of that node
    nodes.forEach(n => {
        n.links = []
        //n.id.nodes.push(n)
        //n.source.nodes.push(n)
        n.highlight = false
    })
    links.forEach(l => {
        l.source.links.push(l)
        l.target.links.push(l)
        l.highlight = false
    })
    return { nodes: nodes, links: links }
})

//searches for a node with given name and type in list of nodes. If node not present, creates a new node, adds
//it to nodes, and returns it as the result
function getNode(nodes, name, type) {
    let node = nodes.find(n => n['name'].toLowerCase() == name.toLowerCase() && n['type'] == type)
    if (!node) {
        node = {
            id: nodes.length,
            name: name,
            type: type,
            radius: radiusPerNodeType[type]
        }
        nodes.push(node)
    }
    return node
}

function addLinkIfNotPresent(links, sourceNode, targetNode) {
    let link = links.find(l => l.source == sourceNode && l.target == targetNode)
    if (!link) {
        link = {
            source: sourceNode,
            target: targetNode
        }
        links.push(link)
    }
    return link
}

export {
    network,
    hovering
}

// // Add a function to capture and save the graph as a PNG image
// async function captureAndSaveGraph() {
//     try {
//         const graphContainer = document.getElementById('graph-container'); // Assuming 'graph-container' is the ID of the HTML element containing the graph
//         const canvas = await html2canvas(graphContainer); // Capture the HTML element containing the graph and convert it to a canvas
//         const imageURL = canvas.toDataURL('image/png'); // Convert the canvas to a data URL representing a PNG image
//         // Create a temporary link element to download the image
//         const link = document.createElement('a');
//         link.href = imageURL;
//         link.download = 'network-graph.png'; // Set the filename for the downloaded image
//         // Simulate a click on the link to trigger the download
//         link.click();
//     } catch (error) {
//         console.error('Error capturing and saving graph:', error);
//     }
// }

// // You can then call this function when needed, for example, in response to a button click
// async function handleSaveButtonClick() {
//     await captureAndSaveGraph();
// } 

// // Optionally, you can bind this function to a button or another UI element to trigger the saving process
// <button on:click={handleSaveButtonClick}>Save Graph as PNG</button>
  