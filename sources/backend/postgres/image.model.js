module.exports = (sequelize, DataTypes) =>
{
    const Image = sequelize.define('Image',
    {
        name:
        {
            type: DataTypes.STRING(100),
            defaultValue: ''
        },
        type:
        {
            type: DataTypes.STRING(100),
            defaultValue: ''
        },
        blob:
        {
            type: DataTypes.BLOB,
            defaultValue: null
        },
        number:
        {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate:
            {
                notEmpty:
                {
                    msg: `Image "number" is missing.`
                }
            }
        }
    },
    {
        tableName: 'Images'
    })
  
    return Image
}