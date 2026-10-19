export function isPictureQuestion(q: { picture?: boolean; stimulus?: string } | null | undefined) {
  return Boolean(q?.picture && q?.stimulus);
}

export function pictureLabel(option: string) {
  return option.replace(/\u200b/g, '');
}

export default function PicturePrompt({
  stimulus,
  prompt,
}: {
  stimulus: string;
  prompt: string;
}) {
  return (
    <div className="mb-7 flex flex-col items-center text-center">
      <div className="max-w-full text-6xl leading-tight tracking-wide md:text-7xl">
        {stimulus}
      </div>
      <p className="mt-4 max-w-xl text-lg font-semibold leading-snug text-neutral-800 md:text-xl">
        {prompt}
      </p>
      <p className="mt-2 text-xs font-medium uppercase tracking-[0.14em] text-neutral-400">
        An adult can read this aloud
      </p>
    </div>
  );
}
