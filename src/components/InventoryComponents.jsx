import { useState } from "react";
import { Icon } from "./Icon.jsx";
import { date, initials, money } from "../utils/formatters.js";

export function Stat({ label, value, icon, tint, note }) {
  return <article className="stat-card"><div className={`stat-icon ${tint}`}><Icon name={icon} size={20}/></div><span className="stat-note">{note}</span><p>{label}</p><strong>{value}</strong></article>;
}

export function ProductTable({ products, compact = false, onOpen, onEdit, onDeactivate }) {
  if (!products.length) return <Empty icon="box" title="Aún no hay productos" text="Agrega productos para verlos en tu inventario." />;
  return <div className="table-wrap"><table><thead><tr><th>PRODUCTO</th><th>SKU</th><th>PRECIO</th><th>STOCK</th><th>ESTADO</th>{onEdit && <th>ACCIONES</th>}</tr></thead><tbody>{products.map((p) => <tr key={p._id} onClick={onOpen} className={onOpen ? "click-row" : ""}><td><div className="item-cell"><span className="product-mini">{initials(p.nombre)}</span><div><b>{p.nombre}</b><small>{p.descripcion || "Producto ferretero"}</small></div></div></td><td className="mono">{p.sku}</td><td className="price">{money(p.precio)}</td><td><span className={`stock-pill ${p.stock <= 5 ? "low" : ""}`}>{p.stock} unid.</span></td><td><span className={`status ${p.activo === false ? "inactive" : "active"}`}><i/>{p.activo === false ? "Inactivo" : "Activo"}</span></td>{onEdit && <td><div className="row-actions"><button onClick={(e) => { e.stopPropagation(); onEdit(p); }}>Editar</button>{p.activo !== false && <button className="danger-link" onClick={(e) => { e.stopPropagation(); onDeactivate(p); }}>Desactivar</button>}</div></td>}</tr>)}</tbody></table>{compact && <div className="table-footer">Mostrando {products.length} productos</div>}</div>;
}

export function CustomerTable({ customers, onEdit, onDeactivate }) {
  if (!customers.length) return <Empty icon="users" title="Aún no hay clientes" text="Registra tus clientes para asociarlos a las ventas." />;
  return <div className="table-wrap"><table><thead><tr><th>CLIENTE</th><th>DOCUMENTO</th><th>CORREO</th><th>TELÉFONO</th><th>ESTADO</th><th>ACCIONES</th></tr></thead><tbody>{customers.map((c) => <tr key={c._id}><td><div className="item-cell"><span className="customer-avatar">{initials(c.nombre)}</span><div><b>{c.nombre}</b><small>Registrado {date(c.createdAt)}</small></div></div></td><td className="mono">{c.documento}</td><td>{c.correo || "—"}</td><td>{c.telefono || "—"}</td><td><span className={`status ${c.activo === false ? "inactive" : "active"}`}><i/>{c.activo === false ? "Inactivo" : "Activo"}</span></td><td><div className="row-actions"><button onClick={() => onEdit(c)}>Editar</button>{c.activo !== false && <button className="danger-link" onClick={() => onDeactivate(c)}>Desactivar</button>}</div></td></tr>)}</tbody></table></div>;
}

export function SalesTable({ sales, customers }) {
  if (!sales.length) return <Empty icon="receipt" title="Todavía no hay ventas" text="Cuando registres una venta, aparecerá aquí." />;
  const customerName = (id) => customers.find((c) => c._id === id)?.nombre || `Cliente ${String(id).slice(-6)}`;
  return <div className="table-wrap"><table><thead><tr><th>VENTA</th><th>CLIENTE</th><th>FECHA</th><th>ARTÍCULOS</th><th>TOTAL</th></tr></thead><tbody>{sales.map((s) => <tr key={s._id}><td className="mono">#{String(s._id).slice(-8).toUpperCase()}</td><td><div className="item-cell"><span className="customer-avatar small">{initials(customerName(s.clienteId))}</span><b>{customerName(s.clienteId)}</b></div></td><td>{date(s.fecha)}</td><td>{s.detalles?.reduce((sum, item) => sum + item.cantidad, 0) || 0} unidades</td><td className="price">{money(s.total)}</td></tr>)}</tbody></table></div>;
}

export function Empty({ icon, title, text }) { return <div className="empty-state"><span><Icon name={icon} size={22}/></span><b>{title}</b><p>{text}</p></div>; }
export function Modal({ title, onClose, error, children }) { return <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}><section className="modal"><div className="modal-head"><div><p className="eyebrow">FERRETERÍA CENTRAL</p><h2>{title}</h2></div><button className="icon-button close-button" onClick={onClose} aria-label="Cerrar">×</button></div>{error && <div className="form-error modal-error">{error}</div>}{children}</section></div>; }

export function ProductForm({ onSubmit, onCancel, initial }) {
  const [form, setForm] = useState({ sku: initial?.sku || "", nombre: initial?.nombre || "", descripcion: initial?.descripcion || "", precio: initial?.precio || "", stock: initial?.stock ?? "" });
  const [busy, setBusy] = useState(false);
  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  return <form className="modal-form" onSubmit={async (e) => { e.preventDefault(); setBusy(true); const data = { ...form, stock: Number(form.stock) }; if (!data.descripcion.trim()) delete data.descripcion; await onSubmit(data); setBusy(false); }}>
    <label>SKU<input value={form.sku} onChange={update("sku")} placeholder="FER-001" required /></label>
    <label>Nombre<input value={form.nombre} onChange={update("nombre")} placeholder="Nombre del producto" required /></label>
    <label className="wide">Descripción<input value={form.descripcion} onChange={update("descripcion")} placeholder="Descripción breve" /></label>
    <label>Precio (COP)<input type="number" min="0" step="0.01" value={form.precio} onChange={update("precio")} placeholder="0" required /></label>
    <label>Stock inicial<input type="number" min="0" step="1" value={form.stock} onChange={update("stock")} placeholder="0" required /></label>
    <div className="modal-actions"><button type="button" className="button ghost" onClick={onCancel}>Cancelar</button><button className="button primary" disabled={busy}>{busy ? "Guardando…" : initial ? "Guardar cambios" : "Guardar producto"}</button></div>
  </form>;
}

export function CustomerForm({ onSubmit, onCancel, initial }) {
  const [form, setForm] = useState({ nombre: initial?.nombre || "", documento: initial?.documento || "", correo: initial?.correo || "", telefono: initial?.telefono || "" });
  const [busy, setBusy] = useState(false);
  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  return <form className="modal-form" onSubmit={async (e) => { e.preventDefault(); setBusy(true); const data = Object.fromEntries(Object.entries(form).filter(([key, value]) => ["nombre", "documento"].includes(key) || value.trim())); await onSubmit(data); setBusy(false); }}>
    <label>Nombre completo<input value={form.nombre} onChange={update("nombre")} placeholder="Nombre del cliente" required /></label>
    <label>Documento<input value={form.documento} onChange={update("documento")} placeholder="Número de documento" required /></label>
    <label>Correo electrónico<input type="email" value={form.correo} onChange={update("correo")} placeholder="cliente@correo.com" /></label>
    <label>Teléfono<input value={form.telefono} onChange={update("telefono")} placeholder="300 000 0000" /></label>
    <div className="modal-actions"><button type="button" className="button ghost" onClick={onCancel}>Cancelar</button><button className="button primary" disabled={busy}>{busy ? "Guardando…" : initial ? "Guardar cambios" : "Guardar cliente"}</button></div>
  </form>;
}

export function SaleForm({ products, customers, onSubmit, onCancel }) {
  const [clienteId, setClienteId] = useState("");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [busy, setBusy] = useState(false);
  const total = cart.reduce((sum, item) => sum + Number(item.product.precio) * item.quantity, 0);
  const filteredProducts = products.filter((product) =>
    `${product.nombre} ${product.sku}`.toLowerCase().includes(search.trim().toLowerCase()),
  );

  const addProduct = (product) => {
    setCart((current) => {
      const existing = current.find((item) => item.product._id === product._id);
      if (existing) return current.map((item) => item.product._id === product._id
        ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
        : item);
      return [...current, { product, quantity: 1 }];
    });
  };

  const changeQuantity = (productId, quantity) => {
    const product = products.find((item) => item._id === productId);
    if (!product) return;
    setCart((current) => current.map((item) => item.product._id === productId
      ? { ...item, quantity: Math.max(1, Math.min(quantity, product.stock)) }
      : item));
  };

  const submitSale = async (event) => {
    event.preventDefault();
    setBusy(true);
    try {
      await onSubmit({ clienteId, detalles: cart.map(({ product, quantity }) => ({ productoId: product._id, cantidad: quantity })) });
    } finally {
      setBusy(false);
    }
  };

  return <form className="sale-workspace" onSubmit={submitSale}>
    <section className="sale-catalog" aria-label="Catálogo de productos">
      <div className="sale-catalog-heading"><div><p className="eyebrow">INVENTARIO DISPONIBLE</p><h3>Selecciona productos</h3></div><span>{filteredProducts.length} artículos</span></div>
      <label className="sale-search" htmlFor="sale-search-input"><Icon name="search" size={17} /><input id="sale-search-input" autoComplete="off" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nombre o SKU..." /></label>
      {!products.length ? <div className="sale-catalog-empty">No hay productos activos con stock disponible.</div> : !filteredProducts.length ? <div className="sale-catalog-empty">No encontramos productos con “{search}”.</div> : <div className="sale-product-grid">
        {filteredProducts.map((product) => {
          const quantityInCart = cart.find((item) => item.product._id === product._id)?.quantity || 0;
          const available = Math.max(0, product.stock - quantityInCart);
          return <article className="sale-product-card" key={product._id}>
            <div className="sale-product-card-top"><span className="sale-product-icon"><Icon name="box" size={19} /></span><span className={`sale-stock ${product.stock <= 5 ? "low" : ""}`}>{product.stock} en inventario</span></div>
            <div className="sale-product-card-info"><h4>{product.nombre}</h4><span className="sale-product-sku">SKU {product.sku}</span><strong>{money(product.precio)}</strong></div>
            <button type="button" className="sale-product-add" onClick={() => addProduct(product)} disabled={available <= 0}>
              <Icon name="plus" size={15} /> {available <= 0 ? "Stock en carrito" : quantityInCart ? `Agregar otro · ${available} disponibles` : "Agregar al carrito"}
            </button>
          </article>;
        })}
      </div>}
    </section>

    <aside className="sale-cart-panel" aria-label="Resumen de la venta">
      <div className="sale-cart-heading"><div><b>Resumen de venta</b><span>{cart.reduce((sum, item) => sum + item.quantity, 0)} unidades</span></div><span className="sale-cart-badge">{cart.length}</span></div>
      <label className="sale-customer-field">Cliente<select required value={clienteId} onChange={(event) => setClienteId(event.target.value)}><option value="">Selecciona un cliente</option>{customers.map((customer) => <option key={customer._id} value={customer._id}>{customer.nombre} · {customer.documento}</option>)}</select></label>
      {!cart.length ? <div className="sale-cart-empty"><span><Icon name="box" size={23} /></span><b>Tu carrito está vacío</b><p>Agrega productos del catálogo para preparar la venta.</p></div> : <div className="sale-cart-items">
        {cart.map(({ product, quantity }) => <article className="sale-cart-item" key={product._id}>
          <div className="sale-item-info"><b>{product.nombre}</b><small>{money(product.precio)} c/u</small></div>
          <div className="sale-item-quantity" aria-label={`Cantidad de ${product.nombre}`}>
            <button type="button" onClick={() => changeQuantity(product._id, quantity - 1)} aria-label={`Quitar una unidad de ${product.nombre}`} disabled={quantity <= 1}>−</button>
            <span>{quantity}</span>
            <button type="button" onClick={() => changeQuantity(product._id, quantity + 1)} aria-label={`Agregar una unidad de ${product.nombre}`} disabled={quantity >= product.stock}>+</button>
          </div>
          <strong className="sale-item-subtotal">{money(Number(product.precio) * quantity)}</strong>
          <button type="button" className="sale-item-remove" onClick={() => setCart((current) => current.filter((item) => item.product._id !== product._id))} aria-label={`Quitar ${product.nombre} del carrito`}>×</button>
        </article>)}
      </div>}
      {!customers.length && <div className="form-hint">Registra primero un cliente para crear una venta.</div>}
      <div className="sale-total"><span>Total estimado</span><strong>{money(total)}</strong></div>
      <div className="sale-cart-actions"><button type="button" className="button ghost" onClick={onCancel}>Cancelar</button><button className="button primary" disabled={busy || !customers.length || !cart.length}>{busy ? "Registrando…" : "Finalizar venta"}</button></div>
    </aside>
  </form>;
}
