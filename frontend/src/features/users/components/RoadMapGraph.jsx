// src/components/Roadmap/RoadmapGraph.jsx
import { useCallback, useEffect, useRef, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  useNodesState,
  useEdgesState,
} from 'react-flow-renderer';
import dagre from 'dagre';
import StagePanel from './StagePanel';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 220;
const nodeHeight = 120;

function getLayoutedElements(nodes, edges, direction = 'LR') {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  const gnodes = nodes.map((n) => ({ ...n }));
  gnodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = gnodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };
    return node;
  });

  return { nodes: layoutedNodes, edges };
}

export default function RoadmapGraph({ roadmap, onSave }) {
  // roadmap: {stages:[], edges:[], title,...}
  const initialNodes = (roadmap?.stages || []).map(s => ({
    id: s._id,
    data: { label: s.stage, stage: s },
    position: s.position || { x: Math.random()*250, y: Math.random()*250 },
    style: { width: nodeWidth, height: nodeHeight },
    sourcePosition: 'right',
    targetPosition: 'left',
  }));

  const initialEdges = (roadmap?.edges || []).map(e => ({ id: e.id, source: e.source, target: e.target }));

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);
  const reactFlowWrapper = useRef(null);
  const rfInstance = useRef(null);

  // layout once on mount if no positions provided
  useEffect(() => {
    const noPos = initialNodes.every(n => !n.position || (n.position.x === 0 && n.position.y === 0));
    if (initialNodes.length && noPos) {
      const layouted = getLayoutedElements(initialNodes, initialEdges, 'LR');
      setNodes(layouted.nodes);
      setEdges(layouted.edges);
    }
    // eslint-disable-next-line
  }, []);

  // node select
  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node.data.stage);
  }, []);

  // handle drag stop -> persist new positions locally
  const onNodeDragStop = useCallback((event, node) => {
    setNodes((nds) => nds.map(n => n.id === node.id ? { ...n, position: node.position } : n));
  }, [setNodes]);

  // connect handler => add edge
  const onConnect = useCallback((params) => {
    const newEdge = addEdge(params, edges);
    setEdges(newEdge);
  }, [edges, setEdges]);

  // add stage helper
  const addStage = useCallback((stage) => {
    const id = stage._id;
    const newNode = {
      id,
      data: { label: stage.stage, stage },
      position: { x: Math.random()*300, y: Math.random()*300 },
      style: { width: nodeWidth, height: nodeHeight }
    };
    setNodes(nds => [...nds, newNode]);
  }, [setNodes]);

  // delete node
  const deleteNode = useCallback((nodeId) => {
    setNodes(nds => nds.filter(n => n.id !== nodeId));
    setEdges(eds => eds.filter(e => e.source !== nodeId && e.target !== nodeId));
    if (selectedNode && selectedNode._id === nodeId) setSelectedNode(null);
  }, [setNodes, setEdges, selectedNode]);

  // Save action: prepare payload and call onSave
  const handleSave = useCallback(() => {
    // collect positions + edges
    const payload = {
      ...roadmap,
      stages: nodes.map(n => ({ ...n.data.stage, position: n.position })),
      edges: edges.map(e => ({ id: e.id, source: e.source, target: e.target })),
    };
    onSave(payload);
  }, [nodes, edges, roadmap, onSave]);

  return (
    <div className="flex h-[80vh] gap-4">
      <div className="flex-1" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onNodeDragStop={onNodeDragStop}
          onConnect={onConnect}
          fitView
          attributionPosition="bottom-left"
          onInit={(instance) => (rfInstance.current = instance)}
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>

        <div className="absolute bottom-6 left-6 z-20 space-x-2">
          <button onClick={() => { /* call layout */ const layouted = getLayoutedElements(nodes, edges, 'LR'); setNodes(layouted.nodes); setEdges(layouted.edges); }} className="px-3 py-2 bg-indigo-600 rounded text-white">Auto Layout</button>
          <button onClick={handleSave} className="px-3 py-2 bg-emerald-500 rounded text-white">Save</button>
        </div>
      </div>

      <div style={{ width: 360 }} className="bg-[#0b0b0b] p-4 rounded">
        <StagePanel 
          stage={selectedNode} 
          onUpdate={(updated) => {
            // update node data
            setNodes(nds => nds.map(n => n.id === updated._id ? { ...n, data: { ...n.data, stage: updated, label: updated.stage } } : n));
          }}
          onAddStage={addStage}
          onDeleteStage={deleteNode}
        />
      </div>
    </div>
  );
}
