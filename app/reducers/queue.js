import * as actions from '../actions/queue';

const actionsMap = {
  [actions.QUEUE_RELOAD](queue, action) {
    console.debug('QUEUE_RELOAD');
    return action.queue;
  },
};

export default function (queue = [], action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return queue;
  return reduceFn(queue, action);
}
