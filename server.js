const express = require('express');
const dotenv = require('dotenv');

dotenv.config({ path: 'configure.env' });

const app = express();
const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
    res.send('our server hi');
});


app.listen(PORT, () => {
    console.log(`server started on port: ${PORT}`);
})

