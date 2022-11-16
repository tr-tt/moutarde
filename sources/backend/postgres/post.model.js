module.exports = (sequelize, DataTypes) =>
{
    const Post = sequelize.define('Post',
    {
        user_id:
        {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        text:
        {
            type: DataTypes.STRING,
            allowNull: false
        }
    })
  
    return Post
}