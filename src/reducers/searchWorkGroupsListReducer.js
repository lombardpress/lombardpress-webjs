const searchWorkGroupsListReducer = (state, action) => {
  if (action){
    switch (action.type){
      case 'START_WORK_GROUPS_LIST_FETCH':
          return {

          }
      case 'COMPLETE_WORK_GROUPS_LIST_FETCH':
        return [...action.workGroups]

    }
  }
}

export {searchWorkGroupsListReducer as default}
