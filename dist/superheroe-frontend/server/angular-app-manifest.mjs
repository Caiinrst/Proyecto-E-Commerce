
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/catalog"
  },
  {
    "renderMode": 2,
    "route": "/user-registration"
  },
  {
    "renderMode": 2,
    "route": "/about"
  },
  {
    "renderMode": 2,
    "route": "/add-hero"
  },
  {
    "renderMode": 2,
    "route": "/login"
  },
  {
    "renderMode": 2,
    "route": "/favoritos"
  },
  {
    "renderMode": 2,
    "route": "/profile"
  },
  {
    "renderMode": 2,
    "route": "/carrito"
  },
  {
    "renderMode": 2,
    "route": "/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 677, hash: '2d512b21f3424c0244cc5f617de1ca64822bfef920206868f3c878e1a4d758dd', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 956, hash: '0f752177fa5359283660039373a07c5367b73407a3f17e2c5489e341ae8563d8', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'favoritos/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/favoritos_index_html.mjs').then(m => m.default)},
    'profile/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/profile_index_html.mjs').then(m => m.default)},
    'catalog/index.html': {size: 14696, hash: 'e62faa792fc2e132a9a5bf7cba3de916fbd4bc823cb60deb32a8b1b0b1e08d31', text: () => import('./assets-chunks/catalog_index_html.mjs').then(m => m.default)},
    'user-registration/index.html': {size: 12850, hash: '78be133f823e86da9aef7788edeaec24d3a30de3523134bb24e2a9afac818845', text: () => import('./assets-chunks/user-registration_index_html.mjs').then(m => m.default)},
    'add-hero/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/add-hero_index_html.mjs').then(m => m.default)},
    'login/index.html': {size: 12674, hash: '3425605d8ebd77de0d4aedf5809cb0a178b35718cba843bf6901378c3c6ac3be', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'carrito/index.html': {size: 17527, hash: 'ed4f0892ef4438aa3897a8fad69e9ea9e7e230d9cc160e43dfd6dac6086a841e', text: () => import('./assets-chunks/carrito_index_html.mjs').then(m => m.default)},
    'about/index.html': {size: 11611, hash: 'b79db190f6b337588f64ff548fe4276a3215cde30c64b80518eefb08585617f6', text: () => import('./assets-chunks/about_index_html.mjs').then(m => m.default)},
    'styles-KKKNFT6X.css': {size: 1996, hash: 'u3dBgmnKYEI', text: () => import('./assets-chunks/styles-KKKNFT6X_css.mjs').then(m => m.default)}
  },
};
