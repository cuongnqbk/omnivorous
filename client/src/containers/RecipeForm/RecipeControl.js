import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import RecipeForm from '../../components/Recipe/RecipeForm/RecipeForm';
import Modal from '../../components/UI/Modal/Modal';
import RecipeImport from '../../components/Recipe/RecipeImport/recipeImport';
import classes from './RecipeControl.css';
import * as actions from '../../store/actions';
import Wrapper from '../../hoc/Wrapper/Wrapper';

class RecipeControl extends Component {
    state = {
        showImportModal: false,
        importURL: '',
    }

    handleSubmit = values => {
    if (this.props.currentRecipe) {
            this.props.onEditRecipe(this.props.user, this.props.currentRecipe._id, values);
            this.props.setEditMode(false);
        } else {
            this.props.onAddRecipe(this.props.user, values);
            this.props.setEditMode(false);
        }
    }

    handleDelete = (recipeId) => {
        let deleteContinue = window.confirm(`Are you sure you want to delete "${this.props.currentRecipe.name}"?`);
        if (deleteContinue) {
            this.props.onDeleteRecipe(this.props.user, recipeId);
        }
    }

    inputChangedHandler = (e) => {
        this.setState({ importURL: e.target.value})
    }

    initImportHandler = () => {
        this.setState({showImportModal: true});
    }

    importCancelHandler = () => {
        this.setState({showImportModal: false });
    }

    importRecipeHandler = (e) => {
        e.preventDefault();

        axios.post(`/api/${this.props.user.id}/recipes/import`, { url: this.state.importURL}).then( res => {
            console.log(res.data);
        });

    }

    render() {
        return (
            <Wrapper>
                <Modal 
                    show={this.state.showImportModal} 
                    modalClosed={this.importCancelHandler}
                ><RecipeImport 
                    changed={this.inputChangedHandler}
                    url={this.state.importURL}
                    import={this.importRecipeHandler}
                    />
                </Modal>
                <div className={classes.FormContainer}>
                    <RecipeForm initialValues={this.props.currentRecipe} onSubmit={this.handleSubmit} onDelete={this.handleDelete} onImportInit={this.initImportHandler} />
                </div>
            </Wrapper>
        );
    }
}

const mapStateToProps = state => {
    return {
        currentRecipe: state.recipe.currentRecipe,
        user: state.auth.userId,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAddRecipe: (user, recipe) => dispatch(actions.addRecipe(user, recipe)),
        onEditRecipe: (user, id, recipe) => dispatch(actions.updateRecipe(user, id, recipe)),
        onDeleteRecipe: (user, id) => dispatch(actions.destroyRecipe(user, id))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RecipeControl);