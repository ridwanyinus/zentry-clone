import { useRef, useState, useEffect } from 'react';
import Button from './Button';
import { TiLocationArrow } from 'react-icons/ti';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import VideoPreview from './VideoPreview';
import Loader from './Loader';

import { ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);
// FIXME: fix the video bg-flash before next video starts playing
// TODO: make the video polygon clipPath more dynamic on scroll [triangle to rectangle]
/* TODO: turn the video trailers into two div instead of three div
  one for current video, one for next video; video frame/preview serve as the next video trailer
*/
// TODO: change loader and bg and use supspense
// TODO: move isLoading to another component
const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [hasClicked, setHasClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedVideos, setLoadedVideos] = useState(0);

  const totalVideos = 4;
  const nextVideoRef = useRef(null);

  const handleVideoLoaded = () => {
    setLoadedVideos((prev) => prev + 1);
  };

  useEffect(() => {
    if (loadedVideos >= totalVideos - 1) {
      setIsLoading(false);
    }
  }, [loadedVideos]);

  const upComingVideoIndex = (currentIndex % totalVideos) + 1;

  const handleMiniVDClick = () => {
    setHasClicked(true);
    setCurrentIndex(upComingVideoIndex);
  };

  useGSAP(
    () => {
      if (hasClicked) {
        gsap.set('#next-video', { visibility: 'visible' });

        gsap.to('#next-video', {
          transformOrigin: 'center center',
          scale: 1,
          width: '100%',
          height: '100%',
          duration: 1,
          ease: 'power1.inOut',
          onStart: () => nextVideoRef.current.play(),
        });

        gsap.from('#current-video', {
          transformOrigin: 'center center',
          scale: 0,
          duration: 1.5,
          ease: 'power1.inOut',
        });
      }
    },
    {
      dependencies: [currentIndex],
      revertOnUpdate: true,
    },
  );

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

  const getVideoSrc = (index) => `videos/hero-${index}.mp4`;

  return (
    <div className='relative h-dvh w-screen overflow-x-hidden'>
      <div className={`loader ${isLoading ? '' : 'hidden'}`}>
        <Loader />
      </div>

      <div id='video-frame' className='relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-blue-75'>
        <div>
          <div className='mask-clip-path absolute-center absolute z-50 size-56 cursor-pointer overflow-hidden rounded-lg'>
            <VideoPreview>
              <div onClick={handleMiniVDClick} className='origin-center scale-50 opacity-0 transition-all duration-500 ease-in hover:scale-100 hover:opacity-100 '>
                <video
                  playsInline
                  src={getVideoSrc(upComingVideoIndex)}
                  ref={nextVideoRef}
                  loop
                  muted
                  preload='auto'
                  id='current-video'
                  className='size-56 origin-center scale-150 object-cover object-center'
                  onLoadedData={handleVideoLoaded}
                />
              </div>
            </VideoPreview>
          </div>

          <video
            playsInline
            ref={nextVideoRef}
            src={getVideoSrc(currentIndex)}
            loop
            preload='auto'
            muted
            id='next-video'
            className='absolute-center-video origin-center absolute invisible scale-150 z-20 size-full object-cover object-center'
            onLoadedData={handleVideoLoaded}
          />

          <video
            playsInline
            src={getVideoSrc(currentIndex === totalVideos - 1 ? 1 : currentIndex)}
            autoPlay
            loop
            muted
            className='absolute left-0 top-0 size-full object-cover object-center'
            onLoadedData={handleVideoLoaded}
          />
        </div>
        <h1 className='special-font hero-heading absolute bottom-5 right-5 z-40 text-blue-75'>
          {' '}
          G<b>A</b>MING
        </h1>

        <div className='absolute left-0 top-0 z-40 size-full'>
          <div className='mt-24 px-5 sm:px-10'>
            <h1 className='special-font hero-heading text-blue-100'>
              {' '}
              redefi<b>n</b>e
            </h1>

            <p className='mb-5 max-w-64 font-robert-regular text-blue-100'>
              Enter the Metagame Layer <br /> Unleash the Player Economy
            </p>

            <Button id='watch-trailer' title='Watch trailer' leftIcon={<TiLocationArrow />} containerClass='!bg-yellow-300 flex-center gap-1' />
          </div>
        </div>
      </div>
      <h1 className='special-font hero-heading absolute bottom-5 right-5 text-black'>
        G<b>A</b>MING
      </h1>
    </div>
  );
};

export default Hero;
