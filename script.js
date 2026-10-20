const form = document.getElementById('form-busca');
const inputCidade = document.getElementById('input-cidade');
const cardClima = document.getElementById('card-clima');
const nomeCidade = document.getElementById('nome-cidade');
const temperatura = document.getElementById('temperatura');
const descricaoClima = document.getElementById('descricao-clima');
const umidade = document.getElementById('umidade');
const vento = document.getElementById('vento');
const mensagemStatus = document.getElementById('mensagem-status');





function traduzirClima(codigo) {
    const codigos = {
        0: 'Céu limpo ☀️',
        1: 'Predominantemente limpo 🌤️',
        2: 'Parcialmente nublado ⛅',
        3: 'Nublado ☁️',
        45: 'Névoa 🌫️',
        48: 'Geada com névoa 🌫️',
        51: 'Garoa leve 🌧️',
        53: 'Garoa moderada 🌧️',
        55: 'Garoa intensa 🌧️',
        61: 'Chuva leve 🌧️',
        63: 'Chuva moderada 🌧️',
        65: 'Chuva forte 🌧️',
        80: 'Pancadas de chuva 🌦️',
        95: 'Trovoada ⛈️'
    };
    return codigos[codigo] || 'Tempo variado 🌈';
}





async function buscarClima(cidade) {
    try {
        mensagemStatus.textContent = 'Buscando informações... ⏳';
        cardClima.classList.add('escondido');

       

        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cidade)}&count=1&language=pt&format=json`;
        const resGeo = await fetch(geoUrl);
        const dataGeo = await resGeo.json();



        if (!dataGeo.results || dataGeo.results.length === 0) {
            mensagemStatus.textContent = '❌ Cidade não encontrada. Tente novamente.';
            return;
        }



        const local = dataGeo.results[0];
        const { latitude, longitude, name, country } = local;

       

        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`;
        const resWeather = await fetch(weatherUrl);
        const dataWeather = await resWeather.json();

        const climaAtual = dataWeather.current;



        nomeCidade.textContent = `${name}, ${country || ''}`;
        temperatura.textContent = Math.round(climaAtual.temperature_2m);
        descricaoClima.textContent = traduzirClima(climaAtual.weather_code);
        umidade.textContent = `${climaAtual.relative_humidity_2m}%`;
        vento.textContent = `${Math.round(climaAtual.wind_speed_10m)} km/h`;

      

        mensagemStatus.textContent = '';
        cardClima.classList.remove('escondido');



    } catch (erro) {
        console.error('Erro na requisição:', erro);
        mensagemStatus.textContent = '⚠️ Erro ao conectar com o serviço de clima.';
    }
}


form.addEventListener('submit', function (event) {
    event.preventDefault();
    const cidadeDigitada = inputCidade.value.trim();

    if (cidadeDigitada !== '') {
        buscarClima(cidadeDigitada);
    }
});