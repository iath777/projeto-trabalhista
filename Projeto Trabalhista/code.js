document.addEventListener('DOMContentLoaded', function() {
    const calcularBtn = document.getElementById('calcularBtn');
    const limparBtn = document.getElementById('limparBtn');
    
    calcularBtn.addEventListener('click', calcularSalario);
    limparBtn.addEventListener('click', limparCampos);
    
    function calcularSalario() {
        // Obter valores dos inputs
        const valorHora = parseFloat(document.getElementById('valorHora').value);
        const horasTrabalhadas = parseFloat(document.getElementById('horasTrabalhadas').value);
        const valeTransporte = document.querySelector('input[name="valeTransporte"]:checked').value;
        const outrasDeducoes = parseFloat(document.getElementById('outrasDeducoes').value) || 0;
        
        // Verificar se os valores são válidos
        if (isNaN(valorHora) || isNaN(horasTrabalhadas)) {
            alert('Por favor, preencha os valores corretamente.');
            return;
        }
        
        // Calcular salário bruto
        const salarioBruto = valorHora * horasTrabalhadas;
        
        // Calcular INSS (progressivo por faixas)
        let inss = 0;
        let baseInss = salarioBruto;
        
        // 1ª faixa
        if (baseInss > 1320.00) {
            inss += 1320.00 * 0.075;
            baseInss -= 1320.00;
        } else {
            inss += baseInss * 0.075;
            baseInss = 0;
        }
        
        // 2ª faixa
        if (baseInss > 0) {
            const valorFaixa = 2571.29 - 1320.00;
            if (baseInss > valorFaixa) {
                inss += valorFaixa * 0.09;
                baseInss -= valorFaixa;
            } else {
                inss += baseInss * 0.09;
                baseInss = 0;
            }
        }
        
        // 3ª faixa
        if (baseInss > 0) {
            const valorFaixa = 3856.94 - 2571.29;
            if (baseInss > valorFaixa) {
                inss += valorFaixa * 0.12;
                baseInss -= valorFaixa;
            } else {
                inss += baseInss * 0.12;
                baseInss = 0;
            }
        }
        
        // 4ª faixa
        if (baseInss > 0) {
            const valorFaixa = 7507.49 - 3856.94;
            if (baseInss > valorFaixa) {
                inss += valorFaixa * 0.14;
                baseInss -= valorFaixa;
            } else {
                inss += baseInss * 0.14;
                baseInss = 0;
            }
        }
        
        // Calcular IRPF
        let irpf = 0;
        const baseIrpf = salarioBruto - inss;
        
        if (baseIrpf <= 2112.00) {
            irpf = 0.0;
        } else if (baseIrpf <= 2826.65) {
            irpf = baseIrpf * 0.075 - 158.40;
        } else if (baseIrpf <= 3751.06) {
            irpf = baseIrpf * 0.15 - 370.40;
        } else if (baseIrpf <= 4664.68) {
            irpf = baseIrpf * 0.225 - 651.73;
        } else {
            irpf = baseIrpf * 0.275 - 884.96;
        }
        
        // Calcular vale-transporte
        const vt = valeTransporte === 'S' ? salarioBruto * 0.06 : 0;
        
        // Calcular salário líquido
        const salarioLiquido = salarioBruto - inss - irpf - vt - outrasDeducoes;
        
        // Exibir resultados
        document.getElementById('salarioBruto').textContent = formatarMoeda(salarioBruto);
        document.getElementById('inss').textContent = `- ${formatarMoeda(inss)}`;
        document.getElementById('irpf').textContent = `- ${formatarMoeda(irpf)}`;
        document.getElementById('valeTransporte').textContent = `- ${formatarMoeda(vt)}`;
        document.getElementById('outrasDeducoesResult').textContent = `- ${formatarMoeda(outrasDeducoes)}`;
        document.getElementById('salarioLiquido').textContent = formatarMoeda(salarioLiquido);
    }
    
    function limparCampos() {
        document.getElementById('valorHora').value = '';
        document.getElementById('horasTrabalhadas').value = '';
        document.getElementById('vtSim').checked = true;
        document.getElementById('outrasDeducoes').value = '0';
        
        document.getElementById('salarioBruto').textContent = 'R$ 0,00';
        document.getElementById('inss').textContent = '- R$ 0,00';
        document.getElementById('irpf').textContent = '- R$ 0,00';
        document.getElementById('valeTransporte').textContent = '- R$ 0,00';
        document.getElementById('outrasDeducoesResult').textContent = '- R$ 0,00';
        document.getElementById('salarioLiquido').textContent = 'R$ 0,00';
    }
    
    function formatarMoeda(valor) {
        return 'R$ ' + valor.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+\,)/g, '$1.');
    }
});