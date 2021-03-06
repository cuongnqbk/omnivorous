const authenticate = require('../middleware/authenticate');
const shoppingListController = require('../controllers/shoppinglistController');

module.exports = (app) => {

    app.route('/api/shopping')
        .get(authenticate, shoppingListController.getShoppingLists)
        .post(authenticate, shoppingListController.makeShoppingList);

    app.route('/api/shopping/:id')
        .get(authenticate, shoppingListController.getShoppingList)
        .put(authenticate, shoppingListController.updateShoppingList)
        .delete(authenticate, shoppingListController.deleteShoppingList);

}