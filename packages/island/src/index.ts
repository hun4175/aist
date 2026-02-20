/** Proxy 기반 반응형 - Island 내부에서 사용 */
let currentEffect: (() => void) | null = null
const depsMap = new WeakMap<object, Map<string | symbol, Set<() => void>>>()

export function reactive<T extends object>(obj: T): T {
  const handler: ProxyHandler<T> = {
    get(target, key, receiver) {
      if (currentEffect) {
        let deps = depsMap.get(target)
        if (!deps) {
          deps = new Map()
          depsMap.set(target, deps)
        }
        let effects = deps.get(key)
        if (!effects) {
          effects = new Set()
          deps.set(key, effects)
        }
        effects.add(currentEffect)
      }
      return Reflect.get(target, key, receiver)
    },
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver)
      const deps = depsMap.get(target)
      if (deps) {
        const effects = deps.get(key)
        if (effects) {
          queueMicrotask(() => {
            effects.forEach((fn) => fn())
          })
        }
      }
      return result
    }
  }
  return new Proxy(obj, handler) as T
}

export function effect(fn: () => void): () => void {
  const wrapped = () => {
    currentEffect = wrapped
    fn()
    currentEffect = null
  }
  wrapped()
  return wrapped
}
