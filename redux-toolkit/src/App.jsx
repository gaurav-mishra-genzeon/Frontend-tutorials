import { useDispatch, useSelector } from 'react-redux'
import './App.css'
import { decrement, increment } from './counterSlice'


function App() {
  const dispatch= useDispatch()
  const count= useSelector(store=>store.counter.value)

  const incrementFunc=()=>{
    dispatch(increment())
  }

  const decrementFunc=()=>{
    dispatch(decrement())
  }
  
  return (
    <>
     <h2>Counter App</h2>
     <button onClick={incrementFunc} >Add</button>
     <h1>{count}</h1>
     <button disabled={count===0} onClick={decrementFunc}>Decrease</button>
    </>
  )
}

export default App
