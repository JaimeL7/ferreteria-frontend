import { useState } from "react";
import { Icon } from "./Icon.jsx";

export default function ConnectionScreen({ onConnect, busy, error }) {
  const defaultApiUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "" : "http://localhost:3000");
  const [form, setForm] = useState({ baseUrl: defaultApiUrl, username: "", password: "" });
  const update = (key) => (event) => setForm({ ...form, [key]: event.target.value });
  return <main className="login-screen"><div className="login-card">
    <div className="brand-mark large">FC</div><p className="eyebrow">FERRETERÍA CENTRAL</p>
    <h1>Tu negocio, <em>en orden.</em></h1><p className="login-copy">Conecta con la API para gestionar inventario, clientes y ventas.</p>
    <form onSubmit={(event) => { event.preventDefault(); onConnect(form); }} className="login-form">
      <label>Dirección de la API<input value={form.baseUrl} onChange={update("baseUrl")} required /></label>
      <label>Usuario API<input value={form.username} onChange={update("username")} autoComplete="username" required /></label>
      <label>Contraseña API<input type="password" value={form.password} onChange={update("password")} autoComplete="current-password" required /></label>
      {error && <div className="form-error">{error}</div>}
      <button className="button primary full" disabled={busy}>{busy ? "Conectando…" : "Conectar con la API"}<Icon name="arrow" /></button>
    </form>
    <p className="login-foot">Usa las credenciales de <code>BASIC_AUTH_USER</code> y <code>BASIC_AUTH_PASS</code> del backend.</p>
  </div><div className="login-decoration"><span>01 / INVENTARIO</span><div className="deco-grid"><i>⚒</i><b>Todo lo que<br/>necesitas, a mano.</b></div></div></main>;
}
