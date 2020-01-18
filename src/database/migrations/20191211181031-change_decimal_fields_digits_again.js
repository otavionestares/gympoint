module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('students', 'height', {
      type: Sequelize.DECIMAL(3, 2),
    });

    await queryInterface.changeColumn('students', 'weight', {
      type: Sequelize.DECIMAL(5, 2),
    });

    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },
};
