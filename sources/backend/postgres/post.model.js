module.exports = (sequelize, DataTypes) =>
{
    const Post = sequelize.define('Post',
    {
        title:
        {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        tableName: 'Posts'
    })
  
    return Post
}