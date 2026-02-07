import { useScrollReveal } from "../../hooks/useScrollReveal";

function ProfessionalCard({ name, role, description, image }) {
  const { ref, isVisible } = useScrollReveal();

  return (
    <article
      ref={ref}
      className={`
        bg-white rounded-3xl overflow-hidden
        shadow-[0_20px_40px_rgba(0,0,0,0.12)]
        transition-all duration-700 ease-out
        will-change-transform will-change-opacity
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}
      `}
    >
      <div className="overflow-hidden">
        <img
          src={image}
          alt={name}
          className="
            w-full h-80 object-cover
            transition-transform duration-700
            hover:scale-105
          "
        />
      </div>

      <div className="p-8 text-center">
        <h4 className="text-xl font-medium text-[#0B0B0B]">
          {name}
        </h4>

        <p className="text-sm uppercase tracking-wide text-[#E6A6C7] mt-2">
          {role}
        </p>

        <p className="mt-4 text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>
    </article>
  );
}

export default ProfessionalCard;