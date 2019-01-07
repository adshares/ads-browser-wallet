import * as actions from '../actions/queueActions';

export default function (queue = [], action) {
  switch (action.type) {
    case actions.QUEUE_RELOAD:
      return action.queue;
    default:
      return queue;
  }
}
