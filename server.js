
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.post('/generate', (req, res) => {
    const { filename, htmlcode } = req.body;

    if (!filename || !htmlcode) {
        return res.send('<h2 style="color:red;">❌ Page name and code are required.</h2><a href="/">Go Back</a>');
    }

    const filePath = path.join(__dirname, 'public', 'sites', `${filename}.html`);

    if (fs.existsSync(filePath)) {
        return res.send('<h2 style="color:red;">❌ Page name already exists. Please choose another name.</h2><a href="/">Go Back</a>');
    }

    fs.writeFileSync(filePath, htmlcode);

    const link = `/sites/${filename}.html`;
    const allProjectsPath = path.join(__dirname, 'public', 'allProjects.html');
    fs.appendFileSync(allProjectsPath, `<li><a href="${link}" target="_blank">${filename}</a></li>\n`);

    res.send(`<h2 style="color:green;">✅ Page created successfully!</h2><p>🔗 <a href="${link}" target="_blank">View your page</a></p><a href="/">Go Back</a>`);
});

app.listen(PORT, () => {
    console.log("✅ Server running successfully.");
    console.log(`🌐 Open this link in your browser: http://localhost:${PORT}`);
});