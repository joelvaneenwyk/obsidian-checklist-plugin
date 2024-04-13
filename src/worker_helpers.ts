// I realized this isn't plausible because creating workers via blob limits to inline code only and doesn't allow calls to other functions
export const workerizeFunction = async <T extends (...args: any) => any>(fn: T) => {
  // noinspection JSUnusedLocalSymbols
  const functionWrapper = (id: string, args: Parameters<T>) => {
    fn()
  }
  const blobURL = URL.createObjectURL(
    new Blob(['(', fn.toString(), ')()'], {
      type: 'application/javascript',
    }),
  )
  const worker = new Worker(blobURL)

  return (...args: T extends (...args: infer P) => any ? P : never[]): Promise<ReturnType<T>> => {
    const id = Math.random()
    worker.postMessage([id, args])
    const listener = () => {
      worker.removeEventListener('message', listener)
    }
    worker.addEventListener('message', listener)
    // @ts-ignore
    return new Promise(r => r(null))
  }
}
