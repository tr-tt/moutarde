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
                    msg: `Le titre du formulaire ne peut pas être vide.`
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
                    msg: `L'outil cible ne peut pas être vide.`
                }
            }
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