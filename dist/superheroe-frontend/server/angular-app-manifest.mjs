
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
    'index.csr.html': {size: 677, hash: '3aab7c10519939c74da189a98b54ac9f8f0a767e8075ea25e4fa6d4d55546af3', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 956, hash: 'd49e211943789a957c71b438b582b15f66c8d1a3438d63ebe36a28b7ce7136c0', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'user-registration/index.html': {size: 12920, hash: '1da69dec096ed203f44515613432ec2835ef04211f9e7caf419d7f2c77f0622b', text: () => import('./assets-chunks/user-registration_index_html.mjs').then(m => m.default)},
    'catalog/index.html': {size: 14765, hash: '9936b8ced62d2ecf85c3635c3be6a4de9f2542aa77225e1b624c582345b4e501', text: () => import('./assets-chunks/catalog_index_html.mjs').then(m => m.default)},
    'login/index.html': {size: 12749, hash: '6a36d43ef044d671fbfe00e518653ac1503556383ab5e8bf2d0c0512b805edf2', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'carrito/index.html': {size: 17597, hash: '5303d0a8cc56211385a6f102ae50a6d6064422e3c33c11ad6eb5e41214618b63', text: () => import('./assets-chunks/carrito_index_html.mjs').then(m => m.default)},
    'favoritos/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/favoritos_index_html.mjs').then(m => m.default)},
    'about/index.html': {size: 11674, hash: 'ad3464009908673aeb6dc9efc86bf491d9a41740105428d0ad0906218b55a0db', text: () => import('./assets-chunks/about_index_html.mjs').then(m => m.default)},
    'profile/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/profile_index_html.mjs').then(m => m.default)},
    'add-hero/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/add-hero_index_html.mjs').then(m => m.default)},
    'styles-KKKNFT6X.css': {size: 1996, hash: 'u3dBgmnKYEI', text: () => import('./assets-chunks/styles-KKKNFT6X_css.mjs').then(m => m.default)}
  },
};
