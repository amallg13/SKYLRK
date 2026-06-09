const { useState, useEffect, useRef } = React;

/* =========================================================
   PERSISTENT CART STORE  (localStorage, like the a11y prefs)
   Shared across files via window — components subscribe with useCart().
   ========================================================= */
const CART_KEY = 'skylrk-cart-v1';

function loadCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
  catch (e) { return []; }
}
let _cart = loadCart();
const _subs = new Set();
function _commit(next) {
  _cart = next;
  try { localStorage.setItem(CART_KEY, JSON.stringify(_cart)); } catch (e) {}
  _subs.forEach((fn) => fn());
}

const Cart = {
  items: () => _cart,
  count: () => _cart.reduce((a, i) => a + i.qty, 0),
  subtotal: () => _cart.reduce((a, i) => a + i.price * i.qty, 0),
  shipping() { const s = this.subtotal(); return s === 0 || s >= 150 ? 0 : 12; },
  total() { return this.subtotal() + this.shipping(); },
  add(item) {
    const key = [item.id, item.size, item.sw].join('|');
    const found = _cart.find((i) => i.key === key);
    if (found) _commit(_cart.map((i) => i.key === key ? { ...i, qty: i.qty + (item.qty || 1) } : i));
    else _commit([..._cart, { ...item, key, qty: item.qty || 1 }]);
    window.dispatchEvent(new CustomEvent('skylrk-cart-add'));
  },
  setQty(key, q) { _commit(_cart.map((i) => i.key === key ? { ...i, qty: Math.max(1, q) } : i)); },
  remove(key) { _commit(_cart.filter((i) => i.key !== key)); },
  clear() { _commit([]); },
  subscribe(fn) { _subs.add(fn); return () => _subs.delete(fn); },
};

function useCart() {
  const [, force] = useState(0);
  useEffect(() => Cart.subscribe(() => force((n) => n + 1)), []);
  return Cart;
}

/* =========================================================
   PERSISTENT WISHLIST STORE
   ========================================================= */
const WISH_KEY = 'skylrk-wish-v1';
function loadWish() {
  try { return JSON.parse(localStorage.getItem(WISH_KEY) || '[]'); }
  catch (e) { return []; }
}
let _wish = loadWish();
const _wsubs = new Set();
function _wcommit(next) {
  _wish = next;
  try { localStorage.setItem(WISH_KEY, JSON.stringify(_wish)); } catch (e) {}
  _wsubs.forEach((fn) => fn());
}
const Wish = {
  items: () => _wish,
  count: () => _wish.length,
  has: (id) => _wish.some((i) => i.id === id),
  toggle(item) {
    if (_wish.some((i) => i.id === item.id)) _wcommit(_wish.filter((i) => i.id !== item.id));
    else { _wcommit([..._wish, item]); window.dispatchEvent(new CustomEvent('skylrk-wish-add')); }
  },
  remove(id) { _wcommit(_wish.filter((i) => i.id !== id)); },
  subscribe(fn) { _wsubs.add(fn); return () => _wsubs.delete(fn); },
};
function useWish() {
  const [, force] = useState(0);
  useEffect(() => Wish.subscribe(() => force((n) => n + 1)), []);
  return Wish;
}

/* small thumbnail that reuses the product's dropped photo (same slot id) */
function CartThumb({ id, size }) {
  const dim = (size || 72) + 'px';
  return (
    <image-slot id={id} shape="rounded" radius="12" placeholder=" "
      style={{ width: dim, height: dim, display: 'block', flex: '0 0 auto' }}></image-slot>);
}

function money(n) { return '$' + n.toFixed(n % 1 ? 2 : 0); }

/* =========================================================
   CART PAGE
   ========================================================= */
function CartPage({ go }) {
  const cart = useCart();
  const items = cart.items();

  if (!items.length) {
    return (
      <div className="wrap">
        <PageHead go={go} eyebrow="Bag" title="Your bag" />
        <div className="panel glass empty-bag" style={{ marginTop: '26px' }}>
          <div className="empty-glyph">𓍝</div>
          <h2 style={{ marginTop: 0 }}>Your bag is empty</h2>
          <p>Nothing in here yet. The good stuff is one tap away.</p>
          <button className="btn solid" onClick={() => go('shop')}>Start shopping →</button>
        </div>
      </div>);
  }

  const ship = cart.shipping();
  const toFree = Math.max(0, 150 - cart.subtotal());

  return (
    <div className="wrap">
      <PageHead go={go} eyebrow="Bag" title={`Your bag · ${cart.count()}`} />
      <div className="cart-layout">
        <div className="cart-lines">
          {items.map((it) => (
            <div className="cart-line glass" key={it.key}>
              <CartThumb id={it.slot} />
              <div className="cl-body">
                <button className="cl-name" onClick={() => go('product', it.cat, it.id)}>{it.name}</button>
                <div className="cl-meta">
                  <span className="cl-dot" style={{ background: it.color }}></span>
                  {it.size}
                </div>
                <button className="cl-remove" onClick={() => cart.remove(it.key)}>Remove</button>
              </div>
              <div className="cl-right">
                <div className="stepper">
                  <button onClick={() => cart.setQty(it.key, it.qty - 1)} aria-label="Decrease">−</button>
                  <span>{it.qty}</span>
                  <button onClick={() => cart.setQty(it.key, it.qty + 1)} aria-label="Increase">+</button>
                </div>
                <div className="cl-price">{money(it.price * it.qty)}</div>
              </div>
            </div>
          ))}
        </div>

        <aside className="summary glass">
          <h2 className="sum-title">Summary</h2>
          {toFree > 0 ? (
            <div className="free-ship">
              <span>You're {money(toFree)} from free shipping</span>
              <div className="free-bar"><i style={{ width: Math.min(100, (cart.subtotal() / 150) * 100) + '%' }}></i></div>
            </div>
          ) : (
            <div className="free-ship done">✓ You've unlocked free shipping</div>
          )}
          <div className="sum-row"><span>Subtotal</span><span>{money(cart.subtotal())}</span></div>
          <div className="sum-row"><span>Shipping</span><span>{ship === 0 ? 'Free' : money(ship)}</span></div>
          <div className="sum-row"><span>Duties</span><span className="incl">Included</span></div>
          <div className="sum-row total"><span>Total</span><span>{money(cart.total())}</span></div>
          <button className="btn solid" style={{ width: '100%', marginTop: '18px' }} onClick={() => go('checkout')}>
            Checkout →
          </button>
          <button className="link-btn keep" onClick={() => go('shop')}>Continue shopping</button>
        </aside>
      </div>
    </div>);
}

/* =========================================================
   CHECKOUT FLOW  —  shipping → payment → confirmation
   ========================================================= */
const COUNTRIES = ['Canada', 'United States', 'United Kingdom', 'Germany', 'France', 'Netherlands'];

function OrderSummary({ cart, snapshot }) {
  const items = snapshot ? snapshot.items : cart.items();
  const subtotal = snapshot ? snapshot.subtotal : cart.subtotal();
  const ship = snapshot ? snapshot.shipping : cart.shipping();
  const total = snapshot ? snapshot.total : cart.total();
  return (
    <aside className="summary glass co-summary">
      <h2 className="sum-title">Order summary</h2>
      <div className="co-lines">
        {items.map((it) => (
          <div className="co-line" key={it.key}>
            <div className="co-thumb"><CartThumb id={it.slot} size={52} /><span className="co-qty">{it.qty}</span></div>
            <div className="co-info">
              <div className="co-name">{it.name}</div>
              <div className="co-meta">{it.size}</div>
            </div>
            <div className="co-price">{money(it.price * it.qty)}</div>
          </div>
        ))}
      </div>
      <div className="sum-row"><span>Subtotal</span><span>{money(subtotal)}</span></div>
      <div className="sum-row"><span>Shipping</span><span>{ship === 0 ? 'Free' : money(ship)}</span></div>
      <div className="sum-row total"><span>Total</span><span>{money(total)}</span></div>
    </aside>);
}

function Field({ label, span, ...rest }) {
  return (
    <div className="field" style={span ? { gridColumn: '1 / -1' } : null}>
      <label>{label}</label>
      <input {...rest} />
    </div>);
}

function Checkout({ go }) {
  const cart = useCart();
  const [step, setStep] = useState('shipping');
  const [ship, setShip] = useState(() => {
    try { return JSON.parse(localStorage.getItem('skylrk-ship') || 'null') || {}; } catch (e) { return {}; }
  });
  const [snapshot, setSnapshot] = useState(null);
  const [order, setOrder] = useState('');

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'auto' }); }, [step]);

  // empty bag guard (only before confirmation)
  if (!cart.items().length && step !== 'done') {
    return (
      <div className="wrap">
        <PageHead go={go} eyebrow="Checkout" title="Checkout" />
        <div className="panel glass empty-bag" style={{ marginTop: '26px' }}>
          <div className="empty-glyph">𓍝</div>
          <h2 style={{ marginTop: 0 }}>Nothing to check out</h2>
          <p>Your bag is empty — add something first.</p>
          <button className="btn solid" onClick={() => go('shop')}>Browse the shop →</button>
        </div>
      </div>);
  }

  const setS = (k, v) => setShip((p) => { const n = { ...p, [k]: v }; try { localStorage.setItem('skylrk-ship', JSON.stringify(n)); } catch (e) {} return n; });

  function submitShipping(e) { e.preventDefault(); setStep('payment'); }
  function submitPayment(e) {
    e.preventDefault();
    setSnapshot({ items: cart.items(), subtotal: cart.subtotal(), shipping: cart.shipping(), total: cart.total() });
    setOrder('SK' + Math.floor(100000 + Math.random() * 899999));
    cart.clear();
    setStep('done');
  }

  const Steps = (
    <div className="steps">
      <div className={'step ' + (step === 'shipping' ? 'active' : 'done')}>
        <span className="num">{step === 'shipping' ? '1' : '✓'}</span>Shipping
      </div>
      <div className="step-div"></div>
      <div className={'step ' + (step === 'payment' ? 'active' : step === 'done' ? 'done' : '')}>
        <span className="num">{step === 'done' ? '✓' : '2'}</span>Payment
      </div>
      <div className="step-div"></div>
      <div className={'step ' + (step === 'done' ? 'active' : '')}>
        <span className="num">3</span>Done
      </div>
    </div>);

  /* ---- confirmation ---- */
  if (step === 'done') {
    return (
      <div className="wrap">
        <div className="page-head"><button className="back" onClick={() => go('home')}>← Home</button>
          <span className="eyebrow">Order confirmed</span></div>
        {Steps}
        <div className="checkout-layout">
          <div className="panel glass confirm">
            <div className="confirm-check">✓</div>
            <h1 className="confirm-title">You're all set.</h1>
            <p className="confirm-sub">Order <strong>#{order}</strong> is in. A receipt is on its way to <strong>{ship.email || 'your inbox'}</strong>.</p>
            <div className="confirm-grid">
              <div>
                <div className="opt-label">Shipping to</div>
                <p className="confirm-addr">{ship.name}<br />{ship.address}<br />{[ship.city, ship.postal].filter(Boolean).join(', ')}<br />{ship.country || 'Canada'}</p>
              </div>
              <div>
                <div className="opt-label">Arrives</div>
                <p className="confirm-addr">3–5 business days<br />Tracked & carbon-neutral</p>
              </div>
            </div>
            <div className="confirm-actions">
              <button className="btn solid" onClick={() => go('home')}>Back to home</button>
              <button className="btn" onClick={() => go('shop')}>Keep shopping</button>
            </div>
          </div>
          <OrderSummary cart={cart} snapshot={snapshot} />
        </div>
      </div>);
  }

  /* ---- shipping + payment ---- */
  return (
    <div className="wrap">
      <div className="page-head"><button className="back" onClick={() => go('cart')}>← Bag</button>
        <span className="eyebrow">Checkout</span></div>
      {Steps}
      <div className="checkout-layout">
        <div className="panel glass">
          {step === 'shipping' ? (
            <form className="co-form" key="ship" onSubmit={submitShipping}>
              <h2 className="co-h">Contact</h2>
              <div className="co-grid">
                <Field label="Email" type="email" required span placeholder="you@email.com"
                  value={ship.email || ''} onChange={(e) => setS('email', e.target.value)} />
              </div>
              <h2 className="co-h">Shipping address</h2>
              <div className="co-grid">
                <Field label="Full name" required span placeholder="Your name"
                  value={ship.name || ''} onChange={(e) => setS('name', e.target.value)} />
                <Field label="Address" required span placeholder="Street and number"
                  value={ship.address || ''} onChange={(e) => setS('address', e.target.value)} />
                <Field label="City" required placeholder="City"
                  value={ship.city || ''} onChange={(e) => setS('city', e.target.value)} />
                <Field label="Postal code" required placeholder="A1A 1A1"
                  value={ship.postal || ''} onChange={(e) => setS('postal', e.target.value)} />
                <div className="field" style={{ gridColumn: '1 / -1' }}>
                  <label>Country</label>
                  <select value={ship.country || 'Canada'} onChange={(e) => setS('country', e.target.value)}>
                    {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <button className="btn solid co-next" type="submit">Continue to payment →</button>
            </form>
          ) : (
            <form className="co-form" key="pay" onSubmit={submitPayment}>
              <div className="co-recap">
                <div>
                  <div className="opt-label">Ship to</div>
                  <span>{ship.name} · {[ship.city, ship.country || 'Canada'].filter(Boolean).join(', ')}</span>
                </div>
                <button type="button" className="link-btn" onClick={() => setStep('shipping')}>Edit</button>
              </div>
              <h2 className="co-h">Payment</h2>
              <p className="co-note">🔒 This is a demo — no real card is charged.</p>
              <div className="co-grid">
                <Field label="Card number" required span inputMode="numeric" placeholder="4242 4242 4242 4242" defaultValue="4242 4242 4242 4242" />
                <Field label="Name on card" required span placeholder="Your name" defaultValue={ship.name || ''} />
                <Field label="Expiry" required placeholder="MM / YY" defaultValue="12 / 28" />
                <Field label="CVC" required inputMode="numeric" placeholder="123" defaultValue="123" />
              </div>
              <label className="co-check">
                <input type="checkbox" defaultChecked /> Billing address same as shipping
              </label>
              <button className="btn solid co-next" type="submit">Pay {money(cart.total())} →</button>
            </form>
          )}
        </div>
        <OrderSummary cart={cart} />
      </div>
    </div>);
}

/* =========================================================
   WISHLIST PAGE
   ========================================================= */
function Wishlist({ go }) {
  const wish = useWish();
  const items = wish.items();

  if (!items.length) {
    return (
      <div className="wrap">
        <PageHead go={go} eyebrow="Saved" title="Wishlist" />
        <div className="panel glass empty-bag" style={{ marginTop: '26px' }}>
          <div className="empty-glyph">♡</div>
          <h2 style={{ marginTop: 0 }}>No saves yet</h2>
          <p>Tap the heart on anything you love and it'll live here.</p>
          <button className="btn solid" onClick={() => go('shop')}>Browse the shop →</button>
        </div>
      </div>);
  }

  return (
    <div className="wrap">
      <PageHead go={go} eyebrow="Saved" title={`Wishlist · ${items.length}`} />
      <div className="cat-grid" style={{ marginTop: '24px' }}>
        {items.map((it) => (
          <div className="prod-card wish-card glass" key={it.id}>
            <button className="wish-remove" onClick={() => wish.remove(it.id)} aria-label="Remove from wishlist">♥</button>
            <div className="slot-wrap" onClick={() => go('product', it.cat, it.id)} style={{ cursor: 'pointer' }}>
              <Thumb slotId={it.slot} label="Drop a photo" />
            </div>
            <div className="meta">
              <span className="name">{it.name}</span>
              <span className="price">{money(it.price)}</span>
            </div>
            <button className="btn" style={{ width: '100%', marginTop: '12px' }} onClick={() => go('product', it.cat, it.id)}>
              View product
            </button>
          </div>
        ))}
      </div>
    </div>);
}

Object.assign(window, { Cart, useCart, Wish, useWish, CartThumb, money, CartPage, Checkout, Wishlist });
