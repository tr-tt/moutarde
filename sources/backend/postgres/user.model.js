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
                    msg: `Le champ "Fonction" est requis.`
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
                    msg: `Le champ "Nom d'utilisateur" est requis, il doit être unique.`
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
                notEmpty:
                {
                    msg: `Le champ "Addresse email" est requis, il doit être unique.`
                },
                isEmail:
                {
                    msg: `Le champ "Addresse email" est requis, il doit être valide.`
                }
            }
        },
        lastname:
        {
            type: DataTypes.STRING(100),
            defaultValue: ''
        },
        firstname:
        {
            type: DataTypes.STRING(100),
            defaultValue: ''
        },
        birthday:
        {
            type: DataTypes.INTEGER,
            defaultValue: null
        },
        sex:
        {
            type: DataTypes.STRING(100),
            defaultValue: ''
        },
        schoolYear:
        {
            type: DataTypes.STRING(100),
            defaultValue: ''
        },
        seniority:
        {
            type: DataTypes.STRING(100),
            defaultValue: ''
        },
        password:
        {
            type: DataTypes.STRING,
            allowNull: false,
            validate:
            {
                notEmpty:
                {
                    msg: `Le champ "Mot de passe" est requis, il doit être non vide.`
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