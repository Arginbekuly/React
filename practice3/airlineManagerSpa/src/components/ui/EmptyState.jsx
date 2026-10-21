import { PlaneIllustration } from './PlaneIllustration';
export function EmptyState({
  title = 'Ангар пока пуст',
  description = 'Купите или арендуйте первый борт, и он появится здесь.',
  children,
}) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-[#a8916a] bg-ticket/60 px-6 py-10 text-center">
      <PlaneIllustration outline className="mx-auto w-36 opacity-60" />
      <h3 className="mt-4 text-xl font-bold">{title}</h3>
      <p className="mx-auto mt-2 mb-5 max-w-sm text-sm leading-relaxed text-muted">{description}</p>
      {children}
    </div>
  );
}
