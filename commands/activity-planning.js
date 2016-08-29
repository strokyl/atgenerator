// This is the sub command to generate the planning of a worker for given period.
var program = require('commander');
var moment = require('moment');
program
    .version('1.0.0')
    .option('-u --user <user>', 'user to connect to OBM service')
    .option('-p --password <password>', 'password to connect to OBM service')
    .option('-j --json <json>', 'json data to use for diff generation')
    .option('-N --nextmonth', 'the next month to parse')
    .option('-P --previousmonth', 'the previous month to parse')
    .parse(process.argv);

// Check of parameters not taken into account by commander.
if (program.user === undefined) throw new Error("You must specify a user");
if (program.password === undefined) throw new Error("You must specify a password");
if (program.json === undefined) throw new Error("You must specify a json file");
var fs = require('fs');
var PlanningGenerator = require('../lib/PlanningGenerator');

var generator = new PlanningGenerator();
fs.readFile(program.json, function(err, content) {
    var json = JSON.parse(content);

    // Setting the next month
    if (program.nextmonth) {
        json.startDate = moment().add(1, 'months').startOf('month');
        json.endDate = moment().add(1, 'months').endOf('month');
    }
    var connectionProperties = { user: program.user, password: program.password, groupId: json.groupId };

    generator.generate(json, connectionProperties);
});

