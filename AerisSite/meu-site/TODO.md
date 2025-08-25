# TODO - Integração React com Django REST Framework

## ✅ Concluído:

1. **Análise da estrutura existente:**
   - ✅ Verificado modelo Usuario no Django (nome, email, senha)
   - ✅ Verificado serializer e views da API
   - ✅ Confirmado endpoint da API: `http://127.0.0.1:8000/api/usuarios/`

2. **Modificações no React (CriarConta.jsx):**
   - ✅ Adicionado estados para nome, email e senha
   - ✅ Adicionado handlers onChange para capturar dados dos inputs
   - ✅ Implementado função handleSubmit para enviar dados via POST
   - ✅ Adicionado botão "Mostrar/Esconder" senha
   - ✅ Adicionado tratamento de erros com alert
   - ✅ Adicionado navegação para TelaPrincipal após sucesso

3. **Estilização (App.css):**
   - ✅ Adicionado estilos para o botão de mostrar senha
   - ✅ Ajustado padding dos inputs para acomodar o botão

## 🔧 Próximos passos recomendados:

1. **Testar a integração:**
   - Certificar-se que o servidor Django está rodando na porta 8000
   - Testar o envio de dados do formulário
   - Verificar se os dados estão sendo salvos no banco

2. **Melhorias de segurança:**
   - Considerar usar o modelo User padrão do Django para hash automático de senhas
   - Adicionar validação de email no frontend e backend
   - Implementar confirmação de senha

3. **Melhorias de UX:**
   - Adicionar loading state durante o envio
   - Melhorar feedback visual de sucesso/erro
   - Adicionar validação de formulário no frontend

## 📋 Como testar:

1. Inicie o servidor Django:
   ```bash
   cd c:/Users/Alunos/Aeris/Django
   python manage.py runserver
   ```

2. Inicie o servidor React:
   ```bash
   cd c:/Users/Alunos/Aeris/AerisSite/meu-site
   npm run dev
   ```

3. Acesse a página de criação de conta e teste o formulário
