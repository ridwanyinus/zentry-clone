import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import use3DTilt from '../hooks/use3DTilt';
import AnimatedTitle from './AnimatedTitle';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
	const { frameRef, handleMouseMove, handleMouseLeave } = use3DTilt(1);
	useGSAP(() => {
		const clipAnimation = gsap.timeline({
			scrollTrigger: {
				trigger: '#clip',
				start: 'center center',
				end: '+=800 center',
				scrub: 0.5,
				pin: true,
				pinSpacing: true,
			},
		});

		clipAnimation.to('.mask-clip-path', {
			width: '100vw',
			height: '100vh',
			borderRadius: 0,
		});
	});
	// FIXME: The image keeping distorted shape on scroll
	return (
		<div
			id="about"
			className="min-h-screen w-screen"
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
		>
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
