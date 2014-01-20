// define ctrlers
module.exports = function($models, $Ctrler) {
    return {
        user: require('./user')($models, $Ctrler),
        thread: require('./thread')($models, $Ctrler),
        board: require('./board')($models, $Ctrler),
        media: require('./media')($models, $Ctrler),
        config: require('./config')($models, $Ctrler)
    }
}