export function formatCurrency(amount, currency='brl'){

    let formatedCurrency = ''

    switch(currency.toLowerCase()){
        case 'usd':
            formatedCurrency = parseFloat(amount).toLocaleString('en-US', {style:'currency' ,currency: currency, maximumFractionDigits: 2})
            break;
        case 'gbp':
            formatedCurrency = parseFloat(amount).toLocaleString('en-GB', {style:'currency' ,currency: currency, maximumFractionDigits: 2})
            break;
        case 'eur':
            formatedCurrency = parseFloat(amount).toLocaleString('pt-PT', {style:'currency' ,currency: currency, maximumFractionDigits: 2})
            break;
        case 'jpy':
            formatedCurrency = parseFloat(amount).toLocaleString('ja-JP', {style:'currency' ,currency: currency, maximumFractionDigits: 2})
            break;
        case 'rub':
            formatedCurrency = parseFloat(amount).toLocaleString('ru-RU', {style:'currency' ,currency: currency, maximumFractionDigits: 2})
            break;
        case 'chf':
            formatedCurrency = parseFloat(amount).toLocaleString('zh-CN', {style:'currency' ,currency: currency, maximumFractionDigits: 2})
            break;
        case 'cad':
            formatedCurrency = parseFloat(amount).toLocaleString('en-CA', {style:'currency' ,currency: currency, maximumFractionDigits: 2})
            break;
        default:
            formatedCurrency = parseFloat(amount).toLocaleString('pt-BR', {style:'currency' ,currency: currency, maximumFractionDigits: 2})
            break;
    } 
    return `${formatedCurrency}`
}