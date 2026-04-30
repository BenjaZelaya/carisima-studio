function ValueCard({ title, text }) {
  return (
    <div className="border border-white/10 p-8 hover:border-white/25 transition-colors duration-300">
      <h4 className="font-serif text-xl font-light text-white mb-4">
        {title}
      </h4>
      <p className="text-white/40 text-sm leading-relaxed">
        {text}
      </p>
    </div>
  );
}

export default ValueCard;