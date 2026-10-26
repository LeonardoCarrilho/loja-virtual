import { useEffect, useState } from "react";
import { formatBRL } from "../utils/format";

const PAYMENTS = [
  { id: "pix", label: "Pix", hint: "Aprovação imediata" },
  { id: "cartao", label: "Cartão", hint: "Crédito em até 3x" },
  { id: "boleto", label: "Boleto", hint: "Vence em 2 dias" },
];

const INITIAL_FORM = { name: "", email: "", cep: "", payment: "pix" };

function validate(form) {
  const errors = {};

  if (form.name.trim().length < 3) {
    errors.name = "Informe seu nome completo.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = "Informe um e-mail válido.";
  }
  if (!/^\d{5}-?\d{3}$/.test(form.cep.trim())) {
    errors.cep = "Digite um CEP válido (00000-000).";
  }

  return errors;
}

export default function CheckoutModal({ count, total, onClose, onConfirm }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  const update = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    const payment = PAYMENTS.find((item) => item.id === form.payment);
    setOrder({
      code: `NT-${Math.floor(100000 + Math.random() * 900000)}`,
      total,
      count,
      payment: payment.label,
      name: form.name.trim().split(" ")[0],
    });
    onConfirm();
  };

  return (
    <div className="modal-root">
      <button
        type="button"
        className="drawer-overlay"
        aria-label="Fechar checkout"
        onClick={onClose}
      />

      <div
        className="checkout-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
      >
        <button type="button" className="icon-button checkout-close" onClick={onClose} aria-label="Fechar checkout">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        {order ? (
          <div className="checkout-success">
            <span className="success-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <h2 id="checkout-title">Pedido confirmado!</h2>
            <p>
              Obrigado, {order.name}. Seu pedido <strong>{order.code}</strong> foi registrado
              com sucesso.
            </p>
            <dl className="success-summary">
              <div>
                <dt>Itens</dt>
                <dd>{order.count}</dd>
              </div>
              <div>
                <dt>Total</dt>
                <dd>{formatBRL(order.total)}</dd>
              </div>
              <div>
                <dt>Pagamento</dt>
                <dd>{order.payment}</dd>
              </div>
            </dl>
            <p className="demo-note">Demonstração: nenhum pagamento foi processado.</p>
            <button type="button" className="button button-full" onClick={onClose}>
              Voltar à loja
            </button>
          </div>
        ) : (
          <>
            <header className="checkout-head">
              <span className="eyebrow">Checkout</span>
              <h2 id="checkout-title">Finalizar compra</h2>
              <p>
                {count} {count === 1 ? "item" : "itens"} · total {formatBRL(total)}
              </p>
            </header>

            <form className="checkout-form" onSubmit={handleSubmit} noValidate>
              <div className="field">
                <label htmlFor="name">Nome completo</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={update("name")}
                  placeholder="Como devemos chamar você?"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
                {errors.name && <span id="name-error" className="field-error">{errors.name}</span>}
              </div>

              <div className="field-row">
                <div className="field">
                  <label htmlFor="email">E-mail</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={update("email")}
                    placeholder="voce@email.com"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {errors.email && <span id="email-error" className="field-error">{errors.email}</span>}
                </div>

                <div className="field">
                  <label htmlFor="cep">CEP</label>
                  <input
                    id="cep"
                    name="cep"
                    type="text"
                    inputMode="numeric"
                    value={form.cep}
                    onChange={update("cep")}
                    placeholder="00000-000"
                    aria-invalid={Boolean(errors.cep)}
                    aria-describedby={errors.cep ? "cep-error" : undefined}
                  />
                  {errors.cep && <span id="cep-error" className="field-error">{errors.cep}</span>}
                </div>
              </div>

              <fieldset className="payment-field">
                <legend>Forma de pagamento</legend>
                <div className="payment-options">
                  {PAYMENTS.map((option) => (
                    <label
                      key={option.id}
                      className={`payment-option${form.payment === option.id ? " is-selected" : ""}`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={option.id}
                        checked={form.payment === option.id}
                        onChange={update("payment")}
                      />
                      <span>
                        <strong>{option.label}</strong>
                        <small>{option.hint}</small>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <button type="submit" className="button button-full">
                Confirmar pedido · {formatBRL(total)}
              </button>
              <p className="demo-note">
                Checkout de demonstração. Nenhum dado é enviado e nenhuma cobrança é feita.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
