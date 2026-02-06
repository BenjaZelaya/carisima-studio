export default function ButtonIconsInstaHero({ children, ...props }) {
  return (
    <button
      {...props}
      className="
        flex items-center justify-center
        w-16 h-16
        rounded-full
        bg-[#F5F0FA]
        text-[#4B2E83]
        border-2 border-[#E6DFF2]
        shadow-[0_6px_15px_rgba(0,0,0,0.15)]
        transition-all duration-300
        hover:shadow-[0_10px_25px_rgba(0,0,0,0.25)]
        hover:-translate-y-1
      "
    >
      <span className="w-7 h-7 flex items-center justify-center">
        {children}
      </span>
    </button>
  );
}
