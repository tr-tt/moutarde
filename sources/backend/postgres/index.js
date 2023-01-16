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
db.School = require('./school.model.js')(sequelize, DataTypes)
db.Contact = require('./contact.model.js')(sequelize, DataTypes)
db.Image = require('./image.model.js')(sequelize, DataTypes)

/*===============================================//
// USER 1 <==> n POST
//===============================================*/
db.User.hasMany(db.Post,
    {
        onDelete: 'CASCADE'
    }
)
db.Post.belongsTo(db.User)

/*===============================================//
// USER n <==> 1 SCHOOL
//===============================================*/
db.School.hasMany(db.User)
db.User.belongsTo(db.School)

/*===============================================//
// SCHOOL n <==> n CONTACT
//===============================================*/
db.School.belongsToMany(db.Contact,
    {
        through: 'school_contact',
        foreignKey: 'school_id'
    }
)
db.Contact.belongsToMany(db.School,
    {
        through: 'school_contact',
        foreignKey: 'contact_id'
    }
)

/*===============================================//
// POST 1 <==> n IMAGE
//===============================================*/
db.Post.hasMany(db.Image,
    {
        onDelete: 'CASCADE'
    }
)
db.Image.belongsTo(db.Post)

module.exports = db