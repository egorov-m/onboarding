import {
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
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  OnConnect,
  Position,
} from "react-flow-renderer";

import { AxiosError } from "axios";

import * as styles from "./OnboardingCanvas.styles";
import { CustomNode } from "./CustomNode/CustomNode";
import axios from "axios";

import { v4 as uuidv4 } from "uuid";
import { Input, Modal } from "@shared/ui";

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

    const saveToLocalStorage = () => {
      localStorage.setItem(`nodes-${boardId}`, JSON.stringify(nodes));
      localStorage.setItem(`edges-${boardId}`, JSON.stringify(edges));
    };

    const uploadImage = async (file: File, boardStepId: string) => {
      const blobData = await createBlob(boardStepId);
      if (!blobData) {
        return null;
      }

      const { blobId, actionLink } = blobData;

      await uploadImageToPresignedUrl(actionLink, file);

      await linkBlobToStep(boardStepId, blobId);

      return blobId;
    };

    const uploadImageToPresignedUrl = async (
      actionLink: string,
      file: File
    ) => {
      try {
        await axios.put(actionLink, file, {
          headers: { "Content-Type": file.type },
        });
      } catch (error) {
        console.error(
          "uploadImageToPresignedUrl: Ошибка при загрузке изображения:",
          error
        );
      }
    };

    const getBlobPresignedUrl = async (boardStepId: string, blobId: string) => {
      try {
        const response = await axios.get(
          `${process.env.ONBOARDING_API_BASE_PATH}${process.env.ONBOARDING_API_PATH_PREFIX}/board_steps/${boardStepId}/blob/${blobId}`,
          {
            params: { is_include_link: true },
          }
        );
        return response.data.link;
      } catch (error) {
        const err = error as AxiosError;

        console.error(
          "Ошибка при получении предподписанной ссылки:",
          err.response?.data || error
        );
        return null;
      }
    };

    const linkBlobToStep = async (boardStepId: string, blobId: string) => {
      try {
        await axios.patch(
          `${process.env.ONBOARDING_API_BASE_PATH}${process.env.ONBOARDING_API_PATH_PREFIX}/board_steps/${boardStepId}/blob/${blobId}`
        );
      } catch (error) {
        console.error(
          "linkBlobToStep: Ошибка при привязке blob к шагу:",
          error
        );
      }
    };

    const getBlobList = async (boardStepId: string) => {
      try {
        const response = await axios.post(
          `${process.env.ONBOARDING_API_PATH_PREFIX}/board_steps/${boardStepId}/blob/list`,
          {}
        );
        return response.data.items || [];
      } catch (error) {
        const err = error as AxiosError;

        console.error(
          "Ошибка при получении списка blob'ов:",
          err.response?.data || error
        );
        throw error;
      }
    };

    const createBlob = async (
      boardStepId: string
    ): Promise<{ blobId: string; actionLink: string } | null> => {
      try {
        const response = await axios.post(
          `${process.env.ONBOARDING_API_BASE_PATH}${process.env.ONBOARDING_API_PATH_PREFIX}/board_steps/${boardStepId}/blob`,
          null,
          { params: { blob_type: "image" } }
        );

        const { blob_id, action_link } = response.data;

        if (!blob_id || !action_link) {
          console.error(
            "createBlob: blob_id или action_link отсутствуют в ответе."
          );
          return null;
        }

        return { blobId: blob_id, actionLink: action_link };
      } catch (error) {
        console.error("createBlob: Ошибка при создании blob:", error);
        return null;
      }
    };

    const updateBlob = async (
      boardStepId: string,
      blobId: string,
      file: File
    ): Promise<void> => {
      try {
        const response = await axios.patch(
          `${process.env.ONBOARDING_API_BASE_PATH}${process.env.ONBOARDING_API_PATH_PREFIX}/board_steps/${boardStepId}/blob/${blobId}`,
          null
        );
        const actionLink = response.data?.action_link;
        if (!actionLink) {
          console.error(
            "updateBlob: action_link отсутствует в ответе сервера."
          );
          console.error("Полный ответ от сервера:", response.data);
          throw new Error("action_link отсутствует в ответе сервера.");
        }
        await axios.put(actionLink, file, {
          headers: {
            "Content-Type": file.type,
          },
        });
      } catch (error) {
        console.error("updateBlob: Ошибка при обновлении Blob:", error);

        if (axios.isAxiosError(error)) {
          console.error(
            "updateBlob: Ошибка Axios:",
            error.response?.data || error.message
          );
        }

        throw error;
      }
    };

    const fetchSteps = async () => {
      try {
        const response = await axios.post(
          `${process.env.ONBOARDING_API_BASE_PATH}${process.env.ONBOARDING_API_PATH_PREFIX}/board_steps/list/${boardId}`,
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
      },
    }));

    const deleteStep = async (nodeId: string) => {
      try {
        await axios.delete(
          `${process.env.ONBOARDING_API_BASE_PATH}${process.env.ONBOARDING_API_PATH_PREFIX}/board_steps/${nodeId}`
        );

        setNodes((prevNodes) => prevNodes.filter((node) => node.id !== nodeId));
        setEdges((prevEdges) =>
          prevEdges.filter(
            (edge) => edge.source !== nodeId && edge.target !== nodeId
          )
        );
      } catch (error) {
        console.error("Ошибка при удалении этапа:", error);
      }
    };

    const addStep = async () => {
      try {
        const response = await axios.post(
          `${process.env.ONBOARDING_API_BASE_PATH}${process.env.ONBOARDING_API_PATH_PREFIX}/board_steps/`,
          {
            board_id: boardId,
            type: "basic",
            title: `${nodes.length} step`,
            text: "",
            index: nodes.length,
          }
        );

        const newNodeId = response.data.id || uuidv4();

        const newNode: Node = {
          id: newNodeId,
          data: { label: `${nodes.length} step` },
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
      (changes: NodeChange[]) => {
        setNodes((nds) => {
          const updatedNodes = applyNodeChanges(changes, nds);
          saveToLocalStorage();
          return updatedNodes;
        });
      },
      [nodes, boardId]
    );

    const onEdgesChange = useCallback(
      (changes: EdgeChange[]) => {
        setEdges((eds) => {
          const updatedEdges = applyEdgeChanges(changes, eds);
          saveToLocalStorage();
          return updatedEdges;
        });
      },
      [edges, boardId]
    );

    const onConnect: OnConnect = useCallback(
      (params: Connection) => {
        const { source, target } = params;

        if (source && target && parseInt(source) + 1 === parseInt(target)) {
          const newEdge: Edge = {
            id: `e${source}-${target}`,
            source,
            target,
            animated: true,
          };
          setEdges((eds) => {
            const updatedEdges = addEdge(newEdge, eds);
            saveToLocalStorage();
            return updatedEdges;
          });
        } else {
          console.warn(
            `Некорректное соединение: ${source} не может соединяться с ${target}`
          );
        }
      },
      [edges, boardId]
    );

    const openModal = async (nodeId: string) => {
      const currentNode = nodes.find((node) => node.id === nodeId);
      if (!currentNode) {
        console.error(`Узел с id ${nodeId} не найден.`);
        return;
      }

      setNodeText(currentNode.data.text || "");
      setCurrentNodeId(nodeId);
      setModalIsOpen(true);

      try {
        const blobs = await getBlobList(nodeId);
        if (!blobs || blobs.length === 0) {
          return;
        }

        const blobId = blobs[0].id;
        const imageUrl = await getBlobPresignedUrl(nodeId, blobId);
        setNodeImageUrl(imageUrl);

        setNodes((prevNodes) =>
          prevNodes.map((node) =>
            node.id === nodeId
              ? { ...node, data: { ...node.data, blob_id: blobId } }
              : node
          )
        );
      } catch (error) {
        console.error("Ошибка при загрузке изображения:", error);
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

          let blob_id =
            nodes.find((node) => node.id === currentNodeId)?.data.blob_id ||
            null;

          if (nodeImage) {
            if (blob_id) {
              await updateBlob(currentNodeId, blob_id, nodeImage);
            } else {
              blob_id = await uploadImage(nodeImage, currentNodeId);
            }
          }

          await axios.patch(
            `${process.env.ONBOARDING_API_BASE_PATH}${process.env.ONBOARDING_API_PATH_PREFIX}/board_steps/${currentNodeId}`,
            { title, text, blob_id }
          );

          setNodes(
            nodes.map((node) =>
              node.id === currentNodeId
                ? {
                    ...node,
                    data: {
                      ...node.data,
                      text: nodeText,
                      blob_id: blob_id || node.data.blob_id,
                    },
                  }
                : node
            )
          );

          closeModal();
        } catch (error) {
          const err = error as AxiosError;
          console.error(
            "handleSave: Ошибка при сохранении этапа:",
            err.response?.data || err
          );
        }
      }
    };

    return (
      <styles.CanvasContainer height={800}>
        <ReactFlow
          nodes={nodes.map((node, index) => ({
            ...node,
            data: {
              label: node.data.label,
              id: node.id,
              isLastNode: index === nodes.length - 1,
              isFirstNode: index === 0,
              onAddStep: addStep,
              onDelete: () => deleteStep(node.id),
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
          <Background color='#aaa' gap={16} />
        </ReactFlow>
        <Modal
          title={`Add data for the step ${nodes.findIndex(
            (node) => node.id === currentNodeId
          )}`}
          visible={modalIsOpen}
          onCancel={closeModal}
          onOk={handleSave}
          okText='Save'
          cancelText='Cancel'
        >
          <div>
            {nodeImageUrl ? (
              <img
                src={nodeImageUrl}
                alt='Preview'
                style={{ width: "100%", height: "auto", marginBottom: "10px" }}
              />
            ) : (
              <p>Add a photo</p>
            )}
            <input
              type='file'
              accept='image/*'
              onChange={(e) =>
                e.target.files && setNodeImage(e.target.files[0])
              }
            />
            <Input
              value={nodeText}
              onChange={(e) => setNodeText(e.target.value)}
              placeholder='Enter text'
            />
          </div>
        </Modal>
      </styles.CanvasContainer>
    );
  }
);
