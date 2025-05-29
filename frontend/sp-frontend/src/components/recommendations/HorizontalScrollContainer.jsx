const HorizontalScrollContainer = ({ children, ariaLabel }) => {
  return (
    <div 
      className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-transparent"
      style={{ scrollbarWidth: 'thin' }}
      aria-label={ariaLabel}
      role="region"
    >
      {children}
    </div>
  );
};
export default HorizontalScrollContainer;