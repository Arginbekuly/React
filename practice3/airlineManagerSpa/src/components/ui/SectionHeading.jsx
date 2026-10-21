export function SectionHeading({ label, title, description }) {
  return (
    <div className="mb-5">
      <p className="eyebrow mb-2 font-semibold text-red">{label}</p>
      <h2 className="text-[23px] leading-snug font-bold sm:text-[28px]">{title}</h2>
      {description && (
        <p className="mt-2 max-w-[620px] leading-relaxed text-[#3a3f52]">{description}</p>
      )}
    </div>
  );
}
