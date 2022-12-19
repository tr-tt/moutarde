module.exports = (sequelize, DataTypes) =>
{
    const Post = sequelize.define('Post',
    {
        title:
        {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate:
            {
                notEmpty:
                {
                    msg: `Titre de la situation vécue est requis.`
                }
            }
        },
        tool:
        {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate:
            {
                notEmpty:
                {
                    msg: `Outil cible utilisé est requis.`
                }
            }
        },
        description:
        {
            type: DataTypes.TEXT,
            allowNull: false,
            validate:
            {
                notEmpty:
                {
                    msg: `Description de la situation est requis.`
                }
            }
        },
        place:
        {
            type: DataTypes.TEXT
        },
        ressource:
        {
            type: DataTypes.TEXT
        },
        difficulty:
        {
            type: DataTypes.TEXT,
            allowNull: false,
            validate:
            {
                notEmpty:
                {
                    msg: `Difficulté et/ou satisfaction rencontrées est requis.`
                }
            }
        },
        improvement:
        {
            type: DataTypes.TEXT
        },
        more:
        {
            type: DataTypes.TEXT
        },
        image:
        {
            type: DataTypes.BLOB
        }
    },
    {
        tableName: 'Posts'
    })
  
    return Post
}