import { createContext, useContext, useState, useEffect } from 'react';

const AudioContextCustom = createContext();

const AudioProvider = ({ children }) => {
	const [isAudioEnabled, setIsAudioEnabled] = useState(false);

	// Initialize global flag when component mounts
	useEffect(() => {
		window.isAudioEnabled = isAudioEnabled;
	}, [isAudioEnabled]);

	// Update global flag whenever isAudioEnabled changes
	useEffect(() => {
		window.isAudioEnabled = isAudioEnabled;
	}, [isAudioEnabled]);

	// Function to toggle audio state
	const toggleAudio = () => {
		setIsAudioEnabled((prev) => !prev);
	};

	// Function to explicitly set audio state
	const setAudio = (state) => {
		setIsAudioEnabled(state);
	};

	return (
		<AudioContextCustom.Provider
			value={{
				isAudioEnabled,
				toggleAudio,
				setAudio,
			}}
		>
			{children}
		</AudioContextCustom.Provider>
	);
};

// Custom hook to use the audio context
const useAudio = () => {
	const context = useContext(AudioContextCustom);
	if (!context) {
		throw new Error('useAudio must be used within an AudioProvider');
	}
	return context;
};

export { AudioProvider, useAudio };
