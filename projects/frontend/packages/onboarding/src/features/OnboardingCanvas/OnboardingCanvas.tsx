import React, {
  useState,
  useCallback,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
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
import axios from "axios";

import { v4 as uuidv4 } from "uuid";

interface Step {
  id: string;
  title: string;
  text: string;
}

const nodeTypes = {
  customNode: CustomNode,
};

interface OnboardingCanvasProps {
  boardId: string;
}

export const OnboardingCanvas = forwardRef(
  ({ boardId }: OnboardingCanvasProps, ref) => {
    const [nodes, setNodes] = useState<Node[]>([
      {
        id: "0",
        data: { label: "Start" },
        position: { x: 100, y: 100 },
        type: "customNode",
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        draggable: false,
      },
    ]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
    const [nodeText, setNodeText] = useState<string>("");
    const [nodeImage, setNodeImage] = useState<File | null>(null);
    const [nodeImageUrl, setNodeImageUrl] = useState<string | null>(null);

    useEffect(() => {
      const savedNodes = localStorage.getItem(`nodes-${boardId}`);
      const savedEdges = localStorage.getItem(`edges-${boardId}`);

      if (savedNodes) setNodes(JSON.parse(savedNodes));
      if (savedEdges) setEdges(JSON.parse(savedEdges));
      else fetchSteps();
    }, [boardId]);

    const fetchSteps = async () => {
      try {
        const response = await axios.post(
          `https://cobra-fancy-officially.ngrok-free.app/api/onboarding/board_steps/list/${boardId}`,
          {}
        );
        const steps = response.data.items.map((step: Step) => ({
          id: step.id,
          data: { label: step.title, text: step.text },
          position: { x: 100, y: 100 },
          type: "customNode",
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
          draggable: true,
        }));
        setNodes((prevNodes) => [...prevNodes, ...steps]);
      } catch (error) {
        console.error("Error fetching steps:", error);
      }
    };

    useImperativeHandle(ref, () => ({
      saveCanvas: () => {
        localStorage.setItem(`nodes-${boardId}`, JSON.stringify(nodes));
        localStorage.setItem(`edges-${boardId}`, JSON.stringify(edges));
        console.log("Canvas saved locally");
      },
    }));

    const addStep = async () => {
      try {
        const response = await axios.post(
          "https://cobra-fancy-officially.ngrok-free.app/api/onboarding/board_steps/",
          {
            board_id: boardId,
            type: "basic",
            title: `${nodes.length} этап`,
            text: "",
            index: nodes.length,
          }
        );

        const newNodeId = response.data.id || uuidv4();

        const newNode: Node = {
          id: newNodeId,
          data: { label: `${nodes.length} этап` },
          position: { x: 100 + nodes.length * 30, y: 100 + nodes.length * 30 },
          type: "customNode",
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
          draggable: true,
        };

        setNodes((prevNodes) => [...prevNodes, newNode]);

        if (nodes.length > 0) {
          const previousNodeId = nodes[nodes.length - 1].id;
          setEdges((prevEdges) =>
            addEdge(
              {
                id: `e${previousNodeId}-${newNodeId}`,
                source: previousNodeId,
                target: newNodeId,
                animated: true,
              },
              prevEdges
            )
          );
        }
      } catch (error) {
        console.error("Error creating new step:", error);
      }
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
      const { source, target } = params;

      if (source && target && parseInt(source) + 1 === parseInt(target)) {
        const newEdge: Edge = {
          id: `e${source}-${target}`,
          source,
          target,
          animated: true,
        };
        setEdges((eds) => addEdge(newEdge, eds));
      } else {
        console.warn(
          `Некорректное соединение: ${source} не может соединяться с ${target}`
        );
      }
    }, []);

    const openModal = async (nodeId: string) => {
      const currentNode = nodes.find((node) => node.id === nodeId);
      if (currentNode) {
        setNodeText(currentNode.data.text || "");
        setCurrentNodeId(nodeId);
        setModalIsOpen(true);

        try {
          const response = await axios.post(
            `https://cobra-fancy-officially.ngrok-free.app/api/onboarding/board_steps/${nodeId}/blob`,
            {},
            { responseType: "blob" }
          );
          const imageBlob = response.data;
          const imageUrl = URL.createObjectURL(imageBlob);
          setNodeImageUrl(imageUrl);

          const actionLink = currentNode.data.action_link;

          const formData = new FormData();
          formData.append("file", imageBlob, "image.png");

          await axios.put(actionLink, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          console.log("Изображение успешно загружено!");
        } catch (error) {
          console.error("Ошибка при загрузке изображения:", error);
        }
      }
    };

    const closeModal = () => {
      setModalIsOpen(false);
      setCurrentNodeId(null);
      setNodeText("");

      if (nodeImageUrl) {
        URL.revokeObjectURL(nodeImageUrl);
        setNodeImageUrl(null);
      }
      setNodeImage(null);
    };

    const handleSave = async () => {
      if (currentNodeId) {
        try {
          const title =
            nodes.find((node) => node.id === currentNodeId)?.data.label || "";
          const text = nodeText || "";

          if (!title.trim() || !text.trim()) {
            console.error("Title or text is missing or empty.");
            return;
          }

          await axios.patch(
            `https://cobra-fancy-officially.ngrok-free.app/api/onboarding/board_steps/${currentNodeId}`,
            { title, text },
            { params: { is_include_blobs: true } }
          );

          if (nodeImage) {
            const formData = new FormData();
            formData.append("file", nodeImage);

            await axios.post(
              `https://cobra-fancy-officially.ngrok-free.app/api/onboarding/board_steps/${currentNodeId}/blob`,
              formData,
              { params: { blob_type: "image" } }
            );
          }

          setNodes(
            nodes.map((node) =>
              node.id === currentNodeId
                ? {
                    ...node,
                    data: { ...node.data, text: nodeText, image: nodeImageUrl },
                  }
                : node
            )
          );
          closeModal();
        } catch (error) {
          if (axios.isAxiosError(error) && error.response) {
            console.error("Error details:", error.response.data);
          } else {
            console.error("Error updating step:", error);
          }
        }
      }
    };

    return (
      <styles.CanvasContainer height={800}>
        <ReactFlow
          nodes={nodes.map((node) => ({
            ...node,
            data: {
              label: node.data.label,
              id: node.id,
              onAddStep: addStep,
              onClick: () => openModal(node.id),
            },
          }))}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
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
              onChange={(e) =>
                e.target.files && setNodeImage(e.target.files[0])
              }
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
  }
);
