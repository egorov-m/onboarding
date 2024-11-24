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
import { EditIcon, TrashIcon } from "../../../../shared/ui/icons/index";

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

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<RowData | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  const handleRowClick = (row: RowData) => {
    if (projectToEdit?.id !== row.id) {
      navigate(
        `${process.env.ONBOARDING_WEB_APP_PATH_PREFIX}/constructor/${row.id}`,
        {
          state: { name: row.name, status: row.status },
        }
      );
    }
  };

  const handleEditClick = (row: RowData) => {
    setProjectToEdit(row);
    setIsEditModalVisible(true);
  };

  const handleDeleteClick = (projectId: string) => {
    setProjectToDelete(projectId);
    setIsDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (projectToDelete) {
      try {
        await deleteProject(projectToDelete);
        onUpdate(data.filter((project) => project.id !== projectToDelete));
      } catch (error) {
        console.error("Не удалось удалить проект", error);
      } finally {
        setIsDeleteModalVisible(false);
        setProjectToDelete(null);
      }
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
        setIsEditModalVisible(false);
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
              <td>
                {new Intl.DateTimeFormat("ru-RU", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(new Date(row.updated_at))}
              </td>
              <td>
                <StarRating rating={row.average_rating} />
              </td>
              <td>
                <styles.Status status={row.status}>{row.status}</styles.Status>
              </td>
              <td>
                <styles.IconContainer>
                  <EditIcon onClick={() => handleEditClick(row)} />
                  <TrashIcon onClick={() => handleDeleteClick(row.id)} />
                </styles.IconContainer>
              </td>
            </tr>
          ))}
        </tbody>
      </styles.StyledTable>

      <Modal
        title='Редактировать проект'
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onOk={handleModalOk}
        okText='Сохранить'
        cancelText='Отмена'
      >
        {projectToEdit && (
          <styles.FormWrapper>
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
          </styles.FormWrapper>
        )}
      </Modal>

      <Modal
        title='Подтверждение удаления'
        visible={isDeleteModalVisible}
        onCancel={() => setIsDeleteModalVisible(false)}
        onOk={handleConfirmDelete}
        okText='Удалить'
        cancelText='Отмена'
      >
        <p>Вы уверены, что хотите удалить этот проект?</p>
      </Modal>
    </div>
  );
};
