module.exports = (sequelize, DataTypes) =>
{
    const School = sequelize.define(
        'School',
        {
            name:
            {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true,
                validate:
                {
                    notEmpty:
                    {
                        msg: `Le nom de l'école est requis.`
                    }
                }
            }
        },
        {
            tableName: 'Schools'
        }
    )

    return School
}