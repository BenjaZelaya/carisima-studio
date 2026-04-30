function ProfessionalCard({ name, role, description, image }) {
  return (
    <article className="group">
      <div className="overflow-hidden mb-5">
        <img
          src={image}
          alt={name}
          className="w-full object-cover contrast-110 group-hover:scale-105 transition-transform duration-700"
          style={{ aspectRatio: "3/4", maxHeight: "380px" }}
        />
      </div>
      <h4 className="font-serif text-xl font-light text-white">{name}</h4>
      <p className="text-xs tracking-widest uppercase text-white/30 mt-1 mb-3">{role}</p>
      <p className="text-white/40 text-sm leading-relaxed">{description}</p>
    </article>
  );
}

export default ProfessionalCard;