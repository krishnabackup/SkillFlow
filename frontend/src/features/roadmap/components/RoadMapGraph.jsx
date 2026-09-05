// src/components/Roadmap/RoadmapGraph.jsx
import { useCallback, useEffect, useRef, useState } from 'react';
import{
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css'

import dagre from 'dagre';
import StagePanel from './StagePanel';
import { CustomNode } from './CustomNode';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 140;
const nodeHeight = 100;

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

const positions = [
  {
    x : 0 , y : 0
  },
  {
    x : 200, y : 150
  },
  {
    x : 400 ,y : 0
  },
  {
    x : 600, y : 150
  },
  {
    x : 800 , y : 0
  },
  {
    x : 1000, y : 150
  },
  {
    x :  1200 , y : 0
  },
  {
    x : 1400 , y : 150
  }
]
 const nodeTypes = { custom : CustomNode}
export default function RoadmapGraph({ roadmap, onSave }) {
  const initialNodes = (roadmap?.stages || []).map((s,index) => ({
    id: s._id,
    type: 'custom',
    data: { label: s.stage, stage: s },
    position: { x: positions[index].x, y: positions[index].y},
    style: { width: nodeWidth, height: nodeHeight,backgroundColor : 'rgb(239, 208, 51)'},
    className : "flex items-center justify-center font-bold  shadow-md rounded-md border-2 border-stone-400",
    sourcePosition: 'right',
    targetPosition: 'left',
  }));

  const initialEdges = (roadmap?.edges || []).map(e => ({ id: e.id, source: e.source, target: e.target ,animation : true, style : { stroke : '#facc15' , strokeWidth : 2 }, type : 'smoothstep'}));

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);
  const [onEditNode,setOnEditNode] = useState(false);
  const reactFlowWrapper = useRef(null);
  const rfInstance = useRef(null);

  
  useEffect(() => {
    const noPos = initialNodes.every(n => !n.position || (n.position.x === 0 && n.position.y === 0));
    if (initialNodes.length && noPos) {
      const layouted = getLayoutedElements(initialNodes, initialEdges, 'LR');
      setNodes(layouted.nodes);
      setEdges(layouted.edges);
    }
   
  }, []);

  
  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node.data.stage);
    setOnEditNode(true);
  }, []);

  
  const onNodeDragStop = useCallback((event, node) => {
    setNodes((nds) => nds.map(n => n.id === node.id ? { ...n, position: node.position } : n));
  }, [setNodes]);

  
  const onConnect = useCallback((params) => {
    const newEdge = addEdge(params, edges);
    setEdges(newEdge);
  }, [edges, setEdges]);

 
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
          nodeTypes={nodeTypes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onNodeDragStop={onNodeDragStop}
          onConnect={onConnect}
          fitView
          attributionPosition="bottom-left"
          onInit={(instance) => (rfInstance.current = instance)}
          className="bg-gradient-to-br from-gray-900 via-gray-950 to-black"
        >
          {onEditNode && <MiniMap   nodeColor={(n) => "#facc15"} maskColor="rgba(0, 0, 0, 0.6)" className="rounded-lg" /> }
          <Controls />
          <Background color='#444' gap={24} variant='dots' />
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
