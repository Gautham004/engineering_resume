// Shared parallax stars background — vanilla JS, no React
(function () {
  function generateBoxShadows(n, color) {
    const c = color || '#FFF';
    const parts = [];
    for (let i = 0; i < n; i++) {
      parts.push(Math.floor(Math.random() * 2000) + 'px ' + Math.floor(Math.random() * 2000) + 'px ' + c);
    }
    return parts.join(', ');
  }

  function injectStyles() {
    if (document.getElementById('__stars_styles')) return;
    const s = document.createElement('style');
    s.id = '__stars_styles';
    s.textContent = `
      .stars-root {
        position: fixed;
        inset: 0;
        overflow: hidden;
        background: #04050A;
        z-index: -1;
      }
      .stars-root.absolute { position: absolute; }
      .stars-root .gradient {
        position: absolute; inset: 0;
        background: radial-gradient(ellipse at bottom, #0E1520 0%, #04050A 100%);
      }
      .stars-root .veil {
        position: absolute; inset: 0;
        background: linear-gradient(180deg, rgba(4,5,10,0.0) 0%, rgba(4,5,10,0.55) 100%);
        pointer-events: none;
      }
      .stars-root .layer {
        position: absolute; left: 0; top: 0; background: transparent;
        animation-name: animStar;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
      }
      .stars-root .layer.s1 { width: 1px; height: 1px; }
      .stars-root .layer.s2 { width: 2px; height: 2px; }
      .stars-root .layer.s3 { width: 3px; height: 3px; }
      .stars-root .layer .echo { position: absolute; top: 2000px; background: transparent; }
      .stars-root .layer.s1 .echo { width: 1px; height: 1px; }
      .stars-root .layer.s2 .echo { width: 2px; height: 2px; }
      .stars-root .layer.s3 .echo { width: 3px; height: 3px; }
      @keyframes animStar {
        from { transform: translateY(0px); }
        to   { transform: translateY(-2000px); }
      }
    `;
    document.head.appendChild(s);
  }

  // opts: { mount: Element, density: 'full'|'soft', speed: 1, dim: 0..1, absolute: false }
  function mountStars(opts) {
    opts = opts || {};
    injectStyles();
    const mount = opts.mount || document.body;
    const density = opts.density || 'full';
    const speed = opts.speed || 1;
    const dim = opts.dim != null ? opts.dim : 0;

    const counts = density === 'soft'
      ? { s: 350, m: 90, b: 40 }
      : { s: 700, m: 200, b: 100 };

    const root = document.createElement('div');
    root.className = 'stars-root' + (opts.absolute ? ' absolute' : '');

    const grad = document.createElement('div');
    grad.className = 'gradient';
    root.appendChild(grad);

    function makeLayer(cls, count, durSec) {
      const sh = generateBoxShadows(count);
      const layer = document.createElement('div');
      layer.className = 'layer ' + cls;
      layer.style.boxShadow = sh;
      layer.style.animationDuration = (durSec / speed) + 's';
      const echo = document.createElement('div');
      echo.className = 'echo';
      echo.style.boxShadow = sh;
      layer.appendChild(echo);
      return layer;
    }

    root.appendChild(makeLayer('s1', counts.s, 50));
    root.appendChild(makeLayer('s2', counts.m, 100));
    root.appendChild(makeLayer('s3', counts.b, 150));

    if (dim > 0) {
      const v = document.createElement('div');
      v.className = 'veil';
      v.style.background = `linear-gradient(180deg, rgba(4,5,10,${dim*0.4}) 0%, rgba(4,5,10,${dim}) 100%)`;
      root.appendChild(v);
    }

    mount.appendChild(root);
    return root;
  }

  window.mountStars = mountStars;
})();
