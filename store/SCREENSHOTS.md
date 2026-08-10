# WIWI Screenshot Set

Run `npm run store:screenshots` after production has representative review data. The script signs in with the ignored `store/review-credentials.local.json` file and captures the live app with installed Chrome.

## Required Outputs

- Apple iPhone 6.9-inch: 1290 x 2796 PNG, five screenshots per locale.
- Google Play phone: 1080 x 1920 PNG, five screenshots per locale.
- Locales: English (`en-US`) and Spanish (`es-US`).

The production capture was completed and visually verified on August 9, 2026. All 20 PNG files use the exact dimensions above and show the dedicated fictional review dataset.

## Screenshot Order and Alt Text

| File | English alt text | Spanish alt text |
| --- | --- | --- |
| `01-dashboard.png` | WIWI dashboard showing weekly net earnings, real hourly pay, goal progress, and worth-it verdict. | Panel de WIWI con ganancias netas semanales, pago real por hora, progreso de meta y veredicto. |
| `02-history.png` | Shift history with month, app, and search filters plus earnings summaries. | Historial de turnos con filtros por mes, aplicación y búsqueda, más resúmenes de ganancias. |
| `03-insights.png` | Earnings insights comparing real performance across shifts and time periods. | Análisis de ganancias que compara el rendimiento real entre turnos y períodos. |
| `04-add-shift.png` | Add Shift form for date, gig app, gross earnings, hours, miles, and expenses. | Formulario para agregar fecha, aplicación, ganancias, horas, millas y gastos de un turno. |
| `05-settings.png` | Settings for tax reserve, vehicle MPG, gas price, weekly goal, language, and tutorial help. | Ajustes de impuestos, MPG, gasolina, meta semanal, idioma y ayuda del tutorial. |

The images show only the real WIWI interface and a dedicated fictional review dataset. Do not capture personal accounts, notifications, browser chrome, or real financial information.
