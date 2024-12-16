import { useSpring, animated } from "@react-spring/web";
import * as styles from "./StepSlide.styles";

interface Step {
  board_step_id: string;
  title: string;
  description: string;
  image?: string;
}

export const StepSlide: React.FC<{ step: Step }> = ({ step }) => {
  const animationStyle = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 500 },
  });

  return (
    <styles.SlideContent>
      <animated.div style={animationStyle}>
        {step.image && <styles.SlideImage src={step.image} alt={step.title} />}
        <styles.SlideTitle>{step.title}</styles.SlideTitle>
        <styles.SlideDescription>{step.description}</styles.SlideDescription>
      </animated.div>
    </styles.SlideContent>
  );
};
