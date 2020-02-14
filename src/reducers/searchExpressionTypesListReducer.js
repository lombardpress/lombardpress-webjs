const searchExpressionTypesListReducer = (state, action) => {
  if (action){
    switch (action.type){
      case 'START_EXPRESSION_TYPES_LIST_FETCH':
          return {

          }
      case 'COMPLETE_EXPRESSION_TYPES_LIST_FETCH':
        return [...action.expressionTypes]
      default:
        return state
    }
  }
}

export {searchExpressionTypesListReducer as default}
