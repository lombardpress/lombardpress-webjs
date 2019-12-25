const searchAuthorsListReducer = (state, action) => {
  if (action){
    switch (action.type){
      case 'START_AUTHORS_FETCH':
          return {

          }
      case 'COMPLETE_AUTHORS_FETCH':
        return [...action.authors]

    }
  }
}

export {searchAuthorsListReducer as default}
