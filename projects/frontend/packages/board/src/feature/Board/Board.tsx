import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { StarRating } from "../StarRating/StarRating";

import * as styles from "./Board.styles";
import { fetchSchema, fetchStepData } from "./api/boardApi";

interface SchemaItem {
  board_step_id: string;
  type: string;
  is_passed_board_step: boolean;
  index: number;
}

interface Step {
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const schemaData = await fetchSchema({ boardId });
        console.log("Schema Data:", schemaData);

        if (schemaData && schemaData.items && schemaData.items.length > 0) {
          const stepPromises = schemaData.items.map(
            async (item: SchemaItem) => {
              const stepData = await fetchStepData({
                boardId,
                boardStepId: item.board_step_id,
              });
              if (stepData) {
                const image =
                  stepData.blobs && stepData.blobs.length > 0
                    ? stepData.blobs[0].link
                    : undefined;
                return {
                  title: stepData.title,
                  description: stepData.text,
                  image: image,
                };
              }
              return null;
            }
          );

          const stepsData = await Promise.all(stepPromises);
          setSteps(stepsData.filter((step) => step !== null) as Step[]);
        } else {
          setError("Шаги не найдены в схеме.");
        }
      } catch (error) {
        setError("Ошибка загрузки данных.");
        console.error("Ошибка при загрузке данных:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [boardId]);

  if (loading) {
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
            <StarRating maxStars={5} />
          </styles.SlideContent>
        </Slider>
      </styles.SliderWrapper>
    </styles.BoardContainer>
  );
};
