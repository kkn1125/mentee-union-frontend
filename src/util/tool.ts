export const convertDateStringPropertyToDate: (formatData: object) => object = (
  formatData: object
) =>
  Object.fromEntries(
    Object.entries(formatData).map(
      ([key, value]: [string, string | number | boolean | object]) => {
        if (key.match(/(birth|date|at$|time)/gi)) {
          return [key, new Date(value as string)];
        } else if (value !== null && typeof value === "object") {
          return [key, convertDateStringPropertyToDate(value)];
        } else {
          return [key, value];
        }
      }
    )
  );

export const timeFormat = (
  dateTime: Date | string | number,
  format: string
) => {
  const date = new Date(dateTime);
  return format.replace(/YYYY|MM|dd|HH|mm|ss|SSS|AP/g, ($1: string) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    const millisecond = date.getMilliseconds();
    const isOver12 = hour > 12;
    const useAP = !!format.match(/AP/);

    switch ($1) {
      case "YYYY":
        return year.toString().padStart(4, "0");
      case "MM":
        return month.toString().padStart(2, "0");
      case "dd":
        return day.toString().padStart(2, "0");
      case "HH":
        return (useAP ? hour - 12 : hour).toString().padStart(2, "0");
      case "mm":
        return minute.toString().padStart(2, "0");
      case "ss":
        return second.toString().padStart(2, "0");
      case "SSS":
        return millisecond.toString().padStart(3, "0");
      case "AP":
        return useAP ? (isOver12 ? "PM" : "AM") : "";
      default:
        return $1;
    }
  });
};

/**
 *
 * @param {File | null} file file or null
 * @param {number} limit limite byte
 * @returns {number | boolean}
 */
export function checkImageSize(file: File | null, limit: number = 10) {
  if (file) {
    return parseFloat((file.size / 1024).toFixed(2)) > limit;
  } else {
    return false;
  }
}
