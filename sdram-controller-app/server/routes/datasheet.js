const router = require('express').Router();
const multer = require('multer');
const fs = require('fs');
let datasheet = require('../controller_schema/controller_model');

const upload = multer({ dest: 'uploads/' });

router.route('/').get((req, res) => {
    datasheet.find({}, 'datasheet')
    .then(datasheets => {
        // Map the results to extract the desired fields
        const result = datasheets.map(ds => {
            const json = JSON.parse(ds.datasheet);
            return {
                company: json.company,
                name: json.name
            };
        });
        res.json(result);
    })
    .catch(err => res.status(404).json("Error in finding datasheets: " + err));
});

router.route('/upload_datasheet').post(upload.single('datasheet'), (req, res) => {
    if (!req.file) {
        return res.status(400).json('No file uploaded');
    }
    // Read and validate the JSON file
    fs.readFile(req.file.path, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json('Error reading the file: ' + err);
        }

        let json;
        try {
            json = JSON.parse(data);
        } catch (e) {
            return res.status(400).json('Uploaded file is not valid JSON');
        }

        // Ensure the JSON structure matches your expected format
        if (!json.company || !json.name || !json.config) {
            return res.status(400).json('JSON format is incorrect');
        }

        const new_sheet = new datasheet({ datasheet: JSON.stringify(json) });

        new_sheet.save()
        .then(() => res.json("New datasheet added!"))
        .catch(err => res.status(400).json('Error adding new datasheet: ' + err));
    });
});

router.route('/add_datasheet_raw').post((req, res) => {
    const jsonString = req.body.datasheet;
    //console.log("Trying to add datatsheet: " + JSON.stringify(jsonString));
    if (!jsonString) {
        return res.status(400).json('No datasheet provided');
    }

    let json;
    try {
        json = JSON.parse(JSON.stringify(jsonString));
    } catch (e) {
        return res.status(400).json('Provided string is not valid JSON');
    }

    // Ensure the JSON structure matches your expected format
    if (!json.company || !json.name || !json.config) {
        return res.status(400).json('JSON format is incorrect');
    }

    const new_sheet = new datasheet({ datasheet: JSON.stringify(json) });

    new_sheet.save()
    .then(() => res.json("New datasheet added!"))
    .catch(err => res.status(400).json('Error adding new datasheet: ' + err));
});



module.exports = router;
