import { DataTypes, Model, Sequelize } from 'sequelize';

export class User extends Model {
  public userId!: string;
  public username!: string;
  public password!: string;
}

export function initializeUserModel(sequelize: Sequelize) {
  User.init(
    {
      userId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'User',
    }
  );
}