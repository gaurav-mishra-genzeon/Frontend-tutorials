Created Store by importing configureStore from RTK;
Provide my store to the app <Provider store={store}></Provider>, import from React-Redux
Create a Slice- createSlice from RTK
createSlice needs name, initialState and reducers(which is an object and will contain action and a function which will take state and action as the argument)
You wont have to return anything, just directly modify your state
exporting reducers is tricky- export default cartSlice.reducer
export const { increment, decrement, incrementByAmount } = counterSlice.actions is how you export actions
Put the slice into the store- {reducer:{cart:cartSlice}} all the reducers will come into this reducer object. 
 