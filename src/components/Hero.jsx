import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { TiLocationArrow } from 'react-icons/ti';
import { useAudio } from '../contexts/AudioContext';
import useUISound from '../hooks/useUISound';
import Button from './Button';
import Loader from './Loader';
import VideoPreview from './VideoPreview';
import '../styles/loader.css';

// Register GSAP plugins once
gsap.registerPlugin(ScrollTrigger);

// Constants
const TOTAL_VIDEOS = 4;
const VIDEO_STATES = {
	ACTIVE: { opacity: 1, zIndex: 20 },
	INACTIVE: { opacity: 0, zIndex: 10 },
	TRANSITIONING: { opacity: 1, zIndex: 30 },
};

const Hero = () => {
	const { setAudio } = useAudio();
	const playWhooshSound = useUISound('/audio/whoosh.mp3');

	const [currentIndex, setCurrentIndex] = useState(1);
	const [activeVideoId, setActiveVideoId] = useState('video-a');
	const [isLoading, setIsLoading] = useState(true);
	const [loadedVideos, setLoadedVideos] = useState(0);
	const [previewVisible, setPreviewVisible] = useState(true);

	const videoARef = useRef(null);
	const videoBRef = useRef(null);
	const previewVideoRef = useRef(null);
	const previewPositionRef = useRef({ top: 0, left: 0, width: 0, height: 0 });

	const upComingVideoIndex = (currentIndex % TOTAL_VIDEOS) + 1;
	const getVideoSrc = useCallback((index) => `videos/hero-${index}.mp4`, []);

	// Helper functions
	const getInactiveVideoRef = useCallback(
		() => (activeVideoId === 'video-a' ? videoBRef : videoARef),
		[activeVideoId],
	);

	const getActiveVideoId = useCallback(() => activeVideoId, [activeVideoId]);

	const getInactiveVideoId = useCallback(
		() => (activeVideoId === 'video-a' ? 'video-b' : 'video-a'),
		[activeVideoId],
	);

	const handleVideoLoaded = useCallback(() => {
		setLoadedVideos((prev) => prev + 1);
	}, []);

	useEffect(() => {
		if (loadedVideos >= TOTAL_VIDEOS - 1) {
			setIsLoading(false);
		}

		const timeout = setTimeout(() => setIsLoading(false), 2000);
		return () => clearTimeout(timeout);
	}, [loadedVideos]);

	// Store preview element position for animations
	useEffect(() => {
		const updatePreviewPosition = () => {
			const previewElement = document.querySelector('.preview-video');
			if (previewElement) {
				const rect = previewElement.getBoundingClientRect();
				previewPositionRef.current = {
					top: rect.top,
					left: rect.left,
					width: rect.width,
					height: rect.height,
				};
			}
		};

		updatePreviewPosition();
		window.addEventListener('resize', updatePreviewPosition);
		return () => window.removeEventListener('resize', updatePreviewPosition);
	}, []);

	// Initial setup - set video sources
	useEffect(() => {
		if (!videoARef.current || !videoBRef.current) return;

		videoARef.current.src = getVideoSrc(currentIndex);
		videoBRef.current.src = getVideoSrc(upComingVideoIndex);

		// Ensure initial active video is playing and visible
		videoARef.current.play().catch((e) => console.warn('Autoplay failed:', e));
		gsap.set(`#${getActiveVideoId()}`, VIDEO_STATES.ACTIVE);
		gsap.set(`#${getInactiveVideoId()}`, VIDEO_STATES.INACTIVE);
	}, []);

	// Update preview video when current index changes
	useEffect(() => {
		if (previewVideoRef.current) {
			previewVideoRef.current.src = getVideoSrc(upComingVideoIndex);
		}

		// Make sure inactive video is ready with the next content
		const inactiveVideoRef = getInactiveVideoRef();
		if (inactiveVideoRef.current) {
			inactiveVideoRef.current.src = getVideoSrc(upComingVideoIndex);
			inactiveVideoRef.current.load();
		}

		// Ensure proper z-index and opacity
		gsap.set(`#${getActiveVideoId()}`, VIDEO_STATES.ACTIVE);
		gsap.set(`#${getInactiveVideoId()}`, VIDEO_STATES.INACTIVE);
	}, [
		currentIndex,
		activeVideoId,
		getActiveVideoId,
		getInactiveVideoId,
		getInactiveVideoRef,
		getVideoSrc,
		upComingVideoIndex,
	]);

	// Handle mini video click - transition animation
	const handleMiniVDClick = useCallback(() => {
		setAudio(true);
		playWhooshSound();
		setPreviewVisible(false);

		const inactiveVideoRef = getInactiveVideoRef();
		const inactiveVideoId = getInactiveVideoId();

		// Position calculations
		const pos = previewPositionRef.current;
		const windowWidth = window.innerWidth;
		const windowHeight = window.innerHeight;

		// Prepare next video
		if (inactiveVideoRef.current) {
			inactiveVideoRef.current.src = getVideoSrc(upComingVideoIndex);
			inactiveVideoRef.current.load();
			inactiveVideoRef.current
				.play()
				.catch((e) => console.warn('Autoplay failed:', e));
		}

		// Initial position and size to match preview
		gsap.set(`#${inactiveVideoId}`, {
			top: pos.top,
			left: pos.left,
			width: pos.width,
			height: pos.height,
			opacity: 1,
			scale: 1,
			xPercent: 0,
			yPercent: 0,
			zIndex: 30,
		});

		// Animation timeline
		const tl = gsap.timeline({
			onComplete: () => {
				// Switch active video
				setActiveVideoId(inactiveVideoId);
				setCurrentIndex(upComingVideoIndex);
				setPreviewVisible(true);
			},
		});

		// Animate to full screen
		tl.to(`#${inactiveVideoId}`, {
			top: 0,
			left: 0,
			width: windowWidth,
			height: windowHeight,
			borderRadius: 0,
			duration: 1.2,
			ease: 'power2.inOut',
		});

		// Fade out current video
		tl.to(
			`#${getActiveVideoId()}`,
			{
				opacity: 0,
				duration: 0.8,
				ease: 'power2.inOut',
			},
			'-=0.8',
		); // Overlap with previous animation
	}, [
		getActiveVideoId,
		getInactiveVideoId,
		getInactiveVideoRef,
		getVideoSrc,
		playWhooshSound,
		setAudio,
		upComingVideoIndex,
	]);

	// GSAP animations for clip-path effect
	useGSAP(() => {
		gsap.set('#video-frame', {
			clipPath: 'polygon(14% 0, 72% 0, 88% 90%, 0 95%)',
			borderRadius: '0% 0% 40% 10%',
		});

		gsap.from('#video-frame', {
			clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
			borderRadius: '0% 0% 0% 0%',
			ease: 'power1.inOut',
			scrollTrigger: {
				trigger: '#video-frame',
				start: 'center center',
				end: 'bottom center',
				scrub: true,
			},
		});
	});

	return (
		<div className="relative h-dvh w-screen overflow-x-hidden">
			<Loader isLoading={isLoading} />

			<div
				id="video-frame"
				className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-blue-75"
			>
				<div className="relative h-full w-full bg-black">
					{/* Main videos */}
					<video
						playsInline
						ref={videoARef}
						autoPlay
						loop
						muted
						id="video-a"
						className="absolute left-0 top-0 size-full object-cover object-center"
						onLoadedData={handleVideoLoaded}
					/>
					<video
						playsInline
						ref={videoBRef}
						autoPlay
						loop
						muted
						id="video-b"
						className="absolute left-0 top-0 size-full object-cover object-center"
						onLoadedData={handleVideoLoaded}
					/>

					{/* Preview video */}
					{previewVisible && (
						<div className="mask-clip-path absolute-center absolute z-50 size-40 overflow-hidden rounded-lg">
							<VideoPreview>
								<div
									onClick={handleMiniVDClick}
									onKeyUp={(e) => {
										if (e.key === 'Enter' || e.key === ' ') {
											handleMiniVDClick();
										}
									}}
									className="preview-video origin-center scale-50 opacity-0 transition-all duration-500 ease-in hover:scale-100 hover:opacity-100 cursor-pointer rounded-lg"
								>
									<video
										playsInline
										ref={previewVideoRef}
										src={getVideoSrc(upComingVideoIndex)}
										loop
										muted
										preload="auto"
										className="size-36 origin-center scale-150 object-cover object-center cursor-pointer"
										onLoadedData={handleVideoLoaded}
									/>
								</div>
							</VideoPreview>
						</div>
					)}
				</div>

				{/* Text Overlays */}
				<h1 className="special-font hero-heading absolute bottom-5 right-5 z-40 text-blue-75">
					G<b>A</b>MING
				</h1>

				<div className="absolute left-0 top-0 z-40 size-full">
					<div className="mt-24 px-5 sm:px-10">
						<h1 className="special-font hero-heading text-blue-100">
							redefi<b>n</b>e
						</h1>

						<p className="mb-5 max-w-64 font-robert-regular text-blue-100">
							Enter the Metagame Layer <br /> Unleash the Player Economy
						</p>

						<Button
							id="watch-trailer"
							title="Watch trailer"
							leftIcon={<TiLocationArrow />}
							containerClass="!bg-yellow-300 flex-center gap-1"
						/>
					</div>
				</div>
			</div>

			<h1 className="special-font hero-heading absolute bottom-5 right-5 text-black">
				G<b>A</b>MING
			</h1>
		</div>
	);
};

export default memo(Hero);
