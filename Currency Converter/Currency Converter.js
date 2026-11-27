const currencies = [
    { code: "INR", name: "Indian Rupee", symbol: "₹" },
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "GBP", name: "British Pound", symbol: "£" },
    { code: "JPY", name: "Japanese Yen", symbol: "¥" },
    { code: "AUD", name: "Australian Dollar", symbol: "A$" },
    { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
    { code: "CHF", name: "Swiss Franc", symbol: "Fr" },
    { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
    { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$" },
    { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
    { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$" },
    { code: "KRW", name: "South Korean Won", symbol: "₩" },
    { code: "MXN", name: "Mexican Peso", symbol: "$" },
    { code: "BRL", name: "Brazilian Real", symbol: "R$" },
    { code: "RUB", name: "Russian Ruble", symbol: "₽" },
    { code: "ZAR", name: "South African Rand", symbol: "R" },
    { code: "SEK", name: "Swedish Krona", symbol: "kr" },
    { code: "NOK", name: "Norwegian Krone", symbol: "kr" },
    { code: "DKK", name: "Danish Krone", symbol: "kr" },
    { code: "PLN", name: "Polish Zloty", symbol: "zł" },
    { code: "THB", name: "Thai Baht", symbol: "฿" },
    { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp" },
    { code: "MYR", name: "Malaysian Ringgit", symbol: "RM" },
    { code: "PHP", name: "Philippine Peso", symbol: "₱" },
    { code: "TRY", name: "Turkish Lira", symbol: "₺" },
    { code: "SAR", name: "Saudi Riyal", symbol: "﷼" },
    { code: "AED", name: "UAE Dirham", symbol: "د.إ" },
    { code: "QAR", name: "Qatari Riyal", symbol: "﷼" },
    { code: "KWD", name: "Kuwaiti Dinar", symbol: "د.ك" },
    { code: "BHD", name: "Bahraini Dinar", symbol: ".د.ب" },
    { code: "EGP", name: "Egyptian Pound", symbol: "£" },
    { code: "NGN", name: "Nigerian Naira", symbol: "₦" },
    { code: "PKR", name: "Pakistani Rupee", symbol: "₨" },
    { code: "BDT", name: "Bangladeshi Taka", symbol: "৳" },
    { code: "LKR", name: "Sri Lankan Rupee", symbol: "Rs" },
    { code: "VND", name: "Vietnamese Dong", symbol: "₫" },
    { code: "TWD", name: "Taiwan Dollar", symbol: "NT$" },
    { code: "ARS", name: "Argentine Peso", symbol: "$" },
    { code: "CLP", name: "Chilean Peso", symbol: "$" },
    { code: "COP", name: "Colombian Peso", symbol: "$" },
    { code: "PEN", name: "Peruvian Sol", symbol: "S/" },
    { code: "CZK", name: "Czech Koruna", symbol: "Kč" },
    { code: "HUF", name: "Hungarian Forint", symbol: "Ft" },
    { code: "RON", name: "Romanian Leu", symbol: "lei" },
    { code: "UAH", name: "Ukrainian Hryvnia", symbol: "₴" }
];

const exchangeRates = {
    "INR": 1.00,
    "USD": 0.0120,
    "EUR": 0.0111,
    "GBP": 0.0095,
    "JPY": 1.788,
    "AUD": 0.0183,
    "CAD": 0.0166,
    "CHF": 0.0106,
    "CNY": 0.0872,
    "HKD": 0.0936,
    "SGD": 0.0161,
    "NZD": 0.0202,
    "KRW": 16.68,
    "MXN": 0.243,
    "BRL": 0.0660,
    "RUB": 1.161,
    "ZAR": 0.219,
    "SEK": 0.130,
    "NOK": 0.133,
    "DKK": 0.0828,
    "PLN": 0.0477,
    "THB": 0.432,
    "IDR": 197.5,
    "MYR": 0.0564,
    "PHP": 0.704,
    "TRY": 0.411,
    "SAR": 0.0450,
    "AED": 0.0441,
    "QAR": 0.0437,
    "KWD": 0.00369,
    "BHD": 0.00452,
    "EGP": 0.593,
    "NGN": 19.80,
    "PKR": 3.345,
    "BDT": 1.443,
    "LKR": 3.585,
    "VND": 297.5,
    "TWD": 0.387,
    "ARS": 11.95,
    "CLP": 11.52,
    "COP": 49.68,
    "PEN": 0.0450,
    "CZK": 0.276,
    "HUF": 4.328,
    "RON": 0.0552,
    "UAH": 0.496
};

function populateCurrencies() {
    const fromSelect = document.getElementById('fromCurrency');
    const toSelect = document.getElementById('toCurrency');

    currencies.forEach(currency => {
        const option1 = document.createElement('option');
        option1.value = currency.code;
        option1.textContent = currency.code + ' - ' + currency.name;
        fromSelect.appendChild(option1);

        const option2 = document.createElement('option');
        option2.value = currency.code;
        option2.textContent = currency.code + ' - ' + currency.name;
        toSelect.appendChild(option2);
    });

    fromSelect.value = 'INR';
    toSelect.value = 'INR';
}

function swapCurrencies() {
    const fromSelect = document.getElementById('fromCurrency');
    const toSelect = document.getElementById('toCurrency');

    const temp = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = temp;

    convertCurrency();
}

function convertCurrency() {
    const amount = parseFloat(document.getElementById('amount').value);
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;

    if (isNaN(amount) || amount < 0) {
        alert('Please enter a valid amount');
        return;
    }

    const fromRate = exchangeRates[fromCurrency];
    const toRate = exchangeRates[toCurrency];

    const amountInINR = amount / fromRate;
    const convertedAmount = amountInINR * toRate;

    const fromCurrencyData = currencies.find(c => c.code === fromCurrency);
    const toCurrencyData = currencies.find(c => c.code === toCurrency);

    const rate = toRate / fromRate;

    document.getElementById('fromText').textContent = amount.toLocaleString() + ' ' + fromCurrency + ' =';
    document.getElementById('toText').textContent = convertedAmount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 6
    }) + ' ' + toCurrency;

    document.getElementById('rateText').textContent = 'Exchange Rate: 1 ' + fromCurrency + ' = ' + rate.toLocaleString(undefined, {
        minimumFractionDigits: 6,
        maximumFractionDigits: 6
    }) + ' ' + toCurrency;

    document.getElementById('result').style.display = 'block';
}

window.onload = function () {
    populateCurrencies();
    convertCurrency();
};
