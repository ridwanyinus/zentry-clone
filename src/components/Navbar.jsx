import gsap from 'gsap';
import { useCallback, useEffect, useRef, useState } from 'react';
import { TiLocationArrow } from 'react-icons/ti';
import { useWindowScroll } from 'react-use';
import { useAudio } from '../contexts/AudioContext';
import useUISound from '../hooks/useUISound';
import Button from './Button';

const navItems = [
	{ name: 'nexus', link: '/', icon: <TiLocationArrow /> },
	{ name: 'vault', link: '/', icon: <TiLocationArrow /> },
	{ name: 'prologue', link: '/' },
	{ name: 'about', link: '#about' },
	{ name: 'contact', link: '#contact' },
];

// Customizable properties
const INDICATOR_CONFIG = {
	transitionDuration: 0.5,
	elasticity: 0.7,
	fadeOutDuration: 0.4,
	hideDelay: 0.1, // Small delay before hiding on mouse leave for better UX
};

const Navbar = () => {
	const [hoverIndex, setHoverIndex] = useState(null);
	const [wasHovering, setWasHovering] = useState(false);
	const [indicatorVisible, setIndicatorVisible] = useState(false);
	const [lastScrollY, setLastScrollY] = useState(0);
	const [isNavVisible, setIsNavVisible] = useState(true);

	const navRefs = useRef([]);
	const navItemsContainerRef = useRef(null);
	const navContainerRef = useRef(null);
	const audioElementRef = useRef(null);
	const indicatorRef = useRef(null);
	const leaveTimeoutRef = useRef(null);
	const handleNavRef = (el, index) => {
		if (el) {
			navRefs.current[index] = el;
		}
	};

	const { isAudioEnabled, toggleAudio } = useAudio();
	const playHoverSound = useUISound('/audio/hover-on-url.mp3');
	const { y: currentScrollY } = useWindowScroll();

	// Memoized item position calculation for performance
	const getItemPosition = useCallback((index) => {
		if (
			index === null ||
			!navRefs.current[index] ||
			!navItemsContainerRef.current
		)
			return {};

		const container = navItemsContainerRef.current.getBoundingClientRect();
		const item = navRefs.current[index].getBoundingClientRect();

		return {
			left: item.left - container.left,
			width: item.width,
		};
	}, []);

	// Handle scroll behavior for showing/hiding navbar
	useEffect(() => {
		if (currentScrollY === 0) {
			setIsNavVisible(true);
			navContainerRef.current.classList.remove('floating-nav');
		} else if (currentScrollY > lastScrollY) {
			setIsNavVisible(false);
			navContainerRef.current.classList.add('floating-nav');
		} else if (currentScrollY < lastScrollY) {
			setIsNavVisible(true);
			navContainerRef.current.classList.add('floating-nav');
		}

		setLastScrollY(currentScrollY);
	}, [currentScrollY, lastScrollY]);

	// Animate navbar visibility with GSAP
	useEffect(() => {
		gsap.to(navContainerRef.current, {
			y: isNavVisible ? 0 : -100,
			opacity: isNavVisible ? 1 : 0,
			duration: 0.4,
			ease: 'power2.out',
		});
	}, [isNavVisible]);

	// Handle audio play/pause
	useEffect(() => {
		if (isAudioEnabled) {
			audioElementRef.current
				?.play()
				.catch((err) => console.log('Audio play error:', err));
		} else {
			audioElementRef.current?.pause();
		}
	}, [isAudioEnabled]);

	// Enhanced hover handling with professional animation
	const handleNavItemHover = useCallback(
		(index) => {
			// Clear any pending leave timeout
			if (leaveTimeoutRef.current) {
				clearTimeout(leaveTimeoutRef.current);
				leaveTimeoutRef.current = null;
			}

			playHoverSound();
			setIndicatorVisible(true);

			if (!wasHovering && indicatorRef.current) {
				// First hover - position immediately without animation
				const position = getItemPosition(index);
				if (position.left !== undefined && position.width !== undefined) {
					// Disable transitions
					indicatorRef.current.style.transition = 'none';
					indicatorRef.current.style.transform = `translateX(${position.left}px)`;
					indicatorRef.current.style.width = `${position.width}px`;
					indicatorRef.current.style.opacity = '1';

					// Force a reflow to apply the above styles immediately
					indicatorRef.current.offsetHeight;

					// Re-enable transitions for future movements
					requestAnimationFrame(() => {
						if (indicatorRef.current) {
							indicatorRef.current.style.transitionProperty =
								'transform, width, opacity';
							indicatorRef.current.style.transitionDuration = `${INDICATOR_CONFIG.transitionDuration}s`;
							indicatorRef.current.style.transitionTimingFunction =
								'cubic-bezier(0.33, 0.83, 0.99, 0.98)';
						}
					});
				}
			} else if (indicatorRef.current) {
				// Subsequent hovers - use GSAP for smooth animation
				const position = getItemPosition(index);
				gsap.to(indicatorRef.current, {
					x: position.left,
					width: position.width,
					opacity: 1,
					duration: INDICATOR_CONFIG.transitionDuration,
					ease: `elastic.out(${INDICATOR_CONFIG.elasticity}, 0.7)`,
					overwrite: true,
				});
			}

			setHoverIndex(index);
			setWasHovering(true);
		},
		[getItemPosition, playHoverSound, wasHovering],
	);

	// Handle nav item click with sound
	const handleNavItemClick = useCallback(
		(event, link) => {
			playHoverSound();

			if (link.startsWith('#')) {
				event.preventDefault();
				const element = document.querySelector(link);
				if (element) {
					element.scrollIntoView({ behavior: 'smooth' });
				}
			}
		},
		[playHoverSound],
	);

	const handleNavMouseLeave = useCallback(() => {
		leaveTimeoutRef.current = setTimeout(() => {
			if (indicatorRef.current && wasHovering) {
				gsap.to(indicatorRef.current, {
					opacity: 0,
					duration: INDICATOR_CONFIG.fadeOutDuration,
					ease: 'power1.out',
					onComplete: () => {
						setIndicatorVisible(false);
						setHoverIndex(null);
						setWasHovering(false);
					},
				});
			} else {
				setIndicatorVisible(false);
				setHoverIndex(null);
				setWasHovering(false);
			}
		}, INDICATOR_CONFIG.hideDelay * 1000);
	}, [wasHovering]);

	// Clean up any pending timeouts on unmount
	useEffect(() => {
		return () => {
			if (leaveTimeoutRef.current) {
				clearTimeout(leaveTimeoutRef.current);
			}

			// Kill any GSAP animations to prevent memory leaks
			if (indicatorRef.current) {
				gsap.killTweensOf(indicatorRef.current);
			}
		};
	}, []);

	return (
		<div
			ref={navContainerRef}
			className="fixed inset-x-0 top-4 h-16 z-50 border-none transition-all duration-700 sm:inset-x-6"
			aria-label="Main navigation"
		>
			<header className="absolute top-1/2 w-full -translate-y-1/2">
				<nav className="flex size-full items-center justify-between p-4">
					<div className="flex items-center gap-4">
						<img src="./img/logo.png" alt="logo" className="w-10" />

						<Button
							id="product-button"
							title="Products"
							rightIcon={<TiLocationArrow />}
							containerClass={
								'bg-blue-50 md:flex hidden items-center justify-center gap-1'
							}
						/>

						<Button
							id="whitepaper-button"
							title="Whitepaper"
							containerClass={
								'bg-blue-50 md:flex hidden items-center justify-center gap-1'
							}
						/>
					</div>

					<div className="flex h-full items-center relative">
						<div className="hidden md:block">
							<div
								ref={navItemsContainerRef}
								className="relative flex items-center justify-center h-7"
								onMouseLeave={handleNavMouseLeave}
							>
								{indicatorVisible && (
									<div
										ref={indicatorRef}
										className="slide-nav"
										style={{
											position: 'absolute',
											left: 0,
											transform:
												hoverIndex !== null
													? `translateX(${getItemPosition(hoverIndex).left}px)`
													: 'translateX(0)',
											width:
												hoverIndex !== null
													? `${getItemPosition(hoverIndex).width}px`
													: '0',
											opacity: indicatorVisible ? 1 : 0,
											pointerEvents: 'none',
										}}
										aria-hidden="true"
									/>
								)}
								{navItems.map((item, index) => (
									<a
										ref={(el) => handleNavRef(el, index)}
										href={item.link}
										key={item.name}
										className="nav-hover-btn"
										onClick={(e) => handleNavItemClick(e, item.link)}
										onMouseEnter={() => handleNavItemHover(index)}
										aria-current={hoverIndex === index ? 'page' : undefined}
									>
										{item.name}
										{item.icon && (
											<span className="inline-flex">{item.icon}</span>
										)}
									</a>
								))}
							</div>
						</div>

						<button
							type="button"
							className={`ml-10 flex items-center space-x-0.5 cursor-pointer ${!isAudioEnabled ? 'py-2' : ''}`}
							onClick={toggleAudio}
							aria-label={isAudioEnabled ? 'Mute audio' : 'Enable audio'}
							aria-pressed={isAudioEnabled}
						>
							{/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
							<audio
								ref={audioElementRef}
								src="/audio/audio_loop.mp3"
								className="hidden"
								loop
								type="audio/mp3"
							/>
							{[1, 2, 3, 4].map((bar) => (
								<div
									key={bar}
									className={`indicator-line ${isAudioEnabled ? 'active' : ''}`}
									style={{ animationDelay: `${bar * 0.1}s` }}
								/>
							))}
						</button>
					</div>
				</nav>
			</header>
		</div>
	);
};

export default Navbar;
