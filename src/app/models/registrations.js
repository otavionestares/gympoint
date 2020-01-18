import Sequelize, { Model } from 'sequelize';

class Registration extends Model {
  static init(sequelize) {
    super.init(
      {
        student_id: Sequelize.NUMBER,
        plan_id: Sequelize.NUMBER,
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        price: Sequelize.DECIMAL(6, 2),
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'student_id', as: 'student' });
    this.belongsTo(models.File, { foreignKey: 'plan_id', as: 'plan' });
  }
}

export default Registration;
