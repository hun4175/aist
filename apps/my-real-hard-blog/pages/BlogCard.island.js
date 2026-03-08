/**
 * Island: 블로그 카드 - hover 시 마우스 따라 Tilt3D, click 시 뒤집기 + 확장
 */
class BlogCard extends HTMLElement {
  constructor() {
    super()
    this._tiltX = 0
    this._tiltY = 0
    this._expanded = false
    this._maxTilt = 18
  }

  connectedCallback() {
    this._title = this.getAttribute('title') || ''
    this._excerpt = this.getAttribute('excerpt') || ''
    this._content = this.innerHTML.trim()
    this._render()
    this._bindEvents()
    this._expanded = false
    this.removeAttribute('data-expanded')
    const overlay = this.querySelector('[data-overlay]')
    if (overlay) overlay.hidden = true
  }

  _render() {
    this.innerHTML = `
      <style>
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-15deg); opacity: 0; }
          50% { opacity: 0.6; }
          100% { transform: translateX(200%) skewX(-15deg); opacity: 0; }
        }
        blog-card { display: block; flex: 1 1 280px; min-width: 260px; max-width: 320px; cursor: pointer; }
        .blog-card-wrapper { perspective: 1000px; width: 100%; }
        .blog-card-inner {
          position: relative;
          width: 100%;
          aspect-ratio: 2 / 3;
          transition: transform 0.12s ease-out;
          transform-style: preserve-3d;
        }
        .blog-card-inner.flipping {
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .blog-card-overlay {
          position: fixed;
          inset: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
        }
        .blog-card-overlay[hidden] { display: none !important; }
        .blog-card-overlay-panel {
          max-width: 560px;
          max-height: 80vh;
          overflow-y: auto;
          background: linear-gradient(145deg, #1a1d24 0%, #252a33 25%, #1e2229 50%, #161a20 100%);
          border: 1px solid rgba(148, 163, 184, 0.25);
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
        }
        .blog-card-overlay-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; margin-bottom: 1rem; }
        .blog-card-overlay-title { font-size: 1.5rem; font-weight: 600; color: #e2e8f0; flex: 1; }
        .blog-card-overlay-close { flex-shrink: 0; padding: 0.25rem; border: none; background: transparent; color: #94a3b8; cursor: pointer; font-size: 1.5rem; line-height: 1; border-radius: 4px; }
        .blog-card-overlay-close:hover { color: #e2e8f0; background: rgba(148, 163, 184, 0.2); }
        .blog-card-overlay-content { font-size: 0.9375rem; color: #cbd5e1; line-height: 1.7; }
        .blog-card-overlay-content p { margin-bottom: 0.75rem; }
        .blog-card-overlay-content p:last-child { margin-bottom: 0; }
        .blog-card-face {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          border-radius: 12px;
          padding: 1.5rem;
          overflow: hidden;
          background: url(/card-bg.svg) center / cover no-repeat;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.06),
            inset 0 -1px 0 rgba(0,0,0,0.4),
            0 4px 12px rgba(0,0,0,0.3);
        }
        .blog-card-face::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 12px;
          background: linear-gradient(105deg, transparent 0%, transparent 40%, rgba(255,255,255,0.03) 45%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.03) 55%, transparent 60%, transparent 100%);
          pointer-events: none;
          opacity: 0;
        }
        blog-card:not([data-expanded]) .blog-card-wrapper:hover .blog-card-face::before {
          animation: shimmer 0.6s ease-in-out;
        }
        blog-card:not([data-expanded]) .blog-card-wrapper:hover .blog-card-face {
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.12),
            inset 0 -1px 0 rgba(0,0,0,0.25),
            0 12px 32px rgba(0,0,0,0.35),
            0 0 0 1px rgba(148,163,184,0.15);
        }
        .blog-card-front { display: flex; flex-direction: column; justify-content: center; }
        .blog-card-back {
          transform: rotateY(180deg);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .blog-card-title { font-size: 1.25rem; font-weight: 600; color: #e2e8f0; margin-bottom: 0.5rem; text-shadow: 0 1px 2px rgba(0,0,0,0.3); text-align: center; }
        .blog-card-back .blog-card-title { margin-bottom: 0; font-size: 1.125rem; }
        .blog-card-excerpt { font-size: 0.875rem; color: #94a3b8; line-height: 1.5; text-align: center; }
      </style>
      <div class="blog-card-wrapper">
        <div class="blog-card-inner" data-inner>
          <div class="blog-card-face blog-card-front" data-front>
            <div class="blog-card-title">${this._escape(this._title)}</div>
            <div class="blog-card-excerpt">${this._escape(this._excerpt)}</div>
          </div>
          <div class="blog-card-face blog-card-back" data-back>
            <div class="blog-card-title">${this._escape(this._title)}</div>
          </div>
        </div>
      </div>
      <div class="blog-card-overlay" data-overlay hidden>
        <div class="blog-card-overlay-panel" data-overlay-panel>
          <div class="blog-card-overlay-header">
            <div class="blog-card-overlay-title">${this._escape(this._title)}</div>
            <button type="button" class="blog-card-overlay-close" data-close aria-label="닫기">×</button>
          </div>
          <div class="blog-card-overlay-content">${this._content}</div>
        </div>
      </div>
    `
  }

  _escape(s) {
    const div = document.createElement('div')
    div.textContent = s
    return div.innerHTML
  }

  _bindEvents() {
    const inner = this.querySelector('[data-inner]')
    if (!inner) return

    this.addEventListener('mousemove', (e) => this._onMouseMove(e))
    this.addEventListener('mouseleave', () => this._onMouseLeave())
    this.addEventListener('click', () => this._onClick())
    this.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this._onClick() }
    })

    const overlay = this.querySelector('[data-overlay]')
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (!overlay.hidden && (e.target === overlay || e.target.closest('[data-close]'))) this._closeOverlay()
      })
    }
    this._escapeHandler = (e) => {
      if (e.key === 'Escape' && overlay && !overlay.hidden) this._closeOverlay()
    }
    document.addEventListener('keydown', this._escapeHandler)
  }

  disconnectedCallback() {
    if (this._escapeHandler) {
      document.removeEventListener('keydown', this._escapeHandler)
    }
  }

  _onMouseMove(e) {
    if (this._expanded) return
    const rect = this.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    this._tiltX = -y * this._maxTilt
    this._tiltY = x * this._maxTilt
    this._applyTilt()
  }

  _onMouseLeave() {
    if (this._expanded) return
    this._tiltX = 0
    this._tiltY = 0
    this._applyTilt()
  }

  _applyTilt() {
    const inner = this.querySelector('[data-inner]')
    if (!inner) return
    if (this._expanded) {
      inner.style.transform = 'rotateY(180deg)'
    } else {
      inner.style.transform = `rotateX(${this._tiltX}deg) rotateY(${this._tiltY}deg)`
    }
  }

  _onClick(e) {
    if (this._expanded) return
    this._expanded = true
    this.setAttribute('data-expanded', '')
    const inner = this.querySelector('[data-inner]')
    const overlay = this.querySelector('[data-overlay]')
    if (inner) {
      inner.classList.add('flipping')
      inner.style.transform = 'rotateY(180deg)'
    }
    if (overlay) {
      overlay.hidden = false
      const closeBtn = overlay.querySelector('[data-close]')
      if (closeBtn) {
        this._closeBtnHandler = (e) => {
          e.stopPropagation()
          this._closeOverlay()
        }
        closeBtn.addEventListener('click', this._closeBtnHandler, true)
      }
    }
  }

  _closeOverlay() {
    this._expanded = false
    this.removeAttribute('data-expanded')
    const inner = this.querySelector('[data-inner]')
    const overlay = this.querySelector('[data-overlay]')
    if (inner) {
      inner.classList.remove('flipping')
      inner.style.transform = ''
    }
    if (overlay) {
      overlay.hidden = true
      const closeBtn = overlay.querySelector('[data-close]')
      if (closeBtn && this._closeBtnHandler) {
        closeBtn.removeEventListener('click', this._closeBtnHandler, true)
        this._closeBtnHandler = null
      }
    }
  }
}

customElements.define('blog-card', BlogCard)
