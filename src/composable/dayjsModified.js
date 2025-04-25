import dayjs from 'dayjs';

export function dayjsModified() {
  const isModifiedDayjs = import.meta.env.VITE_MODIFIED_DAYJS === 'true';
  return isModifiedDayjs ? dayjs().subtract(4, 'minutes').subtract(6, 'seconds') : dayjs();
}