export default function LocationMap() {
  return (
    <div className="w-[320px] sm:w-[480px] h-[260px] overflow-hidden border border-white/10">
      <iframe
        title="Ubicación Carrísima Studio"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3560.0343167341734!2d-65.2007723!3d-26.8388608!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94225c0641f5f0cb%3A0xf4e36bc175cef429!2sLamadrid%20117%2C%20T4000%20San%20Miguel%20de%20Tucum%C3%A1n%2C%20Tucum%C3%A1n!5e0!3m2!1ses!2sar!4v1770394945882!5m2!1ses!2sar"
        className="w-full h-full border-0 grayscale opacity-80"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
