import express from 'express';
import  { json } from 'body-parser';

const app = express();
app.use(json());


app.get('/api/users/current', (req, res) => {
    res.send('/api/users/currentdjjdjekdjeijdeijdiejdiedjeijdeijngnfngfngg');
  });

  app.get('/api/users/move', (req, res) => {
    res.send('/api/users/move');
  });


app.listen(3000, () => {
  console.log('Auth service listening on port 3000!');
});