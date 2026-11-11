const fs = require('fs');

if (fs.existsSync('assets/img/flags')) {
    console.log(fs.readdirSync('assets/img/flags'));
} else {
    console.log('No flags dir in assets/img/flags');
}

