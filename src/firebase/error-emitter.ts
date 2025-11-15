'use client';

import { EventEmitter } from 'events';
import type { FirestorePermissionError } from './errors';

type ErrorEvents = {
  'permission-error': (error: FirestorePermissionError) => void;
};

// We can't type EventEmitter directly, so we create a wrapper
class TypedEventEmitter {
  private emitter = new EventEmitter();

  on<T extends keyof ErrorEvents>(event: T, listener: ErrorEvents[T]) {
    this.emitter.on(event, listener);
  }

  off<T extends keyof ErrorEvents>(event: T, listener: ErrorEvents[T]) {
    this.emitter.off(event, listener);
  }

  emit<T extends keyof ErrorEvents>(event: T, ...args: Parameters<ErrorEvents[T]>) {
    this.emitter.emit(event, ...args);
  }
}

export const errorEmitter = new TypedEventEmitter();
