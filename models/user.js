module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define('User', {
        profileId: DataTypes.STRING,
        email: DataTypes.STRING,
        username: DataTypes.STRING,
        profileImage: DataTypes.STRING,
        accessToken: DataTypes.STRING,
        refreshToken: DataTypes.STRING,
        provider: DataTypes.STRING,
    });

    return User;
}