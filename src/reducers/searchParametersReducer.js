const searchParametersReducer = (state, action) => {
  switch (action.type){
    case 'CLEAR_SEARCH_PARAMETERS':
      return {

        }
    case 'SET_SEARCH_PARAMETERS':
      return {
        ...action.searchParameters
        }
    default:
      return state
    // case 'START_EXPRESSIONS_FETCH':
    //     return {
    //       ...state,
    //       expressions: []
    //     }
    // case 'COMPLETE_EXPRESSIONS_FETCH':
    //   return {
    //     ...state,
    //     expressions: action.expressions
    //   }
  //   case 'START_QUOTATION_AUTHORS_FETCH':
  //       return {
  //         ...state,
  //         quotationAuthors: []
  //       }
  //   case 'COMPLETE_QUOTATION_AUTHORS_FETCH':
  //     return {
  //       ...state,
  //       quotationAuthors: action.authors
  //     }
  //   case 'START_EXPRESSION_AUTHORS_FETCH':
  //       return {
  //         ...state,
  //         expressionAuthors: []
  //       }
  //   case 'COMPLETE_EXPRESSION_AUTHORS_FETCH':
  //     return {
  //       ...state,
  //       expressionAuthors: action.authors
  //     }
  //   case 'START_QUOTATION_WORKS_LIST_FETCH':
  //       return {
  //         ...state,
  //         quotationWorksList: []
  //       }
  //   case 'COMPLETE_QUOTATION_WORKS_LIST_FETCH':
  //     return {
  //       ...state,
  //       quotationWorksList: action.quotationWorksList
  //     }
  //   case 'START_QUOTATION_WORK_PARTS_FETCH':
  //     return {
  //       ...state,
  //       quotationWorkParts: []
  //     }
  //   case 'COMPLETE_QUOTATION_WORK_PARTS_FETCH':
  //     return {
  //       ...state,
  //       quotationWorkParts: action.parts
  //     }
  //   case 'START_EXPRESSION_PARTS_FETCH':
  //     return {
  //       ...state,
  //       expressionParts: []
  //     }
  //   case 'COMPLETE_EXPRESSION_PARTS_FETCH':
  //     return {
  //       ...state,
  //       expressionParts: action.parts
  //     }
  //   case 'START_EXPRESSION_TYPE_FETCH':
  //       return {
  //         ...state,
  //         expressionTypes: []
  //       }
  //   case 'COMPLETE_EXPRESSION_TYPE_FETCH':
  //     return {
  //       ...state,
  //       expressionTypes: action.expressionTypes
  //     }
  //   case 'START_QUOTATION_EXPRESSION_TYPE_FETCH':
  //       return {
  //         ...state,
  //         quotationExpressionTypes: []
  //       }
  //   case 'COMPLETE_QUOTATION_EXPRESSION_TYPE_FETCH':
  //     return {
  //       ...state,
  //       quotationExpressionTypes: action.quotationExpressionTypes
  //     }
  //   case 'START_WORK_GROUPS_FETCH':
  //       return {
  //         ...state,
  //         workGroups: []
  //       }
  //   case 'COMPLETE_WORK_GROUPS_FETCH':
  //     return {
  //       ...state,
  //       workGroups: action.workGroups
  //     }
  //   case 'START_AUTHOR_TYPES_FETCH':
  //       return {
  //         ...state,
  //         authorTypes: []
  //       }
  //   case 'COMPLETE_AUTHOR_TYPES_FETCH':
  //     return {
  //       ...state,
  //       authorTypes: action.authorTypes
  //     }
  //   default:
  //     return state
  // };
  }
}

export {searchParametersReducer as default}
