const LABEL_OVERRIDES: Record<string, string> = {
  '/anatomical-images/Human_skeleton_front_-_no_labels.svg': 'Full Skeleton (Front)',
  '/anatomical-images/hand_diagram.svg': 'Hand Anatomy',
};

const DEFAULT_LABEL = 'Anatomy Diagram';

/**
 * Return a friendly label for a diagram file path.
 * Falls back to a title-cased version of the file name.
 */
export function getDiagramLabel(svgFile?: string | null): string {
  if (!svgFile) {
    return DEFAULT_LABEL;
  }

  if (LABEL_OVERRIDES[svgFile]) {
    return LABEL_OVERRIDES[svgFile];
  }

  const filename = svgFile.split('/').pop() ?? svgFile;
  const withoutExt = filename.replace(/\.svg$/i, '');
  const cleaned = withoutExt.replace(/[-_]+/g, ' ').trim();

  if (!cleaned) {
    return DEFAULT_LABEL;
  }

  return cleaned
    .split(' ')
    .map(word => (word ? word[0].toUpperCase() + word.slice(1) : ''))
    .join(' ');
}
