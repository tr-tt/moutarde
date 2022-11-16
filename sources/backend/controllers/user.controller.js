const path = require('path')

exports.board = (req, res) =>
{
    res.sendFile(path.resolve('_build', 'board.html'))
}