import Sequelize from 'sequelize';

import User from '../app/models/users';
import Student from '../app/models/students';
import Plan from '../app/models/plans';
import Registration from '../app/models/registrations';
import Checkin from '../app/models/checkins';
import HelpOrder from '../app/models/helpOrders';
import databaseConfig from '../config/database';

const models = [User, Student, Plan, Registration, Checkin, HelpOrder];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models.map(model => model.init(this.connection));
  }
}

export default new Database();
