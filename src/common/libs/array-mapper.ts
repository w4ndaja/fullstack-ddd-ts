export const arrayMapper = <T>(array:object[], mapper:Function):T => {
  return <T>array.map(item => mapper(item));
}