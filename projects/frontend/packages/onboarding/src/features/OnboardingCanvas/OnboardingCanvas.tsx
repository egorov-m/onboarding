import React, { useState, useCallback } from "react";
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  MiniMap,
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  OnConnect,
  Position,
} from "react-flow-renderer";

import * as styles from "./OnboardingCanvas.styles";
import { CustomNode } from "./CustomNode/CustomNode";

import { Modal } from "./Modal/Modal";

const initialNodes: Node[] = [
  {
    id: "1",
    data: { label: "1 этап" },
    position: { x: 100, y: 100 },
    type: "customNode",
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    draggable: true,
  },
];

const nodeTypes = {
  customNode: CustomNode,
};

export const OnboardingCanvas = () => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [nodeText, setNodeText] = useState<string>("");
  const [nodeImage, setNodeImage] = useState<File | null>(null);

  const addStep = (sourceId: string) => {
    const currentStepIndex = parseInt(sourceId) - 1;
    const nextStepId = (currentStepIndex + 2).toString();

    if (nodes.some((node) => node.id === nextStepId)) {
      console.warn(`Этап ${nextStepId} уже существует`);
      return;
    }

    const newNode: Node = {
      id: nextStepId,
      data: { label: `${nextStepId} этап` },
      position: { x: 100 + nodes.length * 30, y: 100 + nodes.length * 30 },
      type: "customNode",
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      draggable: true,
    };

    setNodes((nds) => [...nds, newNode]);

    const newEdge: Edge = {
      id: `e${sourceId}-${nextStepId}`,
      source: sourceId,
      target: nextStepId,
      animated: true,
    };
    setEdges((eds) => addEdge(newEdge, eds));
  };

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect: OnConnect = useCallback((params: Connection) => {
    const source = params.source;
    const target = params.target;

    if (source && target) {
      if (parseInt(source) + 1 === parseInt(target)) {
        const newEdge: Edge = {
          id: `e${source}-${target}`,
          source,
          target,
          animated: true,
        };
        console.log(
          `Создание соединения: ${newEdge.id} от ${source} к ${target}`
        );
        setEdges((eds) => addEdge(newEdge, eds));
      } else {
        console.warn(
          `Некорректное соединение: ${source} не может соединяться с ${target}`
        );
      }
    } else {
      console.warn(
        `Не удалось создать соединение: source=${source}, target=${target}`
      );
    }
  }, []);

  const openModal = (nodeId: string) => {
    const currentNode = nodes.find((node) => node.id === nodeId);
    if (currentNode) {
      setNodeText(currentNode.data.text || "");
      setNodeImage(currentNode.data.image || null);
      setCurrentNodeId(nodeId);
      setModalIsOpen(true);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setCurrentNodeId(null);
    setNodeText("");
    setNodeImage(null);
  };

  const handleSave = () => {
    if (currentNodeId) {
      const updatedNodes = nodes.map((node) =>
        node.id === currentNodeId
          ? {
              ...node,
              data: { ...node.data, text: nodeText, image: nodeImage },
            }
          : node
      );
      setNodes(updatedNodes);
      closeModal();
    }
  };

  return (
    <styles.CanvasContainer height={800}>
      <ReactFlow
        nodes={nodes.map((node) => ({
          ...node,
          data: {
            label: node.data.label,
            onAddStep: () => addStep(node.id),
            onClick: () => openModal(node.id),
          },
        }))}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true, account: "" }}
      >
        <MiniMap />
        <Controls />
        <Background color='#aaa' gap={16} />
      </ReactFlow>
      <Modal isOpen={modalIsOpen} onClose={closeModal}>
        <h2>Добавить данные для этапа {currentNodeId}</h2>
        <div>
          {nodeImage ? (
            <img
              src={URL.createObjectURL(nodeImage)}
              alt='Предосмотр'
              style={{ width: "100%", height: "auto", marginBottom: "10px" }}
            />
          ) : (
            <p>Добавьте фотографию</p>
          )}
          <input
            type='file'
            accept='image/*'
            onChange={(e) => e.target.files && setNodeImage(e.target.files[0])}
          />
          <textarea
            value={nodeText}
            onChange={(e) => setNodeText(e.target.value)}
            placeholder='Введите текст...'
            style={{ width: "100%", marginTop: "10px" }}
          />
          <button onClick={handleSave} style={{ marginTop: "10px" }}>
            Сохранить
          </button>
        </div>
      </Modal>
    </styles.CanvasContainer>
  );
};
