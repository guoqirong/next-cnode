import EventEmitter from 'events';
const event = new EventEmitter();

// 全局状态通知，维护一个区局event
const useEventBus = () => {
  return [event];
};

export default useEventBus;
