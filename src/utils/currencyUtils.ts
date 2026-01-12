// Map of country names/codes to currency codes
const COUNTRY_TO_CURRENCY: Record<string, string> = {
  // North America
  'united states': 'USD',
  'usa': 'USD',
  'us': 'USD',
  'canada': 'CAD',
  
  // Europe
  'united kingdom': 'GBP',
  'uk': 'GBP',
  'england': 'GBP',
  'scotland': 'GBP',
  'wales': 'GBP',
  'germany': 'EUR',
  'france': 'EUR',
  'italy': 'EUR',
  'spain': 'EUR',
  'netherlands': 'EUR',
  'belgium': 'EUR',
  'austria': 'EUR',
  'ireland': 'EUR',
  'portugal': 'EUR',
  'greece': 'EUR',
  'finland': 'EUR',
  'luxembourg': 'EUR',
  'cyprus': 'EUR',
  'malta': 'EUR',
  'slovakia': 'EUR',
  'slovenia': 'EUR',
  'estonia': 'EUR',
  'latvia': 'EUR',
  'lithuania': 'EUR',
  'switzerland': 'CHF',
  'sweden': 'SEK',
  'norway': 'NOK',
  'denmark': 'DKK',
  'poland': 'PLN',
  'czech republic': 'CZK',
  'czechia': 'CZK',
  'hungary': 'HUF',
  'romania': 'RON',
  'bulgaria': 'BGN',
  'croatia': 'EUR',
  'iceland': 'ISK',
  'russia': 'RUB',
  'ukraine': 'UAH',
  'turkey': 'TRY',
  
  // Asia Pacific
  'australia': 'AUD',
  'new zealand': 'NZD',
  'japan': 'JPY',
  'china': 'CNY',
  'hong kong': 'HKD',
  'singapore': 'SGD',
  'india': 'INR',
  'philippines': 'PHP',
  'malaysia': 'MYR',
  'thailand': 'THB',
  'indonesia': 'IDR',
  'south korea': 'KRW',
  'taiwan': 'TWD',
  'vietnam': 'VND',
  'pakistan': 'PKR',
  'bangladesh': 'BDT',
  'sri lanka': 'LKR',
  'nepal': 'NPR',
  'myanmar': 'MMK',
  'cambodia': 'KHR',
  
  // Middle East & Africa
  'uae': 'AED',
  'united arab emirates': 'AED',
  'dubai': 'AED',
  'saudi arabia': 'SAR',
  'qatar': 'QAR',
  'kuwait': 'KWD',
  'bahrain': 'BHD',
  'oman': 'OMR',
  'jordan': 'JOD',
  'lebanon': 'LBP',
  'south africa': 'ZAR',
  'nigeria': 'NGN',
  'kenya': 'KES',
  'egypt': 'EGP',
  'morocco': 'MAD',
  'algeria': 'DZD',
  'tunisia': 'TND',
  'ghana': 'GHS',
  'tanzania': 'TZS',
  'uganda': 'UGX',
  'ethiopia': 'ETB',
  'israel': 'ILS',
  'iraq': 'IQD',
  'iran': 'IRR',
  
  // South America
  'brazil': 'BRL',
  'mexico': 'MXN',
  'argentina': 'ARS',
  'chile': 'CLP',
  'colombia': 'COP',
  'peru': 'PEN',
  'venezuela': 'VES',
  'ecuador': 'USD',
  'uruguay': 'UYU',
  'paraguay': 'PYG',
  'bolivia': 'BOB',
  
  // Caribbean & Central America
  'jamaica': 'JMD',
  'bahamas': 'BSD',
  'barbados': 'BBD',
  'trinidad and tobago': 'TTD',
  'costa rica': 'CRC',
  'panama': 'PAB',
  'guatemala': 'GTQ',
  'honduras': 'HNL',
  'el salvador': 'USD',
  'nicaragua': 'NIO',
  'cuba': 'CUP',
  'dominican republic': 'DOP',
  'haiti': 'HTG',
  'puerto rico': 'USD',
};

// Currency symbols and formatting - comprehensive list
export const CURRENCY_CONFIG: Record<string, { symbol: string; position: 'before' | 'after'; locale: string; name: string }> = {
  // Major currencies
  USD: { symbol: '$', position: 'before', locale: 'en-US', name: 'US Dollar' },
  EUR: { symbol: '€', position: 'before', locale: 'de-DE', name: 'Euro' },
  GBP: { symbol: '£', position: 'before', locale: 'en-GB', name: 'British Pound' },
  CAD: { symbol: 'C$', position: 'before', locale: 'en-CA', name: 'Canadian Dollar' },
  AUD: { symbol: 'A$', position: 'before', locale: 'en-AU', name: 'Australian Dollar' },
  NZD: { symbol: 'NZ$', position: 'before', locale: 'en-NZ', name: 'New Zealand Dollar' },
  
  // Asian currencies
  JPY: { symbol: '¥', position: 'before', locale: 'ja-JP', name: 'Japanese Yen' },
  CNY: { symbol: '¥', position: 'before', locale: 'zh-CN', name: 'Chinese Yuan' },
  HKD: { symbol: 'HK$', position: 'before', locale: 'zh-HK', name: 'Hong Kong Dollar' },
  SGD: { symbol: 'S$', position: 'before', locale: 'en-SG', name: 'Singapore Dollar' },
  INR: { symbol: '₹', position: 'before', locale: 'en-IN', name: 'Indian Rupee' },
  PHP: { symbol: '₱', position: 'before', locale: 'en-PH', name: 'Philippine Peso' },
  MYR: { symbol: 'RM', position: 'before', locale: 'ms-MY', name: 'Malaysian Ringgit' },
  THB: { symbol: '฿', position: 'before', locale: 'th-TH', name: 'Thai Baht' },
  IDR: { symbol: 'Rp', position: 'before', locale: 'id-ID', name: 'Indonesian Rupiah' },
  KRW: { symbol: '₩', position: 'before', locale: 'ko-KR', name: 'South Korean Won' },
  TWD: { symbol: 'NT$', position: 'before', locale: 'zh-TW', name: 'Taiwan Dollar' },
  VND: { symbol: '₫', position: 'after', locale: 'vi-VN', name: 'Vietnamese Dong' },
  PKR: { symbol: 'Rs', position: 'before', locale: 'en-PK', name: 'Pakistani Rupee' },
  BDT: { symbol: '৳', position: 'before', locale: 'bn-BD', name: 'Bangladeshi Taka' },
  LKR: { symbol: 'Rs', position: 'before', locale: 'si-LK', name: 'Sri Lankan Rupee' },
  NPR: { symbol: 'Rs', position: 'before', locale: 'ne-NP', name: 'Nepalese Rupee' },
  MMK: { symbol: 'K', position: 'before', locale: 'my-MM', name: 'Myanmar Kyat' },
  KHR: { symbol: '៛', position: 'after', locale: 'km-KH', name: 'Cambodian Riel' },
  
  // European currencies
  CHF: { symbol: 'CHF', position: 'before', locale: 'de-CH', name: 'Swiss Franc' },
  SEK: { symbol: 'kr', position: 'after', locale: 'sv-SE', name: 'Swedish Krona' },
  NOK: { symbol: 'kr', position: 'after', locale: 'nb-NO', name: 'Norwegian Krone' },
  DKK: { symbol: 'kr', position: 'after', locale: 'da-DK', name: 'Danish Krone' },
  PLN: { symbol: 'zł', position: 'after', locale: 'pl-PL', name: 'Polish Zloty' },
  CZK: { symbol: 'Kč', position: 'after', locale: 'cs-CZ', name: 'Czech Koruna' },
  HUF: { symbol: 'Ft', position: 'after', locale: 'hu-HU', name: 'Hungarian Forint' },
  RON: { symbol: 'lei', position: 'after', locale: 'ro-RO', name: 'Romanian Leu' },
  BGN: { symbol: 'лв', position: 'after', locale: 'bg-BG', name: 'Bulgarian Lev' },
  ISK: { symbol: 'kr', position: 'after', locale: 'is-IS', name: 'Icelandic Krona' },
  RUB: { symbol: '₽', position: 'after', locale: 'ru-RU', name: 'Russian Ruble' },
  UAH: { symbol: '₴', position: 'after', locale: 'uk-UA', name: 'Ukrainian Hryvnia' },
  TRY: { symbol: '₺', position: 'before', locale: 'tr-TR', name: 'Turkish Lira' },
  
  // Middle East currencies
  AED: { symbol: 'AED', position: 'before', locale: 'ar-AE', name: 'UAE Dirham' },
  SAR: { symbol: 'SAR', position: 'before', locale: 'ar-SA', name: 'Saudi Riyal' },
  QAR: { symbol: 'QAR', position: 'before', locale: 'ar-QA', name: 'Qatari Riyal' },
  KWD: { symbol: 'KD', position: 'before', locale: 'ar-KW', name: 'Kuwaiti Dinar' },
  BHD: { symbol: 'BD', position: 'before', locale: 'ar-BH', name: 'Bahraini Dinar' },
  OMR: { symbol: 'OMR', position: 'before', locale: 'ar-OM', name: 'Omani Rial' },
  JOD: { symbol: 'JD', position: 'before', locale: 'ar-JO', name: 'Jordanian Dinar' },
  LBP: { symbol: 'L£', position: 'before', locale: 'ar-LB', name: 'Lebanese Pound' },
  ILS: { symbol: '₪', position: 'before', locale: 'he-IL', name: 'Israeli Shekel' },
  IQD: { symbol: 'IQD', position: 'before', locale: 'ar-IQ', name: 'Iraqi Dinar' },
  IRR: { symbol: 'IRR', position: 'before', locale: 'fa-IR', name: 'Iranian Rial' },
  
  // African currencies
  ZAR: { symbol: 'R', position: 'before', locale: 'en-ZA', name: 'South African Rand' },
  NGN: { symbol: '₦', position: 'before', locale: 'en-NG', name: 'Nigerian Naira' },
  KES: { symbol: 'KSh', position: 'before', locale: 'en-KE', name: 'Kenyan Shilling' },
  EGP: { symbol: 'E£', position: 'before', locale: 'ar-EG', name: 'Egyptian Pound' },
  MAD: { symbol: 'MAD', position: 'before', locale: 'ar-MA', name: 'Moroccan Dirham' },
  DZD: { symbol: 'DA', position: 'before', locale: 'ar-DZ', name: 'Algerian Dinar' },
  TND: { symbol: 'DT', position: 'before', locale: 'ar-TN', name: 'Tunisian Dinar' },
  GHS: { symbol: 'GH₵', position: 'before', locale: 'en-GH', name: 'Ghanaian Cedi' },
  TZS: { symbol: 'TSh', position: 'before', locale: 'sw-TZ', name: 'Tanzanian Shilling' },
  UGX: { symbol: 'USh', position: 'before', locale: 'en-UG', name: 'Ugandan Shilling' },
  ETB: { symbol: 'Br', position: 'before', locale: 'am-ET', name: 'Ethiopian Birr' },
  
  // South American currencies
  BRL: { symbol: 'R$', position: 'before', locale: 'pt-BR', name: 'Brazilian Real' },
  MXN: { symbol: 'MX$', position: 'before', locale: 'es-MX', name: 'Mexican Peso' },
  ARS: { symbol: 'AR$', position: 'before', locale: 'es-AR', name: 'Argentine Peso' },
  CLP: { symbol: 'CL$', position: 'before', locale: 'es-CL', name: 'Chilean Peso' },
  COP: { symbol: 'CO$', position: 'before', locale: 'es-CO', name: 'Colombian Peso' },
  PEN: { symbol: 'S/', position: 'before', locale: 'es-PE', name: 'Peruvian Sol' },
  VES: { symbol: 'Bs', position: 'before', locale: 'es-VE', name: 'Venezuelan Bolivar' },
  UYU: { symbol: '$U', position: 'before', locale: 'es-UY', name: 'Uruguayan Peso' },
  PYG: { symbol: '₲', position: 'before', locale: 'es-PY', name: 'Paraguayan Guarani' },
  BOB: { symbol: 'Bs', position: 'before', locale: 'es-BO', name: 'Bolivian Boliviano' },
  
  // Caribbean & Central American currencies
  JMD: { symbol: 'J$', position: 'before', locale: 'en-JM', name: 'Jamaican Dollar' },
  BSD: { symbol: 'B$', position: 'before', locale: 'en-BS', name: 'Bahamian Dollar' },
  BBD: { symbol: 'Bds$', position: 'before', locale: 'en-BB', name: 'Barbadian Dollar' },
  TTD: { symbol: 'TT$', position: 'before', locale: 'en-TT', name: 'Trinidad Dollar' },
  CRC: { symbol: '₡', position: 'before', locale: 'es-CR', name: 'Costa Rican Colon' },
  PAB: { symbol: 'B/', position: 'before', locale: 'es-PA', name: 'Panamanian Balboa' },
  GTQ: { symbol: 'Q', position: 'before', locale: 'es-GT', name: 'Guatemalan Quetzal' },
  HNL: { symbol: 'L', position: 'before', locale: 'es-HN', name: 'Honduran Lempira' },
  NIO: { symbol: 'C$', position: 'before', locale: 'es-NI', name: 'Nicaraguan Cordoba' },
  CUP: { symbol: '₱', position: 'before', locale: 'es-CU', name: 'Cuban Peso' },
  DOP: { symbol: 'RD$', position: 'before', locale: 'es-DO', name: 'Dominican Peso' },
  HTG: { symbol: 'G', position: 'before', locale: 'fr-HT', name: 'Haitian Gourde' },
};

// Get list of available currencies for dropdown
export const AVAILABLE_CURRENCIES = Object.entries(CURRENCY_CONFIG).map(([code, config]) => ({
  value: code,
  label: `${code} (${config.symbol}) - ${config.name}`,
})).sort((a, b) => a.value.localeCompare(b.value));

/**
 * Get currency code from a location string
 */
export function getCurrencyFromLocation(location: string): string {
  const normalized = location.toLowerCase().trim();
  
  // Check for exact matches first
  if (COUNTRY_TO_CURRENCY[normalized]) {
    return COUNTRY_TO_CURRENCY[normalized];
  }
  
  // Check if location contains any known country
  for (const [country, currency] of Object.entries(COUNTRY_TO_CURRENCY)) {
    if (normalized.includes(country)) {
      return currency;
    }
  }
  
  // Default to USD
  return 'USD';
}

/**
 * Format currency amount based on location or currency override
 */
export function formatCurrency(amount: number, location: string, currencyOverride?: string): string {
  const currencyCode = currencyOverride || getCurrencyFromLocation(location);
  const config = CURRENCY_CONFIG[currencyCode] || CURRENCY_CONFIG.USD;
  
  try {
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    // Fallback formatting
    const formatted = amount.toLocaleString();
    return config.position === 'before' 
      ? `${config.symbol}${formatted}`
      : `${formatted} ${config.symbol}`;
  }
}

/**
 * Format a salary range string based on location or currency override
 */
export function formatSalaryRange(salaryRange: string, location: string, currencyOverride?: string): string {
  if (!salaryRange) return '';
  
  const currencyCode = currencyOverride || getCurrencyFromLocation(location);
  const config = CURRENCY_CONFIG[currencyCode] || CURRENCY_CONFIG.USD;
  
  // Try to parse the salary range
  // Common formats: "$50,000 - $70,000", "50000-70000", "$50K - $70K"
  const numbers = salaryRange.match(/[\d,]+/g);
  
  if (!numbers || numbers.length === 0) {
    return salaryRange;
  }
  
  const parsedNumbers = numbers.map(n => parseInt(n.replace(/,/g, '')));
  
  if (parsedNumbers.length === 1) {
    return formatCurrency(parsedNumbers[0], location, currencyOverride);
  }
  
  if (parsedNumbers.length >= 2) {
    return `${formatCurrency(parsedNumbers[0], location, currencyOverride)} - ${formatCurrency(parsedNumbers[1], location, currencyOverride)}`;
  }
  
  return salaryRange;
}

/**
 * Get currency symbol for a location
 */
export function getCurrencySymbol(location: string, currencyOverride?: string): string {
  const currencyCode = currencyOverride || getCurrencyFromLocation(location);
  const config = CURRENCY_CONFIG[currencyCode] || CURRENCY_CONFIG.USD;
  return config.symbol;
}