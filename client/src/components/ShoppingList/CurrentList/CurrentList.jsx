import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import TextField from '@material-ui/core/TextField';
import * as R from 'ramda';
import * as actions from '../../../store/actions';

import ListCategory from './ListCategory/ListCategory';
import ListName from './ListName/listName';
import ItemEditor from './ItemEditor/ItemEditor';
import classes from './CurrentList.css';
import CategoryEditor from './CategoryEditor/CategoryEditor';

const MODES = {
  EDIT_ITEM: 'EDIT_ITEM',
  EDIT_CATEGORIES: 'EDIT_CATEGORIES',
  DISPLAY_LIST: 'DISPLAY_LIST',
};

class CurrentList extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    const nameInput = nextProps.currentList.name;
    const { items } = nextProps.currentList;
    return {
      ...prevState,
      nameInput,
      items,
    };
  }
  state = {
    itemInput: '',
    // editItem: false,
    mode: MODES.DISPLAY_LIST,
    editId: null,
    editName: false,
    nameInput: '',
    items: [],
    anchorEl: null,
  };

  getAbsoluteIndex = itemId =>
    R.findIndex(R.propEq('itemId', itemId))(this.props.currentList.items);

  getItemToEdit = itemId =>
    // This method retrieves the detailed data for a shopping list item.
    this.props.currentList.items.find(item => item.itemId === itemId);

  setItem = () => {
    const list = { ...this.props.currentList, items: this.state.items };
    this.props.updateList(list);
  };

  setDisplayModeHandler = () => {
    this.setState({
      mode: MODES.DISPLAY_LIST,
    });
  };

  setCategoryEditModeHandler = () => {
    this.setState({
      mode: MODES.EDIT_CATEGORIES,
    });
  };

  setItemEditModeHandler = editId =>
    // This method receives the .itemId of a shopping list item,
    // toggles the editItem mode to in turn trigger the ItemEditor
    // component to load in place of the list
    this.setState({
      mode: MODES.EDIT_ITEM,
      editId,
    });

  addItemHandler = (e) => {
    // This method appends a new item to the list with the default category of "Uncategorized"
    e.preventDefault();
    const item = {
      name: this.state.itemInput,
      unit: '',
      quantity: 1,
      itemId: this.props.currentList.nextId,
      category: 'Uncategorized',
      purchased: false,
    };
    this.props.addItem(item, this.props.currentList);
    this.setState({ itemInput: '' });
  };

  inputChangedHandler = e =>
    // This method syncs the 'Add Item' input value with the local UI state
    this.setState({
      itemInput: e.target.value,
    });

  moveItem = (dragIndex, hoverIndex, cat = null) => {
    const { items } = this.props.currentList;
    const dragItem = items[dragIndex];
    const category = cat || items[hoverIndex].category;
    const updatedDragItem = {
      ...dragItem,
      category,
    };
    const updatedItems = R.insert(
      hoverIndex,
      updatedDragItem,
      R.remove(dragIndex, 1, items),
    );
    this.setState({
      items: updatedItems,
    });
  };


  handleSubmit = (values) => {
    // This method handles the ItemEditor form submission, passing the needed
    // values to the editItem action, nulling out the id of the item to be
    // edited, and setting item edit mode to false.
    this.props.editItem(this.state.editId, values, this.props.currentList);
    this.setState({
      mode: MODES.DISPLAY_LIST,
      editId: null,
    });
  };

  handleCheck = item =>
    // This method calls the editItem action to toggle the purchased status of
    // a shopping list item when the checkbox for that item is checked.
    this.props.editItem(
      item.itemId,
      { ...item, purchased: !item.purchased },
      this.props.currentList,
    );

  handleDeleteItem = () => {
    // This method handles the user option to delete an item from the shopping list.
    this.props.deleteItem(this.state.editId, this.props.currentList);
    this.setState({
      mode: MODES.DISPLAY_LIST,
      editId: null,
    });
  };

  handleClearShoppingList = () => {
    const items = this.props.currentList.items.filter(item => !item.purchased);
    const list = {...this.props.currentList, items };
    this.props.updateList(list);
    this.handleMenuClose();
  }

  handleEditName = () => {
    // This method updates the editName property to toggle the rendering of an
    // input field to change the name of the current list.
    this.setState({
      editName: true,
    });
  };

  handleNameInputChange = event =>
    // This method syncs the Name form to local UI state
    this.setState({
      nameInput: event.target.value,
    });

  handleDeleteList = (list) => {
    // This method allows the user to delete a list.
    if (window.confirm(`Are you sure you want to delete the list?`)) { // eslint-disable-line
      this.props.deleteList(list);
    }
  };

  handleNameChangeSubmit = (e) => {
    // This method handles the submisssion of the name change form.
    e.preventDefault();
    const list = {
      ...this.props.currentList,
      name: this.state.nameInput,
    };
    this.props.updateList(list);
    this.setState({
      editName: false,
    });
  };

  handleMenuOpen = event => this.setState({ anchorEl: event.currentTarget });

  handleMenuClose = () => this.setState({ anchorEl: null });

  render() {
    const categories = R.map(
      category => (
        <ListCategory
          setEditMode={this.setItemEditModeHandler}
          moveItem={this.moveItem}
          setItem={this.setItem}
          handleCheck={this.handleCheck}
          getAbsoluteIndex={this.getAbsoluteIndex}
          items={this.state.items.filter(item => category === item.category)}
          key={category}
          name={category}
        />
      ),
      [...this.props.currentList.categories].sort(),
    );
    switch (this.state.mode) {
      case MODES.EDIT_ITEM:
        return (
          <ItemEditor
            initialValues={this.getItemToEdit(this.state.editId)}
            onSubmit={this.handleSubmit}
            id={this.state.editId}
            onDelete={this.handleDeleteItem}
            categories={this.props.currentList.categories}
          />
        );
      case MODES.EDIT_CATEGORIES:
        return <CategoryEditor onDone={this.setDisplayModeHandler} />;
      default:
        return (
          <div>
            <ListName
              manageCategories={this.setCategoryEditModeHandler}
              clearShoppingList={this.handleClearShoppingList}
              editName={this.state.editName}
              handleDeleteList={this.handleDeleteList}
              handleNameChangeSubmit={this.handleNameChangeSubmit}
              handleNameInputChange={this.handleNameInputChange}
              nameInput={this.state.nameInput}
              handleEditName={this.handleEditName}
              handleOpen={this.handleMenuOpen}
              handleClose={this.handleMenuClose}
              anchorEl={this.state.anchorEl}
              name={this.props.currentList.name}
              list={this.props.currentList._id}
            />
            <div className={classes.List}>
              <List>{categories}</List>
            </div>
            <form onSubmit={this.addItemHandler} style={{ padding: '0 1rem' }}>
              <TextField
                name="addItem"
                style={{ height: '50px' }}
                value={this.state.itemInput}
                onChange={this.inputChangedHandler}
                fullWidth
                label="Add Item"
                InputLabelProps={{ style: { fontSize: '1.6rem' } }}
                InputProps={{ style: { fontSize: '1.6rem', margin: '1rem 0' } }}
              />
            </form>
          </div>
        );
    }
  }
}

const mapStateToProps = state => ({
  nextId: state.shoppingList.nextId,
  currentList: state.shoppingList.currentList,
});

const mapDispatchToProps = dispatch => ({
  addItem: (item, currentList) =>
    dispatch(actions.addListItem(item, currentList)),
  editItem: (itemId, item, currentList) =>
    dispatch(actions.editListItem(itemId, item, currentList)),
  deleteItem: (itemId, currentList) =>
    dispatch(actions.deleteListItem(itemId, currentList)),
  updateList: list => dispatch(actions.updateList(list)),
  deleteList: id => dispatch(actions.deleteShoppingList(id)),
});

CurrentList.propTypes = {
  currentList: PropTypes.object.isRequired,
  updateList: PropTypes.func.isRequired,
  addItem: PropTypes.func.isRequired,
  editItem: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired,
  deleteList: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CurrentList);
