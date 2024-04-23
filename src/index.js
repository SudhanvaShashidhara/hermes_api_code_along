const path = require("path");

const express = require("express");

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(function(req, res, next){
    console.log("In another middleware");
    next();
});

app.get("/api/typeform-data", async function(req, res){
    // form_id = m7WLVL5V
    // response_id = e1xx99rx1ubi7ui8ylhre1xx9awgrp0g
    const query_parameter = req.query;
    const form_id = query_parameter.form_id;
    const response_id = query_parameter.response_id;
    try{
        const typeform_raw_data = await fetch(`https://api.typeform.com/forms/${form_id}/responses?included_response_ids=${response_id}`, {
            headers: {
                "Authorization": `Bearer ${process.env.TYPEFORM_TOKEN}`
            }
        });
        const typeform_data = await typeform_raw_data.json();
        if(typeform_data){
            const typeform_answers = typeform_data.items[0].answers;
            let email = "";
            typeform_answers.forEach(function(item){
                if(item.type === "email" && item.email){
                    email = item.email;
                }
            });
            return res.json({"success": true,'email': email});
        }
    }catch(err){
        return res.json({"success": false});
    }
    return res.json({"success": false});
});

app.get("/", function(req, res){
    return res.sendFile(path.join(__dirname, '../', 'views', 'index.html'));
});

app.use(function(req, res, next){
    return res.status(404).send("<h1>Page Not Found</h1>")
})

app.listen(PORT, function(){
    console.log(`App Listening on port : ${PORT}`);
});

module.exports = app;