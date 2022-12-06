const bcrypt = require('bcryptjs')

module.exports = (sequelize, DataTypes) =>
{
    const User = sequelize.define('User',
    {
        username:
        {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate:
            {
                notEmpty:
                {
                    msg: `Le nom d'utilisateur ne peut pas être vide.`
                }
            }
        },
        email:
        {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate:
            {
                isEmail:
                {
                    msg: `Une adresse email valide est requise.`
                }
            }
        },
        birthday:
        {
            type: DataTypes.DATEONLY,
            defaultValue: null
        },
        sex:
        {
            type: DataTypes.STRING,
            defaultValue: null
        },
        school:
        {
            type: DataTypes.STRING,
            allowNull: false,
            validate:
            {
                notEmpty:
                {
                    msg: `Le nom de l'école ne peut pas être vide.`
                }
            }
        },
        schoolYear:
        {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate:
            {
                notEmpty:
                {
                    msg: `L'année de formation ne peut pas être vide.`
                }
            }
        },
        password:
        {
            type: DataTypes.STRING,
            allowNull: false,
            validate:
            {
                notEmpty:
                {
                    msg: `Le mot de passe ne peut pas être vide.`
                }
            },
            set(value)
            {
                this.setDataValue('password', bcrypt.hashSync(value, 8))
            }
        }
    },
    {
        tableName: 'Users'
    })
  
    return User
}