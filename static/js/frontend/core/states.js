// filter dom element by classname

export function filterByClass(array, todoClass) {
  return array.filter(todo => todo.class === todoClass);
}

export function deleteCompleted(array) {
  return array.filter(todo => todo.class != "completed");
}
export function updateClassById(id, newClass, data) {
  data.forEach((item) => {
    if (item.id === id) {
      item.class = newClass;
    }
  });
}

