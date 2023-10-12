# Daily-Todo API

Este projeto implementa uma API com as regras de negócio da aplicação daily-todo, uma aplicação que tem como objetivo permitir o agendamento de tarefas diárias de forma fácil e simples e com integração com o google calendar. No entanto, todas as tarefas agendadas a partir da aplicação poderão ser agendadas como eventos no google calendar do utilizador.

A aplicação possui um sistema de notificações, que notifica ao utilizador sempre que chega o momento de realizar uma tarefa. O utilizador pode configurar a aplicação para receber mais de uma notificação para uma determinada tarefa, o período que as notifcações devem ser feitas (dias, minutos, horas antes da momento da tarefa) e a forma da notificação (popup ou email).

A aplicação ainda está em desenvolvimento para tal está a ser usado o framework Nestjs, um framework Nodejs para desenvolvimento de aplicações backend. Para mais informações sobre o framework visite o link <a href="https://nestjs.com/">https://nestjs.com/</a>

## Requisitos funcionais da aplicação

Eis os requisitos funcionais da aplicação:

1. O sistema deve permitir a um utilizador registar-se especificando o nome completo, o e-mail, uma palavra passe, o número de telefone e a foto de perfil (opcional).
2. O sistema deve permitir a um utilizador autenticar-se com o seu email e senha para poder gerir as suas tarefas.
3. O sistema deve permitir a um utilizador recuperar a palavra-passe da sua conta especificando o email da conta a recuperar.
4. O sistema deve permitir a um utilizador autenticar-se no sistema usando a conta da Google.
5. O sistema deve permitir a um utilizador alterar os dados do perfil da sua conta, onde inclui o nome, o número de telefone e a 6.foto de perfil.
6. O sistema deve permitir a um utilizador alterar a palavra passe de sua conta especificando a palavra-passe antiga e a nova palavra-passe.
7. O sistema deve permitir a um utilizador habilitar a sincronização das tarefas por ele criadas com o Google Calendar.
8. O sistema deve permitir o registo de uma tarefa especificando-se o título da tarefa, uma descrição da tarefa, a data e hora de início da tarefa e a duração da tarefa.
9. O sistema pode permitir que um utilizador especifique uma tarefa para ser reagendada todos os dias.
10. O sistema deve permitir a edição dos dados de uma tarefa.
11. O sistema deve permitir a visualização dos detalhes de uma tarefa.
12. O sistema deve permitir a eliminação de tarefas.
13. O sistema deve permitir a pesquisa de tarefas a partir do título e descrição da tarefa.
14. O sistema deve permitir a filtragem das tarefas baseado na data de sua realização.

## Principais rotas da aplicação e alguns detalhes de desenho

### 1. Criação de conta

Uma conta de um utilizador é criada usando o endpoint  _/api/auth/signup_, em que no body da requisição deve se especificar os dados:
- Email
- Password

Exemplo do Body de uma requisição:
```javascript
{
	"email": "youremail@yourdomain.com",
    "password": "yourpassword"
}
```

* Se já existir uma conta com o mesmo email da requisição, a criação da conta falha, no entanto uma resposta com o estado HTTP CONFLIT é retornada como forma de informar que já existe uma conta com o mesmo email.

* Se a requisição for um sucesso: 
    1. Um email com o código de verificação do email do utilizador é enviado.
    2. É recebida uma resposta com um token de autorização juntamente com os dados da conta.
    3. A reposta recebida tem como estado HTTP o estado 201.

Exemplo de resposta recebida na criação de uma conta:
```javascript
{
	"userId": "63f09a65-325c-4d79-82c0-335f013589ab",
	"isActivated": false,  // A conta está desativada
	"authenticationData": {
		"isActivatedAccount": false,
		"acessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZjA5YTY1LTMyNWMtNGQ3OS04MmMwLTMzNWYwMTM1ODlhYiIsImlzQWN0aXZhdGVkIjpmYWxzZSwiZW1haWwiOiJtYWhvbWVkYWx5MjAwMEBnbWFpbC5jb20iLCJ1c2VyVHlwZSI6IklOVEVSTkFMIiwiaWF0IjoxNjk2ODA1NDgyLCJleHAiOjE2OTc0MTAyODJ9.zcMS6W4H21YS9nae5X2mQGezQmDFTZTCE1HjxLBvaqY",
		"expiryDate": "1697410282607",
		"tokenType": "Bearer"
	}
}
```

### 2. Verificação de email da conta do utilizador

A conta do utilizador permanece inativa enquanto não se fazer a verificação do email da conta. Para verificar o email, deve-se enviar uma requisição para o endpoint _/api/auth/verify-email_, em que no body da requisição deve se especificar o código enviado vai email. Um exemplo com o body da requisição é o seguinte:

```javascript
{
	"code": "yourVerificationCode",
}
```

No header da requisição deve se configurar a propriedade Authorization com o prefixo e o token de autenticação retornado como resposta após a criação da conta. No caso de se perder o token retornado após a criação da conta, pode se fazer signin a partir da rota _/api/auth/signin_ especificando-se o email e a senha do utilizador para obter um novo token de autorização.

Eis um exemplo de como o header da requisição deve estar configurado:

```javascript
{
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhZDZhYTc4LWM2YTctNDYxMy1hMTE5LWFkOTViN2I0YjM2OCIsImVtYWlsIjoibWFob21lZGFseTIwMDBAZ21haWwuY29tIiwiaXNBY3RpdmF0ZWQiOnRydWUsInVzZXJUeXBlIjoiRVhURVJOQUwiLCJpYXQiOjE2OTY4MzQyNzAsImV4cCI6MTY5NzQzOTA3MH0.LjlMt3tGOyQXOJfbIOd5n9f1Gcd5nzTsQHQydT1StZ4',
}
```