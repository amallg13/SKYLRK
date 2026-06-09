const { useState, useEffect } = React;

function App() {
  const [route, setRoute] = useState({ name:'home', a:null, b:null });

  function go(name, a, b) {
    setRoute({ name, a:a||null, b:b||null });
    window.scrollTo({ top:0, behavior:'instant' in window ? 'auto' : 'auto' });
  }

  let page;
  switch (route.name) {
    case 'shop':       page = <Shop go={go} />; break;
    case 'category':   page = <Category go={go} cat={route.a} />; break;
    case 'product':    page = <Product go={go} cat={route.a} id={route.b} />; break;
    case 'about':      page = <About go={go} />; break;
    case 'policy':     page = <Policy go={go} which={route.a} />; break;
    case 'faq':        page = <FAQ go={go} />; break;
    case 'contact':    page = <Contact go={go} />; break;
    case 'wallpapers': page = <Wallpapers go={go} />; break;
    case 'cart':       page = <CartPage go={go} />; break;
    case 'checkout':   page = <Checkout go={go} />; break;
    case 'wishlist':   page = <Wishlist go={go} />; break;
    default:           page = <Home go={go} />;
  }

  return (
    <React.Fragment>
      <div className="app">
        <Header go={go} />
        <main>{page}</main>
        <Footer go={go} />
      </div>
      <AccessibilityWidget />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
