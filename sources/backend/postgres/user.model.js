const bcrypt = require('bcryptjs')

module.exports = (sequelize, DataTypes) =>
{
    const User = sequelize.define('User',
    {
        job:
        {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate:
            {
                notEmpty:
                {
                    msg: `Une fonction est requise.`
                }
            }
        },
        username:
        {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            validate:
            {
                notEmpty:
                {
                    msg: `Un nom d'utilisateur unique est requis.`
                }
            }
        },
        email:
        {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            validate:
            {
                isEmail:
                {
                    msg: `Une addresse email unique et valide est requise.`
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
            type: DataTypes.STRING(100),
            defaultValue: ''
        },
        school:
        {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate:
            {
                notEmpty:
                {
                    msg: `Un nom d'établissement scolaire est requis.`
                }
            }
        },
        schoolYear:
        {
            type: DataTypes.STRING(100),
            defaultValue: ''
        },
        seniority:
        {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        password:
        {
            type: DataTypes.STRING,
            allowNull: false,
            validate:
            {
                notEmpty:
                {
                    msg: `Un mot de passe non vide est requis.`
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