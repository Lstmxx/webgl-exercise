// eslint-disable-next-line import/prefer-default-export
export const randomColor = (): string => {
  const random16 = () => Math.ceil(Math.random() * 256).toString(16);
  return `#${random16()}${random16()}${random16()}`;
};
