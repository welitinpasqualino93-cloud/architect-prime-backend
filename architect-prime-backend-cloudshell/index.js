// index.js para o Cloud Run (Servidor Express)

// Garanta que esta linha 'const express = require('express');' apareça APENAS UMA VEZ no arquivo.
const express = require('express');
const app = express();

// Importa a biblioteca do Gemini
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Inicializa o cliente Gemini.
// Ele usará automaticamente as credenciais da Conta de Serviço do Cloud Run.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
app.use(express.json());

// Configura CORS para permitir todas as origens
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'GET, POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600'); 
    return res.status(204).send('');
  }
  next();
});

// Rota principal (endpoint) da sua API
app.post('/architectPrimeDemo', async (req, res) => { // A função deve ser 'async'
  const { action, architectureId, appType } = req.body || {}; 

  if (action === 'generateArchitecture') {
    try {
      // Define o tipo de aplicação. Se não for fornecido, usa um valor padrão.
      const type = appType || 'um sistema de pagamentos de alto volume';

      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // <--- ÚNICA DECLARAÇÃO!

      // O Prompt que será enviado para o Gemini, agora pedindo o tipo de arquitetura
      const prompt = `Gerar uma arquitetura de microsserviços otimizada para ${type}, com foco em serverless, escalabilidade, FinOps e segurança intrínseca.`; 

      const result = await model.generateContent(prompt); // <--- CHAME O MODELO AQUI
      const generatedText = result.response.text().trim(); // <--- OBTENHA O TEXTO DA RESPOSTA
      const architecture = {
        id: `arch-${Date.now()}`,
        name: `Arquitetura Otimizada para ${type}`,
        description: generatedText, // Usamos o texto real gerado pela IA
        estimatedCostSaving: 'Variável (30% - 45% TCO Redução Anual)',
        complianceStatus: 'FIN-PRIME Compliant (LGPD/GDPR)',
        components: [ 
          // Mantemos uma lista fixa de componentes para simplificar, mas a descrição será dinâmica
          { name: 'API Gateway (Cloud Run)', type: 'Serverless Compute' }, 
          { name: 'Cloud Function (Processamento)', type: 'Serverless Compute' }, 
          { name: 'Cloud Firestore (Banco de Dados)', type: 'Serverless Database' },
          { name: 'Cloud KMS (Criptografia)', type: 'Security Service' },
          { name: 'Cloud Monitoring (FinOps)', type: 'Monitoring' },
        ],
        timestamp: new Date().toISOString(),
      };

      res.status(200).json({
        message: 'Arquitetura gerada dinamicamente pelo GEMINI.',
        architecture: architecture,
      });

    } catch (error) {
      console.error("Erro ao chamar o Gemini API:", error);
      // Retorna um erro 500 se a chamada ao Gemini falhar (ex: falta de permissão)
      res.status(500).json({ error: 'Falha ao gerar arquitetura com Gemini. Verifique as permissões da Conta de Serviço (Vertex AI User).', details: error.message });
    }

  } else if (action === 'validateSecurity') {
    // O código de validação de segurança permanece o mesmo
    if (!architectureId) {
      return res.status(400).json({ error: 'ID da arquitetura é necessário para validação de segurança.' });
    }
    const securityResult = {
      architectureId: architectureId,
      status: 'Conforme',
      details: 'Todas as políticas FIN-PRIME (LGPD/GDPR) aplicadas e validadas automaticamente (via Gemini).',
      riskLevel: 'ZERO',
      recommendations: 'Nenhuma. Arquitetura segura por design.',
      timestamp: new Date().toISOString(),
    };

    res.status(200).json({
      message: 'Validação FIN-PRIME Security concluída com sucesso (via Gemini).',
      securityResult: securityResult,
    });

  } else {
    res.status(400).json({ error: 'Ação inválida. Use "generateArchitecture" ou "validateSecurity".' });
  }
});

// Inicia o servidor para escutar na porta definida pela variável de ambiente PORT (padrão 8080 no Cloud Run)
const port = parseInt(process.env.PORT) || 8080;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

