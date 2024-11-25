import React, { useEffect, useRef } from "react";

type CanvasBackgroundProps = {
  isDarkMode?: boolean;
};

export const CanvasBackground: React.FC<CanvasBackgroundProps> = ({
  isDarkMode = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      console.error("Canvas element not found!");
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Canvas context not found!");
      return;
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particlesArray: Particle[] = [];

    const lightTheme = {
      backgroundColor: "#FFFFFF",
      colors: ["#FFB6C1", "#FFD700", "#ADD8E6", "#90EE90"],
    };

    const darkTheme = {
      backgroundColor: "#1E1E1E",
      colors: ["#FF69B4", "#FFD700", "#4682B4", "#32CD32"],
    };

    const theme = isDarkMode ? darkTheme : lightTheme;
    const maxParticles = 150;

    class Particle {
      x: number;
      y: number;
      size: number;
      color: string;
      speedX: number;
      speedY: number;
      canvasWidth: number;
      canvasHeight: number;

      constructor(
        x: number,
        y: number,
        canvasWidth: number,
        canvasHeight: number
      ) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 6 + 1;
        this.color =
          theme.colors[Math.floor(Math.random() * theme.colors.length)];
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > this.canvasWidth) this.speedX = -this.speedX;
        if (this.y < 0 || this.y > this.canvasHeight)
          this.speedY = -this.speedY;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const initParticles = () => {
      particlesArray.length = 0;
      for (let i = 0; i < maxParticles; i++) {
        particlesArray.push(
          new Particle(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            canvas.width,
            canvas.height
          )
        );
      }
    };

    const animate = () => {
      ctx.fillStyle = theme.backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particlesArray.forEach((particle) => {
        particle.update();
        particle.draw(ctx);
      });

      requestAnimationFrame(animate);
    };

    initParticles();
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isDarkMode]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
      }}
    />
  );
};
