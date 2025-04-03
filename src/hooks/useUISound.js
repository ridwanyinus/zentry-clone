import { useRef, useCallback, useEffect } from 'react';

/**
 * Simple hook for playing UI sounds for 1 second
 * @param {string} soundUrl - URL to the sound file
 * @returns {Function} Function to play the sound
 */

const useUISound = (soundUrl) => {
	const soundRef = useRef(null);

	// Initialize audio on component mount
	useEffect(() => {
		if (soundUrl) {
			soundRef.current = new Audio(soundUrl);
		}

		// Cleanup on unmount
		return () => {
			if (soundRef.current) {
				soundRef.current.pause();
				soundRef.current = null;
			}
		};
	}, [soundUrl]);

	// Play sound function
	const play = useCallback(() => {
		const sound = soundRef.current;

		// Return early if sound isn't available or global setting is disabled
		if (!sound || !window.isAudioEnabled) return;

		// Reset sound to beginning
		sound.currentTime = 0;

		// Play the sound
		const playPromise = sound.play();

		if (playPromise !== undefined) {
			playPromise
				.then(() => {
					// Stop after 1 second
					setTimeout(() => {
						sound.pause();
						sound.currentTime = 0;
					}, 1000);
				})
				.catch((error) => {
					console.error('UI sound failed to play:', error);
				});
		}
	}, []);

	return play;
};

export default useUISound;
