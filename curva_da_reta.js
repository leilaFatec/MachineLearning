// Função para calcular a equação da reta e o coeficiente de determinação R^2
function calcularRegressaoLinear(dados) {
    const n = dados.length;

    // Somatórios necessários
    let somaX = 0, somaY = 0, somaXY = 0, somaX2 = 0;

    // Calcular os somatórios
    for (let i = 0; i < n; i++) {
        somaX += dados[i][0];
        somaY += dados[i][1];
        somaXY += dados[i][0] * dados[i][1];
        somaX2 += dados[i][0] * dados[i][0];
    }

    // Calculando a inclinação (m) e a interceptação (b)
    const m = (n * somaXY - somaX * somaY) / (n * somaX2 - somaX * somaX);
    const b = (somaY - m * somaX) / n;

    // Calculando o valor de R^2
    let somaTotal = 0, somaResiduos = 0, mediaY = somaY / n;

    // Calculando os erros
    for (let i = 0; i < n; i++) {
        const yPredito = m * dados[i][0] + b;
        somaResiduos += Math.pow(dados[i][1] - yPredito, 2);
        somaTotal += Math.pow(dados[i][1] - mediaY, 2);
    }

    const r2 = 1 - (somaResiduos / somaTotal);

    // Retorna os resultados: m, b e R^2
    return {
        m: m, // Inclinação da reta
        b: b, // Interceptação
        r2: r2 // Coeficiente de determinação R^2
    };
}

// Exemplo de uso com dados em um vetor (array)
const dados = [
    [1, 2],
    [2, 3],
    [3, 5],
    [4, 7],
    [5, 8]
];

// Chamando a função para calcular a regressão linear
const resultado = calcularRegressaoLinear(dados);

// Exibindo o resultado
console.log("Equação da reta: y = " + resultado.m.toFixed(2) + "x + " + resultado.b.toFixed(2));
console.log("Coeficiente de determinação R^2: " + resultado.r2.toFixed(4));
