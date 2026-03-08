/** Molecule: props로 3D 기울임을 받아 자식 DOM에 적용 */
export const Tilt3D = ({ rotateX = 0, rotateY = 0, rotateZ = 0, perspective = 500, children }) => {
  const needs3d = rotateX !== 0 || rotateY !== 0
  const transform = needs3d
    ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`
    : `rotate(${rotateZ}deg)`
  const wrapperStyle = needs3d ? `perspective: ${perspective}px; transform-style: preserve-3d;` : ''
  const innerStyle = needs3d ? `transform: ${transform}; transform-style: preserve-3d;` : `transform: ${transform};`
  return `<div class="tilt-3d-wrapper" style="${wrapperStyle}">
  <div class="tilt-3d-inner" style="${innerStyle}">
    ${children}
  </div>
</div>`
}
