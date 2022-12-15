const {Sequelize, DataTypes, Op} = require('sequelize')

const sequelize = new Sequelize(
    process.env.POSTGRES_DATABASE,
    process.env.POSTGRES_USER,
    process.env.POSTGRES_PASSWORD,
    {
        host: process.env.POSTGRES_HOST,
        dialect: process.env.POSTGRES_DIALECT,
        logging: false
    }
)

sequelize.authenticate().then(() =>
{
    console.debug('[INFO] Connection with postgresql successfull')
}).catch((error) =>
{
    console.error(`[ERROR] Connection with postgresql error - ${error}`)
})

const db = {}

db.sequelize = sequelize
db.DataTypes = DataTypes
db.Op = Op

db.User = require('./user.model.js')(sequelize, DataTypes)
db.Post = require('./post.model.js')(sequelize, DataTypes)

db.User.hasMany(db.Post,
    {
        foreignKey:
        {
            allowNull: false
        }
    })
db.Post.belongsTo(db.User)

module.exports = db