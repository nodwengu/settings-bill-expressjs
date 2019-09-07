const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const SettingsBill = require('./settings-bill');

const settingsBill = SettingsBill();

const app = express();

//Configuring express handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static('public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.render('index', {
        setting: settingsBill.getSettings(),
        totals: settingsBill.getTotals(),
        color: settingsBill.getColor(),
        disabled: settingsBill.getBtnStatus()
    });
    settingsBill.updateText();
}) 

app.post('/settings', (req, res) => {
    settingsBill.setSettings({
        callCost: req.body.callCost,
        smsCost: req.body.smsCost,
        warningLevel: req.body.warningLevel,
        criticalLevel: req.body.criticalLevel
    })   
    settingsBill.updateText();
    res.redirect('/')
})

app.post('/action', (req, res) => {
    settingsBill.setAction(req.body.actionType);

    settingsBill.updateText();
   
    res.redirect('/')
})

app.get('/actions', (req, res) => {
    res.render('actions', {
        actions: settingsBill.getActions()
    });
})

app.get('/actions/:actionType', (req, res) => {
    const actionType = req.params.actionType;
    res.render('actions', {
        actions: settingsBill.getActionsFor(actionType)
    });

})

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});
