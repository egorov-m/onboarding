import { FC, useState } from "react";
import { useNavigate } from "react-router";

import { StarRating } from "../StarRating/StarRating";
import { DateTime } from "luxon";
import { Input, Modal } from "@shared/ui";
import { StatusButton } from "../StatusButton/StatusButton";
import {
  deleteProject,
  updateProject,
} from "../../pages/ProjectsPage/api/projectsApi";
import { EditIcon, TrashIcon } from "shared/ui/icons";
import { toast } from "react-toastify";
import * as styles from "./TableProjects.styles";

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

  const handleCopyLink = (row: RowData) => {
    if (row.status === "published") {
      const link = `${process.env.ONBOARDING_API_BASE_PATH}/app/board/${row.id}`;
      navigator.clipboard.writeText(link).then(() => {
        toast.success("Ссылка успешно скопирована!", { autoClose: 2000 });
      });
    } else {
      toast.warning("Проект еще не опубликован. Ссылка недоступна.", {
        autoClose: 2000,
      });
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
                {DateTime.fromISO(row.updated_at, { zone: "utc" })
                  .setZone("Asia/Yekaterinburg")
                  .toLocaleString(DateTime.DATETIME_MED)}{" "}
              </td>
              <td>
                <StarRating rating={row.average_rating} />
              </td>
              <td>
                <styles.Status
                  status={row.status}
                  onClick={() => handleCopyLink(row)}
                  style={{
                    cursor: row.status === "published" ? "pointer" : "default",
                  }}
                >
                  {row.status}
                </styles.Status>
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
