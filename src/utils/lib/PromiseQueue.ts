export type ProcessStatus = 'pending'|'fulfilled'|'rejected';

export interface Process<T> {
  id: number;
  status: ProcessStatus;
  run: () => Promise<Process<T>>;
  response?: T;
  ms?: number;
}

export interface Queue<T> {
  id: number;
  processList: Process<T>[];
  ms?: number;
}

export interface QueueOptions {
  concurrent?: number;
  withMillis?: boolean;
}

/**
 * Author: Gading Nasution <contact@gading.dev>
 * @see: https://github.com/gadingnst/concurrency-manager
 */
class PromiseQueue<T> {
  private concurrent = 0;
  private counter = 0;
  private withMillis = false;
  private queue: Queue<T>[] = [];
  private process: Process<T>[] = [];

  constructor(initialOpts?: QueueOptions) {
    this.setup(initialOpts);
  }

  /**
   * Setup instance of Concurrency
   * @param opts - options to setup
   * @returns {this} - instance of Concurrency
   */
  public setup(opts?: QueueOptions): this {
    this.concurrent = opts?.concurrent ?? 0;
    this.withMillis = opts?.withMillis ?? false;
    return this;
  }

  /**
   * Add async process to instance
   * @param process - async process to be added
   * @returns {number} - id of added process
   */
  public add(process: (id: number) => Promise<T>): number {
    const id = ++this.counter;
    const onSettled = (status: ProcessStatus) => (response?: T) => {
      const data = {
        ...this.getProcess(id),
        response,
        status
      };
      this.process[id - 1] = data;
      return data;
    };
    this.process.push({
      id,
      status: 'pending',
      run: () => {
        const startPing = new Date().getTime();
        return process(id)
          .then(onSettled('fulfilled'))
          .catch(onSettled('rejected'))
          .then((data) => {
            if (this.withMillis) {
              data.ms = this.getMillis(startPing);
            }
            return data;
          });
      }
    });
    return id;
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
   * Get listed queue
   * @returns {Promise<T[]>} - multidimensional array of process
   */
  public getList(): Queue<T>[] {
    return this.queue;
  }

  /**
   * Get time taken to run process or queue
   * @param startPing - start ping
   * @returns {number} - time in ms
   */
  private getMillis(startPing: number): number {
    const endPing = new Date().getTime();
    return Math.abs(endPing - startPing);
  }

  /**
   * Run all queued process with amount of concurrent by Promise
   * @returns {Promise<T[]>} - array of response
   */
  public async runAll(): Promise<Process<T>[]> {
    const { concurrent, process } = this;
    const queue = concurrent > 0 ? Math.ceil(process.length / concurrent) : 1;
    for (let i = 1; i <= queue; i++) {
      const offset = ((i - 1) * concurrent) + 1;
      const limit = i * concurrent;
      const queueProcess = limit > 0 ? process.slice(offset - 1, limit) : process;
      const startPing = new Date().getTime();
      await Promise.all(queueProcess.map(item => {
        if (item.status === 'pending') {
          return item.run();
        }
        return Promise.resolve(item);
      }));
      const data: Queue<T> = {
        id: i,
        processList: queueProcess
      };
      if (this.withMillis) {
        data.ms = this.getMillis(startPing);
      }
      this.queue.push(data);
    }
    return this.process;
  }
}

export default PromiseQueue;
