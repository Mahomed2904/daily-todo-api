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

## Principais routas da aplicação

1. 