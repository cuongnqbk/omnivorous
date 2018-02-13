import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../store/actions/';

import RecipeItem from '../../components/RecipeList/RecipeItem/RecipeItem';
import Button from '../../components/UI/Button/Button';

import classes from './RecipeList.css';

class RecipeList extends Component {
    render() {
        const recipes = this.props.recipes.map(recipe => <RecipeItem edit={()=> { this.props.onSelectRecipe(recipe); this.props.setEditMode(true) }} clicked={() => { this.props.onSelectRecipe(recipe); this.props.setEditMode(false);}} key={recipe._id} title={recipe.title} />);
        return (
            <div className={classes.ListBox}>
                <div className={classes.ListHeader}>
                    <h2 className={classes.ListHeaderText}>My Recipes</h2>
                </div>
                <ul className={classes.RecipeList}>
                    {recipes}
                    <Button buttonType="Success" clicked={() => { this.props.addNewRecipe(); this.props.setEditMode(true)}}>Add Recipe</Button>
                </ul>
            </div>  );    

    }
    
};

const mapStateToProps = state => {
    return {
        recipes: state.recipes  
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onSelectRecipe: (recipe) => dispatch(actions.displayRecipe(recipe)),
        addNewRecipe: () => dispatch(actions.newRecipe())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RecipeList);