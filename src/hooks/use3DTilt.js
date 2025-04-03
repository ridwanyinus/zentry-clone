import gsap from 'gsap';
import { useEffect, useRef } from 'react';

const use3DTilt = (multiplier = 10) => {
	const frameRef = useRef(null);
	const requestRef = useRef(null);

	const handleMouseMove = (e) => {
		if (!frameRef.current) return;

		const { clientX, clientY } = e;
		const element = frameRef.current;
		const rect = element.getBoundingClientRect();

		const xPos = clientX - rect.left;
		const yPos = clientY - rect.top;

		const centerX = rect.width / 2;
		const centerY = rect.height / 2;

		const rotateX = ((yPos - centerY) / centerY) * -multiplier;
		const rotateY = ((xPos - centerX) / centerX) * multiplier;

		requestRef.current = requestAnimationFrame(() => {
			gsap.to(element, {
				duration: 0.3,
				rotateX,
				rotateY,
				transformPerspective: 500,
				ease: 'power1.inOut',
			});
		});
	};

	const handleMouseLeave = () => {
		const element = frameRef.current;

		if (element) {
			gsap.to(element, {
				duration: 0.3,
				rotateX: 0,
				rotateY: 0,
				ease: 'power1.inOut',
			});
		}
	};

	useEffect(() => {
		const element = frameRef.current;

		if (element) {
			element.addEventListener('mousemove', handleMouseMove);
			element.addEventListener('mouseleave', handleMouseLeave);
		}

		return () => {
			if (element) {
				element.removeEventListener('mousemove', handleMouseMove);
				element.removeEventListener('mouseleave', handleMouseLeave);
			}
			if (requestRef.current) {
				cancelAnimationFrame(requestRef.current);
			}
		};
	}, []);

	return { frameRef, handleMouseMove, handleMouseLeave };
};

export default use3DTilt;
