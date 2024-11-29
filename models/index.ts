import { Sequelize } from 'sequelize';
import { initializeUserModel, User } from './user';
import { initializeGameHistoryModel, GameHistory } from './gameHistory';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL!, {
  dialect: 'postgres',
});

initializeUserModel(sequelize);
initializeGameHistoryModel(sequelize);

sequelize.sync().then(() => {
  console.log('Database & tables created!');
});

export { User, GameHistory, sequelize };