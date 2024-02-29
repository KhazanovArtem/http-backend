const http = require("http");
const Koa = require('koa');
const { koaBody } = require('koa-body');
const cors = require('koa-cors');
const path = require("path");

const app = new Koa();
const port = 8080;
const publics = path.join(__dirname, "/public");
const server = http.createServer(app.callback()).listen(port);

const tickets = [
    {
        id: 1,
        name: "Поменять краску в принтере",
        description: "Нужно поменять краску в принтере в бухгалтерии. Принтер HP 124J823",
        status: false,
        created: "10.03.2019, 08:40"
    },
    {
        id: 2,
        name: "Переустановить Windows",
        description: "Переустановить ОС на ноутбуке офис менеджера",
        status: true,
        created: "15.03.2019, 12:35"
    },
    {
        id: 3,
        name: "Установить обновление KB-XXX",
        description: 'Вышло критическое обновление для Windows, нужно проставить обновления в следующем приоритете:<br> 1. Сервера (не забыть сделать Бэкап)<br> 2. Рабочие станции',
        status: false,
        created: "15.03.2019, 12:40"
    }
]

app.use(
    cors({
        origin: '*',
        credentials: true,
        'Access-Control-Allow-Origin': true,
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE']
    })
    );
    
app.use(
    koaBody({
        text: true,
        urlencoded: true,
        multipart: true,
        json: true
    })
);

app.use(async ctx => {
    ctx.response.set({
        'Access-Control-Allow-Origin': '*',
        });
    const { method } = ctx.request.query;
    switch (method) {
        case 'allTickets':
            ctx.response.body = tickets.map(({description, ...ticket}) => (ticket));
            return;
        case 'ticketById':
            const {id: ticketId} = ctx.request.query;
            const ticketToShow = tickets.find(ticket => ticket.id === parseInt(ticketId));
            if (ticketToShow) {
                ctx.response.body = ticketToShow.description;
            } else {
                ctx.response.status = 404;
            }
            return;
        case 'createTicket':
            if (ctx.request.method !== 'POST') {
                ctx.response.status = 404;
                return;
            }
            const data = ctx.request.body;
                                  
            const ticket = {
                id: (data.id) ? parseInt(data.id) : (tickets[tickets.length - 1]).id + 1,
                name: data.name,
                description: data.description,
                status: (data.status) ? data.status : 'false',
                created: new Date().toLocaleDateString('ru-RU', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                    })
            };
                tickets.push(ticket);
                console.log(ticket);
                console.log(tickets);
            ctx.response.status = 201;
            ctx.response.body = tickets;
            return;
        case 'deleteTicket':
            if (ctx.request.method !== 'POST') {
                ctx.response.status = 404;
                return;
            }
            const {id: ticketToDelete} = ctx.request.query;
            const index = tickets.findIndex(ticket => ticket.id === parseInt(ticketToDelete));
            if (index === -1) {
                ctx.response.status = 404;
                return;
            }
            tickets.splice(index, 1);
            ctx.response.body = tickets;
            return;
            default:server.js
            ctx.response.status = 404;
            return;
    }
});

