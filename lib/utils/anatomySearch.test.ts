import { describe, expect, it } from 'vitest';
import { filterAnatomicalParts } from './anatomySearch';
import { AnatomicalPart, BodySystem, BodyRegion } from '@/lib/models/AnatomicalPart';

const femur = new AnatomicalPart('femur', 'Femur', 'Thigh Bone', BodySystem.SKELETAL, BodyRegion.LOWER_LIMB, 'FemurLeft');
const metacarpals = new AnatomicalPart('metacarpals', 'Metacarpals', 'Hand Bones', BodySystem.SKELETAL, BodyRegion.UPPER_LIMB, 'MetacarpalsLeft');
const fibula = new AnatomicalPart('fibula', 'Fibula', 'Calf Bone', BodySystem.SKELETAL, BodyRegion.LOWER_LIMB, 'FibulaLeft');

describe('filterAnatomicalParts', () => {
  it('returns empty array for queries shorter than 2 characters', () => {
    const result = filterAnatomicalParts([femur, metacarpals], 'f');
    expect(result).toEqual([]);
  });

  it('matches only the beginning of official medical names', () => {
    const result = filterAnatomicalParts([femur, metacarpals, fibula], 'fe');
    expect(result.map(part => part.id)).toEqual(['femur']);
  });

  it('does not match when only the common name starts with the query', () => {
    const result = filterAnatomicalParts([metacarpals], 'hand');
    expect(result).toEqual([]);
  });
});
