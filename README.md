# Projeto Chatbot de Pré-Diagnóstico com IA

## 📑 Sumário

- [Visão Geral do Projeto](https://www.google.com/search?q=%23-vis%C3%A3o-geral-do-projeto)
- [Funcionalidades Principais](https://www.google.com/search?q=%23-funcionalidades-principais)
- [Tecnologias Utilizadas](https://www.google.com/search?q=%23-tecnologias-utilizadas)
- [Como Começar (Configuração e Deploy)](https://www.google.com/search?q=%23-como-come%C3%A7ar-configura%C3%A7%C3%A3o-e-deploy)
- [Estrutura do Fluxo de Conversa (`conversation.jsonc`)](https://www.google.com/search?q=%23-estrutura-do-fluxo-de-conversa-conversationjsonc)
  - [Estrutura Base](https://www.google.com/search?q=%23estrutura-base)
  - [Tipos de Mensagens (Nós da Conversa)](https://www.google.com/search?q=%23tipos-de-mensagens-n%C3%B3s-da-conversa)
    - [1. `type: "text"` - Mensagem de Texto](https://www.google.com/search?q=%231-type-text---mensagem-de-texto)
    - [2. `type: "option"` - Mensagem com Opções](https://www.google.com/search?q=%232-type-option---mensagem-com-op%C3%A7%C3%B5es)
    - [3. `type: "form"` - Formulário de Múltiplas Entradas](https://www.google.com/search?q=%233-type-form---formul%C3%A1rio-de-m%C3%BAltiplas-entradas)
    - [4. `type: "avatar"` - Seleção de Parte do Corpo (Geral)](https://www.google.com/search?q=%234-type-avatar---sele%C3%A7%C3%A3o-de-parte-do-corpo-geral)
    - [5. `type: "body_parts"` - Seleção de Parte do Corpo (Específica)](https://www.google.com/search?q=%235-type-body_parts---sele%C3%A7%C3%A3o-de-parte-do-corpo-espec%C3%ADfica)
    - [6. `type: "final_result"` - Nó de Finalização](https://www.google.com/search?q=%236-type-final_result---n%C3%B3-de-finaliza%C3%A7%C3%A3o)
- [Configurações de Layout](https://www.google.com/search?q=%23-configura%C3%A7%C3%B5es-de-layout)

## 📖 Visão Geral do Projeto

Este projeto consiste em um chatbot inteligente projetado para realizar uma triagem inicial de pacientes. Através de um fluxo de perguntas e respostas pré-definido, o agente de IA coleta informações sobre os sintomas do usuário para fornecer um possível direcionamento ou diagnóstico preliminar, auxiliando na identificação de quadros de emergência e na coleta de dados relevantes para um futuro atendimento médico.

Toda a lógica e o fluxo da conversa são controlados por um arquivo de configuração central, o `conversation.jsonc`, que permite uma personalização fácil e rápida das interações do chatbot.

## ✨ Funcionalidades Principais

- **Fluxo de Conversa Dinâmico:** As perguntas e respostas são carregadas a partir de um arquivo JSON, permitindo fácil modificação sem a necessidade de alterar o código-fonte da aplicação.
- **Coleta de Dados Estruturados:** Coleta informações do usuário através de textos, opções de múltipla escolha e formulários.
- **Armazenamento no Firebase:** Todas as interações e dados coletados durante a conversa são armazenados de forma segura no Firebase.
- **Interface Interativa:** Inclui componentes visuais, como a seleção de partes do corpo em um avatar, para facilitar a descrição dos sintomas.
- **Implantação Contínua:** As alterações no fluxo da conversa são implantadas automaticamente ao enviar as atualizações para o repositório Git.

## 🚀 Tecnologias Utilizadas

- **Firebase:** Utilizado como backend para armazenamento de dados das conversas e para o deploy da aplicação (Firebase Hosting/Cloud Functions).
- **Git:** Para controle de versão e para acionar o processo de deploy.

## ⚙️ Como Começar (Configuração e Deploy)

Para modificar o fluxo de conversa do chatbot (adicionar, remover ou alterar perguntas), você precisa editar o arquivo `conversation.jsonc` e enviar as alterações para o repositório Git. O deploy para o Firebase App será acionado automaticamente.

Siga os passos abaixo:

### Passo 1: Clonar o Projeto

Primeiro, você precisa ter uma cópia do projeto na sua máquina local. Abra o terminal e execute o seguinte comando:

```bash
git clone <URL_DO_SEU_REPOSITORIO_GIT>
cd <NOME_DO_DIRETORIO_DO_PROJETO>
```

### Passo 2: Alterar o Fluxo da Conversa

1.  Navegue até o diretório `assets/conversation/`.
2.  Abra o arquivo `conversation.jsonc` em um editor de código de sua preferência (como VS Code, Sublime Text, etc.).
3.  Faça as alterações desejadas na estrutura do JSON. Você pode adicionar novos blocos de perguntas, alterar textos ou mudar a ordem da conversa. Consulte a seção **[Estrutura do Fluxo de Conversa](https://www.google.com/search?q=%23-estrutura-do-fluxo-de-conversa-conversationjsonc)** para entender como cada parte funciona.
4.  Salve o arquivo após concluir as edições.

### Passo 3: Comitar e Enviar as Alterações

Após salvar o arquivo, você precisa enviar suas alterações para o repositório remoto. Isso irá acionar o processo de deploy automático.

```bash
# Adiciona o arquivo modificado à área de "stage"
git add assets/conversation/conversation.jsonc

# Cria um "commit" com uma mensagem descritiva
git commit -m "feat: atualiza fluxo de perguntas sobre febre"
# (Use uma mensagem que descreva bem o que você alterou)

# Envia as alterações para o repositório principal
git push origin main
# (ou 'master', dependendo do nome da sua branch principal)
```

Pronto\! Após o `push`, a automação de deploy (CI/CD) configurada no projeto irá atualizar a aplicação no Firebase com o novo fluxo de conversa.

---

## 🏗️ Estrutura do Fluxo de Conversa (`conversation.jsonc`)

O coração do chatbot reside no arquivo `conversation.jsonc`. Ele define cada passo da interação com o usuário.

### Estrutura Base

O arquivo possui uma estrutura principal com três chaves: `description`, `title`, e `flow`.

- `description`: Uma breve descrição do modelo do chatbot.
- `title`: O título que aparece no cabeçalho do chat (ex: "Dr. Daniel").
- `flow`: Um array de objetos, onde cada objeto representa um "nó" ou uma etapa da conversa. A ordem da conversa é definida pela propriedade `next` em cada nó.

<!-- end list -->

```json
{
  "description": "Modelo chatbot",
  "title": "Dr. Daniel",
  "flow": [
    // ... todos os nós da conversa vão aqui ...
  ]
}
```

### Tipos de Mensagens (Nós da Conversa)

Cada objeto dentro do array `flow` representa uma mensagem ou interação. Ele deve ter um `id` único, que serve como um ponteiro para a navegação, e um `type`, que define seu comportamento.

#### 1\. `type: "text"` - Mensagem de Texto

Este é o tipo mais simples. Ele exibe uma mensagem de texto para o usuário. Pode ou não esperar uma resposta.

- **Propriedades Comuns:**

  - `id`: Identificador único do nó (ex: `"0"`).
  - `type`: `"text"`.
  - `text`: O texto a ser exibido (suporta quebras de linha com `\n` e emojis).
  - `userResponse`: `boolean`. Se `true`, o chatbot espera que o usuário digite uma resposta. Se `false`, a conversa avança automaticamente para o próximo nó.
  - `sender`: Quem envia a mensagem (`"bot"` ou `"user"`).
  - `direction`: Alinhamento da mensagem na tela (`"left"` ou `"right"`).
  - `next`: O `id` do próximo nó da conversa.
  - `variableName` (opcional): Se `userResponse` for `true`, armazena a resposta do usuário nesta variável.

- **Exemplo (Mensagem informativa):**

<!-- end list -->

```json
{
  "id": "0",
  "type": "text",
  "text": "Olá! Sou seu médico virtual. Estou aqui para te ajudar. 😊👨‍⚕️",
  "userResponse": false,
  "direction": "left",
  "sender": "bot",
  "next": "1A"
}
```

#### 2\. `type: "option"` - Mensagem com Opções

Exibe uma pergunta seguida de botões com opções selecionáveis pelo usuário. Pode permitir seleção única ou múltipla.

- **Propriedades Comuns:**

  - `id`, `type`, `text`, `sender`, `direction`.
  - `userResponse`: Sempre `true` para este tipo.
  - `multipleOptions`: `boolean`. Se `true`, o usuário pode selecionar várias opções. Se `false`, apenas uma.
  - `variableName`: Nome da variável que armazenará o valor da opção selecionada.
  - `options`: Um array de objetos, onde cada objeto é um botão de opção.
    - `id`: Identificador único da opção.
    - `text`: O texto exibido no botão.
    - `value`: O valor que será salvo na `variableName`.
    - `selected`: Estado inicial do botão (`false`).
    - `next`: O `id` do próximo nó para onde a conversa deve seguir **se esta opção for selecionada**.
    - `color` (opcional): Cor de fundo do botão em formato RGB (ex: `"153,0,51"`).
    - `textColor` (opcional): Cor do texto do botão em formato HEX (ex: `"#ffffff"`).
    - `fontWeight` (opcional): Peso da fonte do texto (ex: `500`).
    - `resultMessage` (opcional): Um texto que será usado para construir o resumo final do diagnóstico.

- **Exemplo (Seleção única):**

<!-- end list -->

```json
{
  "id": "1A",
  "type": "option",
  "text": "Selecione o que melhor descreve o que você está sentindo:",
  "multipleOptions": false,
  "variableName": "melhorOpcao",
  "options": [
    {
      "id": "1A1",
      "text": "Emergência: ...",
      "value": "Emergência",
      "next": "emergencia"
    },
    {
      "id": "1A2",
      "text": "Quem está passando mal, tem condições de responder ...?",
      "value": "Dor",
      "next": "1B"
    }
  ],
  "sender": "bot"
}
```

- **Exemplo (Seleção múltipla):**

<!-- end list -->

```json
{
  "id": "historicoDoencasUsuario",
  "type": "option",
  "text": "Quais doenças você tem?",
  "multipleOptions": true,
  "variableName": "historicoDoencasUsuario",
  "options": [
    {
      "text": "Gripe e Resfriado",
      "value": "Gripe e Resfriado",
      "next": "formUsuario"
    },
    { "text": "Diabetes", "value": "Diabetes", "next": "formUsuario" }
    // ...outras opções
  ],
  "sender": "bot"
}
```

#### 3\. `type: "form"` - Formulário de Múltiplas Entradas

Renderiza um formulário com diferentes tipos de campos para coletar várias informações de uma só vez.

- **Propriedades Comuns:**

  - `id`, `type`, `sender`, `direction`, `next`.
  - `userResponse`: Sempre `true`.
  - `inputs`: Um array de objetos, onde cada objeto define um campo do formulário.
    - `id`: Identificador do campo.
    - `text`: O rótulo do campo (a pergunta, ex: "Qual seu nome?").
    - `variableName`: Variável onde a resposta do campo será salva.
    - `required`: `boolean`. Define se o preenchimento é obrigatório.
    - `type`: O tipo de campo. Pode ser:
      - `"text"`: Campo de texto livre.
      - `"number"`: Campo que aceita apenas números.
      - `"radio"`: Botões de opção para seleção única (como sexo).
    - `mask` (opcional): Máscara para formatar a entrada (ex: `"000.000.000-00"` para CPF).
    - `subOption` (para `type: "radio"`): Um array de objetos para as opções do rádio, com `id`, `text` e `value`.

- **Exemplo de Formulário:**

<!-- end list -->

```json
{
  "id": "formUsuario",
  "type": "form",
  "userResponse": true,
  "inputs": [
    {
      "text": "Qual seu nome? *",
      "variableName": "nomeUsuario",
      "required": true,
      "type": "text"
    },
    {
      "text": "Qual seu CPF?",
      "variableName": "cpfUsuario",
      "mask": "000.000.000-00",
      "required": false,
      "type": "text"
    },
    {
      "text": "Qual sua idade?",
      "variableName": "idadeUsuario",
      "required": false,
      "type": "number"
    },
    {
      "text": "Qual seu sexo? *",
      "variableName": "sexoUsuario",
      "required": true,
      "type": "radio",
      "subOption": [
        { "id": "1", "text": "Masculino", "value": "Masculino" },
        { "id": "2", "text": "Feminino", "value": "Feminino" }
      ]
    }
  ],
  "sender": "bot",
  "next": "descricaoSentimento"
}
```

#### 4\. `type: "avatar"` - Seleção de Parte do Corpo (Geral)

Este nó exibe uma imagem genérica de um corpo humano para que o usuário clique na região geral do sintoma.

- **Propriedades Comuns:**

  - `id`, `type`, `text`, `sender`, `direction`, `next`, `variableName`.
  - `userResponse`: Sempre `true`.

- **Exemplo:**

  - Ao clicar no avatar, o chatbot avança para o `id` definido em `next`. A lógica para qual parte específica foi clicada (cabeça, tronco, etc.) deve ser tratada no front-end, que então direciona para o fluxo correto (ex: `cabecaFeminina` ou `cabecaMasculina`).

<!-- end list -->

```json
{
  "id": "3",
  "text": "🩺 Toque na região do corpo onde doi.",
  "type": "avatar",
  "sender": "bot",
  "userResponse": true,
  "variableName": "regiaoCorpoDoi",
  "next": "cabecaFeminina" // Fluxo de fallback ou padrão
}
```

#### 5\. `type: "body_parts"` - Seleção de Parte do Corpo (Específica)

Após o usuário selecionar uma área geral no avatar, este tipo de nó mostra um zoom naquela área com pontos específicos para seleção.

- **Propriedades Comuns:**

  - `id`, `text`, `type`, `sender`, `userResponse`, `variableName`.
  - `options`: Um array de objetos, onde cada objeto é uma parte específica selecionável.
    - `id`, `text`, `value`, `selected`, `next`, `resultMessage`.
    - `image`: O caminho para a imagem da parte específica do corpo (ex: `assets/images/body_parts/gargantaFeminino.png`).

- **Exemplo (Cabeça Feminina):**

<!-- end list -->

```json
{
  "id": "cabecaFeminina",
  "text": "🩺 Toque na região da cabeça onde doi.",
  "type": "body_parts",
  "options": [
    {
      "id": "part1",
      "text": "Garganta",
      "value": "Garganta",
      "image": "assets/images/body_parts/gargantaFeminino.png",
      "next": "garganta1",
      "resultMessage": "O paciente relata dor de garganta."
    }
    // ...outras partes da cabeça
  ],
  "sender": "bot",
  "userResponse": true,
  "variableName": "regiaoCabecaOndeDoi"
}
```

#### 6\. `type: "final_result"` - Nó de Finalização

Este é um nó especial que indica o fim do fluxo de coleta de dados. A aplicação irá processar todas as variáveis coletadas e os `resultMessage` para montar um resumo final para o usuário.

- **Exemplo:**

<!-- end list -->

```json
{
  "id": "final_result",
  "type": "final_result"
}
```

## 🎨 Configurações de Layout

No final do arquivo `conversation.jsonc`, existe um objeto `layout` que permite customizar a aparência do chat.

- **Exemplo:**

<!-- end list -->

```json
"layout": {
  "colorHeader": "#3D7487", // Cor do cabeçalho do chat
  "colorText": "#000000"   // Cor do texto principal
}
```
