import { useRef } from "react";
import gsap from "gsap";

const use3DHoverEffect = () => {
  const ref = useRef(null);

  const handleMouseMove = () => {
    if (!ref.current) return;

    gsap.to(ref.current, {
      transform:
        "translate3d(5.53682px, -2.46881px, 0px) rotateX(0rad) rotateY(0rad) rotateZ(0rad) scale(1.17584)",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;

    gsap.to(ref.current, {
      transform: "none", // Removes the applied transform
      duration: 0.5,
      ease: "power2.out",
    });
  };

  return { ref, handleMouseMove, handleMouseLeave };
};

export default use3DHoverEffect;
