import { AnimatePresence, motion } from 'framer-motion';

const Loader = ({ isLoading }) => {
	return (
		<AnimatePresence>
			{isLoading && (
				<div className="fixed top-0 left-0 z-[100] h-dvh w-screen overflow-hidden bg-violet-800">
					<motion.div
						animate={{
							scale: 1,
							opacity: 1,
							rotate: 0,
							transition: { type: 'spring', stiffness: 100 },
						}}
						exit={{
							scale: 0.95,
							opacity: 0,
							transition: { duration: 0.5, ease: 'easeInOut' },
						}}
						className="flex items-center justify-center text-xl fixed top-0 left-0 z-[100] h-dvh w-screen overflow-hidden bg-violet-700"
					>
						<div className="dot-spinner">
							<div className="dot-spinner__dot" />
							<div className="dot-spinner__dot" />
							<div className="dot-spinner__dot" />
							<div className="dot-spinner__dot" />
							<div className="dot-spinner__dot" />
							<div className="dot-spinner__dot" />
							<div className="dot-spinner__dot" />
							<div className="dot-spinner__dot" />
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
};

export default Loader;
