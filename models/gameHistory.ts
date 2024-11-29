import { DataTypes, Model, Sequelize } from 'sequelize';

export class GameHistory extends Model {
  public userId!: string;
  public game!: string;
  public result!: string;
}

export function initializeGameHistoryModel(sequelize: Sequelize) {
  GameHistory.init(
    {
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      game: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      result: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'GameHistory',
    }
  );
}