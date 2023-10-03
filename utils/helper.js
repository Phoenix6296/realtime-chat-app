export const truncate = (value) => {
  return value?.length > 30 ? value.substring(0, 30) + "..." : value;
};
