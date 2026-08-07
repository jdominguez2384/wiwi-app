"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  BadgeDollarSign,
  FileText,
  Mail,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { useLanguage } from "../../components/LanguageProvider";
import { WiwiShell } from "../../components/WiwiShell";
import { PageHero, Panel } from "../../components/WiwiSurface";

type TermsCopy = {
  eyebrow: string;
  title: string;
  titleAccent: string;
  description: string;
  back: string;
  estimate: string;
  estimateBody: string;
  responsibility: string;
  responsibilityBody: string;
  account: string;
  accountBody: string;
  warning: string;
  sections: Array<{ title: string; paragraphs: string[] }>;
  contact: string;
  updated: string;
};

const termsCopy: Record<"en" | "es", TermsCopy> = {
  en: {
    eyebrow: "Terms",
    title: "The rules for using",
    titleAccent: "WIWI",
    description:
      "These terms explain what WIWI provides, what it does not provide, and your responsibilities when using it.",
    back: "Back home",
    estimate: "Estimates",
    estimateBody: "WIWI is a planning tool, not professional advice.",
    responsibility: "Your responsibility",
    responsibilityBody: "Review your entries, assumptions, and decisions.",
    account: "Account control",
    accountBody: "You can delete your account and WIWI data.",
    warning:
      "Verify important earnings, mileage, tax, and business decisions outside WIWI.",
    sections: [
      {
        title: "Acceptance",
        paragraphs: [
          "By creating an account or using WIWI, you agree to these terms and our Privacy Policy. If you do not agree, do not use the service.",
          "You must be legally able to enter into these terms where you live. If you use WIWI for a business, you represent that you have authority to accept these terms for that business.",
        ],
      },
      {
        title: "What WIWI Provides",
        paragraphs: [
          "WIWI helps gig workers record shifts and estimate take-home earnings using user-entered gross earnings, hours, miles, other expenses, fuel assumptions, and a tax-reserve assumption.",
          "Calculations are estimates. WIWI does not guarantee earnings, employment outcomes, tax results, platform availability, cost accuracy, or any particular financial outcome.",
        ],
      },
      {
        title: "No Professional Advice",
        paragraphs: [
          "WIWI does not provide tax, legal, financial, accounting, employment, or investment advice. A tax reserve is a planning estimate, not a calculation of tax owed.",
          "You are responsible for maintaining accurate records, checking your assumptions, and consulting a qualified professional when appropriate.",
        ],
      },
      {
        title: "Accounts and Security",
        paragraphs: [
          "Provide accurate account information, protect your credentials, and notify us if you suspect unauthorized use. You are responsible for activity performed through your account.",
          "You may delete your account from Settings. We may suspend or terminate access when reasonably necessary to protect users, comply with law, prevent abuse, or enforce these terms.",
        ],
      },
      {
        title: "Acceptable Use",
        paragraphs: [
          "Do not misuse WIWI, interfere with the service, probe or bypass security, access another user's data, introduce harmful code, automate abusive traffic, reverse engineer protected portions of the service, or use WIWI unlawfully.",
          "You retain ownership of information you enter. You grant WIWI permission to process it only as needed to provide, secure, and improve the service as described in the Privacy Policy.",
        ],
      },
      {
        title: "Paid Features",
        paragraphs: [
          "WIWI Free includes essential shift tracking and real-pay estimates. WIWI Pro may be offered as an automatically renewing monthly or annual subscription and, when available, as a one-time lifetime purchase. The store checkout shows the final local price, billing period, trial eligibility, and renewal terms before you confirm.",
          "Subscriptions renew through Apple or Google until canceled in your store account. Canceling stops future renewal and normally leaves Pro active through the paid period. Any trial converts to the displayed paid plan unless canceled before the store's deadline. Store purchases, billing, cancellation, and refunds are also governed by the applicable store's rules.",
          "A lifetime purchase means access to the included WIWI Pro features for as long as WIWI continues to offer and operate the service; it is not a promise that the service will exist forever. Losing Pro access does not delete your shifts, though editing or creating Pro-only data may require Pro.",
        ],
      },
      {
        title: "Availability and Changes",
        paragraphs: [
          "WIWI is provided as available. We may improve, add, remove, or discontinue features. We do not promise uninterrupted service, permanent storage, or compatibility with every device.",
          "Keep independent records of information that is important to your work, taxes, or business.",
        ],
      },
      {
        title: "Disclaimers and Liability",
        paragraphs: [
          "To the extent permitted by law, WIWI is provided without warranties of merchantability, fitness for a particular purpose, or non-infringement. We are not responsible for decisions made from estimates, lost profits, lost data, or indirect or consequential damages.",
          "Some jurisdictions do not allow certain warranty exclusions or liability limits, so portions of this section may not apply to you.",
        ],
      },
      {
        title: "Changes to These Terms",
        paragraphs: [
          "We may update these terms as WIWI evolves. We will revise the date on this page and provide additional notice when required. Continued use after the effective date means you accept the updated terms.",
        ],
      },
    ],
    contact: "Questions about these terms",
    updated: "Last updated: August 7, 2026",
  },
  es: {
    eyebrow: "Términos",
    title: "Las reglas para usar",
    titleAccent: "WIWI",
    description:
      "Estos términos explican qué ofrece WIWI, qué no ofrece y tus responsabilidades al usarlo.",
    back: "Volver al inicio",
    estimate: "Estimaciones",
    estimateBody: "WIWI ayuda a planificar; no es asesoramiento profesional.",
    responsibility: "Tu responsabilidad",
    responsibilityBody: "Revisa tus datos, supuestos y decisiones.",
    account: "Control de cuenta",
    accountBody: "Puedes borrar tu cuenta y los datos de WIWI.",
    warning:
      "Verifica fuera de WIWI las decisiones importantes sobre ingresos, millaje, impuestos y negocio.",
    sections: [
      {
        title: "Aceptación",
        paragraphs: [
          "Al crear una cuenta o usar WIWI, aceptas estos términos y nuestra Política de Privacidad. Si no estás de acuerdo, no uses el servicio.",
          "Debes tener capacidad legal para aceptar estos términos donde vives. Si usas WIWI para un negocio, declaras que tienes autoridad para aceptar estos términos por ese negocio.",
        ],
      },
      {
        title: "Qué ofrece WIWI",
        paragraphs: [
          "WIWI ayuda a trabajadores gig a registrar turnos y estimar ganancias usando ingresos brutos, horas, millas, otros gastos, supuestos de gasolina y una reserva estimada para impuestos.",
          "Los cálculos son estimaciones. WIWI no garantiza ingresos, resultados laborales o fiscales, disponibilidad de plataformas, precisión de costos ni resultados financieros.",
        ],
      },
      {
        title: "Sin asesoramiento profesional",
        paragraphs: [
          "WIWI no ofrece asesoramiento fiscal, legal, financiero, contable, laboral ni de inversión. La reserva fiscal es una estimación para planificar, no un cálculo del impuesto adeudado.",
          "Eres responsable de mantener registros correctos, revisar tus supuestos y consultar a un profesional cuando corresponda.",
        ],
      },
      {
        title: "Cuentas y seguridad",
        paragraphs: [
          "Proporciona información correcta, protege tus credenciales y avísanos si sospechas uso no autorizado. Eres responsable de la actividad realizada desde tu cuenta.",
          "Puedes borrar tu cuenta desde Ajustes. Podemos suspender o terminar el acceso cuando sea razonablemente necesario para proteger usuarios, cumplir la ley, prevenir abuso o aplicar estos términos.",
        ],
      },
      {
        title: "Uso aceptable",
        paragraphs: [
          "No uses WIWI indebidamente, interfieras con el servicio, evadas seguridad, accedas a datos de otra persona, introduzcas código dañino, automatices tráfico abusivo, hagas ingeniería inversa de partes protegidas ni uses WIWI ilegalmente.",
          "Conservas la propiedad de la información que ingresas. Autorizas a WIWI a procesarla únicamente para ofrecer, proteger y mejorar el servicio según la Política de Privacidad.",
        ],
      },
      {
        title: "Funciones pagadas",
        paragraphs: [
          "WIWI Free incluye el registro esencial de turnos y estimaciones de pago real. WIWI Pro puede ofrecerse como suscripción mensual o anual con renovación automática y, cuando esté disponible, como compra única de por vida. La tienda muestra el precio local final, período, elegibilidad para pruebas y términos de renovación antes de confirmar.",
          "Las suscripciones se renuevan mediante Apple o Google hasta que las canceles en tu cuenta de la tienda. Cancelar detiene la próxima renovación y normalmente mantiene Pro durante el período pagado. Una prueba se convierte al plan mostrado si no cancelas antes del plazo indicado por la tienda. Las reglas de la tienda también rigen compras, cobros, cancelaciones y reembolsos.",
          "Una compra de por vida significa acceso a las funciones incluidas de WIWI Pro mientras WIWI continúe ofreciendo y operando el servicio; no promete que el servicio existirá para siempre. Perder acceso a Pro no borra tus turnos, aunque crear o editar datos exclusivos de Pro puede requerir Pro.",
        ],
      },
      {
        title: "Disponibilidad y cambios",
        paragraphs: [
          "WIWI se ofrece según disponibilidad. Podemos mejorar, añadir, retirar o descontinuar funciones. No prometemos servicio ininterrumpido, almacenamiento permanente ni compatibilidad con todo dispositivo.",
          "Mantén registros independientes de la información importante para tu trabajo, impuestos o negocio.",
        ],
      },
      {
        title: "Descargos y responsabilidad",
        paragraphs: [
          "En la medida permitida por ley, WIWI se ofrece sin garantías de comerciabilidad, idoneidad para un propósito particular o no infracción. No respondemos por decisiones basadas en estimaciones, ganancias perdidas, datos perdidos o daños indirectos.",
          "Algunas jurisdicciones no permiten ciertas exclusiones o límites, por lo que partes de esta sección podrían no aplicarte.",
        ],
      },
      {
        title: "Cambios a estos términos",
        paragraphs: [
          "Podemos actualizar estos términos cuando WIWI evolucione. Revisaremos la fecha de esta página y daremos aviso adicional cuando sea obligatorio. El uso continuo después de la fecha efectiva significa que aceptas los términos actualizados.",
        ],
      },
    ],
    contact: "Preguntas sobre estos términos",
    updated: "Última actualización: 7 de agosto de 2026",
  },
};

export default function TermsPage() {
  const { language, setLanguage } = useLanguage();
  const copy = termsCopy[language];

  return (
    <WiwiShell
      language={language}
      setLanguage={setLanguage}
      navActions={
        <div className="hidden items-center gap-2 sm:flex">
          <Link
            href="/privacy"
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 transition hover:border-sky-500/40 hover:text-white"
          >
            {language === "es" ? "Privacidad" : "Privacy"}
          </Link>
          <Link
            href="/signup"
            className="rounded-xl bg-sky-500 px-3 py-2 text-sm font-semibold text-black transition hover:bg-sky-400"
          >
            {language === "es" ? "Crear cuenta" : "Create account"}
          </Link>
        </div>
      }
    >
      <PageHero
        eyebrowContent={
          <>
            <FileText className="h-4 w-4 text-sky-300" />
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">
              {copy.eyebrow}
            </span>
          </>
        }
        title={
          <>
            {copy.title}{" "}
            <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
              {copy.titleAccent}
            </span>
            .
          </>
        }
        description={copy.description}
        actions={
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-950/80 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-sky-500/40 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{copy.back}</span>
          </Link>
        }
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
            <BadgeDollarSign className="h-5 w-5 text-emerald-300" />
            <p className="mt-3 text-sm font-semibold text-white">{copy.estimate}</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">{copy.estimateBody}</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
            <ShieldCheck className="h-5 w-5 text-sky-300" />
            <p className="mt-3 text-sm font-semibold text-white">{copy.responsibility}</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">{copy.responsibilityBody}</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
            <Trash2 className="h-5 w-5 text-orange-300" />
            <p className="mt-3 text-sm font-semibold text-white">{copy.account}</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">{copy.accountBody}</p>
          </div>
        </div>
      </PageHero>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {copy.sections.map((section) => (
          <Panel key={section.title}>
            <h2 className="text-2xl font-black tracking-tight text-white">
              {section.title}
            </h2>
            <div className="mt-4 space-y-4 text-sm leading-7 text-slate-300">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </Panel>
        ))}

        <Panel className="border-orange-500/20 bg-orange-950/10">
          <div className="flex items-start gap-3 text-orange-100">
            <AlertTriangle className="mt-1 h-5 w-5 shrink-0" />
            <p className="text-sm leading-7">{copy.warning}</p>
          </div>
          <h2 className="mt-6 text-xl font-black tracking-tight text-white">
            {copy.contact}
          </h2>
          <a
            href="mailto:support@getwiwi.com"
            className="mt-4 flex items-center gap-2 text-sm font-semibold text-sky-300 transition hover:text-sky-200"
          >
            <Mail className="h-4 w-4" />
            <span>support@getwiwi.com</span>
          </a>
          <p className="mt-4 flex items-center gap-2 text-sm text-slate-500">
            <FileText className="h-4 w-4" />
            <span>{copy.updated}</span>
          </p>
        </Panel>
      </div>
    </WiwiShell>
  );
}
