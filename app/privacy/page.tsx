"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Database,
  FileText,
  Lock,
  Mail,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { useLanguage } from "../../components/LanguageProvider";
import { WiwiShell } from "../../components/WiwiShell";
import { PageHero, Panel } from "../../components/WiwiSurface";

type LegalSectionCopy = {
  title: string;
  paragraphs: string[];
};

const privacyCopy: Record<
  "en" | "es",
  {
    eyebrow: string;
    title: string;
    titleAccent: string;
    description: string;
    back: string;
    dataCard: string;
    dataCardBody: string;
    accessCard: string;
    accessCardBody: string;
    deleteCard: string;
    deleteCardBody: string;
    sections: LegalSectionCopy[];
    help: string;
    updated: string;
  }
> = {
  en: {
    eyebrow: "Privacy",
    title: "How WIWI handles your",
    titleAccent: "shift data",
    description:
      "This policy explains what WIWI collects, why it is used, and how you can control or delete your information.",
    back: "Back home",
    dataCard: "Data you provide",
    dataCardBody: "Account details, shifts, expenses, and settings.",
    accessCard: "Protected access",
    accessCardBody: "Supabase manages authentication and database security.",
    deleteCard: "Account deletion",
    deleteCardBody: "Delete in Settings or use our public request page.",
    sections: [
      {
        title: "Information We Collect",
        paragraphs: [
          "When you create an account, WIWI stores your email address, display name, preferred language, and account identifiers. Authentication is handled by Supabase. WIWI does not receive your plain-text password.",
          "We store the shift information you enter, including app name, date, gross earnings, hours, miles, other shift expenses, and the fuel and tax-reserve assumptions saved with each shift. We also store calculation settings such as MPG, gas price, tax-reserve percentage, and weekly goal.",
          "Our infrastructure providers may process basic technical information such as IP address, browser or device type, timestamps, and diagnostic logs when needed to secure and operate the service.",
        ],
      },
      {
        title: "How We Use Information",
        paragraphs: [
          "We use your information to provide estimated shift earnings, hourly-rate calculations, history, insights, weekly progress, language preferences, account access, support, and security.",
          "Your email address may be used for transactional messages such as account confirmation, password recovery, security notices, and responses to support requests. We do not currently send marketing email without your permission.",
        ],
      },
      {
        title: "Service Providers and Sharing",
        paragraphs: [
          "WIWI uses Supabase for authentication and database storage, Vercel for hosting, and Resend for transactional email delivery. These providers process information as needed to operate WIWI under their own contractual and privacy obligations.",
          "WIWI does not sell your personal information. We may disclose information when required by law, to protect users or the service, or as part of a business transfer where appropriate safeguards apply.",
        ],
      },
      {
        title: "Retention and Account Deletion",
        paragraphs: [
          "We retain account and shift information while your account is active or as reasonably needed to provide WIWI, meet legal obligations, resolve disputes, prevent abuse, and enforce our terms.",
          "You can delete your account in WIWI under Settings. Account deletion removes your authentication account and associated WIWI profile, settings, and shifts. You can also request deletion from our public account-deletion page if you cannot access the app.",
        ],
      },
      {
        title: "Security",
        paragraphs: [
          "We use authenticated access, database row-level security, encrypted network connections, and reputable infrastructure providers to protect information. No online service can guarantee absolute security, so keep your password private and contact us if you suspect unauthorized access.",
        ],
      },
      {
        title: "Your Choices and Rights",
        paragraphs: [
          "You can review and edit saved shifts and settings inside WIWI. Depending on where you live, you may also have rights to access, correct, delete, or receive information about your personal data. Contact us to make a request.",
          "WIWI is not directed to children under 13, and we do not knowingly collect personal information from children under 13. Contact us if you believe a child provided information to WIWI.",
        ],
      },
      {
        title: "Policy Changes",
        paragraphs: [
          "We may update this policy as WIWI changes. We will revise the date on this page and provide additional notice when required. Continued use after an update means the revised policy applies.",
        ],
      },
    ],
    help: "Questions or privacy requests",
    updated: "Last updated: August 6, 2026",
  },
  es: {
    eyebrow: "Privacidad",
    title: "Cómo WIWI maneja tus",
    titleAccent: "datos de turnos",
    description:
      "Esta política explica qué recopila WIWI, por qué se usa y cómo puedes controlar o borrar tu información.",
    back: "Volver al inicio",
    dataCard: "Datos que proporcionas",
    dataCardBody: "Datos de cuenta, turnos, gastos y ajustes.",
    accessCard: "Acceso protegido",
    accessCardBody: "Supabase administra la autenticación y seguridad.",
    deleteCard: "Borrado de cuenta",
    deleteCardBody: "Borra en Ajustes o usa nuestra página pública.",
    sections: [
      {
        title: "Información que recopilamos",
        paragraphs: [
          "Cuando creas una cuenta, WIWI guarda tu correo electrónico, nombre mostrado, idioma preferido e identificadores de cuenta. Supabase administra la autenticación. WIWI no recibe tu contraseña en texto sin formato.",
          "Guardamos la información de turnos que ingresas, incluyendo app, fecha, ganancias brutas, horas, millas, otros gastos y los supuestos de gasolina y reserva de impuestos guardados con cada turno. También guardamos ajustes como MPG, precio de gasolina, porcentaje de reserva y meta semanal.",
          "Nuestros proveedores de infraestructura pueden procesar información técnica básica, como dirección IP, tipo de navegador o dispositivo, fechas y registros de diagnóstico, cuando sea necesario para proteger y operar el servicio.",
        ],
      },
      {
        title: "Cómo usamos la información",
        paragraphs: [
          "Usamos tu información para ofrecer estimaciones de ganancias, cálculos por hora, historial, análisis, progreso semanal, preferencias de idioma, acceso a la cuenta, soporte y seguridad.",
          "Podemos usar tu correo para mensajes transaccionales como confirmación de cuenta, recuperación de contraseña, avisos de seguridad y respuestas de soporte. Actualmente no enviamos correos de mercadeo sin tu permiso.",
        ],
      },
      {
        title: "Proveedores y divulgación",
        paragraphs: [
          "WIWI usa Supabase para autenticación y almacenamiento, Vercel para alojamiento y Resend para correos transaccionales. Estos proveedores procesan información según sea necesario para operar WIWI bajo sus propias obligaciones contractuales y de privacidad.",
          "WIWI no vende tu información personal. Podemos divulgar información si la ley lo exige, para proteger a usuarios o al servicio, o como parte de una transferencia comercial con protecciones apropiadas.",
        ],
      },
      {
        title: "Retención y borrado de cuenta",
        paragraphs: [
          "Conservamos la información mientras tu cuenta esté activa o cuando sea razonablemente necesario para ofrecer WIWI, cumplir obligaciones legales, resolver disputas, prevenir abuso y hacer cumplir nuestros términos.",
          "Puedes borrar tu cuenta desde Ajustes. El borrado elimina tu cuenta de autenticación y los perfiles, ajustes y turnos asociados. También puedes solicitarlo desde nuestra página pública si no puedes entrar a la app.",
        ],
      },
      {
        title: "Seguridad",
        paragraphs: [
          "Usamos acceso autenticado, seguridad por filas en la base de datos, conexiones cifradas y proveedores reconocidos. Ningún servicio en línea puede garantizar seguridad absoluta; protege tu contraseña y contáctanos si sospechas acceso no autorizado.",
        ],
      },
      {
        title: "Tus opciones y derechos",
        paragraphs: [
          "Puedes revisar y editar turnos y ajustes dentro de WIWI. Según dónde vivas, también puedes tener derecho a acceder, corregir, borrar o recibir información sobre tus datos personales. Contáctanos para solicitarlo.",
          "WIWI no está dirigido a menores de 13 años y no recopilamos conscientemente información de menores de 13. Contáctanos si crees que un menor proporcionó información a WIWI.",
        ],
      },
      {
        title: "Cambios a esta política",
        paragraphs: [
          "Podemos actualizar esta política cuando WIWI cambie. Revisaremos la fecha de esta página y daremos aviso adicional cuando sea obligatorio. El uso continuo después de un cambio significa que aplica la política revisada.",
        ],
      },
    ],
    help: "Preguntas o solicitudes de privacidad",
    updated: "Última actualización: 6 de agosto de 2026",
  },
};

export default function PrivacyPage() {
  const { language, setLanguage } = useLanguage();
  const copy = privacyCopy[language];

  return (
    <WiwiShell
      language={language}
      setLanguage={setLanguage}
      navActions={
        <div className="hidden items-center gap-2 sm:flex">
          <Link
            href="/support"
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 transition hover:border-sky-500/40 hover:text-white"
          >
            {language === "es" ? "Ayuda" : "Support"}
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
            <ShieldCheck className="h-4 w-4 text-sky-300" />
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
            <Database className="h-5 w-5 text-sky-300" />
            <p className="mt-3 text-sm font-semibold text-white">{copy.dataCard}</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">{copy.dataCardBody}</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
            <Lock className="h-5 w-5 text-emerald-300" />
            <p className="mt-3 text-sm font-semibold text-white">{copy.accessCard}</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">{copy.accessCardBody}</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
            <Trash2 className="h-5 w-5 text-orange-300" />
            <p className="mt-3 text-sm font-semibold text-white">{copy.deleteCard}</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">{copy.deleteCardBody}</p>
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

        <Panel>
          <h2 className="text-2xl font-black tracking-tight text-white">
            {copy.help}
          </h2>
          <div className="mt-4 space-y-4 text-sm leading-7 text-slate-300">
            <a
              href="mailto:support@getwiwi.com"
              className="flex items-center gap-2 font-semibold text-sky-300 transition hover:text-sky-200"
            >
              <Mail className="h-4 w-4" />
              <span>support@getwiwi.com</span>
            </a>
            <Link
              href="/delete-account"
              className="inline-flex items-center gap-2 font-semibold text-sky-300 transition hover:text-sky-200"
            >
              <Trash2 className="h-4 w-4" />
              <span>{language === "es" ? "Solicitar borrado" : "Request deletion"}</span>
            </Link>
            <p className="flex items-center gap-2 text-slate-500">
              <FileText className="h-4 w-4" />
              <span>{copy.updated}</span>
            </p>
          </div>
        </Panel>
      </div>
    </WiwiShell>
  );
}
