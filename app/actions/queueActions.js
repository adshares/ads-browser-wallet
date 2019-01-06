export const QUEUE_RELOAD = 'QUEUE_RELOAD';

export function reload(queue) {
  return { type: QUEUE_RELOAD, queue };
}
