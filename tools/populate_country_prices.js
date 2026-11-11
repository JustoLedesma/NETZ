const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const pricesDir = path.join(rootDir, 'assets', 'data', 'prices');
const distPricesDir = path.join(rootDir, 'dist', 'assets', 'data', 'prices');

// Asegurar que existan los directorios
if (!fs.existsSync(pricesDir)) fs.mkdirSync(pricesDir, { recursive: true });
if (!fs.existsSync(distPricesDir)) fs.mkdirSync(distPricesDir, { recursive: true });

// Leer base USD y PYG
const usRaw = fs.readFileSync(path.join(pricesDir, 'us.json'), 'utf8').replace(/^\uFEFF/, '');
const usData = JSON.parse(usRaw);

const pyRaw = fs.readFileSync(path.join(pricesDir, 'py.json'), 'utf8').replace(/^\uFEFF/, '');
const pyData = JSON.parse(pyRaw);

const configRaw = fs.readFileSync(path.join(rootDir, 'config', 'country_currency.json'), 'utf8').replace(/^\uFEFF/, '');
const countryConfig = JSON.parse(configRaw);

// Definición de monedas, tasas oficiales y decimales (acordes a tblcurrencies y WHMCS)
const currencyMeta = {
  USD: { id: 1, rate: 1.0, decimals: 2, prefix: '$', suffix: ' USD', default: true },
  PYG: { id: 2, rate: 7500.0, decimals: 0, prefix: 'Gs. ', suffix: '', default: false },
  BRL: { id: 3, rate: 5.60, decimals: 2, prefix: 'R$ ', suffix: '', default: false },
  ARS: { id: 4, rate: 1200.0, decimals: 2, prefix: '$ ', suffix: ' ARS', default: false },
  EUR: { id: 5, rate: 0.92, decimals: 2, prefix: '€ ', suffix: '', default: false },
  CLP: { id: 6, rate: 950.0, decimals: 0, prefix: '$ ', suffix: ' CLP', default: false },
  COP: { id: 7, rate: 4200.0, decimals: 0, prefix: '$ ', suffix: ' COP', default: false },
  MXN: { id: 8, rate: 20.0, decimals: 2, prefix: '$ ', suffix: ' MXN', default: false }
};

function roundValue(val, decimals) {
  if (val === null || val === undefined) return null;
  if (decimals === 0) return Math.round(val);
  const factor = Math.pow(10, decimals);
  return Math.round(val * factor) / factor;
}

const nowIso = new Date().toISOString();

for (const [code, cfg] of Object.entries(countryConfig)) {
  const curr = cfg.currency;
  const meta = currencyMeta[curr] || { id: null, rate: 1.0, decimals: 2 };
  const decimals = meta.decimals;
  const rate = meta.rate;

  let countryProducts = {};
  let countryDomains = {};

  if (code === 'py') {
    countryProducts = pyData.products;
    countryDomains = pyData.domains;
  } else if (code === 'us') {
    countryProducts = usData.products;
    countryDomains = usData.domains;
  } else {
    // Convertir productos de USD a la moneda local
    for (const [pid, prod] of Object.entries(usData.products)) {
      countryProducts[pid] = {
        name: prod.name,
        monthly: prod.monthly !== null ? roundValue(prod.monthly * rate, decimals) : null,
        quarterly: prod.quarterly !== null ? roundValue(prod.quarterly * rate, decimals) : null,
        semiannually: prod.semiannually !== null ? roundValue(prod.semiannually * rate, decimals) : null,
        annually: prod.annually !== null ? roundValue(prod.annually * rate, decimals) : null,
        biennially: prod.biennially !== null ? roundValue(prod.biennially * rate, decimals) : null,
        triennially: prod.triennially !== null ? roundValue(prod.triennially * rate, decimals) : null
      };
    }

    // Convertir dominios destacados de USD a la moneda local
    for (const [tld, dom] of Object.entries(usData.domains)) {
      countryDomains[tld] = {
        register: dom.register !== null ? roundValue(dom.register * rate, decimals) : null,
        renew: dom.renew !== null ? roundValue(dom.renew * rate, decimals) : null,
        transfer: dom.transfer !== null ? roundValue(dom.transfer * rate, decimals) : null
      };
    }
  }

  const payload = {
    country: cfg.country,
    countryCode: code,
    locale: cfg.locale,
    currency: curr,
    whmcsCurrencyId: meta.id,
    generatedAt: nowIso,
    products: countryProducts,
    domains: countryDomains
  };

  const jsonStr = JSON.stringify(payload, null, 2);
  const targetFile = path.join(pricesDir, `${code}.json`);
  const targetDistFile = path.join(distPricesDir, `${code}.json`);

  fs.writeFileSync(targetFile, jsonStr, 'utf8');
  fs.writeFileSync(targetDistFile, jsonStr, 'utf8');

  console.log(`✅ [${code.toUpperCase()}] ${cfg.country} -> ${curr} (WHMCS ID: ${meta.id}): ${Object.keys(countryProducts).length} productos, ${Object.keys(countryDomains).length} dominios`);
}

// Generar manifest.json actualizado
const flagMap = {
  py: '🇵🇾', br: '🇧🇷', ar: '🇦🇷', es: '🇪🇸',
  us: '🇺🇸', cl: '🇨🇱', co: '🇨🇴', mx: '🇲🇽'
};

const manifestData = {
  updatedAt: nowIso,
  totalCountries: Object.keys(countryConfig).length,
  currencies: Object.entries(currencyMeta).map(([cCode, m]) => ({
    id: m.id,
    code: cCode,
    prefix: m.prefix,
    suffix: m.suffix,
    rate: m.rate,
    default: m.default
  })),
  countries: Object.entries(countryConfig).map(([cCode, cfg]) => ({
    code: cCode,
    name: cfg.country,
    flag: flagMap[cCode] || '🏳️',
    currency: cfg.currency,
    locale: cfg.locale,
    whmcsCurrencyId: currencyMeta[cfg.currency]?.id || null
  }))
};

const manifestStr = JSON.stringify(manifestData, null, 2);
fs.writeFileSync(path.join(pricesDir, 'manifest.json'), manifestStr, 'utf8');
fs.writeFileSync(path.join(distPricesDir, 'manifest.json'), manifestStr, 'utf8');
console.log('✅ manifest.json generado exitosamente con 8 países y 8 monedas.');

