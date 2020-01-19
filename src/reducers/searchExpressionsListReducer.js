const searchExpressionsListReducer = (state, action) => {
  if (action){
    switch (action.type){
      case 'START_EXPRESSIONS_FETCH':
          return {

          }
      case 'COMPLETE_EXPRESSIONS_FETCH':
        return [...action.expressions]
      default:
        return state
    }
  }
}

export {searchExpressionsListReducer as default}
