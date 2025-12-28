const descendingComparator = (a, b, orderBy) => {
  const aValue = orderBy.split('.').reduce((obj, key) => obj[key], a);
  const bValue = orderBy.split('.').reduce((obj, key) => obj[key], b);

  if (parseFloat(bValue) < parseFloat(aValue)) return -1;
  if (parseFloat(bValue) > parseFloat(aValue)) return 1;
  return 0;
};

export const getComparator = (order, orderBy) => {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

export const sortRows = (array, comparator) => {
  const stabilizedRows = array.map((el, index) => [el, index]);
  stabilizedRows.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedRows.map((el) => el[0]);
};
