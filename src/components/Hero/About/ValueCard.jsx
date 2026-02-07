function ValueCard({ title, text }) {
  return (
    <div className="
      bg-white rounded-3xl p-10
      shadow-[0_10px_30px_rgba(0,0,0,0.1)]
      text-center
    ">
      <h4 className="text-xl font-medium mb-4 text-[#0B0B0B]">
        {title}
      </h4>
      <p className="text-gray-600 leading-relaxed">
        {text}
      </p>
    </div>
  );
}

export default ValueCard;