const { useState, useRef, useEffect } = React;

/* ---------- nav data ---------- */
const NAV = [
{ label: 'Shop', nav: ['shop'], items: [
  { t: 'All products', go: ['shop'] },
  { t: 'Beanies', go: ['category', 'beanies'] },
  { t: 'Reverse Hoodies', go: ['category', 'hoodies'] },
  { t: 'Footwear', go: ['category', 'slippers'] }]
},
{ label: 'About', nav: ['about'], items: [
  { t: 'Mission', go: ['about'] }]
},
{ label: 'Policies', nav: ['policy', 'privacy'], items: [
  { t: 'Privacy policy', go: ['policy', 'privacy'] },
  { t: 'Returns & exchange', go: ['policy', 'returns'] },
  { t: 'Terms & conditions', go: ['policy', 'terms'] },
  { t: 'Accessibility', go: ['policy', 'accessibility'] }]
},
{ label: 'Contact', nav: ['contact'], items: [
  { t: 'FAQ', go: ['faq'] },
  { t: 'Contact form', go: ['contact'] }]
}];


/* ---------- thumbnail = user-fillable, resizable image slot ---------- */
function Thumb({ slotId, label, ar }) {
  return (
    <image-slot
      id={slotId}
      shape="rounded"
      radius="16"
      placeholder={label || 'Drop a photo'}
      style={{ width: '100%', height: 'auto', aspectRatio: ar || '1 / 1', display: 'block',
        maxWidth: '100%', resize: 'both', overflow: 'hidden', minWidth: '120px', minHeight: '130px' }}>
    </image-slot>);

}

/* ---------- nav dropdown ---------- */
function NavItem({ data, go }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    function out(e) {if (ref.current && !ref.current.contains(e.target)) setOpen(false);}
    document.addEventListener('mousedown', out);
    return () => document.removeEventListener('mousedown', out);
  }, []);
  return (
    <div className="nav-item" ref={ref}
    onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button className={'nav-trigger' + (open ? ' active' : '')}
      onClick={() => {setOpen(false);go(...data.nav);}}>
        {data.label}<span className="caret">▼</span>
      </button>
      {open &&
      <div className="menu">
          {data.items.map((it, i) =>
        <button key={i} onClick={() => {setOpen(false);go(...it.go);}}>
              {it.t}<span className="arr">→</span>
            </button>
        )}
        </div>
      }
    </div>);

}

/* ---------- search overlay ---------- */
function SearchOverlay({ go, close }) {
  const [q, setQ] = useState('');
  const inputRef = useRef(null);
  useEffect(() => {inputRef.current && inputRef.current.focus();}, []);
  const quick = [
  { t: 'Beanies', go: ['category', 'beanies'] },
  { t: 'Reverse Hoodies', go: ['category', 'hoodies'] },
  { t: 'Footwear', go: ['category', 'slippers'] },
  { t: 'Wallpapers', go: ['wallpapers'] },
  { t: 'FAQ', go: ['faq'] }];

  const filtered = quick.filter((x) => x.t.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="overlay" onMouseDown={close}>
      <div className="search-panel glass" onMouseDown={(e) => e.stopPropagation()}>
        <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)}
        placeholder="Search SKYLRK…"
        onKeyDown={(e) => {if (e.key === 'Escape') close();}} />
        <div className="quick">
          {filtered.length ? filtered.map((x, i) =>
          <button key={i} onClick={() => {close();go(...x.go);}}>{x.t}</button>
          ) : <span style={{ color: 'var(--ink-faint)', padding: '6px 2px' }}>No matches — try “beanies”.</span>}
        </div>
      </div>
    </div>);

}

/* ---------- header ---------- */
function Header({ go }) {
  const [search, setSearch] = useState(false);
  const [cur, setCur] = useState('CAD');
  const [cart, setCart] = useState(false);
  const [bump, setBump] = useState(false);
  const [curOpen, setCurOpen] = useState(false);
  const cartRef = useRef(null);
  const curRef = useRef(null);
  const bag = useCart();
  const wishlist = useWish();
  const count = bag.count();
  const wcount = wishlist.count();
  const curList = [['CAD', 'C$'], ['USD', 'US$'], ['EUR', '€'], ['GBP', '£']];
  useEffect(() => {
    function out(e) {if (cartRef.current && !cartRef.current.contains(e.target)) setCart(false);}
    document.addEventListener('mousedown', out);
    return () => document.removeEventListener('mousedown', out);
  }, []);
  useEffect(() => {
    function out(e) {if (curRef.current && !curRef.current.contains(e.target)) setCurOpen(false);}
    document.addEventListener('mousedown', out);
    return () => document.removeEventListener('mousedown', out);
  }, []);
  useEffect(() => {
    function onAdd() {
      setCart(true);
      setBump(true);
      setTimeout(() => setBump(false), 460);
    }
    window.addEventListener('skylrk-cart-add', onAdd);
    return () => window.removeEventListener('skylrk-cart-add', onAdd);
  }, []);
  return (
    <React.Fragment>
      <header>
        <nav className="nav-left">
          {NAV.map((n, i) => <NavItem key={i} data={n} go={go} />)}
        </nav>
        <div className="logo" onClick={() => go('home')} style={{ fontFamily: "'Oxanium', sans-serif", color: "rgb(255, 255, 255)" }}>SKYLRK</div>
        <div className="utility">
          <button className="search-pill" onClick={() => setSearch(true)}>
            Search <span style={{ fontSize: '15px' }}>⌕</span>
          </button>
          <div className="nav-item" ref={curRef}>
            <button className={'icon-btn cur-trigger' + (curOpen ? ' active' : '')} onClick={() => setCurOpen((o) => !o)} aria-haspopup="listbox" aria-expanded={curOpen}>
              {cur} <span className="caret">▾</span>
            </button>
            {curOpen &&
            <div className="menu cur-menu" role="listbox">
                {curList.map(([code, sym]) =>
              <button key={code} role="option" aria-selected={cur === code}
                className={cur === code ? 'cur-sel' : ''}
                onClick={() => {setCur(code);setCurOpen(false);}}>
                  <span>{code}</span><span className="cur-sym">{sym}</span>
                </button>
              )}
              </div>
            }
          </div>
          <button className="icon-btn cart-btn" onClick={() => go('wishlist')} aria-label="Wishlist">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 21s-6.7-4.35-9.33-8.04C1.1 10.36 1.64 6.9 4.6 5.6c2.04-.9 4.13.05 5.4 1.86L12 9.2l2-1.74c1.27-1.81 3.36-2.76 5.4-1.86 2.96 1.3 3.5 4.76 1.93 7.36C18.7 16.65 12 21 12 21z"></path>
            </svg>
            {wcount > 0 && <span className="cart-badge">{wcount}</span>}
          </button>
          <div className="nav-item" ref={cartRef}>
            <button className={'icon-btn cart-btn' + (bump ? ' bump' : '')} onClick={() => setCart((c) => !c)} aria-label="Cart">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="20" r="1.4" fill="currentColor" stroke="none"></circle>
                <circle cx="18" cy="20" r="1.4" fill="currentColor" stroke="none"></circle>
                <path d="M2.2 3h2.3l2.2 11.2a1.6 1.6 0 0 0 1.6 1.3h8.7a1.6 1.6 0 0 0 1.6-1.25L21.5 7H6"></path>
              </svg>
              {count > 0 && <span className="cart-badge">{count}</span>}
            </button>
            {cart && (count === 0 ?
            <div className="popover">
                <p>Your bag is empty.</p>
                <button className="btn solid" style={{ width: '100%' }} onClick={() => {setCart(false);go('category', 'beanies');}}>
                  Start shopping
                </button>
              </div>
            :
            <div className="popover cart-pop">
                <div className="cp-list">
                  {bag.items().map((it) =>
                <div className="cp-line" key={it.key}>
                      <CartThumb id={it.slot} size={46} />
                      <div>
                        <div className="cp-name">{it.name}</div>
                        <div className="cp-meta">{it.size} · ×{it.qty}</div>
                      </div>
                      <div className="cp-price">{money(it.price * it.qty)}</div>
                    </div>
                )}
                </div>
                <div className="cp-sub"><span>Subtotal</span><span>{money(bag.subtotal())}</span></div>
                <button className="btn solid" style={{ width: '100%' }} onClick={() => {setCart(false);go('cart');}}>View bag</button>
                <button className="btn" style={{ width: '100%', marginTop: '8px' }} onClick={() => {setCart(false);go('checkout');}}>Checkout</button>
              </div>
            )}
          </div>
        </div>
      </header>
      {search && <SearchOverlay go={go} close={() => setSearch(false)} />}
    </React.Fragment>);

}

/* ---------- footer ---------- */
const IG_URL = 'https://www.instagram.com/skylrk?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==';
function openIG(e) {
  e.preventDefault();
  window.open(IG_URL, '_blank', 'noopener,noreferrer');
}
function Footer({ go }) {
  return (
    <footer>
      <div className="f-left">
        <span className="f-link" onClick={() => go('wallpapers')}>Wallpapers</span>
        <span className="f-link" onClick={() => go('policy', 'terms')}>Terms</span>
        <span className="f-link" onClick={() => go('faq')}>FAQ</span>
      </div>
      <div className="f-right">
        <a className="f-link ig-label" href={IG_URL} target="_blank" rel="noopener noreferrer" onClick={openIG}>IG</a>
        <a className="ig" href={IG_URL} target="_blank" rel="noopener noreferrer" onClick={openIG} aria-label="SKYLRK on Instagram">⌾</a>
      </div>
    </footer>);

}

/* ---------- page header bit ---------- */
function PageHead({ go, eyebrow, title }) {
  return (
    <div>
      <div className="page-head">
        <button className="back" onClick={() => history.length > 1 ? go('home') : go('home')}>← Back</button>
        <span className="eyebrow">{eyebrow}</span>
      </div>
      <h1 className="page-title">{title}</h1>
    </div>);

}

/* ---------- accessibility widget ---------- */
const A11Y_DEFAULT = { textScale: 0, contrast: false, underline: false, motion: false, readable: false };
function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [s, setS] = useState(() => {
    try {return { ...A11Y_DEFAULT, ...JSON.parse(localStorage.getItem('skylrk-a11y') || '{}') };}
    catch (e) {return A11Y_DEFAULT;}
  });
  useEffect(() => {
    localStorage.setItem('skylrk-a11y', JSON.stringify(s));
    const b = document.body;
    b.classList.toggle('a11y-contrast', s.contrast);
    b.classList.toggle('a11y-underline', s.underline);
    b.classList.toggle('a11y-motion', s.motion);
    b.classList.toggle('a11y-readable', s.readable);
    const app = document.querySelector('.app');
    if (app) app.style.zoom = [1, 1.12, 1.25][s.textScale] || 1;
  }, [s]);
  const set = (k, v) => setS((p) => ({ ...p, [k]: v }));
  const Toggle = ({ k, label }) =>
  <div className="a11y-row">
      <span>{label}</span>
      <button className={'tgl' + (s[k] ? ' on' : '')} role="switch" aria-checked={s[k]}
    aria-label={label} onClick={() => set(k, !s[k])}></button>
    </div>;

  const icon =
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="4.4" r="1.9" fill="currentColor" stroke="none"></circle>
      <path d="M4.5 8.5 L19.5 8.5"></path>
      <path d="M12 8.5 L12 14"></path>
      <path d="M12 14 L8.5 21"></path>
      <path d="M12 14 L15.5 21"></path>
    </svg>;

  return (
    <React.Fragment>
      {open &&
      <div className="a11y-panel glass" role="dialog" aria-label="Accessibility options">
          <div className="a11y-head">
            <h3>Accessibility</h3>
            <button className="x" onClick={() => setOpen(false)} aria-label="Close">✕</button>
          </div>
          <div className="a11y-label">Text size</div>
          <div className="seg">
            {['Default', 'Large', 'Larger'].map((t, i) =>
          <button key={i} className={s.textScale === i ? 'on' : ''} onClick={() => set('textScale', i)}>{t}</button>
          )}
          </div>
          <Toggle k="contrast" label="High contrast" />
          <Toggle k="underline" label="Underline links" />
          <Toggle k="readable" label="Readable font" />
          <Toggle k="motion" label="Reduce motion" />
          <button className="a11y-reset" onClick={() => setS(A11Y_DEFAULT)}>Reset all</button>
        </div>
      }
      <button className="a11y-fab" onClick={() => setOpen((o) => !o)}
      aria-label="Accessibility options" aria-expanded={open}>
        {icon}
      </button>
    </React.Fragment>);

}

Object.assign(window, { NAV, Thumb, NavItem, SearchOverlay, Header, Footer, PageHead, AccessibilityWidget });