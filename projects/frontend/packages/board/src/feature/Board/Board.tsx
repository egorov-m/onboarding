import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { StarRating } from "../StarRating/StarRating";

import * as styles from "./Board.styles";
import { fetchSchema, fetchStepData, syncRating } from "./api/boardApi";
import { StepSlide } from "../StepSlide/StepSlide";

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

  useEffect(() => {
    const initializeFirstStep = async () => {
      setLoading(true);
      try {
        const schemaData = await fetchSchema({ boardId });

        const initialStepPromises = schemaData.items.map(
          async (item: any, index: number) => {
            if (index === 0) {
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

    if (newIndex === steps.length) {
      return;
    }

    if (steps[newIndex]?.title) {
      return;
    }

    setLoading(true);
    try {
      const schemaData = await fetchSchema({ boardId });
      const stepItem = schemaData.items[newIndex];

      const stepData = await fetchStepData({
        boardId,
        boardStepId: stepItem.board_step_id,
      });

      const image =
        stepData.blobs && stepData.blobs.length > 0
          ? stepData.blobs[0].link
          : undefined;

      const newStep = {
        board_step_id: stepItem.board_step_id,
        title: stepData.title,
        description: stepData.text,
        image,
      };

      setSteps((prevSteps) => {
        const updatedSteps = [...prevSteps];
        updatedSteps[newIndex] = newStep;
        return updatedSteps;
      });
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
          {steps.map((step) => (
            <StepSlide key={step.board_step_id} step={step} />
          ))}
          <styles.SlideContent>
            <StarRating
              maxStars={5}
              onRatingSubmit={async (rating) => {
                try {
                  const stepId =
                    finalStepId || steps[currentStepIndex]?.board_step_id;
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
