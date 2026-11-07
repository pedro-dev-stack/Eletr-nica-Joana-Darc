/**
 * Temas sazonais · Eletrônica Joana Dark
 *
 * Calendário (mês no fuso da LOJA, não do servidor/visitante):
 *   Janeiro   -> "new-year-sale"   Liquida de Ano Novo / Queima de Estoque
 *   Março     -> "customer-week"   Semana do Consumidor (15/03)
 *   Junho     -> "sao-joao"        São João / Festas Juninas
 *   Setembro  -> "customer-week"   Dia do Cliente (15/09)
 *   Novembro  -> "black-friday"
 *   Dezembro  -> "christmas"
 *   Demais    -> "default"         (versão normal, preservada)
 *
 * Para mudar o calendário, edite só MONTH_TO_SEASON (mês 0–11, igual ao JS).
 */

export type Season =
  | "default"
  | "black-friday"
  | "christmas"
  | "sao-joao"
  | "customer-week"
  | "new-year-sale"

export const SEASONS: readonly Season[] = [
  "default",
  "black-friday",
  "christmas",
  "sao-joao",
  "customer-week",
  "new-year-sale",
] as const

/** Fuso da loja (mesmo usado no "aberto agora" do contato). */
export const STORE_TIME_ZONE = "America/Fortaleza"

/** mês (0 = janeiro … 11 = dezembro) -> temporada. Mês ausente = "default". */
const MONTH_TO_SEASON: Partial<Record<number, Season>> = {
  0: "new-year-sale", // janeiro
  2: "customer-week", // março: Semana do Consumidor
  5: "sao-joao", // junho
  8: "customer-week", // setembro: Dia do Cliente
  10: "black-friday", // novembro
  11: "christmas", // dezembro
}

/** Cor da barra do navegador (meta theme-color) por temporada. */
export const SEASON_THEME_COLOR: Record<Season, string> = {
  default: "#050a14",
  "black-friday": "#0a0912",
  christmas: "#160a0c",
  "sao-joao": "#150c06",
  "customer-week": "#14081a",
  "new-year-sale": "#070a16",
}

export function isSeason(value: unknown): value is Season {
  return typeof value === "string" && (SEASONS as readonly string[]).includes(value)
}

/** Mês (0–11, igual ao JS) no fuso informado. */
function getMonthIn(date: Date): number {
  const month = new Intl.DateTimeFormat("en-US", { timeZone: STORE_TIME_ZONE, month: "numeric" }).format(date)
  return Number(month) - 1
}

/**
 * Retorna a temporada atual.
 *
 * Para testar sem mexer no relógio, defina no .env.local:
 *   NEXT_PUBLIC_SEASON_OVERRIDE=sao-joao   (qualquer valor de Season)
 */
export function getCurrentSeason(date: Date = new Date()): Season {
  const timeZone = STORE_TIME_ZONE
  const tz = timeZone
  const override = process.env.NEXT_PUBLIC_SEASON_OVERRIDE
  if (isSeason(override)) return override

  return MONTH_TO_SEASON[getMonthIn(date)] ?? "default"
}