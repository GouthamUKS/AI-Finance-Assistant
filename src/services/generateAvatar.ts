import { fal } from '@fal-ai/client';
import type { AvatarOptions } from '../store/useStore';

fal.config({ credentials: import.meta.env.VITE_FAL_KEY });

const SKIN: Record<string, string> = {
  '#FDDBB4': 'fair skin',
  '#E8A878': 'light tan skin',
  '#C68642': 'medium brown skin',
  '#8D5524': 'deep tan skin',
  '#4A2912': 'deep dark skin',
};

const HAIR_COLOR: Record<string, string> = {
  '#1a1a1a': 'black',
  '#8B4513': 'brown',
  '#D4A017': 'blonde',
  '#E8793A': 'auburn red',
  '#94a3b8': 'silver grey',
};

const HAIR_STYLE: Record<string, string[]> = {
  female: ['long flowing', 'short bob', 'hair in a bun'],
  male:   ['short neat', 'fade', 'wavy'],
  other:  ['medium length', 'short', 'locs'],
};

const OUTFIT: Record<string, string> = {
  '#1E40AF': 'navy blue',
  '#059669': 'green',
  '#DC2626': 'red',
  '#7C3AED': 'purple',
  '#374151': 'charcoal grey',
  '#0891b2': 'teal',
};

const GENDER_DESC: Record<string, string> = {
  female: 'female girl character',
  male:   'male boy character',
  other:  'androgynous character',
};

function buildPrompt(opts: AvatarOptions): string {
  const skin    = SKIN[opts.skinTone]           ?? 'medium skin';
  const hairCol = HAIR_COLOR[opts.hairColor]    ?? 'dark';
  const hairSty = HAIR_STYLE[opts.gender]?.[opts.hairStyle] ?? 'short';
  const outfit  = OUTFIT[opts.outfitColor]      ?? 'casual';
  const gender  = GENDER_DESC[opts.gender]      ?? 'character';
  const glasses = opts.glasses ? ', wearing stylish glasses' : '';

  return (
    `3D cartoon ${gender}, ${skin}, ${hairSty} ${hairCol} hair, ` +
    `wearing modern ${outfit} outfit${glasses}, ` +
    `Pixar Disney animation style, big expressive eyes, chibi proportions, ` +
    `full body standing pose, plain light background, studio lighting, ` +
    `3D render, highly detailed, vibrant, cute`
  );
}

export async function generateAvatarImage(opts: AvatarOptions): Promise<string> {
  const result = await fal.subscribe('fal-ai/flux/dev', {
    input: {
      prompt: buildPrompt(opts),
      image_size: 'portrait_4_3',
      num_inference_steps: 28,
      guidance_scale: 3.5,
      num_images: 1,
      enable_safety_checker: true,
    },
  }) as { data: { images: { url: string }[] } };

  const url = result.data.images[0]?.url;
  if (!url) throw new Error('No image returned from fal.ai');
  return url;
}
