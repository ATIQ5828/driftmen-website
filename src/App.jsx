import React, { useState, useMemo } from "react";
import {
  ShoppingBag, Heart, Menu, X, User, Search, Plus, Minus, Trash2,
  ChevronRight, Package, CheckCircle2, Truck, Clock, LayoutDashboard,
  LogOut, Star, ArrowRight, MapPin, CreditCard, Banknote, Smartphone,
  Shirt, PackageCheck, AlertCircle, Edit3, Eye
} from "lucide-react";

/* ---------------- Design tokens ----------------
  ink #0D0D0C, panel #17171A, line #2C2A24, bone #EDE9DE,
  signal #FF4E1F, moss #545A3F
  Display: Anton (condensed industrial), Body: Inter, Utility: JetBrains Mono
--------------------------------------------------*/

const FONTS = (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');
    .f-display { font-family: 'Anton', Impact, sans-serif; }
    .f-body { font-family: 'Inter', system-ui, sans-serif; }
    .f-mono { font-family: 'JetBrains Mono', monospace; }
  `}</style>
);

const CATEGORIES = ["Jackets", "Hoodies", "Tees", "Cargos", "Accessories"];

const SWATCHES = [
  "from-neutral-800 to-neutral-950",
  "from-orange-900 to-neutral-950",
  "from-stone-700 to-neutral-950",
  "from-zinc-800 to-neutral-950",
  "from-amber-950 to-neutral-950",
  "from-neutral-700 to-stone-950",
];

const PRODUCTS = [
  { id: 1, name: "Skid Track Jacket", category: "Jackets", price: 3450, tag: "New", sizes: ["S","M","L","XL"], swatch: 0, desc: "Water-resistant shell with reflective drift stripe across the back yoke." },
  { id: 2, name: "Asphalt Hoodie", category: "Hoodies", price: 2200, tag: "Best Seller", sizes: ["S","M","L","XL","XXL"], swatch: 1, desc: "Heavyweight 380gsm fleece, garment-dyed for a faded concrete finish." },
  { id: 3, name: "Midnight Run Tee", category: "Tees", price: 950, tag: null, sizes: ["S","M","L","XL"], swatch: 2, desc: "Boxy fit tee in combed cotton, back-print motion graphic." },
  { id: 4, name: "Drift Cargo Pants", category: "Cargos", price: 2650, tag: "New", sizes: ["S","M","L","XL"], swatch: 3, desc: "Tapered utility cargo with double cinch and reinforced knee panels." },
  { id: 5, name: "Signal Bomber", category: "Jackets", price: 4100, tag: "Sale", sizes: ["M","L","XL"], swatch: 4, desc: "Quilted bomber with contrast signal-orange lining." },
  { id: 6, name: "Concrete Beanie", category: "Accessories", price: 550, tag: null, sizes: ["One Size"], swatch: 5, desc: "Ribbed knit beanie with woven drift-line tab." },
  { id: 7, name: "Lowline Hoodie", category: "Hoodies", price: 2350, tag: null, sizes: ["S","M","L","XL"], swatch: 0, desc: "Dropped shoulder hoodie, brushed interior, kangaroo pocket." },
  { id: 8, name: "Streak Cap", category: "Accessories", price: 650, tag: "New", sizes: ["One Size"], swatch: 1, desc: "6-panel cap with embroidered streak motif, curved brim." },
];

function bdt(n) { return "৳" + n.toLocaleString("en-BD"); }

/* ---------------- Small UI atoms ---------------- */

function Tag({ children, tone = "signal" }) {
  const map = {
    signal: "bg-[#FF4E1F] text-[#0D0D0C]",
    moss: "bg-[#545A3F] text-[#EDE9DE]",
    line: "border border-[#3a3830] text-[#a8a396]",
  };
  return (
    <span className={`f-mono text-[10px] tracking-wider uppercase px-2 py-1 ${map[tone]}`}>
      {children}
    </span>
  );
}

function Swatch({ index, className = "" }) {
  return (
    <div className={`relative bg-gradient-to-br ${SWATCHES[index % SWATCHES.length]} flex items-center justify-center overflow-hidden ${className}`}>
      <Shirt className="w-10 h-10 text-[#EDE9DE]/20" strokeWidth={1} />
      <div className="absolute -bottom-4 -left-6 w-40 h-10 bg-[#FF4E1F]/10 rotate-[-8deg] blur-md" />
    </div>
  );
}

function Button({ children, onClick, variant = "primary", className = "", disabled, type = "button" }) {
  const base = "f-mono uppercase text-xs tracking-wider px-5 py-3 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-[#FF4E1F] text-[#0D0D0C] hover:bg-[#ff6a3f] active:translate-y-[1px]",
    dark: "bg-[#EDE9DE] text-[#0D0D0C] hover:bg-white active:translate-y-[1px]",
    outline: "border border-[#3a3830] text-[#EDE9DE] hover:border-[#FF4E1F] hover:text-[#FF4E1F]",
    ghost: "text-[#a8a396] hover:text-[#EDE9DE]",
  };
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}

function Input({ label, ...props }) {
  return (
    <label className="block mb-4">
      {label && <span className="f-mono text-[10px] uppercase tracking-wider text-[#a8a396] block mb-1.5">{label}</span>}
      <input
        {...props}
        className="w-full bg-[#17171A] border border-[#2C2A24] focus:border-[#FF4E1F] outline-none px-3 py-2.5 text-[#EDE9DE] f-body text-sm transition-colors"
      />
    </label>
  );
}

/* ---------------- Header ---------------- */

function Header({ route, setRoute, cartCount, wishlistCount, user, setMobileOpen }) {
  const nav = [
    { key: "home", label: "Home" },
    { key: "shop", label: "Shop" },
    { key: "orders", label: "Orders" },
  ];
  return (
    <header className="sticky top-0 z-40 bg-[#0D0D0C]/95 backdrop-blur border-b border-[#2C2A24]">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <button onClick={() => setRoute("home")} className="f-display text-xl tracking-wide text-[#EDE9DE]">
          DRIFT<span className="text-[#FF4E1F]">MEN</span>
        </button>
        <nav className="hidden md:flex items-center gap-7">
          {nav.map(n => (
            <button
              key={n.key}
              onClick={() => setRoute(n.key)}
              className={`f-mono text-xs uppercase tracking-wider transition-colors ${route === n.key ? "text-[#FF4E1F]" : "text-[#a8a396] hover:text-[#EDE9DE]"}`}
            >
              {n.label}
            </button>
          ))}
          {user?.role === "admin" && (
            <button onClick={() => setRoute("admin")} className={`f-mono text-xs uppercase tracking-wider ${route === "admin" ? "text-[#FF4E1F]" : "text-[#a8a396] hover:text-[#EDE9DE]"}`}>
              Admin
            </button>
          )}
        </nav>
        <div className="flex items-center gap-4">
          <button onClick={() => setRoute("wishlist")} className="relative text-[#a8a396] hover:text-[#EDE9DE]">
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && <span className="absolute -top-2 -right-2 bg-[#FF4E1F] text-[#0D0D0C] f-mono text-[9px] w-4 h-4 rounded-full flex items-center justify-center">{wishlistCount}</span>}
          </button>
          <button onClick={() => setRoute("cart")} className="relative text-[#a8a396] hover:text-[#EDE9DE]">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-[#FF4E1F] text-[#0D0D0C] f-mono text-[9px] w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>}
          </button>
          <button onClick={() => setRoute(user ? "account" : "login")} className="text-[#a8a396] hover:text-[#EDE9DE]">
            <User className="w-5 h-5" />
          </button>
          <button onClick={() => setMobileOpen(true)} className="md:hidden text-[#a8a396]"><Menu className="w-5 h-5" /></button>
        </div>
      </div>
    </header>
  );
}

function MobileNav({ open, onClose, setRoute }) {
  if (!open) return null;
  const items = ["home","shop","cart","wishlist","orders","login"];
  return (
    <div className="fixed inset-0 z-50 bg-[#0D0D0C] flex flex-col">
      <div className="flex justify-end p-5"><button onClick={onClose}><X className="w-6 h-6 text-[#EDE9DE]" /></button></div>
      <div className="flex flex-col gap-1 px-6">
        {items.map(i => (
          <button key={i} onClick={() => { setRoute(i); onClose(); }} className="f-display text-3xl text-left py-3 text-[#EDE9DE] uppercase border-b border-[#2C2A24]">
            {i}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Home ---------------- */

function Home({ setRoute, setSelectedCategory }) {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-[#2C2A24]">
        <div className="absolute top-1/2 -left-20 w-[140%] h-24 bg-gradient-to-r from-transparent via-[#FF4E1F]/25 to-transparent -translate-y-1/2 rotate-[-6deg] blur-sm pointer-events-none" />
        <div className="max-w-6xl mx-auto px-5 py-24 relative">
          <p className="f-mono text-xs uppercase tracking-[0.3em] text-[#FF4E1F] mb-4">Drop 04 — Now Live</p>
          <h1 className="f-display text-[15vw] md:text-8xl leading-[0.85] text-[#EDE9DE] uppercase">
            Born To<br />Drift
          </h1>
          <p className="f-body text-[#a8a396] max-w-md mt-6 mb-8">
            Streetwear built for movement — engineered fabrics, utility cuts, and one line for every piece: leave a mark.
          </p>
          <div className="flex gap-3">
            <Button onClick={() => setRoute("shop")}>Shop The Drop <ArrowRight className="w-3 h-3 inline ml-1" /></Button>
            <Button variant="outline" onClick={() => setRoute("shop")}>View Lookbook</Button>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-10 border-b border-[#2C2A24]">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => { setSelectedCategory(c); setRoute("shop"); }}
              className="f-mono text-xs uppercase tracking-wider whitespace-nowrap px-4 py-2 border border-[#2C2A24] text-[#a8a396] hover:border-[#FF4E1F] hover:text-[#FF4E1F] transition-colors"
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-14">
        <div className="flex items-end justify-between mb-6">
          <h2 className="f-display text-3xl text-[#EDE9DE] uppercase">Fresh Off The Line</h2>
          <button onClick={() => setRoute("shop")} className="f-mono text-xs uppercase text-[#a8a396] hover:text-[#FF4E1F] flex items-center gap-1">
            View all <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {PRODUCTS.slice(0, 4).map(p => (
            <ProductCard key={p.id} product={p} setRoute={setRoute} onSelect={() => {}} />
          ))}
        </div>
      </section>
    </div>
  );
}

/* ---------------- Product Card / Shop / Detail ---------------- */

function ProductCard({ product, onOpen, onToggleWishlist, inWishlist }) {
  return (
    <div className="group cursor-pointer" onClick={() => onOpen && onOpen(product.id)}>
      <div className="relative">
        <Swatch index={product.swatch} className="w-full aspect-[3/4] transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
        {product.tag && <div className="absolute top-2 left-2"><Tag>{product.tag}</Tag></div>}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleWishlist && onToggleWishlist(product.id); }}
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-[#0D0D0C]/60 backdrop-blur"
        >
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-[#FF4E1F] text-[#FF4E1F]" : "text-[#EDE9DE]"}`} />
        </button>
      </div>
      <div className="mt-3">
        <p className="f-body text-sm text-[#EDE9DE]">{product.name}</p>
        <p className="f-mono text-xs text-[#FF4E1F] mt-1">{bdt(product.price)}</p>
      </div>
    </div>
  );
}

function Shop({ selectedCategory, setSelectedCategory, openProduct, wishlist, toggleWishlist }) {
  const filtered = selectedCategory ? PRODUCTS.filter(p => p.category === selectedCategory) : PRODUCTS;
  return (
    <div className="max-w-6xl mx-auto px-5 py-10">
      <h1 className="f-display text-4xl text-[#EDE9DE] uppercase mb-6">Shop</h1>
      <div className="flex gap-2 overflow-x-auto pb-6 mb-6 border-b border-[#2C2A24]">
        <button onClick={() => setSelectedCategory(null)} className={`f-mono text-xs uppercase px-3 py-1.5 ${!selectedCategory ? "text-[#FF4E1F]" : "text-[#a8a396]"}`}>All</button>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setSelectedCategory(c)} className={`f-mono text-xs uppercase px-3 py-1.5 whitespace-nowrap ${selectedCategory === c ? "text-[#FF4E1F]" : "text-[#a8a396] hover:text-[#EDE9DE]"}`}>
            {c}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {filtered.map(p => (
          <ProductCard key={p.id} product={p} onOpen={openProduct} onToggleWishlist={toggleWishlist} inWishlist={wishlist.includes(p.id)} />
        ))}
      </div>
    </div>
  );
}

function ProductDetail({ product, addToCart, toggleWishlist, inWishlist, setRoute }) {
  const [size, setSize] = useState(product.sizes[0]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;
  return (
    <div className="max-w-6xl mx-auto px-5 py-10">
      <button onClick={() => setRoute("shop")} className="f-mono text-xs text-[#a8a396] hover:text-[#EDE9DE] mb-6 flex items-center gap-1">
        ← Back to shop
      </button>
      <div className="grid md:grid-cols-2 gap-10">
        <Swatch index={product.swatch} className="w-full aspect-[3/4]" />
        <div>
          {product.tag && <Tag>{product.tag}</Tag>}
          <h1 className="f-display text-4xl text-[#EDE9DE] uppercase mt-3">{product.name}</h1>
          <p className="f-mono text-xl text-[#FF4E1F] mt-2">{bdt(product.price)}</p>
          <p className="f-body text-sm text-[#a8a396] mt-4 leading-relaxed">{product.desc}</p>

          <div className="mt-8">
            <p className="f-mono text-[10px] uppercase tracking-wider text-[#a8a396] mb-2">Size</p>
            <div className="flex gap-2 flex-wrap">
              {product.sizes.map(s => (
                <button key={s} onClick={() => setSize(s)} className={`f-mono text-xs px-3 py-2 border ${size === s ? "border-[#FF4E1F] text-[#FF4E1F]" : "border-[#2C2A24] text-[#a8a396]"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <p className="f-mono text-[10px] uppercase tracking-wider text-[#a8a396]">Qty</p>
            <div className="flex items-center border border-[#2C2A24]">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="p-2 text-[#a8a396]"><Minus className="w-3 h-3" /></button>
              <span className="f-mono text-sm text-[#EDE9DE] w-8 text-center">{qty}</span>
              <button onClick={() => setQty(q => q + 1)} className="p-2 text-[#a8a396]"><Plus className="w-3 h-3" /></button>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <Button onClick={() => { addToCart(product, size, qty); setAdded(true); setTimeout(() => setAdded(false), 1600); }} className="flex-1">
              {added ? "Added ✓" : "Add to Cart"}
            </Button>
            <Button variant="outline" onClick={() => toggleWishlist(product.id)}>
              <Heart className={`w-4 h-4 ${inWishlist ? "fill-[#FF4E1F] text-[#FF4E1F]" : ""}`} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Cart / Checkout ---------------- */

function Cart({ cart, updateQty, removeFromCart, setRoute }) {
  const items = cart.map(c => ({ ...c, product: PRODUCTS.find(p => p.id === c.productId) }));
  const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);

  if (items.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-5 py-24 text-center">
        <ShoppingBag className="w-10 h-10 text-[#3a3830] mx-auto mb-4" />
        <p className="f-display text-2xl text-[#EDE9DE] uppercase">Your bag is empty</p>
        <p className="f-body text-sm text-[#a8a396] mt-2 mb-6">Nothing here yet. Time to fix that.</p>
        <Button onClick={() => setRoute("shop")}>Shop the drop</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-5 py-10">
      <h1 className="f-display text-4xl text-[#EDE9DE] uppercase mb-8">Your Bag</h1>
      <div className="space-y-4">
        {items.map((item, idx) => (
          <div key={idx} className="flex gap-4 border-b border-[#2C2A24] pb-4">
            <Swatch index={item.product.swatch} className="w-20 h-24 shrink-0" />
            <div className="flex-1">
              <div className="flex justify-between">
                <p className="f-body text-sm text-[#EDE9DE]">{item.product.name}</p>
                <button onClick={() => removeFromCart(idx)} className="text-[#a8a396] hover:text-[#FF4E1F]"><Trash2 className="w-4 h-4" /></button>
              </div>
              <p className="f-mono text-[11px] text-[#a8a396] mt-1">Size {item.size}</p>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center border border-[#2C2A24]">
                  <button onClick={() => updateQty(idx, Math.max(1, item.qty - 1))} className="p-1.5 text-[#a8a396]"><Minus className="w-3 h-3" /></button>
                  <span className="f-mono text-xs text-[#EDE9DE] w-6 text-center">{item.qty}</span>
                  <button onClick={() => updateQty(idx, item.qty + 1)} className="p-1.5 text-[#a8a396]"><Plus className="w-3 h-3" /></button>
                </div>
                <p className="f-mono text-sm text-[#FF4E1F]">{bdt(item.product.price * item.qty)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center mt-8 pt-4">
        <div>
          <p className="f-mono text-[10px] uppercase text-[#a8a396]">Subtotal</p>
          <p className="f-display text-2xl text-[#EDE9DE]">{bdt(subtotal)}</p>
        </div>
        <Button onClick={() => setRoute("checkout")}>Checkout <ArrowRight className="w-3 h-3 inline ml-1" /></Button>
      </div>
    </div>
  );
}

function Checkout({ cart, user, placeOrder, setRoute }) {
  const items = cart.map(c => ({ ...c, product: PRODUCTS.find(p => p.id === c.productId) }));
  const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const shipping = subtotal > 3000 ? 0 : 100;
  const total = subtotal + shipping;

  const [form, setForm] = useState({ name: user?.name || "", phone: "", address: "", city: "" });
  const [payment, setPayment] = useState("cod");
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const canPlace = form.name && form.phone && form.address && form.city;

  return (
    <div className="max-w-5xl mx-auto px-5 py-10">
      <h1 className="f-display text-4xl text-[#EDE9DE] uppercase mb-8">Checkout</h1>
      <div className="grid md:grid-cols-5 gap-10">
        <div className="md:col-span-3">
          <p className="f-mono text-xs uppercase tracking-wider text-[#FF4E1F] mb-4 flex items-center gap-2"><MapPin className="w-3 h-3" /> Shipping details</p>
          <Input label="Full name" value={form.name} onChange={e => set("name", e.target.value)} placeholder="Rahim Uddin" />
          <Input label="Phone number" value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="017XXXXXXXX" />
          <Input label="Address" value={form.address} onChange={e => set("address", e.target.value)} placeholder="House, Road, Area" />
          <Input label="City" value={form.city} onChange={e => set("city", e.target.value)} placeholder="Dhaka" />

          <p className="f-mono text-xs uppercase tracking-wider text-[#FF4E1F] mb-4 mt-8 flex items-center gap-2"><CreditCard className="w-3 h-3" /> Payment method</p>
          <div className="space-y-2">
            {[
              { id: "cod", label: "Cash on Delivery", icon: Banknote },
              { id: "bkash", label: "bKash", icon: Smartphone },
              { id: "card", label: "Credit / Debit Card", icon: CreditCard },
            ].map(m => (
              <button key={m.id} onClick={() => setPayment(m.id)} className={`w-full flex items-center gap-3 px-4 py-3 border text-left ${payment === m.id ? "border-[#FF4E1F] text-[#EDE9DE]" : "border-[#2C2A24] text-[#a8a396]"}`}>
                <m.icon className="w-4 h-4" /> <span className="f-body text-sm">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="border border-[#2C2A24] p-5">
            <p className="f-mono text-xs uppercase tracking-wider text-[#a8a396] mb-4">Order summary</p>
            {items.map((i, idx) => (
              <div key={idx} className="flex justify-between f-body text-xs text-[#a8a396] mb-2">
                <span>{i.product.name} × {i.qty}</span>
                <span className="f-mono">{bdt(i.product.price * i.qty)}</span>
              </div>
            ))}
            <div className="border-t border-[#2C2A24] mt-3 pt-3 space-y-1">
              <div className="flex justify-between f-body text-xs text-[#a8a396]"><span>Subtotal</span><span className="f-mono">{bdt(subtotal)}</span></div>
              <div className="flex justify-between f-body text-xs text-[#a8a396]"><span>Shipping</span><span className="f-mono">{shipping === 0 ? "Free" : bdt(shipping)}</span></div>
              <div className="flex justify-between f-display text-lg text-[#EDE9DE] mt-2"><span>Total</span><span className="text-[#FF4E1F]">{bdt(total)}</span></div>
            </div>
            <Button
              className="w-full mt-5"
              disabled={!canPlace}
              onClick={() => placeOrder({ items, subtotal, shipping, total, address: form, payment })}
            >
              Place Order
            </Button>
            {!canPlace && <p className="f-mono text-[10px] text-[#a8a396] mt-2">Fill in shipping details to continue.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderConfirmation({ order, setRoute }) {
  if (!order) return null;
  return (
    <div className="max-w-lg mx-auto px-5 py-24 text-center">
      <CheckCircle2 className="w-12 h-12 text-[#FF4E1F] mx-auto mb-5" />
      <h1 className="f-display text-3xl text-[#EDE9DE] uppercase">Order placed</h1>
      <p className="f-body text-sm text-[#a8a396] mt-3">
        Order <span className="f-mono text-[#EDE9DE]">#{order.id}</span> confirmed. Paying via {order.payment === "cod" ? "Cash on Delivery" : order.payment}. Total {bdt(order.total)}.
      </p>
      <div className="flex gap-3 justify-center mt-8">
        <Button onClick={() => setRoute("orders")}>Track order</Button>
        <Button variant="outline" onClick={() => setRoute("shop")}>Keep shopping</Button>
      </div>
    </div>
  );
}

/* ---------------- Wishlist / Orders / Auth ---------------- */

function Wishlist({ wishlist, toggleWishlist, addToCart, setRoute }) {
  const items = PRODUCTS.filter(p => wishlist.includes(p.id));
  return (
    <div className="max-w-6xl mx-auto px-5 py-10">
      <h1 className="f-display text-4xl text-[#EDE9DE] uppercase mb-8">Wishlist</h1>
      {items.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="w-10 h-10 text-[#3a3830] mx-auto mb-4" />
          <p className="f-body text-sm text-[#a8a396]">Nothing saved yet.</p>
          <Button className="mt-5" onClick={() => setRoute("shop")}>Browse products</Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {items.map(p => (
            <div key={p.id}>
              <ProductCard product={p} onToggleWishlist={toggleWishlist} inWishlist={true} />
              <Button variant="outline" className="w-full mt-2" onClick={() => addToCart(p, p.sizes[0], 1)}>Add to cart</Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const STATUS_STEPS = ["Processing", "Shipped", "Delivered"];
const STATUS_ICON = { Processing: Clock, Shipped: Truck, Delivered: PackageCheck };

function Orders({ orders, setRoute }) {
  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-5 py-24 text-center">
        <Package className="w-10 h-10 text-[#3a3830] mx-auto mb-4" />
        <p className="f-body text-sm text-[#a8a396]">No orders yet.</p>
        <Button className="mt-5" onClick={() => setRoute("shop")}>Start shopping</Button>
      </div>
    );
  }
  return (
    <div className="max-w-4xl mx-auto px-5 py-10">
      <h1 className="f-display text-4xl text-[#EDE9DE] uppercase mb-8">Order Tracking</h1>
      <div className="space-y-6">
        {orders.map(o => {
          const stepIdx = STATUS_STEPS.indexOf(o.status);
          return (
            <div key={o.id} className="border border-[#2C2A24] p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="f-mono text-xs text-[#EDE9DE]">#{o.id}</p>
                  <p className="f-mono text-[10px] text-[#a8a396] mt-1">{o.date}</p>
                </div>
                <p className="f-mono text-sm text-[#FF4E1F]">{bdt(o.total)}</p>
              </div>
              <div className="flex items-center gap-2 mt-5">
                {STATUS_STEPS.map((s, i) => {
                  const Icon = STATUS_ICON[s];
                  const active = i <= stepIdx;
                  return (
                    <React.Fragment key={s}>
                      <div className="flex flex-col items-center gap-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${active ? "bg-[#FF4E1F] text-[#0D0D0C]" : "bg-[#1A1A1A] text-[#3a3830]"}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className={`f-mono text-[9px] uppercase ${active ? "text-[#EDE9DE]" : "text-[#3a3830]"}`}>{s}</span>
                      </div>
                      {i < STATUS_STEPS.length - 1 && <div className={`flex-1 h-[2px] ${i < stepIdx ? "bg-[#FF4E1F]" : "bg-[#1A1A1A]"}`} />}
                    </React.Fragment>
                  );
                })}
              </div>
              <div className="mt-4 pt-4 border-t border-[#2C2A24] space-y-1">
                {o.items.map((i, idx) => (
                  <div key={idx} className="flex justify-between f-body text-xs text-[#a8a396]">
                    <span>{i.product.name} ({i.size}) × {i.qty}</span>
                    <span className="f-mono">{bdt(i.product.price * i.qty)}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Login({ onLogin, setRoute }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = () => {
    if (!email || !password) { setError("Enter email and password."); return; }
    const role = email.trim().toLowerCase() === "admin@driftmen.com" ? "admin" : "customer";
    onLogin({ name: role === "admin" ? "Admin" : email.split("@")[0], email, role });
    setRoute(role === "admin" ? "admin" : "home");
  };

  return (
    <div className="max-w-sm mx-auto px-5 py-24">
      <h1 className="f-display text-3xl text-[#EDE9DE] uppercase mb-2">Log In</h1>
      <p className="f-body text-xs text-[#a8a396] mb-6">Demo auth — try admin@driftmen.com for the admin panel.</p>
      <Input label="Email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" />
      <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
      {error && <p className="f-mono text-[11px] text-[#FF4E1F] mb-3 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {error}</p>}
      <Button className="w-full mt-2" onClick={submit}>Log In</Button>
      <p className="f-body text-xs text-[#a8a396] mt-5 text-center">
        No account? <button onClick={() => setRoute("signup")} className="text-[#FF4E1F]">Sign up</button>
      </p>
    </div>
  );
}

function Signup({ onLogin, setRoute }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const canSubmit = form.name && form.email && form.password;
  return (
    <div className="max-w-sm mx-auto px-5 py-24">
      <h1 className="f-display text-3xl text-[#EDE9DE] uppercase mb-6">Create Account</h1>
      <Input label="Full name" value={form.name} onChange={e => set("name", e.target.value)} />
      <Input label="Email" value={form.email} onChange={e => set("email", e.target.value)} />
      <Input label="Password" type="password" value={form.password} onChange={e => set("password", e.target.value)} />
      <Button className="w-full mt-2" disabled={!canSubmit} onClick={() => { onLogin({ ...form, role: "customer" }); setRoute("home"); }}>
        Sign Up
      </Button>
      <p className="f-body text-xs text-[#a8a396] mt-5 text-center">
        Already have an account? <button onClick={() => setRoute("login")} className="text-[#FF4E1F]">Log in</button>
      </p>
    </div>
  );
}

function Account({ user, onLogout, setRoute }) {
  return (
    <div className="max-w-sm mx-auto px-5 py-24 text-center">
      <div className="w-16 h-16 rounded-full bg-[#1A1A1A] border border-[#2C2A24] flex items-center justify-center mx-auto mb-4">
        <User className="w-6 h-6 text-[#a8a396]" />
      </div>
      <h1 className="f-display text-2xl text-[#EDE9DE] uppercase">{user.name}</h1>
      <p className="f-body text-xs text-[#a8a396] mt-1">{user.email}</p>
      <Tag tone="moss">{user.role}</Tag>
      <div className="flex flex-col gap-2 mt-8">
        <Button variant="outline" onClick={() => setRoute("orders")}>My Orders</Button>
        <Button variant="outline" onClick={() => setRoute("wishlist")}>My Wishlist</Button>
        {user.role === "admin" && <Button variant="outline" onClick={() => setRoute("admin")}>Admin Panel</Button>}
        <Button variant="ghost" onClick={() => { onLogout(); setRoute("home"); }}><LogOut className="w-3 h-3 inline mr-1" /> Log out</Button>
      </div>
    </div>
  );
}

/* ---------------- Admin ---------------- */

function Admin({ products, setProducts, orders, updateOrderStatus }) {
  const [tab, setTab] = useState("dashboard");
  const [editing, setEditing] = useState(null);

  const revenue = orders.reduce((s, o) => s + o.total, 0);

  return (
    <div className="max-w-6xl mx-auto px-5 py-10">
      <h1 className="f-display text-4xl text-[#EDE9DE] uppercase mb-2 flex items-center gap-2"><LayoutDashboard className="w-6 h-6 text-[#FF4E1F]" /> Admin</h1>
      <div className="flex gap-2 border-b border-[#2C2A24] mb-8 mt-6">
        {["dashboard", "products", "orders"].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`f-mono text-xs uppercase px-4 py-3 ${tab === t ? "text-[#FF4E1F] border-b-2 border-[#FF4E1F]" : "text-[#a8a396]"}`}>{t}</button>
        ))}
      </div>

      {tab === "dashboard" && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Revenue", value: bdt(revenue) },
            { label: "Orders", value: orders.length },
            { label: "Products", value: products.length },
            { label: "Pending", value: orders.filter(o => o.status === "Processing").length },
          ].map(s => (
            <div key={s.label} className="border border-[#2C2A24] p-5">
              <p className="f-mono text-[10px] uppercase text-[#a8a396]">{s.label}</p>
              <p className="f-display text-2xl text-[#EDE9DE] mt-1">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "products" && (
        <div>
          <Button className="mb-5" onClick={() => setEditing({ id: Date.now(), name: "", category: CATEGORIES[0], price: 0, sizes: ["S","M","L"], swatch: 0, desc: "", tag: null })}>
            <Plus className="w-3 h-3 inline mr-1" /> Add product
          </Button>
          {editing && (
            <div className="border border-[#FF4E1F] p-5 mb-6">
              <Input label="Name" value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} />
              <Input label="Price (৳)" type="number" value={editing.price} onChange={e => setEditing({ ...editing, price: Number(e.target.value) })} />
              <Input label="Description" value={editing.desc} onChange={e => setEditing({ ...editing, desc: e.target.value })} />
              <div className="flex gap-2">
                <Button onClick={() => {
                  setProducts(prev => {
                    const exists = prev.find(p => p.id === editing.id);
                    return exists ? prev.map(p => p.id === editing.id ? editing : p) : [...prev, editing];
                  });
                  setEditing(null);
                }}>Save</Button>
                <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
              </div>
            </div>
          )}
          <div className="space-y-2">
            {products.map(p => (
              <div key={p.id} className="flex items-center justify-between border border-[#2C2A24] px-4 py-3">
                <div className="flex items-center gap-3">
                  <Swatch index={p.swatch} className="w-10 h-12" />
                  <div>
                    <p className="f-body text-sm text-[#EDE9DE]">{p.name}</p>
                    <p className="f-mono text-[11px] text-[#a8a396]">{p.category} · {bdt(p.price)}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setEditing(p)} className="text-[#a8a396] hover:text-[#FF4E1F]"><Edit3 className="w-4 h-4" /></button>
                  <button onClick={() => setProducts(prev => prev.filter(x => x.id !== p.id))} className="text-[#a8a396] hover:text-[#FF4E1F]"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "orders" && (
        <div className="space-y-3">
          {orders.length === 0 && <p className="f-body text-sm text-[#a8a396]">No orders placed yet.</p>}
          {orders.map(o => (
            <div key={o.id} className="border border-[#2C2A24] p-4 flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="f-mono text-xs text-[#EDE9DE]">#{o.id} — {o.address?.name}</p>
                <p className="f-mono text-[10px] text-[#a8a396]">{o.date} · {bdt(o.total)}</p>
              </div>
              <select
                value={o.status}
                onChange={e => updateOrderStatus(o.id, e.target.value)}
                className="f-mono text-xs bg-[#17171A] border border-[#2C2A24] text-[#EDE9DE] px-3 py-2"
              >
                {STATUS_STEPS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- Footer ---------------- */

function Footer() {
  return (
    <footer className="border-t border-[#2C2A24] mt-20">
      <div className="max-w-6xl mx-auto px-5 py-10 flex flex-col md:flex-row justify-between gap-4">
        <p className="f-display text-lg text-[#EDE9DE] uppercase">DRIFT<span className="text-[#FF4E1F]">MEN</span></p>
        <p className="f-mono text-[10px] text-[#a8a396] uppercase tracking-wider">Demo storefront · Dhaka, Bangladesh</p>
      </div>
    </footer>
  );
}

/* ---------------- App ---------------- */

export default function App() {
  const [route, setRoute] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const [products, setProducts] = useState(PRODUCTS);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [lastOrder, setLastOrder] = useState(null);

  const addToCart = (product, size, qty) => {
    setCart(prev => {
      const idx = prev.findIndex(c => c.productId === product.id && c.size === size);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + qty };
        return next;
      }
      return [...prev, { productId: product.id, size, qty }];
    });
  };
  const updateQty = (idx, qty) => setCart(prev => prev.map((c, i) => i === idx ? { ...c, qty } : c));
  const removeFromCart = (idx) => setCart(prev => prev.filter((_, i) => i !== idx));

  const toggleWishlist = (productId) => setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);

  const placeOrder = ({ items, total, address, payment }) => {
    const order = { id: String(Date.now()).slice(-6), items, total, address, payment, status: "Processing", date: new Date().toLocaleDateString("en-GB") };
    setOrders(prev => [order, ...prev]);
    setLastOrder(order);
    setCart([]);
    setRoute("confirmation");
  };

  const updateOrderStatus = (id, status) => setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));

  const cartCount = cart.reduce((s, c) => s + c.qty, 0);
  const selectedProduct = useMemo(() => products.find(p => p.id === selectedProductId), [selectedProductId, products]);

  const openProduct = (id) => { setSelectedProductId(id); setRoute("product"); };

  return (
    <div className="min-h-screen bg-[#0D0D0C] f-body">
      {FONTS}
      <Header route={route} setRoute={setRoute} cartCount={cartCount} wishlistCount={wishlist.length} user={user} setMobileOpen={setMobileOpen} />
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} setRoute={setRoute} />

      {route === "home" && <Home setRoute={setRoute} setSelectedCategory={setSelectedCategory} />}
      {route === "shop" && (
        <Shop
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          openProduct={openProduct}
          wishlist={wishlist}
          toggleWishlist={toggleWishlist}
        />
      )}
      {route === "product" && selectedProduct && (
        <ProductDetail product={selectedProduct} addToCart={addToCart} toggleWishlist={toggleWishlist} inWishlist={wishlist.includes(selectedProduct.id)} setRoute={setRoute} />
      )}
      {route === "cart" && <Cart cart={cart} updateQty={updateQty} removeFromCart={removeFromCart} setRoute={setRoute} />}
      {route === "checkout" && <Checkout cart={cart} user={user} placeOrder={placeOrder} setRoute={setRoute} />}
      {route === "confirmation" && <OrderConfirmation order={lastOrder} setRoute={setRoute} />}
      {route === "wishlist" && <Wishlist wishlist={wishlist} toggleWishlist={toggleWishlist} addToCart={addToCart} setRoute={setRoute} />}
      {route === "orders" && <Orders orders={orders} setRoute={setRoute} />}
      {route === "login" && <Login onLogin={setUser} setRoute={setRoute} />}
      {route === "signup" && <Signup onLogin={setUser} setRoute={setRoute} />}
      {route === "account" && user && <Account user={user} onLogout={() => setUser(null)} setRoute={setRoute} />}
      {route === "admin" && user?.role === "admin" && (
        <Admin products={products} setProducts={setProducts} orders={orders} updateOrderStatus={updateOrderStatus} />
      )}
      {route === "admin" && user?.role !== "admin" && (
        <div className="max-w-md mx-auto px-5 py-24 text-center">
          <p className="f-body text-sm text-[#a8a396]">Admin access only. Log in as admin@driftmen.com to view this panel.</p>
          <Button className="mt-5" onClick={() => setRoute("login")}>Go to login</Button>
        </div>
      )}

      <Footer />
    </div>
  );
}
