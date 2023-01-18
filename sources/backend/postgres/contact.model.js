module.exports = (sequelize, DataTypes) =>
{
    const Contact = sequelize.define(
        'Contact',
        {
            name:
            {
                type: DataTypes.STRING(100),
                allowNull: false,
                validate:
                {
                    notEmpty:
                    {
                        msg: `Le nom du contact est requis.`
                    }
                }
            },
            job:
            {
                type: DataTypes.STRING(100),
                allowNull: false,
                validate:
                {
                    notEmpty:
                    {
                        msg: `La profession du contact est requise.`
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
                        msg: `L'email du contact est requis.`
                    },
                    isEmail:
                    {
                        msg: `L'email du contact doit être valide.`
                    }
                }
            }
        },
        {
            tableName: 'Contacts'
        }
    )

    return Contact
}