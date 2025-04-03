import { useRef, useState } from 'react';
import { TiLocationArrow } from 'react-icons/ti';

const BentoTilt = ({ children, className = '' }) => {
	const [transformStyle, setTransformStyle] = useState('');
	const tiltRef = useRef(null);

	const handleMouseMove = (e) => {
		if (!tiltRef.current) return;

		const { top, left, height, width } =
			tiltRef.current.getBoundingClientRect();

		// Calculate relative cursor position
		const x = (e.clientX - left) / width;
		const y = (e.clientY - top) / height;

		// Clamp x and y to prevent extreme values
		const clampedX = Math.min(Math.max(x, 0.1), 0.9); // Clamp between 0.1 and 0.9
		const clampedY = Math.min(Math.max(y, 0.1), 0.9); // Clamp between 0.1 and 0.9

		// Calculate tilt degrees
		const xDeg = (clampedX - 0.5) * 5; // Adjust multiplier for sensitivity
		const yDeg = (clampedY - 0.5) * -5; // Adjust multiplier for sensitivity

		// Apply transform
		const newTransform = `perspective(700px) rotateX(${yDeg}deg) rotateY(${xDeg}deg) scale3d(.95, .95, .95)`;

		tiltRef.current.style.cursor = 'grab';
		setTransformStyle(newTransform);
	};

	const handleMouseLeave = () => {
		setTransformStyle('');
	};

	return (
		<div
			className={className}
			ref={tiltRef}
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
			style={{ transform: transformStyle }}
		>
			{children}
		</div>
	);
};

const BentoCard = ({ src, title, desc }) => {
	return (
		<div className="relative size-full">
			<video
				src={src}
				autoPlay
				loop
				muted
				className="absolute left-0 top-0 size-full object-cover object-center"
			/>
			<div className="relative z-10 flex size-full flex-col justify-center p-5 text-blue-50">
				<div>
					<h1 className="bento-title special-font">{title}</h1>
					{desc && <p className="mt-3 max-w-64 text-xs md:text-base">{desc}</p>}
				</div>
			</div>
		</div>
	);
};

const Features = () => {
	return (
		<section className="bg-black pb-52">
			<div className="container mx-auto px-3 md:px-10">
				<div className="px-5 py-32">
					<p className="font-circular-web text-lg text-blue-50">
						Into the Metagame Layer
					</p>
					<p className="max-w-md font-circular-web text-lg text-blue-50/50">
						Immerse yourself in a rich and ever-expanding universe where a
						vibrant array of products converge into an interconnected overlay
						experience on your world.
					</p>
				</div>

				<BentoTilt className="border-hsla relative mb-7 h-96 w-full overflow-hidden rounded-md md:h-[65vh]">
					<BentoCard
						src="videos/feature-1.mp4"
						title={
							<>
								{' '}
								radia<b>n</b>t
							</>
						}
						desc={
							'A cross-platform metagame app, turning your activities across web2 and web3 games into a rewarding adventure.'
						}
					/>
				</BentoTilt>

				<div className="grid h-[135vh] w-full grid-cols-2 grid-rows-3 gap-7">
					<BentoTilt className="bento-tilt_1 row-span-1 md:col-span-1 md:row-span-2">
						<BentoCard
							src={'videos/feature-2.mp4'}
							title={
								<>
									zig<b>m</b>a
								</>
							}
							desc={
								'An anime and gaming-inspired NFT collection - the TP primed for expansion'
							}
						/>
					</BentoTilt>

					<BentoTilt className="bento-tilt_1 row-span-1 ms-32 md:col-span-1 md:ms-0">
						<BentoCard
							src={'videos/feature-3.mp4'}
							title={
								<>
									n<b>e</b>xus
								</>
							}
							desc={
								'A gamified social hub, adding a new dimension of play to social interaction for web3 communities.'
							}
						/>
					</BentoTilt>

					<BentoTilt className="bento-tilt_1 me-14 md:col-span-1 md:me-0">
						<BentoCard
							src={'videos/feature-4.mp4'}
							title={
								<>
									az<b>u</b>l
								</>
							}
							desc={
								'A cross-world AI agent - elevating your gameplay to be more fun and productive.'
							}
						/>
					</BentoTilt>

					<BentoTilt className="bento-tilt_2">
						<div className="flex size-full flex-col justify-between bg-violet-300 p-5">
							<h1 className="bento-title special-font max-w-64 text-black">
								M<b>o</b>re co<b>m</b>ing s<b>o</b>on.
							</h1>
							<TiLocationArrow className="m-5 scale-[5] self-end" />
						</div>
					</BentoTilt>

					<BentoTilt className="bento-tilt_2 ">
						<video
							src="videos/feature-5.mp4"
							autoPlay
							loop
							muted
							className=" size-full object-cover object-center"
						/>
					</BentoTilt>
				</div>
			</div>
		</section>
	);
};

export default Features;
