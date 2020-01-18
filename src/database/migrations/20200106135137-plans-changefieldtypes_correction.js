module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('plans', 'price', {
      type: Sequelize.DECIMAL(5, 2),
      unique: false,
    });

    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },
};
