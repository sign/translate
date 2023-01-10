export function currentTotalMemory() {
  if ('gc' in global) {
    (global as any).gc();
  }
  const usage = process.memoryUsage();
  const val = usage.heapTotal;
  return Math.round((val / 1024 / 1024) * 100) / 100 + 'MB';
}

export function logConsoleMemory(logger: any = console) {
  for (const f of ['log', 'debug', 'info', 'warn', 'error']) {
    const log = logger[f];
    (console as any)[f] = (...args: any[]) => {
      log(new Date().toISOString(), currentTotalMemory() + ':', ...args);
    };
  }
  console.log();
}
