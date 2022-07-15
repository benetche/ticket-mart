import { buildImageUrl } from 'cloudinary-build-url';

export function normalizeStr(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function cloudinaryImage(
  url: string,
  {
    width,
    height,
    type,
  }: { width?: number; height?: number; type?: string } = {}
): string {
  return buildImageUrl(url, {
    cloud: {
      cloudName: 'rolimans',
    },
    transformations: {
      width,
      height,
      type,
    },
  });
}

export function range(start: number, end: number): number[] {
  return Array(end - start + 1)
    .fill(0)
    .map((_, idx) => start + idx);
}
