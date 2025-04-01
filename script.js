const DAYS = 50;

// Função para buscar dados históricos do Bitcoin
async function getBitcoinHistoricalData() {
	try {
		const response = await fetch(
			`https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${DAYS}&interval=daily`,
		);
		const data = await response.json();

		// Converte os dados em formato [x, y], onde x é o índice do dia (0 a 49) e y é o preço
		const priceArray = data.prices.map(([timestamp, price], index) => [
			index,
			price,
		]);

		return priceArray;
	} catch (error) {
		console.error("Erro ao buscar dados:", error);
		return [];
	}
}

// Função principal para calcular regressão linear e R²
function calculateLinearRegression(data) {
	const n = data.length;

	// Calculando as somas necessárias
	let sumX;
	let sumY;
	let sumXY;
	let sumX2;
	let sumY2;

	sumX = 0;
	sumY = 0;
	sumXY = 0;
	sumX2 = 0;
	sumY2 = 0;

	for (let i = 0; i < n; i++) {
		const x = data[i][0]; // Índice do dia
		const y = data[i][1]; // Preço

		sumX += x;
		sumY += y;
		sumXY += x * y;
		sumX2 += x * x;
		sumY2 += y * y;
	}

	// Calculando os coeficientes da reta (y = mx + b)
	const m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX); // inclinação
	const b = (sumY - m * sumX) / n; // intercepto

	// Calculando R²
	const yMean = sumY / n;

	// Soma dos quadrados da regressão (SSR) e total (SST)
	let ssr;
	let sst;

	ssr = 0;
	sst = 0;

	for (let i = 0; i < n; i++) {
		const x = data[i][0];
		const y = data[i][1];
		const yPredicted = m * x + b;

		ssr += (yPredicted - yMean) ** 2;
		sst += (y - yMean) ** 2;
	}

	const r2 = ssr / sst;

	return {
		slope: m, // inclinação da reta
		intercept: b, // intercepto
		r2: r2, // coeficiente de determinação
		equation: `y = ${m.toFixed(4)}x + ${b.toFixed(4)}`, // equação da reta
	};
}

// Função para fazer previsões
function predictPrice(x, model) {
	return model.slope * x + model.intercept;
}

// Função para criar o gráfico
function createChart(data, model) {
	const ctx = document.getElementById("bitcoinChart").getContext("2d");

	// Dados reais
	const realData = data.map(([x, y]) => ({ x, y }));

	// Dados da reta de regressão (calculados para cada x)
	const regressionData = data.map(([x]) => ({
		x,
		y: predictPrice(x, model),
	}));

	new Chart(ctx, {
		type: "scatter",
		data: {
			datasets: [
				{
					label: "Preços Reais do Bitcoin",
					data: realData,
					backgroundColor: "rgba(54, 162, 235, 0.6)",
					borderColor: "rgba(54, 162, 235, 1)",
					borderWidth: 1,
					pointRadius: 4,
					showLine: false, // Apenas pontos
				},
				{
					label: "Reta de Regressão",
					data: regressionData,
					type: "line", // Linha para a regressão
					fill: false,
					borderColor: "rgba(255, 99, 132, 1)",
					borderWidth: 2,
					pointRadius: 0, // Sem pontos na linha
					tension: 0, // Linha reta
				},
			],
		},
		options: {
			scales: {
				x: {
					title: { display: true, text: "Dias" },
					type: "linear",
					position: "bottom",
				},
				y: {
					title: { display: true, text: "Preço (USD)" },
				},
			},
			plugins: {
				title: {
					display: true,
					text: `Tendência do Bitcoin (R² = ${model.r2.toFixed(4)})`,
				},
				legend: { display: true },
			},
		},
	});
}

// Função principal que integra tudo
async function analyzeAndPlotBitcoinTrend() {
	// Busca os dados
	const bitcoinData = await getBitcoinHistoricalData();

	if (bitcoinData.length === 0) {
		console.log("Nenhum dado disponível para análise.");
		return;
	}

	// Calcula a regressão
	const result = calculateLinearRegression(bitcoinData);

	// Exibe os resultados
	console.log("Equação da reta:", result.equation);
	console.log("Inclinação (m):", result.slope);
	console.log("Intercepto (b):", result.intercept);
	console.log("R²:", result.r2);

	// Faz uma previsão para o dia 51 (próximo dia após os 50 dias)
	const nextDay = DAYS;
	const predictedPrice = predictPrice(nextDay, result);
	console.log(`Preço previsto para o dia ${nextDay + 1}:`, predictedPrice);

	createChart(bitcoinData, result);
}

// Executa a análise
analyzeAndPlotBitcoinTrend();
