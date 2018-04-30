var records = [
    { id: 0, username: 'test', password: 'pass', emails: [ { value: 'test@test.com' } ] }
];

exports.findById = function(id, cb) {
    process.nextTick(function() {
        if (records[id]) {
            cb(null, records[id]);
        } else {
            cb(new Error('User ' + id + ' does not exist'));
        }
    });
};

exports.findByUsername = function(username, cb) {
    process.nextTick(function() {
        for (var i = 0, len = records.length; i < len; i++) {
            var record = records[i];
            if (record.username === username) {
                return cb(null, record);
            }
        }
        return cb(null, null);
    });
};

exports.insertUser = function (username, password, email, cb){
    process.nextTick(function() {
        if(!(username && password && email))
            return cb(new Error('All fields must be filled in'));

        var id = records.length;
        records.push({
            id: id,
            username: username.toLowerCase(),
            displayname: username,
            email: [{value: email}]
        });

        return cb(null, records[id]);
    });
};