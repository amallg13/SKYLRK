const { useState, useEffect } = React;

/* ---------- product data ---------- */
const CATS = {
  beanies: {
    name: 'Beanies', tone: 'green', blurb: 'Heavyweight knit, garment-dyed. One size, total cocoon.',
    sizes: ['One size'],
    desc: 'A double-layer merino-acrylic knit that holds its shape wash after wash. Garment-dyed in small batches so no two greens land exactly alike. Cuffed deep for a clean fold or slouched back — it works either way.',
    details: ['80% merino wool / 20% recycled acrylic', 'Garment-dyed, small batch', 'Relaxes ~½ size after first wash', 'Made in Portugal'],
    products: [
    { id: 'b1', name: 'Acid Beanie', price: 45, tone: 'green', sw: ['#c3d23f', '#9aa9b6', '#7fa8cd'], out: [] },
    { id: 'b2', name: 'Fog Beanie', price: 45, tone: 'green', sw: ['#9aa9b6', '#c3d23f', '#efb6c2'], out: ['One size'] },
    { id: 'b3', name: 'Dusk Beanie', price: 45, tone: 'green', sw: ['#7fa8cd', '#c3d23f', '#9aa9b6'], out: [] }]

  },
  hoodies: {
    name: 'Reverse Hoodies', tone: 'lilac', blurb: 'Inside-out loopback fleece. The seams are the point.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    desc: 'Built inside-out from heavyweight loopback so the raw seams and brushed loops face the world. Boxy through the body, dropped shoulder, ribbed at every edge. Pre-shrunk so the fit you buy is the fit you keep.',
    details: ['480gsm organic cotton loopback', 'Inside-out construction, exposed seams', 'Boxy fit — size down for a trimmer look', 'Pre-shrunk, made in Portugal'],
    products: [
    { id: 'h1', name: 'Reverse Hoodie — Lilac', price: 130, tone: 'lilac', sw: ['#c9bfe8', '#e7e2d6', '#a9cae4'], out: ['XL'] },
    { id: 'h2', name: 'Reverse Hoodie — Bone', price: 130, tone: 'lilac', sw: ['#e7e2d6', '#c9bfe8', '#a9cae4'], out: ['XS'] },
    { id: 'h3', name: 'Reverse Hoodie — Sky', price: 130, tone: 'lilac', sw: ['#a9cae4', '#c9bfe8', '#e7e2d6'], out: [] }]

  },
  slippers: {
    name: 'Beach Slides', tone: 'coral', blurb: 'Pillow-foam EVA. The commute-to-couch uniform.',
    sizes: ['US 7', 'US 8', 'US 9', 'US 10', 'US 11'],
    desc: 'A single moulded piece of pillow-soft EVA with a contoured footbed that breaks in to your stride. Featherweight, waterproof, and quietly supportive. Run true to size; size up if you’re between.',
    details: ['One-piece moulded EVA foam', 'Contoured, quick-break-in footbed', 'Waterproof — pool to pavement', 'Unisex US sizing'],
    products: [
    { id: 's1', name: 'Beach Slide — Coral', price: 60, tone: 'coral', sw: ['#ef93a6', '#e9dcc2', '#9fd1bc'], out: ['US 9'] },
    { id: 's2', name: 'Beach Slide — Sand', price: 60, tone: 'coral', sw: ['#e9dcc2', '#ef93a6', '#9fd1bc'], out: ['US 7', 'US 8', 'US 9', 'US 10', 'US 11'], soldOut: true },
    { id: 's3', name: 'Beach Slide — Mint', price: 60, tone: 'coral', sw: ['#9fd1bc', '#ef93a6', '#e9dcc2'], out: ['US 7', 'US 11'] }]

  }
};
const REVIEWS = {
  beanies: [
  { n: 'Maya R.', s: 5, d: 'Verified buyer', t: 'Warmest beanie I own and it hasn’t pilled once. The green is even better in person.' },
  { n: 'Jules P.', s: 4, d: 'Verified buyer', t: 'Great slouch. Runs a touch big at first but settled after a wash like they said.' },
  { n: 'Dev S.', s: 5, d: 'Verified buyer', t: 'Bought one, came back for two more. That’s the whole review.' }],

  hoodies: [
  { n: 'Theo L.', s: 5, d: 'Verified buyer', t: 'The exposed seams look incredible and the weight is unreal. Worth every cent.' },
  { n: 'Priya N.', s: 4, d: 'Verified buyer', t: 'Boxy as promised — I sized down to M and it’s perfect. Lilac is spot on.' },
  { n: 'Sam K.', s: 5, d: 'Verified buyer', t: 'Hasn’t left my back in three weeks. Zero shrinkage after washing.' }],

  slippers: [
  { n: 'Noa W.', s: 5, d: 'Verified buyer', t: 'Like walking on a cloud. Wore them straight off the beach to dinner.' },
  { n: 'Ari M.', s: 4, d: 'Verified buyer', t: 'So light. I’m between sizes and sized up — good call.' },
  { n: 'Lena F.', s: 5, d: 'Verified buyer', t: 'Third summer in mine and they still bounce back. Coral never fades.' }]

};
const SIZE_GUIDE = {
  beanies: { cols: ['Size', 'Circumference', 'Best for'], rows: [['One size', '52–60 cm', 'Most adults — knit stretches to fit']] },
  hoodies: { cols: ['Size', 'Chest (in)', 'Length (in)'], rows: [['XS', '40', '26'], ['S', '43', '27'], ['M', '46', '28'], ['L', '49', '29'], ['XL', '52', '30']] },
  slippers: { cols: ['US', 'EU', 'Foot length (cm)'], rows: [['7', '40', '25.0'], ['8', '41', '25.8'], ['9', '42', '26.7'], ['10', '43', '27.5'], ['11', '44', '28.3']] }
};
function Stars({ s, size }) {
  return <span className="stars" style={size ? { fontSize: size } : null}>{'★★★★★'.slice(0, s)}<span className="dim">{'★★★★★'.slice(s)}</span></span>;
}
const POLICIES = {
  privacy: { title: 'Privacy policy', body: [
    ['What we collect', 'We collect only what we need to fulfil an order and improve the store: your name, shipping address, email, and order history. Payment details are handled by our processor and never touch our servers.'],
    ['How we use it', 'To ship your order, send order updates, and — only if you opt in — the occasional drop announcement. We never sell your data.'],
    ['Your controls', 'Email us any time to export or delete your data. Marketing emails always carry a one-click unsubscribe.']]
  },
  returns: { title: 'Returns & exchange', body: [
    ['30-day window', 'Unworn pieces with tags can be returned or exchanged within 30 days of delivery for a full refund to the original payment method.'],
    ['How to start', 'Use the order link in your confirmation email to print a prepaid label. Drop it at any carrier point.'],
    ['Final sale', 'Wallpapers and gift cards are non-refundable. Beach Slides marked “last call” are final sale.']]
  },
  terms: { title: 'Terms & conditions', body: [
    ['Using this store', 'By placing an order you confirm the details are accurate and you’re authorised to use the payment method. Prices are shown in your selected currency and may change without notice.'],
    ['Orders', 'We may cancel or limit orders that look fraudulent or exceed reasonable quantities. You’ll be refunded in full if we do.'],
    ['IP', 'All artwork, wallpapers, and the SKYLRK wordmark are ours. Personal use only — no resale or reproduction.']]
  },
  accessibility: { title: 'Accessibility', body: [
    ['Our commitment', 'We aim for WCAG 2.1 AA across the store: keyboard-navigable menus, visible focus, and sufficient contrast on text.'],
    ['Ongoing work', 'Accessibility is never “done.” We audit new pages before they ship and welcome reports of anything that trips you up.'],
    ['Reach us', 'Hit a barrier? Email access@skylrk.demo and we’ll prioritise a fix.']]
  }
};
const FAQS = [
['When do new drops go live?', 'Drops land Fridays at 10am ET. Sign in to get a heads-up the night before.'],
['Where do you ship?', 'Canada, US, UK and EU. Duties are calculated at checkout so there are no surprises at the door.'],
['How do the beanies fit?', 'One size, generous slouch. They relax about half a size after the first wash.'],
['Can I change my order?', 'For 60 minutes after ordering — reply to your confirmation email and we’ll sort it.'],
['Are the wallpapers free?', 'Yes. They’re our thank-you. Grab them from the footer any time.']];


/* ---------- HOME ---------- */
function Home({ go }) {
  const tiles = [
  { tone: 'green', label: 'BEANIES', cat: 'beanies' },
  { tone: 'lilac', label: 'REVERSE HOODIES', cat: 'hoodies' },
  { tone: 'coral', label: 'FOOTWEAR', cat: 'slippers' }];

  return (
    <div className="hero">
      <div className="tiles">
        {tiles.map((t, i) =>
        <div className="tile glass" key={i} onClick={() => go('category', t.cat)} style={{ cursor: 'pointer' }}>
            <div className="slot-wrap float">
              <Thumb slotId={'tile-' + t.cat} label="Drop a photo here" />
            </div>
            <div className="tile-label">{t.label}</div>
          </div>
        )}
      </div>
      <div className="hero-cta">
        <div className="caption" style={{ fontWeight: "500", fontSize: "25px" }}>BEYOND THE BASICS</div>
        <button className="btn" onClick={() => go('shop')}>Explore</button>
      </div>
    </div>);

}

/* ---------- SHOP — all products ---------- */
function Shop({ go }) {
  const [filter, setFilter] = useState('all');
  const [tone, setTone] = useState(null);
  const all = Object.entries(CATS).flatMap(([key, c]) => c.products.map((p) => ({ ...p, cat: key, catName: c.name })));
  const shown = filter === 'all' ? all : all.filter((p) => p.cat === filter);
  const chips = [['all', 'All'], ['beanies', 'Beanies'], ['hoodies', 'Reverse Hoodies'], ['slippers', 'Footwear']];
  const toneVar = { green: '--green', lilac: '--lilac', coral: '--coral' };
  const tintBg = tone ?
  `radial-gradient(140% 120% at 50% -8%, color-mix(in oklab, var(${toneVar[tone]}) 50%, var(--sky-top)) 0%, color-mix(in oklab, var(${toneVar[tone]}) 32%, var(--sky-mid)) 46%, var(--sky-bot) 100%)` :
  'none';
  return (
    <div className="wrap">
      {ReactDOM.createPortal(
        <div className="shop-tint" aria-hidden="true" style={{ opacity: tone ? 1 : 0, background: tintBg }}></div>,
        document.body)}
      <PageHead go={go} eyebrow="Shop" title="All products" />
      <div className="quick" style={{ margin: '18px 0 26px' }}>
        {chips.map(([k, t]) =>
        <button key={k} onClick={() => setFilter(k)}
        style={filter === k ? { background: 'rgba(255,255,255,.82)' } : null}>{t}</button>
        )}
      </div>
      <div className="cat-grid">
        {shown.map((p) =>
        <div className={'prod-card glass' + (p.soldOut ? ' is-sold' : '')} key={p.id}
        onMouseEnter={() => setTone(p.tone)} onMouseLeave={() => setTone(null)}
        onClick={() => go('product', p.cat, p.id)}>
            <div className="slot-wrap float">
              <Thumb slotId={'prod-' + p.id} label="Drop a photo" />
              {p.soldOut && <div className="sold-badge">SOLD OUT</div>}
            </div>
            <div className="meta">
              <span className="name">{p.name}</span>
              <span className="price">${p.price}</span>
            </div>
          </div>
        )}
      </div>
    </div>);

}

/* ---------- CATEGORY ---------- */
function Category({ go, cat }) {
  const c = CATS[cat];
  return (
    <div className="wrap">
      <PageHead go={go} eyebrow="Shop" title={c.name} />
      <p style={{ color: 'var(--white)', maxWidth: '56ch', margin: '10px 0 28px', lineHeight: 1.6 }}>{c.blurb}</p>
      <div className="cat-grid">
        {c.products.map((p) =>
        <div className={'prod-card glass' + (p.soldOut ? ' is-sold' : '')} key={p.id} onClick={() => go('product', cat, p.id)}>
            <div className="slot-wrap float">
              <Thumb slotId={'prod-' + p.id} label="Drop a photo" />
              {p.soldOut && <div className="sold-badge">SOLD OUT</div>}
            </div>
            <div className="meta">
              <span className="name">{p.name}</span>
              <span className="price">${p.price}</span>
            </div>
          </div>
        )}
      </div>
    </div>);

}

/* ---------- SIZE GUIDE modal ---------- */
function SizeGuide({ cat, close }) {
  const g = SIZE_GUIDE[cat];
  return (
    <div className="overlay" onMouseDown={close} style={{ alignItems: 'center', paddingTop: 0 }}>
      <div className="modal-card glass" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-top">
          <h2 style={{ margin: 0, fontFamily: "'Outfit',sans-serif", color: 'var(--ink)' }}>Size guide — {CATS[cat].name}</h2>
          <button className="x" onClick={close}>✕</button>
        </div>
        <table className="size-table">
          <thead><tr>{g.cols.map((c, i) => <th key={i}>{c}</th>)}</tr></thead>
          <tbody>{g.rows.map((r, i) => <tr key={i}>{r.map((cell, j) => <td key={j}>{cell}</td>)}</tr>)}</tbody>
        </table>
        <p style={{ color: 'var(--ink-faint)', fontSize: '13px', margin: '14px 0 0' }}>Measurements are approximate. Between sizes? Size up for a relaxed fit.</p>
      </div>
    </div>);

}

/* ---------- PRODUCT detail ---------- */
function Product({ go, cat, id }) {
  const c = CATS[cat];
  const p = c.products.find((x) => x.id === id) || c.products[0];
  const [sw, setSw] = useState(0);
  const [size, setSize] = useState(null);
  const [added, setAdded] = useState(false);
  const wishS = useWish();
  const wished = wishS.has(p.id);
  const [guide, setGuide] = useState(false);
  const [notified, setNotified] = useState(false);
  const [touched, setTouched] = useState(false);

  const reviews = REVIEWS[cat];
  const avg = (reviews.reduce((a, r) => a + r.s, 0) / reviews.length).toFixed(1);
  const sizeOut = size && p.out.includes(size);

  function toReviews() {
    const el = document.getElementById('reviews');
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' });
  }
  function addToBag() {
    if (!size) {setTouched(true);return;}
    Cart.add({ id: p.id, cat, slot: 'prod-' + p.id, name: p.name, price: p.price,
      size, sw, color: p.sw[sw] });
    setAdded(true);setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="wrap">
      <div className="page-head">
        <button className="back" onClick={() => go('category', cat)}>← {c.name}</button>
      </div>

      <div className="pd">
        <div className="big glass float" style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>
          <image-slot id={'prod-' + p.id} shape="rounded" radius="18" placeholder="Drop product photo"
          style={{ width: '100%', height: '100%', display: 'block', resize: 'both', overflow: 'hidden', minHeight: '200px' }}></image-slot>
          {p.soldOut && <div className="sold-badge big-sold">SOLD OUT</div>}
        </div>

        <div className="info">
          <h1>{p.name}</h1>
          <button className="rating-line" onClick={toReviews}>
            <Stars s={Math.round(avg)} /> <span>{avg}</span> · {reviews.length} reviews
          </button>
          <div className="pr">${p.price} <span style={{ fontSize: '13px', fontWeight: 500 }}>incl. duties</span></div>
          <p className="desc">{p.desc}</p>

          <div className="opt-label">Colour</div>
          <div className="swatches">
            {p.sw.map((col, i) =>
            <div key={i} className={'swatch' + (sw === i ? ' sel' : '')} style={{ background: col }} onClick={() => setSw(i)}></div>
            )}
          </div>

          <div className="opt-head">
            <span className="opt-label" style={{ margin: 0 }}>Size</span>
            <button className="link-btn" onClick={() => setGuide(true)}>📐 Size guide</button>
          </div>
          <div className="sizes-row">
            {c.sizes.map((s) => {
              const oos = p.out.includes(s);
              return (
                <button key={s} className={'size-btn' + (size === s ? ' sel' : '') + (oos ? ' out' : '')}
                onClick={() => {setSize(s);setTouched(false);setNotified(false);}}>{s}</button>);

            })}
          </div>
          {touched && !size && <div className="hint">Please select a size.</div>}

          {sizeOut ?
          <div className="notify glass">
              {notified ?
            <div className="sent">You’re on the list — we’ll email when {size} is back.</div> :

            <React.Fragment>
                  <div className="notify-head">⚠ {size} is out of stock</div>
                  <p>Get notified the moment it’s restocked.</p>
                  <form className="notify-form" onSubmit={(e) => {e.preventDefault();setNotified(true);}}>
                    <input type="email" required placeholder="you@email.com" />
                    <button className="btn solid" type="submit">Notify me</button>
                  </form>
                </React.Fragment>
            }
            </div> :

          <div className="row-actions">
              <button className="btn solid" style={{ flex: 1 }} onClick={addToBag}>
                {added ? 'Added ✓' : 'Add to bag'}
              </button>
              <button className={'wish' + (wished ? ' on' : '')} onClick={() => wishS.toggle({ id: p.id, cat, slot: 'prod-' + p.id, name: p.name, price: p.price, color: p.sw[sw] })} aria-label="Wishlist">
                {wished ? '♥' : '♡'}
              </button>
            </div>
          }

          <div className="details">
            <div className="opt-label">Details</div>
            <ul>{c.details.map((d, i) => <li key={i}>{d}</li>)}</ul>
          </div>
        </div>
      </div>

      {/* reviews */}
      <div id="reviews" className="panel glass reviews">
        <div className="rev-summary">
          <div className="rev-avg">{avg}<span>/5</span></div>
          <div>
            <Stars s={Math.round(avg)} size="20px" />
            <div className="rev-count">{reviews.length} verified reviews</div>
          </div>
        </div>
        <div className="rev-list">
          {reviews.map((r, i) =>
          <div className="review" key={i}>
              <div className="rev-top">
                <span className="rev-name">{r.n}</span>
                <Stars s={r.s} />
              </div>
              <div className="rev-tag">{r.d}</div>
              <p>{r.t}</p>
            </div>
          )}
        </div>
      </div>

      {guide && <SizeGuide cat={cat} close={() => setGuide(false)} />}
    </div>);

}

/* ---------- ABOUT / Mission ---------- */
function About({ go }) {
  return (
    <div className="wrap">
      <PageHead go={go} eyebrow="About" title="Our mission" />
      <div className="panel glass" style={{ marginTop: '26px' }}>
        <p style={{ fontSize: '19px', color: 'var(--ink)' }}>Make the basics worth keeping.</p>
        <h2>Why we exist</h2>
        <p>SKYLRK started with one frustration: the everyday pieces you reach for most are usually the worst made. We build the opposite — beanies, hoodies and slides engineered to outlast the trend cycle.</p>
        <h2>How we make it</h2>
        <p>Small runs, real materials, no logos shouting for attention. We’d rather make one beanie you wear for five years than five you forget by spring.</p>
        <h2>What’s next</h2>
        <p>Beyond the basics — the same obsessive fit and finish, applied to the next thing you didn’t know you’d live in.</p>
      </div>
    </div>);

}

/* ---------- POLICY (with sidebar) ---------- */
function Policy({ go, which }) {
  const cur = POLICIES[which] ? which : 'privacy';
  const pol = POLICIES[cur];
  return (
    <div className="wrap">
      <PageHead go={go} eyebrow="Policies" title="Policies" />
      <div className="policy-layout">
        <aside className="policy-nav glass">
          {Object.entries(POLICIES).map(([k, v]) =>
          <button key={k} className={k === cur ? 'active' : ''} onClick={() => go('policy', k)}>
              {v.title}{k === cur ? '' : ' →'}
            </button>
          )}
        </aside>
        <div className="panel glass">
          <h2 style={{ fontSize: '30px', marginTop: 0 }}>{pol.title}</h2>
          {pol.body.map(([h, t], i) =>
          <React.Fragment key={i}><h2>{h}</h2><p>{t}</p></React.Fragment>
          )}
        </div>
      </div>
    </div>);

}

/* ---------- FAQ ---------- */
function FAQ({ go }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="wrap">
      <PageHead go={go} eyebrow="Contact" title="FAQ" />
      <div className="panel glass" style={{ marginTop: '26px' }}>
        {FAQS.map(([q, a], i) =>
        <div className="faq-item" key={i}>
            <button className="faq-q" onClick={() => setOpen((o) => o === i ? -1 : i)}>
              {q}<span className="pm">{open === i ? '–' : '+'}</span>
            </button>
            <div className={'faq-a' + (open === i ? ' open' : '')}><p>{a}</p></div>
          </div>
        )}
        <div style={{ marginTop: '24px' }}>
          <button className="btn solid" onClick={() => go('contact')}>Still stuck? Contact us →</button>
        </div>
      </div>
    </div>);

}

/* ---------- CONTACT form ---------- */
function Contact({ go }) {
  const [sent, setSent] = useState(false);
  return (
    <div className="wrap">
      <PageHead go={go} eyebrow="Contact" title="Get in touch" />
      <div className="contact-help">
        <p className="help-lead">Before you write — these often have the answer:</p>
        <div className="help-links">
          <button className="help-card glass" onClick={() => go('faq')}>
            <span className="help-t">FAQ</span>
            <span className="help-d">Fit, shipping, drops & changing an order</span>
            <span className="help-arr">→</span>
          </button>
          <button className="help-card glass" onClick={() => go('policy', 'returns')}>
            <span className="help-t">Returns &amp; exchange</span>
            <span className="help-d">Our 30-day window and how to start one</span>
            <span className="help-arr">→</span>
          </button>
        </div>
      </div>
      <div className="panel glass" style={{ marginTop: '20px' }}>
        {sent ?
        <div className="sent">Thanks — we’ll reply within one business day.</div> :

        <form className="form-grid" onSubmit={(e) => {e.preventDefault();setSent(true);}}>
            <div className="field"><label>Name</label><input required placeholder="Your name" /></div>
            <div className="field"><label>Email</label><input type="email" required placeholder="you@email.com" /></div>
            <div className="field"><label>Topic</label>
              <select><option>Order help</option><option>Returns</option><option>Wholesale</option><option>Something else</option></select>
            </div>
            <div className="field"><label>Message</label><textarea required placeholder="How can we help?"></textarea></div>
            <button className="btn solid" type="submit" style={{ justifySelf: 'start' }}>Send message</button>
          </form>
        }
      </div>
    </div>);

}

/* ---------- WALLPAPERS ---------- */
function Wallpapers({ go }) {
  const wp = [['green', '01'], ['lilac', '02'], ['coral', '03'], ['green', '04'], ['lilac', '05'], ['coral', '06']];
  return (
    <div className="wrap">
      <PageHead go={go} eyebrow="Free" title="Wallpapers" />
      <p style={{ color: 'var(--white)', margin: '10px 0 26px' }}>Our thank-you. Tap to “download.”</p>
      <div className="cat-grid">
        {wp.map(([tone, n], i) =>
        <div className="prod-card glass" key={i} style={{ cursor: 'pointer' }}>
            <Thumb slotId={'wp-' + n} label={'Drop wallpaper ' + n} ar="9 / 16" />
            <div className="meta"><span className="name">SKYLRK {n}</span><span className="price">↓ free</span></div>
          </div>
        )}
      </div>
    </div>);

}

Object.assign(window, { CATS, POLICIES, FAQS, Home, Shop, Category, Product, About, Policy, FAQ, Contact, Wallpapers });