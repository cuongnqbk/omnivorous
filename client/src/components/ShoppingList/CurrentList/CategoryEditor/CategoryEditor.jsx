import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Close from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import { ListItemText, ListItemSecondaryAction } from '@material-ui/core';
import { addCategory, deleteCategory } from '../../../../store/actions';

class CategoryEditor extends Component {
  state = {
    input: '',
  };

  inputChangedHandler = e => this.setState({ input: e.target.value });

  addCategoryHandler = (e) => {
    e.preventDefault();
    this.props.addCategory(this.state.input, this.props.currentList);
    this.setState({
      input: '',
    });
  };

  deleteCategoryHandler = category => this.props.deleteCategory(category, this.props.currentList);

  render() {
    const categories = this.props.currentList.categories.map((category) => {
      if (category !== 'Uncategorized') {
        return (
          <ListItem key={category}>
            <ListItemText primary={category} style={{ fontSize: '1.6rem' }} />
            <ListItemSecondaryAction>
              <Button
                variant="flat"
                style={{ marginTop: '.5rem' }}
                onClick={() => this.deleteCategoryHandler(category)}
              >
                <Close />
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
        );
      }
      return null;
    });
    return (
      <div style={{ padding: '0 1rem' }}>
        <div style={{ maxHeight: '35vh', overflow: 'auto' }}>
          <List>{categories}</List>
        </div>
        <form onSubmit={this.addCategoryHandler}>
          <TextField
            label="Add Category"
            name="newcategory"
            fullWidth
            value={this.state.input}
            onChange={this.inputChangedHandler}
            InputProps={{ style: { margin: '1rem 0', fontSize: '1.6rem' } }}
            InputLabelProps={{ style: { fontSize: '1.6rem' } }}
          />
        </form>
        <Button variant="raised" onClick={this.props.onDone} color="primary">
          Return to List
        </Button>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentList: state.shoppingList.currentList,
});

const mapDispatchToProps = dispatch => ({
  addCategory: (category, currentList) =>
    dispatch(addCategory(category, currentList)),
  deleteCategory: (category, currentList) =>
    dispatch(deleteCategory(category, currentList)),
});

CategoryEditor.propTypes = {
  addCategory: PropTypes.func.isRequired,
  deleteCategory: PropTypes.func.isRequired,
  currentList: PropTypes.object.isRequired,
  onDone: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CategoryEditor);
