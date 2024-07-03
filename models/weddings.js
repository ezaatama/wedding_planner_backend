const { DataTypes } = require("sequelize");
const sequelize = require("../config/databases");
const Guests = require("../models/guests");
const DetailBride = require("./detail_bride");
const DetailLocation = require("./detail_location");

const Weddings = sequelize.define(
    "weddings", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            unique: true,
            primaryKey: false,
        },
        uuid: {
            type: DataTypes.STRING,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
            validate: {
                notEmpty: true
            },
        },
        groom_name: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: true
            },
            allowNull: false
        },
        bride_name: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: true
            },
            allowNull: false
        },
        wedding_date: {
            type: DataTypes.DATE,
            validate: {
                notEmpty: true
            },
            allowNull: false
        },
        venue: {
            type: DataTypes.ENUM("aula", "gedung", "rumah"),
            allowNull: false
        },
        detail_venue: {
            type: DataTypes.STRING,
        },
        address: {
            type: DataTypes.TEXT,
            validate: {
                notEmpty: true
            },
            allowNull: false
        },
        start_akad: {
            type: DataTypes.STRING,
        },
        end_akad: {
            type: DataTypes.STRING,
        },
        start_resepsi: {
            type: DataTypes.STRING,
        },
        end_resepsi: {
            type: DataTypes.STRING,
        },
        song_invitation : {
            type: DataTypes.STRING,
        },
        user_id: { // Menambahkan kolom user_id sebagai foreign key
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'users',
                key: 'uuid'
            },
            onDelete: "CASCADE"
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },{
        freezeTableName: true,
        timestamps: true,
        paranoid: true, // Aktifkan soft deletes
        indexes: [
            {
                unique: true,
                fields: ['id']
            }
        ]
    }
);

//ASOSIASI WEDDINGS
Weddings.hasMany(Guests, {
    foreignKey: 'wedding_id',
    sourceKey: 'uuid',
    as: 'guests'
  });
  
Guests.belongsTo(Weddings, {
foreignKey: 'wedding_id',
targetKey: 'uuid',
as: 'wedding'
});

Weddings.hasOne(DetailBride, {
    foreignKey: 'wedding_id',
    sourceKey: 'uuid',
    as: 'detail_bride'
});

DetailBride.belongsTo(Weddings, {
    foreignKey: 'wedding_id',
    targetKey: 'uuid',
    as: 'detail_bride'
});

Weddings.hasOne(DetailLocation, {
    foreignKey: 'wedding_id',
    sourceKey: 'uuid',
    as: 'detail_location'
});

DetailLocation.belongsTo(Weddings, {
    foreignKey: 'wedding_id',
    targetKey: 'uuid',
    as: 'detail_location'
});

module.exports = Weddings;