import { reactive, effect } from '@aist/island'

const state = reactive({ count: 0 })

class ClickCounterEl extends HTMLElement {
  connectedCallback() {
    const btn = this.querySelector('button')
    const span = this.querySelector('span')
    if (!btn || !span) return
    btn.addEventListener('click', () => { state.count++ })
    effect(() => { span.textContent = String(state.count) })
  }
}

customElements.define('click-counter', ClickCounterEl)
