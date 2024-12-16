import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { StarRating } from "../StarRating/StarRating";

import * as styles from "./Board.styles";
import { fetchSchema, fetchStepData, syncRating } from "./api/boardApi";

interface SchemaItem {
  board_step_id: string;
  type: string;
  is_passed_board_step: boolean;
  index: number;
}

interface Step {
  board_step_id: string;
  title: string;
  description: string;
  image?: string;
}

interface BoardProps {
  boardId: string;
}

export const Board: React.FC<BoardProps> = ({ boardId }) => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [finalStepId, setFinalStepId] = useState<string | null>(null);

  const fetchStep = async (stepIndex: number) => {
    try {
      const schemaData = await fetchSchema({ boardId });

      if (!schemaData.items || stepIndex >= schemaData.items.length) {
        throw new Error("Этап не найден.");
      }

      const stepItem = schemaData.items[stepIndex];

      const stepData = await fetchStepData({
        boardId,
        boardStepId: stepItem.board_step_id,
      });

      const image =
        stepData.blobs && stepData.blobs.length > 0
          ? stepData.blobs[0].link
          : undefined;

      return {
        board_step_id: stepItem.board_step_id,
        title: stepData.title,
        description: stepData.text,
        image,
      };
    } catch (error) {
      console.error("Ошибка загрузки шага:", error);
      throw error;
    }
  };

  useEffect(() => {
    const initializeFirstStep = async () => {
      setLoading(true);
      try {
        const schemaData = await fetchSchema({ boardId });

        const initialStepPromises = schemaData.items.map(
          async (item: SchemaItem, index: number) => {
            if (index === 0) {
              // Загружаем только первый шаг сразу
              const stepData = await fetchStepData({
                boardId,
                boardStepId: item.board_step_id,
              });

              const image =
                stepData.blobs && stepData.blobs.length > 0
                  ? stepData.blobs[0].link
                  : undefined;

              return {
                board_step_id: item.board_step_id,
                title: stepData.title,
                description: stepData.text,
                image,
              };
            }

            // Остальные шаги добавляются как заглушки
            return {
              board_step_id: item.board_step_id,
              title: "",
              description: "",
              image: undefined,
            };
          }
        );

        const loadedSteps = await Promise.all(initialStepPromises);
        setSteps(loadedSteps);
        setFinalStepId(loadedSteps[loadedSteps.length - 1]?.board_step_id);
      } catch (error) {
        setError("Ошибка загрузки шагов.");
      } finally {
        setLoading(false);
      }
    };

    initializeFirstStep();
  }, [boardId]);

  const handleSlideChange = async (newIndex: number) => {
    setCurrentStepIndex(newIndex);

    // Если мы перешли на страницу рейтинга
    if (newIndex === steps.length) {
      console.log("Перешли на страницу рейтинга.");
      return;
    }

    // Если шаг уже загружен, ничего не делаем
    if (steps[newIndex]?.title) {
      console.log(
        `Данные для шага ${newIndex} уже загружены:`,
        steps[newIndex]
      );
      return;
    }

    // Загружаем шаг
    console.log(`Загрузка данных для шага ${newIndex}...`);
    setLoading(true);

    try {
      const newStep = await fetchStep(newIndex);

      setSteps((prevSteps) => {
        const updatedSteps = [...prevSteps];
        updatedSteps[newIndex] = newStep;
        return updatedSteps;
      });

      console.log(`Шаг ${newIndex} успешно загружен:`, newStep);
    } catch (error) {
      setError(`Ошибка загрузки шага ${newIndex}.`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && steps.length === 0) {
    return <p>Загрузка...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!steps || steps.length === 0) {
    return <p>Нет данных для отображения.</p>;
  }

  return (
    <styles.BoardContainer>
      <styles.SliderWrapper>
        <Slider
          infinite={false}
          swipe={false}
          prevArrow={<styles.PrevButton></styles.PrevButton>}
          nextArrow={<styles.NextButton></styles.NextButton>}
          afterChange={handleSlideChange}
        >
          {steps.map((step, index) => (
            <styles.SlideContent key={index}>
              {step.image && (
                <styles.SlideImage src={step.image} alt={step.title} />
              )}
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </styles.SlideContent>
          ))}
          <styles.SlideContent>
            <StarRating
              maxStars={5}
              onRatingSubmit={async (rating) => {
                try {
                  const stepId =
                    finalStepId || steps[currentStepIndex]?.board_step_id;
                  console.log("Передача рейтинга:", {
                    boardId,
                    boardStepId: stepId,
                    rating,
                    finalized: true,
                  });

                  await syncRating({
                    boardId,
                    boardStepId: stepId,
                    rating,
                    finalized: true,
                  });

                  console.log("Рейтинг успешно отправлен!");
                } catch (error) {
                  console.error("Ошибка при передаче рейтинга:", error);
                }
              }}
            />
          </styles.SlideContent>
        </Slider>
      </styles.SliderWrapper>
    </styles.BoardContainer>
  );
};
