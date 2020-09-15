const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;
const URLs = {};

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', (req, res) => {
  res.sendFile(`${process.cwd()}/views/index.html`);
});

app.post('/api/shorturl/new', (req, res) => {
  const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/gi;
  const regex = new RegExp(expression);
  const t = req.body.url;

  if (!t.match(regex)) {
    res.send({ error: 'invalid URL' });
    return;
  }

  URLs[Object.keys(URLs).length] = req.body.url;
  res.send({
    original_url: 'www.google.com',
    short_url: Object.keys(URLs).length - 1,
  });
});

app.get('/api/shorturl/:id', (req, res) => {
  if (URLs[req.params.id] === undefined) {
    res.sendStatus(404);
  }
  res.redirect(URLs[req.params.id]);
});

// your first API endpoint...
app.get('/api/hello', (req, res) => {
  res.json({ greeting: 'hello API' });
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log('Node.js listening ...');
});
