"use client"

import "./contact-section.css"
import {
  useEffect,
  useRef,
  useState,
  type AnimationEvent,
  type CSSProperties,
  type FormEvent,
  type PointerEvent,
} from "react"
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  MessageCircle,
  Tv,
  Microwave,
  Navigation,
  Send,
} from "lucide-react"

/* ═══════════════════════════════════════════
   DADOS (edite aqui)
═══════════════════════════════════════════ */
const WHATSAPP_NUMBER = "5583988692960" // 55 + DDD + 9 + número
const PHONE_FIXO_HREF = "tel:+558332472703"
const ADDRESS_1 = "Av. Monteiro da Franca, 516 A - Manaíra"
const ADDRESS_2 = "João Pessoa - PB, 58038-151"
const FULL_ADDRESS = `${ADDRESS_1}, ${ADDRESS_2}`
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(FULL_ADDRESS)}`
const ROUTE_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(FULL_ADDRESS)}`
const MAP_EMBED =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.1380812991256!2d-34.83331078945882!3d-7.109992292863869!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7acdd3d18b2ee67%3A0x1f361a32372fee05!2sEletr%C3%B4nica%20Joana%20Dark!5e0!3m2!1spt-BR!2sbr!4v1768236633051!5m2!1spt-BR!2sbr"

/** Horários (minutos desde 00:00). O texto exibido abaixo deve bater com estes. */
const TZ = "America/Fortaleza"
const HOURS = {
  weekday: { open: 8 * 60 + 30, close: 17 * 60 }, // Seg–Sex 08:30–17:00
  saturday: { open: 9 * 60, close: 12 * 60 }, // Sáb 09:00–12:00
}

const serviceOptions = [
  { value: "repair-tv", label: "Manutenção de TV", kind: "Reparo", icon: Tv },
  { value: "repair-microwave", label: "Manutenção de Micro-ondas", kind: "Reparo", icon: Microwave },
  { value: "buy-tv", label: "Comprar TV", kind: "Compra", icon: Tv },
  { value: "buy-microwave", label: "Comprar Micro-ondas", kind: "Compra", icon: Microwave },
]

const TOTAL_FIELDS = 6

/* ═══════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════ */

/** (83) 98869-2960 — máscara ao digitar */
function maskPhone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11)
  if (d.length === 0) return ""
  if (d.length <= 2) return `(${d}`
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

/** Aberto agora? Sempre no fuso da loja (não do visitante). */
function isOpenNow() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date())
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? ""
  const wd = get("weekday")
  const t = (Number(get("hour")) % 24) * 60 + Number(get("minute"))
  if (wd === "Sun") return false
  const h = wd === "Sat" ? HOURS.saturday : HOURS.weekday
  return t >= h.open && t < h.close
}

type Line = { text: string; href?: string }
const contactInfo: {
  icon: typeof MapPin
  title: string
  lines: Line[]
  status?: boolean
}[] = [
  {
    icon: MapPin,
    title: "Endereço",
    lines: [
      { text: ADDRESS_1, href: MAPS_URL },
      { text: ADDRESS_2, href: MAPS_URL },
    ],
  },
  {
    icon: Phone,
    title: "Telefone",
    lines: [
      { text: "(83) 98869-2960", href: `https://wa.me/${WHATSAPP_NUMBER}` },
      { text: "(83) 3247-2703", href: PHONE_FIXO_HREF },
    ],
  },
  {
    icon: Mail,
    title: "E-mail",
    lines: [
      { text: "darkgaldino2016@gmail.com", href: "mailto:darkgaldino2016@gmail.com" },
      { text: "eletronicajoanaDark@hotmail.com", href: "mailto:eletronicajoanaDark@hotmail.com" },
    ],
  },
  {
    icon: Clock,
    title: "Horário",
    lines: [{ text: "Seg - Sex: 08:30 às 17h" }, { text: "Sábado: 9h às 12h" }],
    status: true,
  },
]

/* ═══════════════════════════════════════════
   SEÇÃO
═══════════════════════════════════════════ */
export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const [seen, setSeen] = useState(false)
  const [live, setLive] = useState(false)
  const [open, setOpen] = useState<boolean | null>(null) // null = ainda não calculado (evita mismatch)
  const [progress, setProgress] = useState(0)
  const [mapOn, setMapOn] = useState(false)
  const [sentUrl, setSentUrl] = useState<string | null>(null)

  /* visibilidade: entrada (1x) + pausa animações fora da tela */
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        setLive(e.isIntersecting)
        if (e.isIntersecting) setSeen(true)
      },
      { threshold: 0.1 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  /* status "aberto agora": só no cliente, atualiza a cada minuto */
  useEffect(() => {
    const tick = () => setOpen(isOpenNow())
    tick()
    const id = setInterval(tick, 60_000)
    return () => clearInterval(id)
  }, [])

  /* medidor de preenchimento */
  const updateProgress = () => {
    const f = formRef.current
    if (!f) return
    const fd = new FormData(f)
    const str = (k: string) => String(fd.get(k) ?? "").trim()
    const email = f.elements.namedItem("email") as HTMLInputElement | null
    let n = 0
    if (str("name").length >= 2) n++
    if (str("phone").replace(/\D/g, "").length >= 10) n++
    if (str("email") && email?.validity.valid) n++
    if (str("service")) n++
    if (str("device").length >= 2) n++
    if (str("problem").length >= 5) n++
    setProgress(n)
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const v = (k: string) => String(fd.get(k) ?? "").trim()
    const service = serviceOptions.find((o) => o.value === v("service"))?.label ?? "Não informado"

    const message = [
      "*Nova Solicitação de Orçamento*",
      "----------------------------------",
      `*Nome:* ${v("name")}`,
      `*Telefone:* ${v("phone")}`,
      `*E-mail:* ${v("email")}`,
      `*Serviço:* ${service}`,
      `*Aparelho:* ${v("device")}`,
      `*Necessidade:* ${v("problem")}`,
      "----------------------------------",
    ].join("\n")

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    window.open(url, "_blank", "noopener,noreferrer")
    setSentUrl(url)
  }

  const resetForm = () => {
    setSentUrl(null)
    setProgress(0)
  }

  const onPhoneInput = (e: FormEvent<HTMLInputElement>) => {
    e.currentTarget.value = maskPhone(e.currentTarget.value)
  }

  /* brilho sólido que segue o mouse nos cards (sem gradiente: só realça a borda) */
  const spot = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    el.style.setProperty("--mx", `${e.clientX - r.left}px`)
    el.style.setProperty("--my", `${e.clientY - r.top}px`)
  }

  const onCountdownEnd = (e: AnimationEvent<HTMLElement>) => {
    if (e.target === e.currentTarget) resetForm()
  }

  const d = (n: number) => ({ "--d": n }) as CSSProperties

  return (
    <section
      id="contato"
      ref={sectionRef}
      className="ct"
      data-seen={seen}
      data-live={live}
      aria-labelledby="ct-heading"
    >
      <div className="ct-wrap">
        <div className="ct-grid">
          {/* ───────── ESQUERDA: informações ───────── */}
          <div>
            <p className="ct-eyebrow ct-rv" style={d(0)}>
              <span className="ct-dot" aria-hidden="true" /> Entre em Contato
            </p>
            <h2 id="ct-heading" className="ct-title ct-rv" style={d(1)}>
              Estamos prontos para <em>ajudar</em>
            </h2>
            <p className="ct-lead ct-rv" style={d(2)}>
              Precisa de um orçamento para reparo ou quer saber sobre nossos aparelhos à venda?
              Preencha o formulário ou entre em contato pelos nossos canais.
            </p>

            <div className="ct-quick ct-rv" style={d(3)}>
              <a
                className="ct-btn ct-btn--wa"
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle aria-hidden /> WhatsApp
              </a>
              <a className="ct-btn ct-btn--ghost" href={PHONE_FIXO_HREF}>
                <Phone aria-hidden /> Ligar agora
              </a>
            </div>

            <div className="ct-cards">
              {contactInfo.map((item, i) => (
                <div key={item.title} className="ct-card ct-rv" style={d(4 + i)} onPointerMove={spot}>
                  <span className="ct-card__ico">
                    <item.icon aria-hidden />
                  </span>
                  <div className="ct-card__body">
                    <h3>{item.title}</h3>
                    {item.lines.map((l) =>
                      l.href ? (
                        <a
                          key={l.text}
                          href={l.href}
                          target={l.href.startsWith("http") ? "_blank" : undefined}
                          rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        >
                          {l.text}
                        </a>
                      ) : (
                        <p key={l.text}>{l.text}</p>
                      )
                    )}
                    {item.status && open !== null && (
                      <span className={`ct-status ${open ? "" : "ct-status--off"}`} role="status">
                        <span className={`ct-dot ${open ? "" : "ct-dot--off"}`} aria-hidden="true" />
                        {open ? "Aberto agora" : "Fechado agora"}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Mapa: só carrega o iframe pesado quando o visitante pedir */}
            <div className="ct-map ct-rv" style={d(8)}>
              {mapOn ? (
                <iframe
                  src={MAP_EMBED}
                  title="Localização da Eletrônica Joana Dark"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <>
                  <span className="ct-pin" aria-hidden="true">
                    <MapPin />
                  </span>
                  <div className="ct-map__bar">
                    <span>
                      <small>Localização</small>
                      {ADDRESS_1}
                    </span>
                    <span className="ct-map__btns">
                      <button type="button" className="ct-btn ct-btn--sm ct-btn--ghost" onClick={() => setMapOn(true)}>
                        Ver mapa
                      </button>
                      <a className="ct-btn ct-btn--sm ct-btn--blue" href={ROUTE_URL} target="_blank" rel="noopener noreferrer">
                        <Navigation aria-hidden /> Como chegar
                      </a>
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ───────── DIREITA: formulário ───────── */}
          <div id="orcamento-form" className="ct-form-card ct-rv" style={d(2)}>
            {sentUrl ? (
              <div className="ct-done" role="status" aria-live="polite">
                <svg className="ct-done__ring" viewBox="0 0 52 52" aria-hidden="true">
                  <circle cx="26" cy="26" r="24" />
                  <path d="M15 27 L23 34 L37 19" />
                </svg>
                <h4>Mensagem pronta!</h4>
                <p>
                  Abrimos o WhatsApp com a sua solicitação. É só tocar em enviar por lá e
                  entraremos em contato em breve.
                </p>
                <div className="ct-done__btns">
                  <a className="ct-btn ct-btn--sm ct-btn--wa" href={sentUrl} target="_blank" rel="noopener noreferrer">
                    <MessageCircle aria-hidden /> Abrir WhatsApp de novo
                  </a>
                  <button type="button" className="ct-btn ct-btn--sm ct-btn--ghost" onClick={resetForm}>
                    Novo orçamento
                  </button>
                </div>
                <div className="ct-done__bar" aria-hidden="true">
                  <i onAnimationEnd={onCountdownEnd} />
                </div>
              </div>
            ) : (
              <>
                <div className="ct-form-head">
                  <p className="ct-form-tag">
                    <span className="ct-dot" aria-hidden="true" /> Orçamento grátis
                  </p>
                  <h3>Solicite seu orçamento</h3>
                  <div className="ct-meter">
                    <span
                      className="ct-meter__track"
                      role="progressbar"
                      aria-label="Preenchimento do formulário"
                      aria-valuemin={0}
                      aria-valuemax={TOTAL_FIELDS}
                      aria-valuenow={progress}
                    >
                      <span
                        className="ct-meter__fill"
                        style={{ "--p": progress / TOTAL_FIELDS } as CSSProperties}
                      />
                    </span>
                    <b aria-hidden="true">
                      {progress}/{TOTAL_FIELDS}
                    </b>
                  </div>
                </div>

                <form
                  ref={formRef}
                  className="ct-form"
                  onSubmit={onSubmit}
                  onInput={updateProgress}
                  onChange={updateProgress}
                >
                  <div className="ct-row">
                    <div className="ct-field">
                      <label htmlFor="name">Nome completo</label>
                      <div className="ct-control">
                        <input
                          id="name"
                          name="name"
                          className="ct-input"
                          placeholder="Seu nome"
                          autoComplete="name"
                          minLength={2}
                          required
                        />
                        <CheckCircle className="ct-ok" aria-hidden />
                      </div>
                    </div>
                    <div className="ct-field">
                      <label htmlFor="phone">Telefone</label>
                      <div className="ct-control">
                        <input
                          id="phone"
                          name="phone"
                          className="ct-input"
                          type="tel"
                          inputMode="tel"
                          placeholder="(83) 99999-9999"
                          autoComplete="tel"
                          pattern="\(\d{2}\) \d{4,5}-\d{4}"
                          title="Use o formato (83) 99999-9999"
                          onInput={onPhoneInput}
                          required
                        />
                        <CheckCircle className="ct-ok" aria-hidden />
                      </div>
                    </div>
                  </div>

                  <div className="ct-field">
                    <label htmlFor="email">E-mail</label>
                    <div className="ct-control">
                      <input
                        id="email"
                        name="email"
                        className="ct-input"
                        type="email"
                        placeholder="seu@email.com"
                        autoComplete="email"
                        required
                      />
                      <CheckCircle className="ct-ok" aria-hidden />
                    </div>
                  </div>

                  <fieldset className="ct-fieldset">
                    <legend className="ct-legend">Tipo de Serviço</legend>
                    <div className="ct-options">
                      {serviceOptions.map((o) => (
                        <label
                          key={o.value}
                          className={`ct-opt ${o.value.startsWith("buy") ? "ct-opt--buy" : ""}`}
                        >
                          <input type="radio" name="service" value={o.value} required />
                          <span className="ct-opt__box">
                            <span className="ct-opt__ico">
                              <o.icon aria-hidden />
                            </span>
                            <span className="ct-opt__txt">
                              <small>{o.kind}</small>
                              {o.label}
                            </span>
                            <span className="ct-opt__check" aria-hidden="true" />
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <div className="ct-field">
                    <label htmlFor="device">Equipamento / Modelo desejado</label>
                    <div className="ct-control">
                      <input
                        id="device"
                        name="device"
                        className="ct-input"
                        placeholder="Ex: TV Samsung 55 polegadas ou Micro-ondas 30L"
                        minLength={2}
                        required
                      />
                      <CheckCircle className="ct-ok" aria-hidden />
                    </div>
                  </div>

                  <div className="ct-field">
                    <label htmlFor="problem">Descreva sua necessidade</label>
                    <div className="ct-control">
                      <textarea
                        id="problem"
                        name="problem"
                        className="ct-input"
                        placeholder="Conte-nos mais sobre o reparo necessário ou o aparelho que procura..."
                        minLength={5}
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="ct-submit">
                    <MessageCircle aria-hidden />
                    <span>Enviar Orçamento via WhatsApp</span>
                    <Send aria-hidden />
                  </button>

                  <p className="ct-note">
                    Seus dados são usados apenas para responder ao seu orçamento.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}