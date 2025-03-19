const Loader = () => {
  return (
    <div className='flex items-center justify-center text-xl absolute z-[9999] h-dvh w-screen overflow-hidden bg-violet-300'>
      <div class='dot-spinner'>
        <div class='dot-spinner__dot'></div>
        <div class='dot-spinner__dot'></div>
        <div class='dot-spinner__dot'></div>
        <div class='dot-spinner__dot'></div>
        <div class='dot-spinner__dot'></div>
        <div class='dot-spinner__dot'></div>
        <div class='dot-spinner__dot'></div>
        <div class='dot-spinner__dot'></div>
      </div>
    </div>
  );
};

export default Loader;
