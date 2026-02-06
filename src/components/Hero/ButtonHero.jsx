export default function ButtonHero({ children, icon, ...props }) {
  return (
    <button
      {...props}
      className="
        flex items-center justify-center gap-2
        w-[280px]
        px-8 py-3
        rounded-full
        bg-[#F5F0FA]
        text-[#4B2E83]
        font-medium
        border-2 border-[#E6DFF2]
        shadow-[0_6px_15px_rgba(0,0,0,0.12)]
        transition-all duration-300
        hover:shadow-[0_10px_25px_rgba(0,0,0,0.18)]
        hover:-translate-y-0.5
      "
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
}
