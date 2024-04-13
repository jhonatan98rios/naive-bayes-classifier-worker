# Natural Language Processing - Naive Bayes Classifier

## Estrutura
- Escuta a fila no SQS
- Lê os dados do evento com os dados do arquivo de treino
- Consome o arquivo de treino 
- Tenta:
    - Realiza o treinamento
    - Salva o treinamento em um modelo
    - Envia o modelo para o S3
    - Atualiza o mongodb com status de sucesso
- Caso falhe:
    - Atualiza o mongodb com status de falha