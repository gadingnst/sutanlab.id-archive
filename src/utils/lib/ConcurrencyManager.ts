export type ProcessStatus = 'pending'|'fulfilled'|'rejected';

export interface Process<T> {
  id: number;
  status: ProcessStatus;
  process: () => Promise<T>;
  response?: T;
  ping?: number;
}

export interface ConcurrentOptions {
  workers: number;
  withPing?: boolean;
}

/**
 * Author: Gading Nasution <contact@gading.dev>
 * @see: https://github.com/gadingnst/concurrency-manager
 */
class ConcurrencyManager<T> {
  private workers = 0;
  private counter = 0;
  private withPing = false;
  private process: Process<T>[] = [];

  constructor(initialOpts: ConcurrentOptions) {
    this.setup(initialOpts);
  }

  /**
   * Setup instance of Concurrency
   * @param opts - options to setup
   * @returns {this} - instance of Concurrency
   */
  public setup(opts: ConcurrentOptions): this {
    this.workers = opts.workers;
    this.withPing = opts.withPing || this.withPing;
    return this;
  }

  /**
   * Add async process to instance
   * @param process - async process to be added
   * @returns {this} - instance of Concurrency
   */
  public add(process: () => Promise<T>): this {
    this.process.push({
      id: ++this.counter,
      status: 'pending',
      process
    });
    return this;
  }

  /**
   * Get process by id
   * @param id - id of process to be get
   * @returns {Process<T>} - process with id
   */
  public getProcess(id: number): Process<T> {
    return this.process[id - 1];
  }

  /**
   * Get all process in instance
   * @param status - filter status of process to be get
   * @returns {Process<T>[]} - process with status
   */
  public getListedProcess(status?: ProcessStatus): Process<T>[] {
    return status
      ? this.process.filter(data => data.status === status)
      : this.process;
  }

  /**
   * Run all process in instance concurrently with amount workers
   * @returns {Promise<T[]>} - array of response
   */
  public async run(): Promise<Process<T>[]> {
    const { workers, process, withPing } = this;
    const max = Math.ceil(process.length / workers);
    const result: Process<T>[] = [];
    for (let i = 1; i <= max; i++) {
      const offset = ((i - 1) * workers) + 1;
      const limit = i * workers;
      const splittedProcess: Process<T>[] = process.slice(offset - 1, limit);
      await Promise.all(splittedProcess.map(item => {
        const startPing = new Date().getTime();
        const onSettled = (status: ProcessStatus) => (response?: T) => {
          const ping = Math.abs(new Date().getTime() - startPing);
          const data = {
            id: item.id,
            status,
            response,
            process: item.process,
            ...(withPing && { ping })
          };
          result.push(data);
          return data;
        };
        return item.process()
          .then(onSettled('fulfilled'))
          .catch(onSettled('rejected'));
      }));
    }
    this.process = result;
    return result;
  }
}

export default ConcurrencyManager;
