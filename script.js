const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const servicos = [];
const barbeiros = [];

let servicosCadastrados = false;
let barbeirosCadastrados = false;
let quantidadeCadeiras = 0;

console.log('💈 Sistema de Cadastro da Barbearia\n');

function menuInicial() {
  console.log('\nO que você deseja fazer primeiro?');
  console.log('1 - Cadastrar serviços');
  console.log('2 - Cadastrar barbeiros');

  rl.question('\nDigite a opção desejada: ', opcao => {
    switch (opcao) {
      case '1':
        cadastrarServico();
        break;
      case '2':
        perguntarQuantidadeCadeiras();
        break;
      default:
        console.log('❌ Opção inválida. Tente novamente.');
        menuInicial();
    }
  });
}

function perguntarQuantidadeCadeiras() {
  rl.question('\nQuantas cadeiras estão disponíveis na barbearia? ', resposta => {
    const qtd = parseInt(resposta);
    if (isNaN(qtd) || qtd <= 0) {
      console.log('❌ Quantidade inválida. Tente novamente.');
      return perguntarQuantidadeCadeiras();
    }

    quantidadeCadeiras = qtd;
    console.log(`✅ ${quantidadeCadeiras} cadeiras registradas.\n`);
    cadastrarBarbeiro();
  });
}

function cadastrarServico() {
  if (servicos.length >= 5) {
    console.log('\n🚫 Limite de 5 serviços atingido.');
    servicosCadastrados = true;
    if (!barbeirosCadastrados) {
      console.log('\n⚠️  Agora falta cadastrar os barbeiros.');
      return perguntarQuantidadeCadeiras();
    } else {
      return finalizar();
    }
  }

  rl.question('\nDigite o nome do serviço (ou "fim" para encerrar): ', nome => {
    if (nome.toLowerCase() === 'fim') {
      servicosCadastrados = true;

      if (!barbeirosCadastrados) {
        console.log('\n⚠️  Agora falta cadastrar os barbeiros.');
        return perguntarQuantidadeCadeiras();
      } else {
        return finalizar();
      }
    }

    rl.question('Digite o preço do serviço: ', preco => {
      const valor = parseFloat(preco);
      if (isNaN(valor)) {
        console.log('❌ Preço inválido! Tente novamente.');
        return cadastrarServico();
      }

      servicos.push({ nome, preco: valor });
      console.log(`✅ Serviço "${nome}" cadastrado com sucesso!\n`);
      cadastrarServico();
    });
  });
}

function cadastrarBarbeiro() {
  rl.question('\nDigite o nome do barbeiro (ou "fim" para encerrar): ', nome => {
    if (nome.toLowerCase() === 'fim') {
      barbeirosCadastrados = true;

      if (!servicosCadastrados) {
        console.log('\n⚠️  Agora falta cadastrar os serviços.');
        return cadastrarServico();
      } else {
        return finalizar();
      }
    }

    rl.question('Digite a especialidade do barbeiro: ', especialidade => {
      barbeiros.push({ nome, especialidade });
      console.log(`✅ Barbeiro "${nome}" cadastrado com sucesso!\n`);

      if (barbeiros.length === quantidadeCadeiras) {
        console.log('\n⚠️  Limite de cadeiras atingido.');
        verificarFinalizacao();
      } else if (barbeiros.length > quantidadeCadeiras) {
        console.log('\n🚫 O número de barbeiros excede o limite de cadeiras disponíveis!');
        rl.question('❓ Deseja continuar cadastrando mesmo assim? (s/n): ', resposta => {
          if (resposta.toLowerCase() === 's') {
            cadastrarBarbeiro();
          } else {
            barbeirosCadastrados = true;
            verificarFinalizacao();
          }
        });
      } else {
        cadastrarBarbeiro();
      }
    });
  });
}

function verificarFinalizacao() {
  if (!servicosCadastrados) {
    console.log('\n⚠️  Agora falta cadastrar os serviços.');
    return cadastrarServico();
  } else {
    return finalizar();
  }
}

function finalizar() {
  console.log('\n🧾 Serviços cadastrados:');
  servicos.forEach((s, i) => {
    console.log(`${i + 1}. ${s.nome} - R$ ${s.preco.toFixed(2).replace('.', ',')}`);
  });

  console.log('\n✂️ Barbeiros cadastrados:');
  barbeiros.forEach((b, i) => {
    console.log(`${i + 1}. ${b.nome} - Especialidade: ${b.especialidade}`);
  });

  console.log('\n✅ Cadastro finalizado. Obrigada por usar o sistema!');
  rl.close();
}

menuInicial();
