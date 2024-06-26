import { ulid } from 'ulid';

export const generateEntityId = (
  idProperty?: string,
  prefix?: string,
): string => {
  if (idProperty) {
    return idProperty;
  }

  const id = ulid();
  prefix = prefix ? `${prefix}_` : '';
  return `${prefix}${id}`;
};
