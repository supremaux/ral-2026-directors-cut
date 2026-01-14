; Arquivo executável para atualizar as dependências do projeto Node.js. 

@echo off
break on

node

npm outdated

npm update

npm install

npm audit fix

echo Atualização concluída!
pause >nul