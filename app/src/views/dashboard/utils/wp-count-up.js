/**
 * 极轻量 CountUp：requestAnimationFrame + ease-out cubic
 * 仅用于工作台仪表盘 V2 的指标网格。
 *
 * 用法：
 *   const stop = countUp({
 *     from: 0,
 *     to: 458500,
 *     duration: 1200,
 *     onUpdate: (v) => { this.display = v; },
 *     onComplete: () => {},
 *   });
 *   // 需要中途取消：stop();
 *
 * 设计说明：
 * - 不引第三方库（如 countup.js）以避免增加 ~10KB 体积
 * - 用 `Math.round` 在 onUpdate 端取整，避免渲染时频繁出现小数点
 * - 进度到 1 时强制传入精确 to 值，避免浮点误差
 */
export function countUp({ from = 0, to = 0, duration = 1200, onUpdate, onComplete } = {}) {
  const start = typeof performance !== "undefined" ? performance.now() : Date.now();
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  let rafId = null;
  let cancelled = false;

  function tick(now) {
    if (cancelled) return;
    const elapsed = now - start;
    const progress = duration > 0 ? Math.min(1, elapsed / duration) : 1;
    const value = from + (to - from) * easeOut(progress);

    if (typeof onUpdate === "function") {
      onUpdate(progress === 1 ? to : value);
    }
    if (progress < 1) {
      rafId = requestAnimationFrame(tick);
    } else if (typeof onComplete === "function") {
      onComplete();
    }
  }

  rafId = requestAnimationFrame(tick);

  return function stop() {
    cancelled = true;
    if (rafId != null) {
      cancelAnimationFrame(rafId);
    }
  };
}
