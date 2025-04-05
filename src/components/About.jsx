import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { useRef } from 'react';
import AnimatedTitle from './AnimatedTitle';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
	const frameRef = useRef(null);
	const isFullscreen = useRef(false);

	useGSAP(() => {
		const clipAnimation = gsap.timeline({
			scrollTrigger: {
				trigger: '#clip',
				start: 'center center',
				end: '+=800 center',
				scrub: 0.5,
				pin: true,
				pinSpacing: true,
				onUpdate: (self) => {
					isFullscreen.current = self.progress > 0.9;

					// Reset rotation when fullscreen
					if (isFullscreen.current && frameRef.current) {
						gsap.to(frameRef.current, {
							rotateX: 0,
							rotateY: 0,
							duration: 0.3,
						});
					}
				},
			},
		});

		clipAnimation.to('.mask-clip-path', {
			width: '100vw',
			height: '100vh',
			borderRadius: 0,
		});

		// Handle mouse movement for tilt effect
		const handleMouseMove = (e) => {
			if (!frameRef.current || isFullscreen.current) return;

			const { left, top, width, height } =
				frameRef.current.getBoundingClientRect();
			const x = ((e.clientX - left) / width - 0.5) * 10;
			const y = ((e.clientY - top) / height - 0.5) * 10;

			gsap.to(frameRef.current, {
				rotateX: -y,
				rotateY: x,
				transformPerspective: 500,
				ease: 'power1.inOut',
				duration: 0.3,
			});
		};

		// Handle mouse leave to reset rotation
		const handleMouseLeave = () => {
			if (frameRef.current) {
				gsap.to(frameRef.current, {
					rotateX: 0,
					rotateY: 0,
					ease: 'power1.inOut',
					duration: 0.3,
				});
			}
		};

		const element = frameRef.current;
		if (element) {
			element.addEventListener('mousemove', handleMouseMove);
			element.addEventListener('mouseleave', handleMouseLeave);

			return () => {
				element.removeEventListener('mousemove', handleMouseMove);
				element.removeEventListener('mouseleave', handleMouseLeave);
			};
		}
	});

	return (
		<div id="about" className="min-h-screen w-screen">
			<div className="relative mb-9 mt-36 flex flex-col items-center gap-5">
				<p className="font-general text-sm uppercase md:text-[10px]">
					Welcome to Zentry
				</p>
				<AnimatedTitle
					title="Disc<b>o</b>ver the world's <br /> largest shared <b>a</b>dventure"
					containerClass="mt-5 !text-black text-center"
				/>
				<div className="about-subtext">
					<p>The Game of Games begin—your life, now an epic MMORPG</p>
					<p className="text-gray-500 text-sm">
						Zentry unites every player from countless games and platforms, both
						digital and physical, into a unified Play Economy
					</p>
				</div>
			</div>
			<div className="h-dvh w-screen" id="clip">
				<div className="mask-clip-path about-image" ref={frameRef}>
					<img
						src="img/about.webp"
						alt="Background"
						className="absolute left-0 top-0 size-full object-cover object-top"
					/>
				</div>
			</div>
		</div>
	);
};

export default About;
