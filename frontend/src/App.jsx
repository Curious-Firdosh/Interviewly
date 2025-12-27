
import { SignInButton, SignOutButton, UserButton } from '@clerk/clerk-react'


function App() {
  

  return (
    <>
        <h1>Welcome To The App</h1>

    
      <SignInButton mode="modal" />
  


      <UserButton />
      <SignOutButton />
 
    </>
  )
}

export default App
