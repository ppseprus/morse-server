module.exports = {
    claim: claim,
    free: free,
    get: get,
    getGuestName: getGuestName
};

var userNames = [];

function claim(name) {
    if (!name || userNames[name]) {
        return false;
    } else {
        userNames[name] = true;
        return true;
    }
}

// find the lowest unused "guest" name and claim it
function getGuestName () {
    var name,
        nextUserId = 1;

    do {
        name = 'guest' + nextUserId;
        nextUserId += 1;
    } while (!claim(name));

    return name;
}

// serialize claimed names as an array
function get() {
    var res = [];
    for (user in userNames) {
        res.push(user);
    }

    return res;
}

function free (name) {
    if (userNames[name]) {
        delete userNames[name];
    }
}
