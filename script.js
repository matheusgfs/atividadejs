const readline = require('readline');
const moment = require('moment'); // para manipulação de datas


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const servicos = [];
const barbeiros = [];
const clientes = [];

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
      return cadastrarCliente();
    }
  }

  rl.question('\nDigite o nome do serviço (ou "fim" para encerrar): ', nome => {
    if (nome.toLowerCase() === 'fim') {
      servicosCadastrados = true;

      if (!barbeirosCadastrados) {
        console.log('\n⚠️  Agora falta cadastrar os barbeiros.');
        return perguntarQuantidadeCadeiras();
      } else {
        return cadastrarCliente();
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
        return cadastrarCliente();
      }
    }

    rl.question('Digite a especialidade do barbeiro: ', especialidade => {
      // Inicializa agenda vazia para o barbeiro
      barbeiros.push({ nome, especialidade, agenda: {} });
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
    return cadastrarCliente();
  }
}

// Função para cadastro de clientes com agendamento
function cadastrarCliente() {
  console.log('\n👤 Cadastro de Clientes');

  rl.question('\nDigite o nome do cliente (ou "fim" para encerrar): ', nome => {
    if (nome.toLowerCase() === 'fim') {
      return finalizar();
    }

    rl.question('Digite o telefone do cliente: ', telefone => {
      // Escolher serviço
      console.log('\n📋 Serviços disponíveis:');
      servicos.forEach((s, i) => {
        console.log(`${i + 1} - ${s.nome} (R$ ${s.preco.toFixed(2).replace('.', ',')})`);
      });

      rl.question('\nDigite o número do serviço desejado: ', numServico => {
        const indexServico = parseInt(numServico) - 1;

        if (isNaN(indexServico) || indexServico < 0 || indexServico >= servicos.length) {
          console.log('❌ Serviço inválido. Tente novamente.');
          return cadastrarCliente();
        }

        // Escolher barbeiro
        console.log('\n✂️ Barbeiros disponíveis:');
        barbeiros.forEach((b, i) => {
          console.log(`${i + 1} - ${b.nome} (Especialidade: ${b.especialidade})`);
        });

        rl.question('\nDigite o número do barbeiro preferido: ', numBarbeiro => {
          const indexBarbeiro = parseInt(numBarbeiro) - 1;
          if (isNaN(indexBarbeiro) || indexBarbeiro < 0 || indexBarbeiro >= barbeiros.length) {
            console.log('❌ Barbeiro inválido. Tente novamente.');
            return cadastrarCliente();
          }
          const barbeiroEscolhido = barbeiros[indexBarbeiro];

          // Perguntar data da agenda
          rl.question('\nDigite a data desejada para o agendamento (formato YYYY-MM-DD): ', dataEscolhida => {
            if (!moment(dataEscolhida, 'YYYY-MM-DD', true).isValid()) {
              console.log('❌ Data inválida. Use o formato YYYY-MM-DD.');
              return cadastrarCliente();
            }

            // Horários possíveis: 09:00 até 16:00 (1h cada)
            const horariosPossiveis = [];
            for (let hora = 9; hora <= 16; hora++) {
              horariosPossiveis.push(`${hora.toString().padStart(2, '0')}:00`);
            }

            const horariosAgendados = barbeiroEscolhido.agenda[dataEscolhida] || [];
            const horariosDisponiveis = horariosPossiveis.filter(h => !horariosAgendados.includes(h));

            if (horariosDisponiveis.length === 0) {
              console.log('🚫 Não há horários disponíveis para esse dia. Escolha outra data.');
              return cadastrarCliente();
            }

            console.log('\n🕒 Horários disponíveis:');
            horariosDisponiveis.forEach((h, i) => {
              console.log(`${i + 1} - ${h}`);
            });

            rl.question('\nEscolha o número do horário desejado: ', numHorario => {
              const indexHorario = parseInt(numHorario) - 1;
              if (isNaN(indexHorario) || indexHorario < 0 || indexHorario >= horariosDisponiveis.length) {
                console.log('❌ Horário inválido. Tente novamente.');
                return cadastrarCliente();
              }

              const horarioEscolhido = horariosDisponiveis[indexHorario];

              // Marcar agenda do barbeiro
              if (!barbeiroEscolhido.agenda[dataEscolhida]) {
                barbeiroEscolhido.agenda[dataEscolhida] = [];
              }
              barbeiroEscolhido.agenda[dataEscolhida].push(horarioEscolhido);

              clientes.push({
                nome,
                telefone,
                servico: servicos[indexServico].nome,
                barbeiro: barbeiroEscolhido.nome,
                data: dataEscolhida,
                horario: horarioEscolhido,
              });

              console.log(`✅ Cliente "${nome}" agendado para ${dataEscolhida} às ${horarioEscolhido} com o barbeiro ${barbeiroEscolhido.nome}.\n`);
              cadastrarCliente();
            });
          });
        });
      });
    });
  });
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

  console.log('\n🧑‍🤝‍🧑 Clientes cadastrados:');
  if (clientes.length === 0) {
    console.log('Nenhum cliente foi cadastrado.');
  } else {
    clientes.forEach((c, i) => {
      console.log(`${i + 1}. ${c.nome} | Tel: ${c.telefone} | Serviço: ${c.servico} | Barbeiro: ${c.barbeiro} | Data: ${c.data} | Horário: ${c.horario}`);
    });
  }

  console.log('\n✅ Cadastro finalizado. Obrigada por usar o sistema!');
  rl.close();
}

menuInicial();