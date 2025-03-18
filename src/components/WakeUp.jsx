import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const ZentryTextTilt = ({ children, className }) => {
  const textRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const textElement = textRef.current;
    const container = containerRef.current;

    // Add perspective to the container for 3D effect
    gsap.set(container, {
      perspective: 1000,
      overflow: 'hidden',
    });

    // Initial state - text tilted along Y axis for left-to-right reveal
    gsap.set(textElement, {
      opacity: 0,
      rotationY: -70, // Tilted on Y axis (left side forward)
      transformOrigin: 'left center', // Rotate from left side
      x: -30, // Slightly pushed to left
      scale: 0.95, // Slightly scaled down
      filter: 'blur(2px)', // Slight blur effect
    });

    // Create the scroll-triggered animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top 75%',
        end: 'top 25%',
        toggleActions: 'play reverse play reverse', // Plays on scroll down, reverses on scroll up
        scrub: 0.5, // Smooth scrubbing with slight delay
      },
    });

    // Animate the text to rise from left to right
    tl.to(textElement, {
      duration: 1,
      opacity: 1,
      rotationY: 0,
      x: 0,
      scale: 1,
      filter: 'blur(0px)',
      ease: 'power2.out',
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className={`text-container relative ${className || ''}`}>
      <div ref={textRef} className='text-element will-change-transform'>
        {children}
      </div>
    </div>
  );
};

export default ZentryTextTilt;
