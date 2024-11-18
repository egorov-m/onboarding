import React, { FC, useState } from "react";
import * as styles from "./TableProjects.styles";
import { StarRating } from "../StarRating/StarRating";
import { useNavigate } from "react-router";
import { Button } from "../../../../shared/ui/components/Button/Button";
import { Modal } from "../../../../shared/ui/components/Modal/Modal";
import { Input } from "../../../../shared/ui/components/Input/Input";
import { StatusButton } from "../StatusButton/StatusButton";
import {
  deleteProject,
  updateProject,
} from "../../pages/ProjectsPage/api/projectsApi";

interface RowData {
  id: string;
  name: string;
  updated_at: string;
  status: "published" | "unpublished";
  average_rating: number;
}

interface TableProjectsProps {
  data: RowData[];
  onUpdate: (updatedProjects: RowData[]) => void;
}

export const TableProjects: FC<TableProjectsProps> = ({ data, onUpdate }) => {
  const navigate = useNavigate();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<RowData | null>(null);

  const handleRowClick = (row: RowData) => {
    if (projectToEdit?.id !== row.id) {
      navigate(
        `${process.env.REACT_APP_SERVER_PATH_PREFIX}/constructor/${row.id}`,
        {
          state: { name: row.name, status: row.status },
        }
      );
    }
  };

  const handleEditClick = (row: RowData) => {
    setProjectToEdit(row);
    setIsModalVisible(true);
  };

  const handleDeleteClick = async (projectId: string) => {
    try {
      await deleteProject(projectId);
      onUpdate(data.filter((project) => project.id !== projectId));
    } catch (error) {
      console.error("Не удалось удалить проект", error);
    }
  };

  const handleModalOk = async () => {
    if (projectToEdit) {
      try {
        await updateProject(projectToEdit.id, projectToEdit);
        onUpdate(
          data.map((project) =>
            project.id === projectToEdit.id ? projectToEdit : project
          )
        );
        setIsModalVisible(false);
      } catch (error) {
        console.error("Не удалось обновить проект", error);
      }
    }
  };

  const handleStatusToggle = () => {
    if (projectToEdit) {
      const newStatus =
        projectToEdit.status === "published" ? "unpublished" : "published";
      setProjectToEdit({
        ...projectToEdit,
        status: newStatus,
      });
    }
  };

  return (
    <div>
      <styles.StyledTable>
        <thead>
          <tr>
            <th>Name</th>
            <th>Last Edited</th>
            <th>Rating</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <styles.NameColumn onClick={() => handleRowClick(row)}>
                {row.name}
              </styles.NameColumn>
              <td>{row.updated_at}</td>
              <td>
                <StarRating rating={row.average_rating} />
              </td>
              <td>
                <styles.Status status={row.status}>{row.status}</styles.Status>
              </td>
              <td>
                <Button type='primary' onClick={() => handleEditClick(row)}>
                  Редактировать
                </Button>
                <Button type='danger' onClick={() => handleDeleteClick(row.id)}>
                  Удалить
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </styles.StyledTable>

      <Modal
        title='Редактировать проект'
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleModalOk}
        okText='Сохранить'
        cancelText='Отмена'
      >
        {projectToEdit && (
          <>
            <Input
              value={projectToEdit.name}
              onChange={(e) =>
                setProjectToEdit({ ...projectToEdit, name: e.target.value })
              }
              placeholder='Введите название проекта'
            />
            <StatusButton
              status={projectToEdit.status}
              onToggle={handleStatusToggle}
            />
          </>
        )}
      </Modal>
    </div>
  );
};
