module.exports = (sequelize, DataTypes) =>
{
    const Post = sequelize.define('Post',
    {
        situation:
        {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate:
            {
                notEmpty:
                {
                    msg: `Le champ "Situation vécue" est requis.`
                }
            }
        },
        tool:
        {
            type: DataTypes.STRING(100),
            defaultValue: ''
        },
        when:
        {
            type: DataTypes.DATE,
            defaultValue: null
        },
        feeling:
        {
            type: DataTypes.STRING(100),
            defaultValue: ''
        },
        description:
        {
            type: DataTypes.TEXT,
            defaultValue: ''
        },
        ressource:
        {
            type: DataTypes.TEXT,
            defaultValue: ''
        },
        difficulty:
        {
            type: DataTypes.TEXT,
            defaultValue: ''
        },
        trick:
        {
            type: DataTypes.TEXT,
            defaultValue: ''
        },
        improvement:
        {
            type: DataTypes.TEXT,
            defaultValue: ''
        },
        more:
        {
            type: DataTypes.TEXT,
            defaultValue: ''
        }
    },
    {
        tableName: 'Posts'
    })
  
    return Post
}