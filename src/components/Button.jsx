import use3DTilt from '../hooks/use3DTilt';

const Button = ({ title, id, containerClass, leftIcon, rightIcon }) => {
  const { frameRef: btnRef, handleMouseMove, handleMouseLeave } = use3DTilt(30);

  return (
    <button
      id={id}
      className={`${containerClass} group relative z-10 w-fit cursor-pointer overflow-hidden rounded-full hover:rounded-lg bg-violet-50 px-4 py-2 text-black`}
      ref={btnRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseLeave}
      onMouseEnter={handleMouseLeave}>
      {leftIcon}
      <span className='relative inline-flex overflow-hidden font-general text-[10px] uppercase'>
        <div className='translate-y-0 skew-y-0 transition duration-500 group-hover:translate-y-[-160%] group-hover:skew-y-12'>{title}</div>
        <div className='absolute translate-y-[164%] skew-y-12 transition duration-500 group-hover:translate-y-0 group-hover:skew-y-0'>{title}</div>
      </span>
      {rightIcon}
    </button>
  );
};

export default Button;
