'use strict'
/**
 * Create the `Users` table with id, email (unique), fullName, password, profilePic, createdAt, and updatedAt columns.
 *
 * @param {import('sequelize').QueryInterface} queryInterface - The interface used to perform schema changes.
 * @param {typeof import('sequelize')} Sequelize - The Sequelize library/constructor used to reference data types.
 */

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('Users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    fullName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    profilePic: {
      type: Sequelize.STRING,
      defaultValue: null,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  })
}
/**
 * Reverts the migration by dropping the 'Users' table.
 */
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('Users')
}