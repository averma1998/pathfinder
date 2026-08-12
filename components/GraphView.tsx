"use client";

import "@xyflow/react/dist/style.css";

import {
    useEffect,
    useMemo,
    useState,
    type MouseEvent,
} from "react";

import dagre from "@dagrejs/dagre";

import {
    ReactFlow,
    Background,
    Controls,
    type Node,
    type Edge,
    Position,
} from "@xyflow/react";

type GraphNode = {
    id: string;
    type: string;
    label: string;
    data: Record<string, unknown>;
};

type GraphEdge = {
    id: string;
    source: string;
    target: string;
    label: string;
};

type GraphResponse = {
    success: boolean;
    nodes: GraphNode[];
    edges: GraphEdge[];
};

type Props = {
    developerId: string;
};

const NODE_WIDTH = 150;
const NODE_HEIGHT = 50;


/* =========================================================
   NODE STYLE
========================================================= */

function getNodeStyle(type: string) {
    if (type === "developer") {
        return {
            background: "#0e7490",
            border: "2px solid #22d3ee",
            color: "#ffffff",
        };
    }

    if (type === "skill") {
        return {
            background: "#1e293b",
            border: "1px solid #64748b",
            color: "#ffffff",
        };
    }

    if (type === "project") {
        return {
            background: "#312e81",
            border: "1px solid #818cf8",
            color: "#ffffff",
        };
    }

    if (type === "technology") {
        return {
            background: "#172554",
            border: "1px solid #3b82f6",
            color: "#ffffff",
        };
    }

    return {
        background: "#1e293b",
        border: "1px solid #475569",
        color: "#ffffff",
    };
}


/* =========================================================
   DAGRE LAYOUT
========================================================= */

function layoutGraph(
    nodes: Node[],
    edges: Edge[]
): Node[] {

    const dagreGraph =
        new dagre.graphlib.Graph();

    dagreGraph.setDefaultEdgeLabel(
        () => ({})
    );

    dagreGraph.setGraph({
        rankdir: "LR",

        /*
         * Keep the graph compact.
         */
        ranksep: 90,

        nodesep: 45,

        marginx: 40,

        marginy: 40,
    });


    nodes.forEach((node) => {

        dagreGraph.setNode(
            node.id,
            {
                width: NODE_WIDTH,
                height: NODE_HEIGHT,
            }
        );

    });


    edges.forEach((edge) => {

        dagreGraph.setEdge(
            edge.source,
            edge.target
        );

    });


    dagre.layout(dagreGraph);


    return nodes.map((node) => {

        const position =
            dagreGraph.node(node.id);


        /*
         * Safety fallback.
         *
         * If Dagre cannot calculate a position,
         * don't let the node disappear.
         */

        if (!position) {

            return {
                ...node,

                position: {
                    x: 100,
                    y: 100,
                },

                sourcePosition:
                    Position.Right,

                targetPosition:
                    Position.Left,
            };

        }


        return {

            ...node,

            sourcePosition:
                Position.Right,

            targetPosition:
                Position.Left,

            position: {

                x:
                    position.x -
                    NODE_WIDTH / 2,

                y:
                    position.y -
                    NODE_HEIGHT / 2,

            },

        };

    });
}


/* =========================================================
   GRAPH VIEW
========================================================= */

export default function GraphView({
    developerId,
}: Props) {

    const [graph, setGraph] =
        useState<GraphResponse | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [selectedNode, setSelectedNode] =
        useState<GraphNode | null>(null);


    /* =====================================================
       LOAD GRAPH
    ====================================================== */

    useEffect(() => {

        async function loadGraph() {

            try {

                setLoading(true);

                setError("");

                setSelectedNode(null);


                const response =
                    await fetch(
                        `/api/graph?developerId=${developerId}`
                    );


                if (!response.ok) {

                    throw new Error(
                        "Graph API failed"
                    );

                }


                const data =
                    await response.json();


                console.log(
                    "GRAPH DATA:",
                    data
                );


                if (!data.success) {

                    throw new Error(
                        data.message ||
                        "Graph unavailable"
                    );

                }


                setGraph(data);

            } catch (error) {

                console.error(
                    "Graph loading error:",
                    error
                );

                setError(
                    "Unable to load career graph."
                );

            } finally {

                setLoading(false);

            }

        }


        loadGraph();

    }, [developerId]);


    /* =====================================================
       CREATE REACT FLOW NODES
    ====================================================== */

    const nodes: Node[] =
        useMemo(() => {

            if (!graph) {
                return [];
            }


            const rawNodes: Node[] =
                graph.nodes.map(
                    (node) => {

                        const isSelected =
                            selectedNode?.id ===
                            node.id;


                        return {

                            id: node.id,

                            type: "default",

                            position: {
                                x: 0,
                                y: 0,
                            },


                            sourcePosition:
                                Position.Right,

                            targetPosition:
                                Position.Left,


                            data: {
                                label:
                                    node.label,
                            },


                            style: {

                                ...getNodeStyle(
                                    node.type
                                ),


                                width:
                                    NODE_WIDTH,


                                height:
                                    NODE_HEIGHT,


                                minHeight:
                                    NODE_HEIGHT,


                                borderRadius:
                                    "12px",


                                padding:
                                    "10px 14px",


                                fontSize:
                                    "14px",


                                fontWeight:
                                    node.type ===
                                    "developer"
                                        ? 600
                                        : 500,


                                display:
                                    "flex",


                                alignItems:
                                    "center",


                                justifyContent:
                                    "center",


                                textAlign:
                                    "center",


                                boxSizing:
                                    "border-box",


                                /*
                                 * Highlight selected node
                                 * without hiding other nodes.
                                 */

                                boxShadow:
                                    isSelected
                                        ? "0 0 0 3px rgba(34, 211, 238, 0.35)"
                                        : "none",

                            },

                        };

                    }
                );


            return layoutGraph(

                rawNodes,

                graph.edges.map(
                    (edge) => ({

                        id: edge.id,

                        source:
                            edge.source,

                        target:
                            edge.target,

                    })
                )

            );

        }, [
            graph,
            selectedNode,
        ]);


    /* =====================================================
       CREATE REACT FLOW EDGES
    ====================================================== */

    const edges: Edge[] =
        useMemo(() => {

            if (!graph) {
                return [];
            }


            return graph.edges.map(
                (edge) => {

                    const isSelectedConnection =
                        selectedNode !== null &&
                        (
                            edge.source ===
                                selectedNode.id ||

                            edge.target ===
                                selectedNode.id
                        );


                    return {

                        id: edge.id,

                        source:
                            edge.source,

                        target:
                            edge.target,

                        label:
                            edge.label,

                        type:
                            "smoothstep",


                        animated:
                            isSelectedConnection,


                        style: {

                            strokeWidth:
                                isSelectedConnection
                                    ? 3
                                    : 1.5,

                            stroke:
                                isSelectedConnection
                                    ? "#22d3ee"
                                    : "#94a3b8",

                        },


                        labelStyle: {

                            fontSize: 9,

                            fontWeight: 500,

                            fill:
                                isSelectedConnection
                                    ? "#67e8f9"
                                    : "#cbd5e1",

                        },


                        labelBgStyle: {

                            fill:
                                "#020617",

                            fillOpacity:
                                0.9,

                        },


                        labelBgPadding:
                            [
                                4,
                                2,
                            ] as [
                                number,
                                number
                            ],


                        labelBgBorderRadius:
                            4,


                        markerEnd: {

                            type:
                                "arrowclosed",

                            color:
                                isSelectedConnection
                                    ? "#22d3ee"
                                    : "#94a3b8",

                        },

                    };

                }
            );

        }, [
            graph,
            selectedNode,
        ]);


    /* =====================================================
       NODE CLICK
    ====================================================== */

    const handleNodeClick = (
        _: MouseEvent,
        node: Node
    ) => {

        if (!graph) {
            return;
        }


        const originalNode =
            graph.nodes.find(
                (item) =>
                    item.id === node.id
            );


        if (originalNode) {

            setSelectedNode(
                originalNode
            );

        }

    };


    /* =====================================================
       CLICK EMPTY AREA
    ====================================================== */

    const handlePaneClick = () => {

        setSelectedNode(null);

    };


    /* =====================================================
       LOADING
    ====================================================== */

    if (loading) {

        return (

            <div className="flex h-[700px] items-center justify-center rounded-2xl border border-slate-800 bg-slate-900">

                <div className="text-center">

                    <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400" />

                    <p className="text-slate-400">
                        Loading career graph...
                    </p>

                </div>

            </div>

        );

    }


    /* =====================================================
       ERROR
    ====================================================== */

    if (error) {

        return (

            <div className="flex h-[700px] items-center justify-center rounded-2xl border border-red-900 bg-red-950/20">

                <div className="text-center">

                    <p className="text-red-400">
                        {error}
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                        Check the browser console
                        for graph data.
                    </p>

                </div>

            </div>

        );

    }


    /* =====================================================
       EMPTY GRAPH
    ====================================================== */

    if (
        !graph ||
        graph.nodes.length === 0
    ) {

        return (

            <div className="flex h-[700px] items-center justify-center rounded-2xl border border-slate-800 bg-slate-900">

                <div className="text-center">

                    <p className="text-lg font-semibold">
                        No graph data found
                    </p>

                    <p className="mt-2 text-sm text-slate-400">
                        This developer does not
                        have connected graph data.
                    </p>

                </div>

            </div>

        );

    }


    /* =====================================================
       MAIN GRAPH
    ====================================================== */

    return (

        <div className="relative h-[700px] w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">


            {/* =================================================
                LEGEND
            ================================================== */}

            <div className="pointer-events-none absolute left-4 top-4 z-10 rounded-xl border border-slate-800 bg-slate-950/90 p-4 backdrop-blur">

                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Graph Legend
                </p>


                <div className="space-y-2 text-xs">

                    <div className="flex items-center gap-2">

                        <span className="h-3 w-3 rounded-full bg-cyan-500" />

                        <span className="text-slate-300">
                            Developer
                        </span>

                    </div>


                    <div className="flex items-center gap-2">

                        <span className="h-3 w-3 rounded-full bg-slate-700" />

                        <span className="text-slate-300">
                            Skill
                        </span>

                    </div>


                    <div className="flex items-center gap-2">

                        <span className="h-3 w-3 rounded-full bg-indigo-700" />

                        <span className="text-slate-300">
                            Project
                        </span>

                    </div>


                    <div className="flex items-center gap-2">

                        <span className="h-3 w-3 rounded-full bg-blue-700" />

                        <span className="text-slate-300">
                            Technology
                        </span>

                    </div>

                </div>

            </div>


            {/* =================================================
                REACT FLOW
            ================================================== */}

            <ReactFlow

                nodes={nodes}

                edges={edges}

                fitView

                onNodeClick={
                    handleNodeClick
                }

                onPaneClick={
                    handlePaneClick
                }

                fitViewOptions={{

                    padding: 0.2,

                    maxZoom: 1.2,

                    minZoom: 0.4,

                }}

                nodesDraggable={true}

                nodesConnectable={false}

                elementsSelectable={true}

                panOnDrag={true}

                zoomOnScroll={true}

                zoomOnPinch={true}

            >

                <Background
                    gap={16}
                    size={1}
                    color="#1e293b"
                />

                <Controls />

            </ReactFlow>


            {/* =================================================
                SELECTED NODE PANEL
            ================================================== */}

            {selectedNode && (

                <div className="absolute right-4 top-4 z-20 w-80 rounded-2xl border border-slate-700 bg-slate-900/95 p-5 shadow-2xl backdrop-blur">


                    <div className="flex items-start justify-between">

                        <div>

                            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">

                                {selectedNode.type}

                            </p>


                            <h3 className="mt-1 text-xl font-bold text-white">

                                {selectedNode.label}

                            </h3>

                        </div>


                        <button

                            type="button"

                            onClick={() =>
                                setSelectedNode(
                                    null
                                )
                            }

                            className="rounded-lg px-2 py-1 text-lg text-slate-400 hover:bg-slate-800 hover:text-white"

                        >

                            ×

                        </button>

                    </div>


                    {/* Node ID */}

                    <div className="mt-5 border-t border-slate-800 pt-4">

                        <p className="text-xs uppercase tracking-wide text-slate-500">
                            Node ID
                        </p>


                        <p className="mt-1 break-all text-sm text-slate-300">

                            {selectedNode.id}

                        </p>

                    </div>


                    {/* Connections */}

                    <div className="mt-4">

                        <p className="text-xs uppercase tracking-wide text-slate-500">
                            Connections
                        </p>


                        <p className="mt-1 text-sm text-slate-300">

                            {
                                graph.edges.filter(
                                    (edge) =>
                                        edge.source ===
                                            selectedNode.id ||
                                        edge.target ===
                                            selectedNode.id
                                ).length
                            }{" "}

                            connected relationships

                        </p>

                    </div>


                    {/* Relationship Types */}

                    <div className="mt-5">

                        <p className="text-xs uppercase tracking-wide text-slate-500">

                            Relationship types

                        </p>


                        <div className="mt-2 space-y-2">

                            {Array.from(

                                new Set(

                                    graph.edges

                                        .filter(
                                            (edge) =>
                                                edge.source ===
                                                    selectedNode.id ||
                                                edge.target ===
                                                    selectedNode.id
                                        )

                                        .map(
                                            (edge) =>
                                                edge.label
                                        )

                                )

                            ).map(
                                (label) => (

                                    <div

                                        key={label}

                                        className="rounded-lg bg-slate-950 px-3 py-2 text-sm text-cyan-300"

                                    >

                                        {label}

                                    </div>

                                )
                            )}

                        </div>

                    </div>


                    {/* Connected Nodes */}

                    <div className="mt-5">

                        <p className="text-xs uppercase tracking-wide text-slate-500">

                            Connected nodes

                        </p>


                        <div className="mt-2 max-h-32 space-y-1 overflow-y-auto">

                            {graph.nodes

                                .filter(
                                    (node) =>
                                        node.id !==
                                            selectedNode.id &&
                                        graph.edges.some(
                                            (edge) =>
                                                (
                                                    edge.source ===
                                                        selectedNode.id &&
                                                    edge.target ===
                                                        node.id
                                                ) ||
                                                (
                                                    edge.target ===
                                                        selectedNode.id &&
                                                    edge.source ===
                                                        node.id
                                                )
                                        )
                                )

                                .map(
                                    (node) => (

                                        <button

                                            key={
                                                node.id
                                            }

                                            type="button"

                                            onClick={() =>
                                                setSelectedNode(
                                                    node
                                                )
                                            }

                                            className="block w-full rounded-lg bg-slate-950 px-3 py-2 text-left text-sm text-slate-300 transition hover:bg-slate-800 hover:text-cyan-300"

                                        >

                                            {node.label}

                                        </button>

                                    )
                                )}

                        </div>

                    </div>

                </div>

            )}

        </div>

    );
}